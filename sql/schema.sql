-- MarketPulse schema (from DBMS lab report) + indexes
CREATE DATABASE IF NOT EXISTS marketpulse;
USE marketpulse;

CREATE TABLE IF NOT EXISTS users (
    user_id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin','user')),
    cash_balance DECIMAL(14,2) NOT NULL DEFAULT 100000.00 CHECK (cash_balance >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stocks (
    stock_id INT PRIMARY KEY AUTO_INCREMENT,
    ticker VARCHAR(15) UNIQUE NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    sector VARCHAR(50),
    exchange VARCHAR(10) NOT NULL CHECK (exchange IN ('NSE','BSE')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_history (
    price_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    stock_id INT NOT NULL,
    trade_date DATE NOT NULL,
    open_price DECIMAL(12,2) NOT NULL,
    high_price DECIMAL(12,2) NOT NULL,
    low_price DECIMAL(12,2) NOT NULL,
    close_price DECIMAL(12,2) NOT NULL,
    volume BIGINT NOT NULL CHECK (volume >= 0),
    UNIQUE (stock_id, trade_date),
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS holdings (
    holding_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    stock_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    avg_price DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (avg_price >= 0),
    UNIQUE (user_id, stock_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    txn_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    stock_id INT NOT NULL,
    txn_type VARCHAR(4) NOT NULL CHECK (txn_type IN ('BUY','SELL')),
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(12,2) NOT NULL CHECK (price > 0),
    txn_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS watchlists (
    watchlist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL DEFAULT 'My Watchlist',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS watchlist_items (
    watchlist_id INT NOT NULL,
    stock_id INT NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (watchlist_id, stock_id),
    FOREIGN KEY (watchlist_id) REFERENCES watchlists(watchlist_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id CHAR(36) NOT NULL,
    stock_id INT NOT NULL,
    condition_type VARCHAR(6) NOT NULL CHECK (condition_type IN ('ABOVE','BELOW')),
    target_price DECIMAL(12,2) NOT NULL CHECK (target_price > 0),
    is_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS news_articles (
    article_id INT PRIMARY KEY AUTO_INCREMENT,
    stock_id INT,
    title VARCHAR(300) NOT NULL,
    source VARCHAR(100),
    published_at TIMESTAMP NOT NULL,
    content TEXT NOT NULL,
    embedding JSON,
    FOREIGN KEY (stock_id) REFERENCES stocks(stock_id) ON DELETE SET NULL
);

-- Performance indexes (skip any your Workbench schema already has; MySQL errors on duplicate index names)
CREATE INDEX idx_holdings_user      ON holdings (user_id);
CREATE INDEX idx_txn_user_time      ON transactions (user_id, txn_time);
CREATE INDEX idx_alerts_stock_state ON alerts (stock_id, is_triggered);
CREATE INDEX idx_news_published     ON news_articles (published_at);
CREATE INDEX idx_price_stock_date   ON price_history (stock_id, trade_date);
