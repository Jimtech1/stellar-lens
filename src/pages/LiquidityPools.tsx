import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Droplets, Search, Filter, ArrowUpRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PoolDetailModal } from "@/components/dashboard/modals/PoolDetailModal";

const allPools = [
  { id: '1', pair: 'XLM/USDC', protocol: 'Aquarius', tvl: 45000000, apy: 14.5, age: '2d', volume24h: '$890K', fees24h: '$2.67K' },
  { id: '2', pair: 'AQUA/XLM', protocol: 'StellarSwap', tvl: 12000000, apy: 22.3, age: '5d', volume24h: '$420K', fees24h: '$1.26K' },
  { id: '3', pair: 'yXLM/USDC', protocol: 'Blend', tvl: 8500000, apy: 18.7, age: '1w', volume24h: '$650K', fees24h: '$1.95K' },
  { id: '4', pair: 'ETH/XLM', protocol: 'Lumenswap', tvl: 6200000, apy: 12.1, age: '3d', volume24h: '$180K', fees24h: '$540' },
  { id: '5', pair: 'BLND/XLM', protocol: 'Blend', tvl: 4800000, apy: 24.5, age: '4d', volume24h: '$520K', fees24h: '$1.56K' },
  { id: '6', pair: 'PHO/USDC', protocol: 'Phoenix', tvl: 2100000, apy: 32.2, age: '1d', volume24h: '$95K', fees24h: '$285' },
  { id: '7', pair: 'BTC/XLM', protocol: 'StellarX', tvl: 15600000, apy: 5.2, age: '2w', volume24h: '$1.2M', fees24h: '$3.6K' },
  { id: '8', pair: 'EURC/USDC', protocol: 'Circle', tvl: 28900000, apy: 4.1, age: '1w', volume24h: '$2.1M', fees24h: '$6.3K' },
  { id: '9', pair: 'XLM/AQUA', protocol: 'Soroswap', tvl: 9800000, apy: 19.8, age: '3d', volume24h: '$380K', fees24h: '$1.14K' },
  { id: '10', pair: 'USDC/EURC', protocol: 'Aquarius', tvl: 18500000, apy: 3.8, age: '2w', volume24h: '$1.8M', fees24h: '$5.4K' },
  { id: '11', pair: 'yBTC/BTC', protocol: 'Ultra Capital', tvl: 12400000, apy: 6.5, age: '1w', volume24h: '$890K', fees24h: '$2.67K' },
  { id: '12', pair: 'ETH/USDC', protocol: 'Lumenswap', tvl: 8900000, apy: 11.2, age: '5d', volume24h: '$560K', fees24h: '$1.68K' },
  { id: '13', pair: 'SHX/XLM', protocol: 'Stronghold', tvl: 3200000, apy: 28.5, age: '2d', volume24h: '$145K', fees24h: '$435' },
  { id: '14', pair: 'GRAT/XLM', protocol: 'Community', tvl: 890000, apy: 45.2, age: '1d', volume24h: '$42K', fees24h: '$126' },
  { id: '15', pair: 'RMT/USDC', protocol: 'SureRemit', tvl: 1500000, apy: 15.8, age: '1w', volume24h: '$78K', fees24h: '$234' },
  { id: '16', pair: 'ARST/XLM', protocol: 'ARS', tvl: 2800000, apy: 12.4, age: '4d', volume24h: '$120K', fees24h: '$360' },
  { id: '17', pair: 'NOVA/USDC', protocol: 'Nova Swap', tvl: 4200000, apy: 21.3, age: '3d', volume24h: '$210K', fees24h: '$630' },
  { id: '18', pair: 'ORB/XLM', protocol: 'Orbit', tvl: 1800000, apy: 35.8, age: '1d', volume24h: '$95K', fees24h: '$285' },
  { id: '19', pair: 'DLT/USDC', protocol: 'Delta', tvl: 3500000, apy: 18.9, age: '5d', volume24h: '$180K', fees24h: '$540' },
  { id: '20', pair: 'NEX/XLM', protocol: 'Nexus', tvl: 5600000, apy: 14.2, age: '1w', volume24h: '$290K', fees24h: '$870' },
];

