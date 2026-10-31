"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { mockHoldings } from "@/lib/mockData";

const COLORS = ["#0ea5e9", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

const allocationData = mockHoldings.map((h) => ({
  name: h.ticker,
  value: Math.round(h.shares * h.currentPrice),
}));

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-300 text-sm font-medium">{payload[0].name}</p>
        <p className="text-white font-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}

export default function AllocationPieChart() {
  const total = allocationData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4">
        <h3 className="text-white font-semibold text-base">Portfolio Allocation</h3>
        <p className="text-slate-400 text-xs mt-0.5">By holdings value</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={allocationData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {allocationData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span style={{ color: "#94a3b8", fontSize: "12px" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center">
        <p className="text-slate-400 text-xs">Total</p>
        <p className="text-white font-bold text-lg">${total.toLocaleString()}</p>
      </div>
    </div>
  );
}
