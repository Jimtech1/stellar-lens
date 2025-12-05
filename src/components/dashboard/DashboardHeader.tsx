import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, Menu, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left - Mobile Menu & Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 w-64 lg:w-80">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search assets, protocols..."
            className="border-0 bg-transparent h-auto p-0 focus-visible:ring-0 text-small placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>

        {/* Wallet */}
        <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="font-mono text-small">0x7a3...f92d</span>
          <ChevronDown className="w-4 h-4" />
        </Button>

        {/* Mobile Wallet */}
        <Button variant="outline" size="icon-sm" className="sm:hidden">
          <div className="w-2 h-2 rounded-full bg-success" />
        </Button>
      </div>
    </header>
  );
}
