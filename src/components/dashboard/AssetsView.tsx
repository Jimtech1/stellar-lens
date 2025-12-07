import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowUpDown, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockAssets, Asset } from "@/lib/mockData";
import { SendReceiveDialog } from "./forms/SendReceiveDialog";
import { StakeDialog } from "./forms/StakeDialog";
import { AssetActionsMenu } from "./forms/AssetActionsMenu";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function AssetsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChain, setSelectedChain] = useState<string>("all");
  const [sortBy, setSortBy] = useState<keyof Asset>("value");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sendReceiveOpen, setSendReceiveOpen] = useState(false);
  const [sendReceiveTab, setSendReceiveTab] = useState<"send" | "receive">("send");
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [stakeOpen, setStakeOpen] = useState(false);

  const chains = ["all", "Stellar", "Ethereum", "Polygon", "Arbitrum"];

  const openSendReceive = (tab: "send" | "receive", asset: string) => {
    setSendReceiveTab(tab);
    setSelectedAsset(asset);
    setSendReceiveOpen(true);
  };

  const filteredAssets = mockAssets
    .filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChain = selectedChain === "all" || asset.chain === selectedChain;
      return matchesSearch && matchesChain;
    })
    .sort((a, b) => {
      const aVal = a[sortBy] as number;
      const bVal = b[sortBy] as number;
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

  const toggleSort = (column: keyof Asset) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const totalValue = filteredAssets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <>
      <SendReceiveDialog 
        open={sendReceiveOpen} 
        onOpenChange={setSendReceiveOpen} 
        initialTab={sendReceiveTab}
        preselectedAsset={selectedAsset}
      />
      <StakeDialog open={stakeOpen} onOpenChange={setStakeOpen} />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-xl md:text-h1 font-bold text-foreground">Assets</h1>
        <p className="text-xs md:text-small text-muted-foreground">Manage your multi-chain portfolio</p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Chain Filter */}
        <div className="flex gap-1.5 md:gap-2 bg-secondary rounded-lg p-1 overflow-x-auto">
          {chains.map((chain) => (
            <button
              key={chain}
              onClick={() => setSelectedChain(chain)}
              className={`px-2 md:px-3 py-1.5 text-xs md:text-small font-medium rounded-md transition-colors capitalize whitespace-nowrap ${
                selectedChain === chain
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {chain === "all" ? "All" : chain}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div variants={itemVariants} className="card-elevated p-3 md:p-4 flex items-center justify-between">
        <div>
          <p className="text-xs md:text-small text-muted-foreground">Total Value</p>
          <p className="text-lg md:text-h2 font-bold font-mono text-foreground">${totalValue.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs md:text-small text-muted-foreground">{filteredAssets.length} assets</p>
          <p className="text-xs md:text-small text-muted-foreground">Across {new Set(filteredAssets.map(a => a.chain)).size} chains</p>
        </div>
      </motion.div>

      {/* Assets Table */}
      <motion.div variants={itemVariants} className="card-elevated overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-small font-medium text-muted-foreground">Asset</th>
                <th className="text-left px-4 py-3 text-small font-medium text-muted-foreground">Chain</th>
                <th 
                  className="text-right px-4 py-3 text-small font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort("balance")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Balance
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="text-right px-4 py-3 text-small font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort("value")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Value
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  className="text-right px-4 py-3 text-small font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort("change24h")}
                >
                  <div className="flex items-center justify-end gap-1">
                    24h Change
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-right px-4 py-3 text-small font-medium text-muted-foreground">APY</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset, index) => (
                <motion.tr
                  key={asset.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                        {asset.logo}
                      </div>
                      <div>
                        <p className="text-small font-medium text-foreground">{asset.name}</p>
                        <p className="text-tiny text-muted-foreground">{asset.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="badge-chain">{asset.chain}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="text-small font-mono text-foreground">
                      {asset.balance.toLocaleString()} {asset.symbol}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <p className="text-small font-mono font-medium text-foreground">
                      ${asset.value.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {asset.change24h >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-success" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      )}
                      <span className={`text-small font-medium ${asset.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {asset.apy ? (
                      <span className="text-small font-medium text-success">{asset.apy}%</span>
                    ) : (
                      <span className="text-small text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <AssetActionsMenu
                      asset={asset}
                      onSend={() => openSendReceive("send", asset.symbol)}
                      onReceive={() => openSendReceive("receive", asset.symbol)}
                      onStake={() => setStakeOpen(true)}
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
    </>
  );
}
