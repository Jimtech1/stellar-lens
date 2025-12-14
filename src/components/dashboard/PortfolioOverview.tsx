import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Percent, Shield, PieChart, ArrowUpDown, Filter, Sparkles } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { portfolioHistory, portfolioStats, mockTransactions } from "@/lib/mockData";
import { DepositWithdrawDialog } from "./forms/DepositWithdrawDialog";
import { SwapDialog } from "./forms/SwapDialog";
import { EarnDialog } from "./forms/EarnDialog";
import { useLivePortfolio, useAnimatedCounter } from "@/hooks/useLiveData";

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

  // Live data hooks
  const liveStats = useLivePortfolio(portfolioStats);
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
                    className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] md:text-tiny font-medium rounded-md transition-colors ${
                      selectedTimeframe === period ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
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
                  className={`px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] md:text-xs font-medium rounded-md transition-colors ${
                    activityFilter === filter.key
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
                      <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        tx.type === 'deposit' ? 'bg-success/10' :
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
      </motion.div>
    </>
  );
}
