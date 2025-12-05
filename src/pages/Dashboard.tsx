import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { AssetsView } from "@/components/dashboard/AssetsView";
import { BridgeView } from "@/components/dashboard/BridgeView";
import { DiscoverView } from "@/components/dashboard/DiscoverView";
import { AnalyticsView } from "@/components/dashboard/AnalyticsView";
import { SettingsView } from "@/components/dashboard/SettingsView";

export type DashboardView = "overview" | "assets" | "bridge" | "discover" | "analytics" | "settings";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    <div className="min-h-screen bg-background flex holo-bg holo-noise">
      {/* Holographic orbs for dashboard */}
      <div className="holo-orb w-[400px] h-[400px] bg-[hsl(var(--holo-cyan))] top-[10%] right-[5%] fixed opacity-30" />
      <div className="holo-orb w-[300px] h-[300px] bg-[hsl(var(--holo-purple))] bottom-[20%] left-[30%] fixed opacity-25" style={{ animationDelay: '-8s' }} />
      <div className="holo-orb w-[250px] h-[250px] bg-[hsl(var(--holo-blue))] top-[50%] left-[60%] fixed opacity-20" style={{ animationDelay: '-4s' }} />
      
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="flex-1 p-6 overflow-auto holo-grid">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
