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
import { TrendingUp, TrendingDown, Activity, DollarSign, Percent, Calendar, Download, Bell } from "lucide-react";
import { useState } from "react";
import { PriceAlertDialog } from "./forms/PriceAlertDialog";

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

const chartConfig = {
  value: { label: "Portfolio", color: "hsl(var(--primary))" },
  benchmark: { label: "Benchmark", color: "hsl(var(--muted-foreground))" },
  earnings: { label: "Earnings", color: "hsl(var(--success))" },
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
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-sm md:text-base font-medium">Portfolio vs Benchmark</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] md:h-[300px] w-full">
            <AreaChart data={portfolioPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(v) => `$${v/1000}k`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="benchmark"
                stroke="hsl(var(--muted-foreground))"
                fill="hsl(var(--muted-foreground) / 0.1)"
                strokeWidth={2}
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
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
              <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
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
              <div className="flex-1 space-y-1.5 md:space-y-2 w-full">
                {assetAllocation.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs md:text-sm text-foreground">{item.name}</span>
                    </div>
                    <span className="text-xs md:text-sm font-mono text-muted-foreground">{item.value}%</span>
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
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[140px] md:h-[180px] w-full">
              <BarChart data={monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(v) => `$${v}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="earnings" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Yield Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {yieldBreakdown.map((item) => (
                <div key={item.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{item.source}</span>
                    <span className="text-sm font-mono text-muted-foreground">
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
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
          <CardHeader>
            <CardTitle className="text-base font-medium">Chain Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {chainActivity.map((chain) => (
                <div
                  key={chain.chain}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{chain.chain}</p>
                    <p className="text-xs text-muted-foreground">
                      {chain.transactions} transactions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-foreground">
                      ${chain.volume.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">volume</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
