import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Search, Star, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssetDetailModal } from "@/components/dashboard/modals/AssetDetailModal";
import { Asset } from "@/lib/mockData";
import { FooterSection } from "@/components/landing/FooterSection";

const allAssets = [
  { symbol: 'XLM', name: 'Stellar Lumens', price: 0.124, change: 5.24, volume: '2.4B', marketCap: '$3.8B', rank: 1 },
  { symbol: 'AQUA', name: 'Aquarius', price: 0.0045, change: 12.8, volume: '145M', marketCap: '$52M', rank: 2 },
  { symbol: 'yXLM', name: 'Ultra Stellar', price: 0.126, change: 4.1, volume: '89M', marketCap: '$18M', rank: 3 },
  { symbol: 'SHX', name: 'Stronghold', price: 0.0021, change: -2.1, volume: '45M', marketCap: '$8.5M', rank: 4 },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00, change: 0.01, volume: '89M', marketCap: '$28B', rank: 5 },
  { symbol: 'BLND', name: 'Blend Token', price: 0.082, change: 8.7, volume: '4.2M', marketCap: '$24M', rank: 6 },
  { symbol: 'PHO', name: 'Phoenix', price: 0.0034, change: 15.4, volume: '980K', marketCap: '$6.2M', rank: 7 },
  { symbol: 'RMT', name: 'SureRemit', price: 0.0018, change: -1.8, volume: '320K', marketCap: '$4.1M', rank: 8 },
  { symbol: 'GRAT', name: 'Gratitude', price: 0.00012, change: 28.5, volume: '180K', marketCap: '$1.2M', rank: 9 },
  { symbol: 'ARST', name: 'ARS Token', price: 0.0089, change: 3.2, volume: '520K', marketCap: '$3.8M', rank: 10 },
  { symbol: 'SSLX', name: 'Stellar SLX', price: 0.0156, change: 7.8, volume: '1.2M', marketCap: '$12M', rank: 11 },
  { symbol: 'FIDR', name: 'Fidor Token', price: 0.045, change: -0.5, volume: '890K', marketCap: '$8.9M', rank: 12 },
  { symbol: 'NGNT', name: 'Naira Token', price: 0.00065, change: 1.2, volume: '2.1M', marketCap: '$5.4M', rank: 13 },
  { symbol: 'EURT', name: 'Euro Token', price: 1.08, change: 0.3, volume: '15M', marketCap: '$45M', rank: 14 },
  { symbol: 'BTC', name: 'Bitcoin (Wrapped)', price: 42500, change: 2.8, volume: '890M', marketCap: '$850B', rank: 15 },
  { symbol: 'ETH', name: 'Ethereum (Wrapped)', price: 2250, change: 3.5, volume: '450M', marketCap: '$270B', rank: 16 },
  { symbol: 'CLPX', name: 'Chilean Peso', price: 0.0011, change: -0.8, volume: '120K', marketCap: '$2.1M', rank: 17 },
  { symbol: 'BRLT', name: 'BRL Token', price: 0.19, change: 0.4, volume: '340K', marketCap: '$4.5M', rank: 18 },
  { symbol: 'GBPT', name: 'GBP Token', price: 1.27, change: 0.2, volume: '8.9M', marketCap: '$32M', rank: 19 },
  { symbol: 'JPYT', name: 'JPY Token', price: 0.0067, change: -0.1, volume: '12M', marketCap: '$28M', rank: 20 },
  { symbol: 'KRWT', name: 'KRW Token', price: 0.00075, change: 0.5, volume: '5.6M', marketCap: '$15M', rank: 21 },
  { symbol: 'CNYT', name: 'CNY Token', price: 0.14, change: 0.1, volume: '18M', marketCap: '$42M', rank: 22 },
  { symbol: 'TRYB', name: 'BiLira', price: 0.031, change: -1.2, volume: '2.8M', marketCap: '$8.2M', rank: 23 },
  { symbol: 'TERN', name: 'Ternio', price: 0.0028, change: 6.5, volume: '450K', marketCap: '$3.2M', rank: 24 },
  { symbol: 'MOBI', name: 'Mobius', price: 0.0015, change: -3.2, volume: '280K', marketCap: '$2.8M', rank: 25 },
];

