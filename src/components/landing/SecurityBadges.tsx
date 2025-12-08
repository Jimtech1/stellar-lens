import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle, Eye } from 'lucide-react';

const badges = [
  { icon: Shield, label: 'Audited Smart Contracts', description: 'By leading security firms' },
  { icon: Lock, label: 'Non-Custodial', description: 'You control your keys' },
  { icon: CheckCircle, label: 'Open Source', description: 'Transparent & verifiable' },
  { icon: Eye, label: 'Real-Time Monitoring', description: '24/7 security alerts' },
];

const SecurityBadges = () => {
  return (
    <section className="py-12 md:py-16 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Security First</h2>
          <p className="text-muted-foreground">Enterprise-grade security for your assets</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center p-4 md:p-6 rounded-xl bg-gradient-to-b from-card to-card/50 border border-border/50 hover:border-primary/40 transition-all duration-300 group"
            >
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-3">
                <badge.icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm md:text-base text-center mb-1">{badge.label}</h3>
              <p className="text-muted-foreground text-xs text-center">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityBadges;
