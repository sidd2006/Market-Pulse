-- ============================================================
-- MarketPulse — Seed / Sample Data
-- Run AFTER schema.sql
-- ============================================================
USE marketpulse;

-- ============================================================
-- Users
-- ============================================================
INSERT INTO users (username, email, password_hash, full_name, role, cash_balance)
VALUES
  ('admin',         'admin@marketpulse.io',   '$2b$12$adminHashExample',   'Admin User',        'admin', 50000.00),
  ('srijan_akshit', 'srijan@example.com',      '$2b$12$srijanHashExample',  'Srijan Akshit',     'user',  12500.75),
  ('sidd2006',      'siddhant@example.com',    '$2b$12$siddHashExample',    'Siddhant Khurdiya', 'user',   8320.50);

-- ============================================================
-- Stocks
-- ============================================================
INSERT INTO stocks (ticker, name, exchange, sector, industry)
VALUES
  ('AAPL',     'Apple Inc.',                'NASDAQ', 'Technology',  'Consumer Electronics'),
  ('GOOGL',    'Alphabet Inc.',             'NASDAQ', 'Technology',  'Internet Services'),
  ('MSFT',     'Microsoft Corporation',     'NASDAQ', 'Technology',  'Software'),
  ('TSLA',     'Tesla Inc.',                'NASDAQ', 'Automotive',  'Electric Vehicles'),
  ('AMZN',     'Amazon.com Inc.',           'NASDAQ', 'E-Commerce',  'Internet Retail'),
  ('NVDA',     'NVIDIA Corporation',        'NASDAQ', 'Technology',  'Semiconductors'),
  ('JPM',      'JPMorgan Chase & Co.',      'NYSE',   'Finance',     'Banking'),
  ('RELIANCE', 'Reliance Industries Ltd.',  'NSE',    'Conglomerate','Diversified'),
  ('TCS',      'Tata Consultancy Services', 'NSE',    'Technology',  'IT Services'),
  ('RIVN',     'Rivian Automotive Inc.',    'NASDAQ', 'Automotive',  'Electric Vehicles');

-- ============================================================
-- Price History (recent 7 trading days for a few stocks)
-- ============================================================
INSERT INTO price_history (stock_id, trade_date, open_price, high_price, low_price, close_price, volume)
VALUES
  -- AAPL
  (1, '2026-10-25', 186.10, 188.40, 185.50, 187.20, 51200000),
  (1, '2026-10-26', 187.00, 190.00, 186.80, 189.50, 53400000),
  (1, '2026-10-27', 189.20, 191.00, 188.00, 188.60, 49800000),
  (1, '2026-10-28', 188.50, 190.50, 187.90, 190.10, 52100000),
  (1, '2026-10-29', 190.00, 191.50, 189.20, 189.84, 54231000),
  -- MSFT
  (3, '2026-10-25', 372.00, 376.50, 371.20, 374.80, 17900000),
  (3, '2026-10-26', 374.50, 380.00, 374.00, 378.20, 18800000),
  (3, '2026-10-27', 378.00, 381.00, 377.10, 376.70, 17200000),
  (3, '2026-10-28', 376.50, 380.50, 375.80, 379.00, 18100000),
  (3, '2026-10-29', 379.00, 381.50, 378.00, 378.85, 18234000),
  -- NVDA
  (6, '2026-10-25', 855.00, 870.00, 850.20, 863.10, 40100000),
  (6, '2026-10-26', 862.00, 875.50, 860.00, 872.40, 41300000),
  (6, '2026-10-27', 870.00, 878.00, 865.00, 867.80, 39800000),
  (6, '2026-10-28', 865.00, 880.00, 864.50, 876.20, 42500000),
  (6, '2026-10-29', 876.00, 882.00, 874.00, 875.40, 42156000);

