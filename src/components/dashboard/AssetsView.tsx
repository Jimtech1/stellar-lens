import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpDown, TrendingUp, TrendingDown, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockAssets, Asset } from "@/lib/mockData";
import { SendReceiveDialog } from "./forms/SendReceiveDialog";
import { StakeDialog } from "./forms/StakeDialog";
import { AssetActionsMenu } from "./forms/AssetActionsMenu";
import { useLiveAssets } from "@/hooks/useLiveData";
import { AssetDetailModal } from "./modals/AssetDetailModal";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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

type SortColumn = "balance" | "value" | "change24h" | "apy";

export function AssetsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChain, setSelectedChain] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortColumn>("value");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sendReceiveOpen, setSendReceiveOpen] = useState(false);
  const [sendReceiveTab, setSendReceiveTab] = useState<"send" | "receive">("send");
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [stakeOpen, setStakeOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [assetDetailOpen, setAssetDetailOpen] = useState(false);
  const [selectedAssetDetail, setSelectedAssetDetail] = useState<Asset | null>(null);

  const chains = ["all", "Stellar", "Ethereum", "Polygon", "Arbitrum"];

  // Fetch Real Assets
  const { data: assetsData, isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      try {
        return await api.get<Asset[]>('/portfolio/assets');
      } catch (e) {
        console.warn("Using mock assets", e);
        return mockAssets;
      }
    }
  });

  const displayAssets = assetsData || mockAssets;

  // Live price updates
  const liveAssets = useLiveAssets(displayAssets);

  const openSendReceive = (tab: "send" | "receive", asset: string) => {
    setSendReceiveTab(tab);
    setSelectedAsset(asset);
    setSendReceiveOpen(true);
  };

  const openAssetDetail = (asset: Asset) => {
    setSelectedAssetDetail(asset);
    setAssetDetailOpen(true);
  };

  const filteredAssets = liveAssets
    .filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChain = selectedChain === "all" || asset.chain === selectedChain;
      return matchesSearch && matchesChain;
    })
    .sort((a, b) => {
      const aVal = a[sortBy] as number ?? 0;
      const bVal = b[sortBy] as number ?? 0;
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

  const toggleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const totalValue = filteredAssets.reduce((sum, asset) => sum + asset.value, 0);
  const activeFiltersCount = (selectedChain !== "all" ? 1 : 0) + (searchQuery ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedChain("all");
  };

  return (
    <>
      <SendReceiveDialog
        open={sendReceiveOpen}
        onOpenChange={setSendReceiveOpen}
        initialTab={sendReceiveTab}
        preselectedAsset={selectedAsset}
      />
      <StakeDialog open={stakeOpen} onOpenChange={setStakeOpen} />
      <AssetDetailModal
        open={assetDetailOpen}
        onOpenChange={setAssetDetailOpen}
        asset={selectedAssetDetail}
        onSend={() => openSendReceive("send", selectedAssetDetail?.symbol || "")}
        onReceive={() => openSendReceive("receive", selectedAssetDetail?.symbol || "")}
        onStake={() => setStakeOpen(true)}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 md:space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl md:text-h1 font-bold text-foreground">Assets</h1>
            <p className="text-xs md:text-small text-muted-foreground">Manage your multi-chain portfolio</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">Live prices</span>
          </div>
        </motion.div>

        {/* Filters - Desktop */}
        <motion.div variants={itemVariants} className="hidden sm:flex flex-wrap gap-4">
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
          <div className="flex gap-1.5 bg-secondary rounded-lg p-1">
            {chains.map((chain) => (
              <button
                key={chain}
                onClick={() => setSelectedChain(chain)}
                className={`px-3 py-1.5 text-small font-medium rounded-md transition-colors capitalize whitespace-nowrap ${selectedChain === chain
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {chain === "all" ? "All Chains" : chain}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex gap-2">
            {(["value", "change24h", "apy"] as SortColumn[]).map((col) => (
              <button
                key={col}
                onClick={() => toggleSort(col)}
                className={`px-3 py-1.5 text-small font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${sortBy === col
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border text-muted-foreground hover:text-foreground"
                  }`}
              >
                {col === "value" ? "Value" : col === "change24h" ? "24h %" : "APY"}
                {sortBy === col && (
                  <ArrowUpDown className={`w-3 h-3 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Mobile Filters Toggle */}
        <motion.div variants={itemVariants} className="sm:hidden">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="relative shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-3">
                  {/* Chain Filter */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Filter by Chain</p>
                    <div className="flex flex-wrap gap-1.5">
                      {chains.map((chain) => (
                        <button
                          key={chain}
                          onClick={() => setSelectedChain(chain)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize ${selectedChain === chain
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                            }`}
                        >
                          {chain === "all" ? "All" : chain}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Sort by</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(["value", "change24h", "apy", "balance"] as SortColumn[]).map((col) => (
                        <button
                          key={col}
                          onClick={() => toggleSort(col)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${sortBy === col
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                            }`}
                        >
                          {col === "value" ? "Value" : col === "change24h" ? "24h %" : col === "apy" ? "APY" : "Balance"}
                          {sortBy === col && <ChevronDown className={`w-3 h-3 ${sortOrder === "asc" ? "rotate-180" : ""}`} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 text-xs text-destructive hover:underline"
                    >
                      <X className="w-3 h-3" />
                      Clear filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Summary */}
        <motion.div variants={itemVariants} className="card-elevated p-3 md:p-4 flex items-center justify-between">
          <div>
            <p className="text-xs md:text-small text-muted-foreground">Total Value</p>
            <p className="text-lg md:text-h2 font-bold font-mono text-foreground">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs md:text-small text-muted-foreground">{filteredAssets.length} assets</p>
            <p className="text-xs md:text-small text-muted-foreground">Across {new Set(filteredAssets.map(a => a.chain)).size} chains</p>
          </div>
        </motion.div>

        {/* Assets - Mobile Card View */}
        <motion.div variants={itemVariants} className="md:hidden space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredAssets.map((asset) => (
              <motion.div
                key={asset.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card-elevated p-4 cursor-pointer hover:shadow-card transition-all"
                onClick={() => openAssetDetail(asset)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                      {asset.logo}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">{asset.symbol}</p>
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <AssetActionsMenu
                      asset={asset}
                      onSend={() => openSendReceive("send", asset.symbol)}
                      onReceive={() => openSendReceive("receive", asset.symbol)}
                      onStake={() => setStakeOpen(true)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">Balance</p>
                    <p className="text-sm font-mono text-foreground">{asset.balance.toLocaleString()} {asset.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground mb-0.5">Value</p>
                    <p className="text-sm font-mono font-medium text-foreground">
                      ${asset.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5">24h Change</p>
                    <div className="flex items-center gap-1">
                      {asset.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-success" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-destructive" />
                      )}
                      <span className={`text-sm font-medium ${asset.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground mb-0.5">APY</p>
                    {asset.apy ? (
                      <span className="text-sm font-medium text-success">{asset.apy}%</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border/50">
                  <span className="badge-chain text-[10px]">{asset.chain}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Assets Table - Desktop */}
        <motion.div variants={itemVariants} className="hidden md:block card-elevated overflow-hidden">
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
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortBy === "balance" ? "opacity-100" : "opacity-40"}`} />
                    </div>
                  </th>
                  <th
                    className="text-right px-4 py-3 text-small font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("value")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Value
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortBy === "value" ? "opacity-100" : "opacity-40"}`} />
                    </div>
                  </th>
                  <th
                    className="text-right px-4 py-3 text-small font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("change24h")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      24h Change
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortBy === "change24h" ? "opacity-100" : "opacity-40"}`} />
                    </div>
                  </th>
                  <th
                    className="text-right px-4 py-3 text-small font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => toggleSort("apy")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      APY
                      <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortBy === "apy" ? "opacity-100" : "opacity-40"}`} />
                    </div>
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredAssets.map((asset, index) => (
                    <motion.tr
                      key={asset.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => openAssetDetail(asset)}
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
                          ${asset.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <motion.div
                          className="flex items-center justify-end gap-1"
                          key={asset.change24h.toFixed(2)}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                        >
                          {asset.change24h >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                          )}
                          <span className={`text-small font-medium ${asset.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                          </span>
                        </motion.div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {asset.apy ? (
                          <span className="text-small font-medium text-success">{asset.apy}%</span>
                        ) : (
                          <span className="text-small text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <AssetActionsMenu
                          asset={asset}
                          onSend={() => openSendReceive("send", asset.symbol)}
                          onReceive={() => openSendReceive("receive", asset.symbol)}
                          onStake={() => setStakeOpen(true)}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-h3 font-semibold text-foreground mb-2">No assets found</h3>
            <p className="text-small text-muted-foreground mb-4">Try adjusting your filters</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </motion.div>
    </>
  );
}
