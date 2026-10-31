export const mockStocks = [
  { id: 1, ticker: "AAPL", name: "Apple Inc.", price: 189.84, change: 1.24, changePercent: 0.66, volume: 54231000, sector: "Technology" },
  { id: 2, ticker: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: -0.95, changePercent: -0.67, volume: 21054000, sector: "Technology" },
  { id: 3, ticker: "MSFT", name: "Microsoft Corp.", price: 378.85, change: 2.15, changePercent: 0.57, volume: 18234000, sector: "Technology" },
  { id: 4, ticker: "TSLA", name: "Tesla Inc.", price: 248.50, change: -5.20, changePercent: -2.05, volume: 91234000, sector: "Automotive" },
  { id: 5, ticker: "AMZN", name: "Amazon.com Inc.", price: 178.25, change: 3.45, changePercent: 1.97, volume: 34521000, sector: "E-Commerce" },
  { id: 6, ticker: "NVDA", name: "NVIDIA Corp.", price: 875.40, change: 12.30, changePercent: 1.43, volume: 42156000, sector: "Technology" },
  { id: 7, ticker: "JPM", name: "JPMorgan Chase", price: 196.50, change: -1.10, changePercent: -0.56, volume: 8923000, sector: "Finance" },
  { id: 8, ticker: "RELIANCE", name: "Reliance Industries", price: 2945.60, change: 32.15, changePercent: 1.10, volume: 12456000, sector: "Conglomerate" },
];

export const mockHoldings = [
  { stockId: 1, ticker: "AAPL", name: "Apple Inc.", shares: 50, avgPrice: 165.20, currentPrice: 189.84 },
  { stockId: 3, ticker: "MSFT", name: "Microsoft Corp.", shares: 20, avgPrice: 310.00, currentPrice: 378.85 },
  { stockId: 6, ticker: "NVDA", name: "NVIDIA Corp.", shares: 15, avgPrice: 620.00, currentPrice: 875.40 },
  { stockId: 5, ticker: "AMZN", name: "Amazon.com Inc.", shares: 30, avgPrice: 155.00, currentPrice: 178.25 },
  { stockId: 4, ticker: "TSLA", name: "Tesla Inc.", shares: 10, avgPrice: 280.00, currentPrice: 248.50 },
];

export const mockTransactions = [
  { id: 1, date: "2026-10-28", type: "BUY", ticker: "AAPL", shares: 10, price: 185.50, total: 1855.00 },
  { id: 2, date: "2026-10-27", type: "BUY", ticker: "NVDA", shares: 5, price: 860.00, total: 4300.00 },
  { id: 3, date: "2026-10-25", type: "SELL", ticker: "TSLA", shares: 5, price: 255.00, total: 1275.00 },
  { id: 4, date: "2026-10-22", type: "BUY", ticker: "MSFT", shares: 8, price: 370.00, total: 2960.00 },
  { id: 5, date: "2026-10-20", type: "BUY", ticker: "AMZN", shares: 15, price: 172.00, total: 2580.00 },
  { id: 6, date: "2026-10-18", type: "SELL", ticker: "GOOGL", shares: 10, price: 145.00, total: 1450.00 },
  { id: 7, date: "2026-10-15", type: "BUY", ticker: "JPM", shares: 20, price: 192.00, total: 3840.00 },
];

export const mockAlerts = [
  { id: 1, ticker: "AAPL", name: "Apple Inc.", condition: "above", targetPrice: 200.00, currentPrice: 189.84, status: "active", enabled: true },
  { id: 2, ticker: "TSLA", name: "Tesla Inc.", condition: "below", targetPrice: 230.00, currentPrice: 248.50, status: "active", enabled: true },
  { id: 3, ticker: "NVDA", name: "NVIDIA Corp.", condition: "above", targetPrice: 900.00, currentPrice: 875.40, status: "active", enabled: false },
  { id: 4, ticker: "MSFT", name: "Microsoft Corp.", condition: "above", targetPrice: 390.00, currentPrice: 378.85, status: "active", enabled: true },
];

export const mockWatchlists = [
  {
    id: 1, name: "Tech Giants",
    items: [
      { ticker: "AAPL", name: "Apple Inc.", price: 189.84, change: 1.24, changePercent: 0.66, volume: 54231000 },
      { ticker: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: -0.95, changePercent: -0.67, volume: 21054000 },
      { ticker: "MSFT", name: "Microsoft Corp.", price: 378.85, change: 2.15, changePercent: 0.57, volume: 18234000 },
      { ticker: "NVDA", name: "NVIDIA Corp.", price: 875.40, change: 12.30, changePercent: 1.43, volume: 42156000 },
    ]
  },
  {
    id: 2, name: "Indian Market",
    items: [
      { ticker: "RELIANCE", name: "Reliance Industries", price: 2945.60, change: 32.15, changePercent: 1.10, volume: 12456000 },
      { ticker: "TCS", name: "Tata Consultancy Services", price: 3850.20, change: -18.40, changePercent: -0.48, volume: 5230000 },
    ]
  },
  {
    id: 3, name: "EV Plays",
    items: [
      { ticker: "TSLA", name: "Tesla Inc.", price: 248.50, change: -5.20, changePercent: -2.05, volume: 91234000 },
      { ticker: "RIVN", name: "Rivian Automotive", price: 18.35, change: 0.42, changePercent: 2.34, volume: 14500000 },
    ]
  },
];

export const mockPortfolioHistory = [
  { date: "Oct 25", value: 47200 },
  { date: "Oct 26", value: 48100 },
  { date: "Oct 27", value: 47850 },
  { date: "Oct 28", value: 49300 },
  { date: "Oct 29", value: 50100 },
  { date: "Oct 30", value: 49750 },
  { date: "Oct 31", value: 51240 },
];

export const mockNewsArticles = [
  {
    id: 1,
    title: "Fed signals potential rate cuts as inflation cools",
    source: "Reuters",
    date: "2026-10-31",
    summary: "The Federal Reserve indicated it may begin cutting interest rates in early 2027 as inflation continues its downward trend toward the 2% target.",
    relevance: 0.94,
    tags: ["Fed", "Rates", "Inflation"],
  },
  {
    id: 2,
    title: "Apple Q4 earnings beat expectations, services revenue soars",
    source: "Bloomberg",
    date: "2026-10-30",
    summary: "Apple reported quarterly earnings per share of $1.64, beating the $1.58 consensus estimate, driven by record services revenue of $26.3 billion.",
    relevance: 0.91,
    tags: ["AAPL", "Earnings", "Technology"],
  },
  {
    id: 3,
    title: "NVIDIA announces next-gen Blackwell Ultra GPU architecture",
    source: "TechCrunch",
    date: "2026-10-29",
    summary: "NVIDIA unveiled its next-generation Blackwell Ultra GPU architecture targeting AI training workloads, claiming 3x performance improvement over current models.",
    relevance: 0.88,
    tags: ["NVDA", "AI", "GPU"],
  },
  {
    id: 4,
    title: "Tesla Cybertruck production ramps up, delivery numbers disappoint",
    source: "CNBC",
    date: "2026-10-28",
    summary: "Tesla ramped Cybertruck production to 2,000 units per week but missed delivery guidance for Q3, sending shares lower in after-hours trading.",
    relevance: 0.85,
    tags: ["TSLA", "EV", "Production"],
  },
];
