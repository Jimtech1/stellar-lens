import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, TrendingUp, Shield, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface EarnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const topOpportunities = [
  { id: "1", protocol: "Blend Protocol", asset: "XLM-USDC", apy: 12.5, risk: "Low", tvl: "$15.2M", logo: "🔷" },
  { id: "2", protocol: "Aquarius DEX", asset: "AQUA-XLM", apy: 22.3, risk: "Medium", tvl: "$8.2M", logo: "🌊" },
  { id: "3", protocol: "Ultra Capital", asset: "yUSDC", apy: 8.4, risk: "Low", tvl: "$9.4M", logo: "💎" },
  { id: "4", protocol: "Phoenix DeFi", asset: "PHO-XLM", apy: 32.1, risk: "High", tvl: "$4.2M", logo: "🔥" },
];

const assets = [
  { symbol: "XLM", name: "Stellar Lumens", balance: 15000 },
  { symbol: "USDC", name: "USD Coin", balance: 5000 },
  { symbol: "AQUA", name: "Aquarius", balance: 25000 },
];

export function EarnDialog({ open, onOpenChange }: EarnDialogProps) {
  const navigate = useNavigate();
  const [selectedOpportunity, setSelectedOpportunity] = useState(topOpportunities[0]);
  const [selectedAsset, setSelectedAsset] = useState("XLM");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedAssetData = assets.find(a => a.symbol === selectedAsset);

  const getRiskColor = (risk: string) => {
    if (risk === "Low") return "text-success";
    if (risk === "Medium") return "text-warning";
    return "text-destructive";
  };

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (selectedAssetData && parseFloat(amount) > selectedAssetData.balance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`Invested ${amount} ${selectedAsset} in ${selectedOpportunity.protocol}`);
    setIsLoading(false);
    setAmount("");
    onOpenChange(false);
  };

  const handleExploreMore = () => {
    onOpenChange(false);
    // Navigate to discover page - this assumes parent handles navigation
    window.dispatchEvent(new CustomEvent('navigate-to-discover'));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-warning" />
            Earn Yield
          </DialogTitle>
          <DialogDescription>Invest in high-yield opportunities across the Stellar ecosystem</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Top Opportunities */}
          <div>
            <Label className="mb-2 block">Select Opportunity</Label>
            <div className="grid grid-cols-2 gap-2">
              {topOpportunities.map((opp) => (
                <button
                  key={opp.id}
                  type="button"
                  onClick={() => setSelectedOpportunity(opp)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedOpportunity.id === opp.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{opp.logo}</span>
                    <span className="text-sm font-medium text-foreground truncate">{opp.protocol}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{opp.asset}</span>
                    <span className="text-xs font-bold text-success">{opp.apy}% APY</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Opportunity Details */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedOpportunity.logo}</span>
                <div>
                  <p className="font-semibold text-foreground">{selectedOpportunity.protocol}</p>
                  <p className="text-xs text-muted-foreground">{selectedOpportunity.asset}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-lg font-bold text-success">{selectedOpportunity.apy}%</span>
                </div>
                <p className="text-xs text-muted-foreground">APY</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 ${getRiskColor(selectedOpportunity.risk)}`} />
                <span className={getRiskColor(selectedOpportunity.risk)}>{selectedOpportunity.risk} Risk</span>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground">TVL: </span>
                <span className="font-mono">{selectedOpportunity.tvl}</span>
              </div>
            </div>
          </div>

          {/* Investment Form */}
          <form onSubmit={handleInvest} className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Amount to Invest</Label>
                <span className="text-xs text-muted-foreground">
                  Balance: {selectedAssetData?.balance.toLocaleString()} {selectedAsset}
                </span>
              </div>
              <div className="flex gap-2">
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger className="w-28">
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="font-mono pr-14"
                    min="0"
                    step="any"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs text-primary"
                    onClick={() => setAmount(selectedAssetData?.balance.toString() || "")}
                  >
                    MAX
                  </Button>
                </div>
              </div>
            </div>

            {/* Estimated Returns */}
            {amount && parseFloat(amount) > 0 && (
              <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Estimated Annual Return</p>
                <p className="text-lg font-bold text-success font-mono">
                  +${(parseFloat(amount) * (selectedOpportunity.apy / 100)).toFixed(2)} {selectedAsset}
                </p>
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleExploreMore}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Explore More
              </Button>
              <Button type="submit" variant="hero" disabled={isLoading || !amount} className="flex-1">
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Invest Now
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}