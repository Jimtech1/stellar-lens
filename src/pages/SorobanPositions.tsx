import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Coins, Search, Filter, TrendingUp, ArrowUpRight, Heart, Shield, Users } from "lucide-react";
import { HoloLogo } from "@/components/HoloLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProtocolDetailModal, SorobanProtocol } from "@/components/dashboard/modals/ProtocolDetailModal";
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

const allProtocols: SorobanProtocol[] = [
  { id: '1', name: 'Blend Protocol', category: 'Lending', tvl: 15200000, apy: 8.5, token: 'BLND', audited: true, users: '12.5K', logo: '🔷' },
  { id: '2', name: 'Aquarius', category: 'AMM/DEX', tvl: 45000000, apy: 12.3, token: 'AQUA', audited: true, users: '45.2K', logo: '🌊' },
  { id: '3', name: 'Soroswap', category: 'AMM', tvl: 8500000, apy: 18.7, token: 'SORO', audited: true, users: '8.9K', logo: '⚡' },
  { id: '4', name: 'Phoenix DeFi', category: 'Yield', tvl: 4200000, apy: 22.3, token: 'PHO', audited: false, users: '5.6K', logo: '🔥' },
  { id: '5', name: 'Ultra Capital', category: 'Lending', tvl: 9400000, apy: 5.4, token: 'yUSDC', audited: true, users: '18K', logo: '💎' },
  { id: '6', name: 'Mercury', category: 'Indexer', tvl: 0, apy: 0, token: 'MERC', audited: true, users: '8K', logo: '📊' },
  { id: '7', name: 'Lumenswap', category: 'AMM', tvl: 6800000, apy: 15.2, token: 'LSP', audited: true, users: '32K', logo: '💧' },
  { id: '8', name: 'StellarX', category: 'DEX', tvl: 12500000, apy: 5.8, token: 'XLM', audited: true, users: '85K', logo: '🌟' },
  { id: '9', name: 'Freighter', category: 'Wallet', tvl: 0, apy: 0, token: 'N/A', audited: true, users: '125K', logo: '🚀' },
  { id: '10', name: 'Stellar Expert', category: 'Explorer', tvl: 0, apy: 0, token: 'N/A', audited: true, users: '85K', logo: '🔍' },
  { id: '11', name: 'Lobstr', category: 'Wallet', tvl: 0, apy: 0, token: 'N/A', audited: true, users: '200K', logo: '🦞' },
  { id: '12', name: 'Script3', category: 'Infrastructure', tvl: 0, apy: 0, token: 'N/A', audited: true, users: '5K', logo: '📜' },
  { id: '13', name: 'Stellar Term', category: 'DEX', tvl: 3200000, apy: 4.2, token: 'XLM', audited: true, users: '15K', logo: '📈' },
  { id: '14', name: 'FxDAO', category: 'Stablecoin', tvl: 2800000, apy: 6.8, token: 'FXD', audited: true, users: '3.2K', logo: '💰' },
  { id: '15', name: 'Reflector', category: 'Oracle', tvl: 0, apy: 0, token: 'N/A', audited: true, users: '1.2K', logo: '🔮' },
  { id: '16', name: 'Comet', category: 'AMM', tvl: 5600000, apy: 14.5, token: 'COMET', audited: true, users: '6.8K', logo: '☄️' },
  { id: '17', name: 'Sep41', category: 'Token Standard', tvl: 0, apy: 0, token: 'N/A', audited: true, users: '10K', logo: '🔧' },
  { id: '18', name: 'Passkey Kit', category: 'Auth', tvl: 0, apy: 0, token: 'N/A', audited: true, users: '2.5K', logo: '🔐' },
  { id: '19', name: 'Allbridge', category: 'Bridge', tvl: 8900000, apy: 0, token: 'ABR', audited: true, users: '12K', logo: '🌉' },
  { id: '20', name: 'Pendulum', category: 'Bridge', tvl: 4500000, apy: 0, token: 'PEN', audited: true, users: '4.5K', logo: '⏰' },
];

const ITEMS_PER_PAGE = 8;

