import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from "recharts";

const chartData = [
  { name: "Jan", stellar: 4000, evm: 2400 },
  { name: "Feb", stellar: 3000, evm: 1398 },
  { name: "Mar", stellar: 5000, evm: 3800 },
  { name: "Apr", stellar: 4780, evm: 3908 },
  { name: "May", stellar: 5890, evm: 4800 },
  { name: "Jun", stellar: 6390, evm: 3800 },
  { name: "Jul", stellar: 7490, evm: 4300 },
];

export function HeroChart() {
  return (
    <div className="relative">
      {/* Main Chart Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card-elevated p-6 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-small text-muted-foreground">Portfolio Value</p>
            <p className="text-h1 font-bold text-foreground">$22,847.50</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-small font-medium">
            +12.5%
          </div>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="stellarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(224, 100%, 58%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(224, 100%, 58%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="evmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(145, 100%, 39%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(145, 100%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(0, 0%, 45%)' }} />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="stellar"
                stroke="hsl(224, 100%, 58%)"
                strokeWidth={2}
                fill="url(#stellarGradient)"
              />
              <Area
                type="monotone"
                dataKey="evm"
                stroke="hsl(145, 100%, 39%)"
                strokeWidth={2}
                fill="url(#evmGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-small text-muted-foreground">Stellar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-small text-muted-foreground">EVM Assets</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Asset Cards */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute -left-4 top-1/4 card-elevated p-3 rounded-xl shadow-card"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">⭐</div>
          <div>
            <p className="text-small font-medium text-foreground">XLM</p>
            <p className="text-tiny text-success">+4.2%</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="absolute -right-4 bottom-1/4 card-elevated p-3 rounded-xl shadow-card"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">⟠</div>
          <div>
            <p className="text-small font-medium text-foreground">ETH</p>
            <p className="text-tiny text-destructive">-1.2%</p>
          </div>
        </div>
      </motion.div>

      {/* Bridge Animation Indicator */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute right-8 top-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-sm"
      >
        <span className="text-tiny text-muted-foreground">Bridging</span>
        <div className="flex gap-0.5">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </div>
  );
}
