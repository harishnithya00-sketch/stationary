import React from "react";
import { useNotification } from "../../context/NotificationContext";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export const Toast = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "380px",
        width: "calc(100% - 48px)",
        pointerEvents: "none"
      }}
    >
      {toasts.map((toast) => {
        let bg = "white";
        let borderColor = "var(--border-light)";
        let iconColor = "var(--primary)";
        let Icon = CheckCircle2;

        if (toast.type === "error") {
          borderColor = "#fecaca";
          iconColor = "var(--accent-red)";
          Icon = AlertCircle;
        } else if (toast.type === "warning") {
          borderColor = "#fde68a";
          iconColor = "var(--accent-amber)";
          Icon = AlertTriangle;
        } else if (toast.type === "info") {
          borderColor = "#bae6fd";
          iconColor = "var(--accent-blue)";
          Icon = Info;
        }

        return (
          <div
            key={toast.id}
            className="animate-fade"
            style={{
              pointerEvents: "auto",
              background: bg,
              borderRadius: "var(--radius-lg)",
              border: `1px solid ${borderColor}`,
              boxShadow: "var(--shadow-xl)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px"
            }}
          >
            <div style={{ marginTop: "2px", flexShrink: 0 }}>
              <Icon size={18} color={iconColor} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && (
                <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "2px" }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-light)",
                cursor: "pointer",
                padding: "2px",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                alignItems: "center"
              }}
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
