"""Buy/sell business logic.

Everything happens inside one DB transaction. The user row (cash) and the holding row are locked
with SELECT ... FOR UPDATE so two concurrent trades can't overspend cash or oversell shares.
"""
from decimal import Decimal, ROUND_HALF_UP

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Holding, Stock, Transaction, User
from .alerts import check_alerts
from .pricing import latest_close

CENT = Decimal("0.01")


def execute_trade(db: Session, user_id: str, stock_id: int, txn_type: str, qty: int):
    stock = db.get(Stock, stock_id)
    if not stock:
        raise HTTPException(404, "Stock not found")

    price = latest_close(db, stock_id)
    if price is None:
        raise HTTPException(400, f"No price data available for {stock.ticker}")

    user = db.execute(select(User).where(User.user_id == user_id).with_for_update()).scalar_one()
    holding = db.execute(
        select(Holding).where(Holding.user_id == user_id, Holding.stock_id == stock_id).with_for_update()
    ).scalar_one_or_none()

    total = (price * qty).quantize(CENT, ROUND_HALF_UP)

    if txn_type == "BUY":
        if Decimal(user.cash_balance) < total:
            raise HTTPException(
                400, f"Insufficient funds: need {total}, available {Decimal(user.cash_balance)}"
            )
        user.cash_balance = Decimal(user.cash_balance) - total
        if holding is None:
            holding = Holding(user_id=user_id, stock_id=stock_id, quantity=qty, avg_price=price)
            db.add(holding)
        else:
            new_qty = holding.quantity + qty
            holding.avg_price = ((Decimal(holding.avg_price) * holding.quantity + total) / new_qty).quantize(
                CENT, ROUND_HALF_UP
            )
            holding.quantity = new_qty
    else:  # SELL
        owned = holding.quantity if holding else 0
        if qty > owned:
            raise HTTPException(400, f"Cannot sell {qty} shares of {stock.ticker}: you own {owned}")
        user.cash_balance = Decimal(user.cash_balance) + total
        holding.quantity -= qty
        if holding.quantity == 0:
            holding.avg_price = Decimal("0")

    txn = Transaction(user_id=user_id, stock_id=stock_id, txn_type=txn_type, quantity=qty, price=price)
    db.add(txn)
    db.flush()

    fired = check_alerts(db, user_id=user_id, stock_id=stock_id)
    db.commit()
    db.refresh(txn)
    return stock, txn, user, [a.alert_id for a in fired]
