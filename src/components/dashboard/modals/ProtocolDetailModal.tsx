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
  Layers,
  Coins,
  Droplets,
  Landmark,
  ArrowRightLeft,
} from "lucide-react";
import { YieldOpportunity } from "@/lib/mockData";

// Soroban Protocol type for ecosystem protocols
export interface SorobanProtocol {
  id: string;
  name: string;
  category: string;
  tvl: number;
  apy: number;
  token: string;
  audited: boolean;
  users: string | number;
  logo: string;
}

type ProtocolType = SorobanProtocol | YieldOpportunity;

interface ProtocolDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  protocol: ProtocolType | null;
  onInvest?: () => void;
}

// Type guard to check if protocol is SorobanProtocol
function isSorobanProtocol(protocol: ProtocolType): protocol is SorobanProtocol {
  return 'name' in protocol && 'audited' in protocol && 'logo' in protocol;
}

export const ProtocolDetailModal = memo(({
  open,
  onOpenChange,
  protocol,
  onInvest
}: ProtocolDetailModalProps) => {
  if (!protocol) return null;

  const isSoroban = isSorobanProtocol(protocol);

  // Normalize data based on type
  const displayName = isSoroban ? protocol.name : protocol.protocol;
  const displayLogo = isSoroban ? protocol.logo : protocol.protocolLogo;
  const displayCategory = protocol.category;
  const displayToken = isSoroban ? protocol.token : protocol.asset;
  const displayAudited = isSoroban ? protocol.audited : true;
  const displayUsers = isSoroban ? protocol.users : '12.5K';
  const displayChain = isSoroban ? 'Stellar / Soroban' : protocol.chain;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
              {displayLogo}
            </div>
            <div>
              <span>{displayName}</span>
              <p className="text-sm text-muted-foreground font-normal capitalize">{displayCategory}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">{displayToken}</Badge>
            {isSoroban && (
              <Badge variant="secondary" className="text-xs">
                <Layers className="w-3 h-3 mr-1" />
                Soroban
              </Badge>
            )}
            {displayAudited && (
              <Badge variant="outline" className="text-xs bg-success/10 border-success/20 text-success">
                <Shield className="w-3 h-3 mr-1" />
                Audited
              </Badge>
            )}
          </div>

          {/* APY Card */}
          {protocol.apy > 0 && (
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
                  <p className="text-sm text-muted-foreground mb-1">Est. Daily ($10K)</p>
                  <p className="text-lg font-mono font-medium text-success">
                    +${((10000 * protocol.apy / 100) / 365).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Total Value Locked</p>
              </div>
              <p className="text-lg font-mono font-medium text-foreground">
                {protocol.tvl > 0 ? `$${(protocol.tvl / 1000000).toFixed(1)}M` : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
              <p className="text-lg font-mono font-medium text-foreground">
                {displayUsers}
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
                <span className="capitalize text-foreground">{displayCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Asset/Token</span>
                <span className="text-foreground">{displayToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network</span>
                <span className="text-foreground">{displayChain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Security</span>
                <span className={displayAudited ? "text-success" : "text-warning"}>
                  {displayAudited ? "Audited ✓" : "Unaudited"}
                </span>
              </div>
            </div>
          </div>

          {/* Protocol-Specific Actions */}
          <div className="space-y-2 pt-2">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Star className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Protocol
                </a>
              </Button>
            </div>

            {/* Category-Specific Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {displayCategory === 'dex' && (
                <>
                  <Button variant="secondary" onClick={() => { onInvest?.(); onOpenChange(false); }}>
                    <Droplets className="w-4 h-4 mr-2" />
                    Provide Liquidity
                  </Button>
                  <Button variant="secondary" onClick={() => onOpenChange(false)}>
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Swap
                  </Button>
                </>
              )}
              {displayCategory === 'lending' && (
                <>
                  <Button variant="secondary" onClick={() => { onInvest?.(); onOpenChange(false); }}>
                    <Landmark className="w-4 h-4 mr-2" />
                    Lend Assets
                  </Button>
                  <Button variant="secondary" onClick={() => onOpenChange(false)}>
                    <Wallet className="w-4 h-4 mr-2" />
                    Borrow
                  </Button>
                </>
              )}
              {displayCategory === 'staking' && (
                <>
                  <Button variant="secondary" onClick={() => { onInvest?.(); onOpenChange(false); }}>
                    <Coins className="w-4 h-4 mr-2" />
                    Stake
                  </Button>
                  <Button variant="secondary" onClick={() => onOpenChange(false)}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Claim Rewards
                  </Button>
                </>
              )}
              {!['dex', 'lending', 'staking'].includes(displayCategory) && protocol.apy > 0 && (
                <Button className="col-span-2" onClick={() => { onInvest?.(); onOpenChange(false); }}>
                  Invest Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ProtocolDetailModal.displayName = "ProtocolDetailModal";