import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Search, Eye, ArrowUpRight, ArrowDownRight, ArrowLeftRight,
  Flame, Crown, AlertTriangle, TrendingUp, TrendingDown,
  Clock, ExternalLink, Copy, Filter, Loader2, Zap, Users, Waves
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────

interface WhaleWallet {
  address: string;
  label: string;
  tags: string[];
  netWorth: number;
  pnl30d: number;
  pnl30dPercent: number;
  winRate: number;
  txCount7d: number;
  lastActive: string;
  topHoldings: { symbol: string; value: number; pct: number }[];
}

interface WhaleMovement {
  id: string;
  wallet: string;
  walletLabel: string;
  type: "buy" | "sell" | "transfer";
  asset: string;
  amount: string;
  value: number;
  timestamp: string;
  txHash: string;
  significance: "high" | "medium" | "low";
}

interface SmartMoneySignal {
  asset: string;
  signal: "accumulating" | "distributing" | "neutral";
  whaleCount: number;
  netFlow24h: number;
  netFlow7d: number;
  priceChange24h: number;
  confidence: number;
}

// ── Mock Data ──────────────────────────────────────────

const mockWhales: WhaleWallet[] = [
  {
    address: "GDRQ...X7PF",
    label: "SDF Reserve",
    tags: ["Foundation", "Long-term Holder"],
    netWorth: 245_000_000,
    pnl30d: 12_500_000,
    pnl30dPercent: 5.4,
    winRate: 78,
    txCount7d: 12,
    lastActive: "2025-02-17T09:30:00Z",
    topHoldings: [
      { symbol: "XLM", value: 200_000_000, pct: 81.6 },
      { symbol: "USDC", value: 30_000_000, pct: 12.2 },
      { symbol: "AQUA", value: 15_000_000, pct: 6.1 },
    ],
  },
  {
    address: "GB4E...R2KL",
    label: "DeFi Whale #1",
    tags: ["Smart Money", "Yield Farmer"],
    netWorth: 18_500_000,
    pnl30d: 2_100_000,
    pnl30dPercent: 12.8,
    winRate: 85,
    txCount7d: 47,
    lastActive: "2025-02-17T10:15:00Z",
    topHoldings: [
      { symbol: "XLM", value: 8_000_000, pct: 43.2 },
      { symbol: "yUSDC", value: 5_500_000, pct: 29.7 },
      { symbol: "BLND", value: 3_000_000, pct: 16.2 },
      { symbol: "AQUA", value: 2_000_000, pct: 10.8 },
    ],
  },
  {
    address: "GCFX...W8NQ",
    label: "Soroswap LP Giant",
    tags: ["LP Provider", "Early Adopter"],
    netWorth: 9_200_000,
    pnl30d: -450_000,
    pnl30dPercent: -4.7,
    winRate: 62,
    txCount7d: 89,
    lastActive: "2025-02-17T11:02:00Z",
    topHoldings: [
      { symbol: "XLM", value: 4_500_000, pct: 48.9 },
      { symbol: "USDC", value: 3_200_000, pct: 34.8 },
      { symbol: "PHO", value: 1_500_000, pct: 16.3 },
    ],
  },
  {
    address: "GDMP...K4JS",
    label: "Institutional Fund",
    tags: ["Institution", "Accumulator"],
    netWorth: 52_000_000,
    pnl30d: 3_800_000,
    pnl30dPercent: 7.9,
    winRate: 71,
    txCount7d: 5,
    lastActive: "2025-02-16T22:45:00Z",
    topHoldings: [
      { symbol: "XLM", value: 35_000_000, pct: 67.3 },
      { symbol: "USDC", value: 15_000_000, pct: 28.8 },
      { symbol: "BLND", value: 2_000_000, pct: 3.8 },
    ],
  },
  {
    address: "GBYN...T9RL",
    label: "MEV Bot Alpha",
    tags: ["Bot", "High Frequency"],
    netWorth: 3_400_000,
    pnl30d: 890_000,
    pnl30dPercent: 35.4,
    winRate: 92,
    txCount7d: 1_243,
    lastActive: "2025-02-17T11:10:00Z",
    topHoldings: [
      { symbol: "USDC", value: 2_000_000, pct: 58.8 },
      { symbol: "XLM", value: 1_200_000, pct: 35.3 },
      { symbol: "AQUA", value: 200_000, pct: 5.9 },
    ],
  },
];

