import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { MLPredictionService } from "../../services/mlPredictionService";
import { ComparisonBarChart } from "../common/ChartComponents";
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Cpu,
  Info,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight
} from "lucide-react";

export const AIConsumptionView = () => {
  const { currentStudent } = useAuth();
  const { purchases, products } = useStore();

  const prediction = useMemo(() => {
    return MLPredictionService.predictStudentConsumption(currentStudent, purchases, products);
  }, [currentStudent, purchases, products]);

  if (!prediction) return null;

  const sName = currentStudent?.student_name || currentStudent?.name || "Harish V";
  const sReg = currentStudent?.registration_number || currentStudent?.rollNo || "24IT101";

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e1b4b, #312e81 50%, #4338ca)",
          borderRadius: "var(--radius-xl)",
          padding: "32px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          boxShadow: "var(--shadow-xl)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "relative", zIndex: 2, maxWidth: "680px" }}>
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
            <BrainCircuit size={15} color="#a5b4fc" />
            Nandha Engineering College • AI Prediction Engine
          </div>

          <h1 style={{ fontSize: "1.85rem", fontWeight: "800", color: "white", letterSpacing: "-0.02em" }}>
            AI Consumption Prediction
          </h1>
          <p style={{ color: "#e0e7ff", fontSize: "0.925rem", marginTop: "6px", lineHeight: 1.6 }}>
            Personalized predictive demand modeling for <strong>{sName}</strong> (<span style={{ fontFamily: "var(--font-mono)" }}>{sReg}</span>) based on historical semester purchasing patterns and upcoming laboratory coursework.
          </p>
        </div>

        {/* Prediction Confidence Card */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            background: "rgba(255, 255, 255, 0.12)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(12px)",
            borderRadius: "var(--radius-lg)",
            padding: "20px 24px",
            minWidth: "200px",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "#c7d2fe", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Model Accuracy
          </div>
          <div style={{ fontSize: "2.2rem", fontWeight: "800", color: "#ffffff", marginTop: "4px" }}>
            {prediction.confidenceScore}%
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#86efac", fontSize: "0.75rem", fontWeight: "700", marginTop: "2px" }}>
            <CheckCircle2 size={13} />
            Prediction Confidence: {prediction.confidenceScore}%
          </div>
        </div>
      </div>

      {/* Natural Language AI Insight Card */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #ecfdf5, #ffffff)",
          border: "1px solid var(--primary-border)"
        }}
      >
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-md)",
              background: "var(--primary)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 10px rgba(5,150,105,0.25)"
            }}
          >
            <Sparkles size={22} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--primary-dark)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              AI Prediction Analysis & Forecast Summary
            </div>
            <p style={{ fontSize: "1rem", color: "var(--text-main)", fontWeight: "500", marginTop: "6px", lineHeight: 1.6 }}>
              "{prediction.explanation}"
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px", fontSize: "0.78rem", color: "var(--text-muted)" }}>
              <span><strong>Student:</strong> {sName} ({sReg})</span>
              <span>•</span>
              <span><strong>Algorithm:</strong> Linear Regression + Curriculum Weighting v2.4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Comparison Section: Previous Semester vs Predicted Next Semester */}
      <div className="grid-2">
        {/* Comparison Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <TrendingUp size={18} color="var(--primary)" />
                Historical vs AI Predicted Consumption
              </div>
              <div className="card-subtitle">
                Comparing Semester {prediction.currentSemester} baseline with forecasted Semester {prediction.nextSemester} demand
              </div>
            </div>
          </div>

          <ComparisonBarChart data={prediction.predictions} />
        </div>

        {/* Prediction Table with Percentage Shift */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Forecasted Stationery Breakdown</div>
              <div className="card-subtitle">Detailed item quantities and projected demand shifts</div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style={{ textAlign: "center" }}>Previous Sem</th>
                  <th style={{ textAlign: "center" }}>AI Predicted Next Sem</th>
                  <th style={{ textAlign: "right" }}>Expected Shift</th>
                </tr>
              </thead>
              <tbody>
                {prediction.predictions.map((p, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: "700", color: "var(--text-main)" }}>{p.item}</div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Unit: {p.unit}</div>
                    </td>
                    <td style={{ textAlign: "center", fontWeight: "600", color: "var(--text-muted)" }}>
                      {p.previousSemesterQty} {p.unit}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        style={{
                          fontWeight: "800",
                          color: "var(--primary-dark)",
                          fontSize: "1rem",
                          background: "var(--primary-subtle)",
                          padding: "4px 10px",
                          borderRadius: "var(--radius-sm)"
                        }}
                      >
                        {p.predictedNextSemesterQty} {p.unit}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span
                        className={`badge ${p.percentageIncrease >= 0 ? "badge-success" : "badge-neutral"}`}
                        style={{ fontWeight: "700" }}
                      >
                        {p.percentageIncrease >= 0 ? `+${p.percentageIncrease}%` : `${p.percentageIncrease}%`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
