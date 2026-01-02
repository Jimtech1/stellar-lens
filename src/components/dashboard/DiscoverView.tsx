import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, ExternalLink, Shield, TrendingUp, SlidersHorizontal, X, ChevronDown, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockYieldOpportunities, YieldOpportunity } from "@/lib/mockData";
import { InvestDialog } from "./forms/InvestDialog";
import { ProtocolDetailModal } from "./modals/ProtocolDetailModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const categories = ["all", "lending", "liquidity", "staking"];
const chains = ["all", "Stellar", "Ethereum", "Polygon", "Arbitrum"];

type SortOption = "apy" | "risk" | "tvl";
type ViewMode = "grid" | "list";

export function DiscoverView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedChain, setSelectedChain] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("apy");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [investOpen, setInvestOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<YieldOpportunity | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [liveOpportunities, setLiveOpportunities] = useState(mockYieldOpportunities);
  const [protocolModalOpen, setProtocolModalOpen] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<YieldOpportunity | null>(null);
  
  const openProtocolDetail = (opp: YieldOpportunity) => {
    setSelectedProtocol(opp);
    setProtocolModalOpen(true);
  };

  // Simulate live APY updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveOpportunities((prev) =>
        prev.map((opp) => ({
          ...opp,
          apy: opp.apy + (Math.random() - 0.5) * 0.2,
          tvl: opp.tvl * (1 + (Math.random() - 0.5) * 0.01),
        }))
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const openInvest = (opp: YieldOpportunity) => {
    setSelectedOpportunity(opp);
    setInvestOpen(true);
  };

  const filteredOpportunities = liveOpportunities
    .filter((opp) => {
      const matchesSearch = opp.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.asset.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || opp.category === selectedCategory;
      const matchesChain = selectedChain === "all" || opp.chain === selectedChain;
      return matchesSearch && matchesCategory && matchesChain;
    })
    .sort((a, b) => {
      let aVal: number, bVal: number;
      if (sortBy === "apy") { aVal = a.apy; bVal = b.apy; }
      else if (sortBy === "risk") { aVal = a.riskScore; bVal = b.riskScore; }
      else { aVal = a.tvl; bVal = b.tvl; }
      
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-success";
    if (score < 60) return "text-warning";
    return "text-destructive";
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return "Low";
    if (score < 60) return "Medium";
    return "High";
  };

  const activeFiltersCount = 
    (selectedCategory !== "all" ? 1 : 0) + 
    (selectedChain !== "all" ? 1 : 0) + 
    (searchQuery ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedChain("all");
  };

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(option);
      setSortOrder(option === "risk" ? "asc" : "desc");
    }
  };

  return (
    <>
      <InvestDialog open={investOpen} onOpenChange={setInvestOpen} opportunity={selectedOpportunity} />
      <ProtocolDetailModal 
        open={protocolModalOpen} 
        onOpenChange={setProtocolModalOpen} 
        protocol={selectedProtocol}
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
            <h1 className="text-xl md:text-h1 font-bold text-foreground">Discover</h1>
            <p className="text-xs md:text-small text-muted-foreground">Find the best yield opportunities across chains</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">Live APY rates</span>
          </div>
        </motion.div>

        {/* Filters - Desktop */}
        <motion.div variants={itemVariants} className="hidden md:flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search protocols or assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-1.5 bg-secondary rounded-lg p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-small font-medium rounded-md transition-colors capitalize whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "all" ? "All Types" : cat}
              </button>
            ))}
          </div>

          {/* Chain Filter */}
          <div className="flex gap-1.5 bg-secondary rounded-lg p-1">
            {chains.map((chain) => (
              <button
                key={chain}
                onClick={() => setSelectedChain(chain)}
                className={`px-3 py-1.5 text-small font-medium rounded-md transition-colors capitalize whitespace-nowrap ${
                  selectedChain === chain
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {chain === "all" ? "All Chains" : chain}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-1.5">
            {([
              { key: "apy", label: "APY" },
              { key: "risk", label: "Risk" },
              { key: "tvl", label: "TVL" },
            ] as { key: SortOption; label: string }[]).map((option) => (
              <button
                key={option.key}
                onClick={() => toggleSort(option.key)}
                className={`px-3 py-1.5 text-small font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                  sortBy === option.key
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
                {sortBy === option.key && (
                  <ChevronDown className={`w-3 h-3 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} />
                )}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Mobile Filters */}
        <motion.div variants={itemVariants} className="md:hidden">
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

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-3">
                  {/* Category */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Category</p>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                            selectedCategory === cat
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {cat === "all" ? "All" : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chain */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Chain</p>
                    <div className="flex flex-wrap gap-1.5">
                      {chains.map((chain) => (
                        <button
                          key={chain}
                          onClick={() => setSelectedChain(chain)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                            selectedChain === chain
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {chain === "all" ? "All" : chain}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Sort by</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(["apy", "risk", "tvl"] as SortOption[]).map((option) => (
                        <button
                          key={option}
                          onClick={() => toggleSort(option)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors uppercase flex items-center gap-1 ${
                            sortBy === option
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {option}
                          {sortBy === option && <ChevronDown className={`w-3 h-3 ${sortOrder === "asc" ? "rotate-180" : ""}`} />}
                        </button>
                      ))}
                    </div>
                  </div>

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

        {/* Results Count */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <p className="text-xs md:text-small text-muted-foreground">
            {filteredOpportunities.length} opportunities found
          </p>
        </motion.div>

        {/* Opportunities Grid */}
        <motion.div 
          variants={itemVariants} 
          className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4" 
            : "space-y-3"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredOpportunities.map((opp, index) => (
              <motion.div
                key={opp.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
                className={`card-elevated p-4 md:p-5 hover:shadow-card transition-shadow group cursor-pointer ${
                  viewMode === "list" ? "flex flex-col sm:flex-row sm:items-center gap-4" : ""
                }`}
                onClick={() => openProtocolDetail(opp)}
              >
                {/* Header */}
                <div className={`flex items-start justify-between ${viewMode === "list" ? "sm:flex-1" : "mb-4"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-secondary flex items-center justify-center text-xl md:text-2xl shrink-0">
                      {opp.protocolLogo}
                    </div>
                    <div>
                      <h3 className="text-sm md:text-small font-semibold text-foreground">{opp.protocol}</h3>
                      <p className="text-xs md:text-tiny text-muted-foreground">{opp.asset}</p>
                    </div>
                  </div>
                  <button className="p-1.5 md:p-2 rounded-lg text-muted-foreground hover:text-warning hover:bg-warning/10 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100">
                    <Star className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>

                {/* Stats */}
                <div className={`grid grid-cols-2 gap-3 md:gap-4 ${viewMode === "list" ? "sm:flex sm:gap-8" : "mb-4"}`}>
                  <div>
                    <p className="text-[10px] md:text-tiny text-muted-foreground mb-0.5 md:mb-1">APY</p>
                    <motion.div 
                      className="flex items-center gap-1"
                      key={opp.apy.toFixed(1)}
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1 }}
                    >
                      <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-success" />
                      <span className="text-base md:text-h3 font-bold text-success">{opp.apy.toFixed(1)}%</span>
                    </motion.div>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-tiny text-muted-foreground mb-0.5 md:mb-1">Risk</p>
                    <div className="flex items-center gap-1">
                      <Shield className={`w-3.5 h-3.5 md:w-4 md:h-4 ${getRiskColor(opp.riskScore)}`} />
                      <span className={`text-xs md:text-small font-medium ${getRiskColor(opp.riskScore)}`}>
                        {getRiskLabel(opp.riskScore)}
                      </span>
                    </div>
                  </div>
                  {viewMode === "list" && (
                    <div className="hidden sm:block">
                      <p className="text-tiny text-muted-foreground mb-1">TVL</p>
                      <p className="text-small font-mono text-foreground">${(opp.tvl / 1000000).toFixed(1)}M</p>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className={`flex items-center justify-between ${viewMode === "list" ? "sm:flex-col sm:items-end sm:gap-2" : "pt-4 border-t border-border"}`}>
                  <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                    <span className="badge-chain text-[10px] md:text-xs">{opp.chain}</span>
                    <span className="badge-chain capitalize text-[10px] md:text-xs">{opp.category}</span>
                  </div>
                  {viewMode === "grid" && (
                    <p className="text-[10px] md:text-tiny text-muted-foreground">
                      TVL: ${(opp.tvl / 1000000).toFixed(1)}M
                    </p>
                  )}
                </div>

                {/* Hover Action */}
                <div className={`${viewMode === "list" ? "" : "mt-4"} opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity`}>
                  <Button variant="outline" size="sm" className="w-full text-xs md:text-sm" onClick={() => openInvest(opp)}>
                    Invest Now
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12 md:py-16">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
              <Search className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
            </div>
            <h3 className="text-base md:text-h3 font-semibold text-foreground mb-2">No opportunities found</h3>
            <p className="text-xs md:text-small text-muted-foreground mb-4">Try adjusting your filters or search query</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </motion.div>
    </>
  );
}
