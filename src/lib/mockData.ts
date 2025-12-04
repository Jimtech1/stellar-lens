// Mock data for the Yielder dashboard

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  balance: number;
  value: number;
  price: number;
  change24h: number;
  chain: 'Stellar' | 'Ethereum' | 'Polygon' | 'Arbitrum';
  apy?: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'swap' | 'bridge';
  asset: string;
  amount: number;
  value: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
}

export interface YieldOpportunity {
  id: string;
  protocol: string;
  protocolLogo: string;
  asset: string;
  apy: number;
  tvl: number;
  chain: string;
  riskScore: number;
  category: 'lending' | 'liquidity' | 'staking';
}

export const mockAssets: Asset[] = [
  { id: '1', name: 'Stellar Lumens', symbol: 'XLM', logo: '⭐', balance: 15420.50, value: 1850.46, price: 0.12, change24h: 3.24, chain: 'Stellar', apy: 4.2 },
  { id: '2', name: 'USD Coin', symbol: 'USDC', logo: '💵', balance: 5000.00, value: 5000.00, price: 1.00, change24h: 0.01, chain: 'Stellar', apy: 5.8 },
  { id: '3', name: 'Ethereum', symbol: 'ETH', logo: '⟠', balance: 2.45, value: 5635.00, price: 2300.00, change24h: -1.23, chain: 'Ethereum', apy: 3.5 },
  { id: '4', name: 'Wrapped Bitcoin', symbol: 'WBTC', logo: '₿', balance: 0.15, value: 6450.00, price: 43000.00, change24h: 2.15, chain: 'Ethereum' },
  { id: '5', name: 'Polygon', symbol: 'MATIC', logo: '🔮', balance: 2500.00, value: 2125.00, price: 0.85, change24h: 4.50, chain: 'Polygon', apy: 8.2 },
  { id: '6', name: 'Arbitrum', symbol: 'ARB', logo: '🔷', balance: 1200.00, value: 1440.00, price: 1.20, change24h: -0.85, chain: 'Arbitrum', apy: 6.1 },
];

export const mockTransactions: Transaction[] = [
  { id: '1', type: 'deposit', asset: 'XLM', amount: 5000, value: 600, timestamp: new Date('2024-01-15T10:30:00'), status: 'completed' },
  { id: '2', type: 'swap', asset: 'USDC', amount: 1000, value: 1000, timestamp: new Date('2024-01-14T14:20:00'), status: 'completed' },
  { id: '3', type: 'bridge', asset: 'ETH', amount: 0.5, value: 1150, timestamp: new Date('2024-01-14T09:15:00'), status: 'completed' },
  { id: '4', type: 'withdrawal', asset: 'MATIC', amount: 500, value: 425, timestamp: new Date('2024-01-13T16:45:00'), status: 'pending' },
  { id: '5', type: 'deposit', asset: 'WBTC', amount: 0.05, value: 2150, timestamp: new Date('2024-01-12T11:00:00'), status: 'completed' },
];

export const mockYieldOpportunities: YieldOpportunity[] = [
  { id: '1', protocol: 'StellarSwap', protocolLogo: '🌟', asset: 'XLM-USDC LP', apy: 12.5, tvl: 5200000, chain: 'Stellar', riskScore: 35, category: 'liquidity' },
  { id: '2', protocol: 'Aave', protocolLogo: '👻', asset: 'USDC', apy: 5.8, tvl: 890000000, chain: 'Ethereum', riskScore: 15, category: 'lending' },
  { id: '3', protocol: 'Lido', protocolLogo: '🔥', asset: 'stETH', apy: 3.8, tvl: 12500000000, chain: 'Ethereum', riskScore: 20, category: 'staking' },
  { id: '4', protocol: 'Compound', protocolLogo: '🏛️', asset: 'ETH', apy: 2.1, tvl: 1200000000, chain: 'Ethereum', riskScore: 10, category: 'lending' },
  { id: '5', protocol: 'Quickswap', protocolLogo: '⚡', asset: 'MATIC-USDC', apy: 18.2, tvl: 45000000, chain: 'Polygon', riskScore: 45, category: 'liquidity' },
  { id: '6', protocol: 'GMX', protocolLogo: '💎', asset: 'GLP', apy: 22.5, tvl: 350000000, chain: 'Arbitrum', riskScore: 55, category: 'liquidity' },
];

export const portfolioHistory = [
  { date: 'Jan 1', value: 18500 },
  { date: 'Jan 5', value: 19200 },
  { date: 'Jan 10', value: 18800 },
  { date: 'Jan 15', value: 20100 },
  { date: 'Jan 20', value: 21500 },
  { date: 'Jan 25', value: 20800 },
  { date: 'Jan 30', value: 22500 },
];

export const portfolioStats = {
  totalValue: 22500.46,
  change24h: 3.45,
  changeValue: 750.20,
  totalYield: 847.32,
  avgApy: 5.8,
  riskScore: 42,
  assetCount: 6,
};
