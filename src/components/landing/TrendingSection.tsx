import { motion } from "framer-motion";
import { TrendingUp, Droplets, Boxes, ArrowUpRight, Search, Activity, Zap, Shield, Globe, Layers, Users, Coins, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Extended Soroban smart contract positions
const sorobanPositions = [
  { id: '1', contract: 'Blend Protocol', position: 'Lending', value: 12450.00, apy: 8.5, token: 'XLM-USDC' },
  { id: '2', contract: 'Aquarius AMM', position: 'LP Provider', value: 8200.00, apy: 12.3, token: 'XLM-AQUA' },
  { id: '3', contract: 'StellarSwap', position: 'Staking', value: 5600.00, apy: 6.8, token: 'SWAP' },
  { id: '4', contract: 'Lumenswap Pool', position: 'LP Token Holder', value: 3890.00, apy: 15.2, token: 'LSP' },
  { id: '5', contract: 'Ultra Capital', position: 'Lending', value: 7650.00, apy: 5.4, token: 'yUSDC' },
  { id: '6', contract: 'Phoenix DeFi', position: 'Yield Farming', value: 4500.00, apy: 22.3, token: 'PHO' },
  { id: '7', contract: 'Soroswap', position: 'Liquidity', value: 6780.00, apy: 11.8, token: 'SORO' },
  { id: '8', contract: 'Mercury Indexer', position: 'Data Provider', value: 2100.00, apy: 4.2, token: 'MERC' },
];

// Extended trending assets
const trendingAssets = [
  { symbol: 'XLM', name: 'Stellar Lumens', price: 0.124, change: 5.24, volume: '2.4B', marketCap: '$3.8B' },
  { symbol: 'AQUA', name: 'Aquarius', price: 0.0045, change: 12.8, volume: '145M', marketCap: '$52M' },
  { symbol: 'yXLM', name: 'Ultra Stellar', price: 0.126, change: 4.1, volume: '89M', marketCap: '$18M' },
  { symbol: 'SHX', name: 'Stronghold', price: 0.0021, change: -2.1, volume: '45M', marketCap: '$8.5M' },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00, change: 0.01, volume: '89M', marketCap: '$28B' },
  { symbol: 'BLND', name: 'Blend Token', price: 0.082, change: 8.7, volume: '4.2M', marketCap: '$24M' },
  { symbol: 'PHO', name: 'Phoenix', price: 0.0034, change: 15.4, volume: '980K', marketCap: '$6.2M' },
  { symbol: 'RMT', name: 'SureRemit', price: 0.0018, change: -1.8, volume: '320K', marketCap: '$4.1M' },
  { symbol: 'GRAT', name: 'Gratitude', price: 0.00012, change: 28.5, volume: '180K', marketCap: '$1.2M' },
  { symbol: 'ARST', name: 'ARS Token', price: 0.0089, change: 3.2, volume: '520K', marketCap: '$3.8M' },
];

// Extended liquidity pools
const newLiquidityPools = [
  { pair: 'XLM/USDC', protocol: 'Aquarius', tvl: 45000000, apy: 14.5, age: '2d', volume24h: '$890K' },
  { pair: 'AQUA/XLM', protocol: 'StellarSwap', tvl: 12000000, apy: 22.3, age: '5d', volume24h: '$420K' },
  { pair: 'yXLM/USDC', protocol: 'Blend', tvl: 8500000, apy: 18.7, age: '1w', volume24h: '$650K' },
  { pair: 'ETH/XLM', protocol: 'Lumenswap', tvl: 6200000, apy: 12.1, age: '3d', volume24h: '$180K' },
  { pair: 'BLND/XLM', protocol: 'Blend', tvl: 4800000, apy: 24.5, age: '4d', volume24h: '$520K' },
  { pair: 'PHO/USDC', protocol: 'Phoenix', tvl: 2100000, apy: 32.2, age: '1d', volume24h: '$95K' },
  { pair: 'BTC/XLM', protocol: 'StellarX', tvl: 15600000, apy: 5.2, age: '2w', volume24h: '$1.2M' },
  { pair: 'EURC/USDC', protocol: 'Circle', tvl: 28900000, apy: 4.1, age: '1w', volume24h: '$2.1M' },
];

// Extended emerging dApps
const emergingDApps = [
  { name: 'Blend Protocol', category: 'Lending', users: '12.5K', growth: 45, logo: '🔷', tvl: '$15.2M' },
  { name: 'Aquarius DEX', category: 'DEX', users: '45.2K', growth: 28, logo: '🌊', tvl: '$8.2M' },
  { name: 'Soroswap', category: 'AMM', users: '8.9K', growth: 120, logo: '⚡', tvl: '$2.8M' },
  { name: 'Phoenix DeFi', category: 'Yield', users: '5.6K', growth: 67, logo: '🔥', tvl: '$4.2M' },
  { name: 'StellarX', category: 'DEX', users: '85K', growth: 18, logo: '🌟', tvl: '$12.5M' },
  { name: 'Lumenswap', category: 'AMM', users: '32K', growth: 45, logo: '💧', tvl: '$6.8M' },
  { name: 'Ultra Capital', category: 'Lending', users: '18K', growth: 35, logo: '💎', tvl: '$9.4M' },
  { name: 'Mercury', category: 'Analytics', users: '8K', growth: 42, logo: '📊', tvl: 'N/A' },
  { name: 'Freighter', category: 'Wallet', users: '125K', growth: 18, logo: '🚀', tvl: 'N/A' },
  { name: 'Stellar Expert', category: 'Explorer', users: '85K', growth: 12, logo: '🔍', tvl: 'N/A' },
];

