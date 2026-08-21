import React, { useEffect } from "react";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = "600px" }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade"
        style={{
          background: "#ffffff",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-xl)",
          width: "100%",
          maxWidth: maxWidth,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid var(--border-light)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between"
          }}
        >
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-main)" }}>
              {title}
            </h3>
            {subtitle && (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ width: "32px", height: "32px", border: "none", background: "var(--bg-card-subtle)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};
