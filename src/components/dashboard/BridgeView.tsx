import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { signAndSubmitTransaction } from "@/lib/stellar";

const chains = [
  { id: "stellar", name: "Stellar", tokens: ["XLM", "USDC"] },
  { id: "ethereum", name: "Ethereum", tokens: ["ETH", "USDC", "USDT", "WBTC"] },
  { id: "polygon", name: "Polygon", tokens: ["MATIC", "USDC", "USDT"] },
  { id: "arbitrum", name: "Arbitrum", tokens: ["ETH", "ARB", "USDC"] },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function BridgeView() {
  const [fromChain, setFromChain] = useState("stellar");
  const [toChain, setToChain] = useState("ethereum");
  const [fromToken, setFromToken] = useState("USDC");
  const [amount, setAmount] = useState("");

  const { signTransaction, isConnected, address } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Bridge History
  const { data: history = [] } = useQuery({
    queryKey: ['bridge_history'],
    queryFn: async () => {
      // Using generic transaction history to filter for bridge events (simplified)
      // Ideally a dedicated /defi/bridge/history endpoint
      try {
        const res = await api.get<any[]>('/transactions');
        return (res || []).filter(tx => tx.type === 'bridge' || tx.memo?.includes('bridge')).slice(0, 5);
      } catch {
        return [];
      }
    },
    enabled: isConnected
  });

  const fromChainData = chains.find(c => c.id === fromChain);

  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post<{ transactionXdr: string }>('/defi/bridge/build-tx', {
        sourceChain: "stellar",
        destChain: toChain,
        asset: fromToken,
        amount,
        recipient: address, // Defaulting to self-bridge for now
        from: address
      });

      if (!res.transactionXdr) throw new Error("Failed to generate bridge transaction");

      await signAndSubmitTransaction(res.transactionXdr, signTransaction);

      toast.success(`Bridge initiated: ${amount} ${fromToken} from ${fromChain} to ${toChain}`);
      setAmount("");
    } catch (e: any) {
      console.error("Bridge error", e);
      toast.error(e.message || "Bridge failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-xl md:text-h1 font-bold text-foreground">Bridge</h1>
        <p className="text-xs md:text-small text-muted-foreground">Transfer assets across chains securely</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
        <motion.div variants={itemVariants} className="card-elevated p-4 md:p-6">
          <h3 className="text-lg md:text-h3 font-semibold text-foreground mb-4 md:mb-6">Bridge Assets</h3>

          <div className="space-y-3 mb-4">
            <label className="text-xs md:text-small font-medium text-muted-foreground">From</label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Select value={fromChain} onValueChange={setFromChain}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Chain" /></SelectTrigger>
                <SelectContent>{chains.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Token" /></SelectTrigger>
                <SelectContent>{fromChainData?.tokens.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 font-mono" />
            </div>
          </div>

          <div className="flex justify-center my-4">
            <button onClick={swapChains} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-3 mb-4 md:mb-6">
            <label className="text-xs md:text-small font-medium text-muted-foreground">To</label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Select value={toChain} onValueChange={setToChain}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Chain" /></SelectTrigger>
                <SelectContent>{chains.filter(c => c.id !== fromChain).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              <div className="flex-1 px-4 py-2 bg-secondary rounded-lg flex items-center">
                <span className="text-small font-mono text-foreground">{amount || '0.00'} {fromToken}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 md:gap-3">
            <Button variant="hero" className="flex-1" onClick={handleBridge} disabled={isLoading}>
              {isLoading ? "Bridging..." : "Bridge Assets"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>

        {/* History */}
        <motion.div variants={itemVariants} className="card-elevated p-4 md:p-6">
          <h3 className="text-lg md:text-h3 font-semibold text-foreground mb-4 md:mb-6">Recent Activity</h3>
          <div className="space-y-3">
            {history.length > 0 ? history.map((tx: any) => (
              <div key={tx.hash} className="p-4 bg-secondary/30 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium">{tx.type}</p>
                  <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono">{tx.amount}</p>
                  <p className="text-xs text-success">Completed</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-muted-foreground">No recent bridge activity found.</div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
