from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import current_user
from ..database import get_db
from ..models import Holding, Transaction, User
from ..schemas import HoldingOut, PortfolioOut, TradeIn, TradeResult, TransactionOut
from ..services.pricing import latest_close
from ..services.trading import execute_trade

router = APIRouter(tags=["trading"])


def _txn_out(t: Transaction, ticker: str) -> TransactionOut:
    return TransactionOut(txn_id=t.txn_id, stock_id=t.stock_id, ticker=ticker, txn_type=t.txn_type,
                          quantity=t.quantity, price=float(t.price), txn_time=t.txn_time)


@router.post("/transactions", response_model=TradeResult, status_code=201)
def trade(body: TradeIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    """Buy or sell at the latest close. Validates cash / share ownership, updates holding + cash atomically."""
    stock, txn, u, fired = execute_trade(db, user.user_id, body.stock_id, body.txn_type, body.quantity)
    return TradeResult(transaction=_txn_out(txn, stock.ticker), cash_balance=float(u.cash_balance),
                       triggered_alerts=fired)


@router.get("/transactions", response_model=list[TransactionOut])
def my_transactions(stock_id: Optional[int] = None, limit: int = Query(50, ge=1, le=500), offset: int = Query(0, ge=0),
                    user: User = Depends(current_user), db: Session = Depends(get_db)):
    q = select(Transaction).where(Transaction.user_id == user.user_id)
    if stock_id:
        q = q.where(Transaction.stock_id == stock_id)
    rows = db.execute(q.order_by(Transaction.txn_time.desc(), Transaction.txn_id.desc()).limit(limit).offset(offset)).scalars()
    return [_txn_out(t, t.stock.ticker) for t in rows]


@router.get("/portfolio", response_model=PortfolioOut)
def portfolio(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.execute(select(Holding).where(Holding.user_id == user.user_id, Holding.quantity > 0)).scalars().all()
    out, total_value, total_invested = [], Decimal(0), Decimal(0)
    for h in rows:
        price = latest_close(db, h.stock_id) or Decimal(h.avg_price)
        value, invested = price * h.quantity, Decimal(h.avg_price) * h.quantity
        pnl = value - invested
        total_value += value
        total_invested += invested
        out.append(HoldingOut(
            stock_id=h.stock_id, ticker=h.stock.ticker, company_name=h.stock.company_name, quantity=h.quantity,
            avg_price=float(h.avg_price), current_price=float(price), market_value=float(value),
            invested=float(invested), pnl=float(pnl),
            pnl_pct=round(float(pnl / invested * 100), 2) if invested else 0.0))
    cash = Decimal(user.cash_balance)
    return PortfolioOut(cash_balance=float(cash), holdings_value=float(total_value),
                        total_value=float(cash + total_value), total_pnl=float(total_value - total_invested),
                        holdings=out)
