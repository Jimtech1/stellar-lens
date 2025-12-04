import { motion } from "framer-motion";
import { PieChart, ArrowLeftRight, TrendingUp, Shield, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: PieChart,
    title: "Multi-Chain Overview",
    description: "See all your Stellar and bridged EVM assets in one unified dashboard with real-time valuations.",
  },
  {
    icon: ArrowLeftRight,
    title: "Smart Bridging",
    description: "Find optimal routes and timing for cross-chain transfers with fee comparisons and gas estimates.",
  },
  {
    icon: TrendingUp,
    title: "Yield Opportunities",
    description: "Discover highest APY opportunities across chains with risk-adjusted recommendations.",
  },
  {
    icon: Shield,
    title: "Risk Analytics",
    description: "Smart contract audits, protocol health scores, and exposure analysis for informed decisions.",
  },
  {
    icon: Zap,
    title: "Real-Time Data",
    description: "Live price feeds, transaction tracking, and instant notifications for your portfolio.",
  },
  {
    icon: Globe,
    title: "Cross-Chain Support",
    description: "Seamlessly manage assets across Stellar, Ethereum, Polygon, Arbitrum and more.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-h1 md:text-4xl font-bold text-foreground mb-4">
            Everything you need for DeFi success
          </h2>
          <p className="text-body text-muted-foreground">
            Professional-grade tools designed for both newcomers and experienced traders.
            Track, analyze, and optimize your cross-chain portfolio.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="card-elevated p-6 hover:shadow-card transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-h3 font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-small text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
