import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Droplets, Search, Filter, ArrowUpRight, TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PoolDetailModal } from "@/components/dashboard/modals/PoolDetailModal";
import { FooterSection } from "@/components/landing/FooterSection";
import { useFavorites } from "@/hooks/useFavorites";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const allPools = [
  { id: '1', pair: 'XLM/USDC', protocol: 'Aquarius', tvl: 45000000, apy: 14.5, age: '2d', volume24h: '$890K', fees24h: '$2.67K', risk: 'Low' as const },
  { id: '2', pair: 'AQUA/XLM', protocol: 'StellarSwap', tvl: 12000000, apy: 22.3, age: '5d', volume24h: '$420K', fees24h: '$1.26K', risk: 'Medium' as const },
  { id: '3', pair: 'yXLM/USDC', protocol: 'Blend', tvl: 8500000, apy: 18.7, age: '1w', volume24h: '$650K', fees24h: '$1.95K', risk: 'Low' as const },
  { id: '4', pair: 'ETH/XLM', protocol: 'Lumenswap', tvl: 6200000, apy: 12.1, age: '3d', volume24h: '$180K', fees24h: '$540', risk: 'Medium' as const },
  { id: '5', pair: 'BLND/XLM', protocol: 'Blend', tvl: 4800000, apy: 24.5, age: '4d', volume24h: '$520K', fees24h: '$1.56K', risk: 'Medium' as const },
  { id: '6', pair: 'PHO/USDC', protocol: 'Phoenix', tvl: 2100000, apy: 32.2, age: '1d', volume24h: '$95K', fees24h: '$285', risk: 'High' as const },
  { id: '7', pair: 'BTC/XLM', protocol: 'StellarX', tvl: 15600000, apy: 5.2, age: '2w', volume24h: '$1.2M', fees24h: '$3.6K', risk: 'Low' as const },
  { id: '8', pair: 'EURC/USDC', protocol: 'Circle', tvl: 28900000, apy: 4.1, age: '1w', volume24h: '$2.1M', fees24h: '$6.3K', risk: 'Low' as const },
  { id: '9', pair: 'XLM/AQUA', protocol: 'Soroswap', tvl: 9800000, apy: 19.8, age: '3d', volume24h: '$380K', fees24h: '$1.14K', risk: 'Medium' as const },
  { id: '10', pair: 'USDC/EURC', protocol: 'Aquarius', tvl: 18500000, apy: 3.8, age: '2w', volume24h: '$1.8M', fees24h: '$5.4K', risk: 'Low' as const },
  { id: '11', pair: 'yBTC/BTC', protocol: 'Ultra Capital', tvl: 12400000, apy: 6.5, age: '1w', volume24h: '$890K', fees24h: '$2.67K', risk: 'Low' as const },
  { id: '12', pair: 'ETH/USDC', protocol: 'Lumenswap', tvl: 8900000, apy: 11.2, age: '5d', volume24h: '$560K', fees24h: '$1.68K', risk: 'Low' as const },
  { id: '13', pair: 'SHX/XLM', protocol: 'Stronghold', tvl: 3200000, apy: 28.5, age: '2d', volume24h: '$145K', fees24h: '$435', risk: 'High' as const },
  { id: '14', pair: 'GRAT/XLM', protocol: 'Community', tvl: 890000, apy: 45.2, age: '1d', volume24h: '$42K', fees24h: '$126', risk: 'High' as const },
  { id: '15', pair: 'RMT/USDC', protocol: 'SureRemit', tvl: 1500000, apy: 15.8, age: '1w', volume24h: '$78K', fees24h: '$234', risk: 'Medium' as const },
  { id: '16', pair: 'ARST/XLM', protocol: 'ARS', tvl: 2800000, apy: 12.4, age: '4d', volume24h: '$120K', fees24h: '$360', risk: 'Medium' as const },
  { id: '17', pair: 'NOVA/USDC', protocol: 'Nova Swap', tvl: 4200000, apy: 21.3, age: '3d', volume24h: '$210K', fees24h: '$630', risk: 'Medium' as const },
  { id: '18', pair: 'ORB/XLM', protocol: 'Orbit', tvl: 1800000, apy: 35.8, age: '1d', volume24h: '$95K', fees24h: '$285', risk: 'High' as const },
  { id: '19', pair: 'DLT/USDC', protocol: 'Delta', tvl: 3500000, apy: 18.9, age: '5d', volume24h: '$180K', fees24h: '$540', risk: 'Medium' as const },
  { id: '20', pair: 'NEX/XLM', protocol: 'Nexus', tvl: 5600000, apy: 14.2, age: '1w', volume24h: '$290K', fees24h: '$870', risk: 'Low' as const },
];

