import { memo, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Droplets, Boxes, ArrowUpRight, Search, Activity, Zap, Shield, Globe, Layers, Users, Coins, Star, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PoolDetailModal } from "@/components/dashboard/modals/PoolDetailModal";
import { DAppDetailModal } from "@/components/dashboard/modals/DAppDetailModal";
import { ProtocolDetailModal } from "@/components/dashboard/modals/ProtocolDetailModal";
import { AssetDetailModal } from "@/components/dashboard/modals/AssetDetailModal";
import { Asset as MockAsset } from "@/lib/mockData";
import { stellarApi, Protocol, Asset } from "@/services/stellarApi";
import { useQuery } from "@tanstack/react-query";

const protocolStats = [
  { name: 'Stellar TPS', value: '4,000+', icon: Zap },
  { name: 'Soroban Contracts', value: '2,500+', icon: Layers },
  { name: 'Active Anchors', value: '180+', icon: Shield },
  { name: 'Global Nodes', value: '40+', icon: Globe },
];

const ProtocolStatCard = memo(({ stat }: { stat: typeof protocolStats[0] }) => (
  <div className="card-elevated p-4 text-center">
    <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
    <p className="text-h2 font-bold text-foreground">{stat.value}</p>
    <p className="text-tiny text-muted-foreground">{stat.name}</p>
  </div>
));

ProtocolStatCard.displayName = "ProtocolStatCard";

const NetworkAggregateCard = memo(({ label, value, change, format = 'number' }: { label: string, value: number, change?: string, format?: string }) => {
  const formatValue = (val: number, fmt: string) => {
    if (fmt === 'currency') {
      if (val >= 1000000000) return '$' + (val / 1000000000).toFixed(1) + 'B';
      if (val >= 1000000) return '$' + (val / 1000000).toFixed(1) + 'M';
      if (val >= 1000) return '$' + (val / 1000).toFixed(1) + 'K';
      return '$' + val.toFixed(0);
    }
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val.toLocaleString();
  };

  return (
    <div className="card-elevated p-3">
      <p className="text-tiny text-muted-foreground mb-1">{label}</p>
      <p className="text-body font-bold font-mono text-foreground">
        {formatValue(value, format)}
      </p>
      {change && <p className="text-tiny text-success">{change} (24h)</p>}
    </div>
  );
});

NetworkAggregateCard.displayName = "NetworkAggregateCard";

const ProtocolCard = memo(({ protocol, onClick }: { protocol: Protocol; onClick: () => void }) => (
  <div className="card-elevated p-4 hover:shadow-card transition-all cursor-pointer" onClick={onClick}>
    <div className="flex items-center gap-3 mb-3">
      <span className="text-2xl">{protocol.logo}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-small font-medium text-foreground truncate">{protocol.name}</span>
          {protocol.audited && <Badge variant="secondary" className="text-tiny shrink-0">🛡️ Audited</Badge>}
        </div>
        <Badge variant="outline" className="text-tiny mt-1">{protocol.category}</Badge>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 text-tiny">
      <div>
        <p className="text-muted-foreground">TVL</p>
        <p className="font-mono font-medium text-foreground">
          {protocol.tvl > 0 ? `$${(protocol.tvl / 1000000).toFixed(1)}M` : 'N/A'}
        </p>
      </div>
      <div className="text-right">
        <p className="text-muted-foreground">APY</p>
        <p className="font-mono font-medium text-success">
          {protocol.apy > 0 ? `${protocol.apy.toFixed(1)}%` : 'N/A'}
        </p>
      </div>
    </div>
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
      <span className="text-tiny text-muted-foreground">{protocol.users.toLocaleString()} users</span>
      <span className="text-tiny text-primary">{protocol.token}</span>
    </div>
  </div>
));

ProtocolCard.displayName = "ProtocolCard";

const AssetRow = memo(({ asset, index, onClick }: { asset: Asset, index: number, onClick: () => void }) => (
  <div className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors cursor-pointer" onClick={onClick}>
    <div className="flex items-center gap-3">
      <span className="text-tiny text-muted-foreground w-4">{index + 1}</span>
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Star className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-small font-medium text-foreground">{asset.symbol}</p>
        <p className="text-tiny text-muted-foreground">{asset.name}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-small font-mono text-foreground">
        ${asset.price < 0.01 ? asset.price.toExponential(2) : asset.price.toFixed(2)}
      </p>
      <p className={`text-tiny ${asset.change24h >= 0 ? 'text-success' : 'text-destructive'}`}>
        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
      </p>
    </div>
    <div className="text-right hidden md:block">
      <p className="text-tiny text-muted-foreground">Vol: ${(asset.volume24h / 1000000).toFixed(1)}M</p>
    </div>
  </div>
));

