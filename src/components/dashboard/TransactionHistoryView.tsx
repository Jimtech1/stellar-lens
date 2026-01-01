import { memo, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  RefreshCw,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TransactionDetailModal } from "./modals/TransactionDetailModal";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "swap" | "bridge" | "stake" | "unstake";
  fromAsset: string;
  toAsset?: string;
  amount: number;
  value: number;
  fee: number;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
  txHash: string;
  chain: string;
}

// Extended mock transactions
const mockTransactions: Transaction[] = [
  { id: "1", type: "deposit", fromAsset: "XLM", amount: 5000, value: 600, fee: 0.01, timestamp: new Date("2024-01-15T10:30:00"), status: "completed", txHash: "0x7a3f...92d1", chain: "Stellar" },
  { id: "2", type: "swap", fromAsset: "USDC", toAsset: "XLM", amount: 1000, value: 1000, fee: 2.50, timestamp: new Date("2024-01-14T14:20:00"), status: "completed", txHash: "0x8b4e...83c2", chain: "Stellar" },
  { id: "3", type: "bridge", fromAsset: "ETH", toAsset: "ETH", amount: 0.5, value: 1150, fee: 5.00, timestamp: new Date("2024-01-14T09:15:00"), status: "completed", txHash: "0x9c5f...74d3", chain: "Ethereum → Polygon" },
  { id: "4", type: "withdrawal", fromAsset: "MATIC", amount: 500, value: 425, fee: 0.10, timestamp: new Date("2024-01-13T16:45:00"), status: "pending", txHash: "0x0d6g...65e4", chain: "Polygon" },
  { id: "5", type: "deposit", fromAsset: "WBTC", amount: 0.05, value: 2150, fee: 0.001, timestamp: new Date("2024-01-12T11:00:00"), status: "completed", txHash: "0x1e7h...56f5", chain: "Ethereum" },
  { id: "6", type: "stake", fromAsset: "ETH", amount: 1.0, value: 2300, fee: 0.005, timestamp: new Date("2024-01-11T08:30:00"), status: "completed", txHash: "0x2f8i...47g6", chain: "Ethereum" },
  { id: "7", type: "swap", fromAsset: "ARB", toAsset: "USDC", amount: 500, value: 600, fee: 1.20, timestamp: new Date("2024-01-10T15:45:00"), status: "completed", txHash: "0x3g9j...38h7", chain: "Arbitrum" },
  { id: "8", type: "bridge", fromAsset: "USDC", toAsset: "USDC", amount: 2000, value: 2000, fee: 3.00, timestamp: new Date("2024-01-09T12:00:00"), status: "failed", txHash: "0x4h0k...29i8", chain: "Ethereum → Stellar" },
  { id: "9", type: "unstake", fromAsset: "stETH", amount: 0.5, value: 1150, fee: 0.003, timestamp: new Date("2024-01-08T09:20:00"), status: "completed", txHash: "0x5i1l...10j9", chain: "Ethereum" },
  { id: "10", type: "deposit", fromAsset: "USDC", amount: 3000, value: 3000, fee: 0, timestamp: new Date("2024-01-07T14:10:00"), status: "completed", txHash: "0x6j2m...01k0", chain: "Stellar" },
  { id: "11", type: "swap", fromAsset: "XLM", toAsset: "USDC", amount: 10000, value: 1200, fee: 3.00, timestamp: new Date("2024-01-06T10:00:00"), status: "completed", txHash: "0x7k3n...92l1", chain: "Stellar" },
  { id: "12", type: "withdrawal", fromAsset: "ETH", amount: 0.25, value: 575, fee: 2.50, timestamp: new Date("2024-01-05T17:30:00"), status: "completed", txHash: "0x8l4o...83m2", chain: "Ethereum" },
];

const getTypeIcon = (type: Transaction["type"]) => {
  switch (type) {
    case "deposit":
      return <ArrowDownLeft className="w-4 h-4 text-success" />;
    case "withdrawal":
      return <ArrowUpRight className="w-4 h-4 text-destructive" />;
    case "swap":
      return <RefreshCw className="w-4 h-4 text-primary" />;
    case "bridge":
      return <ArrowLeftRight className="w-4 h-4 text-accent-foreground" />;
    case "stake":
      return <ArrowDownLeft className="w-4 h-4 text-primary" />;
    case "unstake":
      return <ArrowUpRight className="w-4 h-4 text-warning" />;
    default:
      return <ArrowLeftRight className="w-4 h-4" />;
  }
};

