import { memo, useEffect, useRef, useCallback } from 'react';
import { TrendingUp, Users, Zap, Shield, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { stellarApi } from '@/services/stellarApi';

const AnimatedCounter = memo(({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  isStatic = false
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  isStatic?: boolean;
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  const formatNumber = useCallback((num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(decimals);
  }, [decimals]);

  return (
    <span
      ref={ref}
      className="font-bold text-2xl md:text-3xl text-foreground font-mono transition-transform"
    >
      {prefix}{formatNumber(value)}{suffix}
    </span>
  );
});

AnimatedCounter.displayName = "AnimatedCounter";

const StatCard = memo(({ label, value, prefix = '', suffix = '', icon: Icon, isLoading }: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: any;
  isLoading: boolean;
}) => (
  <div className="text-center p-4 md:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 group animate-fade-in">
    <div className="flex justify-center mb-3">
      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
      </div>
    </div>
    {isLoading ? (
      <div className="h-8 w-24 mx-auto bg-muted animate-pulse rounded" />
    ) : (
      <AnimatedCounter
        value={value}
        prefix={prefix}
        suffix={suffix}
      />
    )}
    <p className="text-muted-foreground text-xs md:text-sm mt-1">{label}</p>
  </div>
));

StatCard.displayName = "StatCard";

const LiveStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['networkStats'],
    queryFn: stellarApi.getNetworkStats,
    refetchInterval: 30000, // Refresh every 30s
  });

  const cards = [
    { label: 'Total Volume (24h)', value: stats?.volume24h || 0, prefix: '$', icon: TrendingUp },
    { label: 'Active Contracts', value: stats?.activeContracts || 0, suffix: '+', icon: Activity },
    { label: 'Unique Wallets', value: stats?.uniqueWallets || 0, suffix: '+', icon: Users },
    { label: 'Transactions (24h)', value: stats?.txCount24h || 0, suffix: '+', icon: Zap },
  ];

  return (
    <section className="py-12 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-muted-foreground">Live Stellar Network Data</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Platform Statistics</h2>
          <p className="text-muted-foreground">Real-time metrics from the Stellar ecosystem</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {cards.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveStats;
