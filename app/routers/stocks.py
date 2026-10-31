from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..auth import admin_only, current_user
from ..database import get_db
from ..models import PriceHistory, Stock
from ..schemas import PriceIn, PriceOut, StockIn, StockOut
from ..services.pricing import price_and_change

router = APIRouter(prefix="/stocks", tags=["stocks"], dependencies=[Depends(current_user)])


def _out(db: Session, s: Stock) -> StockOut:
    last, chg = price_and_change(db, s.stock_id)
    return StockOut(stock_id=s.stock_id, ticker=s.ticker, company_name=s.company_name,
                    sector=s.sector, exchange=s.exchange, last_price=last, change_pct=chg)


@router.get("", response_model=list[StockOut])
def list_stocks(q: Optional[str] = None, sector: Optional[str] = None, exchange: Optional[str] = None,
                limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0),
                db: Session = Depends(get_db)):
    stmt = select(Stock).order_by(Stock.ticker)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(Stock.ticker.like(like), Stock.company_name.like(like)))
    if sector:
        stmt = stmt.where(Stock.sector == sector)
    if exchange:
        stmt = stmt.where(Stock.exchange == exchange.upper())
    return [_out(db, s) for s in db.execute(stmt.limit(limit).offset(offset)).scalars()]


@router.get("/{stock_id}", response_model=StockOut)
def get_stock(stock_id: int, db: Session = Depends(get_db)):
    s = db.get(Stock, stock_id)
    if not s:
        raise HTTPException(404, "Stock not found")
    return _out(db, s)


@router.get("/{stock_id}/prices", response_model=list[PriceOut])
def price_history(stock_id: int, days: int = Query(90, ge=1, le=3650), db: Session = Depends(get_db)):
    if not db.get(Stock, stock_id):
        raise HTTPException(404, "Stock not found")
    rows = db.execute(
        select(PriceHistory).where(PriceHistory.stock_id == stock_id)
        .order_by(PriceHistory.trade_date.desc()).limit(days)
    ).scalars().all()
    return list(reversed(rows))  # oldest -> newest, ready for charting


# ---------- admin ----------
@router.post("", response_model=StockOut, status_code=201, dependencies=[Depends(admin_only)])
def create_stock(body: StockIn, db: Session = Depends(get_db)):
    s = Stock(ticker=body.ticker.upper(), company_name=body.company_name, sector=body.sector, exchange=body.exchange)
    db.add(s)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Ticker already exists")
    return _out(db, s)


@router.delete("/{stock_id}", status_code=204, dependencies=[Depends(admin_only)])
def delete_stock(stock_id: int, db: Session = Depends(get_db)):
    s = db.get(Stock, stock_id)
    if not s:
        raise HTTPException(404, "Stock not found")
    db.delete(s)
    db.commit()


@router.post("/{stock_id}/prices", response_model=PriceOut, status_code=201, dependencies=[Depends(admin_only)])
def add_price(stock_id: int, body: PriceIn, db: Session = Depends(get_db)):
    """Add a daily candle. Alerts are NOT evaluated here; call POST /alerts/check or let users trade."""
    if not db.get(Stock, stock_id):
        raise HTTPException(404, "Stock not found")
    if body.high_price < max(body.open_price, body.close_price, body.low_price) or \
       body.low_price > min(body.open_price, body.close_price, body.high_price):
        raise HTTPException(422, "Inconsistent OHLC values")
    p = PriceHistory(stock_id=stock_id, **body.model_dump())
    db.add(p)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "A price already exists for this stock and date")
    return p
