import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Compass,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  History,
  Layers,
  Activity,
  TrendingUp,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardView } from "@/pages/Dashboard";
import { HoloLogo } from "@/components/HoloLogo";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const navItems: { id: DashboardView; label: string; icon: any; disabled?: boolean }[] = [
  { id: "overview" as DashboardView, label: "Overview", icon: LayoutDashboard },
  { id: "assets" as DashboardView, label: "Assets", icon: Wallet },
  { id: "wallets" as DashboardView, label: "Wallets", icon: Layers },
  { id: "bridge" as DashboardView, label: "Bridge", icon: ArrowLeftRight },
  { id: "discover" as DashboardView, label: "Discover", icon: Compass },
  { id: "analytics" as DashboardView, label: "Analytics", icon: BarChart3 },
  { id: "activity" as DashboardView, label: "Activity", icon: Activity },
  { id: "pnl" as DashboardView, label: "Profit & Loss", icon: TrendingUp },
  { id: "smartmoney" as DashboardView, label: "Smart Money", icon: Eye },
  { id: "transactions" as DashboardView, label: "Transactions", icon: History },
  { id: "settings" as DashboardView, label: "Settings", icon: Settings },
];

const bottomNavItems: { id: DashboardView; label: string; icon: typeof BarChart3 }[] = [];

export function DashboardSidebar({ collapsed, onToggle, activeView, onViewChange }: DashboardSidebarProps) {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link to="/">
          <HoloLogo size="md" showText={!collapsed} />
        </Link>
        <button
          onClick={onToggle}
          className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && onViewChange(item.id)}
            disabled={item.disabled}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group",
              activeView === item.id
                ? "bg-primary/10 text-primary font-medium"
                : item.disabled
                  ? "text-muted-foreground/50 cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <span className="text-small flex-1 text-left flex justify-between items-center">
                {item.label}
                {item.disabled && <span className="text-[9px] uppercase tracking-wider opacity-70 border border-border px-1 rounded">Soon</span>}
              </span>
            )}
            {collapsed && item.disabled && (
              <div className="absolute left-14 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                Coming Soon
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-border space-y-1">
        {bottomNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              activeView === item.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-small">{item.label}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}
