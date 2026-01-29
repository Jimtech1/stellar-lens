import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, DollarSign, Percent, Shield, PieChart, ArrowUpDown, Filter, Sparkles,
  Layers, Gift, AlertTriangle, CheckCircle, Bell, Target, Activity, Lock, Droplets, Building2, Users, ChevronRight, BarChart3, Trophy
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart as RechartsPie, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { portfolioHistory, portfolioStats, mockTransactions } from "@/lib/mockData";
import { DepositWithdrawDialog } from "./forms/DepositWithdrawDialog";
import { SwapDialog } from "./forms/SwapDialog";
import { EarnDialog } from "./forms/EarnDialog";
import { useLivePortfolio, useAnimatedCounter } from "@/hooks/useLiveData";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Mock Soroban positions data
const sorobanPositions = [
  {
    id: "soroswap-xlm-usdc",
    protocol: "Soroswap",
    type: "LP" as const,
    pool: "XLM/USDC",
    value: 4258.47,
    change24h: 2.3,
    share: 0.45,
    lpTokens: 124.78,
    tokenA: { symbol: "XLM", amount: 5240.78, value: 512.43 },
    tokenB: { symbol: "USDC", amount: 3745.92, value: 3746.01 },
    apr: 24.7,
    dailyRewards: 2.89,
    fees7d: 15.23,
    impermanentLoss: -0.8,
    risk: 3,
    audited: true,
    trending: true
  },
  {
    id: "blend-usdc-lending",
    protocol: "Blend",
    type: "Lending" as const,
    pool: "USDC Lending",
    value: 12450.00,
    change24h: 0.8,
    supplied: 15000.00,
    borrowed: 2550.00,
    utilization: 17,
    supplyApy: 3.2,
    dailyYield: 1.31,
    healthFactor: 2.8,
    borrowApr: 5.7,
    borrowLimit: 8500,
    netApy: 1.8,
    dailyNet: 0.74,
    liquidationThreshold: 12750,
    risk: 2,
    audited: true,
    trending: false
  },
  {
    id: "aqua-staking",
    protocol: "AQUA",
    type: "Staking" as const,
    pool: "AQUA Staking",
    value: 8450.00,
    change24h: 5.2,
    staked: 125000,
    votingPower: 1200000,
    apr: 18.4,
    dailyRewards: 4.26,
    claimable: { amount: 2450, value: 98 },
    activeVotes: 3,
    votingRank: 245,
    lockPeriod: 30,
    unlocksIn: 12,
    risk: 1,
    audited: true,
    trending: true
  }
];

// Yield distribution data
const yieldDistribution = [
  { name: "Soroswap LP", value: 42, color: "#2962FF" },
  { name: "Blend Lending", value: 28, color: "#00C853" },
  { name: "AQUA Staking", value: 18, color: "#FF6D00" },
  { name: "Other", value: 12, color: "#7C4DFF" }
];

// Risk exposure data
const riskExposure = {
  protocol: { high: 15, medium: 45, low: 40 },
  assets: [
    { name: "USDC", percentage: 40 },
    { name: "XLM", percentage: 35 },
    { name: "AQUA", percentage: 15 },
    { name: "Other", percentage: 10 }
  ]
};

// Protocol health data
const protocolHealth = [
  { name: "Soroswap", status: "operational" as const, detail: "Last block: 2s ago" },
  { name: "Blend", status: "operational" as const, detail: "Utilization: 67%" },
  { name: "AQUA", status: "warning" as const, detail: "Token: -8.2% (24h)" }
];

// Active alerts
const activeAlerts = [
  { id: 1, message: "APY dropped >5% on XLM/USDC pool", type: "warning" },
  { id: 2, message: "Claimable rewards >$100", type: "info" }
];

// Performance comparison data
const performanceComparison = [
  { protocol: "Soroswap", type: "LP", yourApy: 24.7, avgApy: 22.3, rank: "Top 15%", rankColor: "text-success" },
  { protocol: "Blend", type: "Supply", yourApy: 3.2, avgApy: 3.5, rank: "Average", rankColor: "text-muted-foreground" },
  { protocol: "Blend", type: "Borrow", yourApy: 5.7, avgApy: 5.2, rank: "Top 25%", rankColor: "text-success" },
  { protocol: "AQUA", type: "Stake", yourApy: 18.4, avgApy: 16.8, rank: "Top 10%", rankColor: "text-success" }
];