export default function SorobanPositions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('tvl');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<SorobanProtocol | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { favorites, toggleFavorite, isFavorite } = useFavorites('protocols');

  const categories = useMemo(() => {
    const cats = new Set(allProtocols.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const filteredProtocols = useMemo(() => {
    return allProtocols
      .filter(protocol => {
        const matchesSearch = protocol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          protocol.token.toLowerCase().includes(searchQuery.toLowerCase()) ||
          protocol.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || protocol.category === filterCategory;
        const matchesFavorites = !showFavoritesOnly || isFavorite(protocol.id);
        return matchesSearch && matchesCategory && matchesFavorites;
      })
      .sort((a, b) => {
        if (sortBy === 'tvl') return b.tvl - a.tvl;
        if (sortBy === 'apy') return b.apy - a.apy;
        if (sortBy === 'users') {
          const parseUsers = (u: string) => parseFloat(u.replace('K', '')) * (u.includes('K') ? 1000 : 1);
          return parseUsers(b.users) - parseUsers(a.users);
        }
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [searchQuery, filterCategory, sortBy, showFavoritesOnly, isFavorite]);

  const totalPages = Math.ceil(filteredProtocols.length / ITEMS_PER_PAGE);
  const paginatedProtocols = filteredProtocols.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const totalTvl = allProtocols.reduce((sum, p) => sum + p.tvl, 0);
  const avgApy = allProtocols.filter(p => p.apy > 0).reduce((sum, p, _, arr) => sum + p.apy / arr.length, 0);
  const auditedCount = allProtocols.filter(p => p.audited).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProtocolDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        protocol={selectedProtocol}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/">
                <HoloLogo size="sm" />
              </Link>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <h1 className="text-base sm:text-xl font-bold text-foreground">Soroban Protocols</h1>
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
            <p className="text-tiny text-muted-foreground">Total Protocols</p>
            <p className="text-lg sm:text-h2 font-bold text-foreground">{allProtocols.length}</p>
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
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-success" />
              <p className="text-tiny text-muted-foreground">Audited</p>
            </div>
            <p className="text-lg sm:text-h2 font-bold text-success">{auditedCount}/{allProtocols.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search protocols..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Select value={sortBy} onValueChange={(v) => handleFilterChange(setSortBy, v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tvl">TVL (High to Low)</SelectItem>
                <SelectItem value="apy">APY (High to Low)</SelectItem>
                <SelectItem value="users">Users (High to Low)</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={(v) => handleFilterChange(setFilterCategory, v)}>
              <SelectTrigger className="w-full">
                <Filter className="w-4 h-4 mr-2 shrink-0" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
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

        {/* Protocols Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {paginatedProtocols.map((protocol) => (
            <div
              key={protocol.id}
              className="card-elevated p-3 sm:p-4 hover:shadow-card transition-all cursor-pointer relative"
              onClick={() => {
                setSelectedProtocol(protocol);
                setModalOpen(true);
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(protocol.id);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-secondary transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorite(protocol.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
              </button>
              
              <div className="flex items-center gap-3 mb-3 pr-8">
                <span className="text-2xl">{protocol.logo}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-small font-medium text-foreground truncate">{protocol.name}</span>
                    {protocol.audited && <Shield className="w-3 h-3 text-success shrink-0" />}
                  </div>
                  <Badge variant="outline" className="text-tiny mt-1">{protocol.category}</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-tiny mb-2">
                <div>
                  <p className="text-muted-foreground">TVL</p>
                  <p className="font-mono font-medium text-foreground">
                    {protocol.tvl > 0 ? `$${(protocol.tvl / 1000000).toFixed(1)}M` : 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">APY</p>
                  <p className={`font-mono font-medium ${protocol.apy > 0 ? 'text-success' : 'text-muted-foreground'}`}>
                    {protocol.apy > 0 ? `${protocol.apy.toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-1 text-tiny text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>{protocol.users}</span>
                </div>
                <span className="text-tiny text-primary flex items-center gap-1">
                  View <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredProtocols.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {showFavoritesOnly ? "No protocols in your watchlist yet." : "No protocols found matching your criteria."}
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