const getRiskColor = (risk: 'Low' | 'Medium' | 'High') => {
  switch (risk) {
    case 'Low': return 'bg-success/10 text-success border-success/30';
    case 'Medium': return 'bg-warning/10 text-warning border-warning/30';
    case 'High': return 'bg-destructive/10 text-destructive border-destructive/30';
  }
};

const ITEMS_PER_PAGE = 8;

export default function LiquidityPools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('tvl');
  const [filterProtocol, setFilterProtocol] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedPool, setSelectedPool] = useState<typeof allPools[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { favorites, toggleFavorite, isFavorite } = useFavorites('pools');

  const protocols = [...new Set(allPools.map(p => p.protocol))];

  const filteredPools = useMemo(() => {
    return allPools
      .filter(pool => {
        const matchesSearch = pool.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pool.protocol.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesProtocol = filterProtocol === 'all' || pool.protocol === filterProtocol;
        const matchesFavorites = !showFavoritesOnly || isFavorite(pool.id);
        return matchesSearch && matchesProtocol && matchesFavorites;
      })
      .sort((a, b) => {
        if (sortBy === 'tvl') return b.tvl - a.tvl;
        if (sortBy === 'apy') return b.apy - a.apy;
        if (sortBy === 'volume') return parseFloat(b.volume24h.replace(/[^0-9.]/g, '')) - parseFloat(a.volume24h.replace(/[^0-9.]/g, ''));
        return 0;
      });
  }, [searchQuery, filterProtocol, sortBy, showFavoritesOnly, isFavorite]);

  const totalPages = Math.ceil(filteredPools.length / ITEMS_PER_PAGE);
  const paginatedPools = filteredPools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalTvl = allPools.reduce((sum, pool) => sum + pool.tvl, 0);
  const avgApy = allPools.reduce((sum, pool) => sum + pool.apy, 0) / allPools.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="h-8 px-2 sm:px-3">
                  <ArrowLeft className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <h1 className="text-base sm:text-xl font-bold text-foreground">Liquidity Pools</h1>
              </div>
            </div>
            <Link to="/dashboard">
              <Button size="sm" className="w-full sm:w-auto">Launch Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-8 flex-1">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="card-elevated p-3 sm:p-4">
            <p className="text-tiny text-muted-foreground">Total Pools</p>
            <p className="text-lg sm:text-h2 font-bold text-foreground">{allPools.length}</p>
          </div>
          <div className="card-elevated p-3 sm:p-4">
            <p className="text-tiny text-muted-foreground">Total TVL</p>
            <p className="text-lg sm:text-h2 font-bold text-foreground">${(totalTvl / 1000000).toFixed(1)}M</p>
          </div>
          <div className="card-elevated p-3 sm:p-4">
            <p className="text-tiny text-muted-foreground">Average APY</p>
            <p className="text-lg sm:text-h2 font-bold text-success">{avgApy.toFixed(1)}%</p>
          </div>
          <div className="card-elevated p-3 sm:p-4">
            <p className="text-tiny text-muted-foreground">Watchlist</p>
            <p className="text-lg sm:text-h2 font-bold text-primary">{favorites.length}</p>
          </div>
        </div>

        {/* Top Pools by APY */}
        <div className="card-elevated p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Highest APY Pools</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            {[...allPools].sort((a, b) => b.apy - a.apy).slice(0, 5).map((pool) => (
              <div 
                key={pool.id} 
                className="p-2 sm:p-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                onClick={() => {
                  setSelectedPool(pool);
                  setModalOpen(true);
                }}
              >
                <p className="font-medium text-foreground text-sm sm:text-base truncate">{pool.pair}</p>
                <p className="text-success font-mono text-base sm:text-lg">{pool.apy.toFixed(1)}%</p>
                <p className="text-tiny text-muted-foreground truncate">{pool.protocol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pools..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tvl">TVL (High to Low)</SelectItem>
                <SelectItem value="apy">APY (High to Low)</SelectItem>
                <SelectItem value="volume">Volume (24h)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterProtocol} onValueChange={(v) => { setFilterProtocol(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full">
                <Filter className="w-4 h-4 mr-2 shrink-0" />
                <SelectValue placeholder="Protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Protocols</SelectItem>
                {protocols.map(protocol => (
                  <SelectItem key={protocol} value={protocol}>{protocol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              onClick={() => { setShowFavoritesOnly(!showFavoritesOnly); setCurrentPage(1); }}
              className="w-full col-span-2 sm:col-span-1"
            >
              <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              Watchlist
            </Button>
          </div>
        </div>

        {/* Pools - Mobile Cards */}
        <div className="block md:hidden space-y-3">
          {paginatedPools.map((pool) => (
            <div 
              key={pool.id} 
              className="card-elevated p-3 cursor-pointer hover:shadow-card transition-all relative"
              onClick={() => {
                setSelectedPool(pool);
                setModalOpen(true);
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(pool.id);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-secondary transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorite(pool.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
              </button>
              <div className="flex items-center justify-between mb-2 pr-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{pool.pair}</p>
                    <Badge variant="outline" className="text-tiny">{pool.protocol}</Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                <div>
                  <p className="text-tiny text-muted-foreground">APY</p>
                  <p className="text-success font-mono font-medium">{pool.apy.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-tiny text-muted-foreground">TVL</p>
                  <p className="font-mono text-foreground">${(pool.tvl / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-tiny text-muted-foreground">Volume</p>
                  <p className="text-muted-foreground">{pool.volume24h}</p>
                </div>
                <div>
                  <p className="text-tiny text-muted-foreground">Risk</p>
                  <Badge variant="outline" className={`text-tiny ${getRiskColor(pool.risk)}`}>{pool.risk}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pools Table - Desktop */}
        <div className="hidden md:block card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 text-tiny font-medium text-muted-foreground w-10"></th>
                  <th className="text-left p-4 text-tiny font-medium text-muted-foreground">Pool</th>
                  <th className="text-left p-4 text-tiny font-medium text-muted-foreground">Protocol</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground">APY</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground">TVL</th>
                  <th className="text-center p-4 text-tiny font-medium text-muted-foreground">Risk</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground">Volume (24h)</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground hidden lg:table-cell">Fees (24h)</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground hidden lg:table-cell">Age</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedPools.map((pool) => (
                  <tr 
                    key={pool.id} 
                    className="hover:bg-secondary/30 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedPool(pool);
                      setModalOpen(true);
                    }}
                  >
                    <td className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(pool.id);
                        }}
                        className="p-1 rounded hover:bg-secondary transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${isFavorite(pool.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Droplets className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{pool.pair}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{pool.protocol}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-success font-mono">{pool.apy.toFixed(1)}%</span>
                    </td>
                    <td className="p-4 text-right font-mono text-foreground">
                      ${(pool.tvl / 1000000).toFixed(1)}M
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant="outline" className={getRiskColor(pool.risk)}>{pool.risk}</Badge>
                    </td>
                    <td className="p-4 text-right text-muted-foreground">{pool.volume24h}</td>
                    <td className="p-4 text-right text-muted-foreground hidden lg:table-cell">{pool.fees24h}</td>
                    <td className="p-4 text-right text-muted-foreground hidden lg:table-cell">{pool.age}</td>
                    <td className="p-4 text-right">
                      <ArrowUpRight className="w-4 h-4 text-primary inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {showFavoritesOnly ? "No pools in your watchlist yet." : "No pools found matching your criteria."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page} className="hidden sm:block">
                    <PaginationLink 
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem className="sm:hidden">
                  <span className="px-3 py-2 text-sm text-muted-foreground">
                    {currentPage} / {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

      <FooterSection />
    </div>
  );
}
