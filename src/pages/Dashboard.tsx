import { useState, lazy, Suspense, memo, useCallback } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { HoloBackground } from "@/components/landing/HoloBackground";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load dashboard views
const PortfolioOverview = lazy(() => import("@/components/dashboard/PortfolioOverview").then(m => ({ default: m.PortfolioOverview })));
const AssetsView = lazy(() => import("@/components/dashboard/AssetsView").then(m => ({ default: m.AssetsView })));
const BridgeView = lazy(() => import("@/components/dashboard/BridgeView").then(m => ({ default: m.BridgeView })));
const DiscoverView = lazy(() => import("@/components/dashboard/DeFiView").then(m => ({ default: m.DeFiView }))); // Map Discover to DeFiView
const AnalyticsView = lazy(() => import("@/components/dashboard/AnalyticsView").then(m => ({ default: m.AnalyticsView })));
const SettingsView = lazy(() => import("@/components/dashboard/SettingsView").then(m => ({ default: m.SettingsView })));
const TransactionHistoryView = lazy(() => import("@/components/dashboard/TransactionHistoryView").then(m => ({ default: m.TransactionHistoryView })));
const WalletManagementView = lazy(() => import("@/components/dashboard/WalletManagementView").then(m => ({ default: m.WalletManagementView })));
const ActivityFeedView = lazy(() => import("@/components/dashboard/ActivityFeedView").then(m => ({ default: m.ActivityFeedView })));
const ProfitLossView = lazy(() => import("@/components/dashboard/ProfitLossView").then(m => ({ default: m.ProfitLossView })));

export type DashboardView = "overview" | "assets" | "wallets" | "bridge" | "discover" | "analytics" | "activity" | "pnl" | "transactions" | "settings";

// View loading skeleton
const ViewLoader = memo(() => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
    </div>
    <Skeleton className="h-64 rounded-xl" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-48 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  </div>
));

ViewLoader.displayName = "ViewLoader";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>("overview");

  const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);
  const openMobileSidebar = useCallback(() => setMobileSidebarOpen(true), []);
  const closeMobileSidebar = useCallback(() => setMobileSidebarOpen(false), []);

  const renderView = () => {
    switch (activeView) {
      case "overview":
        return <PortfolioOverview />;
      case "assets":
        return <AssetsView />;
      case "wallets":
        return <WalletManagementView />;
      case "bridge":
        return <BridgeView />;
      case "discover":
        return <DiscoverView />;
      case "analytics":
        return <AnalyticsView />;
      case "activity":
        return <ActivityFeedView />;
      case "pnl":
        return <ProfitLossView />;
      case "transactions":
        return <TransactionHistoryView />;
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
        onToggle={toggleSidebar}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileSidebarOpen}
        onClose={closeMobileSidebar}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        <DashboardHeader onMenuToggle={openMobileSidebar} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Suspense fallback={<ViewLoader />}>
            {renderView()}
          </Suspense>
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
};

export default Dashboard;
