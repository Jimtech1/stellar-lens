import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrendingSection } from "@/components/landing/TrendingSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TechStackSection } from "@/components/landing/TechStackSection";
import { CTASection } from "@/components/landing/CTASection";
import { FooterSection } from "@/components/landing/FooterSection";
import { HoloBackground } from "@/components/landing/HoloBackground";
import PriceTicker from "@/components/landing/PriceTicker";
import LiveStats from "@/components/landing/LiveStats";
import SecurityBadges from "@/components/landing/SecurityBadges";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Global Holographic Background */}
      <HoloBackground variant="default" className="fixed z-0" />
      
      {/* Price Ticker at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <PriceTicker />
      </div>
      
      <div className="pt-10">
        <Navbar />
      </div>
      
      <main className="relative z-10">
        <HeroSection />
        <LiveStats />
        <TrendingSection />
        <FeaturesSection />
        <SecurityBadges />
        <HowItWorksSection />
        <DemoSection />
        <TestimonialsSection />
        <TechStackSection />
        <CTASection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
