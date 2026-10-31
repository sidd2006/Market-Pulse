"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/portfolio": "Portfolio",
  "/watchlist": "Watchlist",
  "/transactions": "Transactions",
  "/alerts": "Alerts",
  "/news": "News Search",
};

const CASH_BALANCE = 12450.75;

export default function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "MarketPulse";

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 py-3.5">
      {/* Page Title */}
      <div>
        <h1 className="text-white text-xl font-semibold">{title}</h1>
        <p className="text-slate-500 text-xs">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Cash Balance */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 px-3 py-2 rounded-xl">
          <span className="text-slate-400 text-xs">Cash</span>
          <span className="text-emerald-400 font-semibold text-sm">{formatCurrency(CASH_BALANCE)}</span>
        </div>

        {/* Search */}
        <button className="w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
          <Search size={16} />
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer">
          U
        </div>
      </div>
    </header>
  );
}
