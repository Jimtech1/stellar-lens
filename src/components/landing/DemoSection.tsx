import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const portfolioData = [
  { name: "Mon", value: 21000 },
  { name: "Tue", value: 21500 },
  { name: "Wed", value: 20800 },
  { name: "Thu", value: 22100 },
  { name: "Fri", value: 22500 },
];

const allocationData = [
  { name: "Stellar", value: 35, color: "hsl(224, 100%, 58%)" },
  { name: "Ethereum", value: 30, color: "hsl(38, 100%, 65%)" },
  { name: "Polygon", value: 20, color: "hsl(270, 80%, 60%)" },
  { name: "Arbitrum", value: 15, color: "hsl(200, 80%, 55%)" },
];

const mockAssets = [
  { symbol: "XLM", name: "Stellar Lumens", value: "$1,850", change: "+3.24%", positive: true },
  { symbol: "USDC", name: "USD Coin", value: "$5,000", change: "+0.01%", positive: true },
  { symbol: "ETH", name: "Ethereum", value: "$5,635", change: "-1.23%", positive: false },
];

export function DemoSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-h1 md:text-4xl font-bold text-foreground mb-4">
            See your portfolio come alive
          </h2>
          <p className="text-body text-muted-foreground">
            Interactive dashboard preview showing real-time analytics and insights.
          </p>
        </motion.div>

        {/* Demo Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="card-elevated rounded-2xl overflow-hidden shadow-elevated"
        >
          {/* Mock Window Bar */}
          <div className="bg-secondary px-4 py-3 flex items-center gap-2 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 rounded-md bg-background text-tiny text-muted-foreground">
                app.yielder.io/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6 bg-background">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Stats & Chart */}
              <div className="lg:col-span-2 space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="card-elevated p-4">
                    <p className="text-tiny text-muted-foreground mb-1">Total Value</p>
                    <p className="text-h2 font-bold font-mono text-foreground">$22,500</p>
                    <p className="text-tiny text-success">+$750 (3.45%)</p>
                  </div>
                  <div className="card-elevated p-4">
                    <p className="text-tiny text-muted-foreground mb-1">30D Earnings</p>
                    <p className="text-h2 font-bold font-mono text-foreground">$847</p>
                    <p className="text-tiny text-muted-foreground">5.8% APY</p>
                  </div>
                  <div className="card-elevated p-4">
                    <p className="text-tiny text-muted-foreground mb-1">Risk Score</p>
                    <p className="text-h2 font-bold font-mono text-success">42</p>
                    <p className="text-tiny text-muted-foreground">Low Risk</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="card-elevated p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-small font-semibold text-foreground">Portfolio Performance</h3>
                    <div className="flex gap-2">
                      {["1D", "1W", "1M", "1Y"].map((period, i) => (
                        <button
                          key={period}
                          className={`px-2 py-1 text-tiny rounded ${
                            i === 2 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={portfolioData}>
                        <defs>
                          <linearGradient id="demoGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(224, 100%, 58%)" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="hsl(224, 100%, 58%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(224, 100%, 58%)"
                          strokeWidth={2}
                          fill="url(#demoGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right Column - Allocation & Assets */}
              <div className="space-y-6">
                {/* Allocation */}
                <div className="card-elevated p-4">
                  <h3 className="text-small font-semibold text-foreground mb-4">Chain Allocation</h3>
                  <div className="h-32 flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={55}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {allocationData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-tiny text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Assets */}
                <div className="card-elevated p-4">
                  <h3 className="text-small font-semibold text-foreground mb-3">Top Assets</h3>
                  <div className="space-y-3">
                    {mockAssets.map((asset) => (
                      <div key={asset.symbol} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm">
                            {asset.symbol.charAt(0)}
                          </div>
                          <div>
                            <p className="text-small font-medium text-foreground">{asset.symbol}</p>
                            <p className="text-tiny text-muted-foreground">{asset.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-small font-mono text-foreground">{asset.value}</p>
                          <p className={`text-tiny ${asset.positive ? "text-success" : "text-destructive"}`}>
                            {asset.change}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
