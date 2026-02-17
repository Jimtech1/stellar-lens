import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Droplets, Coins,
  Search, ExternalLink, Clock, Filter, CheckCircle2, XCircle, Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "send" | "receive" | "swap" | "approve" | "stake" | "unstake" | "claim" | "bridge" | "contract";
  status: "confirmed" | "pending" | "failed";
  timestamp: string;
  from: string;
  to: string;
  asset: string;
  amount: string;
  value: number;
  toAsset?: string;
  toAmount?: string;
  hash: string;
  fee: number;
  protocol?: string;
}

const typeConfig: Record<string, { icon: any; label: string; color: string }> = {
  send: { icon: ArrowUpRight, label: "Sent", color: "text-destructive" },
  receive: { icon: ArrowDownLeft, label: "Received", color: "text-success" },
  swap: { icon: ArrowLeftRight, label: "Swapped", color: "text-primary" },
  approve: { icon: CheckCircle2, label: "Approved", color: "text-warning" },
  stake: { icon: Coins, label: "Staked", color: "text-primary" },
  unstake: { icon: Coins, label: "Unstaked", color: "text-muted-foreground" },
  claim: { icon: Droplets, label: "Claimed", color: "text-success" },
  bridge: { icon: ArrowLeftRight, label: "Bridged", color: "text-accent-foreground" },
  contract: { icon: ExternalLink, label: "Contract Call", color: "text-muted-foreground" },
};

const statusConfig: Record<string, { icon: any; className: string }> = {
  confirmed: { icon: CheckCircle2, className: "text-success" },
  pending: { icon: Clock, className: "text-warning animate-pulse" },
  failed: { icon: XCircle, className: "text-destructive" },
};

// Mock activity data for demo
const mockActivity: ActivityItem[] = [
  { id: "1", type: "swap", status: "confirmed", timestamp: "2025-02-17T10:23:00Z", from: "GA7...X3Q", to: "Soroswap", asset: "XLM", amount: "1,500", value: 525, toAsset: "USDC", toAmount: "524.85", hash: "abc123...def", fee: 0.00001, protocol: "Soroswap" },
  { id: "2", type: "receive", status: "confirmed", timestamp: "2025-02-17T09:15:00Z", from: "GC4...R2P", to: "You", asset: "USDC", amount: "2,000", value: 2000, hash: "ghi456...jkl", fee: 0 },
  { id: "3", type: "stake", status: "confirmed", timestamp: "2025-02-16T18:42:00Z", from: "You", to: "Blend Protocol", asset: "XLM", amount: "10,000", value: 3500, hash: "mno789...pqr", fee: 0.00001, protocol: "Blend" },
  { id: "4", type: "approve", status: "confirmed", timestamp: "2025-02-16T18:40:00Z", from: "You", to: "Blend Protocol", asset: "XLM", amount: "Unlimited", value: 0, hash: "stu012...vwx", fee: 0.00001, protocol: "Blend" },
  { id: "5", type: "claim", status: "confirmed", timestamp: "2025-02-16T12:00:00Z", from: "Aquarius", to: "You", asset: "AQUA", amount: "3,250", value: 48.75, hash: "yza345...bcd", fee: 0.00001, protocol: "Aquarius" },
  { id: "6", type: "send", status: "confirmed", timestamp: "2025-02-15T20:30:00Z", from: "You", to: "GD8...K1M", asset: "XLM", amount: "500", value: 175, hash: "efg678...hij", fee: 0.00001 },
  { id: "7", type: "swap", status: "failed", timestamp: "2025-02-15T14:10:00Z", from: "You", to: "Phoenix", asset: "USDC", amount: "100", value: 100, toAsset: "PHO", toAmount: "0", hash: "klm901...nop", fee: 0.00001, protocol: "Phoenix" },
  { id: "8", type: "bridge", status: "pending", timestamp: "2025-02-15T11:05:00Z", from: "Ethereum", to: "Stellar", asset: "USDC", amount: "5,000", value: 5000, hash: "qrs234...tuv", fee: 2.5 },
  { id: "9", type: "receive", status: "confirmed", timestamp: "2025-02-14T22:18:00Z", from: "GF2...W5N", to: "You", asset: "BLND", amount: "1,200", value: 36, hash: "wxy567...zab", fee: 0 },
  { id: "10", type: "swap", status: "confirmed", timestamp: "2025-02-14T15:45:00Z", from: "You", to: "Soroswap", asset: "XLM", amount: "3,000", value: 1050, toAsset: "yUSDC", toAmount: "1,048.50", hash: "cde890...fgh", fee: 0.00001, protocol: "Soroswap" },
];

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function truncateAddress(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export function ActivityFeedView() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // In production, replace with real API call
  const { data: activities = mockActivity, isLoading } = useQuery({
    queryKey: ["activity_feed"],
    queryFn: async () => {
      try {
        const res = await api.get<ActivityItem[]>("/portfolio/activity");
        return res && res.length > 0 ? res : mockActivity;
      } catch {
        return mockActivity;
      }
    },
  });

  const filtered = activities.filter((a) => {
    const matchesSearch =
      !search ||
      a.asset.toLowerCase().includes(search.toLowerCase()) ||
      a.protocol?.toLowerCase().includes(search.toLowerCase()) ||
      a.hash.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, ActivityItem[]>>((acc, item) => {
    const day = new Date(item.timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

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
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">Activity</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Complete timeline of your on-chain activity
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by asset, protocol, or hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="send">Sent</SelectItem>
            <SelectItem value="receive">Received</SelectItem>
            <SelectItem value="swap">Swaps</SelectItem>
            <SelectItem value="approve">Approvals</SelectItem>
            <SelectItem value="stake">Staking</SelectItem>
            <SelectItem value="claim">Claims</SelectItem>
            <SelectItem value="bridge">Bridges</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feed */}
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            {date}
          </p>
          <div className="space-y-2">
            {items.map((item) => {
              const cfg = typeConfig[item.type] || typeConfig.contract;
              const stCfg = statusConfig[item.status];
              const Icon = cfg.icon;
              const StatusIcon = stCfg.icon;

              return (
                <Card
                  key={item.id}
                  className="hover:border-primary/30 transition-colors group"
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        "bg-secondary"
                      )}
                    >
                      <Icon className={cn("w-5 h-5", cfg.color)} />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">
                          {cfg.label}
                        </span>
                        {item.protocol && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {item.protocol}
                          </Badge>
                        )}
                        <StatusIcon className={cn("w-3.5 h-3.5 ml-auto sm:ml-0", stCfg.className)} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {item.type === "swap" ? (
                          <>
                            {item.amount} {item.asset} → {item.toAmount} {item.toAsset}
                          </>
                        ) : item.type === "approve" ? (
                          <>
                            {item.asset} · {truncateAddress(item.to)}
                          </>
                        ) : (
                          <>
                            {item.amount} {item.asset} ·{" "}
                            {item.type === "send" ? `to ${truncateAddress(item.to)}` : `from ${truncateAddress(item.from)}`}
                          </>
                        )}
                      </p>
                    </div>

                    {/* Value & Time */}
                    <div className="text-right shrink-0 hidden sm:block">
                      {item.value > 0 && (
                        <p
                          className={cn(
                            "text-sm font-mono font-medium",
                            item.type === "send" ? "text-destructive" : "text-foreground"
                          )}
                        >
                          {item.type === "send" ? "-" : "+"}${item.value.toLocaleString()}
                        </p>
                      )}
                      <p className="text-[11px] text-muted-foreground">
                        {formatRelativeTime(item.timestamp)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No activity found matching your filters.
        </div>
      )}
    </div>
  );
}
