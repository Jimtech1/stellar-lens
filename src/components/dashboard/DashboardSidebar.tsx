import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Compass,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardView } from "@/pages/Dashboard";

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const navItems = [
  { id: "overview" as DashboardView, label: "Overview", icon: LayoutDashboard },
  { id: "assets" as DashboardView, label: "Assets", icon: Wallet },
  { id: "bridge" as DashboardView, label: "Bridge", icon: ArrowLeftRight },
  { id: "discover" as DashboardView, label: "Discover", icon: Compass },
];

const bottomNavItems: { id: DashboardView; label: string; icon: typeof BarChart3 }[] = [
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

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
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-lg">Y</span>
          </div>
          {!collapsed && <span className="font-semibold text-foreground">Yielder</span>}
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
