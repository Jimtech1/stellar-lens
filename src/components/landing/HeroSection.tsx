import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { HeroChart } from "./HeroChart";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-small font-medium mb-4 md:mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Live on Stellar Mainnet
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-display font-bold text-foreground mb-4 md:mb-6 leading-tight"
            >
              Track, Discover & Optimize Your{" "}
              <span className="text-primary">Stellar Portfolio</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Unified dashboard for Stellar and cross-chain DeFi analytics.
              Monitor assets, discover yield opportunities, and bridge with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start"
            >
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Launch Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                <Play className="w-5 h-5" />
                View Demo
              </Button>
            </motion.div>

            {/* Trust Indicators - Hidden on very small screens */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden sm:flex items-center gap-4 md:gap-6 mt-8 md:mt-10 justify-center lg:justify-start"
            >
              <div className="text-center">
                <div className="text-lg md:text-h3 font-bold text-foreground">$12M+</div>
                <div className="text-xs md:text-tiny text-muted-foreground">TVL Tracked</div>
              </div>
              <div className="w-px h-8 md:h-10 bg-border" />
              <div className="text-center">
                <div className="text-lg md:text-h3 font-bold text-foreground">5,000+</div>
                <div className="text-xs md:text-tiny text-muted-foreground">Active Users</div>
              </div>
              <div className="w-px h-8 md:h-10 bg-border" />
              <div className="text-center">
                <div className="text-lg md:text-h3 font-bold text-foreground">4 Chains</div>
                <div className="text-xs md:text-tiny text-muted-foreground">Supported</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 lg:mt-0"
          >
            <HeroChart />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
