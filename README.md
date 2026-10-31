# 📈 MarketPulse

### Stock Watchlist & Portfolio Management Desk with SQL & Vector Search

MarketPulse is a full-stack stock watchlist, trading desk, and portfolio management system featuring semantic AI news search and automated price alert monitoring.

---

## 🚀 1-Click Launch (Unified Desktop Web App)

Double-click `run.bat` or run in PowerShell:
```powershell
.\run.ps1
```
This automatically verifies/seeds the database, opens your browser to **http://localhost:8000**, and starts the backend server!

### Manual Setup & Run
```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Configure environment (optional, defaults to SQLite)
cp .env.example .env

# 3. Seed demo accounts & market data
python seed.py

# 4. Start the server
uvicorn app.main:app --reload --port 8000
```

- **Web UI & Trading Terminal**: [http://localhost:8000](http://localhost:8000)
- **Interactive API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Run Tests**: `pytest`

### Pre-configured Demo Logins:
- **Demo User**: `demo@marketpulse.com` / `password123` (₹1,00,000 cash balance)
- **Admin**: `admin@marketpulse.com` / `password123`
*(Or click the 1-click login buttons in the web UI)*

---

## 🖥️ Next.js Frontend Setup (Optional)

If running the Next.js standalone dashboard:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the Next.js dashboard.

---

## ✨ Features

- **Stock Watchlists** — Organize and track stocks of interest across named lists with 1-click add/remove.
- **Portfolio Management** — Monitor holdings, cash balance, and dynamically recomputed weighted average purchase prices.
- **Order Execution & Trading Desk** — Atomic buy/sell order placement with cash and share availability validation.
- **Historical Price Charts** — Interactive Chart.js / Recharts price trend visualization with 7D, 30D, and 90D timeline selections.
- **Automated Price Alerts** — Define target prices and above/below conditions evaluated upon trade execution and scheduled check.
- **Semantic News Search** — Vector embeddings (using cosine similarity) to retrieve relevant financial news based on contextual meaning rather than exact keywords.
- **Database Integrity** — Foreign keys, check constraints, unique constraints, and transaction locking (`SELECT ... FOR UPDATE`).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | FastAPI (Python 3.12+ / 3.13) |
| **Integrated Web UI** | Single-Page Application (HTML5, Tailwind CSS, Chart.js, Lucide Icons) |
| **Alternative Frontend** | Next.js 14 (App Router, TypeScript, Recharts, Tailwind CSS) |
| **Database** | SQLite (default zero-config) / MySQL 8.x (via SQLAlchemy 2.0 ORM & PyMySQL) |
| **News Vector Embeddings** | `sentence-transformers` (`all-MiniLM-L6-v2`, 384-dim) with high-speed hashed bag-of-words fallback |
| **Authentication** | JWT (JSON Web Tokens) with bcrypt password hashing |
| **Testing** | PyTest with AnyIO |

---

## 🗂️ Repository Structure

```
Market-Pulse/
├── app/                    # FastAPI backend application
│   ├── static/             # Integrated Web Terminal UI (index.html)
│   ├── routers/            # API endpoints (auth, stocks, trading, alerts, news)
│   ├── services/           # Business logic (pricing, trading, embeddings, alerts)
│   ├── models.py           # SQLAlchemy ORM models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # DB connection & session engine
│   └── main.py             # FastAPI entrypoint & router mounts
├── database/               # SQL scripts (schema.sql, seed.sql)
├── frontend/               # Next.js 14 dashboard (TypeScript, Tailwind, Recharts)
├── sql/                    # Core MySQL schema definitions
├── tests/                  # PyTest test suite (conftest.py, test_api.py)
├── .env.example            # Environment variables template
├── pytest.ini              # PyTest configuration
├── requirements.txt        # Python backend dependencies
├── run.bat                 # Windows 1-click batch launcher
├── run.ps1                 # Windows 1-click PowerShell launcher
├── seed.py                 # Python database seeding script
└── README.md
```

---

## 📊 Database Schema

The database contains the following tables:

| Table | Purpose |
|---|---|
| `users` | User accounts, roles, and cash balances |
| `stocks` | Stock information and ticker symbols |
| `price_history` | Historical daily stock prices (OHLC) and volume |
| `holdings` | User stock holdings and weighted-average prices |
| `transactions` | Buy and sell transaction records |
| `watchlists` | User-created named watchlists |
| `watchlist_items` | Stocks associated with each watchlist |
| `alerts` | Stock price alert conditions (above/below) |
| `news_articles` | Financial news articles and vector embeddings |

---

## 🔌 API Endpoints

| Area | Endpoint | Description |
|---|---|---|
| **Auth** | `POST /auth/register` | Register a new user |
| | `POST /auth/login` | Form-encoded login returning JWT token |
| | `GET /auth/me` | Fetch active user profile & cash balance |
| **Stocks** | `GET /stocks` | Search & list stocks with filters (`q`, `sector`, `exchange`) |
| | `GET /stocks/{id}` | Stock details & latest close |
| | `GET /stocks/{id}/prices?days=` | Historical OHLC price data |
| | `POST /stocks` | Create new stock (Admin only) |
| | `DELETE /stocks/{id}` | Remove stock (Admin only) |
| **Trading** | `POST /transactions` | Execute BUY or SELL order |
| | `GET /transactions` | Fetch user transaction history |
| | `GET /portfolio` | Get current holdings, P&L, and portfolio value |
| **Watchlists** | `GET /watchlists` | Get user watchlists & items |
| | `POST /watchlists/{id}/items` | Add stock to watchlist |
| | `DELETE /watchlists/{id}/items/{stock_id}` | Remove stock from watchlist |
| **Alerts** | `GET /alerts` | List user price alerts |
| | `POST /alerts` | Create new price alert (`ABOVE` / `BELOW`) |
| | `POST /alerts/check` | Evaluate active alerts against latest close prices |
| | `DELETE /alerts/{id}` | Delete price alert |
| **News** | `GET /news` | List recent financial news |
| | `POST /news/search` | Semantic vector search by natural query |
| | `GET /news/search-backend` | Active embedding engine information |

---

## 👥 Contributors

- **Siddhant Khurdiya** — [@sidd2006](https://github.com/sidd2006)  
  *Backend Lead — FastAPI, MySQL schema, SQL queries, semantic news search, terminal desk*

- **Srijan Akshit** — [@akshitsrijan001](https://github.com/akshitsrijan001)  
  *Frontend Lead — Next.js dashboard, UI/UX, API integration, project coordination*

---

## 🎓 Project Information

Developed as part of the **Database Management Systems (DBMS) Lab** project at **PES University**.
