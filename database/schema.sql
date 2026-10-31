-- ============================================================
-- MarketPulse Database Schema
-- DBMS Lab Project — PES University
-- Contributors: Siddhant Khurdiya, Srijan Akshit
-- ============================================================

CREATE DATABASE IF NOT EXISTS marketpulse;
USE marketpulse;

-- ============================================================
-- Table: users
-- Stores user accounts, roles, and cash balances.
-- ============================================================
CREATE TABLE users (
    user_id      INT           UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username     VARCHAR(50)   NOT NULL UNIQUE,
    email        VARCHAR(100)  NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name    VARCHAR(100),
    role         ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    cash_balance DECIMAL(15, 2) NOT NULL DEFAULT 10000.00
                     CHECK (cash_balance >= 0),
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                     ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: stocks
-- Stores stock information and ticker symbols.
-- ============================================================
CREATE TABLE stocks (
    stock_id    INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ticker      VARCHAR(20)  NOT NULL UNIQUE,
    name        VARCHAR(100) NOT NULL,
    exchange    VARCHAR(20),
    sector      VARCHAR(50),
    industry    VARCHAR(100),
    description TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: price_history
-- Stores historical daily OHLCV data for each stock.
-- ============================================================
CREATE TABLE price_history (
    history_id   BIGINT        UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    stock_id     INT           UNSIGNED NOT NULL,
    trade_date   DATE          NOT NULL,
    open_price   DECIMAL(12,4) NOT NULL CHECK (open_price  > 0),
    high_price   DECIMAL(12,4) NOT NULL CHECK (high_price  > 0),
    low_price    DECIMAL(12,4) NOT NULL CHECK (low_price   > 0),
    close_price  DECIMAL(12,4) NOT NULL CHECK (close_price > 0),
    volume       BIGINT        NOT NULL CHECK (volume >= 0),
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_stock_date (stock_id, trade_date),
    CONSTRAINT fk_ph_stock
        FOREIGN KEY (stock_id) REFERENCES stocks(stock_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- Table: holdings
-- Tracks how many shares a user owns and their average price.
-- ============================================================
CREATE TABLE holdings (
    holding_id  INT            UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT            UNSIGNED NOT NULL,
    stock_id    INT            UNSIGNED NOT NULL,
    shares      DECIMAL(15, 6) NOT NULL DEFAULT 0 CHECK (shares >= 0),
    avg_price   DECIMAL(12, 4) NOT NULL DEFAULT 0 CHECK (avg_price >= 0),
    updated_at  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_stock (user_id, stock_id),
    CONSTRAINT fk_hold_user
        FOREIGN KEY (user_id)  REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_hold_stock
        FOREIGN KEY (stock_id) REFERENCES stocks(stock_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- Table: transactions
-- Records every buy or sell event.
-- ============================================================
CREATE TABLE transactions (
    txn_id       BIGINT         UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      INT            UNSIGNED NOT NULL,
    stock_id     INT            UNSIGNED NOT NULL,
    txn_type     ENUM('BUY','SELL') NOT NULL,
    shares       DECIMAL(15, 6) NOT NULL CHECK (shares > 0),
    price        DECIMAL(12, 4) NOT NULL CHECK (price > 0),
    total_amount DECIMAL(18, 4) GENERATED ALWAYS AS (shares * price) STORED,
    notes        VARCHAR(255),
    created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_txn_user
        FOREIGN KEY (user_id)  REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_txn_stock
        FOREIGN KEY (stock_id) REFERENCES stocks(stock_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- Table: watchlists
-- User-created named lists for organising stocks of interest.
-- ============================================================
CREATE TABLE watchlists (
    watchlist_id INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      INT          UNSIGNED NOT NULL,
    name         VARCHAR(100) NOT NULL,
    description  VARCHAR(255),
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_wl_name (user_id, name),
    CONSTRAINT fk_wl_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- Table: watchlist_items
-- Junction table linking stocks to watchlists.
-- ============================================================
CREATE TABLE watchlist_items (
    item_id      INT       UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    watchlist_id INT       UNSIGNED NOT NULL,
    stock_id     INT       UNSIGNED NOT NULL,
    added_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_wl_stock (watchlist_id, stock_id),
    CONSTRAINT fk_wli_watchlist
        FOREIGN KEY (watchlist_id) REFERENCES watchlists(watchlist_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_wli_stock
        FOREIGN KEY (stock_id) REFERENCES stocks(stock_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- Table: alerts
-- Price alert conditions set by users.
-- ============================================================
CREATE TABLE alerts (
    alert_id     INT            UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      INT            UNSIGNED NOT NULL,
    stock_id     INT            UNSIGNED NOT NULL,
    condition    ENUM('above','below') NOT NULL,
    target_price DECIMAL(12, 4) NOT NULL CHECK (target_price > 0),
    is_enabled   TINYINT(1)     NOT NULL DEFAULT 1,
    triggered_at TIMESTAMP      NULL DEFAULT NULL,
    created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alrt_user
        FOREIGN KEY (user_id)  REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_alrt_stock
        FOREIGN KEY (stock_id) REFERENCES stocks(stock_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- Table: news_articles
-- Financial news articles with a JSON-encoded embedding vector
-- for semantic similarity search.
-- ============================================================
CREATE TABLE news_articles (
    article_id   BIGINT        UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(300)  NOT NULL,
    source       VARCHAR(100),
    author       VARCHAR(100),
    url          VARCHAR(500)  UNIQUE,
    summary      TEXT,
    content      LONGTEXT,
    published_at TIMESTAMP     NOT NULL,
    -- Stored as a JSON array of FLOAT values (e.g. 1536-dim OpenAI embedding).
    -- For production, use pgvector (PostgreSQL) or a dedicated vector DB.
    embedding    JSON,
    created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Relate articles to the stocks they mention (many-to-many).
CREATE TABLE article_stocks (
    article_id BIGINT UNSIGNED NOT NULL,
    stock_id   INT    UNSIGNED NOT NULL,
    PRIMARY KEY (article_id, stock_id),
    CONSTRAINT fk_as_article
        FOREIGN KEY (article_id) REFERENCES news_articles(article_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_as_stock
        FOREIGN KEY (stock_id)   REFERENCES stocks(stock_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- Indexes for common query patterns
-- ============================================================
CREATE INDEX idx_ph_stock_date    ON price_history (stock_id, trade_date DESC);
CREATE INDEX idx_txn_user_date    ON transactions  (user_id, created_at DESC);
CREATE INDEX idx_alerts_user      ON alerts        (user_id, is_enabled);
CREATE INDEX idx_news_published   ON news_articles (published_at DESC);

