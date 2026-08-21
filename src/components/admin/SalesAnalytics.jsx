import React, { useState, useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  Receipt,
  Search,
  Calendar,
  Download,
  Filter,
  TrendingUp,
  CreditCard,
  Building,
  FileText
} from "lucide-react";
import { LineChart, BarChart } from "../common/ChartComponents";

export const SalesAnalytics = () => {
  const { purchases, setActiveBillModal } = useStore();

  const [search, setSearch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const filteredPurchases = useMemo(() => {
    return purchases.filter((p) => {
      if (selectedSemester !== "all" && p.semester !== Number(selectedSemester)) return false;
      if (paymentFilter !== "all" && !p.paymentMethod.toLowerCase().includes(paymentFilter.toLowerCase())) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesBill = p.billNumber.toLowerCase().includes(q);
        const matchesName = (p.studentName || "").toLowerCase().includes(q);
        const matchesRoll = (p.rollNo || "").toLowerCase().includes(q);
        if (!matchesBill && !matchesName && !matchesRoll) return false;
      }
      return true;
    });
  }, [purchases, search, selectedSemester, paymentFilter]);

  const totalSalesRevenue = filteredPurchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const totalItemsCount = filteredPurchases.reduce(
    (sum, p) => sum + p.items.reduce((s, it) => s + (Number(it.quantity) || 0), 0),
    0
  );

  // Department Sales Distribution
  const departmentSales = useMemo(() => {
    const map = {};
    filteredPurchases.forEach((p) => {
      const dept = p.deptCode || "Other";
      map[dept] = (map[dept] || 0) + (p.totalAmount || 0);
    });

    const colors = ["#059669", "#2563eb", "#7c3aed", "#d97706", "#0891b2", "#db2777"];
    return Object.entries(map).map(([dept, total], i) => ({
      label: dept,
      value: total,
      color: colors[i % colors.length]
    }));
  }, [filteredPurchases]);

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = ["Bill Number", "Date", "Student Name", "Roll No", "Department", "Semester", "Subtotal", "Tax", "Discount", "Total Amount", "Payment Method"];
    const rows = filteredPurchases.map(p => [
      p.billNumber,
      p.date,
      `"${p.studentName}"`,
      p.rollNo,
      p.deptCode,
      p.semester,
      p.subtotal,
      p.tax,
      p.discount,
      p.totalAmount,
      `"${p.paymentMethod}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Stationery_Sales_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "1.65rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            Sales, Invoices & Financial Ledger
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "2px" }}>
            Audit generated bills, department financial allocations, and export campus audit reports
          </p>
        </div>

        <button className="btn btn-secondary" onClick={handleExportCSV}>
          <Download size={16} />
          Export Sales CSV Report
        </button>
      </div>

      {/* Summary KPI Ribbon */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <div className="card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
            Total Filtered Sales
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--primary-dark)", marginTop: "4px" }}>
            {formatCurrency(totalSalesRevenue)}
          </div>
        </div>

        <div className="card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
            Total Invoices Generated
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--text-main)", marginTop: "4px" }}>
            {filteredPurchases.length} Bills
          </div>
        </div>

        <div className="card" style={{ padding: "18px" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
            Total Stationery Items Dispensed
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "#2563eb", marginTop: "4px" }}>
            {totalItemsCount.toLocaleString()} Units
          </div>
        </div>
      </div>

      {/* Department Breakdown Chart */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Department-Wise Stationery Expenditure</div>
            <div className="card-subtitle">Revenue distribution across engineering & management branches</div>
          </div>
          <span className="badge badge-success">Branch Totals</span>
        </div>
        <BarChart
          data={departmentSales}
          height={220}
          formatValue={(v) => formatCurrency(v)}
        />
      </div>

      {/* Filters */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexWrap: "wrap"
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "12px" }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: "36px", fontSize: "0.85rem" }}
            placeholder="Search by Bill ID, student name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: "160px", fontSize: "0.85rem" }}
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <option value="all">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s}>
              Semester {s}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          style={{ width: "200px", fontSize: "0.85rem" }}
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="all">All Payment Methods</option>
          <option value="card">Student Smart Card</option>
          <option value="upi">UPI Payments</option>
          <option value="cash">Counter Cash</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Bill Number</th>
                <th>Date</th>
                <th>Student</th>
                <th>Dept & Sem</th>
                <th>Items Purchased</th>
                <th style={{ textAlign: "right" }}>Subtotal</th>
                <th style={{ textAlign: "right" }}>Total Paid</th>
                <th>Payment Mode</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <Receipt size={16} color="var(--primary)" />
                      <span style={{ fontFamily: "var(--font-mono)", fontWeight: "700", color: "var(--primary-dark)" }}>
                        {purchase.billNumber}
                      </span>
                    </div>
                  </td>
                  <td>{formatDate(purchase.date)}</td>
                  <td>
                    <div style={{ fontWeight: "700", color: "var(--text-main)" }}>{purchase.studentName}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{purchase.rollNo}</div>
                  </td>
                  <td>
                    <span className="badge badge-neutral">
                      {purchase.deptCode} • Sem {purchase.semester}
                    </span>
                  </td>
                  <td>
                    <div style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.82rem" }}>
                      {purchase.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
                    </div>
                  </td>
                  <td style={{ textAlign: "right", color: "var(--text-muted)" }}>
                    {formatCurrency(purchase.subtotal)}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: "800", color: "var(--text-main)" }}>
                    {formatCurrency(purchase.totalAmount)}
                  </td>
                  <td style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {purchase.paymentMethod}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveBillModal(purchase)}
                    >
                      <FileText size={14} />
                      Invoice
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
