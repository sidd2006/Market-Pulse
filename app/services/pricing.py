from decimal import Decimal
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import PriceHistory


def last_two_closes(db: Session, stock_id: int) -> list[Decimal]:
    rows = db.execute(
        select(PriceHistory.close_price)
        .where(PriceHistory.stock_id == stock_id)
        .order_by(PriceHistory.trade_date.desc())
        .limit(2)
    ).scalars().all()
    return [Decimal(r) for r in rows]


def latest_close(db: Session, stock_id: int) -> Optional[Decimal]:
    closes = last_two_closes(db, stock_id)
    return closes[0] if closes else None


def price_and_change(db: Session, stock_id: int) -> tuple[Optional[float], Optional[float]]:
    closes = last_two_closes(db, stock_id)
    if not closes:
        return None, None
    last = float(closes[0])
    if len(closes) < 2 or closes[1] == 0:
        return last, None
    return last, round(float((closes[0] - closes[1]) / closes[1] * 100), 2)
