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
  Coins,
  BarChart3,
  Wallet,
  ArrowUpRight,
} from "lucide-react";

interface Position {
  id?: string;
  contract: string;
  position: string;
  value: number;
  apy: number;
  token: string;
}

interface PositionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: Position | null;
}

export const PositionDetailModal = memo(({ open, onOpenChange, position }: PositionDetailModalProps) => {
  if (!position) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Coins className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span>{position.contract}</span>
              <p className="text-sm text-muted-foreground font-normal">{position.position}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Badges */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{position.token}</Badge>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
              Active Position
            </Badge>
          </div>

          {/* Value Card */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Position Value</p>
            </div>
            <p className="text-3xl font-bold font-mono text-foreground">
              ${position.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* APY Card */}
          <div className="p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg border border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current APY</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <p className="text-2xl font-bold text-success">
                    {position.apy.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Est. Daily</p>
                <p className="text-lg font-mono font-medium text-success">
                  +${((position.value * position.apy / 100) / 365).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Position Details */}
          <div className="p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Position Details</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Protocol</span>
                <span className="text-foreground">{position.contract}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position Type</span>
                <span className="text-foreground">{position.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Token</span>
                <span className="text-foreground">{position.token}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network</span>
                <span className="text-foreground">Stellar / Soroban</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rewards Earned</span>
                <span className="text-success">+$124.50</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
            <Button className="flex-1" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Contract
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

PositionDetailModal.displayName = "PositionDetailModal";
