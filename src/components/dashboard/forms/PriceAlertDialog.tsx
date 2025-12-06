import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bell, TrendingUp, TrendingDown, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PriceAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const assets = [
  { symbol: "XLM", name: "Stellar Lumens", currentPrice: 0.12 },
  { symbol: "ETH", name: "Ethereum", currentPrice: 2350.50 },
  { symbol: "BTC", name: "Bitcoin", currentPrice: 43500.00 },
  { symbol: "USDC", name: "USD Coin", currentPrice: 1.00 },
];

const existingAlerts = [
  { id: "1", asset: "XLM", type: "above", price: 0.15, active: true },
  { id: "2", asset: "BTC", type: "below", price: 40000, active: true },
];

export function PriceAlertDialog({ open, onOpenChange }: PriceAlertDialogProps) {
  const [selectedAsset, setSelectedAsset] = useState("XLM");
  const [alertType, setAlertType] = useState<"above" | "below">("above");
  const [targetPrice, setTargetPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alerts, setAlerts] = useState(existingAlerts);

  const selectedAssetData = assets.find(a => a.symbol === selectedAsset);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetPrice || parseFloat(targetPrice) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAlert = {
      id: Date.now().toString(),
      asset: selectedAsset,
      type: alertType,
      price: parseFloat(targetPrice),
      active: true,
    };
    
    setAlerts([...alerts, newAlert]);
    toast.success(`Price alert created for ${selectedAsset}`);
    setIsLoading(false);
    setTargetPrice("");
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
    toast.success("Alert deleted");
  };

  const percentageChange = selectedAssetData && targetPrice 
    ? (((parseFloat(targetPrice) - selectedAssetData.currentPrice) / selectedAssetData.currentPrice) * 100).toFixed(2)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Price Alerts</DialogTitle>
              <DialogDescription>
                Get notified when prices reach your target
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Asset</Label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assets.map(asset => (
                  <SelectItem key={asset.symbol} value={asset.symbol}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span className="font-medium">{asset.symbol}</span>
                      <span className="text-muted-foreground font-mono">
                        ${asset.currentPrice.toLocaleString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedAssetData && (
              <p className="text-xs text-muted-foreground">
                Current price: ${selectedAssetData.currentPrice.toLocaleString()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Alert Condition</Label>
            <RadioGroup value={alertType} onValueChange={(v) => setAlertType(v as "above" | "below")} className="grid grid-cols-2 gap-3">
              <div className="relative">
                <RadioGroupItem value="above" id="above" className="peer sr-only" />
                <Label
                  htmlFor="above"
                  className="flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer peer-data-[state=checked]:border-success peer-data-[state=checked]:bg-success/10 transition-colors"
                >
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span>Price Above</span>
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem value="below" id="below" className="peer sr-only" />
                <Label
                  htmlFor="below"
                  className="flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer peer-data-[state=checked]:border-destructive peer-data-[state=checked]:bg-destructive/10 transition-colors"
                >
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  <span>Price Below</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Target Price</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="pl-7 font-mono"
                min="0"
                step="any"
              />
            </div>
            {percentageChange && (
              <p className={`text-xs ${parseFloat(percentageChange) >= 0 ? 'text-success' : 'text-destructive'}`}>
                {parseFloat(percentageChange) >= 0 ? '+' : ''}{percentageChange}% from current price
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Alert
          </Button>
        </form>

        {alerts.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <Label className="text-sm font-medium">Active Alerts</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {alerts.map(alert => {
                const assetData = assets.find(a => a.symbol === alert.asset);
                return (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {alert.type === "above" ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {alert.asset} {alert.type === "above" ? ">" : "<"} ${alert.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Current: ${assetData?.currentPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
