import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { StoreProvider, useStore } from "./context/StoreContext";

// Components
import { Navbar } from "./components/common/Navbar";
import { Sidebar } from "./components/common/Sidebar";
import { BottomNav } from "./components/common/BottomNav";
import { Toast } from "./components/common/Toast";
import { Modal } from "./components/common/Modal";
import { DigitalInvoice } from "./components/common/DigitalInvoice";

// Landing & Auth
import { LandingPage } from "./components/landing/LandingPage";
import { StudentLogin } from "./components/auth/StudentLogin";
import { StudentRegister } from "./components/auth/StudentRegister";

// Student Views
import { StudentDashboard } from "./components/student/StudentDashboard";
import { StationeryStore } from "./components/student/StationeryStore";
import { AIConsumptionView } from "./components/student/AIConsumptionView";
import { SpendingAnalytics } from "./components/student/SpendingAnalytics";
import { PurchaseHistory } from "./components/student/PurchaseHistory";
import { StudentProfile } from "./components/student/StudentProfile";
import { CartDrawer } from "./components/student/CartDrawer";

// Admin Views
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { InventoryManager } from "./components/admin/InventoryManager";
import { StudentDirectory } from "./components/admin/StudentDirectory";
import { SalesAnalytics } from "./components/admin/SalesAnalytics";
import { AIStockForecasting } from "./components/admin/AIStockForecasting";
import { AIAnomalyDetector } from "./components/admin/AIAnomalyDetector";

const MainLayout = () => {
  const { role, setRole, isAuthenticatedStudent } = useAuth();
  const { isCartOpen, setIsCartOpen, activeBillModal, setActiveBillModal } = useStore();

  const [activeTab, setActiveTab] = useState(() => {
    return role === "admin" ? "admin-dashboard" : "dashboard";
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // If role changes, switch default view
  useEffect(() => {
    if (role === "admin" && !activeTab.startsWith("admin-") && !["inventory", "students", "sales", "ai-forecast", "ai-anomaly"].includes(activeTab)) {
      setActiveTab("admin-dashboard");
    } else if (role === "student" && !["dashboard", "store", "ai-prediction", "analytics", "history", "profile"].includes(activeTab)) {
      setActiveTab("dashboard");
    }
  }, [role]);

  // Routing Views
  if (role === "landing") {
    return <LandingPage />;
  }

  if (role === "student-login") {
    return (
      <StudentLogin
        onNavigateRegister={() => setRole("student-register")}
        onBackToLanding={() => setRole("landing")}
      />
    );
  }

  if (role === "student-register") {
    return (
      <StudentRegister
        onNavigateLogin={() => setRole("student-login")}
        onBackToLanding={() => setRole("landing")}
      />
    );
  }

  return (
    <div className="app-wrapper">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar
          onOpenCart={() => setIsCartOpen(true)}
          onNavigate={(tab) => setActiveTab(tab)}
        />

        <main className="page-body">
          {/* Student Role Views */}
          {role === "student" && (
            <>
              {activeTab === "dashboard" && <StudentDashboard onNavigate={(t) => setActiveTab(t)} />}
              {activeTab === "store" && <StationeryStore onOpenCart={() => setIsCartOpen(true)} />}
              {activeTab === "ai-prediction" && <AIConsumptionView />}
              {activeTab === "analytics" && <SpendingAnalytics />}
              {activeTab === "history" && <PurchaseHistory />}
              {activeTab === "profile" && <StudentProfile />}
            </>
          )}

          {/* Admin Role Views */}
          {role === "admin" && (
            <>
              {activeTab === "admin-dashboard" && <AdminDashboard onNavigate={(t) => setActiveTab(t)} />}
              {activeTab === "inventory" && <InventoryManager />}
              {activeTab === "students" && <StudentDirectory />}
              {activeTab === "sales" && <SalesAnalytics />}
              {activeTab === "ai-forecast" && <AIStockForecasting />}
              {activeTab === "ai-anomaly" && <AIAnomalyDetector />}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Shopping Cart Slide-over */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Digital Printable Invoice Modal */}
      <Modal
        isOpen={Boolean(activeBillModal)}
        onClose={() => setActiveBillModal(null)}
        title="College Official Tax Invoice & Digital Receipt"
        subtitle={`Invoice #${activeBillModal?.billNumber || ""}`}
        maxWidth="680px"
      >
        <DigitalInvoice bill={activeBillModal} onClose={() => setActiveBillModal(null)} />
      </Modal>

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <StoreProvider>
          <MainLayout />
        </StoreProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