-- ============================================================
-- Holdings (for user srijan_akshit, user_id = 2)
-- ============================================================
INSERT INTO holdings (user_id, stock_id, shares, avg_price)
VALUES
  (2, 1, 50.000000, 165.2000),   -- AAPL
  (2, 3, 20.000000, 310.0000),   -- MSFT
  (2, 6, 15.000000, 620.0000),   -- NVDA
  (2, 5, 30.000000, 155.0000),   -- AMZN
  (2, 4, 10.000000, 280.0000);   -- TSLA

-- ============================================================
-- Transactions (for user srijan_akshit, user_id = 2)
-- ============================================================
INSERT INTO transactions (user_id, stock_id, txn_type, shares, price, notes)
VALUES
  (2, 1, 'BUY',  10.000000, 185.5000, 'Added on dip'),
  (2, 6, 'BUY',   5.000000, 860.0000, 'AI momentum play'),
  (2, 4, 'SELL',  5.000000, 255.0000, 'Partial profit take'),
  (2, 3, 'BUY',   8.000000, 370.0000, NULL),
  (2, 5, 'BUY',  15.000000, 172.0000, NULL),
  (2, 2, 'SELL', 10.000000, 145.0000, 'Rebalancing'),
  (2, 7, 'BUY',  20.000000, 192.0000, 'Defensive pick');

-- ============================================================
-- Watchlists
-- ============================================================
INSERT INTO watchlists (user_id, name, description) VALUES
  (2, 'Tech Giants',   'Top US technology companies'),
  (2, 'Indian Market', 'NSE blue-chip stocks'),
  (2, 'EV Plays',      'Electric vehicle sector');

-- Watchlist items
INSERT INTO watchlist_items (watchlist_id, stock_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 6),    -- Tech Giants: AAPL, GOOGL, MSFT, NVDA
  (2, 8), (2, 9),                     -- Indian Market: RELIANCE, TCS
  (3, 4), (3, 10);                    -- EV Plays: TSLA, RIVN

-- ============================================================
-- Alerts
-- ============================================================
INSERT INTO alerts (user_id, stock_id, `condition`, target_price, is_enabled) VALUES
  (2, 1, 'above', 200.0000, 1),   -- AAPL above $200
  (2, 4, 'below', 230.0000, 1),   -- TSLA below $230
  (2, 6, 'above', 900.0000, 0),   -- NVDA above $900 (disabled)
  (2, 3, 'above', 390.0000, 1);   -- MSFT above $390

-- ============================================================
-- News Articles
-- ============================================================
INSERT INTO news_articles (title, source, author, url, summary, published_at)
VALUES
  (
    'Fed signals potential rate cuts as inflation cools',
    'Reuters', 'James Davison',
    'https://reuters.com/fed-rate-cuts-2026',
    'The Federal Reserve indicated it may begin cutting interest rates in early 2027 as inflation continues its downward trend toward the 2% target.',
    '2026-10-31 09:00:00'
  ),
  (
    'Apple Q4 earnings beat expectations, services revenue soars',
    'Bloomberg', 'Sarah Chen',
    'https://bloomberg.com/apple-q4-2026',
    'Apple reported quarterly EPS of $1.64, beating the $1.58 consensus estimate, driven by record services revenue of $26.3 billion.',
    '2026-10-30 18:00:00'
  ),
  (
    'NVIDIA announces next-gen Blackwell Ultra GPU architecture',
    'TechCrunch', 'Mark Williams',
    'https://techcrunch.com/nvidia-blackwell-ultra',
    'NVIDIA unveiled its Blackwell Ultra GPU architecture targeting AI training workloads, claiming 3x performance improvement over current models.',
    '2026-10-29 14:00:00'
  ),
  (
    'Tesla Cybertruck production ramps up, delivery numbers disappoint',
    'CNBC', 'Aisha Johnson',
    'https://cnbc.com/tesla-cybertruck-q3',
    'Tesla ramped Cybertruck production to 2,000 units per week but missed delivery guidance for Q3, sending shares lower in after-hours trading.',
    '2026-10-28 16:30:00'
  );

-- Link articles to stocks
INSERT INTO article_stocks (article_id, stock_id)
VALUES (2, 1), (3, 6), (4, 4);

