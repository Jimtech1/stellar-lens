import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TechStackSection } from "@/components/landing/TechStackSection";
import { CTASection } from "@/components/landing/CTASection";
import { FooterSection } from "@/components/landing/FooterSection";
import { HoloBackground } from "@/components/landing/HoloBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Global Holographic Background */}
      <HoloBackground variant="default" className="fixed z-0" />
      
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <PartnersSection />
        <FeaturesSection />
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
