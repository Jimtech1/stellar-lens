import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Percent, Shield, PieChart } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { portfolioHistory, portfolioStats, mockTransactions } from "@/lib/mockData";

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

export function PortfolioOverview() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Title */}
      <motion.div variants={itemVariants}>
        <h1 className="text-h1 font-bold text-foreground">Portfolio Overview</h1>
        <p className="text-small text-muted-foreground">Track your cross-chain assets and earnings</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value */}
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-small text-muted-foreground">Total Value</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="stat-number font-mono">${portfolioStats.totalValue.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1">
            {portfolioStats.change24h >= 0 ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <span className={`text-small font-medium ${portfolioStats.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
              {portfolioStats.change24h >= 0 ? '+' : ''}{portfolioStats.change24h}%
            </span>
            <span className="text-tiny text-muted-foreground">24h</span>
          </div>
        </div>

        {/* Yield Earned */}
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-small text-muted-foreground">30D Earnings</span>
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
          </div>
          <div className="stat-number font-mono text-success">${portfolioStats.totalYield.toLocaleString()}</div>
          <div className="text-small text-muted-foreground mt-1">
            Avg APY: {portfolioStats.avgApy}%
          </div>
        </div>

        {/* Risk Score */}
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-small text-muted-foreground">Risk Score</span>
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-warning" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="stat-number font-mono">{portfolioStats.riskScore}</span>
            <span className="text-small text-muted-foreground">/100</span>
          </div>
          <div className="text-small text-success mt-1">Low Risk</div>
        </div>

        {/* Asset Diversity */}
        <div className="card-elevated p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-small text-muted-foreground">Asset Diversity</span>
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <PieChart className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div className="stat-number font-mono">{portfolioStats.assetCount}</div>
          <div className="text-small text-muted-foreground mt-1">Across 4 chains</div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 card-elevated p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h3 font-semibold text-foreground">Performance</h3>
            <div className="flex gap-1 bg-secondary rounded-lg p-1">
              {['1D', '1W', '1M', '3M', '1Y'].map((period, i) => (
                <button
                  key={period}
                  className={`px-3 py-1 text-tiny font-medium rounded-md transition-colors ${
                    i === 2 ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-64">
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
                  tick={{ fontSize: 12, fill: 'hsl(0, 0%, 45%)' }} 
                />
                <YAxis 
                  hide 
                  domain={['dataMin - 500', 'dataMax + 500']} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(0, 0%, 88%)',
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
        <motion.div variants={itemVariants} className="card-elevated p-5">
          <h3 className="text-h3 font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {mockTransactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.type === 'deposit' ? 'bg-success/10' :
                    tx.type === 'withdrawal' ? 'bg-destructive/10' :
                    tx.type === 'swap' ? 'bg-primary/10' : 'bg-warning/10'
                  }`}>
                    {tx.type === 'deposit' && <TrendingUp className="w-4 h-4 text-success" />}
                    {tx.type === 'withdrawal' && <TrendingDown className="w-4 h-4 text-destructive" />}
                    {tx.type === 'swap' && <Percent className="w-4 h-4 text-primary" />}
                    {tx.type === 'bridge' && <DollarSign className="w-4 h-4 text-warning" />}
                  </div>
                  <div>
                    <p className="text-small font-medium text-foreground capitalize">{tx.type}</p>
                    <p className="text-tiny text-muted-foreground">{tx.asset}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-small font-mono font-medium text-foreground">
                    ${tx.value.toLocaleString()}
                  </p>
                  <p className={`text-tiny ${tx.status === 'completed' ? 'text-success' : tx.status === 'pending' ? 'text-warning' : 'text-destructive'}`}>
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