export default function TrendingAssets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredAssets = allAssets
    .filter(asset => 
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'rank') return a.rank - b.rank;
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'change') return b.change - a.change;
      if (sortBy === 'volume') return parseFloat(b.volume.replace(/[^0-9.]/g, '')) - parseFloat(a.volume.replace(/[^0-9.]/g, ''));
      return 0;
    });

  const handleAssetClick = (asset: typeof allAssets[0]) => {
    const assetData: Asset = {
      id: asset.symbol,
      name: asset.name,
      symbol: asset.symbol,
      logo: "⭐",
      balance: 0,
      value: 0,
      price: asset.price,
      change24h: asset.change,
      chain: "Stellar",
    };
    setSelectedAsset(assetData);
    setModalOpen(true);
  };

  const gainers = allAssets.filter(a => a.change > 0).sort((a, b) => b.change - a.change).slice(0, 5);
  const losers = allAssets.filter(a => a.change < 0).sort((a, b) => a.change - b.change).slice(0, 5);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AssetDetailModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        asset={selectedAsset}
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
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                <h1 className="text-base sm:text-xl font-bold text-foreground">Trending Assets</h1>
              </div>
            </div>
            <Link to="/dashboard">
              <Button size="sm" className="w-full sm:w-auto">Launch Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-8 flex-1">
        {/* Top Movers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="card-elevated p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Top Gainers (24h)</h3>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {gainers.map((asset, i) => (
                <div key={asset.symbol} className="flex items-center justify-between p-2 hover:bg-secondary/50 rounded-lg cursor-pointer" onClick={() => handleAssetClick(asset)}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-tiny text-muted-foreground w-4">{i + 1}</span>
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="font-medium text-sm">{asset.symbol}</span>
                  </div>
                  <span className="text-success font-mono text-sm">+{asset.change.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card-elevated p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
              <h3 className="font-semibold text-foreground text-sm sm:text-base">Top Losers (24h)</h3>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {losers.map((asset, i) => (
                <div key={asset.symbol} className="flex items-center justify-between p-2 hover:bg-secondary/50 rounded-lg cursor-pointer" onClick={() => handleAssetClick(asset)}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-tiny text-muted-foreground w-4">{i + 1}</span>
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                    <span className="font-medium text-sm">{asset.symbol}</span>
                  </div>
                  <span className="text-destructive font-mono text-sm">{asset.change.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">Rank</SelectItem>
              <SelectItem value="price">Price (High to Low)</SelectItem>
              <SelectItem value="change">Change (24h)</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assets - Mobile Cards */}
        <div className="block md:hidden space-y-3">
          {filteredAssets.map((asset) => (
            <div 
              key={asset.symbol} 
              className="card-elevated p-3 cursor-pointer hover:shadow-card transition-all"
              onClick={() => handleAssetClick(asset)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-tiny text-muted-foreground w-4">#{asset.rank}</span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{asset.symbol}</p>
                    <p className="text-tiny text-muted-foreground">{asset.name}</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono font-medium text-foreground">
                    ${asset.price < 1 ? asset.price.toFixed(4) : asset.price.toLocaleString()}
                  </p>
                  <p className="text-tiny text-muted-foreground">Vol: {asset.volume}</p>
                </div>
                <span className={`font-mono text-sm ${asset.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Assets Table - Desktop */}
        <div className="hidden md:block card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 text-tiny font-medium text-muted-foreground">#</th>
                  <th className="text-left p-4 text-tiny font-medium text-muted-foreground">Asset</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground">Price</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground">24h Change</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground">Volume</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground hidden lg:table-cell">Market Cap</th>
                  <th className="text-right p-4 text-tiny font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAssets.map((asset) => (
                  <tr 
                    key={asset.symbol} 
                    className="hover:bg-secondary/30 cursor-pointer transition-colors"
                    onClick={() => handleAssetClick(asset)}
                  >
                    <td className="p-4 text-tiny text-muted-foreground">{asset.rank}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Star className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{asset.symbol}</p>
                          <p className="text-tiny text-muted-foreground">{asset.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono text-foreground">
                      ${asset.price < 1 ? asset.price.toFixed(4) : asset.price.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`font-mono ${asset.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                      </span>
                    </td>
                    <td className="p-4 text-right text-muted-foreground">{asset.volume}</td>
                    <td className="p-4 text-right text-muted-foreground hidden lg:table-cell">{asset.marketCap}</td>
                    <td className="p-4 text-right">
                      <ArrowUpRight className="w-4 h-4 text-primary inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No assets found matching your criteria.</p>
          </div>
        )}
      </main>

      <FooterSection />
    </div>
  );
}
