import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Coins, Search, Filter, TrendingUp, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PositionDetailModal } from "@/components/dashboard/modals/PositionDetailModal";

const allPositions = [
  { id: '1', contract: 'Blend Protocol', position: 'Lending', value: 12450.00, apy: 8.5, token: 'XLM-USDC', risk: 'Low', chain: 'Stellar' },
  { id: '2', contract: 'Aquarius AMM', position: 'LP Provider', value: 8200.00, apy: 12.3, token: 'XLM-AQUA', risk: 'Medium', chain: 'Stellar' },
  { id: '3', contract: 'StellarSwap', position: 'Staking', value: 5600.00, apy: 6.8, token: 'SWAP', risk: 'Low', chain: 'Stellar' },
  { id: '4', contract: 'Lumenswap Pool', position: 'LP Token Holder', value: 3890.00, apy: 15.2, token: 'LSP', risk: 'Medium', chain: 'Stellar' },
  { id: '5', contract: 'Ultra Capital', position: 'Lending', value: 7650.00, apy: 5.4, token: 'yUSDC', risk: 'Low', chain: 'Stellar' },
  { id: '6', contract: 'Phoenix DeFi', position: 'Yield Farming', value: 4500.00, apy: 22.3, token: 'PHO', risk: 'High', chain: 'Stellar' },
  { id: '7', contract: 'Soroswap', position: 'Liquidity', value: 6780.00, apy: 11.8, token: 'SORO', risk: 'Medium', chain: 'Stellar' },
  { id: '8', contract: 'Mercury Indexer', position: 'Data Provider', value: 2100.00, apy: 4.2, token: 'MERC', risk: 'Low', chain: 'Stellar' },
  { id: '9', contract: 'Stellar X', position: 'Market Making', value: 15200.00, apy: 9.5, token: 'XLM-BTC', risk: 'High', chain: 'Stellar' },
  { id: '10', contract: 'AMM Prime', position: 'LP Provider', value: 9800.00, apy: 18.7, token: 'ETH-XLM', risk: 'Medium', chain: 'Stellar' },
  { id: '11', contract: 'YieldVault', position: 'Staking', value: 4200.00, apy: 7.2, token: 'yXLM', risk: 'Low', chain: 'Stellar' },
  { id: '12', contract: 'LiquidStake', position: 'Liquid Staking', value: 11500.00, apy: 6.1, token: 'stXLM', risk: 'Low', chain: 'Stellar' },
  { id: '13', contract: 'DeFi Hub', position: 'Yield Aggregator', value: 8900.00, apy: 14.8, token: 'DHB', risk: 'Medium', chain: 'Stellar' },
  { id: '14', contract: 'Nexus Protocol', position: 'Lending', value: 6700.00, apy: 10.2, token: 'NEX', risk: 'Medium', chain: 'Stellar' },
  { id: '15', contract: 'Orbit Finance', position: 'Yield Farming', value: 3500.00, apy: 28.5, token: 'ORB', risk: 'High', chain: 'Stellar' },
  { id: '16', contract: 'Nova Swap', position: 'LP Provider', value: 5200.00, apy: 16.3, token: 'NOVA', risk: 'Medium', chain: 'Stellar' },
  { id: '17', contract: 'Stellar Vault', position: 'Staking', value: 7800.00, apy: 5.8, token: 'sVLT', risk: 'Low', chain: 'Stellar' },
  { id: '18', contract: 'Anchor Protocol', position: 'Lending', value: 12100.00, apy: 8.9, token: 'ANC', risk: 'Low', chain: 'Stellar' },
  { id: '19', contract: 'Gamma Finance', position: 'Options', value: 4800.00, apy: 35.2, token: 'GAM', risk: 'High', chain: 'Stellar' },
  { id: '20', contract: 'Delta Labs', position: 'Perpetuals', value: 6200.00, apy: 24.1, token: 'DLT', risk: 'High', chain: 'Stellar' },
];

export default function SorobanPositions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('value');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState<typeof allPositions[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredPositions = allPositions
    .filter(pos => {
      const matchesSearch = pos.contract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pos.token.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = filterRisk === 'all' || pos.risk.toLowerCase() === filterRisk;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => {
      if (sortBy === 'value') return b.value - a.value;
      if (sortBy === 'apy') return b.apy - a.apy;
      if (sortBy === 'name') return a.contract.localeCompare(b.contract);
      return 0;
    });

  const totalValue = allPositions.reduce((sum, pos) => sum + pos.value, 0);
  const avgApy = allPositions.reduce((sum, pos) => sum + pos.apy, 0) / allPositions.length;

  return (
    <div className="min-h-screen bg-background">
      <PositionDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        position={selectedPosition ? {
          contract: selectedPosition.contract,
          position: selectedPosition.position,
          value: selectedPosition.value,
          apy: selectedPosition.apy,
          token: selectedPosition.token,
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
                <Coins className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Soroban Smart Contract Positions</h1>
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
            <p className="text-tiny text-muted-foreground">Total Positions</p>
            <p className="text-h2 font-bold text-foreground">{allPositions.length}</p>
          </div>
          <div className="card-elevated p-4">
            <p className="text-tiny text-muted-foreground">Total Value Locked</p>
            <p className="text-h2 font-bold text-foreground">${(totalValue / 1000).toFixed(1)}K</p>
          </div>
          <div className="card-elevated p-4">
            <p className="text-tiny text-muted-foreground">Average APY</p>
            <p className="text-h2 font-bold text-success">{avgApy.toFixed(1)}%</p>
          </div>
          <div className="card-elevated p-4">
            <p className="text-tiny text-muted-foreground">Active Contracts</p>
            <p className="text-h2 font-bold text-foreground">{allPositions.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search positions..."
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
              <SelectItem value="value">Value (High to Low)</SelectItem>
              <SelectItem value="apy">APY (High to Low)</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Positions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPositions.map((position) => (
            <div
              key={position.id}
              className="card-elevated p-4 hover:shadow-card transition-all cursor-pointer"
              onClick={() => {
                setSelectedPosition(position);
                setModalOpen(true);
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-small font-medium text-foreground">{position.contract}</span>
                <Badge variant="outline" className="text-tiny">{position.position}</Badge>
              </div>
              <p className="text-h3 font-bold font-mono text-foreground mb-2">
                ${position.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-tiny text-muted-foreground">{position.token}</span>
                <span className="text-tiny text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {position.apy.toFixed(1)}% APY
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Badge 
                  variant={position.risk === 'Low' ? 'default' : position.risk === 'Medium' ? 'secondary' : 'destructive'}
                  className="text-tiny"
                >
                  {position.risk} Risk
                </Badge>
                <span className="text-tiny text-primary flex items-center gap-1">
                  View <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredPositions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No positions found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
}
