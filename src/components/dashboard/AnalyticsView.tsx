import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, TrendingDown, Activity, DollarSign, Percent, Calendar, Download, Bell, Shield, Zap, Clock, Target, Flame, Layers, BarChart3 } from "lucide-react";
import { useState } from "react";
import { PriceAlertDialog } from "./forms/PriceAlertDialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const portfolioPerformance = [
  { month: "Jan", value: 42000, benchmark: 40000 },
  { month: "Feb", value: 45000, benchmark: 41500 },
  { month: "Mar", value: 43500, benchmark: 42000 },
  { month: "Apr", value: 48000, benchmark: 43000 },
  { month: "May", value: 52000, benchmark: 44500 },
  { month: "Jun", value: 54500, benchmark: 45000 },
];

const assetAllocation = [
  { name: "Stellar (XLM)", value: 35, color: "hsl(var(--primary))" },
  { name: "USDC", value: 25, color: "hsl(var(--success))" },
  { name: "ETH (Bridged)", value: 20, color: "hsl(150, 60%, 50%)" },
  { name: "BTC (Bridged)", value: 15, color: "hsl(40, 90%, 50%)" },
  { name: "Other", value: 5, color: "hsl(var(--muted-foreground))" },
];

const yieldBreakdown = [
  { source: "Staking", amount: 234.5, percentage: 45 },
  { source: "LP Rewards", amount: 156.2, percentage: 30 },
  { source: "Lending", amount: 78.1, percentage: 15 },
  { source: "Airdrops", amount: 52.0, percentage: 10 },
];

const monthlyEarnings = [
  { month: "Jan", earnings: 85 },
  { month: "Feb", earnings: 92 },
  { month: "Mar", earnings: 78 },
  { month: "Apr", earnings: 110 },
  { month: "May", earnings: 125 },
  { month: "Jun", earnings: 142 },
];

const chainActivity = [
  { chain: "Stellar", transactions: 145, volume: 28500 },
  { chain: "Ethereum", transactions: 34, volume: 15200 },
  { chain: "Polygon", transactions: 67, volume: 8900 },
  { chain: "Arbitrum", transactions: 23, volume: 4500 },
];

// Protocol Performance Data
const protocolPerformance = [
  { protocol: "Soroswap", logo: "🔄", category: "DEX", yourApy: 12.5, avgApy: 8.2, rank: 1, tvl: 4200000, trend: "up" },
  { protocol: "Blend", logo: "💧", category: "Lending", yourApy: 9.8, avgApy: 7.5, rank: 3, tvl: 3800000, trend: "up" },
  { protocol: "AQUA Staking", logo: "🌊", category: "Staking", yourApy: 15.2, avgApy: 12.1, rank: 2, tvl: 2500000, trend: "up" },
  { protocol: "Phoenix DeFi", logo: "🔥", category: "DEX", yourApy: 8.1, avgApy: 9.2, rank: 5, tvl: 1800000, trend: "down" },
  { protocol: "Lumenswap", logo: "✨", category: "DEX", yourApy: 7.4, avgApy: 6.8, rank: 4, tvl: 1200000, trend: "up" },
];

// Risk Metrics Data
const riskMetrics = [
  { label: "Smart Contract Risk", value: 25, color: "hsl(var(--success))", description: "Low exposure to unaudited contracts" },
  { label: "Impermanent Loss", value: 42, color: "hsl(40, 90%, 50%)", description: "Moderate IL from LP positions" },
  { label: "Liquidity Risk", value: 18, color: "hsl(var(--success))", description: "High liquidity across positions" },
  { label: "Protocol Concentration", value: 35, color: "hsl(40, 90%, 50%)", description: "Diversified across 5 protocols" },
];

// Gas & Fee Analytics
const gasAnalytics = [
  { month: "Jan", fees: 12.5, avgNetwork: 18.2 },
  { month: "Feb", fees: 15.2, avgNetwork: 22.4 },
  { month: "Mar", fees: 8.9, avgNetwork: 14.6 },
  { month: "Apr", fees: 11.3, avgNetwork: 16.8 },
  { month: "May", fees: 9.7, avgNetwork: 15.2 },
  { month: "Jun", fees: 14.1, avgNetwork: 19.5 },
];

