import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface SwapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedFromAsset?: string;
}

const assets = [
  { symbol: "XLM", name: "Stellar Lumens", balance: 15000, price: 0.124 },
  { symbol: "USDC", name: "USD Coin", balance: 5000, price: 1.00 },
  { symbol: "ETH", name: "Ethereum", balance: 2.5, price: 2300 },
  { symbol: "BTC", name: "Bitcoin", balance: 0.15, price: 43000 },
  { symbol: "AQUA", name: "Aquarius", balance: 25000, price: 0.0045 },
];

export function SwapDialog({ open, onOpenChange, preselectedFromAsset }: SwapDialogProps) {
  const [fromAsset, setFromAsset] = useState(preselectedFromAsset || "XLM");
  const [toAsset, setToAsset] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fromAssetData = assets.find(a => a.symbol === fromAsset);
  const toAssetData = assets.find(a => a.symbol === toAsset);
  
  const exchangeRate = fromAssetData && toAssetData 
    ? fromAssetData.price / toAssetData.price 
    : 0;
  
  const toAmount = fromAmount ? (parseFloat(fromAmount) * exchangeRate).toFixed(6) : "";

  const handleSwapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
    setFromAmount("");
  };

  const handleRefreshRate = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsRefreshing(false);
    toast.success("Rate refreshed");
  };

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (fromAssetData && parseFloat(fromAmount) > fromAssetData.balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (fromAsset === toAsset) {
      toast.error("Cannot swap same assets");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`Swapped ${fromAmount} ${fromAsset} for ${toAmount} ${toAsset}`);
    setIsLoading(false);
    setFromAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Swap Assets</DialogTitle>
          <DialogDescription>Exchange one asset for another</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSwap} className="space-y-4">
          {/* From */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>From</Label>
              <span className="text-xs text-muted-foreground">
                Balance: {fromAssetData?.balance.toLocaleString()} {fromAsset}
              </span>
            </div>
            <div className="flex gap-2">
              <Select value={fromAsset} onValueChange={setFromAsset}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assets.map(asset => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      {asset.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="font-mono pr-14"
                  min="0"
                  step="any"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs text-primary"
                  onClick={() => setFromAmount(fromAssetData?.balance.toString() || "")}
                >
                  MAX
                </Button>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={handleSwapAssets}
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To */}
          <div className="space-y-2">
            <Label>To (estimated)</Label>
            <div className="flex gap-2">
              <Select value={toAsset} onValueChange={setToAsset}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assets.filter(a => a.symbol !== fromAsset).map(asset => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      {asset.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                value={toAmount}
                readOnly
                className="font-mono flex-1 bg-muted/50"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Rate Info */}
          <div className="p-3 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Exchange Rate</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">
                  1 {fromAsset} = {exchangeRate.toFixed(6)} {toAsset}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleRefreshRate}
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span className="font-mono">~0.00001 XLM</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Slippage</span>
              <span className="font-mono">0.5%</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" disabled={isLoading || !fromAmount}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Swap
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}