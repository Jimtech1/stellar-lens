import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useWallet } from "@/contexts/WalletContext";
import { api } from "@/lib/api";

interface DepositWithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "deposit" | "withdraw";
}

const assets = [
  { symbol: "XLM", name: "Stellar Lumens", balance: 15000 },
  { symbol: "USDC", name: "USD Coin", balance: 5000 },
  { symbol: "ETH", name: "Ethereum", balance: 2.5 },
  { symbol: "BTC", name: "Bitcoin", balance: 0.15 },
];

export function DepositWithdrawDialog({ open, onOpenChange, type }: DepositWithdrawDialogProps) {
  const [selectedAsset, setSelectedAsset] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signTransaction, isConnected } = useWallet();

  const selectedAssetData = assets.find(a => a.symbol === selectedAsset);
  const isDeposit = type === "deposit";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!isDeposit && selectedAssetData && parseFloat(amount) > selectedAssetData.balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (!isDeposit && !isConnected) {
      toast.error("Please connect your wallet to withdraw");
      return;
    }

    setIsLoading(true);

    try {
      if (isDeposit) {
        // Deposit is usually manual transfer to displayed address
        // So we just simulate "initiation" or instructions
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success(`Deposit of ${amount} ${selectedAsset} initiated`);
      } else {
        // Withdrawal Flow
        // 1. Build TX
        const buildRes = await api.post<{ transactionXdr: string }>('/wallet/withdraw', {
          asset: selectedAsset,
          amount: amount,
          // destination: ... (if needed, or implicit to linked wallet)
        });

        if (!buildRes?.transactionXdr) throw new Error("Failed to build transaction");

        // 2. Sign
        const signedXdr = await signTransaction(buildRes.transactionXdr);

        // 3. Broadcast
        await api.post('/rpc/broadcast', { transaction: signedXdr });

        toast.success(`Withdrawal of ${amount} ${selectedAsset} successful`);
      }

      setAmount("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Action failed", error);
      toast.error(error.message || "Action failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxClick = () => {
    if (selectedAssetData) {
      setAmount(selectedAssetData.balance.toString());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDeposit ? 'bg-success/10' : 'bg-destructive/10'}`}>
              {isDeposit ? <ArrowDown className="w-5 h-5 text-success" /> : <ArrowUp className="w-5 h-5 text-destructive" />}
            </div>
            <div>
              <DialogTitle>{isDeposit ? "Deposit" : "Withdraw"} Funds</DialogTitle>
              <DialogDescription>
                {isDeposit ? "Add funds to your portfolio" : "Withdraw funds to your wallet"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset">Select Asset</Label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger>
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map(asset => (
                  <SelectItem key={asset.symbol} value={asset.symbol}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{asset.symbol}</span>
                      <span className="text-muted-foreground">- {asset.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Amount</Label>
              {!isDeposit && selectedAssetData && (
                <span className="text-xs text-muted-foreground">
                  Balance: {selectedAssetData.balance.toLocaleString()} {selectedAsset}
                </span>
              )}
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-16 font-mono"
                min="0"
                step="any"
              />
              {!isDeposit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs text-primary"
                  onClick={handleMaxClick}
                >
                  MAX
                </Button>
              )}
            </div>
          </div>

          {isDeposit && (
            <div className="p-3 bg-secondary/50 rounded-lg space-y-2">
              <p className="text-xs text-muted-foreground">Deposit Address</p>
              <p className="text-xs font-mono break-all text-foreground">GDRXE2BQUC3AZNPVFSCEZ76NJ3WWA...</p>
            </div>
          )}

          <div className="p-3 bg-muted/50 rounded-lg space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span className="font-mono text-foreground">~0.00001 XLM</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Time</span>
              <span className="font-mono text-foreground">~5 seconds</span>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant={isDeposit ? "success" : "destructive"} disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isDeposit ? "Deposit" : "Withdraw"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
