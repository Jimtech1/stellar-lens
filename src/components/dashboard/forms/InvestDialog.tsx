import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { TrendingUp, Shield, AlertTriangle, Loader2, Info, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface YieldOpportunity {
  id: string;
  protocol: string;
  protocolLogo: string;
  asset: string;
  chain: string;
  apy: number;
  riskScore: number;
  tvl: number;
  category: string;
}

interface InvestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: YieldOpportunity | null;
}

export function InvestDialog({ open, onOpenChange, opportunity }: InvestDialogProps) {
  const [amount, setAmount] = useState("");
  const [sliderValue, setSliderValue] = useState([0]);
  const [autoCompound, setAutoCompound] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!opportunity) return null;

  const availableBalance = 5000; // Mock USDC balance

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    const calculatedAmount = (value[0] / 100) * availableBalance;
    setAmount(calculatedAmount.toFixed(2));
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    const percentage = (parseFloat(value) / availableBalance) * 100;
    setSliderValue([Math.min(percentage, 100)]);
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-success";
    if (score < 60) return "text-warning";
    return "text-destructive";
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return "Low Risk";
    if (score < 60) return "Medium Risk";
    return "High Risk";
  };

  const estimatedDaily = amount ? (parseFloat(amount) * opportunity.apy / 100 / 365).toFixed(2) : "0.00";
  const estimatedMonthly = amount ? (parseFloat(amount) * opportunity.apy / 100 / 12).toFixed(2) : "0.00";
  const estimatedYearly = amount ? (parseFloat(amount) * opportunity.apy / 100).toFixed(2) : "0.00";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`Successfully invested $${amount} in ${opportunity.protocol}`);
    setIsLoading(false);
    setAmount("");
    setSliderValue([0]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
              {opportunity.protocolLogo}
            </div>
            <div>
              <DialogTitle>{opportunity.protocol}</DialogTitle>
              <DialogDescription>
                {opportunity.asset} on {opportunity.chain}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-success/10 rounded-lg text-center">
              <TrendingUp className="w-4 h-4 text-success mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">APY</p>
              <p className="font-bold text-success">{opportunity.apy}%</p>
            </div>
            <div className={`p-3 rounded-lg text-center ${opportunity.riskScore < 30 ? 'bg-success/10' : opportunity.riskScore < 60 ? 'bg-warning/10' : 'bg-destructive/10'}`}>
              <Shield className={`w-4 h-4 mx-auto mb-1 ${getRiskColor(opportunity.riskScore)}`} />
              <p className="text-xs text-muted-foreground">Risk</p>
              <p className={`font-bold ${getRiskColor(opportunity.riskScore)}`}>{getRiskLabel(opportunity.riskScore)}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg text-center">
              <span className="text-lg">💰</span>
              <p className="text-xs text-muted-foreground">TVL</p>
              <p className="font-bold text-primary">${(opportunity.tvl / 1000000).toFixed(1)}M</p>
            </div>
          </div>

          {/* Investment Amount */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Investment Amount</Label>
              <span className="text-xs text-muted-foreground">
                Available: ${availableBalance.toLocaleString()} USDC
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="pl-7 font-mono"
                min="0"
                step="any"
              />
            </div>
            <Slider
              value={sliderValue}
              onValueChange={handleSliderChange}
              max={100}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Estimated Returns */}
          <div className="p-4 bg-success/5 border border-success/20 rounded-lg space-y-2">
            <p className="text-sm font-medium text-foreground">Estimated Returns</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Daily</p>
                <p className="font-mono font-semibold text-success">${estimatedDaily}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Monthly</p>
                <p className="font-mono font-semibold text-success">${estimatedMonthly}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Yearly</p>
                <p className="font-mono font-semibold text-success">${estimatedYearly}</p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Label htmlFor="auto-compound" className="cursor-pointer">Auto-compound rewards</Label>
              <Info className="w-3 h-3 text-muted-foreground" />
            </div>
            <Switch
              id="auto-compound"
              checked={autoCompound}
              onCheckedChange={setAutoCompound}
            />
          </div>

          {/* Risk Warning */}
          {opportunity.riskScore >= 60 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <p className="text-xs text-destructive">
                This opportunity has a high risk score. Only invest what you can afford to lose.
              </p>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" className="gap-2 sm:flex-1">
              <ExternalLink className="w-4 h-4" />
              View Protocol
            </Button>
            <Button type="submit" variant="hero" disabled={isLoading} className="sm:flex-1">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Invest Now
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
