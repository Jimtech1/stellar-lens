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
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
