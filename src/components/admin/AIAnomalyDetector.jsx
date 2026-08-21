import React, { useMemo, useState } from "react";
import { useStore } from "../../context/StoreContext";
import { AIAnomalyService } from "../../services/aiAnomalyService";
import {
  AlertTriangle,
  BrainCircuit,
  Search,
  CheckCircle,
  HelpCircle,
  Eye,
  Building,
  User,
  Layers,
  ArrowRight
} from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export const AIAnomalyDetector = () => {
  const { students, purchases } = useStore();
  const [selectedDept, setSelectedDept] = useState("All");
  const [resolvedIds, setResolvedIds] = useState(new Set());

  const anomalies = useMemo(() => {
    return AIAnomalyService.detectAnomalies(students, purchases);
  }, [students, purchases]);

  const filteredAnomalies = useMemo(() => {
    return anomalies.filter((a) => {
      if (selectedDept !== "All" && a.department !== selectedDept) return false;
      return true;
    });
  }, [anomalies, selectedDept]);

  const handleResolve = (id) => {
    setResolvedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #78350f, #92400e 50%, #b45309)",
          borderRadius: "var(--radius-xl)",
          padding: "32px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          boxShadow: "var(--shadow-xl)"
        }}
      >
        <div style={{ maxWidth: "660px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.15)",
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: "600",
              marginBottom: "12px",
              backdropFilter: "blur(6px)"
            }}
          >
            <BrainCircuit size={15} color="#fef3c7" />
            AI Statistical Outlier & Dispersion Model
          </div>

          <h1 style={{ fontSize: "1.85rem", fontWeight: "800", color: "white", letterSpacing: "-0.02em" }}>
            Unusual Consumption Pattern Detection
          </h1>
          <p style={{ color: "#fef3c7", fontSize: "0.925rem", marginTop: "6px", lineHeight: 1.5 }}>
            Automated scanning engine identifying significant deviations from department baseline consumption distributions. Uses neutral heuristics to flag bulk purchasing surges.
          </p>
        </div>

        {/* Flag count card */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            borderRadius: "var(--radius-lg)",
            padding: "20px 24px",
            minWidth: "200px",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "#fef3c7", fontWeight: "600", textTransform: "uppercase" }}>
            Active AI Flags
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#ffffff", marginTop: "2px" }}>
            {anomalies.length} Flagged
          </div>
          <div style={{ fontSize: "0.75rem", color: "#fef3c7", marginTop: "4px" }}>
            {resolvedIds.size} Marked Reviewed
          </div>
        </div>
      </div>

      {/* Concrete Requirement Example Box */}
      <div
        className="card"
        style={{
          background: "#fffbeb",
          border: "1px solid #fde68a"
        }}
      >
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius-md)",
              background: "#f59e0b",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <AlertTriangle size={24} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#92400e" }}>
                ⚠ Unusual Consumption Detected
              </span>
              <span className="badge badge-warning">A4 Paper Consumption Spike</span>
            </div>

            <p style={{ fontSize: "0.925rem", color: "#78350f", marginTop: "6px", lineHeight: 1.6 }}>
              "The student's current consumption is significantly higher than their historical and department cohort average."
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                marginTop: "16px",
                padding: "12px",
                background: "white",
                borderRadius: "var(--radius-md)",
                border: "1px solid #fde68a"
              }}
            >
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Normal Benchmark Range
                </div>
                <div style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-main)", marginTop: "2px" }}>
                  100 – 200 sheets / month
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Detected Consumption Rate
                </div>
                <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--accent-red)", marginTop: "2px" }}>
                  650 sheets / month
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Variance / Deviation
                </div>
                <div style={{ fontSize: "1rem", fontWeight: "700", color: "#d97706", marginTop: "2px" }}>
                  +330% Above Median
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Anomalies List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)" }}>
          Detected Outliers Requiring Store Verification ({filteredAnomalies.length})
        </h3>

        {filteredAnomalies.map((anom) => {
          const isResolved = resolvedIds.has(anom.id);

          return (
            <div
              key={anom.id}
              className="card"
              style={{
                border: isResolved ? "1px solid var(--border-light)" : "1px solid #fde68a",
                background: isResolved ? "#f8fafc" : "#ffffff",
                opacity: isResolved ? 0.75 : 1
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-main)" }}>
                      {anom.studentName}
                    </h4>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600", color: "var(--primary-dark)", fontSize: "0.85rem" }}>
                      ({anom.rollNo})
                    </span>
                    <span className="badge badge-neutral">
                      {anom.department} • Sem {anom.semester}
                    </span>
                    {isResolved ? (
                      <span className="badge badge-success">✓ Verified / Dismissed</span>
                    ) : (
                      <span className="badge badge-warning">⚠ Pattern Under Review</span>
                    )}
                  </div>

                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "6px" }}>
                    Item Flagged: <strong>{anom.itemCategory}</strong> • Period: {anom.detectedDate}
                  </div>
                </div>

                <button
                  className={`btn btn-sm ${isResolved ? "btn-secondary" : "btn-subtle"}`}
                  onClick={() => handleResolve(anom.id)}
                >
                  <CheckCircle size={14} />
                  {isResolved ? "Mark as Active Flag" : "Mark as Verified (Club/Project Bulk)"}
                </button>
              </div>

              {/* Anomaly Metrics Comparison Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                  margin: "16px 0",
                  padding: "14px",
                  background: "var(--bg-card-subtle)",
                  borderRadius: "var(--radius-md)"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Cohort Baseline (Normal)</div>
                  <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.95rem", marginTop: "2px" }}>
                    {anom.normalBenchmark}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Current Student Velocity</div>
                  <div style={{ fontWeight: "800", color: "var(--accent-red)", fontSize: "1.05rem", marginTop: "2px" }}>
                    {anom.detectedRate}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Statistical Variance</div>
                  <div style={{ fontWeight: "700", color: "#d97706", fontSize: "0.95rem", marginTop: "2px" }}>
                    {anom.deviation}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.5 }}>
                <strong>AI Explanation:</strong> {anom.explanation}
              </div>

              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                <HelpCircle size={14} color="var(--primary)" />
                <span><strong>Suggested Action:</strong> {anom.suggestedAction}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
