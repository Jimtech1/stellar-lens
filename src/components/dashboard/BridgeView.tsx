import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, Clock, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chains = [
  { id: "stellar", name: "Stellar", tokens: ["XLM", "USDC"] },
  { id: "ethereum", name: "Ethereum", tokens: ["ETH", "USDC", "USDT", "WBTC"] },
  { id: "polygon", name: "Polygon", tokens: ["MATIC", "USDC", "USDT"] },
  { id: "arbitrum", name: "Arbitrum", tokens: ["ETH", "ARB", "USDC"] },
];

const recentBridges = [
  { id: "1", from: "Stellar", to: "Ethereum", token: "USDC", amount: 1000, status: "completed", time: "2 hours ago" },
  { id: "2", from: "Ethereum", to: "Polygon", token: "USDC", amount: 500, status: "completed", time: "5 hours ago" },
  { id: "3", from: "Polygon", to: "Stellar", token: "USDC", amount: 250, status: "pending", time: "10 min ago" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
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

  const fromChainData = chains.find(c => c.id === fromChain);
  const toChainData = chains.find(c => c.id === toChain);

  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-h1 font-bold text-foreground">Bridge</h1>
        <p className="text-small text-muted-foreground">Transfer assets across chains securely</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bridge Form */}
        <motion.div variants={itemVariants} className="card-elevated p-6">
          <h3 className="text-h3 font-semibold text-foreground mb-6">Bridge Assets</h3>

          {/* From Section */}
          <div className="space-y-3 mb-4">
            <label className="text-small font-medium text-muted-foreground">From</label>
            <div className="flex gap-3">
              <Select value={fromChain} onValueChange={setFromChain}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Chain" />
                </SelectTrigger>
                <SelectContent>
                  {chains.map(chain => (
                    <SelectItem key={chain.id} value={chain.id}>{chain.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  {fromChainData?.tokens.map(token => (
                    <SelectItem key={token} value={token}>{token}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 font-mono"
              />
            </div>
            <p className="text-tiny text-muted-foreground">Balance: 5,000 USDC</p>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center my-4">
            <button
              onClick={swapChains}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* To Section */}
          <div className="space-y-3 mb-6">
            <label className="text-small font-medium text-muted-foreground">To</label>
            <div className="flex gap-3">
              <Select value={toChain} onValueChange={setToChain}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Chain" />
                </SelectTrigger>
                <SelectContent>
                  {chains.filter(c => c.id !== fromChain).map(chain => (
                    <SelectItem key={chain.id} value={chain.id}>{chain.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1 px-4 py-2 bg-secondary rounded-lg flex items-center">
                <span className="text-small font-mono text-foreground">
                  {amount ? parseFloat(amount).toFixed(2) : '0.00'} {fromToken}
                </span>
              </div>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="p-4 bg-secondary/50 rounded-lg mb-6 space-y-2">
            <div className="flex items-center justify-between text-small">
              <span className="text-muted-foreground">Bridge Fee</span>
              <span className="text-foreground font-mono">0.1%</span>
            </div>
            <div className="flex items-center justify-between text-small">
              <span className="text-muted-foreground">Estimated Gas</span>
              <span className="text-foreground font-mono">~$2.50</span>
            </div>
            <div className="flex items-center justify-between text-small">
              <span className="text-muted-foreground">Estimated Time</span>
              <span className="text-foreground font-mono">~15 min</span>
            </div>
            <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
              <span className="text-small font-medium text-foreground">You Receive</span>
              <span className="text-body font-mono font-semibold text-foreground">
                {amount ? (parseFloat(amount) * 0.999 - 2.5).toFixed(2) : '0.00'} {fromToken}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">Estimate</Button>
            <Button variant="hero" className="flex-1">
              Bridge
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Info */}
          <div className="mt-4 flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-tiny text-muted-foreground">
              Powered by Axelar Bridge. Cross-chain transfers typically take 10-30 minutes to complete.
            </p>
          </div>
        </motion.div>

        {/* Bridge History */}
        <motion.div variants={itemVariants} className="card-elevated p-6">
          <h3 className="text-h3 font-semibold text-foreground mb-6">Recent Bridges</h3>

          <div className="space-y-4">
            {recentBridges.map((bridge) => (
              <div
                key={bridge.id}
                className="p-4 bg-secondary/30 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    bridge.status === 'completed' ? 'bg-success/10' :
                    bridge.status === 'pending' ? 'bg-warning/10' : 'bg-destructive/10'
                  }`}>
                    {bridge.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-success" />}
                    {bridge.status === 'pending' && <Clock className="w-5 h-5 text-warning" />}
                    {bridge.status === 'failed' && <XCircle className="w-5 h-5 text-destructive" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-small font-medium text-foreground">{bridge.from}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span className="text-small font-medium text-foreground">{bridge.to}</span>
                    </div>
                    <p className="text-tiny text-muted-foreground">{bridge.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-small font-mono font-medium text-foreground">
                    {bridge.amount} {bridge.token}
                  </p>
                  <p className={`text-tiny capitalize ${
                    bridge.status === 'completed' ? 'text-success' :
                    bridge.status === 'pending' ? 'text-warning' : 'text-destructive'
                  }`}>
                    {bridge.status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {recentBridges.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-small text-muted-foreground">No recent bridges</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
