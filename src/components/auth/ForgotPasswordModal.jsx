import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Database } from "../../data/database";
import { hashPassword } from "../../utils/crypto";
import { KeyRound, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export const ForgotPasswordModal = ({ isOpen, onClose, onResetSuccess }) => {
  const [regNo, setRegNo] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!regNo.trim()) {
      setError("Please enter your Registration Number.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your registered college email.");
      return;
    }
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const student = Database.getStudentByRegNo(regNo.trim().toUpperCase());
      if (!student || student.email.toLowerCase() !== email.trim().toLowerCase()) {
        setError("No registered student matches this Registration Number and Email combination.");
        setIsSubmitting(false);
        return;
      }

      const pHash = await hashPassword(newPassword);
      Database.updateStudentProfile(student.registration_number || student.rollNo, {
        password_hash: pHash
      });

      setSuccessMsg("Password reset successfully! You can now log in with your new password.");
      setTimeout(() => {
        onClose();
        if (onResetSuccess) onResetSuccess();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Student Account Password"
      subtitle="Verify your Registration Number and email to set a new password"
      maxWidth="480px"
    >
      {error && (
        <div
          style={{
            padding: "10px 14px",
            background: "var(--accent-red-light)",
            border: "1px solid #fecaca",
            borderRadius: "var(--radius-md)",
            color: "var(--accent-red)",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px"
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div
          style={{
            padding: "10px 14px",
            background: "var(--primary-subtle)",
            border: "1px solid var(--primary-border)",
            borderRadius: "var(--radius-md)",
            color: "var(--primary-dark)",
            fontSize: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px"
          }}
        >
          <CheckCircle2 size={16} color="var(--primary)" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Registration Number *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. 24IT101"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value.toUpperCase())}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Registered College Email *</label>
          <input
            type="email"
            className="form-input"
            placeholder="e.g. harish@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">New Password (min 6 characters) *</label>
          <input
            type="password"
            className="form-input"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Confirm New Password *</label>
          <input
            type="password"
            className="form-input"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
