import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownLeft, Loader2, Copy, Check, QrCode } from "lucide-react";
import { toast } from "sonner";

interface SendReceiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "send" | "receive";
  preselectedAsset?: string;
}

const assets = [
  { symbol: "XLM", name: "Stellar Lumens", balance: 15000 },
  { symbol: "USDC", name: "USD Coin", balance: 5000 },
  { symbol: "ETH", name: "Ethereum", balance: 2.5 },
];

export function SendReceiveDialog({ open, onOpenChange, initialTab = "send", preselectedAsset }: SendReceiveDialogProps) {
  const [tab, setTab] = useState(initialTab);
  const [selectedAsset, setSelectedAsset] = useState(preselectedAsset || "XLM");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const walletAddress = "GDRXE2BQUC3AZNPVFSCEZ76NJ3WWASQV3LMTCVZK5HPGXE7VCFMNBZ4X";
  const selectedAssetData = assets.find(a => a.symbol === selectedAsset);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientAddress) {
      toast.error("Please enter a recipient address");
      return;
    }
    
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
    
    toast.success(`Sent ${amount} ${selectedAsset} successfully`);
    setIsLoading(false);
    setRecipientAddress("");
    setAmount("");
    setMemo("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Assets</DialogTitle>
          <DialogDescription>Send or receive crypto assets</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "send" | "receive")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="send" className="gap-2">
              <ArrowUpRight className="w-4 h-4" />
              Send
            </TabsTrigger>
            <TabsTrigger value="receive" className="gap-2">
              <ArrowDownLeft className="w-4 h-4" />
              Receive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4 mt-4">
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-2">
                <Label>Asset</Label>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map(asset => (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span className="font-medium">{asset.symbol}</span>
                          <span className="text-muted-foreground text-xs">
                            Balance: {asset.balance.toLocaleString()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Recipient Address</Label>
                <Input
                  placeholder="G..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Amount</Label>
                  <span className="text-xs text-muted-foreground">
                    Balance: {selectedAssetData?.balance.toLocaleString()} {selectedAsset}
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="font-mono pr-16"
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

              <div className="space-y-2">
                <Label>Memo (Optional)</Label>
                <Textarea
                  placeholder="Add a note for the recipient"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span className="font-mono">~0.00001 XLM</span>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="hero" disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Send {selectedAsset}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="receive" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Asset to Receive</Label>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map(asset => (
                      <SelectItem key={asset.symbol} value={asset.symbol}>
                        {asset.symbol} - {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-6 bg-secondary/50 rounded-lg text-center">
                <div className="w-32 h-32 mx-auto bg-background rounded-lg flex items-center justify-center mb-4 border">
                  <QrCode className="w-24 h-24 text-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mb-2">Your {selectedAsset} Address</p>
                <p className="text-xs font-mono break-all mb-3">{walletAddress}</p>
                <Button variant="outline" size="sm" onClick={handleCopyAddress} className="gap-2">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Address"}
                </Button>
              </div>

              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-xs text-warning">
                  Only send {selectedAsset} to this address. Sending other assets may result in permanent loss.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
