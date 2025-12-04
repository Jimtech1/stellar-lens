import { motion } from "framer-motion";

const technologies = [
  { name: "Stellar SDK", description: "Native Stellar integration" },
  { name: "Axelar Bridge", description: "Cross-chain messaging" },
  { name: "Soroban", description: "Smart contracts" },
  { name: "Real-time Analytics", description: "Live data feeds" },
  { name: "Multi-sig Support", description: "Enhanced security" },
  { name: "Open Source", description: "Transparent code" },
];

export function TechStackSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-h1 md:text-4xl font-bold text-foreground mb-4">
            Built on trusted technology
          </h2>
          <p className="text-body text-muted-foreground">
            Industry-leading protocols and frameworks powering your portfolio management.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="px-5 py-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-300 cursor-default">
                <p className="text-small font-medium text-foreground group-hover:text-primary transition-colors">
                  {tech.name}
                </p>
                <p className="text-tiny text-muted-foreground">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
