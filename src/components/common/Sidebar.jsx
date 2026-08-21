import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import {
  LayoutDashboard,
  Store,
  Receipt,
  History,
  TrendingUp,
  BrainCircuit,
  Package,
  Users,
  AlertTriangle,
  FileSpreadsheet,
  Settings,
  Sparkles,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  IdCard,
  LogOut
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const { role, currentStudent, adminUser, studentLogout, adminLogout } = useAuth();
  const { products } = useStore();

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;

  const studentNavItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "store", label: "Stationery Store", icon: Store },
    { id: "ai-prediction", label: "AI Consumption", icon: BrainCircuit, badge: "AI" },
    { id: "analytics", label: "Spending Analytics", icon: TrendingUp },
    { id: "history", label: "Purchase History", icon: History },
    { id: "profile", label: "Student Profile", icon: IdCard }
  ];

  const adminNavItems = [
    { id: "admin-dashboard", label: "Overview Analytics", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory Stock", icon: Package, countBadge: lowStockCount > 0 ? lowStockCount : null },
    { id: "students", label: "Student Directory", icon: Users },
    { id: "sales", label: "Sales & Invoices", icon: Receipt },
    { id: "ai-forecast", label: "AI Demand Forecast", icon: BrainCircuit, badge: "AI" },
    { id: "ai-anomaly", label: "AI Anomaly Detection", icon: AlertTriangle, badge: "Spike" }
  ];

  const navItems = role === "admin" ? adminNavItems : studentNavItems;
  const sName = currentStudent?.student_name || currentStudent?.name || "Harish V";
  const sReg = currentStudent?.registration_number || currentStudent?.rollNo || "24IT101";

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 2px 8px rgba(5,150,105,0.3)"
              }}
            >
              <GraduationCap size={22} />
            </div>
            <div>
              <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
                Smart<span style={{ color: "var(--primary)" }}>Stat</span>.ai
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "600" }}>
                Nandha Engineering College
              </div>
            </div>
          </div>
        )}

        <button
          className="btn btn-secondary btn-icon"
          style={{ width: "28px", height: "28px", border: "none", background: "var(--bg-card-subtle)" }}
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {!collapsed && (
          <div
            style={{
              padding: "4px 12px 8px",
              fontSize: "0.72rem",
              fontWeight: "700",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em"
            }}
          >
            {role === "admin" ? "Administration Portal" : "Student Portal"}
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : ""}
            >
              <div className="nav-icon">
                <Icon size={19} />
              </div>
              {!collapsed && (
                <>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        marginLeft: "auto",
                        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                        color: "white",
                        padding: "2px 7px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.68rem",
                        fontWeight: "700",
                        letterSpacing: "0.03em"
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.countBadge && (
                    <span
                      style={{
                        marginLeft: "auto",
                        background: "var(--accent-red)",
                        color: "white",
                        padding: "2px 7px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.7rem",
                        fontWeight: "700"
                      }}
                    >
                      {item.countBadge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Profile Snapshot & Logout */}
      {!collapsed && (
        <div className="sidebar-footer">
          {role === "student" && currentStudent ? (
            <div
              style={{
                background: "var(--bg-card-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "12px",
                border: "1px solid var(--border-light)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: currentStudent.avatarColor || "var(--primary)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "0.85rem"
                  }}
                >
                  {sName.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {sName}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    {sReg} • Sem {currentStudent.semester}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "8px",
                  paddingTop: "8px",
                  borderTop: "1px dashed var(--border-light)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.75rem"
                }}
              >
                <button
                  onClick={() => setActiveTab("profile")}
                  style={{ background: "none", border: "none", color: "var(--primary-dark)", fontWeight: "600", cursor: "pointer", padding: 0 }}
                >
                  View Profile
                </button>
                <button
                  onClick={studentLogout}
                  style={{ background: "none", border: "none", color: "var(--accent-red)", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", padding: 0 }}
                >
                  <LogOut size={12} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: "var(--primary-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "12px",
                border: "1px solid var(--primary-border)"
              }}
            >
              <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--primary-dark)", display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={14} color="var(--primary)" />
                Nandha AI System v2.4
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Active models: Linear Trend + Demand Forecast v3
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