// Optimization opportunities
const optimizationOpportunities = [
  "Increase Blend supply for +0.8% APY boost",
  "Rebalance XLM/USDC pool for +1.2% IL reduction"
];

// Helper functions
const getRiskColor = (risk: number) => {
  if (risk <= 2) return "text-success";
  if (risk <= 3) return "text-warning";
  return "text-destructive";
};

const getRiskLabel = (risk: number) => {
  if (risk <= 2) return "Low";
  if (risk <= 3) return "Medium";
  return "High";
};

const getStatusIcon = (status: string) => {
  if (status === "operational") return <CheckCircle className="w-3.5 h-3.5 text-success" />;
  if (status === "warning") return <AlertTriangle className="w-3.5 h-3.5 text-warning" />;
  return <Activity className="w-3.5 h-3.5 text-muted-foreground" />;
};

// Calculate totals
const totalClaimable = sorobanPositions.reduce((acc, pos) => {
  if (pos.type === "Staking" && pos.claimable) {
    return acc + pos.claimable.value;
  }
  return acc;
}, 0) + 325.87;

const averageApy = sorobanPositions.reduce((acc, pos) => acc + (pos.apr || pos.supplyApy || 0), 0) / sorobanPositions.length;
const monthlyYield = 423.87;
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

const pulseVariants = {
  pulse: {
    scale: [1, 1.02, 1],
    transition: { duration: 0.3 },
  },
};

type TimeFrame = "1D" | "1W" | "1M" | "3M" | "1Y";
type ActivityFilter = "all" | "deposit" | "withdrawal" | "swap" | "bridge";

