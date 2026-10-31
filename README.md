# 📈 MarketPulse

### Stock Watchlist & Portfolio Management with SQL and Vector Search

MarketPulse is a stock portfolio and watchlist management system designed to help users track stocks, manage holdings, record transactions, and set price alerts. It also incorporates a news-search concept using embeddings to retrieve relevant financial news based on meaning rather than exact keyword matches.

## ✨ Features

- **Stock Watchlists** — Organize and track stocks of interest across multiple named lists.
- **Portfolio Management** — Monitor holdings, average purchase prices, and real-time P&L.
- **Transaction Tracking** — Record and filter buy/sell events with full history.
- **Historical Price Data** — Store daily OHLCV stock prices and trading volumes.
- **Price Alerts** — Define target prices with above/below trigger conditions.
- **Semantic News Search** — Meaning-based financial news retrieval using vector embeddings.
- **Database Integrity** — Primary keys, foreign keys, unique constraints, and check constraints throughout.
- **Data Relationships** — Normalized schema linking users, stocks, holdings, transactions, watchlists, alerts, and news.

---

## 🛠️ Tech Stack

| Layer      | Technology                               |
|------------|------------------------------------------|
| Database   | MySQL 8.x                                |
| Backend    | FastAPI (Python)                         |
| Frontend   | Next.js 14 (App Router, TypeScript)      |
| Styling    | Tailwind CSS                             |
| Charts     | Recharts                                 |
| DB Design  | ER Diagram · Relational Schema           |
| DB Tools   | MySQL Workbench                          |
| News Search| Vector embeddings (JSON in MySQL / pgvector in production) |

---

## 🗄️ Database Schema

The `marketpulse` database contains the following tables:

| Table             | Purpose                                             |
|-------------------|-----------------------------------------------------|
| `users`           | User accounts, roles, and cash balances             |
| `stocks`          | Stock information and ticker symbols                |
| `price_history`   | Historical OHLCV stock prices and trading volume    |
| `holdings`        | User stock holdings and weighted-average buy prices |
| `transactions`    | Buy and sell transaction records                    |
| `watchlists`      | User-created named watchlists                       |
| `watchlist_items` | Stocks associated with each watchlist               |
| `alerts`          | Stock price alert conditions (above/below)          |
| `news_articles`   | Financial news articles with JSON embedding vectors |
| `article_stocks`  | Many-to-many: news articles ↔ stocks               |

---

## 🗂️ Repository Structure

```
Market-Pulse/
├── database/
│   ├── schema.sql          # Full DDL — creates all tables and indexes
│   └── seed.sql            # Sample data for development / demo
├── frontend/               # Next.js 14 dashboard
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx              # Dashboard
│   │   ├── portfolio/page.tsx    # Portfolio & Holdings
│   │   ├── watchlist/page.tsx    # Watchlists
│   │   ├── transactions/page.tsx # Transaction History
│   │   ├── alerts/page.tsx       # Price Alerts
│   │   └── news/page.tsx         # Semantic News Search
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── charts/
│   │   │   ├── PortfolioChart.tsx
│   │   │   └── AllocationPieChart.tsx
│   │   └── ui/
│   │       └── StatsCard.tsx
│   ├── lib/
│   │   └── mockData.ts
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── next.config.js
└── README.md
```

---

## ⚙️ Database Setup

1. Install **MySQL Server 8.x** and **MySQL Workbench**.
2. Clone this repository:
   ```bash
   git clone https://github.com/sidd2006/Market-Pulse.git
   cd Market-Pulse
   ```
3. Open **MySQL Workbench** and connect to your local server.
4. Run the schema script:
   ```sql
   SOURCE database/schema.sql;
   ```
5. (Optional) Load sample data:
   ```sql
   SOURCE database/seed.sql;
   ```

> **Note:** The database schema was implemented and verified in MySQL Workbench. The `embedding` column in `news_articles` stores vectors as a JSON array; for a production semantic-search pipeline, migrate to PostgreSQL with `pgvector` or a dedicated vector database.

---

## 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Pages

| Route            | Description                       |
|------------------|-----------------------------------|
| `/`              | Dashboard — portfolio summary     |
| `/portfolio`     | Holdings, allocation chart        |
| `/watchlist`     | Multi-list stock tracker          |
| `/transactions`  | Full buy/sell history with filter |
| `/alerts`        | Price alert management            |
| `/news`          | Semantic news search              |

---

## 👥 Contributors

- **Siddhant Khurdiya** — [@sidd2006](https://github.com/sidd2006)  
  *Backend Lead — FastAPI, MySQL schema, SQL queries, semantic news search*

- **Srijan Akshit** — [@akshitsrijan001](https://github.com/akshitsrijan001)  
  *Frontend Lead — Next.js dashboard, UI/UX, API integration, project coordination*

---

## 🎓 Project Information

Developed as part of a **Database Management Systems (DBMS) Lab** project at **PES University**.

---

⭐ If you find this project interesting, consider starring the repository!
