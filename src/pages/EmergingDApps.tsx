import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Boxes, Search, Filter, Users, TrendingUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DAppDetailModal } from "@/components/dashboard/modals/DAppDetailModal";
import { FooterSection } from "@/components/landing/FooterSection";

const allDApps = [
  { id: '1', name: 'Blend Protocol', category: 'Lending', users: '12.5K', growth: 45, logo: '🔷', tvl: '$15.2M', description: 'Decentralized lending and borrowing on Stellar' },
  { id: '2', name: 'Aquarius DEX', category: 'DEX', users: '45.2K', growth: 28, logo: '🌊', tvl: '$8.2M', description: 'Automated market maker with liquidity rewards' },
  { id: '3', name: 'Soroswap', category: 'AMM', users: '8.9K', growth: 120, logo: '⚡', tvl: '$2.8M', description: 'Next-gen AMM built on Soroban' },
  { id: '4', name: 'Phoenix DeFi', category: 'Yield', users: '5.6K', growth: 67, logo: '🔥', tvl: '$4.2M', description: 'Yield aggregator and optimizer' },
  { id: '5', name: 'StellarX', category: 'DEX', users: '85K', growth: 18, logo: '🌟', tvl: '$12.5M', description: 'Global exchange with fiat on/off ramps' },
  { id: '6', name: 'Lumenswap', category: 'AMM', users: '32K', growth: 45, logo: '💧', tvl: '$6.8M', description: 'Decentralized exchange and NFT marketplace' },
  { id: '7', name: 'Ultra Capital', category: 'Lending', users: '18K', growth: 35, logo: '💎', tvl: '$9.4M', description: 'Institutional-grade lending protocol' },
  { id: '8', name: 'Mercury', category: 'Analytics', users: '8K', growth: 42, logo: '📊', tvl: 'N/A', description: 'Blockchain indexer and analytics platform' },
  { id: '9', name: 'Freighter', category: 'Wallet', users: '125K', growth: 18, logo: '🚀', tvl: 'N/A', description: 'Browser extension wallet for Stellar' },
  { id: '10', name: 'Stellar Expert', category: 'Explorer', users: '85K', growth: 12, logo: '🔍', tvl: 'N/A', description: 'Comprehensive blockchain explorer' },
  { id: '11', name: 'Lobstr', category: 'Wallet', users: '250K', growth: 22, logo: '📱', tvl: 'N/A', description: 'Mobile-first Stellar wallet' },
  { id: '12', name: 'StellarTerm', category: 'DEX', users: '42K', growth: 15, logo: '💹', tvl: '$3.5M', description: 'Open-source trading client' },
  { id: '13', name: 'Pendulum', category: 'Bridge', users: '6.2K', growth: 85, logo: '🌉', tvl: '$5.8M', description: 'Cross-chain bridge to Polkadot' },
  { id: '14', name: 'Beans App', category: 'Payments', users: '15K', growth: 55, logo: '☕', tvl: 'N/A', description: 'Social payments for communities' },
  { id: '15', name: 'Vibrant', category: 'Savings', users: '28K', growth: 38, logo: '💚', tvl: '$2.1M', description: 'High-yield savings app' },
  { id: '16', name: 'Interstellar', category: 'DEX', users: '18K', growth: 25, logo: '🌌', tvl: '$4.2M', description: 'User-friendly exchange interface' },
  { id: '17', name: 'Kelp', category: 'Trading', users: '3.5K', growth: 72, logo: '🤖', tvl: 'N/A', description: 'Automated market making bot' },
  { id: '18', name: 'Script3', category: 'Development', users: '2.8K', growth: 95, logo: '⚙️', tvl: 'N/A', description: 'Soroban development toolkit' },
  { id: '19', name: 'Comet Protocol', category: 'Lending', users: '4.2K', growth: 62, logo: '☄️', tvl: '$3.2M', description: 'Decentralized money market' },
  { id: '20', name: 'Scopuly', category: 'DEX', users: '12K', growth: 32, logo: '🔭', tvl: '$2.8M', description: 'Decentralized exchange with staking' },
];

