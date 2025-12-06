import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Coins, Loader2, TrendingUp, Clock, Shield } from "lucide-react";
import { toast } from "sonner";

interface StakeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const stakingPools = [
  { id: "xlm-staking", name: "XLM Staking Pool", apy: 5.2, lockPeriod: "Flexible", minStake: 100 },
  { id: "xlm-locked-30", name: "XLM Locked 30D", apy: 7.5, lockPeriod: "30 days", minStake: 500 },
  { id: "xlm-locked-90", name: "XLM Locked 90D", apy: 12.0, lockPeriod: "90 days", minStake: 1000 },
  { id: "usdc-lp", name: "USDC Liquidity Pool", apy: 8.3, lockPeriod: "Flexible", minStake: 100 },
];

export function StakeDialog({ open, onOpenChange }: StakeDialogProps) {
  const [selectedPool, setSelectedPool] = useState(stakingPools[0].id);
  const [amount, setAmount] = useState("");
  const [sliderValue, setSliderValue] = useState([0]);
  const [isLoading, setIsLoading] = useState(false);

  const pool = stakingPools.find(p => p.id === selectedPool);
  const availableBalance = 15000; // Mock balance

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (pool && parseFloat(amount) < pool.minStake) {
      toast.error(`Minimum stake is ${pool.minStake} XLM`);
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`Successfully staked ${amount} XLM in ${pool?.name}`);
    setIsLoading(false);
    setAmount("");
    setSliderValue([0]);
    onOpenChange(false);
  };

  const estimatedEarnings = pool && amount ? (parseFloat(amount) * pool.apy / 100 / 12).toFixed(2) : "0.00";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Coins className="w-5 h-5 text-warning" />
            </div>
            <div>
              <DialogTitle>Stake Assets</DialogTitle>
              <DialogDescription>
                Earn passive income by staking your assets
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Staking Pool</Label>
            <Select value={selectedPool} onValueChange={setSelectedPool}>
              <SelectTrigger>
                <SelectValue placeholder="Select pool" />
              </SelectTrigger>
              <SelectContent>
                {stakingPools.map(pool => (
                  <SelectItem key={pool.id} value={pool.id}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{pool.name}</span>
                      <span className="text-success font-medium">{pool.apy}% APY</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {pool && (
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-secondary/50 rounded-lg text-center">
                <TrendingUp className="w-4 h-4 text-success mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">APY</p>
                <p className="font-semibold text-success">{pool.apy}%</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg text-center">
                <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Lock Period</p>
                <p className="font-semibold text-foreground">{pool.lockPeriod}</p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg text-center">
                <Shield className="w-4 h-4 text-warning mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Min Stake</p>
                <p className="font-semibold text-foreground">{pool.minStake}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Stake Amount</Label>
              <span className="text-xs text-muted-foreground">
                Available: {availableBalance.toLocaleString()} XLM
              </span>
            </div>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="font-mono"
              min="0"
            />
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

          <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Estimated Monthly Earnings</p>
                <p className="text-lg font-bold text-success font-mono">${estimatedEarnings}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-success/50" />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Stake Now
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
