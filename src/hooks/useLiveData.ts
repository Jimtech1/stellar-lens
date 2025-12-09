import { useState, useEffect, useCallback } from "react";

// Hook for simulating live price updates
export function useLivePrice(initialPrice: number, volatility: number = 0.002) {
  const [price, setPrice] = useState(initialPrice);
  const [change, setChange] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prev) => {
        const changePercent = (Math.random() - 0.5) * 2 * volatility;
        const newPrice = prev * (1 + changePercent);
        setChange(changePercent * 100);
        return newPrice;
      });
    }, 2000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [volatility]);

  return { price, change };
}

// Hook for simulating live counter animation
export function useAnimatedCounter(
  targetValue: number,
  duration: number = 1500,
  formatFn?: (value: number) => string
) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const diff = targetValue - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + diff * easeOutQuart;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return formatFn ? formatFn(displayValue) : displayValue;
}

// Hook for simulating live portfolio updates
export function useLivePortfolio(initialStats: {
  totalValue: number;
  change24h: number;
  totalYield: number;
  avgApy: number;
}) {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const valueChange = (Math.random() - 0.48) * 50;
        const yieldChange = Math.random() * 0.5;
        return {
          ...prev,
          totalValue: prev.totalValue + valueChange,
          change24h: prev.change24h + (Math.random() - 0.5) * 0.1,
          totalYield: prev.totalYield + yieldChange,
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return stats;
}

// Hook for simulating live asset prices
export function useLiveAssets<T extends { id: string; price: number; change24h: number; value: number; balance: number }>(
  initialAssets: T[]
) {
  const [assets, setAssets] = useState(initialAssets);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((asset) => {
          const changePercent = (Math.random() - 0.5) * 0.01;
          const newPrice = asset.price * (1 + changePercent);
          return {
            ...asset,
            price: newPrice,
            value: asset.balance * newPrice,
            change24h: asset.change24h + (Math.random() - 0.5) * 0.2,
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return assets;
}
