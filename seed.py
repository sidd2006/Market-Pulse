"""Populate the DB with demo data: admin + demo user, NSE stocks, 60 days of synthetic prices, sample news.

    python seed.py

NOTE: prices are randomly generated for demo purposes, not real market data.
"""
import random
from datetime import date, datetime, timedelta, timezone

from sqlalchemy import select

from app.auth import hash_password, new_user_id
from app.database import Base, SessionLocal, engine
from app.models import NewsArticle, PriceHistory, Stock, User, Watchlist
from app.services import embeddings

STOCKS = [
    ("RELIANCE", "Reliance Industries", "Energy", 2900),
    ("TCS", "Tata Consultancy Services", "IT", 3900),
    ("INFY", "Infosys", "IT", 1550),
    ("HDFCBANK", "HDFC Bank", "Banking", 1650),
    ("ICICIBANK", "ICICI Bank", "Banking", 1150),
    ("SBIN", "State Bank of India", "Banking", 780),
    ("ITC", "ITC Limited", "FMCG", 430),
    ("MARUTI", "Maruti Suzuki", "Auto", 12400),
    ("SUNPHARMA", "Sun Pharmaceutical", "Pharma", 1600),
    ("LT", "Larsen & Toubro", "Infrastructure", 3500),
]

NEWS = [
    ("HDFCBANK", "RBI raises repo rate by 25 bps, lending rates to climb",
     "The central bank increased the benchmark repo rate, which is expected to push up borrowing costs for banks and "
     "squeeze net interest margins for lenders and housing finance companies."),
    ("SBIN", "SBI reports jump in quarterly profit on strong loan growth",
     "State Bank of India posted higher net profit as retail and corporate credit demand stayed healthy and bad loans declined."),
    ("TCS", "TCS wins multi-year cloud migration deal from European retailer",
     "Tata Consultancy Services secured a large deal covering cloud migration and AI-led automation for a European retail group."),
    ("INFY", "Infosys raises FY revenue guidance amid steady demand for digital services",
     "Infosys lifted its annual revenue growth guidance citing strong deal pipeline in generative AI and cost optimisation work."),
    ("RELIANCE", "Crude oil prices surge on supply cuts, refiners face margin pressure",
     "Brent crude rose sharply after producers announced output cuts, raising input costs for oil refiners and petrochemical makers."),
    ("MARUTI", "Auto sales slow as higher interest rates dampen vehicle loan demand",
     "Passenger vehicle demand softened because costlier car loans are discouraging first-time buyers, dealers said."),
    ("SUNPHARMA", "US FDA approves new generic from Sun Pharma",
     "The regulator cleared a generic formulation, opening a sizeable US market opportunity for the drugmaker."),
    ("LT", "Government announces record infrastructure capex, order books swell",
     "A big push on roads, railways and defence spending is expected to boost order inflows for engineering and construction firms."),
    (None, "Rupee weakens against dollar as foreign investors pull out funds",
     "The rupee fell to a fresh low as foreign portfolio investors sold equities, raising concerns for import-heavy sectors."),
]


def main():
    Base.metadata.create_all(engine)  # no-op if you already ran sql/schema.sql
    db = SessionLocal()
    random.seed(42)

    for email, name, role in [("admin@marketpulse.com", "Admin", "admin"), ("demo@marketpulse.com", "Demo User", "user")]:
        if not db.execute(select(User).where(User.email == email)).scalar_one_or_none():
            uid = new_user_id()
            db.add(User(user_id=uid, name=name, email=email, password_hash=hash_password("password123"), role=role))
            db.add(Watchlist(user_id=uid, name="My Watchlist"))
    db.commit()

    ids = {}
    for ticker, company, sector, base in STOCKS:
        s = db.execute(select(Stock).where(Stock.ticker == ticker)).scalar_one_or_none()
        if not s:
            s = Stock(ticker=ticker, company_name=company, sector=sector, exchange="NSE")
            db.add(s)
            db.flush()
            price = float(base)
            for i in range(60, 0, -1):
                d = date.today() - timedelta(days=i)
                if d.weekday() >= 5:
                    continue
                o = price
                c = round(o * (1 + random.uniform(-0.02, 0.02)), 2)
                h = round(max(o, c) * (1 + random.uniform(0, 0.01)), 2)
                l = round(min(o, c) * (1 - random.uniform(0, 0.01)), 2)
                db.add(PriceHistory(stock_id=s.stock_id, trade_date=d, open_price=round(o, 2), high_price=h,
                                    low_price=l, close_price=c, volume=random.randint(500_000, 5_000_000)))
                price = c
        ids[ticker] = s.stock_id
    db.commit()

    if db.query(NewsArticle).count() == 0:
        for k, (ticker, title, content) in enumerate(NEWS):
            db.add(NewsArticle(stock_id=ids.get(ticker), title=title, source="Demo Wire",
                               published_at=datetime.now(timezone.utc) - timedelta(days=k),
                               content=content, embedding=embeddings.embed(embeddings.article_text(title, content))))
        db.commit()

    print(f"Seeded. Embedding backend: {embeddings.backend_name()}")
    print("Admin: admin@marketpulse.com / password123   Demo: demo@marketpulse.com / password123")


if __name__ == "__main__":
    main()