export function PortfolioOverview() {
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [earnOpen, setEarnOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>("1M");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  // Real Data Fetching
  const { data: portfolioData, isLoading: isPortfolioLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      try {
        // Try fetching real data
        return await api.get<any>('/portfolio');
      } catch (e) {
        console.warn("Using mock data due to API error", e);
        // Fallback to mock data structure on error (or for demo)
        return {
          totalValue: portfolioStats.totalValue,
          change24h: portfolioStats.change24h,
          totalYield: portfolioStats.totalYield,
          avgApy: portfolioStats.avgApy,
          riskScore: portfolioStats.riskScore,
          assetCount: portfolioStats.assetCount,
          history: portfolioHistory
        };
      }
    }
  });

  // Use real data if available, else fallback provided by queryFn catch
  const stats = portfolioData || portfolioStats;

  // Live data hooks (wrapping the fetched stats)
  const liveStats = useLivePortfolio(stats);
  const animatedValue = useAnimatedCounter(liveStats.totalValue, 500, (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  const animatedYield = useAnimatedCounter(liveStats.totalYield, 500, (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

  // Track value updates for animation
  useEffect(() => {
    setLastUpdate("totalValue");
    const timer = setTimeout(() => setLastUpdate(null), 300);
    return () => clearTimeout(timer);
  }, [liveStats.totalValue]);

  // Listen for navigate-to-discover events from EarnDialog
  useEffect(() => {
    const handleNavigate = () => {
      window.dispatchEvent(new CustomEvent('set-dashboard-view', { detail: 'discover' }));
    };
    window.addEventListener('navigate-to-discover', handleNavigate);
    return () => window.removeEventListener('navigate-to-discover', handleNavigate);
  }, []);

  const filteredTransactions = mockTransactions.filter(
    (tx) => activityFilter === "all" || tx.type === activityFilter
  );

  const timeframes: TimeFrame[] = ["1D", "1W", "1M", "3M", "1Y"];
  const activityFilters: { key: ActivityFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "deposit", label: "Deposit" },
    { key: "withdrawal", label: "Withdraw" },
    { key: "swap", label: "Swap" },
    { key: "bridge", label: "Bridge" },
  ];

  return (
    <>
      <DepositWithdrawDialog open={depositOpen} onOpenChange={setDepositOpen} type="deposit" />
      <DepositWithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} type="withdraw" />
      <SwapDialog open={swapOpen} onOpenChange={setSwapOpen} />
      <EarnDialog open={earnOpen} onOpenChange={setEarnOpen} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 md:space-y-6"
      >
        {/* Page Title */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl md:text-h1 font-bold text-foreground">Portfolio Overview</h1>
            <p className="text-xs md:text-small text-muted-foreground">Track your cross-chain assets and earnings</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">Live updates</span>
          </div>
        </motion.div>

        {/* Stats Grid - Fully visible 2x2 grid on mobile */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {/* Total Value */}
          <motion.div
            className="card-elevated p-3 sm:p-4 md:p-5 min-w-0"
            variants={pulseVariants}
            animate={lastUpdate === "totalValue" ? "pulse" : undefined}
          >
            <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-3">
              <span className="text-[10px] sm:text-xs md:text-small text-muted-foreground truncate">Total Value</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary" />
              </div>
            </div>
            <div className="text-sm sm:text-lg md:text-2xl font-bold font-mono text-foreground transition-all truncate">${animatedValue}</div>
            <div className="flex items-center gap-1 mt-1">
              {liveStats.change24h >= 0 ? (
                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-success flex-shrink-0" />
              ) : (
                <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-destructive flex-shrink-0" />
              )}
              <span className={`text-[10px] sm:text-xs md:text-small font-medium ${liveStats.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                {liveStats.change24h >= 0 ? '+' : ''}{liveStats.change24h.toFixed(2)}%
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-tiny text-muted-foreground">24h</span>
            </div>
          </motion.div>

          {/* Yield Earned */}
          <motion.div className="card-elevated p-3 sm:p-4 md:p-5 min-w-0" variants={pulseVariants}>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-3">
              <span className="text-[10px] sm:text-xs md:text-small text-muted-foreground truncate">30D Earnings</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-success" />
              </div>
            </div>
            <div className="text-sm sm:text-lg md:text-2xl font-bold font-mono text-success truncate">${animatedYield}</div>
            <div className="text-[10px] sm:text-xs md:text-small text-muted-foreground mt-1 truncate">
              APY: {liveStats.avgApy}%
            </div>
          </motion.div>

          {/* Risk Score */}
          <motion.div className="card-elevated p-3 sm:p-4 md:p-5 min-w-0" variants={pulseVariants}>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-3">
              <span className="text-[10px] sm:text-xs md:text-small text-muted-foreground truncate">Risk Score</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-warning" />
              </div>
            </div>
            <div className="flex items-baseline gap-0.5 sm:gap-1 md:gap-2">
              <span className="text-sm sm:text-lg md:text-2xl font-bold font-mono">{portfolioStats.riskScore}</span>
              <span className="text-[10px] sm:text-xs md:text-small text-muted-foreground">/100</span>
            </div>
            <div className="text-[10px] sm:text-xs md:text-small text-success mt-1">Low Risk</div>
          </motion.div>

          {/* Asset Diversity */}
          <motion.div className="card-elevated p-3 sm:p-4 md:p-5 min-w-0" variants={pulseVariants}>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-3">
              <span className="text-[10px] sm:text-xs md:text-small text-muted-foreground truncate">Assets</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <PieChart className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-accent" />
              </div>
            </div>
            <div className="text-sm sm:text-lg md:text-2xl font-bold font-mono">{portfolioStats.assetCount}</div>
            <div className="text-[10px] sm:text-xs md:text-small text-muted-foreground mt-1 truncate">4 chains</div>
          </motion.div>
        </motion.div>

        {/* Quick Actions - 2x2 grid on mobile, 4 cols on desktop */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setDepositOpen(true)}
              className="card-elevated p-3 sm:p-4 flex items-center gap-2 sm:gap-3 hover:border-primary/30 transition-colors group active:scale-[0.98]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-success/10 text-success flex items-center justify-center text-sm sm:text-base md:text-lg font-bold flex-shrink-0">
                ↓
              </div>
              <span className="font-medium text-xs sm:text-sm md:text-base text-foreground group-hover:text-primary transition-colors">Deposit</span>
            </button>
            <button
              onClick={() => setWithdrawOpen(true)}
              className="card-elevated p-3 sm:p-4 flex items-center gap-2 sm:gap-3 hover:border-primary/30 transition-colors group active:scale-[0.98]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center text-sm sm:text-base md:text-lg font-bold flex-shrink-0">
                ↑
              </div>
              <span className="font-medium text-xs sm:text-sm md:text-base text-foreground group-hover:text-primary transition-colors">Withdraw</span>
            </button>
            <button
              onClick={() => setSwapOpen(true)}
              className="card-elevated p-3 sm:p-4 flex items-center gap-2 sm:gap-3 hover:border-primary/30 transition-colors group active:scale-[0.98]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <ArrowUpDown className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
              </div>
              <span className="font-medium text-xs sm:text-sm md:text-base text-foreground group-hover:text-primary transition-colors">Swap</span>
            </button>
            <button
              onClick={() => setEarnOpen(true)}
              className="card-elevated p-3 sm:p-4 flex items-center gap-2 sm:gap-3 hover:border-primary/30 transition-colors group active:scale-[0.98]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
              </div>
              <span className="font-medium text-xs sm:text-sm md:text-base text-foreground group-hover:text-primary transition-colors">Earn</span>
            </button>
          </div>
        </motion.div>

        {/* Charts Row - Stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Performance Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2 card-elevated p-3 sm:p-4 md:p-5">
            <div className="flex items-center justify-between gap-2 mb-3 md:mb-4">
              <h3 className="text-xs sm:text-sm md:text-h3 font-semibold text-foreground">Performance</h3>
              <div className="flex gap-0.5 bg-secondary rounded-lg p-0.5 sm:p-1">
                {timeframes.map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimeframe(period)}
                    className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] md:text-tiny font-medium rounded-md transition-colors ${selectedTimeframe === period ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-36 sm:h-44 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioHistory} margin={{ left: -10, right: 0, top: 4, bottom: 0 }}>
                  <defs>
                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(224, 100%, 58%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(224, 100%, 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 8, fill: 'hsl(0, 0%, 45%)' }}
                    interval="preserveStartEnd"
                    tickMargin={4}
                  />
                  <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.06)',
                      fontSize: '11px',
                      padding: '8px 12px',
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(224, 100%, 58%)"
                    strokeWidth={2}
                    fill="url(#portfolioGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="card-elevated p-3 sm:p-4 md:p-5">
            <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
              <h3 className="text-xs sm:text-sm md:text-h3 font-semibold text-foreground">Recent Activity</h3>
              <Filter className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
            </div>

            {/* Activity Filter */}
            <div className="flex flex-wrap gap-1 mb-2 sm:mb-3 md:mb-4">
              {activityFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActivityFilter(filter.key)}
                  className={`px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] md:text-xs font-medium rounded-md transition-colors ${activityFilter === filter.key
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="space-y-2 sm:space-y-3 md:space-y-4 max-h-[180px] sm:max-h-[220px] md:max-h-[320px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {filteredTransactions.slice(0, 5).map((tx) => (
                  <motion.div
                    key={tx.id}
                    className="flex items-center justify-between gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    layout
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 min-w-0">
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${tx.type === 'deposit' ? 'bg-success/10' :
                        tx.type === 'withdrawal' ? 'bg-destructive/10' :
                          tx.type === 'swap' ? 'bg-primary/10' : 'bg-warning/10'
                        }`}>
                        {tx.type === 'deposit' && <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-success" />}
                        {tx.type === 'withdrawal' && <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-destructive" />}
                        {tx.type === 'swap' && <Percent className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary" />}
                        {tx.type === 'bridge' && <DollarSign className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-warning" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs md:text-small font-medium text-foreground capitalize truncate">{tx.type}</p>
                        <p className="text-[9px] sm:text-[10px] md:text-tiny text-muted-foreground truncate">{tx.asset}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] sm:text-xs md:text-small font-mono font-medium text-foreground">
                        ${tx.value.toLocaleString()}
                      </p>
                      <p className={`text-[9px] sm:text-[10px] md:text-tiny ${tx.status === 'completed' ? 'text-success' : tx.status === 'pending' ? 'text-warning' : 'text-destructive'}`}>
                        {tx.status}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-4 sm:py-6 md:py-8">
                  <p className="text-[10px] sm:text-xs md:text-small text-muted-foreground">No {activityFilter} transactions</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Claimable Rewards Banner */}
        <motion.div variants={itemVariants} className="card-elevated p-3 sm:p-4 bg-gradient-to-r from-warning/10 via-transparent to-warning/10 border-warning/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Claimable Rewards Available</p>
                <p className="text-xs text-muted-foreground">${totalClaimable.toFixed(2)} across {sorobanPositions.length} protocols</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-warning text-warning-foreground rounded-lg text-sm font-medium hover:bg-warning/90 transition-colors flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Claim All
            </button>
          </div>
        </motion.div>

        {/* Soroban Protocol Positions */}
        <motion.div variants={itemVariants} className="card-elevated p-3 sm:p-4 md:p-5">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-xs sm:text-sm md:text-h3 font-semibold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Soroban Protocol Positions
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                {sorobanPositions.length} Active
              </Badge>
              <span className="text-xs text-muted-foreground">Avg APY: <span className="text-success font-medium">{averageApy.toFixed(1)}%</span></span>
            </div>
          </div>

          <div className="space-y-3">
            {sorobanPositions.map((position) => (
              <div key={position.id} className="p-3 rounded-xl border border-border/50 bg-background/50 hover:border-primary/30 transition-all">
                {/* Protocol Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      {position.type === "LP" && <Droplets className="w-4 h-4 text-primary" />}
                      {position.type === "Lending" && <Building2 className="w-4 h-4 text-primary" />}
                      {position.type === "Staking" && <Lock className="w-4 h-4 text-primary" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-foreground">{position.protocol}</span>
                        {position.audited && <Badge variant="outline" className="text-[9px] px-1 py-0 bg-success/10 text-success border-success/20">🛡️</Badge>}
                        {position.trending && <Badge variant="outline" className="text-[9px] px-1 py-0 bg-warning/10 text-warning border-warning/20">🔥</Badge>}
                      </div>
                      <span className="text-xs text-muted-foreground">{position.pool}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${getRiskColor(position.risk)}`}>
                    {getRiskLabel(position.risk)} Risk
                  </Badge>
                </div>

                {/* Position Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Value</p>
                    <p className="text-sm font-bold font-mono">${position.value.toLocaleString()}</p>
                    <span className={`text-[10px] ${position.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {position.change24h >= 0 ? '+' : ''}{position.change24h}%
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">{position.type === "Lending" ? "Net APY" : "APR"}</p>
                    <p className="text-sm font-bold text-success">{position.type === "Lending" ? position.netApy : position.apr}%</p>
                    <span className="text-[10px] text-muted-foreground">~${position.dailyRewards || position.dailyNet || position.dailyYield}/day</span>
                  </div>
                  {position.type === "LP" && (
                    <>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Pool Share</p>
                        <p className="text-sm font-bold">{position.share}%</p>
                        <span className="text-[10px] text-muted-foreground">Fees: ${position.fees7d}</span>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">IL</p>
                        <p className={`text-sm font-bold ${position.impermanentLoss < 0 ? 'text-destructive' : 'text-success'}`}>{position.impermanentLoss}%</p>
                      </div>
                    </>
                  )}
                  {position.type === "Lending" && (
                    <>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Health Factor</p>
                        <p className={`text-sm font-bold ${position.healthFactor >= 2 ? 'text-success' : 'text-warning'}`}>{position.healthFactor}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Utilization</p>
                        <p className="text-sm font-bold">{position.utilization}%</p>
                      </div>
                    </>
                  )}
                  {position.type === "Staking" && (
                    <>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Claimable</p>
                        <p className="text-sm font-bold text-warning">${position.claimable?.value}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Unlocks</p>
                        <p className="text-sm font-bold">{position.unlocksIn}d</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Yield & Risk Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Yield Distribution */}
          <motion.div variants={itemVariants} className="card-elevated p-3 sm:p-4 md:p-5">
            <h3 className="text-xs sm:text-sm md:text-h3 font-semibold text-foreground mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              Yield Distribution
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie data={yieldDistribution} cx="50%" cy="50%" innerRadius={25} outerRadius={45} paddingAngle={2} dataKey="value">
                      {yieldDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1.5">
                {yieldDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
                <div className="pt-1.5 border-t border-border/50 flex justify-between text-xs">
                  <span className="text-muted-foreground">Monthly</span>
                  <span className="font-bold text-success">${monthlyYield}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Protocol Health */}
          <motion.div variants={itemVariants} className="card-elevated p-3 sm:p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs sm:text-sm md:text-h3 font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Protocol Health
              </h3>
              <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/20">
                <Bell className="w-3 h-3 mr-1" />
                {activeAlerts.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {protocolHealth.map((protocol) => (
                <div key={protocol.name} className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/30">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(protocol.status)}
                    <div>
                      <p className="text-xs font-medium">{protocol.name}</p>
                      <p className="text-[10px] text-muted-foreground">{protocol.detail}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[9px] ${protocol.status === "operational" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}`}>
                    {protocol.status === "operational" ? "OK" : "Alert"}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
              {activeAlerts.slice(0, 2).map((alert) => (
                <div key={alert.id} className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                  <AlertTriangle className="w-3 h-3 text-warning mt-0.5 flex-shrink-0" />
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Comparison Table */}
        <motion.div variants={itemVariants} className="card-elevated p-3 sm:p-4 md:p-5">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-xs sm:text-sm md:text-h3 font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Performance Comparison
            </h3>
            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
              vs Market Average
            </Badge>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="text-xs text-muted-foreground h-10">Protocol</TableHead>
                  <TableHead className="text-xs text-muted-foreground h-10">Type</TableHead>
                  <TableHead className="text-xs text-muted-foreground h-10 text-right">Your APY</TableHead>
                  <TableHead className="text-xs text-muted-foreground h-10 text-right">Avg APY</TableHead>
                  <TableHead className="text-xs text-muted-foreground h-10 text-right">Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceComparison.map((item, index) => (
                  <TableRow key={index} className="border-border/30 hover:bg-muted/30">
                    <TableCell className="py-3 text-sm font-medium">{item.protocol}</TableCell>
                    <TableCell className="py-3 text-sm text-muted-foreground">{item.type}</TableCell>
                    <TableCell className="py-3 text-sm font-mono text-right text-success font-medium">{item.yourApy}%</TableCell>
                    <TableCell className="py-3 text-sm font-mono text-right text-muted-foreground">{item.avgApy}%</TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.rank.includes("Top") && <Trophy className="w-3 h-3 text-warning" />}
                        <span className={`text-sm font-medium ${item.rankColor}`}>{item.rank}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-2">
            {performanceComparison.map((item, index) => (
              <div key={index} className="p-3 rounded-lg bg-background/50 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{item.protocol}</span>
                    <Badge variant="outline" className="text-[9px]">{item.type}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.rank.includes("Top") && <Trophy className="w-3 h-3 text-warning" />}
                    <span className={`text-xs font-medium ${item.rankColor}`}>{item.rank}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-muted-foreground">Your APY: </span>
                    <span className="font-mono text-success font-medium">{item.yourApy}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg: </span>
                    <span className="font-mono text-muted-foreground">{item.avgApy}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Optimization Opportunities */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">Optimization Opportunities</span>
            </div>
            <div className="space-y-1.5">
              {optimizationOpportunities.map((opp, index) => (
                <div key={index} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                  <ChevronRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                  <span>{opp}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Risk Exposure Matrix */}
        <motion.div variants={itemVariants} className="card-elevated p-3 sm:p-4 md:p-5">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h3 className="text-xs sm:text-sm md:text-h3 font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Risk Exposure Matrix
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Protocol Risk Distribution */}
            <div className="p-3 rounded-xl bg-background/50 border border-border/30">
              <h4 className="text-xs font-medium text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                Protocol Risk Distribution
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-destructive font-medium">High Risk</span>
                    <span className="font-mono">{riskExposure.protocol.high}%</span>
                  </div>
                  <Progress value={riskExposure.protocol.high} className="h-2 bg-muted" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-warning font-medium">Medium Risk</span>
                    <span className="font-mono">{riskExposure.protocol.medium}%</span>
                  </div>
                  <Progress value={riskExposure.protocol.medium} className="h-2 bg-muted" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-success font-medium">Low Risk</span>
                    <span className="font-mono">{riskExposure.protocol.low}%</span>
                  </div>
                  <Progress value={riskExposure.protocol.low} className="h-2 bg-muted" />
                </div>
              </div>

              {/* Smart Contract Exposure */}
              <div className="mt-4 pt-3 border-t border-border/50">
                <h5 className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Smart Contract Exposure</h5>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span>Audited</span>
                  </div>
                  <span className="font-mono text-success">92%</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-warning" />
                    <span>Beta</span>
                  </div>
                  <span className="font-mono text-warning">8%</span>
                </div>
              </div>
            </div>

            {/* Asset Concentration */}
            <div className="p-3 rounded-xl bg-background/50 border border-border/30">
              <h4 className="text-xs font-medium text-foreground mb-3 flex items-center gap-2">
                <PieChart className="w-3.5 h-3.5 text-primary" />
                Asset Concentration
              </h4>
              <div className="space-y-2.5">
                {riskExposure.assets.map((asset) => (
                  <div key={asset.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium">{asset.name}</span>
                      <span className="font-mono text-muted-foreground">{asset.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all"
                        style={{ width: `${asset.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Concentration Warning */}
              <div className="mt-4 pt-3 border-t border-border/50">
                <div className="flex items-start gap-2 p-2 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-medium text-warning">Concentration Alert</p>
                    <p className="text-[10px] text-muted-foreground">USDC exposure at 40% - consider diversifying</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
