from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import current_user
from ..database import get_db
from ..models import Alert, Stock, User
from ..schemas import AlertIn, AlertOut
from ..services.alerts import check_alerts

router = APIRouter(prefix="/alerts", tags=["alerts"])


def _out(a: Alert) -> AlertOut:
    return AlertOut(alert_id=a.alert_id, stock_id=a.stock_id, ticker=a.stock.ticker,
                    condition_type=a.condition_type, target_price=float(a.target_price),
                    is_triggered=a.is_triggered, created_at=a.created_at)


@router.get("", response_model=list[AlertOut])
def list_alerts(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.execute(select(Alert).where(Alert.user_id == user.user_id).order_by(Alert.alert_id.desc())).scalars()
    return [_out(a) for a in rows]


@router.post("", response_model=AlertOut, status_code=201)
def create_alert(body: AlertIn, user: User = Depends(current_user), db: Session = Depends(get_db)):
    if not db.get(Stock, body.stock_id):
        raise HTTPException(404, "Stock not found")
    a = Alert(user_id=user.user_id, stock_id=body.stock_id, condition_type=body.condition_type,
              target_price=body.target_price)
    db.add(a)
    db.flush()
    check_alerts(db, user_id=user.user_id, stock_id=body.stock_id)  # may already be satisfied
    db.commit()
    db.refresh(a)
    return _out(a)


@router.post("/check", response_model=list[AlertOut])
def run_check(user: User = Depends(current_user), db: Session = Depends(get_db)):
    """Evaluate this user's pending alerts against the latest close; returns the ones that just fired."""
    fired = check_alerts(db, user_id=user.user_id)
    db.commit()
    return [_out(a) for a in fired]


@router.delete("/{alert_id}", status_code=204)
def delete_alert(alert_id: int, user: User = Depends(current_user), db: Session = Depends(get_db)):
    a = db.get(Alert, alert_id)
    if not a or a.user_id != user.user_id:
        raise HTTPException(404, "Alert not found")
    db.delete(a)
    db.commit()
