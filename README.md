# 📈 MarketPulse

### Stock Watchlist & Portfolio Management with SQL and Vector Search

MarketPulse is a stock portfolio and watchlist management system designed to help users track stocks, manage holdings, record transactions, and set price alerts. It also incorporates a news-search concept using embeddings to retrieve relevant financial news based on meaning rather than exact keyword matches.

## ✨ Features

- **Stock Watchlists** — Organize and track stocks.
- **Portfolio Management** — Monitor holdings and average purchase prices.
- **Transaction Tracking** — Record buy and sell transactions.
- **Historical Price Data** — Store daily stock prices and trading volumes.
- **Price Alerts** — Define target prices and above/below conditions.
- **Semantic News Search** — Support meaning-based financial news retrieval using embeddings.
- **Database Integrity** — Enforce primary keys, foreign keys, unique constraints, and check constraints.
- **Data Relationships** — Maintain relationships between users, stocks, holdings, transactions, watchlists, alerts, and news articles.

## 🛠️ Tech Stack

- **Database:** MySQL
- **Database Design:** ER Diagram and Relational Schema
- **Database Tools:** MySQL Workbench
- **Frontend (Planned):** Next.js
- **News Search:** Vector embeddings and semantic search

## 🗄️ Database Schema

The `marketpulse` database contains the following tables:

| Table | Purpose |
|---|---|
| `users` | User accounts, roles, and cash balances |
| `stocks` | Stock information and ticker symbols |
| `price_history` | Historical stock prices and volume |
| `holdings` | User stock holdings and average prices |
| `transactions` | Buy and sell records |
| `watchlists` | User-created watchlists |
| `watchlist_items` | Stocks associated with watchlists |
| `alerts` | Stock price alert conditions |
| `news_articles` | Financial news articles and embeddings |

## ⚙️ Database Setup

1. Install MySQL Server and MySQL Workbench.
2. Clone this repository:

   ```bash
   git clone <your-repository-url>
   cd <your-repository-name>
   ```

3. Open the SQL implementation script in MySQL Workbench.
4. Execute the script to create the `marketpulse` database and its tables.
5. Verify the schema and table definitions in MySQL Workbench.

*Note: The database schema was implemented and verified in MySQL Workbench. PostgreSQL-oriented concepts in the original design are represented using MySQL-compatible equivalents.*

## 👥 Contributors

- **Siddhant Khurdiya** — [@YOUR_GITHUB_USERNAME](https://github.com/YOUR_GITHUB_USERNAME)
- **Srijan Akshit** — [@SRIJAN_GITHUB_USERNAME](https://github.com/SRIJAN_GITHUB_USERNAME)

Replace the placeholder usernames with the actual GitHub usernames.

## 🎓 Project Information

Developed as part of a Database Management Systems (DBMS) Lab project at PES University.

---

⭐ If you find this project interesting, consider starring the repository!
