import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp, TrendingDown, DollarSign, Percent, ArrowUpRight, ArrowDownRight, Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface AssetPnL {
  symbol: string;
  name: string;
  avgCostBasis: number;
  currentPrice: number;
  holdings: number;
  totalInvested: number;
  currentValue: number;
  realizedPnL: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  totalPnL: number;
  totalPnLPercent: number;
  allocation: number; // percentage of portfolio
}

// Mock PnL data
const mockPnLData: AssetPnL[] = [
  { symbol: "XLM", name: "Stellar Lumens", avgCostBasis: 0.28, currentPrice: 0.35, holdings: 50000, totalInvested: 14000, currentValue: 17500, realizedPnL: 1200, unrealizedPnL: 3500, unrealizedPnLPercent: 25, totalPnL: 4700, totalPnLPercent: 33.57, allocation: 42 },
  { symbol: "USDC", name: "USD Coin", avgCostBasis: 1.0, currentPrice: 1.0, holdings: 12000, totalInvested: 12000, currentValue: 12000, realizedPnL: 0, unrealizedPnL: 0, unrealizedPnLPercent: 0, totalPnL: 0, totalPnLPercent: 0, allocation: 29 },
  { symbol: "AQUA", name: "Aquarius", avgCostBasis: 0.012, currentPrice: 0.015, holdings: 250000, totalInvested: 3000, currentValue: 3750, realizedPnL: 500, unrealizedPnL: 750, unrealizedPnLPercent: 25, totalPnL: 1250, totalPnLPercent: 41.67, allocation: 9 },
  { symbol: "BLND", name: "Blend Token", avgCostBasis: 0.035, currentPrice: 0.03, holdings: 80000, totalInvested: 2800, currentValue: 2400, realizedPnL: -200, unrealizedPnL: -400, unrealizedPnLPercent: -14.29, totalPnL: -600, totalPnLPercent: -21.43, allocation: 6 },
  { symbol: "yUSDC", name: "Yield USDC", avgCostBasis: 1.02, currentPrice: 1.05, holdings: 5000, totalInvested: 5100, currentValue: 5250, realizedPnL: 150, unrealizedPnL: 150, unrealizedPnLPercent: 2.94, totalPnL: 300, totalPnLPercent: 5.88, allocation: 13 },
  { symbol: "PHO", name: "Phoenix", avgCostBasis: 0.08, currentPrice: 0.065, holdings: 5000, totalInvested: 400, currentValue: 325, realizedPnL: 0, unrealizedPnL: -75, unrealizedPnLPercent: -18.75, totalPnL: -75, totalPnLPercent: -18.75, allocation: 1 },
];

