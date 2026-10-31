from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import admin_only, current_user
from ..database import get_db
from ..models import NewsArticle, Stock
from ..schemas import NewsIn, NewsOut, NewsSearchIn
from ..services import embeddings

router = APIRouter(prefix="/news", tags=["news"], dependencies=[Depends(current_user)])


def _out(a: NewsArticle, score: Optional[float] = None) -> NewsOut:
    return NewsOut(article_id=a.article_id, stock_id=a.stock_id, ticker=a.stock.ticker if a.stock else None,
                   title=a.title, source=a.source, published_at=a.published_at, content=a.content,
                   score=round(score, 4) if score is not None else None)


@router.get("", response_model=list[NewsOut])
def list_news(stock_id: Optional[int] = None, limit: int = Query(20, ge=1, le=100), offset: int = Query(0, ge=0),
              db: Session = Depends(get_db)):
    q = select(NewsArticle).order_by(NewsArticle.published_at.desc())
    if stock_id:
        q = q.where(NewsArticle.stock_id == stock_id)
    return [_out(a) for a in db.execute(q.limit(limit).offset(offset)).scalars()]


@router.post("/search", response_model=list[NewsOut])
def semantic_search(body: NewsSearchIn, db: Session = Depends(get_db)):
    """Embed the query and rank stored article embeddings by cosine similarity,
    e.g. "stocks impacted by rate hikes" matches a headline about RBI repo rate changes."""
    q = select(NewsArticle.article_id, NewsArticle.embedding)
    if body.stock_id:
        q = q.where(NewsArticle.stock_id == body.stock_id)
    ranked = embeddings.rank(body.query, [(r[0], r[1]) for r in db.execute(q).all()], body.top_k)
    if not ranked:
        return []
    arts = {a.article_id: a for a in db.execute(
        select(NewsArticle).where(NewsArticle.article_id.in_([i for i, _ in ranked]))).scalars()}
    return [_out(arts[i], s) for i, s in ranked if i in arts]


@router.get("/search-backend")
def search_backend():
    """Which embedder is active (handy for the demo / debugging)."""
    return {"backend": embeddings.backend_name(), "dim": embeddings.DIM}


# ---------- admin ----------
@router.post("", response_model=NewsOut, status_code=201, dependencies=[Depends(admin_only)])
def add_article(body: NewsIn, db: Session = Depends(get_db)):
    if body.stock_id and not db.get(Stock, body.stock_id):
        raise HTTPException(404, "Stock not found")
    a = NewsArticle(stock_id=body.stock_id, title=body.title, source=body.source,
                    published_at=body.published_at or datetime.now(timezone.utc), content=body.content,
                    embedding=embeddings.embed(embeddings.article_text(body.title, body.content)))
    db.add(a)
    db.commit()
    db.refresh(a)
    return _out(a)


@router.post("/reindex", dependencies=[Depends(admin_only)])
def reindex(db: Session = Depends(get_db)):
    """Recompute embeddings for every article (use after changing the embedding model)."""
    n = 0
    for a in db.execute(select(NewsArticle)).scalars():
        a.embedding = embeddings.embed(embeddings.article_text(a.title, a.content))
        n += 1
    db.commit()
    return {"reindexed": n, "backend": embeddings.backend_name()}


@router.delete("/{article_id}", status_code=204, dependencies=[Depends(admin_only)])
def delete_article(article_id: int, db: Session = Depends(get_db)):
    a = db.get(NewsArticle, article_id)
    if not a:
        raise HTTPException(404, "Article not found")
    db.delete(a)
    db.commit()
