import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { AssetsView } from "@/components/dashboard/AssetsView";
import { BridgeView } from "@/components/dashboard/BridgeView";
import { DiscoverView } from "@/components/dashboard/DiscoverView";
import { AnalyticsView } from "@/components/dashboard/AnalyticsView";
import { SettingsView } from "@/components/dashboard/SettingsView";
import { HoloBackground } from "@/components/landing/HoloBackground";

export type DashboardView = "overview" | "assets" | "bridge" | "discover" | "analytics" | "settings";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>("overview");

  const renderView = () => {
    switch (activeView) {
      case "overview":
        return <PortfolioOverview />;
      case "assets":
        return <AssetsView />;
      case "bridge":
        return <BridgeView />;
      case "discover":
        return <DiscoverView />;
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <PortfolioOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Holographic Background */}
      <HoloBackground variant="subtle" className="fixed z-0" />
      
      {/* Desktop Sidebar */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        <DashboardHeader onMenuToggle={() => setMobileSidebarOpen(true)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {renderView()}
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
};

export default Dashboard;
