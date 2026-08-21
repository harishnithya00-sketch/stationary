import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import {
  BrainCircuit,
  Receipt,
  Package,
  History,
  TrendingUp,
  BarChart3,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Store,
  Layers,
  Cpu,
  Zap,
  ShoppingBag,
  UserCheck
} from "lucide-react";

export const LandingPage = () => {
  const { setRole, loginAsAdmin, isAuthenticatedStudent } = useAuth();
  const { students, products, purchases } = useStore();

  const handleStudentGetStarted = () => {
    if (isAuthenticatedStudent) {
      setRole("student");
    } else {
      setRole("student-login");
    }
  };

  const features = [
    {
      title: "Smart Billing",
      description: "Fast counter and digital checkout with instant printable Nandha Engineering College GST invoices and QR codes.",
      icon: Receipt,
      color: "#059669",
      bg: "#ecfdf5"
    },
    {
      title: "Inventory Management",
      description: "Real-time stock tracking with automatic minimum safety threshold alerts and one-click stock replenishment.",
      icon: Package,
      color: "#2563eb",
      bg: "#eff6ff"
    },
    {
      title: "Student Purchase History",
      description: "Semester-wise and year-wise digital ledger tracking all student purchases connected by unique Registration Number.",
      icon: History,
      color: "#7c3aed",
      bg: "#f5f3ff"
    },
    {
      title: "Semester Analytics",
      description: "Deep analytics tracking budget distribution across engineering branches, terms, and consumable categories.",
      icon: TrendingUp,
      color: "#0891b2",
      bg: "#ecfeff"
    },
    {
      title: "AI Consumption Prediction",
      description: "Personalized student predictive models forecasting next semester stationery needs with confidence metrics and explanations.",
      icon: BrainCircuit,
      color: "#d97706",
      bg: "#fffbeb"
    },
    {
      title: "AI Stock Forecasting",
      description: "Aggregated campus demand forecasting to prevent exam-season stockouts and provide automated reorder quantities.",
      icon: BarChart3,
      color: "#dc2626",
      bg: "#fef2f2"
    }
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Student Purchases",
      desc: "Students purchase stationery items using their unique Registration Number at the campus counter or online store.",
      icon: ShoppingBag
    },
    {
      step: "02",
      title: "Data Stored",
      desc: "Transactions are securely logged with Registration Number, Semester, Department, items, and timestamps.",
      icon: Layers
    },
    {
      step: "03",
      title: "AI Analyzes Consumption",
      desc: "Machine learning models analyze historical velocity against department curriculum and laboratory schedules.",
      icon: Cpu
    },
    {
      step: "04",
      title: "Future Demand Predicted",
      desc: "Forecasts next term student needs (e.g. +17% A4 paper increase) with high confidence scores.",
      icon: BrainCircuit
    },
    {
      step: "05",
      title: "Smart Stock Recommendation",
      desc: "Admin receives proactive reorder advisories to replenish items before shortage occurs.",
      icon: Sparkles
    }
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Top Navbar */}
      <header
        style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 36px",
          borderBottom: "1px solid var(--border-light)",
          position: "sticky",
          top: 0,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          zIndex: 100
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
              Smart<span style={{ color: "var(--primary)" }}>Stat</span>.ai
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "600" }}>
              Nandha Engineering College
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button className="btn btn-secondary btn-sm" onClick={handleStudentGetStarted}>
            Student Login
          </button>
          <button className="btn btn-primary btn-sm" onClick={loginAsAdmin}>
            Admin Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: "80px 24px 60px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--primary-subtle)",
            color: "var(--primary-dark)",
            padding: "6px 16px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.85rem",
            fontWeight: "700",
            marginBottom: "24px",
            border: "1px solid var(--primary-border)"
          }}
        >
          <Sparkles size={16} color="var(--primary)" />
          Nandha Engineering College • Campus Stationery AI Platform
        </div>

        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            fontWeight: "800",
            color: "var(--text-main)",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: "900px"
          }}
        >
          Smart Stationery Management Powered by{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #059669, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            AI
          </span>
        </h1>

        <p
          style={{
            fontSize: "1.15rem",
            color: "var(--text-muted)",
            maxWidth: "760px",
            marginTop: "20px",
            lineHeight: 1.6
          }}
        >
          Manage stationery, simplify billing, understand student consumption and predict future demand using AI.
        </p>

        {/* Hero CTA Buttons */}
        <div style={{ display: "flex", gap: "16px", marginTop: "36px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            className="btn btn-dark btn-lg"
            onClick={handleStudentGetStarted}
            style={{ gap: "10px", padding: "14px 32px" }}
          >
            <UserCheck size={19} />
            Get Started (Student Portal)
            <ArrowRight size={18} />
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={loginAsAdmin}
            style={{ gap: "10px", padding: "14px 32px" }}
          >
            <ShieldCheck size={19} color="var(--primary)" />
            Admin Login
          </button>
        </div>

        {/* Live Simulation Metric Ribbon */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            width: "100%",
            maxWidth: "980px",
            marginTop: "60px",
            padding: "24px 32px",
            background: "#f8fafc",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--primary-dark)" }}>50+ Students</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>Enrolled & Tracked</div>
          </div>
          <div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#2563eb" }}>18+ Products</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>Subsidized Supplies</div>
          </div>
          <div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#7c3aed" }}>94.2%</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>AI Prediction Accuracy</div>
          </div>
          <div>
            <div style={{ fontSize: "1.8rem", fontWeight: "800", color: "#d97706" }}>8 Semesters</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>Historical Consumption</div>
          </div>
        </div>
      </section>

      {/* 6 Feature Cards Section */}
      <section style={{ padding: "60px 24px", background: "#f8fafc", borderTop: "1px solid var(--border-light)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="badge badge-success" style={{ marginBottom: "8px" }}>
              Comprehensive Features
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-main)" }}>
              Engineered for Nandha Engineering College
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "6px" }}>
              From instant digital bills to advanced multi-factor demand forecasting
            </p>
          </div>

          <div className="grid-3">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="card card-hoverable"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    background: "#ffffff"
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "var(--radius-md)",
                      background: feat.bg,
                      color: feat.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-main)" }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* "How It Works" 5-Step Section */}
      <section style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <span className="badge badge-purple" style={{ marginBottom: "8px" }}>
            AI Pipeline
          </span>
          <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-main)" }}>
            How It Works
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "6px" }}>
            Five-stage automated data and machine learning lifecycle
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          {workflowSteps.map((ws, i) => {
            const Icon = ws.icon;
            return (
              <div
                key={i}
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px",
                  position: "relative",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div
                  style={{
                    fontSize: "2.4rem",
                    fontWeight: "900",
                    color: "var(--primary-subtle)",
                    lineHeight: 1,
                    marginBottom: "12px",
                    fontFamily: "var(--font-mono)"
                  }}
                >
                  {ws.step}
                </div>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--primary-subtle)",
                    color: "var(--primary-dark)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px"
                  }}
                >
                  <Icon size={18} />
                </div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "6px" }}>
                  {ws.title}
                </h4>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {ws.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border-light)",
          background: "#0f172a",
          color: "#94a3b8",
          padding: "48px 24px 32px"
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <GraduationCap size={20} />
            </div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "white" }}>
                Smart<span style={{ color: "var(--primary-light)" }}>Stat</span>.ai
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                Nandha Engineering College • Central Stationery & Digital Store
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "20px", fontSize: "0.85rem" }}>
            <span style={{ color: "#64748b" }}>© 2026 Nandha Engineering College</span>
            <span>•</span>
            <span style={{ color: "#64748b" }}>Version 2.4.0 (Production Build)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
