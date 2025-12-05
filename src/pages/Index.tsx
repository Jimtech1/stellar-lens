import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TechStackSection } from "@/components/landing/TechStackSection";
import { CTASection } from "@/components/landing/CTASection";
import { FooterSection } from "@/components/landing/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background holo-bg holo-noise">
      {/* Holographic orbs */}
      <div className="holo-orb w-[600px] h-[600px] bg-[hsl(var(--holo-cyan))] top-[-200px] left-[-100px] fixed" />
      <div className="holo-orb w-[500px] h-[500px] bg-[hsl(var(--holo-purple))] top-[30%] right-[-150px] fixed" style={{ animationDelay: '-5s' }} />
      <div className="holo-orb w-[400px] h-[400px] bg-[hsl(var(--holo-blue))] bottom-[10%] left-[20%] fixed" style={{ animationDelay: '-10s' }} />
      <div className="holo-orb w-[300px] h-[300px] bg-[hsl(var(--holo-pink))] top-[60%] right-[30%] fixed" style={{ animationDelay: '-7s' }} />
      
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <StatsSection />
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
