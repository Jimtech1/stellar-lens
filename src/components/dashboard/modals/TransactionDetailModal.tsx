import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  Copy,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

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

interface TransactionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

const getTypeIcon = (type: Transaction["type"]) => {
  switch (type) {
    case "deposit":
      return <ArrowDownLeft className="w-5 h-5 text-success" />;
    case "withdrawal":
      return <ArrowUpRight className="w-5 h-5 text-destructive" />;
    case "swap":
      return <RefreshCw className="w-5 h-5 text-primary" />;
    case "bridge":
      return <ArrowLeftRight className="w-5 h-5 text-accent-foreground" />;
    case "stake":
      return <ArrowDownLeft className="w-5 h-5 text-primary" />;
    case "unstake":
      return <ArrowUpRight className="w-5 h-5 text-warning" />;
    default:
      return <ArrowLeftRight className="w-5 h-5" />;
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
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export const TransactionDetailModal = memo(({ open, onOpenChange, transaction }: TransactionDetailModalProps) => {
  if (!transaction) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              {getTypeIcon(transaction.type)}
            </div>
            <div>
              <span className="capitalize">{transaction.type} Transaction</span>
              <p className="text-sm text-muted-foreground font-normal">{transaction.chain}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            {getStatusBadge(transaction.status)}
          </div>

          {/* Amount */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Amount</p>
            <p className="text-2xl font-bold font-mono text-foreground">
              {transaction.amount.toLocaleString()} {transaction.fromAsset}
            </p>
            {transaction.toAsset && (
              <p className="text-sm text-muted-foreground mt-1">
                → {transaction.toAsset}
              </p>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Value (USD)</p>
              <p className="text-lg font-mono font-medium text-foreground">
                ${transaction.value.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Network Fee</p>
              <p className="text-lg font-mono font-medium text-foreground">
                ${transaction.fee.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{formatDate(transaction.timestamp)}</span>
          </div>

          {/* Transaction Hash */}
          <div className="p-3 bg-secondary/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Transaction Hash</p>
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm font-mono text-foreground truncate">
                {transaction.txHash}
              </code>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => copyToClipboard(transaction.txHash)}
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  asChild
                >
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button className="flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

TransactionDetailModal.displayName = "TransactionDetailModal";