export function ProfitLossView() {
  const [sortBy, setSortBy] = useState<"pnl" | "allocation" | "value">("pnl");

  const { data: pnlData = mockPnLData, isLoading } = useQuery({
    queryKey: ["pnl_data"],
    queryFn: async () => {
      try {
        const res = await api.get<AssetPnL[]>("/portfolio/pnl");
        return res && res.length > 0 ? res : mockPnLData;
      } catch {
        return mockPnLData;
      }
    },
  });

  const sorted = [...pnlData].sort((a, b) => {
    if (sortBy === "pnl") return Math.abs(b.totalPnL) - Math.abs(a.totalPnL);
    if (sortBy === "allocation") return b.allocation - a.allocation;
    return b.currentValue - a.currentValue;
  });

  const totals = pnlData.reduce(
    (acc, a) => ({
      invested: acc.invested + a.totalInvested,
      current: acc.current + a.currentValue,
      realized: acc.realized + a.realizedPnL,
      unrealized: acc.unrealized + a.unrealizedPnL,
    }),
    { invested: 0, current: 0, realized: 0, unrealized: 0 }
  );
  const totalPnL = totals.realized + totals.unrealized;
  const totalPnLPercent = totals.invested > 0 ? (totalPnL / totals.invested) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">Profit & Loss</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Detailed cost basis and gains breakdown per asset
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Total Invested</p>
            </div>
            <p className="text-lg md:text-xl font-bold font-mono">${totals.invested.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Current Value</p>
            </div>
            <p className="text-lg md:text-xl font-bold font-mono">${totals.current.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              {totalPnL >= 0 ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <p className="text-xs text-muted-foreground">Total P&L</p>
            </div>
            <p className={cn("text-lg md:text-xl font-bold font-mono", totalPnL >= 0 ? "text-success" : "text-destructive")}>
              {totalPnL >= 0 ? "+" : ""}${totalPnL.toLocaleString()}
            </p>
            <p className={cn("text-xs font-mono", totalPnL >= 0 ? "text-success" : "text-destructive")}>
              {totalPnLPercent >= 0 ? "+" : ""}{totalPnLPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Percent className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Realized / Unrealized</p>
            </div>
            <div className="flex gap-3">
              <div>
                <p className={cn("text-sm font-bold font-mono", totals.realized >= 0 ? "text-success" : "text-destructive")}>
                  {totals.realized >= 0 ? "+" : ""}${totals.realized.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">Realized</p>
              </div>
              <div>
                <p className={cn("text-sm font-bold font-mono", totals.unrealized >= 0 ? "text-success" : "text-destructive")}>
                  {totals.unrealized >= 0 ? "+" : ""}${totals.unrealized.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">Unrealized</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sort */}
      <div className="flex justify-end">
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pnl">By P&L</SelectItem>
            <SelectItem value="allocation">By Allocation</SelectItem>
            <SelectItem value="value">By Value</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Asset PnL Table (Desktop) */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs">
                  <th className="text-left p-4">Asset</th>
                  <th className="text-right p-4">Holdings</th>
                  <th className="text-right p-4">Avg Cost</th>
                  <th className="text-right p-4">Price</th>
                  <th className="text-right p-4">Value</th>
                  <th className="text-right p-4">Unrealized P&L</th>
                  <th className="text-right p-4">Realized P&L</th>
                  <th className="text-right p-4">Total P&L</th>
                  <th className="text-right p-4">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((asset) => (
                  <tr key={asset.symbol} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">{asset.symbol}</p>
                        <p className="text-xs text-muted-foreground">{asset.name}</p>
                      </div>
                    </td>
                    <td className="text-right p-4 font-mono">{asset.holdings.toLocaleString()}</td>
                    <td className="text-right p-4 font-mono">${asset.avgCostBasis.toFixed(4)}</td>
                    <td className="text-right p-4 font-mono">${asset.currentPrice.toFixed(4)}</td>
                    <td className="text-right p-4 font-mono">${asset.currentValue.toLocaleString()}</td>
                    <td className={cn("text-right p-4 font-mono", asset.unrealizedPnL >= 0 ? "text-success" : "text-destructive")}>
                      <div className="flex items-center justify-end gap-1">
                        {asset.unrealizedPnL >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        ${Math.abs(asset.unrealizedPnL).toLocaleString()}
                      </div>
                      <p className="text-[10px]">{asset.unrealizedPnLPercent >= 0 ? "+" : ""}{asset.unrealizedPnLPercent.toFixed(2)}%</p>
                    </td>
                    <td className={cn("text-right p-4 font-mono", asset.realizedPnL >= 0 ? "text-success" : "text-destructive")}>
                      {asset.realizedPnL >= 0 ? "+" : ""}${asset.realizedPnL.toLocaleString()}
                    </td>
                    <td className={cn("text-right p-4 font-mono font-semibold", asset.totalPnL >= 0 ? "text-success" : "text-destructive")}>
                      {asset.totalPnL >= 0 ? "+" : ""}${asset.totalPnL.toLocaleString()}
                      <p className="text-[10px] font-normal">{asset.totalPnLPercent >= 0 ? "+" : ""}{asset.totalPnLPercent.toFixed(2)}%</p>
                    </td>
                    <td className="text-right p-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Progress value={asset.allocation} className="w-16 h-1.5" />
                        <span className="text-xs font-mono text-muted-foreground w-8">{asset.allocation}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Asset PnL Cards (Mobile) */}
      <div className="md:hidden space-y-3">
        {sorted.map((asset) => (
          <Card key={asset.symbol}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{asset.symbol}</p>
                  <p className="text-xs text-muted-foreground">{asset.name}</p>
                </div>
                <div className="text-right">
                  <p className={cn("font-mono font-semibold", asset.totalPnL >= 0 ? "text-success" : "text-destructive")}>
                    {asset.totalPnL >= 0 ? "+" : ""}${asset.totalPnL.toLocaleString()}
                  </p>
                  <p className={cn("text-xs font-mono", asset.totalPnLPercent >= 0 ? "text-success" : "text-destructive")}>
                    {asset.totalPnLPercent >= 0 ? "+" : ""}{asset.totalPnLPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Holdings</p>
                  <p className="font-mono">{asset.holdings.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg Cost</p>
                  <p className="font-mono">${asset.avgCostBasis.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-mono">${asset.currentPrice.toFixed(4)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={asset.allocation} className="flex-1 h-1.5" />
                <span className="text-xs font-mono text-muted-foreground">{asset.allocation}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
