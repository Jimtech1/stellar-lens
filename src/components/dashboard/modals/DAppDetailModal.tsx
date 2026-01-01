import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  TrendingUp,
  Users,
  BarChart3,
  Star,
  Wallet,
} from "lucide-react";

interface DApp {
  name: string;
  category: string;
  users: string;
  growth: number;
  logo: string;
  tvl: string;
}

interface DAppDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dapp: DApp | null;
}

export const DAppDetailModal = memo(({ open, onOpenChange, dapp }: DAppDetailModalProps) => {
  if (!dapp) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
              {dapp.logo}
            </div>
            <div>
              <span>{dapp.name}</span>
              <p className="text-sm text-muted-foreground font-normal">{dapp.category}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Badges */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{dapp.category}</Badge>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{dapp.growth}% Growth
            </Badge>
          </div>

          {/* Stats Card */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Active Users</p>
                </div>
                <p className="text-xl font-bold text-foreground">{dapp.users}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">TVL</p>
                </div>
                <p className="text-xl font-bold text-foreground">{dapp.tvl}</p>
              </div>
            </div>
          </div>

          {/* Growth Stats */}
          <div className="p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg border border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">User Growth (30d)</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <p className="text-2xl font-bold text-success">+{dapp.growth}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Rank</p>
                <p className="text-lg font-medium text-foreground">#12</p>
              </div>
            </div>
          </div>

          {/* dApp Details */}
          <div className="p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">dApp Information</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="text-foreground">{dapp.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network</span>
                <span className="text-foreground">Stellar / Soroban</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Launch Date</span>
                <span className="text-foreground">2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Smart Contracts</span>
                <span className="text-success">Verified</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-3 bg-secondary/30 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {dapp.name} is a leading {dapp.category.toLowerCase()} application on the Stellar network, 
              providing users with innovative DeFi solutions and seamless user experience.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="icon">
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button className="flex-1" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Launch App
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

DAppDetailModal.displayName = "DAppDetailModal";