const mockMovements: WhaleMovement[] = [
  { id: "1", wallet: "GB4E...R2KL", walletLabel: "DeFi Whale #1", type: "buy", asset: "XLM", amount: "2,500,000", value: 875_000, timestamp: "2025-02-17T10:15:00Z", txHash: "abc123...def", significance: "high" },
  { id: "2", wallet: "GDMP...K4JS", walletLabel: "Institutional Fund", type: "buy", asset: "XLM", amount: "5,000,000", value: 1_750_000, timestamp: "2025-02-17T08:30:00Z", txHash: "ghi456...jkl", significance: "high" },
  { id: "3", wallet: "GCFX...W8NQ", walletLabel: "Soroswap LP Giant", type: "sell", asset: "PHO", amount: "500,000", value: 32_500, timestamp: "2025-02-17T07:45:00Z", txHash: "mno789...pqr", significance: "medium" },
  { id: "4", wallet: "GBYN...T9RL", walletLabel: "MEV Bot Alpha", type: "buy", asset: "AQUA", amount: "10,000,000", value: 150_000, timestamp: "2025-02-17T06:20:00Z", txHash: "stu012...vwx", significance: "medium" },
  { id: "5", wallet: "GDRQ...X7PF", walletLabel: "SDF Reserve", type: "transfer", asset: "XLM", amount: "50,000,000", value: 17_500_000, timestamp: "2025-02-16T23:00:00Z", txHash: "yza345...bcd", significance: "high" },
  { id: "6", wallet: "GB4E...R2KL", walletLabel: "DeFi Whale #1", type: "buy", asset: "BLND", amount: "1,200,000", value: 36_000, timestamp: "2025-02-16T19:30:00Z", txHash: "efg678...hij", significance: "low" },
  { id: "7", wallet: "GCFX...W8NQ", walletLabel: "Soroswap LP Giant", type: "buy", asset: "XLM", amount: "800,000", value: 280_000, timestamp: "2025-02-16T15:10:00Z", txHash: "klm901...nop", significance: "medium" },
  { id: "8", wallet: "GDMP...K4JS", walletLabel: "Institutional Fund", type: "sell", asset: "USDC", amount: "3,000,000", value: 3_000_000, timestamp: "2025-02-16T12:00:00Z", txHash: "qrs234...tuv", significance: "high" },
];

const mockSignals: SmartMoneySignal[] = [
  { asset: "XLM", signal: "accumulating", whaleCount: 8, netFlow24h: 12_500_000, netFlow7d: 45_000_000, priceChange24h: 2.4, confidence: 87 },
  { asset: "BLND", signal: "accumulating", whaleCount: 4, netFlow24h: 850_000, netFlow7d: 3_200_000, priceChange24h: 5.1, confidence: 72 },
  { asset: "AQUA", signal: "neutral", whaleCount: 3, netFlow24h: -120_000, netFlow7d: 500_000, priceChange24h: 1.1, confidence: 45 },
  { asset: "USDC", signal: "distributing", whaleCount: 5, netFlow24h: -4_200_000, netFlow7d: -12_000_000, priceChange24h: 0, confidence: 81 },
  { asset: "PHO", signal: "distributing", whaleCount: 2, netFlow24h: -320_000, netFlow7d: -1_100_000, priceChange24h: -3.2, confidence: 65 },
  { asset: "yUSDC", signal: "accumulating", whaleCount: 3, netFlow24h: 1_500_000, netFlow7d: 4_800_000, priceChange24h: 0.3, confidence: 78 },
];

// ── Helpers ──────────────────────────────────────────

function formatValue(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
}

