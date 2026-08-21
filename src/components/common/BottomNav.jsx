import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import {
  LayoutDashboard,
  Store,
  BrainCircuit,
  History,
  TrendingUp,
  Package,
  Users,
  Receipt,
  AlertTriangle,
  IdCard
} from "lucide-react";

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const { role } = useAuth();
  const { cartSummary } = useStore();

  const studentTabs = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "store", label: "Shop", icon: Store, badge: cartSummary.totalItemsCount },
    { id: "ai-prediction", label: "AI Insights", icon: BrainCircuit },
    { id: "history", label: "History", icon: History },
    { id: "profile", label: "Profile", icon: IdCard }
  ];

  const adminTabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "students", label: "Students", icon: Users },
    { id: "sales", label: "Sales", icon: Receipt },
    { id: "ai-forecast", label: "AI Forecast", icon: BrainCircuit }
  ];

  const tabs = role === "admin" ? adminTabs : studentTabs;

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div style={{ position: "relative" }}>
              <Icon size={20} />
              {tab.badge && tab.badge > 0 ? (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-8px",
                    background: "var(--primary)",
                    color: "white",
                    fontSize: "0.6rem",
                    fontWeight: "bold",
                    borderRadius: "var(--radius-full)",
                    minWidth: "14px",
                    height: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 2px"
                  }}
                >
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
