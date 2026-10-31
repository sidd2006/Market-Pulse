"use client";

import { useState } from "react";
import { Plus, Bell, BellOff, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { mockAlerts } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

type Alert = {
  id: number;
  ticker: string;
  name: string;
  condition: string;
  targetPrice: number;
  currentPrice: number;
  status: string;
  enabled: boolean;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ticker: "", condition: "above", targetPrice: "" });

  const toggleAlert = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const deleteAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const addAlert = () => {
    if (!form.ticker.trim() || !form.targetPrice) return;
    const newAlert: Alert = {
      id: Date.now(),
      ticker: form.ticker.toUpperCase().trim(),
      name: form.ticker.toUpperCase().trim(),
      condition: form.condition,
      targetPrice: parseFloat(form.targetPrice),
      currentPrice: 0,
      status: "active",
      enabled: true,
    };
    setAlerts((prev) => [...prev, newAlert]);
    setForm({ ticker: "", condition: "above", targetPrice: "" });
    setShowForm(false);
  };

  const activeCount = alerts.filter((a) => a.enabled).length;

  const isTriggered = (alert: Alert) => {
    if (alert.currentPrice === 0) return false;
    return alert.condition === "above"
      ? alert.currentPrice >= alert.targetPrice
      : alert.currentPrice <= alert.targetPrice;
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Total Alerts</p>
          <p className="text-white text-2xl font-bold mt-2">{alerts.length}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Active</p>
          <p className="text-emerald-400 text-2xl font-bold mt-2">{activeCount}</p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-slate-400 text-sm">Disabled</p>
          <p className="text-slate-400 text-2xl font-bold mt-2">{alerts.length - activeCount}</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-base">Price Alerts</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Plus size={16} /> New Alert
          </button>
        </div>

        {/* Inline Create Form */}
        {showForm && (
          <div className="mb-5 p-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <h4 className="text-white text-sm font-semibold mb-3">Create Alert</h4>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[120px]">
                <label className="text-slate-400 text-xs block mb-1">Ticker</label>
                <input
                  type="text"
                  value={form.ticker}
                  onChange={(e) => setForm({ ...form, ticker: e.target.value.toUpperCase() })}
                  placeholder="AAPL"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="text-slate-400 text-xs block mb-1">Condition</label>
                <select
                  value={form.condition}
                  onChange={(e) => setForm({ ...form, condition: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value="above">Price Above</option>
                  <option value="below">Price Below</option>
                </select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="text-slate-400 text-xs block mb-1">Target Price</label>
                <input
                  type="number"
                  value={form.targetPrice}
                  onChange={(e) => setForm({ ...form, targetPrice: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addAlert}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {alerts.map((alert) => {
            const triggered = isTriggered(alert);
            return (
              <div
                key={alert.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  !alert.enabled
                    ? "border-slate-800/50 bg-slate-900/30 opacity-60"
                    : triggered
                    ? "border-yellow-500/30 bg-yellow-500/5"
                    : "border-slate-700/50 bg-slate-800/30"
                }`}
              >
                {/* Ticker */}
                <div className="w-16 flex-shrink-0">
                  <span className="text-white font-bold text-sm bg-slate-800 px-2 py-1 rounded-lg">
                    {alert.ticker}
                  </span>
                </div>

                {/* Condition */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {alert.condition === "above"
                      ? <ChevronUp size={15} className="text-sky-400" />
                      : <ChevronDown size={15} className="text-sky-400" />}
                    <span className="text-slate-300 text-sm">
                      {alert.condition === "above" ? "Price above" : "Price below"}{" "}
                      <span className="text-white font-semibold">
                        {formatCurrency(alert.targetPrice)}
                      </span>
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{alert.name}</p>
                </div>

                {/* Status */}
                <div className="hidden sm:block">
                  {triggered ? (
                    <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-semibold rounded-lg">
                      Triggered
                    </span>
                  ) : alert.enabled ? (
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-lg">
                      Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-slate-700/50 text-slate-500 text-xs font-semibold rounded-lg">
                      Disabled
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      alert.enabled
                        ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                        : "text-slate-500 bg-slate-800 hover:bg-slate-700"
                    }`}
                    title={alert.enabled ? "Disable alert" : "Enable alert"}
                  >
                    {alert.enabled ? <Bell size={15} /> : <BellOff size={15} />}
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}

          {alerts.length === 0 && (
            <div className="text-center py-12">
              <Bell size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No alerts yet. Create one to get notified.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
