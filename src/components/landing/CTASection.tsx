import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 md:p-12 text-center overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
              <span className="text-small text-primary-foreground/90">Start earning today</span>
            </div>
            
            <h2 className="text-h1 font-bold text-primary-foreground mb-4">
              Ready to Optimize Your Portfolio?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Join thousands of traders who are already using Yielder to track, bridge, and grow their cross-chain assets.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="group shadow-[0_0_20px_4px_hsl(var(--holo-cyan)/0.4),0_0_40px_8px_hsl(var(--holo-purple)/0.3)] hover:shadow-[0_0_25px_6px_hsl(var(--holo-cyan)/0.6),0_0_50px_10px_hsl(var(--holo-purple)/0.4)] transition-all duration-300">
                <Link to="/dashboard">
                  Launch Dashboard
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground border border-white/30 shadow-[0_0_15px_2px_hsl(var(--holo-pink)/0.3)] hover:shadow-[0_0_20px_4px_hsl(var(--holo-pink)/0.5)] transition-all duration-300">
                <a href="#demo">View Demo</a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
