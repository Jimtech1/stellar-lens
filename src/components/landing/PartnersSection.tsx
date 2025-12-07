import { motion } from "framer-motion";

const partners = [
  { name: "Stellar", logo: "S" },
  { name: "Ethereum", logo: "Ξ" },
  { name: "Polygon", logo: "P" },
  { name: "Arbitrum", logo: "A" },
  { name: "Chainlink", logo: "⬡" },
  { name: "Circle", logo: "C" },
  { name: "Fireblocks", logo: "F" },
  { name: "Ledger", logo: "L" },
];

export function PartnersSection() {
  return (
    <section className="py-16 bg-primary/5 border-y border-border/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-small text-muted-foreground uppercase tracking-wider font-medium">
            Trusted by industry leaders
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-16"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 text-muted-foreground/70 hover:text-foreground transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center text-lg md:text-xl font-bold text-primary/80 group-hover:text-primary group-hover:border-primary/30 transition-all shadow-sm">
                {partner.logo}
              </div>
              <span className="hidden sm:inline text-sm md:text-base font-medium">{partner.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
