import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "danger" | "primary" | "secondary";
}

const variantStyles = {
  default: "text-slate-400 bg-slate-700/30",
  success: "text-emerald-400 bg-emerald-500/10",
  danger: "text-red-400 bg-red-500/10",
  primary: "text-sky-400 bg-sky-500/10",
  secondary: "text-violet-400 bg-violet-500/10",
};

export default function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  variant = "default",
}: StatsCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 hover:border-slate-600/60 transition-colors">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm font-medium">{title}</span>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", variantStyles[variant])}>
          <Icon size={18} />
        </div>
      </div>

      {/* Value */}
      <div>
        <p className="text-white text-2xl font-bold leading-none">{value}</p>

        {/* Change indicator */}
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 mt-2 text-sm",
            isPositive ? "text-emerald-400" : isNegative ? "text-red-400" : "text-slate-400"
          )}>
            {isPositive ? (
              <TrendingUp size={14} />
            ) : isNegative ? (
              <TrendingDown size={14} />
            ) : (
              <Minus size={14} />
            )}
            <span className="font-medium">
              {isPositive ? "+" : ""}
              {change.toFixed(2)}%
            </span>
            {changeLabel && <span className="text-slate-500">{changeLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
