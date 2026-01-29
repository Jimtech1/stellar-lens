import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, Menu, ChevronDown, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WalletConnectDialog } from "@/components/WalletConnectDialog";
import { useWallet } from "@/contexts/WalletContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WALLETS } from "@/lib/wallets";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const { connect, disconnect, isConnecting, isConnected, formattedAddress, walletType } = useWallet();

  const currentWallet = walletType ? WALLETS.find(w => w.id === walletType) : null;

  return (
    <>
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
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  {currentWallet && <span className="text-lg">{currentWallet.icon}</span>}
                  <span className="font-mono text-small">{formattedAddress}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground">
                  {currentWallet?.name}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 text-destructive cursor-pointer"
                  onClick={disconnect}
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="hidden sm:flex items-center gap-2"
              onClick={() => setWalletDialogOpen(true)}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}

          {/* Mobile Wallet */}
          {isConnected ? (
            <Button
              variant="outline"
              size="icon-sm"
              className="sm:hidden"
              onClick={disconnect}
            >
              <div className="w-2 h-2 rounded-full bg-success" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="icon-sm"
              className="sm:hidden"
              onClick={() => setWalletDialogOpen(true)}
            >
              <span className="text-xs">🔗</span>
            </Button>
          )}
        </div>
      </header>

      <WalletConnectDialog
        open={walletDialogOpen}
        onOpenChange={setWalletDialogOpen}
        onConnect={connect}
        isConnecting={isConnecting}
      />
    </>
  );
}
