import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { DEPARTMENTS } from "../../data/initialStudents";
import {
  GraduationCap,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  User,
  Mail,
  Lock,
  Building,
  Calendar,
  Layers
} from "lucide-react";

export const StudentRegister = ({ onNavigateLogin, onBackToLanding }) => {
  const { studentRegister } = useAuth();

  const [formData, setFormData] = useState({
    student_name: "",
    registration_number: "",
    email: "",
    department: "Information Technology",
    year: "2",
    semester: 3,
    section: "A",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Email format validator
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Student Name validation
    if (!formData.student_name.trim()) {
      setError("Please enter your Student Name.");
      return;
    }

    // 2. Registration Number validation
    if (!formData.registration_number.trim()) {
      setError("Please enter your Registration Number.");
      return;
    }

    // 3. Email validation
    if (!formData.email.trim()) {
      setError("Please enter your Email address.");
      return;
    }
    if (!isValidEmail(formData.email.trim())) {
      setError("Please enter a valid email address (e.g. student@nandha.edu.in).");
      return;
    }

    // 4. Department, Year, Semester validation
    if (!formData.department) {
      setError("Department is required.");
      return;
    }
    if (!formData.year) {
      setError("Year is required.");
      return;
    }
    if (!formData.semester) {
      setError("Semester is required.");
      return;
    }

    // 5. Password validation
    if (!formData.password) {
      setError("Please enter a Password.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await studentRegister({
        student_name: formData.student_name.trim(),
        name: formData.student_name.trim(),
        registration_number: formData.registration_number.trim().toUpperCase(),
        rollNo: formData.registration_number.trim().toUpperCase(),
        email: formData.email.trim().toLowerCase(),
        department: formData.department,
        deptCode: formData.department.split(" ").map(w => w[0]).join("").slice(0, 4),
        year: formData.year.toString(),
        semester: Number(formData.semester),
        section: (formData.section || "A").toUpperCase(),
        phone: formData.phone || "+91 98450 00000",
        password: formData.password
      });
    } catch (err) {
      setError(err.message || "Failed to create account. Please check your information.");
    } finally {
      setIsLoading(false);
    }
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
        padding: "32px 16px"
      }}
    >
      {/* Top back button */}
      <div style={{ width: "100%", maxWidth: "560px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={onBackToLanding}
          className="btn btn-secondary btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.8rem" }}
        >
          <ChevronLeft size={16} />
          Back to Home
        </button>

        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          Already registered?{" "}
          <button
            onClick={onNavigateLogin}
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
            Login here
          </button>
        </span>
      </div>

      {/* Main Registration Card */}
      <div
        className="card animate-fade"
        style={{
          width: "100%",
          maxWidth: "560px",
          padding: "36px 32px",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-xl)",
          border: "1px solid var(--border-light)",
          background: "#ffffff"
        }}
      >
        {/* Header Branding */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              boxShadow: "var(--shadow-green)"
            }}
          >
            <GraduationCap size={28} />
          </div>

          <h2 style={{ fontSize: "1.45rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            Student Registration
          </h2>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
            Nandha Engineering College • Create your stationery account
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Row 1: Student Name & Registration Number */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Student Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Harish V"
                value={formData.student_name}
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Registration Number *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. 24IT101"
                value={formData.registration_number}
                onChange={(e) => setFormData({ ...formData, registration_number: e.target.value.toUpperCase() })}
                style={{ fontFamily: "var(--font-mono)", fontWeight: "600", textTransform: "uppercase" }}
              />
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">College Email *</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="e.g. harish@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g. +91 98450 12345"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Row 3: Department */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Department *</label>
            <select
              className="form-select"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              {DEPARTMENTS.filter(d => d !== "All Departments").map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Row 4: Year, Semester, Section */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Year *</label>
              <select
                className="form-select"
                value={formData.year}
                onChange={(e) => {
                  const yr = e.target.value;
                  const defaultSem = yr === "1" ? 1 : yr === "2" ? 3 : yr === "3" ? 5 : 7;
                  setFormData({ ...formData, year: yr, semester: defaultSem });
                }}
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Semester *</label>
              <select
                className="form-select"
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Section</label>
              <select
                className="form-select"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              >
                <option value="A">Sec A</option>
                <option value="B">Sec B</option>
                <option value="C">Sec C</option>
              </select>
            </div>
          </div>

          {/* Row 5: Password & Confirm Password */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password (min 6 chars) *</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-dark btn-lg"
            disabled={isLoading}
            style={{ width: "100%", marginTop: "10px", gap: "8px" }}
          >
            {isLoading ? (
              <span>Creating Student Account...</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <button
            type="button"
            onClick={onNavigateLogin}
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
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};
