import { motion } from "framer-motion";
import { Wallet, BarChart3, ArrowLeftRight, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    title: "Connect Your Wallet",
    description: "Link your Stellar wallet and any EVM-compatible wallets to get started.",
  },
  {
    icon: BarChart3,
    title: "View Your Portfolio",
    description: "See all your cross-chain assets, balances, and performance in one dashboard.",
  },
  {
    icon: ArrowLeftRight,
    title: "Bridge & Optimize",
    description: "Find the best routes and timing for cross-chain transfers with our bridge optimizer.",
  },
  {
    icon: TrendingUp,
    title: "Earn More Yield",
    description: "Discover high-APY opportunities and grow your portfolio across chains.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-h1 font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get started with Yielder in four simple steps
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-border" />
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center relative"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 relative z-10">
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border-4 border-primary text-primary font-bold text-small flex items-center justify-center -mt-2 z-20">
                  {index + 1}
                </div>
                <h3 className="text-h3 font-semibold text-foreground mb-2 mt-6">
                  {step.title}
                </h3>
                <p className="text-small text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
