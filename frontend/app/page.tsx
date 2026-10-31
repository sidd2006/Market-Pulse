import {
  DollarSign,
  TrendingUp,
  Wallet,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";
import PortfolioChart from "@/components/charts/PortfolioChart";
import { mockTransactions, mockHoldings } from "@/lib/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";

const PORTFOLIO_VALUE = 51240.35;
const TODAYS_PNL = 1490.85;
const TODAYS_PNL_PCT = 2.99;
const CASH_BALANCE = 12450.75;
const ACTIVE_ALERTS = 4;

export default function DashboardPage() {
  const topHoldings = mockHoldings.map((h) => {
    const pnl = (h.currentPrice - h.avgPrice) * h.shares;
    const pnlPct = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
    return { ...h, pnl, pnlPct };
  });

  const recentTx = mockTransactions.slice(0, 5);

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Portfolio Value"
          value={formatCurrency(PORTFOLIO_VALUE)}
          change={8.56}
          changeLabel="this week"
          icon={DollarSign}
          variant="primary"
        />
        <StatsCard
          title="Today's P&L"
          value={`+${formatCurrency(TODAYS_PNL)}`}
          change={TODAYS_PNL_PCT}
          changeLabel="today"
          icon={TrendingUp}
          variant="success"
        />
        <StatsCard
          title="Cash Balance"
          value={formatCurrency(CASH_BALANCE)}
          icon={Wallet}
          variant="secondary"
        />
        <StatsCard
          title="Active Alerts"
          value={String(ACTIVE_ALERTS)}
          icon={Bell}
          variant="danger"
        />
      </div>

      {/* Chart + Top Holdings */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="xl:col-span-2">
          <PortfolioChart />
        </div>

        {/* Top Holdings */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-white font-semibold text-base mb-4">Top Holdings</h3>
          <div className="space-y-3">
            {topHoldings.map((h) => (
              <div key={h.ticker} className="flex items-center justify-between py-2 border-b border-slate-800/60 last:border-0">
                <div>
                  <span className="text-white font-semibold text-sm">{h.ticker}</span>
                  <p className="text-slate-500 text-xs">{h.shares} shares</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-medium">{formatCurrency(h.currentPrice * h.shares)}</p>
                  <div className={`flex items-center justify-end gap-1 text-xs font-medium ${h.pnlPct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {h.pnlPct >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {formatPercent(h.pnlPct)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-base">Recent Transactions</h3>
          <a href="/transactions" className="text-sky-400 text-sm hover:text-sky-300 transition-colors">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-2.5 pr-4 text-slate-400 font-medium">Date</th>
                <th className="text-left py-2.5 pr-4 text-slate-400 font-medium">Type</th>
                <th className="text-left py-2.5 pr-4 text-slate-400 font-medium">Stock</th>
                <th className="text-right py-2.5 pr-4 text-slate-400 font-medium">Shares</th>
                <th className="text-right py-2.5 pr-4 text-slate-400 font-medium">Price</th>
                <th className="text-right py-2.5 text-slate-400 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((tx) => (
                <tr key={tx.id} className="border-b border-slate-800/40 table-row-hover">
                  <td className="py-3 pr-4 text-slate-400">{tx.date}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                      tx.type === "BUY"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-white font-medium">{tx.ticker}</td>
                  <td className="py-3 pr-4 text-slate-300 text-right">{tx.shares}</td>
                  <td className="py-3 pr-4 text-slate-300 text-right">{formatCurrency(tx.price)}</td>
                  <td className="py-3 text-right text-white font-semibold">{formatCurrency(tx.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
