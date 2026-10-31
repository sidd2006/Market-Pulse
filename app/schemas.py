from datetime import date, datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ORM(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ---------- auth ----------
class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class UserOut(ORM):
    user_id: str
    name: str
    email: str
    role: str
    cash_balance: float


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- stocks ----------
class StockIn(BaseModel):
    ticker: str = Field(min_length=1, max_length=15)
    company_name: str = Field(min_length=1, max_length=150)
    sector: Optional[str] = None
    exchange: Literal["NSE", "BSE"]


class StockOut(ORM):
    stock_id: int
    ticker: str
    company_name: str
    sector: Optional[str]
    exchange: str
    last_price: Optional[float] = None
    change_pct: Optional[float] = None


class PriceIn(BaseModel):
    trade_date: date
    open_price: float = Field(gt=0)
    high_price: float = Field(gt=0)
    low_price: float = Field(gt=0)
    close_price: float = Field(gt=0)
    volume: int = Field(ge=0)


class PriceOut(ORM):
    trade_date: date
    open_price: float
    high_price: float
    low_price: float
    close_price: float
    volume: int


# ---------- trading ----------
class TradeIn(BaseModel):
    stock_id: int
    txn_type: Literal["BUY", "SELL"]
    quantity: int = Field(gt=0)


class TransactionOut(BaseModel):
    txn_id: int
    stock_id: int
    ticker: str
    txn_type: str
    quantity: int
    price: float
    txn_time: datetime


class TradeResult(BaseModel):
    transaction: TransactionOut
    cash_balance: float
    triggered_alerts: list[int] = []


class HoldingOut(BaseModel):
    stock_id: int
    ticker: str
    company_name: str
    quantity: int
    avg_price: float
    current_price: Optional[float]
    market_value: float
    invested: float
    pnl: float
    pnl_pct: float


class PortfolioOut(BaseModel):
    cash_balance: float
    holdings_value: float
    total_value: float
    total_pnl: float
    holdings: list[HoldingOut]


# ---------- watchlists ----------
class WatchlistIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class WatchlistItemOut(BaseModel):
    stock_id: int
    ticker: str
    company_name: str
    last_price: Optional[float]
    change_pct: Optional[float]
    added_at: datetime


class WatchlistOut(BaseModel):
    watchlist_id: int
    name: str
    created_at: datetime
    items: list[WatchlistItemOut]


class WatchlistAddIn(BaseModel):
    stock_id: int


# ---------- alerts ----------
class AlertIn(BaseModel):
    stock_id: int
    condition_type: Literal["ABOVE", "BELOW"]
    target_price: float = Field(gt=0)


class AlertOut(BaseModel):
    alert_id: int
    stock_id: int
    ticker: str
    condition_type: str
    target_price: float
    is_triggered: bool
    created_at: datetime


# ---------- news ----------
class NewsIn(BaseModel):
    stock_id: Optional[int] = None
    title: str = Field(min_length=1, max_length=300)
    source: Optional[str] = None
    published_at: Optional[datetime] = None
    content: str = Field(min_length=1)


class NewsOut(BaseModel):
    article_id: int
    stock_id: Optional[int]
    ticker: Optional[str]
    title: str
    source: Optional[str]
    published_at: datetime
    content: str
    score: Optional[float] = None


class NewsSearchIn(BaseModel):
    query: str = Field(min_length=1)
    top_k: int = Field(default=5, ge=1, le=50)
    stock_id: Optional[int] = None
