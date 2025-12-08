import { motion } from 'framer-motion';

const tickerData = [
  { symbol: 'XLM', price: 0.12, change: 3.24, positive: true },
  { symbol: 'ETH', price: 2300.00, change: -1.23, positive: false },
  { symbol: 'BTC', price: 43000.00, change: 2.15, positive: true },
  { symbol: 'USDC', price: 1.00, change: 0.01, positive: true },
  { symbol: 'MATIC', price: 0.85, change: 4.50, positive: true },
  { symbol: 'ARB', price: 1.20, change: -0.85, positive: false },
  { symbol: 'SOL', price: 98.50, change: 5.32, positive: true },
  { symbol: 'AVAX', price: 35.20, change: -2.10, positive: false },
  { symbol: 'DOT', price: 7.45, change: 1.89, positive: true },
  { symbol: 'LINK', price: 14.80, change: 3.45, positive: true },
];

const PriceTicker = () => {
  const duplicatedData = [...tickerData, ...tickerData, ...tickerData];

  return (
    <div className="w-full bg-background/80 backdrop-blur-sm border-b border-border/50 overflow-hidden py-2">
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{
          x: ['0%', '-33.33%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {duplicatedData.map((item, index) => (
          <div key={index} className="flex items-center gap-2 px-4">
            <span className="font-semibold text-foreground text-sm">{item.symbol}</span>
            <span className="text-muted-foreground text-sm">
              ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-xs font-medium ${item.positive ? 'text-green-500' : 'text-red-500'}`}>
              {item.positive ? '+' : ''}{item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default PriceTicker;
