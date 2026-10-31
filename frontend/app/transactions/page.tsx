"use client";

import { useState } from "react";
import { mockTransactions } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

type FilterType = "ALL" | "BUY" | "SELL";

export default function TransactionsPage() {
  const [filter, setFilter] = useState<FilterType>("ALL");

  const filtered = mockTransactions.filter((tx) =>
    filter === "ALL" ? true : tx.type === filter
  );

  const totalBought = mockTransactions
    .filter((t) => t.type === "BUY")
    .reduce((s, t) => s + t.total, 0);

  const totalSold = mockTransactions
    .filter((t) => t.type === "SELL")
    .reduce((s, t) => s + t.total, 0);

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Total Transactions</p>
          <p className="text-white text-2xl font-bold mt-2">{mockTransactions.length}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Total Bought</p>
          <p className="text-emerald-400 text-2xl font-bold mt-2">{formatCurrency(totalBought)}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Total Sold</p>
          <p className="text-red-400 text-2xl font-bold mt-2">{formatCurrency(totalSold)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-base">Transaction History</h3>

          {/* Filters */}
          <div className="flex gap-2">
            {(["ALL", "BUY", "SELL"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  filter === f
                    ? f === "ALL"
                      ? "bg-sky-500/15 text-sky-400 border border-sky-500/25"
                      : f === "BUY"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                      : "bg-red-500/15 text-red-400 border border-red-500/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {["Date", "Type", "Stock", "Shares", "Price", "Total"].map((h) => (
                  <th
                    key={h}
                    className={`py-2.5 pr-4 text-slate-400 font-medium ${
                      ["Date", "Type", "Stock"].includes(h) ? "text-left" : "text-right"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr
                  key={tx.id}
                  className={`border-b border-slate-800/40 table-row-hover ${
                    tx.type === "BUY"
                      ? "hover:bg-emerald-500/5"
                      : "hover:bg-red-500/5"
                  }`}
                >
                  <td className="py-3.5 pr-4 text-slate-400">{tx.date}</td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                        tx.type === "BUY"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-white font-semibold">{tx.ticker}</td>
                  <td className="py-3.5 pr-4 text-slate-300 text-right">{tx.shares}</td>
                  <td className="py-3.5 pr-4 text-slate-300 text-right">{formatCurrency(tx.price)}</td>
                  <td className={`py-3.5 text-right font-bold ${tx.type === "BUY" ? "text-emerald-400" : "text-red-400"}`}>
                    {tx.type === "SELL" ? "-" : "+"}{formatCurrency(tx.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-sm">No {filter} transactions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