export default function EmergingDApps() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('users');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedDApp, setSelectedDApp] = useState<typeof allDApps[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const categories = [...new Set(allDApps.map(d => d.category))];

  const filteredDApps = allDApps
    .filter(dapp => {
      const matchesSearch = dapp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dapp.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || dapp.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'users') return parseFloat(b.users.replace(/[^0-9.]/g, '')) - parseFloat(a.users.replace(/[^0-9.]/g, ''));
      if (sortBy === 'growth') return b.growth - a.growth;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const totalUsers = allDApps.reduce((sum, d) => sum + parseFloat(d.users.replace(/[^0-9.]/g, '')), 0);
  const avgGrowth = allDApps.reduce((sum, d) => sum + d.growth, 0) / allDApps.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DAppDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        dapp={selectedDApp}
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
                <Boxes className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <h1 className="text-base sm:text-xl font-bold text-foreground">Emerging dApps</h1>
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
            <p className="text-tiny text-muted-foreground">Total dApps</p>
            <p className="text-lg sm:text-h2 font-bold text-foreground">{allDApps.length}</p>
          </div>
          <div className="card-elevated p-3 sm:p-4">
            <p className="text-tiny text-muted-foreground">Total Users</p>
            <p className="text-lg sm:text-h2 font-bold text-foreground">{totalUsers.toFixed(0)}K</p>
          </div>
          <div className="card-elevated p-3 sm:p-4">
            <p className="text-tiny text-muted-foreground">Avg. Growth</p>
            <p className="text-lg sm:text-h2 font-bold text-success">+{avgGrowth.toFixed(0)}%</p>
          </div>
          <div className="card-elevated p-3 sm:p-4">
            <p className="text-tiny text-muted-foreground">Categories</p>
            <p className="text-lg sm:text-h2 font-bold text-foreground">{categories.length}</p>
          </div>
        </div>

        {/* Fastest Growing */}
        <div className="card-elevated p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Fastest Growing dApps</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
            {[...allDApps].sort((a, b) => b.growth - a.growth).slice(0, 5).map((dapp) => (
              <div 
                key={dapp.id} 
                className="p-2 sm:p-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                onClick={() => {
                  setSelectedDApp(dapp);
                  setModalOpen(true);
                }}
              >
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <span className="text-xl sm:text-2xl">{dapp.logo}</span>
                  <span className="font-medium text-foreground text-sm truncate">{dapp.name}</span>
                </div>
                <p className="text-success font-mono text-sm sm:text-base">+{dapp.growth}%</p>
                <p className="text-tiny text-muted-foreground">{dapp.category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search dApps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">Users (High to Low)</SelectItem>
                <SelectItem value="growth">Growth (High to Low)</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full">
                <Filter className="w-4 h-4 mr-2 shrink-0" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* dApps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredDApps.map((dapp) => (
            <div
              key={dapp.id}
              className="card-elevated p-3 sm:p-4 hover:shadow-card transition-all cursor-pointer"
              onClick={() => {
                setSelectedDApp(dapp);
                setModalOpen(true);
              }}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <span className="text-2xl sm:text-3xl">{dapp.logo}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm sm:text-base truncate">{dapp.name}</p>
                  <Badge variant="outline" className="text-tiny">{dapp.category}</Badge>
                </div>
              </div>
              <p className="text-tiny text-muted-foreground mb-2 sm:mb-3 line-clamp-2">{dapp.description}</p>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-small text-foreground">{dapp.users}</span>
                </div>
                <span className="text-small text-success font-mono">+{dapp.growth}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-tiny text-muted-foreground">TVL: {dapp.tvl}</span>
                <span className="text-tiny text-primary flex items-center gap-1">
                  View <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredDApps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No dApps found matching your criteria.</p>
          </div>
        )}
      </main>

      <FooterSection />
    </div>
  );
}
