import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Percent, Shield, PieChart, ArrowUpDown, Filter } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { portfolioHistory, portfolioStats, mockTransactions } from "@/lib/mockData";
import { DepositWithdrawDialog } from "./forms/DepositWithdrawDialog";
import { StakeDialog } from "./forms/StakeDialog";
import { SendReceiveDialog } from "./forms/SendReceiveDialog";
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
  const [stakeOpen, setStakeOpen] = useState(false);
  const [sendReceiveOpen, setSendReceiveOpen] = useState(false);
  const [sendReceiveTab, setSendReceiveTab] = useState<"send" | "receive">("send");
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

  const openSendReceive = (tab: "send" | "receive") => {
    setSendReceiveTab(tab);
    setSendReceiveOpen(true);
  };

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
      <StakeDialog open={stakeOpen} onOpenChange={setStakeOpen} />
      <SendReceiveDialog open={sendReceiveOpen} onOpenChange={setSendReceiveOpen} initialTab={sendReceiveTab} />
      
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

        {/* Stats Grid - 2x2 on mobile, 4 cols on desktop */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Total Value */}
          <motion.div 
            className="card-elevated p-4 md:p-5"
            variants={pulseVariants}
            animate={lastUpdate === "totalValue" ? "pulse" : undefined}
          >
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="text-xs md:text-small text-muted-foreground">Total Value</span>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              </div>
            </div>
            <div className="text-lg md:text-2xl font-bold font-mono text-foreground transition-all">${animatedValue}</div>
            <div className="flex items-center gap-1 mt-1">
              {liveStats.change24h >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-success" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-destructive" />
              )}
              <span className={`text-xs md:text-small font-medium ${liveStats.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
                {liveStats.change24h >= 0 ? '+' : ''}{liveStats.change24h.toFixed(2)}%
              </span>
              <span className="text-[10px] md:text-tiny text-muted-foreground">24h</span>
            </div>
          </motion.div>

          {/* Yield Earned */}
          <motion.div className="card-elevated p-4 md:p-5" variants={pulseVariants}>
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="text-xs md:text-small text-muted-foreground">30D Earnings</span>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-success" />
              </div>
            </div>
            <div className="text-lg md:text-2xl font-bold font-mono text-success">${animatedYield}</div>
            <div className="text-xs md:text-small text-muted-foreground mt-1">
              Avg APY: {liveStats.avgApy}%
            </div>
          </motion.div>

          {/* Risk Score */}
          <motion.div className="card-elevated p-4 md:p-5" variants={pulseVariants}>
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="text-xs md:text-small text-muted-foreground">Risk Score</span>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 text-warning" />
              </div>
            </div>
            <div className="flex items-baseline gap-1 md:gap-2">
              <span className="text-lg md:text-2xl font-bold font-mono">{portfolioStats.riskScore}</span>
              <span className="text-xs md:text-small text-muted-foreground">/100</span>
            </div>
            <div className="text-xs md:text-small text-success mt-1">Low Risk</div>
          </motion.div>

          {/* Asset Diversity */}
          <motion.div className="card-elevated p-4 md:p-5" variants={pulseVariants}>
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="text-xs md:text-small text-muted-foreground">Asset Diversity</span>
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <PieChart className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
              </div>
            </div>
            <div className="text-lg md:text-2xl font-bold font-mono">{portfolioStats.assetCount}</div>
            <div className="text-xs md:text-small text-muted-foreground mt-1">Across 4 chains</div>
          </motion.div>
        </motion.div>

        {/* Quick Actions - Scrollable on mobile */}
        <motion.div variants={itemVariants} className="overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-4 min-w-max md:min-w-0">
            <button
              onClick={() => setDepositOpen(true)}
              className="card-elevated p-3 md:p-4 flex items-center gap-2 md:gap-3 hover:border-primary/30 transition-colors group flex-shrink-0 w-32 md:w-auto"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-success/10 text-success flex items-center justify-center text-base md:text-lg font-bold">
                ↓
              </div>
              <span className="font-medium text-sm md:text-base text-foreground group-hover:text-primary transition-colors">Deposit</span>
            </button>
            <button
              onClick={() => setWithdrawOpen(true)}
              className="card-elevated p-3 md:p-4 flex items-center gap-2 md:gap-3 hover:border-primary/30 transition-colors group flex-shrink-0 w-32 md:w-auto"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center text-base md:text-lg font-bold">
                ↑
              </div>
              <span className="font-medium text-sm md:text-base text-foreground group-hover:text-primary transition-colors">Withdraw</span>
            </button>
            <button
              onClick={() => openSendReceive("send")}
              className="card-elevated p-3 md:p-4 flex items-center gap-2 md:gap-3 hover:border-primary/30 transition-colors group flex-shrink-0 w-32 md:w-auto"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-base md:text-lg font-bold">
                ⇄
              </div>
              <span className="font-medium text-sm md:text-base text-foreground group-hover:text-primary transition-colors">Send</span>
            </button>
            <button
              onClick={() => setStakeOpen(true)}
              className="card-elevated p-3 md:p-4 flex items-center gap-2 md:gap-3 hover:border-primary/30 transition-colors group flex-shrink-0 w-32 md:w-auto"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center text-base md:text-lg font-bold">
                ◈
              </div>
              <span className="font-medium text-sm md:text-base text-foreground group-hover:text-primary transition-colors">Stake</span>
            </button>
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Performance Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-2 card-elevated p-4 md:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base md:text-h3 font-semibold text-foreground">Performance</h3>
              <div className="flex gap-1 bg-secondary rounded-lg p-1 overflow-x-auto">
                {timeframes.map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimeframe(period)}
                    className={`px-2 md:px-3 py-1 text-[10px] md:text-tiny font-medium rounded-md transition-colors whitespace-nowrap ${
                      selectedTimeframe === period ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioHistory}>
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
                    tick={{ fontSize: 10, fill: 'hsl(0, 0%, 45%)' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.06)',
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
          <motion.div variants={itemVariants} className="card-elevated p-4 md:p-5">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-base md:text-h3 font-semibold text-foreground">Recent Activity</h3>
              <Filter className="w-4 h-4 text-muted-foreground" />
            </div>
            
            {/* Activity Filter - Scrollable */}
            <div className="flex gap-1 mb-3 md:mb-4 overflow-x-auto pb-1 -mx-1 px-1">
              {activityFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActivityFilter(filter.key)}
                  className={`px-2 py-1 text-[10px] md:text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    activityFilter === filter.key
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="space-y-3 md:space-y-4 max-h-[280px] md:max-h-[320px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {filteredTransactions.slice(0, 5).map((tx) => (
                  <motion.div 
                    key={tx.id} 
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    layout
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${
                        tx.type === 'deposit' ? 'bg-success/10' :
                        tx.type === 'withdrawal' ? 'bg-destructive/10' :
                        tx.type === 'swap' ? 'bg-primary/10' : 'bg-warning/10'
                      }`}>
                        {tx.type === 'deposit' && <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-success" />}
                        {tx.type === 'withdrawal' && <TrendingDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-destructive" />}
                        {tx.type === 'swap' && <Percent className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />}
                        {tx.type === 'bridge' && <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-warning" />}
                      </div>
                      <div>
                        <p className="text-xs md:text-small font-medium text-foreground capitalize">{tx.type}</p>
                        <p className="text-[10px] md:text-tiny text-muted-foreground">{tx.asset}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs md:text-small font-mono font-medium text-foreground">
                        ${tx.value.toLocaleString()}
                      </p>
                      <p className={`text-[10px] md:text-tiny ${tx.status === 'completed' ? 'text-success' : tx.status === 'pending' ? 'text-warning' : 'text-destructive'}`}>
                        {tx.status}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xs md:text-small text-muted-foreground">No {activityFilter} transactions</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