// Top Performing Assets
const topAssets = [
  { asset: "XLM", logo: "⭐", return30d: 18.5, return7d: 4.2, volume: 125000, volatility: "Medium" },
  { asset: "USDC", logo: "💵", return30d: 0.1, return7d: 0.02, volume: 890000, volatility: "Low" },
  { asset: "yXLM", logo: "🌟", return30d: 22.3, return7d: 5.8, volume: 45000, volatility: "High" },
  { asset: "AQUA", logo: "🌊", return30d: 15.2, return7d: -2.1, volume: 67000, volatility: "High" },
];

// DeFi Health Score Components
const healthScoreComponents = [
  { metric: "Diversification", score: 85, icon: Layers },
  { metric: "Liquidity", score: 92, icon: Zap },
  { metric: "Security", score: 78, icon: Shield },
  { metric: "Yield Efficiency", score: 88, icon: Target },
];

const chartConfig = {
  value: { label: "Portfolio", color: "hsl(var(--primary))" },
  benchmark: { label: "Benchmark", color: "hsl(var(--muted-foreground))" },
  earnings: { label: "Earnings", color: "hsl(var(--success))" },
  fees: { label: "Your Fees", color: "hsl(var(--primary))" },
  avgNetwork: { label: "Network Avg", color: "hsl(var(--muted-foreground))" },
};

