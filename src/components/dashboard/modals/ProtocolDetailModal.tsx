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
  ExternalLink,
  Shield,
  TrendingUp,
  BarChart3,
  Users,
  Wallet,
  Star,
} from "lucide-react";
import { YieldOpportunity } from "@/lib/mockData";

interface ProtocolDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  protocol: YieldOpportunity | null;
  onInvest?: () => void;
}

const getRiskColor = (score: number) => {
  if (score < 30) return "text-success";
  if (score < 60) return "text-warning";
  return "text-destructive";
};

const getRiskLabel = (score: number) => {
  if (score < 30) return "Low";
  if (score < 60) return "Medium";
  return "High";
};

const getRiskBgColor = (score: number) => {
  if (score < 30) return "bg-success/10 border-success/20";
  if (score < 60) return "bg-warning/10 border-warning/20";
  return "bg-destructive/10 border-destructive/20";
};

export const ProtocolDetailModal = memo(({ 
  open, 
  onOpenChange, 
  protocol,
  onInvest
}: ProtocolDetailModalProps) => {
  if (!protocol) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
              {protocol.protocolLogo}
            </div>
            <div>
              <span>{protocol.protocol}</span>
              <p className="text-sm text-muted-foreground font-normal capitalize">{protocol.category}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{protocol.chain}</Badge>
            <Badge variant="outline" className={`text-xs ${getRiskBgColor(protocol.riskScore)} ${getRiskColor(protocol.riskScore)}`}>
              <Shield className="w-3 h-3 mr-1" />
              {getRiskLabel(protocol.riskScore)} Risk
            </Badge>
          </div>

          {/* APY Card */}
          <div className="p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg border border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current APY</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <p className="text-3xl font-bold text-success">
                    {protocol.apy.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Asset</p>
                <p className="text-lg font-medium text-foreground">{protocol.asset}</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Total Value Locked</p>
              </div>
              <p className="text-lg font-mono font-medium text-foreground">
                ${(protocol.tvl / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
              <p className="text-lg font-mono font-medium text-foreground">
                12.5K
              </p>
            </div>
          </div>

          {/* Protocol Details */}
          <div className="p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Protocol Details</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="capitalize text-foreground">{protocol.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network</span>
                <span className="text-foreground">{protocol.chain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk Score</span>
                <span className={getRiskColor(protocol.riskScore)}>{protocol.riskScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Audit Status</span>
                <span className="text-success">Verified</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="icon">
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Protocol
              </a>
            </Button>
            <Button className="flex-1" onClick={() => { onInvest?.(); onOpenChange(false); }}>
              Invest Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ProtocolDetailModal.displayName = "ProtocolDetailModal";