export default function LiquidityPools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('tvl');
  const [filterProtocol, setFilterProtocol] = useState('all');
  const [selectedPool, setSelectedPool] = useState<typeof allPools[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const protocols = [...new Set(allPools.map(p => p.protocol))];

  const filteredPools = allPools
    .filter(pool => {
      const matchesSearch = pool.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pool.protocol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProtocol = filterProtocol === 'all' || pool.protocol === filterProtocol;
      return matchesSearch && matchesProtocol;
    })
    .sort((a, b) => {
      if (sortBy === 'tvl') return b.tvl - a.tvl;
      if (sortBy === 'apy') return b.apy - a.apy;
      if (sortBy === 'volume') return parseFloat(b.volume24h.replace(/[^0-9.]/g, '')) - parseFloat(a.volume24h.replace(/[^0-9.]/g, ''));
      return 0;
    });

  const totalTvl = allPools.reduce((sum, pool) => sum + pool.tvl, 0);
  const avgApy = allPools.reduce((sum, pool) => sum + pool.apy, 0) / allPools.length;

  return (
    <div className="min-h-screen bg-background">
      <PoolDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        pool={selectedPool ? {
          pair: selectedPool.pair,
          protocol: selectedPool.protocol,
          tvl: selectedPool.tvl,
          apy: selectedPool.apy,
          age: selectedPool.age,
          volume24h: selectedPool.volume24h,
        } : null}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Droplets className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Liquidity Pools</h1>
              </div>
            </div>
            <Link to="/dashboard">
              <Button>Launch Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-elevated p-4">
            <p className="text-tiny text-muted-foreground">Total Pools</p>
            <p className="text-h2 font-bold text-foreground">{allPools.length}</p>
          </div>
          <div className="card-elevated p-4">
            <p className="text-tiny text-muted-foreground">Total TVL</p>
            <p className="text-h2 font-bold text-foreground">${(totalTvl / 1000000).toFixed(1)}M</p>
          </div>
          <div className="card-elevated p-4">
            <p className="text-tiny text-muted-foreground">Average APY</p>
            <p className="text-h2 font-bold text-success">{avgApy.toFixed(1)}%</p>
          </div>
          <div className="card-elevated p-4">
            <p className="text-tiny text-muted-foreground">Protocols</p>
            <p className="text-h2 font-bold text-foreground">{protocols.length}</p>
          </div>
        </div>

        {/* Top Pools by APY */}
        <div className="card-elevated p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-success" />
            <h3 className="font-semibold text-foreground">Highest APY Pools</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...allPools].sort((a, b) => b.apy - a.apy).slice(0, 5).map((pool) => (
              <div 
                key={pool.id} 
                className="p-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                onClick={() => {
                  setSelectedPool(pool);
                  setModalOpen(true);
                }}
              >
                <p className="font-medium text-foreground">{pool.pair}</p>
                <p className="text-success font-mono text-lg">{pool.apy.toFixed(1)}%</p>
                <p className="text-tiny text-muted-foreground">{pool.protocol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tvl">TVL (High to Low)</SelectItem>
              <SelectItem value="apy">APY (High to Low)</SelectItem>
              <SelectItem value="volume">Volume (24h)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterProtocol} onValueChange={setFilterProtocol}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Protocol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Protocols</SelectItem>
              {protocols.map(protocol => (
                <SelectItem key={protocol} value={protocol}>{protocol}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pools Table */}
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 text-tiny font-medium text-muted-foreground">Pool</th>
                  <th className="text-left p-4 text-tiny font-medium text-muted-foreground">Protocol</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground">APY</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground">TVL</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground hidden md:table-cell">Volume (24h)</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground hidden lg:table-cell">Fees (24h)</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground hidden lg:table-cell">Age</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPools.map((pool) => (
                  <tr 
                    key={pool.id} 
                    className="hover:bg-secondary/30 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedPool(pool);
                      setModalOpen(true);
                    }}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Droplets className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{pool.pair}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{pool.protocol}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-success font-mono font-medium">{pool.apy.toFixed(1)}%</span>
                    </td>
                    <td className="p-4 text-right font-mono text-foreground">
                      ${(pool.tvl / 1000000).toFixed(1)}M
                    </td>
                    <td className="p-4 text-right text-muted-foreground hidden md:table-cell">{pool.volume24h}</td>
                    <td className="p-4 text-right text-muted-foreground hidden lg:table-cell">{pool.fees24h}</td>
                    <td className="p-4 text-right hidden lg:table-cell">
                      <Badge variant="outline">{pool.age}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <ArrowUpRight className="w-4 h-4 text-primary inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