const getStatusBadge = (status: Transaction["status"]) => {
  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="bg-success/10 text-success border-success/20 gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
          <XCircle className="w-3 h-3" />
          Failed
        </Badge>
      );
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const MobileTransactionCard = memo(({ tx, onClick }: { tx: Transaction; onClick: () => void }) => (
  <div 
    className="p-4 border-b border-border/50 last:border-b-0 cursor-pointer hover:bg-secondary/30 transition-colors"
    onClick={onClick}
  >
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          {getTypeIcon(tx.type)}
        </div>
        <div>
          <p className="font-medium capitalize text-foreground">{tx.type}</p>
          <p className="text-tiny text-muted-foreground">{tx.chain}</p>
        </div>
      </div>
      {getStatusBadge(tx.status)}
    </div>
    <div className="grid grid-cols-2 gap-2 text-small">
      <div>
        <p className="text-muted-foreground text-tiny">Amount</p>
        <p className="font-mono text-foreground">
          {tx.amount.toLocaleString()} {tx.fromAsset}
          {tx.toAsset && <span className="text-muted-foreground"> → {tx.toAsset}</span>}
        </p>
      </div>
      <div>
        <p className="text-muted-foreground text-tiny">Value</p>
        <p className="font-mono text-foreground">${tx.value.toLocaleString()}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-tiny">Fee</p>
        <p className="font-mono text-muted-foreground">${tx.fee.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-tiny">Time</p>
        <p className="text-muted-foreground">{formatDate(tx.timestamp)}</p>
      </div>
    </div>
    <div className="mt-2 pt-2 border-t border-border/30">
      <span className="font-mono text-tiny text-primary">
        {tx.txHash}
      </span>
    </div>
  </div>
));

MobileTransactionCard.displayName = "MobileTransactionCard";

const TransactionRow = memo(({ tx, onClick }: { tx: Transaction; onClick: () => void }) => (
  <TableRow className="hover:bg-secondary/30 cursor-pointer" onClick={onClick}>
    <TableCell>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          {getTypeIcon(tx.type)}
        </div>
        <div>
          <p className="font-medium capitalize text-foreground">{tx.type}</p>
          <p className="text-tiny text-muted-foreground">{tx.chain}</p>
        </div>
      </div>
    </TableCell>
    <TableCell>
      <div>
        <p className="font-mono text-foreground">
          {tx.amount.toLocaleString()} {tx.fromAsset}
        </p>
        {tx.toAsset && (
          <p className="text-tiny text-muted-foreground">→ {tx.toAsset}</p>
        )}
      </div>
    </TableCell>
    <TableCell className="font-mono text-foreground">
      ${tx.value.toLocaleString()}
    </TableCell>
    <TableCell className="text-muted-foreground font-mono text-small">
      ${tx.fee.toFixed(2)}
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span className="text-small">{formatDate(tx.timestamp)}</span>
      </div>
    </TableCell>
    <TableCell>{getStatusBadge(tx.status)}</TableCell>
    <TableCell>
      <span className="font-mono text-small text-primary">
        {tx.txHash}
      </span>
    </TableCell>
  </TableRow>
));

TransactionRow.displayName = "TransactionRow";

export const TransactionHistoryView = memo(() => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const openTransactionDetail = (tx: Transaction) => {
    setSelectedTransaction(tx);
    setDetailModalOpen(true);
  };

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((tx) => {
      const matchesSearch =
        tx.fromAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.toAsset?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.chain.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || tx.type === typeFilter;
      const matchesStatus = statusFilter === "all" || tx.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = mockTransactions.length;
    const completed = mockTransactions.filter((t) => t.status === "completed").length;
    const pending = mockTransactions.filter((t) => t.status === "pending").length;
    const totalVolume = mockTransactions.reduce((acc, t) => acc + t.value, 0);
    return { total, completed, pending, totalVolume };
  }, []);

  return (
    <>
      <TransactionDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        transaction={selectedTransaction}
      />
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 font-semibold text-foreground">Transaction History</h1>
          <p className="text-muted-foreground">View and track all your transactions</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 w-fit">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-3 sm:p-4">
            <p className="text-tiny text-muted-foreground">Total Transactions</p>
            <p className="text-h2 font-semibold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-3 sm:p-4">
            <p className="text-tiny text-muted-foreground">Completed</p>
            <p className="text-h2 font-semibold text-success">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-3 sm:p-4">
            <p className="text-tiny text-muted-foreground">Pending</p>
            <p className="text-h2 font-semibold text-warning">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-3 sm:p-4">
            <p className="text-tiny text-muted-foreground">Total Volume</p>
            <p className="text-h2 font-semibold text-foreground">${stats.totalVolume.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by asset, chain, or tx hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary/50 border-border/50"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px] bg-secondary/50 border-border/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="swap">Swap</SelectItem>
                  <SelectItem value="bridge">Bridge</SelectItem>
                  <SelectItem value="stake">Stake</SelectItem>
                  <SelectItem value="unstake">Unstake</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] bg-secondary/50 border-border/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions - Mobile Cards */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 md:hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-h3 font-medium">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredTransactions.map((tx) => (
            <MobileTransactionCard key={tx.id} tx={tx} onClick={() => openTransactionDetail(tx)} />
          ))}
          {filteredTransactions.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No transactions found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions Table - Desktop */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 hidden md:block">
        <CardHeader className="pb-2">
          <CardTitle className="text-h3 font-medium">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Value</TableHead>
                <TableHead className="text-muted-foreground">Fee</TableHead>
                <TableHead className="text-muted-foreground">Time</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Tx Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} onClick={() => openTransactionDetail(tx)} />
              ))}
            </TableBody>
          </Table>
          {filteredTransactions.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No transactions found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
});

TransactionHistoryView.displayName = "TransactionHistoryView";

export default TransactionHistoryView;
