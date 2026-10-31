from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import create_token, current_user, hash_password, new_user_id, verify_password
from ..database import get_db
from ..models import User, Watchlist
from ..schemas import RegisterIn, TokenOut, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut, status_code=201)
def register(body: RegisterIn, db: Session = Depends(get_db)):
    email = body.email.lower()
    if db.execute(select(User).where(User.email == email)).scalar_one_or_none():
        raise HTTPException(409, "Email already registered")
    user = User(user_id=new_user_id(), name=body.name, email=email,
                password_hash=hash_password(body.password), role="user")
    db.add(user)
    db.add(Watchlist(user_id=user.user_id, name="My Watchlist"))  # every user starts with one watchlist
    db.commit()
    return TokenOut(access_token=create_token(user.user_id), user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenOut)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Form-encoded: username=<email>&password=<password>."""
    user = db.execute(select(User).where(User.email == form.username.lower())).scalar_one_or_none()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(401, "Incorrect email or password")
    return TokenOut(access_token=create_token(user.user_id), user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(current_user)):
    return user
