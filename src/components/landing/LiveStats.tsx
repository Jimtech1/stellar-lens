import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { TrendingUp, Users, Zap, Shield } from 'lucide-react';

const initialStats = [
  { label: 'Total Value Locked', value: 2400000000, prefix: '$', suffix: '+', icon: TrendingUp },
  { label: 'Active Users', value: 150000, prefix: '', suffix: '+', icon: Users },
  { label: 'Transactions', value: 5800000, prefix: '', suffix: '+', icon: Zap },
  { label: 'Uptime', value: 99.9, prefix: '', suffix: '%', icon: Shield, decimals: 1, static: true },
];

const AnimatedCounter = ({ 
  value, 
  prefix, 
  suffix, 
  decimals = 0, 
  isStatic = false,
  liveValue 
}: { 
  value: number; 
  prefix: string; 
  suffix: string; 
  decimals?: number;
  isStatic?: boolean;
  liveValue?: number;
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  // Initial animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * value);
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  // Smooth live updates
  useEffect(() => {
    if (hasAnimated && liveValue !== undefined && !isStatic) {
      const startValue = displayValue || count;
      const diff = liveValue - startValue;
      const duration = 500;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(startValue + diff * eased);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [liveValue, hasAnimated, isStatic]);

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(decimals);
  };

  const currentValue = hasAnimated && liveValue !== undefined && !isStatic ? displayValue : count;

  return (
    <motion.span 
      ref={ref} 
      className="font-bold text-2xl md:text-3xl text-foreground font-mono"
      key={Math.floor(currentValue / 1000)}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{formatNumber(currentValue)}{suffix}
    </motion.span>
  );
};

const LiveStats = () => {
  const [liveStats, setLiveStats] = useState(initialStats);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => prev.map(stat => {
        if (stat.static) return stat;
        
        let change = 0;
        if (stat.label === 'Total Value Locked') {
          change = (Math.random() - 0.4) * 5000000; // +/- 5M with positive bias
        } else if (stat.label === 'Active Users') {
          change = Math.floor((Math.random() - 0.3) * 50); // +/- 50 with positive bias
        } else if (stat.label === 'Transactions') {
          change = Math.floor(Math.random() * 500); // Always increasing
        }
        
        return {
          ...stat,
          value: Math.max(stat.value * 0.9, stat.value + change)
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">Live Data</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Platform Statistics</h2>
          <p className="text-muted-foreground">Real-time metrics from our ecosystem</p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {liveStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-4 md:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex justify-center mb-3">
                <motion.div 
                  className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                >
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </motion.div>
              </div>
              <AnimatedCounter 
                value={initialStats[index].value}
                liveValue={stat.value}
                prefix={stat.prefix} 
                suffix={stat.suffix} 
                decimals={stat.decimals}
                isStatic={stat.static}
              />
              <p className="text-muted-foreground text-xs md:text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveStats;
