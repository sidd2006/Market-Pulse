"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Star,
  ArrowLeftRight,
  Bell,
  Newspaper,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/watchlist", label: "Watchlist", icon: Star },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/news", label: "News", icon: Newspaper },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <span className="text-white font-bold text-lg leading-none">MarketPulse</span>
          <p className="text-slate-500 text-xs mt-0.5">Portfolio Manager</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sky-500/15 text-sky-400 border border-sky-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon className={cn("w-4.5 h-4.5", isActive ? "text-sky-400" : "text-slate-500")} size={18} />
              {label}
              {label === "Alerts" && (
                <span className="ml-auto bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full">4</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            U
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">User</p>
            <p className="text-slate-500 text-xs truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