export function AnalyticsView() {
  const [timeframe, setTimeframe] = useState("6m");
  const [priceAlertOpen, setPriceAlertOpen] = useState(false);

  return (
    <>
      <PriceAlertDialog open={priceAlertOpen} onOpenChange={setPriceAlertOpen} />
      
      <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">Analytics</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Track your portfolio performance and insights
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-28 md:w-32">
              <Calendar className="w-4 h-4 mr-1 md:mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setPriceAlertOpen(true)} className="text-xs md:text-sm">
            <Bell className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Price Alerts</span>
            <span className="sm:hidden">Alerts</span>
          </Button>
          <Button variant="outline" size="sm" className="text-xs md:text-sm">
            <Download className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Return</p>
                <p className="text-lg md:text-2xl font-semibold font-mono text-foreground">+29.76%</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-success" />
              </div>
            </div>
            <p className="text-[10px] md:text-xs text-success mt-1 md:mt-2">+5.2% vs benchmark</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Avg. APY</p>
                <p className="text-lg md:text-2xl font-semibold font-mono text-foreground">8.45%</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Percent className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-2">Across all positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total Yield</p>
                <p className="text-lg md:text-2xl font-semibold font-mono text-foreground">$520.80</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-success" />
              </div>
            </div>
            <p className="text-[10px] md:text-xs text-success mt-1 md:mt-2">+18% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Transactions</p>
                <p className="text-lg md:text-2xl font-semibold font-mono text-foreground">269</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-muted flex items-center justify-center">
                <Activity className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              </div>
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1 md:mt-2">This period</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Performance Chart */}
      <Card>
        <CardHeader className="pb-2 md:pb-4 px-3 md:px-6 pt-3 md:pt-6">
          <CardTitle className="text-sm md:text-base font-medium">Portfolio vs Benchmark</CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6 pt-0">
          <ChartContainer config={chartConfig} className="h-[180px] md:h-[300px] w-full">
            <AreaChart data={portfolioPerformance} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={9} 
                tickMargin={4}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={9} 
                tickFormatter={(v) => `$${v/1000}k`} 
                width={40}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="benchmark"
                stroke="hsl(var(--muted-foreground))"
                fill="hsl(var(--muted-foreground) / 0.1)"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.2)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Asset Allocation */}
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-base font-medium">Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-6">
              <div className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                      stroke="none"
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1 md:space-y-2 w-full">
                {assetAllocation.map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <div
                        className="w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[10px] md:text-sm text-foreground truncate">{item.name}</span>
                    </div>
                    <span className="text-[10px] md:text-sm font-mono text-muted-foreground ml-2">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Earnings */}
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-base font-medium">Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            <ChartContainer config={chartConfig} className="h-[120px] md:h-[180px] w-full">
              <BarChart data={monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={9} tickMargin={4} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={9} tickFormatter={(v) => `$${v}`} width={35} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="earnings" fill="hsl(var(--success))" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Yield Breakdown */}
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-base font-medium">Yield Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              {yieldBreakdown.map((item) => (
                <div key={item.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs md:text-sm text-foreground">{item.source}</span>
                    <span className="text-xs md:text-sm font-mono text-muted-foreground">
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chain Activity */}
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-base font-medium">Chain Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 md:space-y-3">
              {chainActivity.map((chain) => (
                <div
                  key={chain.chain}
                  className="flex items-center justify-between p-2 md:p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="text-xs md:text-sm font-medium text-foreground">{chain.chain}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">
                      {chain.transactions} transactions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs md:text-sm font-mono text-foreground">
                      ${chain.volume.toLocaleString()}
                    </p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">volume</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Protocol Performance Comparison */}
      <Card>
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-sm md:text-base font-medium flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Protocol Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Protocol</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Your APY</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Avg APY</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Rank</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">TVL</th>
                </tr>
              </thead>
              <tbody>
                {protocolPerformance.map((p) => (
                  <tr key={p.protocol} className="border-b border-border/50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.logo}</span>
                        <div>
                          <p className="font-medium text-foreground">{p.protocol}</p>
                          <p className="text-xs text-muted-foreground">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3">
                      <span className={`font-mono font-medium ${p.yourApy > p.avgApy ? 'text-success' : 'text-warning'}`}>
                        {p.yourApy}%
                      </span>
                    </td>
                    <td className="text-right py-3 font-mono text-muted-foreground">{p.avgApy}%</td>
                    <td className="text-right py-3">
                      <Badge variant={p.rank <= 2 ? "default" : "secondary"} className="text-xs">
                        #{p.rank}
                      </Badge>
                    </td>
                    <td className="text-right py-3 font-mono text-foreground">
                      ${(p.tvl / 1000000).toFixed(1)}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {protocolPerformance.map((p) => (
              <div key={p.protocol} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.logo}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.protocol}</p>
                      <p className="text-xs text-muted-foreground">{p.category}</p>
                    </div>
                  </div>
                  <Badge variant={p.rank <= 2 ? "default" : "secondary"} className="text-xs">
                    #{p.rank}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Your APY</p>
                    <p className={`font-mono font-medium ${p.yourApy > p.avgApy ? 'text-success' : 'text-warning'}`}>
                      {p.yourApy}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg APY</p>
                    <p className="font-mono text-foreground">{p.avgApy}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">TVL</p>
                    <p className="font-mono text-foreground">${(p.tvl / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk & Health Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Risk Exposure */}
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-base font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Risk Exposure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskMetrics.map((risk) => (
                <div key={risk.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs md:text-sm text-foreground">{risk.label}</span>
                    <span className="text-xs font-mono" style={{ color: risk.color }}>
                      {risk.value}%
                    </span>
                  </div>
                  <Progress value={risk.value} className="h-2" />
                  <p className="text-[10px] text-muted-foreground mt-1">{risk.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DeFi Health Score */}
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-base font-medium flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              DeFi Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-success/10 border-4 border-success">
                <span className="text-2xl md:text-3xl font-bold text-success">86</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Excellent Health</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {healthScoreComponents.map((item) => (
                <div key={item.metric} className="p-2 bg-muted/50 rounded-lg text-center">
                  <item.icon className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-mono font-medium text-foreground">{item.score}</p>
                  <p className="text-[10px] text-muted-foreground">{item.metric}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Assets & Gas Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top Performing Assets */}
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-base font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              Top Performing Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topAssets.map((asset) => (
                <div key={asset.asset} className="flex items-center justify-between p-2 md:p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{asset.logo}</span>
                    <div>
                      <p className="text-xs md:text-sm font-medium text-foreground">{asset.asset}</p>
                      <Badge variant="outline" className="text-[10px]">{asset.volatility}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs md:text-sm font-mono font-medium ${asset.return30d >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {asset.return30d >= 0 ? '+' : ''}{asset.return30d}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">30d return</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gas & Fee Analytics */}
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-sm md:text-base font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Fee Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[140px] md:h-[180px] w-full">
              <LineChart data={gasAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={9} tickMargin={4} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={9} tickFormatter={(v) => `$${v}`} width={35} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="fees" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="avgNetwork" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ChartContainer>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-primary rounded" />
                <span className="text-muted-foreground">Your Fees</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-muted-foreground rounded" style={{ borderStyle: 'dashed' }} />
                <span className="text-muted-foreground">Network Avg</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
