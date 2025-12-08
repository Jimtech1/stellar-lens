import { motion } from "framer-motion";
import { TrendingUp, Droplets, Boxes, ArrowUpRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Mock Soroban smart contract positions
const sorobanPositions = [
  { id: '1', contract: 'Blend Protocol', position: 'Lending', value: 12450.00, apy: 8.5, token: 'XLM-USDC' },
  { id: '2', contract: 'Aquarius AMM', position: 'LP Provider', value: 8200.00, apy: 12.3, token: 'XLM-AQUA' },
  { id: '3', contract: 'StellarSwap', position: 'Staking', value: 5600.00, apy: 6.8, token: 'SWAP' },
];

// Mock trending assets
const trendingAssets = [
  { symbol: 'XLM', name: 'Stellar Lumens', price: 0.12, change: 5.24, volume: '2.4B' },
  { symbol: 'AQUA', name: 'Aquarius', price: 0.0045, change: 12.8, volume: '145M' },
  { symbol: 'yXLM', name: 'Ultra Stellar', price: 0.13, change: 3.2, volume: '89M' },
  { symbol: 'SHX', name: 'Stronghold', price: 0.0021, change: -2.1, volume: '45M' },
];

// Mock liquidity pools
const newLiquidityPools = [
  { pair: 'XLM/USDC', protocol: 'Aquarius', tvl: 45000000, apy: 14.5, age: '2d' },
  { pair: 'AQUA/XLM', protocol: 'StellarSwap', tvl: 12000000, apy: 22.3, age: '5d' },
  { pair: 'yXLM/USDC', protocol: 'Blend', tvl: 8500000, apy: 18.7, age: '1w' },
];

// Mock emerging dApps
const emergingDApps = [
  { name: 'Blend Protocol', category: 'Lending', users: '12.5K', growth: 45, logo: '🔷' },
  { name: 'Aquarius DEX', category: 'DEX', users: '45.2K', growth: 28, logo: '🌊' },
  { name: 'Soroswap', category: 'AMM', users: '8.9K', growth: 120, logo: '⚡' },
  { name: 'Phoenix DeFi', category: 'Yield', users: '5.6K', growth: 67, logo: '🔥' },
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

        {/* Soroban Positions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Boxes className="w-5 h-5 text-primary" />
            <h3 className="text-h3 font-semibold text-foreground">Soroban Smart Contract Positions</h3>
            <Badge variant="secondary" className="text-tiny">Live</Badge>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
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
            <div className="card-elevated divide-y divide-border">
              {trendingAssets.map((asset, i) => (
                <div key={asset.symbol} className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-tiny text-muted-foreground w-4">{i + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {asset.symbol.charAt(0)}
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
            <div className="card-elevated divide-y divide-border">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergingDApps.map((dapp) => (
              <div key={dapp.name} className="card-elevated p-4 hover:shadow-card transition-all group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{dapp.logo}</span>
                  <div>
                    <p className="text-small font-medium text-foreground group-hover:text-primary transition-colors">
                      {dapp.name}
                    </p>
                    <Badge variant="outline" className="text-tiny">{dapp.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-tiny text-muted-foreground">{dapp.users} users</span>
                  <span className="text-tiny text-success">+{dapp.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}