from datetime import date, timedelta

from app.auth import hash_password, new_user_id
from app.models import PriceHistory, Stock, User


def make_stock(db, ticker="TCS", prices=(100.0, 100.0)):
    s = Stock(ticker=ticker, company_name=ticker + " Ltd", sector="IT", exchange="NSE")
    db.add(s)
    db.flush()
    for i, p in enumerate(prices):
        db.add(PriceHistory(stock_id=s.stock_id, trade_date=date.today() - timedelta(days=len(prices) - i),
                            open_price=p, high_price=p, low_price=p, close_price=p, volume=1000))
    db.commit()
    return s


def signup(client, email="a@b.com"):
    r = client.post("/auth/register", json={"name": "A", "email": email, "password": "secret1"})
    assert r.status_code == 201, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_register_login_duplicate(client):
    signup(client)
    assert client.post("/auth/register", json={"name": "A", "email": "a@b.com", "password": "secret1"}).status_code == 409
    assert client.post("/auth/login", data={"username": "a@b.com", "password": "bad"}).status_code == 401
    r = client.post("/auth/login", data={"username": "a@b.com", "password": "secret1"})
    assert r.status_code == 200 and r.json()["user"]["cash_balance"] == 100000


def test_buy_sell_flow_and_avg_price(client, db):
    s = make_stock(db, prices=(100.0, 100.0))
    h = signup(client)
    r = client.post("/transactions", json={"stock_id": s.stock_id, "txn_type": "BUY", "quantity": 10}, headers=h)
    assert r.status_code == 201 and r.json()["cash_balance"] == 99000
    # price moves to 200, buy 10 more -> avg 150
    db.add(PriceHistory(stock_id=s.stock_id, trade_date=date.today(), open_price=200, high_price=200,
                        low_price=200, close_price=200, volume=1))
    db.commit()
    client.post("/transactions", json={"stock_id": s.stock_id, "txn_type": "BUY", "quantity": 10}, headers=h)
    p = client.get("/portfolio", headers=h).json()
    assert p["holdings"][0]["quantity"] == 20 and p["holdings"][0]["avg_price"] == 150
    assert p["total_pnl"] == 1000  # 20 * 200 - 20 * 150
    r = client.post("/transactions", json={"stock_id": s.stock_id, "txn_type": "SELL", "quantity": 20}, headers=h)
    assert r.status_code == 201
    assert client.get("/portfolio", headers=h).json()["holdings"] == []


def test_validation_errors(client, db):
    s = make_stock(db, prices=(1000.0,))
    h = signup(client)
    body = {"stock_id": s.stock_id, "txn_type": "BUY", "quantity": 101}  # 101,000 > 100,000 cash
    assert client.post("/transactions", json=body, headers=h).status_code == 400
    body["txn_type"], body["quantity"] = "SELL", 1  # nothing owned
    assert client.post("/transactions", json=body, headers=h).status_code == 400
    body["quantity"] = 0
    assert client.post("/transactions", json=body, headers=h).status_code == 422
    assert client.post("/transactions", json={**body, "quantity": 1, "stock_id": 999}, headers=h).status_code == 404


def test_alert_triggers_on_creation_and_check(client, db):
    s = make_stock(db, prices=(100.0,))
    h = signup(client)
    a = client.post("/alerts", json={"stock_id": s.stock_id, "condition_type": "ABOVE", "target_price": 90}, headers=h).json()
    assert a["is_triggered"] is True
    a2 = client.post("/alerts", json={"stock_id": s.stock_id, "condition_type": "ABOVE", "target_price": 150}, headers=h).json()
    assert a2["is_triggered"] is False
    db.add(PriceHistory(stock_id=s.stock_id, trade_date=date.today(), open_price=160, high_price=160,
                        low_price=160, close_price=160, volume=1))
    db.commit()
    fired = client.post("/alerts/check", headers=h).json()
    assert [x["alert_id"] for x in fired] == [a2["alert_id"]]


def test_watchlist_crud_and_isolation(client, db):
    s = make_stock(db)
    h1, h2 = signup(client, "u1@x.com"), signup(client, "u2@x.com")
    wl = client.get("/watchlists", headers=h1).json()[0]
    assert client.post(f"/watchlists/{wl['watchlist_id']}/items", json={"stock_id": s.stock_id}, headers=h1).status_code == 201
    assert client.post(f"/watchlists/{wl['watchlist_id']}/items", json={"stock_id": s.stock_id}, headers=h1).status_code == 409
    assert client.post(f"/watchlists/{wl['watchlist_id']}/items", json={"stock_id": s.stock_id}, headers=h2).status_code == 404
    assert client.delete(f"/watchlists/{wl['watchlist_id']}/items/{s.stock_id}", headers=h1).status_code == 204


def test_admin_only_and_news_search(client, db):
    s = make_stock(db)
    h = signup(client)
    assert client.post("/stocks", json={"ticker": "X", "company_name": "X", "exchange": "NSE"}, headers=h).status_code == 403
    db.add(User(user_id=new_user_id(), name="Adm", email="adm@x.com", password_hash=hash_password("pw12345"), role="admin"))
    db.commit()
    tok = client.post("/auth/login", data={"username": "adm@x.com", "password": "pw12345"}).json()["access_token"]
    ha = {"Authorization": f"Bearer {tok}"}
    for title, content in [("RBI hikes repo rate", "Interest rates rise, bank lending costs increase"),
                           ("Monsoon boosts tractor sales", "Rural demand for tractors improves")]:
        assert client.post("/news", json={"title": title, "content": content}, headers=ha).status_code == 201
    res = client.post("/news/search", json={"query": "repo rate hike interest rates", "top_k": 2}, headers=h).json()
    assert res[0]["title"] == "RBI hikes repo rate"
