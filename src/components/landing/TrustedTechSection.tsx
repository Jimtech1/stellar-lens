import { motion } from "framer-motion";
import { Blocks, ArrowLeftRight, Layers, BarChart3, ShieldCheck, Code2 } from "lucide-react";

const technologies = [
  {
    icon: Blocks,
    name: "Stellar SDK",
    description: "Native Stellar integration",
  },
  {
    icon: ArrowLeftRight,
    name: "Axelar SDK",
    description: "Cross-chain messaging",
  },
  {
    icon: Layers,
    name: "LayerZero CCPT V2",
    description: "Protocol for cross-chain bridging",
  },
  {
    icon: BarChart3,
    name: "Real-time Analytics",
    description: "Live data feeds",
  },
  {
    icon: ShieldCheck,
    name: "Multi-sig Support",
    description: "Enhanced security",
  },
  {
    icon: Code2,
    name: "Stellar and EVM Wallet Kit",
    description: "Multi-chain wallet support",
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

export function TrustedTechSection() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-h2 font-bold text-foreground mb-4">
            Built on trusted technology
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Industry-leading protocols and frameworks powering your portfolio management.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {technologies.map((tech) => (
            <motion.div
              key={tech.name}
              variants={itemVariants}
              className="group flex flex-col items-center p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 hover:bg-card/80 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <tech.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-small font-semibold text-foreground text-center mb-1">
                {tech.name}
              </h3>
              <p className="text-tiny text-muted-foreground text-center">
                {tech.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
