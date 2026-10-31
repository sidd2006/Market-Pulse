from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Alert
from .pricing import latest_close


def check_alerts(db: Session, user_id: str | None = None, stock_id: int | None = None) -> list[Alert]:
    """Mark every untriggered alert whose condition is met by the latest close as triggered.

    Returns the alerts that were triggered by this call. Caller commits.
    """
    q = select(Alert).where(Alert.is_triggered.is_(False))
    if user_id:
        q = q.where(Alert.user_id == user_id)
    if stock_id:
        q = q.where(Alert.stock_id == stock_id)

    prices: dict[int, Decimal | None] = {}
    fired: list[Alert] = []
    for a in db.execute(q).scalars().all():
        if a.stock_id not in prices:
            prices[a.stock_id] = latest_close(db, a.stock_id)
        price = prices[a.stock_id]
        if price is None:
            continue
        target = Decimal(a.target_price)
        if (a.condition_type == "ABOVE" and price >= target) or (a.condition_type == "BELOW" and price <= target):
            a.is_triggered = True
            fired.append(a)
    return fired
