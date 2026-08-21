import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { DEPARTMENTS } from "../../data/initialStudents";
import { Modal } from "../common/Modal";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  Layers,
  Edit2,
  Lock,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  BrainCircuit,
  KeyRound
} from "lucide-react";

export const StudentProfile = () => {
  const { currentStudent, studentUpdateProfile, studentLogout } = useAuth();
  const { purchases, setActiveBillModal } = useStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    student_name: "",
    email: "",
    department: "",
    year: "",
    semester: 1,
    section: "A",
    phone: "",
    newPassword: ""
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const studentPurchases = purchases.filter(
    (p) =>
      (p.registration_number && p.registration_number === (currentStudent?.registration_number || currentStudent?.rollNo)) ||
      p.studentId === currentStudent?.id ||
      p.rollNo === currentStudent?.rollNo
  );

  const handleOpenEdit = () => {
    if (!currentStudent) return;
    setEditData({
      student_name: currentStudent.student_name || currentStudent.name || "",
      email: currentStudent.email || "",
      department: currentStudent.department || "Information Technology",
      year: currentStudent.year || "2",
      semester: currentStudent.semester || 3,
      section: currentStudent.section || "A",
      phone: currentStudent.phone || "",
      newPassword: ""
    });
    setSaveError("");
    setSaveSuccess(false);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveError("");

    if (!editData.student_name.trim()) {
      setSaveError("Student Name cannot be empty.");
      return;
    }
    if (!editData.email.trim()) {
      setSaveError("Email cannot be empty.");
      return;
    }
    if (editData.newPassword && editData.newPassword.length < 6) {
      setSaveError("New password must be at least 6 characters.");
      return;
    }

    try {
      await studentUpdateProfile({
        student_name: editData.student_name.trim(),
        name: editData.student_name.trim(),
        email: editData.email.trim().toLowerCase(),
        department: editData.department,
        deptCode: editData.department.split(" ").map(w => w[0]).join("").slice(0, 4),
        year: editData.year,
        semester: Number(editData.semester),
        section: editData.section.toUpperCase(),
        phone: editData.phone,
        ...(editData.newPassword ? { newPassword: editData.newPassword } : {})
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSaveSuccess(false);
      }, 1000);
    } catch (err) {
      setSaveError(err.message || "Failed to update profile.");
    }
  };

  if (!currentStudent) return null;

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "1.65rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            Student Profile & Account Settings
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "2px" }}>
            Manage your official credentials, academic enrolment details, and secure login settings
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-primary" onClick={handleOpenEdit}>
            <Edit2 size={16} />
            Edit Profile
          </button>
          <button className="btn btn-danger" onClick={studentLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Profile Info Card */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #ffffff, #f0fdf4)",
          border: "1px solid var(--primary-border)",
          padding: "32px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px", marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: currentStudent.avatarColor || "var(--primary)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "1.8rem",
                boxShadow: "var(--shadow-md)"
              }}
            >
              {(currentStudent.student_name || currentStudent.name || "S").charAt(0)}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--text-main)" }}>
                  {currentStudent.student_name || currentStudent.name}
                </h2>
                <span className="badge badge-success">Active Enrolled Student</span>
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Nandha Engineering College • {currentStudent.department}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "white",
              padding: "12px 20px",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-light)",
              textAlign: "right"
            }}
          >
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase" }}>
              Unique Registration Number
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--primary-dark)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
              {currentStudent.registration_number || currentStudent.rollNo}
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--accent-amber)", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end", marginTop: "2px" }}>
              <Lock size={11} />
              Permanent Unique Identifier
            </div>
          </div>
        </div>

        {/* 6 Key Profile Fields Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            padding: "20px",
            background: "white",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-light)"
          }}
        >
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>Student Full Name</div>
            <div style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-main)", marginTop: "2px" }}>
              {currentStudent.student_name || currentStudent.name}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>Registration Number</div>
            <div style={{ fontSize: "1rem", fontWeight: "700", color: "var(--primary-dark)", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
              {currentStudent.registration_number || currentStudent.rollNo}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>College Email</div>
            <div style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-main)", marginTop: "2px" }}>
              {currentStudent.email}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>Department</div>
            <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", marginTop: "2px" }}>
              {currentStudent.department}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>Current Year & Semester</div>
            <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", marginTop: "2px" }}>
              Year {currentStudent.year} • Semester {currentStudent.semester}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>Assigned Section</div>
            <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", marginTop: "2px" }}>
              Section {currentStudent.section || "A"}
            </div>
          </div>
        </div>
      </div>

      {/* Account Security & Privacy Isolation Notice */}
      <div
        className="card"
        style={{
          background: "#f8fafc",
          border: "1px solid var(--border-light)",
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "var(--radius-md)",
            background: "var(--primary-subtle)",
            color: "var(--primary-dark)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <ShieldCheck size={24} />
        </div>
        <div>
          <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.95rem" }}>
            Student Data Isolation & Security Active
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px", lineHeight: 1.4 }}>
            Your account is locked to Registration Number <strong>{currentStudent.registration_number || currentStudent.rollNo}</strong>. You can only view your own bills, purchase history, and personalized AI consumption predictions.
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student Profile"
        subtitle="Update permitted profile and academic enrolment information"
        maxWidth="560px"
      >
        {saveError && (
          <div
            style={{
              padding: "10px 14px",
              background: "var(--accent-red-light)",
              border: "1px solid #fecaca",
              borderRadius: "var(--radius-md)",
              color: "var(--accent-red)",
              fontSize: "0.85rem",
              marginBottom: "16px"
            }}
          >
            {saveError}
          </div>
        )}

        {saveSuccess && (
          <div
            style={{
              padding: "10px 14px",
              background: "var(--primary-subtle)",
              border: "1px solid var(--primary-border)",
              borderRadius: "var(--radius-md)",
              color: "var(--primary-dark)",
              fontSize: "0.85rem",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <CheckCircle2 size={16} />
            <span>Profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Registration Number Disabled / Locked Notice */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Registration Number</span>
              <span className="badge badge-warning" style={{ fontSize: "0.68rem" }}>
                <Lock size={10} /> Unique ID (Non-editable)
              </span>
            </label>
            <input
              type="text"
              disabled
              className="form-input"
              value={currentStudent.registration_number || currentStudent.rollNo}
              style={{ background: "var(--bg-card-subtle)", color: "var(--text-muted)", cursor: "not-allowed", fontFamily: "var(--font-mono)" }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Student Name *</label>
            <input
              type="text"
              required
              className="form-input"
              value={editData.student_name}
              onChange={(e) => setEditData({ ...editData, student_name: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">College Email *</label>
              <input
                type="email"
                required
                className="form-input"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91..."
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Department *</label>
            <select
              className="form-select"
              value={editData.department}
              onChange={(e) => setEditData({ ...editData, department: e.target.value })}
            >
              {DEPARTMENTS.filter(d => d !== "All Departments").map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Year</label>
              <select
                className="form-select"
                value={editData.year}
                onChange={(e) => setEditData({ ...editData, year: e.target.value })}
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Semester</label>
              <select
                className="form-select"
                value={editData.semester}
                onChange={(e) => setEditData({ ...editData, semester: Number(e.target.value) })}
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
                value={editData.section}
                onChange={(e) => setEditData({ ...editData, section: e.target.value })}
              >
                <option value="A">Sec A</option>
                <option value="B">Sec B</option>
                <option value="C">Sec C</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Change Password (leave blank to keep current)</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter new password (optional)"
              value={editData.newPassword}
              onChange={(e) => setEditData({ ...editData, newPassword: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "14px" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Profile Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
