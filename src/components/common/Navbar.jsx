import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { useNotification } from "../../context/NotificationContext";
import {
  Search,
  Bell,
  ShoppingCart,
  User,
  Shield,
  ChevronDown,
  LogOut,
  Sparkles,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  KeyRound,
  IdCard
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const Navbar = ({ onOpenCart, onNavigate }) => {
  const {
    role,
    setRole,
    currentStudent,
    switchStudent,
    adminUser,
    studentLogout,
    adminLogout,
    isAuthenticatedStudent
  } = useAuth();
  const { cartSummary, searchQuery, setSearchQuery, students, resetAllData } = useStore();
  const { notifications, markAllAsRead, markAsRead } = useNotification();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showStudentSwitcher, setShowStudentSwitcher] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const studentRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (studentRef.current && !studentRef.current.contains(event.target)) {
        setShowStudentSwitcher(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(
    (n) => !n.read && (n.forRole === "both" || n.forRole === role)
  ).length;

  const displayName = role === "admin"
    ? adminUser.name
    : (currentStudent?.student_name || currentStudent?.name || "Student");

  const studentRegNo = currentStudent?.registration_number || currentStudent?.rollNo || "";

  return (
    <header className="top-header">
      {/* Search Input for Products / Students */}
      <div className="search-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder={
            role === "admin"
              ? "Search inventory, registration no, students or bills..."
              : "Search stationery, pens, notebooks, files, A4..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Role Switcher */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--bg-card-subtle)",
            borderRadius: "var(--radius-full)",
            padding: "3px",
            border: "1px solid var(--border-light)"
          }}
        >
          <button
            className={`btn btn-sm ${role === "student" ? "btn-primary" : "btn-secondary"}`}
            style={{
              borderRadius: "var(--radius-full)",
              padding: "4px 12px",
              border: "none",
              fontSize: "0.78rem"
            }}
            onClick={() => {
              if (isAuthenticatedStudent) {
                setRole("student");
              } else {
                setRole("student-login");
              }
            }}
          >
            <User size={13} />
            Student View
          </button>
          <button
            className={`btn btn-sm ${role === "admin" ? "btn-dark" : "btn-secondary"}`}
            style={{
              borderRadius: "var(--radius-full)",
              padding: "4px 12px",
              border: "none",
              fontSize: "0.78rem"
            }}
            onClick={() => setRole("admin")}
          >
            <Shield size={13} />
            Admin View
          </button>
        </div>

        {/* Student Switcher Dropdown */}
        {role === "student" && currentStudent && (
          <div style={{ position: "relative" }} ref={studentRef}>
            <button
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: "var(--radius-full)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                fontSize: "0.82rem"
              }}
              onClick={() => setShowStudentSwitcher(!showStudentSwitcher)}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: currentStudent.avatarColor || "#059669",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: "bold"
                }}
              >
                {displayName.charAt(0)}
              </div>
              <span style={{ maxWidth: "130px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "600" }}>
                {displayName.split(" ")[0]} ({studentRegNo})
              </span>
              <ChevronDown size={14} />
            </button>

            {showStudentSwitcher && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "8px",
                  width: "290px",
                  background: "white",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-xl)",
                  border: "1px solid var(--border-light)",
                  zIndex: 100,
                  padding: "8px",
                  maxHeight: "340px",
                  overflowY: "auto"
                }}
              >
                <div style={{ padding: "6px 10px", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Switch Active Student
                </div>
                {students.slice(0, 10).map((stu) => {
                  const sReg = stu.registration_number || stu.rollNo;
                  const sName = stu.student_name || stu.name;
                  const isActive = studentRegNo === sReg;
                  return (
                    <div
                      key={stu.student_id || stu.id}
                      onClick={() => {
                        switchStudent(sReg);
                        setShowStudentSwitcher(false);
                      }}
                      style={{
                        padding: "8px 10px",
                        borderRadius: "var(--radius-md)",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        cursor: "pointer",
                        background: isActive ? "var(--primary-subtle)" : "transparent",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = "var(--bg-card-subtle)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "50%",
                          backgroundColor: stu.avatarColor || "var(--primary)",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.72rem",
                          fontWeight: "bold"
                        }}
                      >
                        {sName.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {sName}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {sReg} • Sem {stu.semester} ({stu.deptCode})
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Shopping Cart Button */}
        {role === "student" && (
          <button
            className="btn btn-secondary btn-icon"
            style={{ position: "relative" }}
            onClick={onOpenCart}
            title="View Shopping Cart"
          >
            <ShoppingCart size={19} />
            {cartSummary.totalItemsCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "var(--primary)",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  borderRadius: "var(--radius-full)",
                  minWidth: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}
              >
                {cartSummary.totalItemsCount}
              </span>
            )}
          </button>
        )}

        {/* Notification Bell Dropdown */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            className="btn btn-secondary btn-icon"
            style={{ position: "relative" }}
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--accent-red)",
                  boxShadow: "0 0 0 2px white"
                }}
              />
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "10px",
                width: "340px",
                background: "white",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-xl)",
                border: "1px solid var(--border-light)",
                zIndex: 100,
                padding: "12px",
                maxHeight: "420px",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "10px",
                  borderBottom: "1px solid var(--border-light)",
                  marginBottom: "8px"
                }}
              >
                <span style={{ fontWeight: "700", fontSize: "0.95rem" }}>Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--primary)",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      style={{
                        padding: "10px",
                        borderRadius: "var(--radius-md)",
                        background: n.read ? "transparent" : "var(--bg-card-subtle)",
                        cursor: "pointer",
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                        transition: "background 0.2s"
                      }}
                    >
                      <div style={{ marginTop: "2px" }}>
                        {n.type === "warning" ? (
                          <AlertTriangle size={16} color="var(--accent-amber)" />
                        ) : n.type === "success" ? (
                          <CheckCircle size={16} color="var(--primary)" />
                        ) : (
                          <Info size={16} color="var(--accent-blue)" />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-main)" }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-light)", marginTop: "4px" }}>
                          {n.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div style={{ position: "relative" }} ref={profileRef}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              padding: "4px 8px 4px 4px",
              borderRadius: "var(--radius-full)",
              background: "var(--bg-card-subtle)",
              border: "1px solid var(--border-light)"
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: role === "admin" ? "var(--primary-dark)" : currentStudent?.avatarColor || "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "0.8rem"
              }}
            >
              {displayName.charAt(0)}
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>

          {showProfileMenu && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: "10px",
                width: "250px",
                background: "white",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-xl)",
                border: "1px solid var(--border-light)",
                zIndex: 100,
                padding: "8px"
              }}
            >
              <div style={{ padding: "10px", borderBottom: "1px solid var(--border-light)", marginBottom: "6px" }}>
                <div style={{ fontWeight: "700", fontSize: "0.9rem", color: "var(--text-main)" }}>
                  {displayName}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {role === "admin" ? adminUser.role : `Reg No: ${studentRegNo}`}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: "600", marginTop: "2px" }}>
                  Nandha Engineering College
                </div>
              </div>

              {role === "student" && (
                <button
                  className="nav-link"
                  style={{ fontSize: "0.85rem", padding: "8px 10px" }}
                  onClick={() => {
                    onNavigate("profile");
                    setShowProfileMenu(false);
                  }}
                >
                  <IdCard size={15} />
                  My Student Profile
                </button>
              )}

              <button
                className="nav-link"
                style={{ fontSize: "0.85rem", padding: "8px 10px" }}
                onClick={() => {
                  resetAllData();
                  setShowProfileMenu(false);
                }}
              >
                <RefreshCw size={15} />
                Reset Demo Database
              </button>

              <button
                className="nav-link"
                style={{ fontSize: "0.85rem", padding: "8px 10px", color: "var(--accent-red)" }}
                onClick={() => {
                  setShowProfileMenu(false);
                  if (role === "student") {
                    studentLogout();
                  } else {
                    adminLogout();
                  }
                }}
              >
                <LogOut size={15} />
                {role === "student" ? "Logout Student" : "Logout Admin"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