function formatFlow(v: number): string {
  const prefix = v >= 0 ? "+" : "";
  if (Math.abs(v) >= 1_000_000) return `${prefix}${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${prefix}${(v / 1_000).toFixed(0)}K`;
  return `${prefix}${v.toFixed(0)}`;
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const moveTypeConfig = {
  buy: { icon: ArrowDownRight, label: "Bought", color: "text-success", bg: "bg-success/10" },
  sell: { icon: ArrowUpRight, label: "Sold", color: "text-destructive", bg: "bg-destructive/10" },
  transfer: { icon: ArrowLeftRight, label: "Transferred", color: "text-primary", bg: "bg-primary/10" },
};

const signalConfig = {
  accumulating: { icon: TrendingUp, label: "Accumulating", color: "text-success", border: "border-success/30" },
  distributing: { icon: TrendingDown, label: "Distributing", color: "text-destructive", border: "border-destructive/30" },
  neutral: { icon: Waves, label: "Neutral", color: "text-muted-foreground", border: "border-border" },
};

// ── Component ──────────────────────────────────────────

export function SmartMoneyView() {
  const [tab, setTab] = useState("signals");
  const [search, setSearch] = useState("");
  const [significanceFilter, setSignificanceFilter] = useState("all");

  // In production these would call a real API
  const { data: whales = mockWhales } = useQuery({
    queryKey: ["smart_money_whales"],
    queryFn: async () => mockWhales,
  });

  const { data: movements = mockMovements } = useQuery({
    queryKey: ["smart_money_movements"],
    queryFn: async () => mockMovements,
  });

  const { data: signals = mockSignals } = useQuery({
    queryKey: ["smart_money_signals"],
    queryFn: async () => mockSignals,
  });

  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      const matchesSearch =
        !search ||
        m.asset.toLowerCase().includes(search.toLowerCase()) ||
        m.walletLabel.toLowerCase().includes(search.toLowerCase());
      const matchesSig = significanceFilter === "all" || m.significance === significanceFilter;
      return matchesSearch && matchesSig;
    });
  }, [movements, search, significanceFilter]);

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    toast.success("Address copied");
  };

  // Aggregate stats
  const totalWhaleValue = whales.reduce((s, w) => s + w.netWorth, 0);
  const accumulatingCount = signals.filter((s) => s.signal === "accumulating").length;
  const highSigMoves = movements.filter((m) => m.significance === "high").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-foreground flex items-center gap-2">
          <Eye className="w-6 h-6 text-primary" />
          Smart Money
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Track whale wallets, smart money flows, and accumulation signals on Stellar
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-warning" />
              <p className="text-xs text-muted-foreground">Tracked Whales</p>
            </div>
            <p className="text-lg md:text-xl font-bold">{whales.length}</p>
            <p className="text-[11px] text-muted-foreground">{formatValue(totalWhaleValue)} total value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-destructive" />
              <p className="text-xs text-muted-foreground">High-Impact Moves</p>
            </div>
            <p className="text-lg md:text-xl font-bold">{highSigMoves}</p>
            <p className="text-[11px] text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <p className="text-xs text-muted-foreground">Accumulating</p>
            </div>
            <p className="text-lg md:text-xl font-bold text-success">{accumulatingCount} assets</p>
            <p className="text-[11px] text-muted-foreground">Smart money buying</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Top Win Rate</p>
            </div>
            <p className="text-lg md:text-xl font-bold font-mono">
              {Math.max(...whales.map((w) => w.winRate))}%
            </p>
            <p className="text-[11px] text-muted-foreground">Best performer</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="signals">
            <Zap className="w-4 h-4 mr-1.5" />
            Signals
          </TabsTrigger>
          <TabsTrigger value="movements">
            <Flame className="w-4 h-4 mr-1.5" />
            Whale Moves
          </TabsTrigger>
          <TabsTrigger value="wallets">
            <Crown className="w-4 h-4 mr-1.5" />
            Top Wallets
          </TabsTrigger>
        </TabsList>

        {/* ── Signals Tab ── */}
        <TabsContent value="signals" className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Net flow analysis showing what smart money is buying and selling
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {signals.map((sig) => {
              const cfg = signalConfig[sig.signal];
              const SigIcon = cfg.icon;
              return (
                <Card key={sig.asset} className={cn("border", cfg.border)}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{sig.asset}</span>
                        <Badge variant="outline" className={cn("text-[10px]", cfg.color)}>
                          <SigIcon className="w-3 h-3 mr-1" />
                          {cfg.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{sig.whaleCount} whales</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">24h Flow</p>
                        <p className={cn("text-sm font-mono font-semibold", sig.netFlow24h >= 0 ? "text-success" : "text-destructive")}>
                          {formatFlow(sig.netFlow24h)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">7d Flow</p>
                        <p className={cn("text-sm font-mono font-semibold", sig.netFlow7d >= 0 ? "text-success" : "text-destructive")}>
                          {formatFlow(sig.netFlow7d)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Confidence</span>
                        <span>{sig.confidence}%</span>
                      </div>
                      <Progress value={sig.confidence} className="h-1.5" />
                    </div>

                    {sig.priceChange24h !== 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-muted-foreground">Price 24h:</span>
                        <span className={cn("font-mono", sig.priceChange24h >= 0 ? "text-success" : "text-destructive")}>
                          {sig.priceChange24h >= 0 ? "+" : ""}{sig.priceChange24h}%
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ── Whale Moves Tab ── */}
        <TabsContent value="movements" className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by asset or wallet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={significanceFilter} onValueChange={setSignificanceFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Moves</SelectItem>
                <SelectItem value="high">🔴 High Impact</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="low">🟢 Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {filteredMovements.map((move) => {
              const cfg = moveTypeConfig[move.type];
              const MoveIcon = cfg.icon;
              return (
                <Card key={move.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", cfg.bg)}>
                      <MoveIcon className={cn("w-5 h-5", cfg.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{cfg.label}</span>
                        <span className="text-sm font-mono font-bold">{move.amount} {move.asset}</span>
                        {move.significance === "high" && (
                          <Badge variant="outline" className="text-[10px] text-destructive border-destructive/30">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            High Impact
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <button
                          onClick={() => copyAddress(move.wallet)}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                        >
                          <Crown className="w-3 h-3" />
                          {move.walletLabel}
                          <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-sm font-mono font-medium">{formatValue(move.value)}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(move.timestamp)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredMovements.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No whale movements match your filters.</div>
          )}
        </TabsContent>

        {/* ── Top Wallets Tab ── */}
        <TabsContent value="wallets" className="mt-4 space-y-4">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs">
                      <th className="text-left p-4">Wallet</th>
                      <th className="text-right p-4">Net Worth</th>
                      <th className="text-right p-4">30d P&L</th>
                      <th className="text-right p-4">Win Rate</th>
                      <th className="text-right p-4">7d Txns</th>
                      <th className="text-left p-4">Top Holdings</th>
                      <th className="text-right p-4">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {whales.map((w) => (
                      <tr key={w.address} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-warning shrink-0" />
                            <div>
                              <p className="font-semibold">{w.label}</p>
                              <button
                                onClick={() => copyAddress(w.address)}
                                className="text-xs text-muted-foreground font-mono hover:text-foreground flex items-center gap-1"
                              >
                                {w.address}
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-1 mt-1">
                            {w.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-[9px] px-1 py-0">{tag}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="text-right p-4 font-mono font-medium">{formatValue(w.netWorth)}</td>
                        <td className={cn("text-right p-4 font-mono", w.pnl30d >= 0 ? "text-success" : "text-destructive")}>
                          <p>{w.pnl30d >= 0 ? "+" : ""}{formatValue(w.pnl30d)}</p>
                          <p className="text-[10px]">{w.pnl30dPercent >= 0 ? "+" : ""}{w.pnl30dPercent}%</p>
                        </td>
                        <td className="text-right p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Progress value={w.winRate} className="w-12 h-1.5" />
                            <span className="font-mono text-xs">{w.winRate}%</span>
                          </div>
                        </td>
                        <td className="text-right p-4 font-mono">{w.txCount7d.toLocaleString()}</td>
                        <td className="p-4">
                          <div className="flex gap-1 flex-wrap">
                            {w.topHoldings.slice(0, 3).map((h) => (
                              <Badge key={h.symbol} variant="secondary" className="text-[10px] font-mono">
                                {h.symbol} {h.pct}%
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="text-right p-4 text-xs text-muted-foreground">{timeAgo(w.lastActive)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {whales.map((w) => (
              <Card key={w.address}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-warning" />
                      <div>
                        <p className="font-semibold text-sm">{w.label}</p>
                        <button
                          onClick={() => copyAddress(w.address)}
                          className="text-xs text-muted-foreground font-mono hover:text-foreground"
                        >
                          {w.address}
                        </button>
                      </div>
                    </div>
                    <p className="font-mono font-bold text-sm">{formatValue(w.netWorth)}</p>
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {w.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[9px] px-1.5 py-0">{tag}</Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">30d P&L</p>
                      <p className={cn("font-mono font-semibold", w.pnl30d >= 0 ? "text-success" : "text-destructive")}>
                        {w.pnl30dPercent >= 0 ? "+" : ""}{w.pnl30dPercent}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-mono font-semibold">{w.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">7d Txns</p>
                      <p className="font-mono">{w.txCount7d.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {w.topHoldings.map((h) => (
                      <Badge key={h.symbol} variant="secondary" className="text-[10px] font-mono">
                        {h.symbol} {h.pct}%
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
