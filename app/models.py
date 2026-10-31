"""ORM models mirroring the MySQL schema in sql/schema.sql."""
from sqlalchemy import (
    Column, String, Integer, BigInteger, Numeric, Date, DateTime, Boolean, Text, JSON,
    ForeignKey, UniqueConstraint, CheckConstraint, func,
)
from sqlalchemy.orm import relationship

from .database import Base

BigInt = BigInteger().with_variant(Integer, "sqlite")


class User(Base):
    __tablename__ = "users"
    user_id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(10), nullable=False)
    cash_balance = Column(Numeric(14, 2), nullable=False, default=100000)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    __table_args__ = (
        CheckConstraint("role IN ('admin','user')", name="ck_users_role"),
        CheckConstraint("cash_balance >= 0", name="ck_users_cash"),
    )


class Stock(Base):
    __tablename__ = "stocks"
    stock_id = Column(Integer, primary_key=True, autoincrement=True)
    ticker = Column(String(15), unique=True, nullable=False)
    company_name = Column(String(150), nullable=False)
    sector = Column(String(50))
    exchange = Column(String(10), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    __table_args__ = (CheckConstraint("exchange IN ('NSE','BSE')", name="ck_stocks_exchange"),)


class PriceHistory(Base):
    __tablename__ = "price_history"
    price_id = Column(BigInt, primary_key=True, autoincrement=True)
    stock_id = Column(Integer, ForeignKey("stocks.stock_id", ondelete="CASCADE"), nullable=False)
    trade_date = Column(Date, nullable=False)
    open_price = Column(Numeric(12, 2), nullable=False)
    high_price = Column(Numeric(12, 2), nullable=False)
    low_price = Column(Numeric(12, 2), nullable=False)
    close_price = Column(Numeric(12, 2), nullable=False)
    volume = Column(BigInteger, nullable=False)
    __table_args__ = (
        UniqueConstraint("stock_id", "trade_date", name="uq_price_stock_date"),
        CheckConstraint("volume >= 0", name="ck_price_volume"),
    )


class Holding(Base):
    __tablename__ = "holdings"
    holding_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    stock_id = Column(Integer, ForeignKey("stocks.stock_id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    avg_price = Column(Numeric(12, 2), nullable=False, default=0)
    stock = relationship("Stock")
    __table_args__ = (
        UniqueConstraint("user_id", "stock_id", name="uq_holdings_user_stock"),
        CheckConstraint("quantity >= 0", name="ck_holdings_qty"),
        CheckConstraint("avg_price >= 0", name="ck_holdings_avg"),
    )


class Transaction(Base):
    __tablename__ = "transactions"
    txn_id = Column(BigInt, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    stock_id = Column(Integer, ForeignKey("stocks.stock_id", ondelete="CASCADE"), nullable=False)
    txn_type = Column(String(4), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    txn_time = Column(DateTime, nullable=False, server_default=func.now())
    stock = relationship("Stock")
    __table_args__ = (
        CheckConstraint("txn_type IN ('BUY','SELL')", name="ck_txn_type"),
        CheckConstraint("quantity > 0", name="ck_txn_qty"),
        CheckConstraint("price > 0", name="ck_txn_price"),
    )


class Watchlist(Base):
    __tablename__ = "watchlists"
    watchlist_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False, default="My Watchlist")
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    items = relationship("WatchlistItem", cascade="all, delete-orphan")


class WatchlistItem(Base):
    __tablename__ = "watchlist_items"
    watchlist_id = Column(Integer, ForeignKey("watchlists.watchlist_id", ondelete="CASCADE"), primary_key=True)
    stock_id = Column(Integer, ForeignKey("stocks.stock_id", ondelete="CASCADE"), primary_key=True)
    added_at = Column(DateTime, nullable=False, server_default=func.now())
    stock = relationship("Stock")


class Alert(Base):
    __tablename__ = "alerts"
    alert_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    stock_id = Column(Integer, ForeignKey("stocks.stock_id", ondelete="CASCADE"), nullable=False)
    condition_type = Column(String(6), nullable=False)
    target_price = Column(Numeric(12, 2), nullable=False)
    is_triggered = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    stock = relationship("Stock")
    __table_args__ = (
        CheckConstraint("condition_type IN ('ABOVE','BELOW')", name="ck_alert_cond"),
        CheckConstraint("target_price > 0", name="ck_alert_target"),
    )


class NewsArticle(Base):
    __tablename__ = "news_articles"
    article_id = Column(Integer, primary_key=True, autoincrement=True)
    stock_id = Column(Integer, ForeignKey("stocks.stock_id", ondelete="SET NULL"))
    title = Column(String(300), nullable=False)
    source = Column(String(100))
    published_at = Column(DateTime, nullable=False)
    content = Column(Text, nullable=False)
    embedding = Column(JSON)
    stock = relationship("Stock")
