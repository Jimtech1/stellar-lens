import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, DollarSign, Percent, Calendar, Activity, Layers, Bell, Download } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

const chartConfig = {
  value: { label: "Portfolio", color: "hsl(var(--primary))" },
  benchmark: { label: "Benchmark", color: "hsl(var(--muted-foreground))" },
};

export function AnalyticsView() {
  const [timeframe, setTimeframe] = useState("6m");

  // Fetch Portfolio History
  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['portfolio_history', timeframe],
    queryFn: async () => {
      const res = await api.get<any[]>(`/portfolio/history?period=${timeframe}`);
      return res || [];
    }
  });

  // Fetch PnL/Summary
  const { data: summary } = useQuery({
    queryKey: ['portfolio_summary'],
    queryFn: async () => {
      return await api.get<any>('/portfolio/summary');
    }
  });

  // Fetch Asset Allocation
  const { data: assets = [] } = useQuery({
    queryKey: ['portfolio_assets'],
    queryFn: async () => {
      const res = await api.get<any[]>('/portfolio/assets');
      return res || [];
    }
  });

  const processedAllocation = assets.map((a: any) => ({
    name: a.symbol,
    value: (a.balance * (a.price || 0)),
    color: "hsl(var(--primary))" // Simplified for now, could generate colors
  })).filter((a: any) => a.value > 0);

  if (historyLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">Analytics</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Track your portfolio performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold font-mono">${summary?.totalValue?.toLocaleString() || '0.00'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Return</p>
            <p className="text-2xl font-bold font-mono text-success">+{summary?.totalReturn || '0.00'}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Portfolio Performance</CardTitle></CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={10} tickFormatter={(v) => `$${v}`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Asset Allocation</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex justify-center items-center">
              {processedAllocation.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={processedAllocation} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="hsl(var(--primary))" label />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground">No assets found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
