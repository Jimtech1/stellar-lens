import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { TrendingUp, Users, Zap, Shield } from 'lucide-react';

const stats = [
  { label: 'Total Value Locked', value: 2400000000, prefix: '$', suffix: '+', icon: TrendingUp },
  { label: 'Active Users', value: 150000, prefix: '', suffix: '+', icon: Users },
  { label: 'Transactions', value: 5800000, prefix: '', suffix: '+', icon: Zap },
  { label: 'Uptime', value: 99.9, prefix: '', suffix: '%', icon: Shield, decimals: 1 },
];

const AnimatedCounter = ({ value, prefix, suffix, decimals = 0 }: { value: number; prefix: string; suffix: string; decimals?: number }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

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

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(decimals);
  };

  return (
    <span ref={ref} className="font-bold text-2xl md:text-3xl text-foreground">
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

const LiveStats = () => {
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
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Platform Statistics</h2>
          <p className="text-muted-foreground">Real-time metrics from our ecosystem</p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-4 md:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
              </div>
              <AnimatedCounter 
                value={stat.value} 
                prefix={stat.prefix} 
                suffix={stat.suffix} 
                decimals={stat.decimals}
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
