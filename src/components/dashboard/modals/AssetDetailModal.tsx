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
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Send,
  ArrowDownLeft,
  Coins,
  BarChart3,
} from "lucide-react";
import { Asset } from "@/lib/mockData";

interface AssetDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  onSend?: () => void;
  onReceive?: () => void;
  onStake?: () => void;
}

export const AssetDetailModal = memo(({ 
  open, 
  onOpenChange, 
  asset,
  onSend,
  onReceive,
  onStake
}: AssetDetailModalProps) => {
  if (!asset) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-2xl">
              {asset.logo}
            </div>
            <div>
              <span>{asset.name}</span>
              <p className="text-sm text-muted-foreground font-normal">{asset.symbol}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Chain Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{asset.chain}</Badge>
            {asset.apy && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                {asset.apy}% APY
              </Badge>
            )}
          </div>

          {/* Balance Card */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
            <p className="text-2xl font-bold font-mono text-foreground">
              {asset.balance.toLocaleString()} {asset.symbol}
            </p>
            <p className="text-lg font-mono text-muted-foreground">
              ≈ ${asset.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Price Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Current Price</p>
              <p className="text-lg font-mono font-medium text-foreground">
                ${asset.price.toFixed(asset.price < 1 ? 4 : 2)}
              </p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">24h Change</p>
              <div className="flex items-center gap-1">
                {asset.change24h >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
                <span className={`text-lg font-medium ${asset.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Quick Stats</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Cap</span>
                <span className="font-mono text-foreground">$2.8B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume 24h</span>
                <span className="font-mono text-foreground">$145M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Circulating</span>
                <span className="font-mono text-foreground">28B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">All-time High</span>
                <span className="font-mono text-foreground">$0.94</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <Button variant="outline" className="flex-col h-auto py-3" onClick={() => { onSend?.(); onOpenChange(false); }}>
              <Send className="w-4 h-4 mb-1" />
              <span className="text-xs">Send</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3" onClick={() => { onReceive?.(); onOpenChange(false); }}>
              <ArrowDownLeft className="w-4 h-4 mb-1" />
              <span className="text-xs">Receive</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3" onClick={() => { onStake?.(); onOpenChange(false); }}>
              <Coins className="w-4 h-4 mb-1" />
              <span className="text-xs">Stake</span>
            </Button>
          </div>

          <Button className="w-full" variant="default">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

AssetDetailModal.displayName = "AssetDetailModal";
