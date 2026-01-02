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
  Droplets,
  BarChart3,
  Clock,
  ArrowRightLeft,
} from "lucide-react";

interface Pool {
  pair: string;
  protocol: string;
  tvl: number | string;
  apy: number;
  age?: string;
  volume24h: string;
}

interface PoolDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pool: Pool | null;
}

export const PoolDetailModal = memo(({ open, onOpenChange, pool }: PoolDetailModalProps) => {
  if (!pool) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span>{pool.pair}</span>
              <p className="text-sm text-muted-foreground font-normal">{pool.protocol}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Badges */}
          <div className="flex items-center gap-2">
            {pool.age && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {pool.age} old
              </Badge>
            )}
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
              Active
            </Badge>
          </div>

          {/* APY Card */}
          <div className="p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg border border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current APY</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <p className="text-3xl font-bold text-success">
                    {pool.apy.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">TVL</p>
                <p className="text-lg font-mono font-medium text-foreground">
                  {typeof pool.tvl === 'number' ? `$${(pool.tvl / 1000000).toFixed(2)}M` : pool.tvl}
                </p>
              </div>
            </div>
          </div>

          {/* Pool Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">24h Volume</p>
              </div>
              <p className="text-lg font-mono font-medium text-foreground">
                {pool.volume24h}
              </p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Pool Share</p>
              </div>
              <p className="text-lg font-mono font-medium text-foreground">
                0.00%
              </p>
            </div>
          </div>

          {/* Pool Details */}
          <div className="p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Pool Information</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Protocol</span>
                <span className="text-foreground">{pool.protocol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pool Age</span>
                <span className="text-foreground">{pool.age || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee Tier</span>
                <span className="text-foreground">0.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Your Position</span>
                <span className="text-muted-foreground">None</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Pool
              </a>
            </Button>
            <Button className="flex-1">
              <Droplets className="w-4 h-4 mr-2" />
              Add Liquidity
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

PoolDetailModal.displayName = "PoolDetailModal";