// Live network aggregates
const networkAggregates = [
  { metric: 'Total XLM Volume', value: '$2.4B', change: '+8.2%', period: '24h' },
  { metric: 'Active Contracts', value: '1,847', change: '+124', period: 'today' },
  { metric: 'Unique Wallets', value: '892K', change: '+2.1K', period: '24h' },
  { metric: 'Total Transactions', value: '4.2M', change: '+180K', period: '24h' },
  { metric: 'Gas Fees', value: '$48.5K', change: '+12%', period: '24h' },
  { metric: 'Contract Calls', value: '2.8M', change: '+95K', period: '24h' },
];

// Protocol stats
const protocolStats = [
  { name: 'Stellar TPS', value: '4,000+', icon: Zap },
  { name: 'Soroban Contracts', value: '2,500+', icon: Layers },
  { name: 'Active Anchors', value: '180+', icon: Shield },
  { name: 'Global Nodes', value: '40+', icon: Globe },
];

export function TrendingSection() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header with Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-8"
        >
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
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search assets, wallets, protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-background border-border"
            />
          </div>
        </motion.div>

        {/* Protocol Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {protocolStats.map((stat, index) => (
            <div key={index} className="card-elevated p-4 text-center">
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-h2 font-bold text-foreground">{stat.value}</p>
              <p className="text-tiny text-muted-foreground">{stat.name}</p>
            </div>
          ))}
        </motion.div>

        {/* Live Network Aggregates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary animate-pulse" />
            <h3 className="text-h3 font-semibold text-foreground">Live Network Aggregates</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {networkAggregates.map((item, index) => (
              <div key={index} className="card-elevated p-3">
                <p className="text-tiny text-muted-foreground mb-1">{item.metric}</p>
                <p className="text-body font-bold font-mono text-foreground">{item.value}</p>
                <p className="text-tiny text-success">{item.change} ({item.period})</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Soroban Positions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-primary" />
            <h3 className="text-h3 font-semibold text-foreground">Soroban Smart Contract Positions</h3>
            <Badge variant="secondary" className="text-tiny">Live</Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sorobanPositions.map((position) => (
              <div key={position.id} className="card-elevated p-4 hover:shadow-card transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-small font-medium text-foreground">{position.contract}</span>
                  <Badge variant="outline" className="text-tiny">{position.position}</Badge>
                </div>
                <p className="text-h3 font-bold font-mono text-foreground mb-1">
                  ${position.value.toLocaleString()}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-tiny text-muted-foreground">{position.token}</span>
                  <span className="text-tiny text-success">{position.apy}% APY</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Trending Assets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-success" />
              <h3 className="text-h3 font-semibold text-foreground">Trending Assets</h3>
            </div>
            <div className="card-elevated divide-y divide-border max-h-[400px] overflow-y-auto">
              {trendingAssets.map((asset, i) => (
                <div key={asset.symbol} className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-tiny text-muted-foreground w-4">{i + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-small font-medium text-foreground">{asset.symbol}</p>
                      <p className="text-tiny text-muted-foreground">{asset.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-small font-mono text-foreground">${asset.price}</p>
                    <p className={`text-tiny ${asset.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {asset.change >= 0 ? '+' : ''}{asset.change}%
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-tiny text-muted-foreground">Vol: {asset.volume}</p>
                    <p className="text-tiny text-muted-foreground">MCap: {asset.marketCap}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* New Liquidity Pools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5 text-primary" />
              <h3 className="text-h3 font-semibold text-foreground">New Liquidity Pools</h3>
            </div>
            <div className="card-elevated divide-y divide-border max-h-[400px] overflow-y-auto">
              {newLiquidityPools.map((pool) => (
                <div key={pool.pair} className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-small font-medium text-foreground">{pool.pair}</p>
                      <Badge variant="secondary" className="text-tiny">{pool.age}</Badge>
                    </div>
                    <p className="text-tiny text-muted-foreground">{pool.protocol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-small font-mono text-success">{pool.apy}% APY</p>
                    <p className="text-tiny text-muted-foreground">
                      ${(pool.tvl / 1000000).toFixed(1)}M TVL
                    </p>
                  </div>
                  <div className="text-right hidden md:block">
                    <p className="text-tiny text-muted-foreground">24h Vol</p>
                    <p className="text-tiny font-mono">{pool.volume24h}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Emerging dApps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpRight className="w-5 h-5 text-warning" />
            <h3 className="text-h3 font-semibold text-foreground">Emerging dApps</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {emergingDApps.map((dapp) => (
              <div key={dapp.name} className="card-elevated p-4 hover:shadow-card transition-all group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{dapp.logo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-small font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {dapp.name}
                    </p>
                    <Badge variant="outline" className="text-tiny">{dapp.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-tiny text-muted-foreground">
                    <Users className="w-3 h-3" />
                    {dapp.users}
                  </div>
                  <span className="text-tiny text-success">+{dapp.growth}%</span>
                </div>
                {dapp.tvl !== 'N/A' && (
                  <p className="text-tiny font-mono text-muted-foreground mt-2">{dapp.tvl} TVL</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}