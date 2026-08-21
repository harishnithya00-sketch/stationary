import React, { useState, useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { AIForecastingService } from "../../services/aiForecastingService";
import { formatCurrency } from "../../utils/formatters";
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Package,
  TrendingUp,
  Plus,
  RefreshCw,
  Info,
  Clock,
  ArrowRight
} from "lucide-react";

export const AIStockForecasting = () => {
  const { products, purchases, students, quickReorderStock } = useStore();

  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'low', 'healthy', 'critical'
  const [search, setSearch] = useState("");

  const forecastItems = useMemo(() => {
    return AIForecastingService.generateInventoryForecast(products, purchases, students);
  }, [products, purchases, students]);

  const filteredItems = useMemo(() => {
    return forecastItems.filter((item) => {
      if (statusFilter === "low" && item.status !== "Low Stock Risk") return false;
      if (statusFilter === "critical" && item.status !== "Out of Stock") return false;
      if (statusFilter === "healthy" && (item.status === "Low Stock Risk" || item.status === "Out of Stock")) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [forecastItems, statusFilter, search]);

  const criticalRisksCount = forecastItems.filter((i) => i.status === "Low Stock Risk" || i.status === "Out of Stock").length;
  const totalRecommendedOrders = forecastItems.reduce((sum, i) => sum + i.reorderQuantity, 0);

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Header Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #064e3b, #047857 50%, #0f766e)",
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
            <BrainCircuit size={15} color="#a7f3d0" />
            AI Multi-Factor Demand Forecasting
          </div>

          <h1 style={{ fontSize: "1.85rem", fontWeight: "800", color: "white", letterSpacing: "-0.02em" }}>
            AI Stock Forecasting & Reorder Center
          </h1>
          <p style={{ color: "#d1fae5", fontSize: "0.925rem", marginTop: "6px", lineHeight: 1.5 }}>
            Automated stock requirement projections calculated using student consumption rates, upcoming university exam schedules, and department laboratory schedules.
          </p>
        </div>

        {/* Highlight Card */}
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
          <div style={{ fontSize: "0.75rem", color: "#a7f3d0", fontWeight: "600", textTransform: "uppercase" }}>
            Stock Health Risk
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#ffffff", marginTop: "2px" }}>
            {criticalRisksCount} Items
          </div>
          <div style={{ fontSize: "0.75rem", color: "#fef3c7", fontWeight: "600", marginTop: "4px" }}>
            {criticalRisksCount > 0 ? "⚠ Low Stock Risks Detected" : "✓ All Products Healthy"}
          </div>
        </div>
      </div>

      {/* Concrete Requirement Example Spotlight Card */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #f0fdf4, #ffffff)",
          border: "1px solid var(--primary-border)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span className="badge badge-warning" style={{ marginBottom: "8px" }}>
              High-Priority Reorder Example
            </span>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)" }}>
              A4 Copier Sheets (75 GSM)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Current stock velocity indicates inventory depletion within ~22 days based on upcoming term reports.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => quickReorderStock("prod-1", 1000)}
          >
            <Plus size={16} />
            Execute AI Recommended Reorder (+1,000 Sheets)
          </button>
        </div>

        {/* 4 Stat Boxes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginTop: "20px" }}>
          <div style={{ background: "white", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Current Available Stock</div>
            <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)", marginTop: "2px" }}>
              850 <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>sheets</span>
            </div>
          </div>

          <div style={{ background: "white", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Average Monthly Usage</div>
            <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)", marginTop: "2px" }}>
              1,100 <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>sheets</span>
            </div>
          </div>

          <div style={{ background: "white", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Predicted Next Month Demand</div>
            <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--primary-dark)", marginTop: "2px" }}>
              1,500 <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>sheets</span>
            </div>
          </div>

          <div style={{ background: "white", padding: "14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>AI Stock Status</div>
            <div style={{ marginTop: "4px" }}>
              <span className="badge badge-warning" style={{ fontSize: "0.85rem", padding: "4px 10px" }}>
                Low Stock Risk
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px"
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: "340px" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search forecasted product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {[
            { id: "all", label: "All Items" },
            { id: "low", label: "Low Stock Risks" },
            { id: "critical", label: "Out of Stock" },
            { id: "healthy", label: "Healthy Buffer" }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setStatusFilter(btn.id)}
              className={`btn btn-sm ${statusFilter === btn.id ? "btn-dark" : "btn-secondary"}`}
              style={{ fontSize: "0.8rem", padding: "6px 12px" }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Full Forecasting Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Stationery Item</th>
                <th style={{ textAlign: "center" }}>Current Stock</th>
                <th style={{ textAlign: "center" }}>Avg Monthly Usage</th>
                <th style={{ textAlign: "center" }}>Predicted Next Month Demand</th>
                <th>Status Indicator</th>
                <th>AI Reorder Recommendation</th>
                <th style={{ textAlign: "right" }}>Reorder Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "42px", height: "42px", borderRadius: "var(--radius-md)", objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ fontWeight: "700", color: "var(--text-main)" }}>{item.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {item.category} • Model Confidence: {item.confidence}%
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: "800", color: item.currentStock <= item.minStock ? "var(--accent-red)" : "var(--text-main)" }}>
                      {item.currentStock.toLocaleString()}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                      Min: {item.minStock} {item.unit}s
                    </div>
                  </td>
                  <td style={{ textAlign: "center", fontWeight: "600", color: "var(--text-muted)" }}>
                    {item.avgMonthlyUsage.toLocaleString()} {item.unit}s
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: "800", color: "var(--primary-dark)", fontSize: "1.05rem" }}>
                      {item.predictedNextMonthDemand.toLocaleString()} {item.unit}s
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        item.status === "Out of Stock"
                          ? "badge-danger"
                          : item.status === "Low Stock Risk"
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                      style={{ fontWeight: "700", padding: "4px 10px" }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "280px", lineHeight: 1.4 }}>
                    {item.recommendation}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {item.reorderQuantity > 0 ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => quickReorderStock(item.id, item.reorderQuantity)}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <Plus size={14} />
                        Order +{item.reorderQuantity.toLocaleString()}
                      </button>
                    ) : (
                      <span style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: "700" }}>
                        ✓ Sufficient
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