AssetRow.displayName = "AssetRow";

const PoolRow = memo(({ pool, onClick }: { pool: any; onClick: () => void }) => (
  <div className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors cursor-pointer" onClick={onClick}>
    <div>
      <div className="flex items-center gap-2">
        <p className="text-small font-medium text-foreground truncate max-w-[120px]">{pool.id}</p>
        <Badge variant="secondary" className="text-tiny">{pool.fee / 100}%</Badge>
      </div>
      <p className="text-tiny text-muted-foreground">Liquidity Pool</p>
    </div>
    <div className="text-right">
      <p className="text-small font-mono text-success">
        ~5-15% APY
      </p>
      <p className="text-tiny text-muted-foreground">
        {pool.totalShares} Shares
      </p>
    </div>
    <div className="text-right hidden md:block">
      <p className="text-tiny text-primary flex items-center gap-1">
        View <ArrowUpRight className="w-3 h-3" />
      </p>
    </div>
  </div>
));

PoolRow.displayName = "PoolRow";

// Simplified DApp card 
const DAppCard = memo(({ dapp, onClick }: { dapp: any; onClick: () => void }) => (
  <div className="card-elevated p-4 hover:shadow-card transition-all cursor-pointer" onClick={onClick}>
    <div className="flex items-center gap-3 mb-3">
      <span className="text-2xl">{dapp.logo}</span>
      <div>
        <p className="text-small font-medium text-foreground">{dapp.name}</p>
        <Badge variant="outline" className="text-tiny">{dapp.category}</Badge>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Users className="w-3 h-3 text-muted-foreground" />
        <span className="text-tiny text-muted-foreground">{dapp.users}</span>
      </div>
      <span className="text-tiny text-success">+{dapp.growth}%</span>
    </div>
    <p className="text-tiny text-muted-foreground mt-2">TVL: {dapp.tvl}</p>
  </div>
));

DAppCard.displayName = "DAppCard";

