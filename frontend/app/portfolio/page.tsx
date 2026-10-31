"use client";

import { useState } from "react";
import { Plus, X, ArrowUpRight, ArrowDownRight } from "lucide-react";
import AllocationPieChart from "@/components/charts/AllocationPieChart";
import { mockHoldings } from "@/lib/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";

type ModalMode = "buy" | "sell" | null;

interface ModalState {
  mode: ModalMode;
  ticker: string;
}

export default function PortfolioPage() {
  const [modal, setModal] = useState<ModalState>({ mode: null, ticker: "" });
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState("");

  const holdings = mockHoldings.map((h) => {
    const pnl = (h.currentPrice - h.avgPrice) * h.shares;
    const pnlPct = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
    const marketValue = h.currentPrice * h.shares;
    return { ...h, pnl, pnlPct, marketValue };
  });

  const totalValue = holdings.reduce((s, h) => s + h.marketValue, 0);
  const totalPnl = holdings.reduce((s, h) => s + h.pnl, 0);

  const openModal = (mode: ModalMode, ticker: string) => {
    setModal({ mode, ticker });
    setShares("");
    setPrice("");
  };

  const closeModal = () => setModal({ mode: null, ticker: "" });

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Total Market Value</p>
          <p className="text-white text-2xl font-bold mt-2">{formatCurrency(totalValue)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Total P&amp;L</p>
          <p className={`text-2xl font-bold mt-2 ${totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {totalPnl >= 0 ? "+" : ""}{formatCurrency(totalPnl)}
          </p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Holdings</p>
          <p className="text-white text-2xl font-bold mt-2">{holdings.length} stocks</p>
        </div>
      </div>

      {/* Table + Pie */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Holdings Table */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold text-base">Holdings</h3>
            <button
              onClick={() => openModal("buy", "AAPL")}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <Plus size={16} /> New Trade
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Stock", "Shares", "Avg Price", "Current", "P&L", "P&L%", "Actions"].map((h) => (
                    <th key={h} className={`py-2.5 pr-4 text-slate-400 font-medium ${h === "Stock" ? "text-left" : "text-right"} ${h === "Actions" ? "text-center" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.ticker} className="border-b border-slate-800/40 table-row-hover">
                    <td className="py-3 pr-4">
                      <div>
                        <p className="text-white font-semibold">{h.ticker}</p>
                        <p className="text-slate-500 text-xs">{h.name}</p>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-300 text-right">{h.shares}</td>
                    <td className="py-3 pr-4 text-slate-300 text-right">{formatCurrency(h.avgPrice)}</td>
                    <td className="py-3 pr-4 text-white font-medium text-right">{formatCurrency(h.currentPrice)}</td>
                    <td className={`py-3 pr-4 text-right font-medium ${h.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {h.pnl >= 0 ? "+" : ""}{formatCurrency(h.pnl)}
                    </td>
                    <td className={`py-3 pr-4 text-right font-medium ${h.pnlPct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      <div className="flex items-center justify-end gap-1">
                        {h.pnlPct >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                        {formatPercent(h.pnlPct)}
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal("buy", h.ticker)}
                          className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg hover:bg-emerald-500/20 transition-colors"
                        >
                          Buy
                        </button>
                        <button
                          onClick={() => openModal("sell", h.ticker)}
                          className="px-2.5 py-1 bg-red-500/10 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          Sell
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie Chart */}
        <AllocationPieChart />
      </div>

      {/* Buy/Sell Modal */}
      {modal.mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${modal.mode === "buy" ? "text-emerald-400" : "text-red-400"}`}>
                {modal.mode === "buy" ? "Buy" : "Sell"} {modal.ticker}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm block mb-1.5">Ticker Symbol</label>
                <input
                  type="text"
                  value={modal.ticker}
                  readOnly
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-1.5">Number of Shares</label>
                <input
                  type="number"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm block mb-1.5">Price per Share</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              {shares && price && (
                <div className="bg-slate-800/60 rounded-xl px-4 py-3">
                  <p className="text-slate-400 text-sm">Estimated Total</p>
                  <p className="text-white font-bold text-lg">
                    {formatCurrency(parseFloat(shares) * parseFloat(price))}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={closeModal}
                  className={`flex-1 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors ${
                    modal.mode === "buy"
                      ? "bg-emerald-500 hover:bg-emerald-400"
                      : "bg-red-500 hover:bg-red-400"
                  }`}
                >
                  Confirm {modal.mode === "buy" ? "Buy" : "Sell"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
