import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel = "vs last sem",
  badgeText,
  badgeType = "success",
  color = "var(--primary)"
}) => {
  const isPositive = trend >= 0;

  return (
    <div className="card card-hoverable" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: "0.82rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {title}
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--text-main)", marginTop: "6px", letterSpacing: "-0.02em" }}>
            {value}
          </div>
        </div>

        {Icon && (
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-md)",
              backgroundColor: `${color}15`,
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--border-light)" }}>
        {trend !== undefined ? (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "2px",
                fontWeight: "700",
                color: isPositive ? "var(--primary)" : "var(--accent-amber)"
              }}
            >
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isPositive ? `+${trend}%` : `${trend}%`}
            </span>
            <span style={{ color: "var(--text-muted)" }}>{trendLabel}</span>
          </div>
        ) : subtitle ? (
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{subtitle}</div>
        ) : <div />}

        {badgeText && (
          <span className={`badge badge-${badgeType}`} style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};
