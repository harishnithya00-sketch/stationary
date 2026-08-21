import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ForgotPasswordModal } from "./ForgotPasswordModal";
import {
  GraduationCap,
  Lock,
  UserCheck,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Store,
  ChevronLeft
} from "lucide-react";

export const StudentLogin = ({ onNavigateRegister, onBackToLanding }) => {
  const { studentLogin, setRole } = useAuth();

  const [registrationNumber, setRegistrationNumber] = useState("24IT101");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!registrationNumber.trim()) {
      setError("Please enter your Registration Number.");
      return;
    }
    if (!password) {
      setError("Please enter your Password.");
      return;
    }

    setIsLoading(true);
    try {
      await studentLogin(registrationNumber.trim().toUpperCase(), password);
    } catch (err) {
      // Show generic error as requested
      setError(err.message || "Invalid Registration Number or Password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (regNo, pass = "password123") => {
    setRegistrationNumber(regNo);
    setPassword(pass);
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc, #ecfdf5 50%, #f0fdf4)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px"
      }}
    >
      {/* Top back button */}
      <div style={{ width: "100%", maxWidth: "440px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={onBackToLanding}
          className="btn btn-secondary btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.8rem" }}
        >
          <ChevronLeft size={16} />
          Back to Home
        </button>

        <button
          onClick={() => setRole("admin")}
          className="btn btn-subtle btn-sm"
          style={{ fontSize: "0.78rem" }}
        >
          <ShieldCheck size={14} />
          Admin Portal
        </button>
      </div>

      {/* Main Login Card */}
      <div
        className="card animate-fade"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "36px 32px",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border-light)",
          background: "#ffffff"
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              boxShadow: "var(--shadow-green)"
            }}
          >
            <GraduationCap size={32} />
          </div>

          <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            Student Login
          </h2>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Nandha Engineering College • Campus Stationery Portal
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div
            className="animate-fade"
            style={{
              padding: "12px 16px",
              background: "var(--accent-red-light)",
              border: "1px solid #fecaca",
              borderRadius: "var(--radius-md)",
              color: "var(--accent-red)",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
              fontWeight: "500"
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Registration Number</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>e.g. 24IT101</span>
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="Enter your Registration Number"
              value={registrationNumber}
              onChange={(e) => {
                setRegistrationNumber(e.target.value.toUpperCase());
                setError("");
              }}
              style={{ fontFamily: "var(--font-mono)", fontWeight: "600", textTransform: "uppercase" }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label className="form-label" style={{ margin: 0 }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              className="form-input"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark btn-lg"
            disabled={isLoading}
            style={{ width: "100%", marginTop: "6px", gap: "8px" }}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Selector */}
        <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px dashed var(--border-light)" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px", textAlign: "center" }}>
            Quick Demo Student Accounts
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickDemo("24IT101")}
              style={{ fontSize: "0.75rem", padding: "4px 8px" }}
            >
              Harish V (24IT101)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickDemo("22CS101")}
              style={{ fontSize: "0.75rem", padding: "4px 8px" }}
            >
              Aarav S (22CS101)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickDemo("23EC201")}
              style={{ fontSize: "0.75rem", padding: "4px 8px" }}
            >
              Rohan V (23EC201)
            </button>
          </div>
        </div>

        {/* Register Option Footer */}
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          New Student?{" "}
          <button
            type="button"
            onClick={onNavigateRegister}
            style={{
              background: "none",
              border: "none",
              color: "var(--primary-dark)",
              fontWeight: "700",
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline"
            }}
          >
            Register here
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        onResetSuccess={() => {
          setPassword("");
          setError("");
        }}
      />
    </div>
  );
};
