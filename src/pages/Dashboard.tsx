import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { AssetsView } from "@/components/dashboard/AssetsView";
import { BridgeView } from "@/components/dashboard/BridgeView";
import { DiscoverView } from "@/components/dashboard/DiscoverView";

export type DashboardView = "overview" | "assets" | "bridge" | "discover";

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
