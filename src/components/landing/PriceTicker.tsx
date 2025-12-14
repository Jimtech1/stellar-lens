import { memo, useState, useEffect, useMemo } from 'react';

const initialTickerData = [
  { symbol: 'XLM', price: 0.12, change: 3.24 },
  { symbol: 'ETH', price: 2300.00, change: -1.23 },
  { symbol: 'BTC', price: 43000.00, change: 2.15 },
  { symbol: 'USDC', price: 1.00, change: 0.01 },
  { symbol: 'MATIC', price: 0.85, change: 4.50 },
  { symbol: 'ARB', price: 1.20, change: -0.85 },
  { symbol: 'SOL', price: 98.50, change: 5.32 },
  { symbol: 'AVAX', price: 35.20, change: -2.10 },
  { symbol: 'DOT', price: 7.45, change: 1.89 },
  { symbol: 'LINK', price: 14.80, change: 3.45 },
];

const TickerItem = memo(({ item }: { item: typeof initialTickerData[0] }) => (
  <div className="flex items-center gap-2 px-4">
    <span className="font-semibold text-foreground text-sm">{item.symbol}</span>
    <span className="text-muted-foreground text-sm font-mono">
      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
    <span className={`text-xs font-medium ${item.change >= 0 ? 'text-success' : 'text-destructive'}`}>
      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
    </span>
  </div>
));

TickerItem.displayName = "TickerItem";

const PriceTicker = () => {
  const [tickerData, setTickerData] = useState(initialTickerData);

  // Simulate live price updates with longer interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prev => prev.map(item => {
        const priceChange = (Math.random() - 0.5) * 0.02 * item.price;
        const changeUpdate = (Math.random() - 0.5) * 0.3;
        return {
          ...item,
          price: Math.max(0.001, item.price + priceChange),
          change: item.change + changeUpdate
        };
      }));
    }, 4000); // Increased interval

    return () => clearInterval(interval);
  }, []);

  const duplicatedData = useMemo(() => [...tickerData, ...tickerData, ...tickerData], [tickerData]);

  return (
    <div className="w-full bg-background/80 backdrop-blur-sm border-b border-border/50 overflow-hidden py-2">
      <div
        className="flex gap-8 whitespace-nowrap animate-ticker"
        style={{
          animation: 'ticker 30s linear infinite',
        }}
      >
        {duplicatedData.map((item, index) => (
          <TickerItem key={`${item.symbol}-${index}`} item={item} />
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-ticker {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default PriceTicker;
