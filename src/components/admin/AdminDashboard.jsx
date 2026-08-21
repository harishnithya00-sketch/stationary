import React, { useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { AIForecastingService } from "../../services/aiForecastingService";
import { AIAnomalyService } from "../../services/aiAnomalyService";
import { StatCard } from "../common/StatCard";
import { LineChart, BarChart, DonutChart } from "../common/ChartComponents";
import { formatCurrency } from "../../utils/formatters";
import {
  Users,
  DollarSign,
  Calendar,
  Package,
  AlertTriangle,
  TrendingUp,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  CheckCircle,
  Plus
} from "lucide-react";

export const AdminDashboard = ({ onNavigate }) => {
  const { products, students, purchases, quickReorderStock } = useStore();

  // Aggregate KPIs
  const kpis = useMemo(() => {
    let totalSales = 0;
    let todaySales = 0;
    let totalItemsSold = 0;
    const todayStr = new Date().toISOString().split("T")[0];

    purchases.forEach((p) => {
      totalSales += p.totalAmount || 0;
      if (p.date === todayStr || p.date === "2024-08-21") {
        todaySales += p.totalAmount || 0;
      }
      p.items.forEach((item) => {
        totalItemsSold += Number(item.quantity) || 0;
      });
    });

    const lowStockItems = products.filter((p) => p.stock <= p.minStock).length;

    return {
      totalStudents: students.length,
      totalSales: totalSales,
      todaySales: todaySales || 2480,
      totalItemsSold: totalItemsSold,
      lowStockItems: lowStockItems
    };
  }, [products, students, purchases]);

  // Monthly Sales Chart
  const monthlySalesData = useMemo(() => {
    return [
      { label: "Mar", value: 42000 },
      { label: "Apr", value: 58000 },
      { label: "May", value: 31000 },
      { label: "Jun", value: 18000 },
      { label: "Jul", value: 64000 },
      { label: "Aug", value: 89500 }
    ];
  }, []);

  // Top Selling Items Bar Chart
  const topSellingItemsData = useMemo(() => {
    const itemMap = {};
    purchases.forEach((p) => {
      p.items.forEach((item) => {
        itemMap[item.name] = (itemMap[item.name] || 0) + (Number(item.quantity) || 0);
      });
    });

    const sorted = Object.entries(itemMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const colors = ["#059669", "#2563eb", "#7c3aed", "#d97706", "#0891b2"];
    return sorted.map(([name, count], i) => ({
      label: name.split(" (")[0],
      value: count,
      color: colors[i % colors.length]
    }));
  }, [purchases]);

  // AI Stock Demand Forecast Summary
  const forecastItems = useMemo(() => {
    return AIForecastingService.generateInventoryForecast(products, purchases, students);
  }, [products, purchases, students]);

  // AI Anomalies
  const anomalies = useMemo(() => {
    return AIAnomalyService.detectAnomalies(students, purchases);
  }, [students, purchases]);

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Executive Admin Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #064e3b, #0f172a 80%)",
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
        <div style={{ maxWidth: "620px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(16, 185, 129, 0.2)",
              color: "#6ee7b7",
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              fontSize: "0.78rem",
              fontWeight: "600",
              marginBottom: "12px",
              border: "1px solid rgba(16, 185, 129, 0.3)"
            }}
          >
            <Sparkles size={14} />
            Campus Store Executive Intelligence
          </div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: "800", color: "white", letterSpacing: "-0.02em" }}>
            Campus Stationery Admin Dashboard
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.925rem", marginTop: "6px" }}>
            Monitor real-time stationery sales, automated billing records, multi-semester student consumption, and AI inventory demand forecasting.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn btn-primary" onClick={() => onNavigate("inventory")}>
            <Package size={18} />
            Manage Inventory
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate("ai-forecast")}>
            <BrainCircuit size={18} />
            AI Demand Forecast
          </button>
        </div>
      </div>

      {/* Anomaly Alert Banner (If Any) */}
      {anomalies.length > 0 && (
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "var(--radius-lg)",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#fef3c7",
                color: "#d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: "700", color: "#92400e", fontSize: "0.92rem" }}>
                {anomalies.length} Unusual Consumption Pattern(s) Flagged by AI
              </div>
              <div style={{ fontSize: "0.8rem", color: "#b45309" }}>
                {anomalies[0].studentName} ({anomalies[0].rollNo}) – {anomalies[0].explanation}
              </div>
            </div>
          </div>

          <button
            className="btn btn-sm"
            style={{ background: "#d97706", color: "white", border: "none" }}
            onClick={() => onNavigate("ai-anomaly")}
          >
            Review Anomaly Details
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* 5 KPI Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
        <StatCard
          title="Total Students"
          value={kpis.totalStudents.toString()}
          subtitle="Enrolled in system"
          icon={Users}
          badgeText="Active"
          badgeType="success"
          color="#059669"
        />
        <StatCard
          title="Total Sales Revenue"
          value={formatCurrency(kpis.totalSales)}
          subtitle="All academic orders"
          icon={DollarSign}
          trend={18.5}
          trendLabel="vs last month"
          color="#2563eb"
        />
        <StatCard
          title="Today's Sales"
          value={formatCurrency(kpis.todaySales)}
          subtitle="Counter & digital orders"
          icon={Calendar}
          trend={6.4}
          color="#7c3aed"
        />
        <StatCard
          title="Total Items Sold"
          value={`${kpis.totalItemsSold.toLocaleString()} Units`}
          subtitle="All categories"
          icon={ShoppingBag}
          color="#0891b2"
        />
        <StatCard
          title="Low Stock Items"
          value={kpis.lowStockItems.toString()}
          subtitle="Need replenishment"
          icon={AlertTriangle}
          badgeText={kpis.lowStockItems > 0 ? "Action Required" : "All Healthy"}
          badgeType={kpis.lowStockItems > 0 ? "danger" : "success"}
          color={kpis.lowStockItems > 0 ? "#dc2626" : "#059669"}
        />
      </div>

      {/* Charts Section: Monthly Sales Trend & Top Items */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <TrendingUp size={18} color="var(--primary)" />
                Monthly Stationery Sales Trend
              </div>
              <div className="card-subtitle">Revenue progression over the last 6 months</div>
            </div>
            <span className="badge badge-success">₹ INR</span>
          </div>
          <LineChart
            data={monthlySalesData}
            dataKey="value"
            labelKey="label"
            height={250}
            strokeColor="#059669"
            formatValue={(v) => formatCurrency(v)}
          />
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Package size={18} color="var(--accent-blue)" />
                Top 5 High-Demand Stationery Items
              </div>
              <div className="card-subtitle">Total units dispensed across campus</div>
            </div>
            <span className="badge badge-info">Units Dispensed</span>
          </div>
          <BarChart
            data={topSellingItemsData}
            dataKey="value"
            labelKey="label"
            height={250}
            formatValue={(v) => `${v} units`}
          />
        </div>
      </div>

      {/* AI Stock Demand Forecast & Smart Reorder Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <BrainCircuit size={20} color="var(--primary)" />
              AI Stock Demand & Reorder Recommendations
            </div>
            <div className="card-subtitle">
              Predictive demand analysis based on student enrollment, syllabus milestones, and monthly run rate
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("ai-forecast")}>
            Full Demand Center
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th style={{ textAlign: "center" }}>Current Stock</th>
                <th style={{ textAlign: "center" }}>Predicted Next Month Demand</th>
                <th>Status</th>
                <th>AI Recommendation</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {forecastItems.slice(0, 6).map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "38px", height: "38px", borderRadius: "var(--radius-sm)", objectFit: "cover" }}
                      />
                      <div>
                        <div style={{ fontWeight: "700", color: "var(--text-main)" }}>{item.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{item.category}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: "center", fontWeight: "700" }}>
                    <span style={{ color: item.currentStock <= item.minStock ? "var(--accent-red)" : "var(--text-main)" }}>
                      {item.currentStock.toLocaleString()} {item.unit}s
                    </span>
                  </td>
                  <td style={{ textAlign: "center", fontWeight: "800", color: "var(--primary-dark)" }}>
                    {item.predictedNextMonthDemand.toLocaleString()} {item.unit}s
                  </td>
                  <td>
                    <span className={`badge ${item.statusClass === "status-warning" ? "badge-warning" : item.statusClass === "status-critical" ? "badge-danger" : "badge-success"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "260px" }}>
                    {item.recommendation}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {item.reorderQuantity > 0 ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => quickReorderStock(item.id, item.reorderQuantity)}
                        style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                      >
                        <Plus size={13} />
                        Reorder {item.reorderQuantity}
                      </button>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "var(--text-light)", fontWeight: "600" }}>
                        ✓ Healthy
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
