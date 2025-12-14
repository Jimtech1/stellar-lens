import { memo, lazy, Suspense } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HoloBackground } from "@/components/landing/HoloBackground";
import PriceTicker from "@/components/landing/PriceTicker";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load below-the-fold sections for faster initial load
const TrendingSection = lazy(() => import("@/components/landing/TrendingSection").then(m => ({ default: m.TrendingSection })));
const FeaturesSection = lazy(() => import("@/components/landing/FeaturesSection").then(m => ({ default: m.FeaturesSection })));
const HowItWorksSection = lazy(() => import("@/components/landing/HowItWorksSection").then(m => ({ default: m.HowItWorksSection })));
const DemoSection = lazy(() => import("@/components/landing/DemoSection").then(m => ({ default: m.DemoSection })));
const TestimonialsSection = lazy(() => import("@/components/landing/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const TechStackSection = lazy(() => import("@/components/landing/TechStackSection").then(m => ({ default: m.TechStackSection })));
const CTASection = lazy(() => import("@/components/landing/CTASection").then(m => ({ default: m.CTASection })));
const FooterSection = lazy(() => import("@/components/landing/FooterSection").then(m => ({ default: m.FooterSection })));
const LiveStats = lazy(() => import("@/components/landing/LiveStats"));
const SecurityBadges = lazy(() => import("@/components/landing/SecurityBadges"));

// Section loader placeholder
const SectionLoader = memo(() => (
  <div className="py-16 px-4">
    <div className="container mx-auto max-w-4xl space-y-4">
      <Skeleton className="h-8 w-1/3 mx-auto" />
      <Skeleton className="h-4 w-2/3 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    </div>
  </div>
));

SectionLoader.displayName = "SectionLoader";

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
        
        <Suspense fallback={<SectionLoader />}>
          <LiveStats />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <TrendingSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <FeaturesSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <SecurityBadges />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <HowItWorksSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <DemoSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <TechStackSection />
        </Suspense>
        
        <Suspense fallback={<SectionLoader />}>
          <CTASection />
        </Suspense>
      </main>
      
      <Suspense fallback={<SectionLoader />}>
        <FooterSection />
      </Suspense>
    </div>
  );
};

export default Index;
