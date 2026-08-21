import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { MLPredictionService } from "../../services/mlPredictionService";
import { AIRecommendationService } from "../../services/aiRecommendationService";
import { StatCard } from "../common/StatCard";
import { LineChart, BarChart } from "../common/ChartComponents";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  Wallet,
  ShoppingBag,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  Receipt,
  BrainCircuit,
  Store,
  FileText,
  User,
  IdCard
} from "lucide-react";

export const StudentDashboard = ({ onNavigate }) => {
  const { currentStudent } = useAuth();
  const { purchases, products, setActiveBillModal, addToCart } = useStore();

  const studentPurchases = useMemo(() => {
    if (!currentStudent) return [];
    const regNo = (currentStudent.registration_number || currentStudent.rollNo || "").toUpperCase();
    return purchases.filter(
      (p) =>
        (p.registration_number && p.registration_number.toUpperCase() === regNo) ||
        (p.rollNo && p.rollNo.toUpperCase() === regNo) ||
        p.studentId === currentStudent.id ||
        p.studentId === currentStudent.student_id
    );
  }, [purchases, currentStudent]);

  // Student Identity Data
  const studentName = currentStudent?.student_name || currentStudent?.name || "Harish V";
  const firstName = studentName.split(" ")[0];
  const registrationNumber = currentStudent?.registration_number || currentStudent?.rollNo || "24IT101";

  // Aggregate Metrics
  const stats = useMemo(() => {
    let totalSpent = 0;
    let itemsPurchased = 0;
    let currentSemSpent = 0;
    const itemCounts = {};

    studentPurchases.forEach((p) => {
      totalSpent += p.totalAmount || 0;
      if (p.semester === currentStudent?.semester) {
        currentSemSpent += p.totalAmount || 0;
      }
      p.items.forEach((item) => {
        const qty = Number(item.quantity) || 0;
        itemsPurchased += qty;
        itemCounts[item.name] = (itemCounts[item.name] || 0) + qty;
      });
    });

    let mostUsed = "A4 Copier Sheets";
    let maxCount = 0;
    Object.entries(itemCounts).forEach(([name, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostUsed = name;
      }
    });

    return {
      totalSpent: totalSpent || 2180,
      itemsPurchased: itemsPurchased || 215,
      currentSemSpent: currentSemSpent || 540,
      mostUsed: mostUsed.split(" (")[0]
    };
  }, [studentPurchases, currentStudent]);

  // Semester Spending Chart Data (Semesters 1 to 8)
  const semesterChartData = useMemo(() => {
    const semMap = {
      "Sem 1": 420,
      "Sem 2": 580,
      "Sem 3": 540,
      "Sem 4": 0,
      "Sem 5": 0,
      "Sem 6": 0,
      "Sem 7": 0,
      "Sem 8": 0
    };

    studentPurchases.forEach((p) => {
      const key = `Sem ${p.semester || 1}`;
      if (semMap[key] !== undefined) {
        semMap[key] += p.totalAmount || 0;
      }
    });

    return Object.entries(semMap).map(([label, value]) => ({
      label,
      value
    }));
  }, [studentPurchases]);

  // Category Consumption Bar Chart Data
  const consumptionChartData = useMemo(() => {
    const categories = [
      { label: "A4 Sheets", count: 0, color: "#059669" },
      { label: "Pens", count: 0, color: "#2563eb" },
      { label: "Pencils", count: 0, color: "#7c3aed" },
      { label: "Records", count: 0, color: "#d97706" },
      { label: "Files", count: 0, color: "#0891b2" },
      { label: "Notebooks", count: 0, color: "#db2777" }
    ];

    studentPurchases.forEach((p) => {
      p.items.forEach((item) => {
        const name = (item.name || "").toLowerCase();
        const qty = Number(item.quantity) || 0;
        if (name.includes("a4") || name.includes("copier")) categories[0].count += qty;
        else if (name.includes("pen") && !name.includes("pencil")) categories[1].count += qty;
        else if (name.includes("pencil")) categories[2].count += qty;
        else if (name.includes("record") || name.includes("observation")) categories[3].count += qty;
        else if (name.includes("file") || name.includes("folder")) categories[4].count += qty;
        else if (name.includes("notebook")) categories[5].count += qty;
      });
    });

    if (categories.every((c) => c.count === 0)) {
      categories[0].count = 180;
      categories[1].count = 12;
      categories[2].count = 4;
      categories[3].count = 5;
      categories[4].count = 6;
      categories[5].count = 4;
    }

    return categories.map((c) => ({
      label: c.label,
      value: c.count,
      color: c.color
    }));
  }, [studentPurchases]);

  // AI Prediction
  const prediction = useMemo(() => {
    return MLPredictionService.predictStudentConsumption(currentStudent, purchases, products);
  }, [currentStudent, purchases, products]);

  // Personalized Recommendations
  const recommendations = useMemo(() => {
    return AIRecommendationService.getPersonalizedRecommendations(currentStudent, purchases, products);
  }, [currentStudent, purchases, products]);

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #064e3b, #047857 60%, #059669)",
          borderRadius: "var(--radius-xl)",
          padding: "32px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          boxShadow: "var(--shadow-lg)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "relative", zIndex: 2, maxWidth: "620px" }}>
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
              backdropFilter: "blur(4px)"
            }}
          >
            <Sparkles size={14} color="#a7f3d0" />
            Nandha Engineering College • AI Stationery Portal
          </div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: "800", color: "white", letterSpacing: "-0.02em" }}>
            Welcome back, {firstName}! 👋
          </h1>
          <p style={{ color: "#d1fae5", fontSize: "0.925rem", marginTop: "6px", lineHeight: 1.5 }}>
            {currentStudent?.department} • <strong>Year {currentStudent?.year} (Semester {currentStudent?.semester})</strong> • Section {currentStudent?.section || "A"} • Reg No: <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700" }}>{registrationNumber}</span>
          </p>
        </div>

        <div style={{ position: "relative", zIndex: 2, display: "flex", gap: "12px" }}>
          <button
            className="btn btn-secondary"
            style={{ background: "white", color: "var(--primary-dark)", border: "none", fontWeight: "700" }}
            onClick={() => onNavigate("store")}
          >
            <Store size={18} />
            Browse Store
          </button>
          <button
            className="btn"
            style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
            onClick={() => onNavigate("profile")}
          >
            <IdCard size={18} />
            View Profile
          </button>
        </div>
      </div>

      {/* 4 Dashboard Metric Cards */}
      <div className="grid-4">
        <StatCard
          title="Total Spending"
          value={formatCurrency(stats.totalSpent)}
          subtitle="All academic terms"
          icon={Wallet}
          trend={10.5}
          color="#059669"
        />
        <StatCard
          title="Items Purchased"
          value={`${stats.itemsPurchased} Units`}
          subtitle="Stationery & materials"
          icon={ShoppingBag}
          trend={6.8}
          color="#2563eb"
        />
        <StatCard
          title="Current Semester Spending"
          value={formatCurrency(stats.currentSemSpent)}
          subtitle={`Semester ${currentStudent?.semester || 3} to date`}
          icon={TrendingUp}
          trend={-3.2}
          trendLabel="vs prev sem"
          color="#7c3aed"
        />
        <StatCard
          title="Most Purchased Item"
          value={stats.mostUsed}
          subtitle="Primary consumable"
          icon={Award}
          badgeText="Top Item"
          badgeType="purple"
          color="#d97706"
        />
      </div>

      {/* Charts Section */}
      <div className="grid-2">
        {/* Semester Spending Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Semester Spending Trend</div>
              <div className="card-subtitle">Spending progression from Semester 1 to Semester 8</div>
            </div>
            <span className="badge badge-success">₹ INR</span>
          </div>
          <LineChart
            data={semesterChartData}
            dataKey="value"
            labelKey="label"
            height={240}
            strokeColor="#059669"
            formatValue={(v) => formatCurrency(v)}
          />
        </div>

        {/* Stationery Consumption Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Stationery Consumption Breakdown</div>
              <div className="card-subtitle">Total units consumed across major categories</div>
            </div>
            <span className="badge badge-info">Units</span>
          </div>
          <BarChart
            data={consumptionChartData}
            dataKey="value"
            labelKey="label"
            height={240}
            formatValue={(v) => `${v} units`}
          />
        </div>
      </div>

      {/* AI Next Semester Forecast & Personalized Recommendations */}
      <div className="grid-2">
        {/* AI Prediction Highlight Box */}
        {prediction && (
          <div
            className="card"
            style={{
              background: "linear-gradient(180deg, #ffffff, #f0fdf4)",
              border: "1px solid var(--primary-border)"
            }}
          >
            <div className="card-header">
              <div>
                <div className="card-title" style={{ color: "var(--primary-dark)" }}>
                  <BrainCircuit size={20} color="var(--primary)" />
                  AI Consumption Forecast (Semester {prediction.nextSemester})
                </div>
                <div className="card-subtitle">Machine learning prediction for {studentName}</div>
              </div>
              <span className="badge badge-success">
                {prediction.confidenceScore}% Confidence
              </span>
            </div>

            <p style={{ fontSize: "0.88rem", color: "var(--text-main)", lineHeight: 1.6, marginBottom: "16px" }}>
              {prediction.explanation}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              {prediction.predictions.slice(0, 2).map((pred, i) => (
                <div
                  key={i}
                  style={{
                    background: "white",
                    padding: "12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-light)"
                  }}
                >
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{pred.item}</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--primary-dark)", marginTop: "2px" }}>
                    {pred.predictedNextSemesterQty} <span style={{ fontSize: "0.8rem", fontWeight: "500" }}>{pred.unit}</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: "700", marginTop: "2px" }}>
                    +{pred.percentageIncrease}% vs last sem
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn btn-subtle btn-sm"
              style={{ width: "100%" }}
              onClick={() => onNavigate("ai-prediction")}
            >
              View Full AI Prediction Dashboard
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Personalized Recommendations */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Sparkles size={20} color="var(--accent-purple)" />
                Recommended For You
              </div>
              <div className="card-subtitle">Based on your {currentStudent?.deptCode || "IT"} syllabus & semester needs</div>
            </div>
            <span className="badge badge-purple">AI Curated</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {recommendations.slice(0, 3).map((prod) => (
              <div
                key={prod.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)",
                  background: "white"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{ width: "42px", height: "42px", borderRadius: "var(--radius-md)", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {prod.name}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {prod.matchReason}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "12px" }}>
                  <span style={{ fontWeight: "700", color: "var(--primary-dark)", fontSize: "0.9rem" }}>
                    {formatCurrency(prod.price)}
                  </span>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                    onClick={() => addToCart(prod, 1)}
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Purchases Quick Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Purchases</div>
            <div className="card-subtitle">Your latest invoices (Reg No: {registrationNumber})</div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("history")}>
            View All History
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Date</th>
                <th>Semester</th>
                <th>Items</th>
                <th>Total Paid</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {studentPurchases.slice(0, 4).map((p) => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600", color: "var(--primary-dark)" }}>
                      {p.billNumber}
                    </span>
                  </td>
                  <td>{formatDate(p.date)}</td>
                  <td>Semester {p.semester}</td>
                  <td>
                    <span style={{ color: "var(--text-muted)" }}>
                      {p.items.map((it) => `${it.quantity}x ${it.name}`).join(", ").slice(0, 45)}...
                    </span>
                  </td>
                  <td style={{ fontWeight: "700", color: "var(--text-main)" }}>
                    {formatCurrency(p.totalAmount)}
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveBillModal(p)}
                    >
                      <Receipt size={14} />
                      View Bill
                    </button>
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
