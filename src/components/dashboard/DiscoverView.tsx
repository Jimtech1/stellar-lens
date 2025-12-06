import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Star, ExternalLink, Shield, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockYieldOpportunities } from "@/lib/mockData";
import { InvestDialog } from "./forms/InvestDialog";

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

export function DiscoverView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"apy" | "risk" | "tvl">("apy");
  const [investOpen, setInvestOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<typeof mockYieldOpportunities[0] | null>(null);

  const openInvest = (opp: typeof mockYieldOpportunities[0]) => {
    setSelectedOpportunity(opp);
    setInvestOpen(true);
  };

  const filteredOpportunities = mockYieldOpportunities
    .filter((opp) => {
      const matchesSearch = opp.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.asset.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || opp.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "apy") return b.apy - a.apy;
      if (sortBy === "risk") return a.riskScore - b.riskScore;
      if (sortBy === "tvl") return b.tvl - a.tvl;
      return 0;
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

  return (
    <>
      <InvestDialog open={investOpen} onOpenChange={setInvestOpen} opportunity={selectedOpportunity} />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-h1 font-bold text-foreground">Discover</h1>
        <p className="text-small text-muted-foreground">Find the best yield opportunities across chains</p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
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
        <div className="flex gap-2 bg-secondary rounded-lg p-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-small font-medium rounded-md transition-colors capitalize ${
                selectedCategory === cat
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          {[
            { key: "apy", label: "APY" },
            { key: "risk", label: "Risk" },
            { key: "tvl", label: "TVL" },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key as typeof sortBy)}
              className={`px-3 py-1.5 text-small font-medium rounded-lg border transition-colors ${
                sortBy === option.key
                  ? "border-primary text-primary bg-primary/5"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Opportunities Grid */}
      <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOpportunities.map((opp, index) => (
          <motion.div
            key={opp.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card-elevated p-5 hover:shadow-card transition-shadow group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                  {opp.protocolLogo}
                </div>
                <div>
                  <h3 className="text-small font-semibold text-foreground">{opp.protocol}</h3>
                  <p className="text-tiny text-muted-foreground">{opp.asset}</p>
                </div>
              </div>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-warning hover:bg-warning/10 transition-colors opacity-0 group-hover:opacity-100">
                <Star className="w-4 h-4" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-tiny text-muted-foreground mb-1">APY</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-h3 font-bold text-success">{opp.apy}%</span>
                </div>
              </div>
              <div>
                <p className="text-tiny text-muted-foreground mb-1">Risk</p>
                <div className="flex items-center gap-1">
                  <Shield className={`w-4 h-4 ${getRiskColor(opp.riskScore)}`} />
                  <span className={`text-small font-medium ${getRiskColor(opp.riskScore)}`}>
                    {getRiskLabel(opp.riskScore)}
                  </span>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="badge-chain">{opp.chain}</span>
                <span className="badge-chain capitalize">{opp.category}</span>
              </div>
              <p className="text-tiny text-muted-foreground">
                TVL: ${(opp.tvl / 1000000).toFixed(1)}M
              </p>
            </div>

            {/* Hover Action */}
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="sm" className="w-full" onClick={() => openInvest(opp)}>
                Invest Now
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredOpportunities.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-h3 font-semibold text-foreground mb-2">No opportunities found</h3>
          <p className="text-small text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      )}
    </motion.div>
    </>
  );
}
