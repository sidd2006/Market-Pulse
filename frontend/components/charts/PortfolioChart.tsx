"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockPortfolioHistory } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-sm">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export default function PortfolioChart() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white font-semibold text-base">Portfolio Value</h3>
          <p className="text-slate-400 text-xs mt-0.5">7-day performance</p>
        </div>
        <div className="text-right">
          <p className="text-emerald-400 font-bold text-lg">{formatCurrency(51240)}</p>
          <p className="text-emerald-400 text-xs">+8.56% this week</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={mockPortfolioHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            fill="url(#portfolioGradient)"
            dot={false}
            activeDot={{ r: 5, fill: "#0ea5e9", stroke: "#0f172a", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
