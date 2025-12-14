import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

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

const PriceTicker = () => {
  const [tickerData, setTickerData] = useState(initialTickerData);

  // Simulate live price updates
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
    }, 2000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

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
          <motion.div 
            key={index} 
            className="flex items-center gap-2 px-4"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
          >
            <span className="font-semibold text-foreground text-sm">{item.symbol}</span>
            <motion.span 
              className="text-muted-foreground text-sm font-mono"
              key={item.price.toFixed(2)}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.span>
            <motion.span 
              className={`text-xs font-medium ${item.change >= 0 ? 'text-success' : 'text-destructive'}`}
              key={item.change.toFixed(2)}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </motion.span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PriceTicker;
