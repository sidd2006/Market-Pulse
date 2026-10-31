"use client";

import { useState } from "react";
import { Plus, X, ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { mockWatchlists } from "@/lib/mockData";
import { formatCurrency, formatPercent, formatVolume } from "@/lib/utils";

type WatchlistItem = {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
};

type Watchlist = {
  id: number;
  name: string;
  items: WatchlistItem[];
};

export default function WatchlistPage() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>(mockWatchlists);
  const [activeTab, setActiveTab] = useState(mockWatchlists[0].id);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTicker, setNewTicker] = useState("");

  const currentList = watchlists.find((w) => w.id === activeTab);

  const handleRemove = (ticker: string) => {
    setWatchlists((prev) =>
      prev.map((w) =>
        w.id === activeTab
          ? { ...w, items: w.items.filter((item) => item.ticker !== ticker) }
          : w
      )
    );
  };

  const handleAddStock = () => {
    if (!newTicker.trim()) return;
    const ticker = newTicker.toUpperCase().trim();
    setWatchlists((prev) =>
      prev.map((w) =>
        w.id === activeTab
          ? {
              ...w,
              items: [
                ...w.items,
                {
                  ticker,
                  name: ticker,
                  price: Math.random() * 500 + 50,
                  change: (Math.random() - 0.5) * 10,
                  changePercent: (Math.random() - 0.5) * 5,
                  volume: Math.floor(Math.random() * 50000000),
                },
              ],
            }
          : w
      )
    );
    setNewTicker("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Header with tabs */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-base">My Watchlists</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus size={16} /> Add Stock
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {watchlists.map((w) => (
            <button
              key={w.id}
              onClick={() => setActiveTab(w.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === w.id
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {w.name}
              <span className="ml-2 text-xs text-slate-500">({w.items.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stock List */}
      <div className="glass-card rounded-2xl p-5">
        {currentList && currentList.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {["Ticker", "Company", "Price", "Change", "Change %", "Volume", ""].map((h) => (
                    <th
                      key={h}
                      className={`py-2.5 pr-4 text-slate-400 font-medium ${
                        h === "Ticker" || h === "Company" || h === "" ? "text-left" : "text-right"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentList.items.map((item) => (
                  <tr key={item.ticker} className="border-b border-slate-800/40 table-row-hover">
                    <td className="py-3.5 pr-4">
                      <span className="text-white font-bold text-sm bg-slate-800 px-2 py-1 rounded-lg">{item.ticker}</span>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-300 text-sm">{item.name}</td>
                    <td className="py-3.5 pr-4 text-white font-semibold text-right">{formatCurrency(item.price)}</td>
                    <td className={`py-3.5 pr-4 text-right font-medium ${item.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}
                    </td>
                    <td className={`py-3.5 pr-4 text-right ${item.changePercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      <div className="flex items-center justify-end gap-1 font-medium">
                        {item.changePercent >= 0
                          ? <ArrowUpRight size={13} />
                          : <ArrowDownRight size={13} />}
                        {formatPercent(item.changePercent)}
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-400 text-right">{formatVolume(item.volume)}</td>
                    <td className="py-3.5">
                      <button
                        onClick={() => handleRemove(item.ticker)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">No stocks in this watchlist yet.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-3 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Add Stock
            </button>
          </div>
        )}
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white text-lg font-bold">Add Stock to {currentList?.name}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-400 text-sm block mb-1.5">Ticker Symbol</label>
                <input
                  type="text"
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                  placeholder="e.g. AAPL"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sky-500"
                  onKeyDown={(e) => e.key === "Enter" && handleAddStock()}
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStock}
                  className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