export function TrendingSection() {
  const [searchQuery, setSearchQuery] = useState('');
  // Queries
  const { data: networkStats } = useQuery({
    queryKey: ['networkStats'],
    queryFn: stellarApi.getNetworkStats,
    refetchInterval: 60000,
  });

  const { data: defaultProtocols = [], isLoading: protocolsLoading } = useQuery({
    queryKey: ['protocols'],
    queryFn: stellarApi.getSorobanProtocols,
  });

  const { data: defaultAssets = [], isLoading: assetsLoading } = useQuery({
    queryKey: ['trendingAssets'],
    queryFn: stellarApi.getTrendingAssets,
  });

  const { data: pools = [] } = useQuery({
    queryKey: ['liquidityPools'],
    queryFn: stellarApi.getLiquidityPools,
  });

  // Search Query
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => stellarApi.search(searchQuery),
    enabled: searchQuery.length > 0,
  });

  // Derived state
  const isSearching = searchQuery.length > 0;

  const displayedAssets = isSearching
    ? (searchResults?.matchedAssets || [])
    : defaultAssets;

  const displayedProtocols = isSearching
    ? (searchResults?.matchedProtocols || [])
    : defaultProtocols;

  // Loading states
  const showAssetsLoading = isSearching ? searchLoading : assetsLoading;
  const showProtocolsLoading = isSearching ? searchLoading : protocolsLoading;


  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [selectedDApp, setSelectedDApp] = useState<any>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MockAsset | null>(null);

  const [poolModalOpen, setPoolModalOpen] = useState(false);
  const [dappModalOpen, setDappModalOpen] = useState(false);
  const [protocolModalOpen, setProtocolModalOpen] = useState(false);
  const [assetModalOpen, setAssetModalOpen] = useState(false);

  const handleAssetClick = useCallback((asset: Asset) => {
    const assetData: MockAsset = {
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      logo: "⭐",
      balance: 0,
      value: 0,
      price: asset.price,
      change24h: asset.change24h,
      chain: "Stellar",
    };
    setSelectedAsset(assetData);
    setAssetModalOpen(true);
  }, []);

  return (
    <>
      <PoolDetailModal
        open={poolModalOpen}
        onOpenChange={setPoolModalOpen}
        pool={selectedPool ? {
          pair: selectedPool.id.substring(0, 10) + '...',
          protocol: 'Stellar DEX',
          tvl: 0,
          apy: 0,
          age: 'N/A',
          volume24h: 'N/A',
        } : null}
      />
      <DAppDetailModal
        open={dappModalOpen}
        onOpenChange={setDappModalOpen}
        dapp={selectedDApp}
      />
      <ProtocolDetailModal
        open={protocolModalOpen}
        onOpenChange={setProtocolModalOpen}
        protocol={selectedProtocol as any}
      />
      <AssetDetailModal
        open={assetModalOpen}
        onOpenChange={setAssetModalOpen}
        asset={selectedAsset}
      />

      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-8 animate-fade-in">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Activity className="w-3 h-3 mr-1" />
              Live Data
            </Badge>
            <h2 className="text-h1 md:text-4xl font-bold text-foreground mb-4">
              Explore the Stellar Ecosystem
            </h2>
            <p className="text-body text-muted-foreground mb-6">
              Stream and aggregate Soroban smart contract positions, discover trending assets, and find new opportunities.
            </p>

            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search assets, protocols..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {protocolStats.map((stat, index) => (
              <ProtocolStatCard key={index} stat={stat} />
            ))}
          </div>

          {networkStats && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary animate-pulse" />
                <h3 className="text-h3 font-semibold text-foreground">Live Network Aggregates</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <NetworkAggregateCard label="Total XLM Vol" value={networkStats.volume24h} change="+8.2%" format="currency" />
                <NetworkAggregateCard label="Active Contracts" value={networkStats.activeContracts} change="+12" />
                <NetworkAggregateCard label="Unique Wallets" value={networkStats.uniqueWallets} change="+2.1K" />
                <NetworkAggregateCard label="Transactions" value={networkStats.txCount24h} change="+180K" />
                <NetworkAggregateCard label="Gas Fees (XLM)" value={networkStats.fees24h} change="+12%" />
                <NetworkAggregateCard label="Contract Calls" value={networkStats.contractCalls24h} change="+95K" />
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <h3 className="text-h3 font-semibold text-foreground">Soroban Smart Contract Protocols</h3>
                <Badge variant="secondary" className="text-tiny">Live</Badge>
              </div>
              <Link to="/soroban-positions">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {showProtocolsLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading protocols...</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayedProtocols.slice(0, 4).map((protocol) => (
                  <ProtocolCard
                    key={protocol.id}
                    protocol={protocol}
                    onClick={() => {
                      setSelectedProtocol(protocol);
                      setProtocolModalOpen(true);
                    }}
                  />
                ))}
                {displayedProtocols.length === 0 && (
                  <div className="col-span-full text-center py-4 text-muted-foreground">
                    {isSearching ? `No protocols found matching "${searchQuery}"` : "No protocols available"}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Trending Assets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <h3 className="text-h3 font-semibold text-foreground">
                    {isSearching ? 'Search Results' : 'Trending Assets'}
                  </h3>
                </div>
                <Link to="/trending-assets">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="card-elevated divide-y divide-border max-h-[400px] overflow-y-auto">
                {showAssetsLoading ? (
                  <div className="p-4 text-center text-muted-foreground">Loading assets...</div>
                ) : (
                  <>
                    {displayedAssets.slice(0, 10).map((asset: Asset, i: number) => (
                      <AssetRow key={asset.id} asset={asset} index={i} onClick={() => handleAssetClick(asset)} />
                    ))}
                    {displayedAssets.length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">
                        {isSearching ? `No assets found matching "${searchQuery}"` : "No assets available"}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-primary" />
                  <h3 className="text-h3 font-semibold text-foreground">New Liquidity Pools</h3>
                </div>
                <Link to="/liquidity-pools">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="card-elevated divide-y divide-border max-h-[400px] overflow-y-auto">
                {pools.slice(0, 8).map((pool: any) => (
                  <PoolRow
                    key={pool.id}
                    pool={pool}
                    onClick={() => {
                      setSelectedPool(pool);
                      setPoolModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default TrendingSection;
