import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Compass,
  BarChart3,
  Settings,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardView } from "@/pages/Dashboard";
import { HoloLogo } from "@/components/HoloLogo";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

const navItems = [
  { id: "overview" as DashboardView, label: "Overview", icon: LayoutDashboard },
  { id: "assets" as DashboardView, label: "Assets", icon: Wallet },
  { id: "bridge" as DashboardView, label: "Bridge", icon: ArrowLeftRight },
  { id: "discover" as DashboardView, label: "Discover", icon: Compass },
  { id: "analytics" as DashboardView, label: "Analytics", icon: BarChart3 },
  { id: "transactions" as DashboardView, label: "Transactions", icon: History },
  { id: "settings" as DashboardView, label: "Settings", icon: Settings },
];

export function MobileSidebar({ open, onClose, activeView, onViewChange }: MobileSidebarProps) {
  const handleNavClick = (view: DashboardView) => {
    onViewChange(view);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72 p-0 bg-card">
        <SheetHeader className="h-16 flex flex-row items-center justify-between px-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <HoloLogo size="sm" showText={true} />
          </Link>
        </SheetHeader>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                activeView === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="text-base">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Mobile Wallet Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <div>
              <p className="text-tiny text-muted-foreground">Connected</p>
              <p className="font-mono text-small text-foreground">0x7a3...f92d</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
