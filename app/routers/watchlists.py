from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..auth import current_user
from ..database import get_db
from ..models import Stock, User, Watchlist, WatchlistItem
from ..schemas import WatchlistAddIn, WatchlistIn, WatchlistItemOut, WatchlistOut
from ..services.pricing import price_and_change

router = APIRouter(prefix="/watchlists", tags=["watchlists"])


def _owned(db: Session, wid: int, user: User) -> Watchlist:
    w = db.get(Watchlist, wid)
    if not w or w.user_id != user.user_id:
        raise HTTPException(404, "Watchlist not found")
    return w


def _out(db: Session, w: Watchlist) -> WatchlistOut:
    items = []
    for it in sorted(w.items, key=lambda i: i.added_at):
        last, chg = price_and_change(db, it.stock_id)
        items.append(WatchlistItemOut(stock_id=it.stock_id, ticker=it.stock.ticker,
                                      company_name=it.stock.company_name, last_price=last,
                                      change_pct=chg, added_at=it.added_at))
    return WatchlistOut(watchlist_id=w.watchlist_id, name=w.name, created_at=w.created_at, items=items)


@router.get("", response_model=list[WatchlistOut])
def list_watchlists(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.execute(select(Watchlist).where(Watchlist.user_id == user.user_id).order_by(Watchlist.watchlist_id)).scalars()
    return [_out(db, w) for w in rows]


@router.post("", response_model=WatchlistOut, status_code=201)
def create_watchlist(body: WatchlistIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    w = Watchlist(user_id=user.user_id, name=body.name)
    db.add(w)
    db.commit()
    db.refresh(w)
    return _out(db, w)


@router.patch("/{watchlist_id}", response_model=WatchlistOut)
def rename_watchlist(watchlist_id: int, body: WatchlistIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    w = _owned(db, watchlist_id, user)
    w.name = body.name
    db.commit()
    return _out(db, w)


@router.delete("/{watchlist_id}", status_code=204)
def delete_watchlist(watchlist_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    db.delete(_owned(db, watchlist_id, user))
    db.commit()


@router.post("/{watchlist_id}/items", response_model=WatchlistOut, status_code=201)
def add_item(watchlist_id: int, body: WatchlistAddIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    w = _owned(db, watchlist_id, user)
    if not db.get(Stock, body.stock_id):
        raise HTTPException(404, "Stock not found")
    db.add(WatchlistItem(watchlist_id=w.watchlist_id, stock_id=body.stock_id))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Stock already in this watchlist")
    db.refresh(w)
    return _out(db, w)


@router.delete("/{watchlist_id}/items/{stock_id}", status_code=204)
def remove_item(watchlist_id: int, stock_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    w = _owned(db, watchlist_id, user)
    item = db.get(WatchlistItem, (w.watchlist_id, stock_id))
    if not item:
        raise HTTPException(404, "Stock not in this watchlist")
    db.delete(item)
    db.commit()
