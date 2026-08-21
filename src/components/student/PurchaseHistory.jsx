import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  Receipt,
  Search,
  Calendar,
  Filter,
  ArrowUpDown,
  Download,
  FileText,
  Clock,
  IdCard
} from "lucide-react";

export const PurchaseHistory = () => {
  const { currentStudent } = useAuth();
  const { purchases, setActiveBillModal } = useStore();

  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [itemFilter, setItemFilter] = useState("");
  const [searchBill, setSearchBill] = useState("");

  const studentRegNo = (currentStudent?.registration_number || currentStudent?.rollNo || "").toUpperCase();

  const studentPurchases = useMemo(() => {
    if (!currentStudent) return [];
    return purchases.filter(
      (p) =>
        (p.registration_number && p.registration_number.toUpperCase() === studentRegNo) ||
        (p.rollNo && p.rollNo.toUpperCase() === studentRegNo) ||
        p.studentId === currentStudent.id ||
        p.studentId === currentStudent.student_id
    );
  }, [purchases, currentStudent, studentRegNo]);

  // Filtered List
  const filteredPurchases = useMemo(() => {
    return studentPurchases.filter((p) => {
      // Semester filter
      if (selectedSemester !== "all" && p.semester !== Number(selectedSemester)) {
        return false;
      }
      // Academic year filter
      if (selectedYear !== "all" && p.academicYear !== selectedYear) {
        return false;
      }
      // Bill search
      if (searchBill.trim()) {
        const q = searchBill.toLowerCase();
        if (!p.billNumber.toLowerCase().includes(q)) return false;
      }
      // Item filter
      if (itemFilter.trim()) {
        const q = itemFilter.toLowerCase();
        const hasItem = p.items.some((it) => it.name.toLowerCase().includes(q));
        if (!hasItem) return false;
      }
      return true;
    });
  }, [studentPurchases, selectedSemester, selectedYear, searchBill, itemFilter]);

  const totalFilteredSpend = filteredPurchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "1.65rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            Purchase & Billing History
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "2px" }}>
            Invoices linked to <strong>{currentStudent?.student_name || currentStudent?.name}</strong> (<span style={{ fontFamily: "var(--font-mono)", fontWeight: "600" }}>{studentRegNo}</span>)
          </p>
        </div>

        <div
          style={{
            background: "var(--primary-subtle)",
            border: "1px solid var(--primary-border)",
            borderRadius: "var(--radius-md)",
            padding: "10px 18px",
            textAlign: "right"
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--primary-dark)", fontWeight: "600" }}>Total Filtered Spending</div>
          <div style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--primary-dark)" }}>
            {formatCurrency(totalFilteredSpend)}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "14px",
          alignItems: "center"
        }}
      >
        {/* Search Bill Number */}
        <div style={{ position: "relative" }}>
          <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "12px" }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: "36px", fontSize: "0.85rem" }}
            placeholder="Search Bill ID (e.g. NEC-BILL-1001)..."
            value={searchBill}
            onChange={(e) => setSearchBill(e.target.value)}
          />
        </div>

        {/* Filter by Semester */}
        <div>
          <select
            className="form-select"
            style={{ fontSize: "0.85rem" }}
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="all">All Semesters (1 to 8)</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Academic Year */}
        <div>
          <select
            className="form-select"
            style={{ fontSize: "0.85rem" }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="all">All Academic Years</option>
            <option value="2024-2025">2024–2025</option>
            <option value="2023-2024">2023–2024</option>
            <option value="2022-2023">2022–2023</option>
          </select>
        </div>

        {/* Search by Item Name */}
        <div>
          <input
            type="text"
            className="form-input"
            style={{ fontSize: "0.85rem" }}
            placeholder="Filter by item (e.g. A4, Pen)..."
            value={itemFilter}
            onChange={(e) => setItemFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Bill ID</th>
                <th>Date</th>
                <th>Semester</th>
                <th>Academic Year</th>
                <th>Items Breakdown</th>
                <th>Total Units</th>
                <th>Total Amount</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                    No purchase records match the selected filters for Registration Number {studentRegNo}.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((purchase) => {
                  const totalUnits = purchase.items.reduce((sum, it) => sum + Number(it.quantity || 0), 0);

                  return (
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
                        <span className="badge badge-neutral" style={{ fontWeight: "600" }}>
                          Semester {purchase.semester}
                        </span>
                      </td>
                      <td style={{ color: "var(--text-muted)" }}>{purchase.academicYear || "2024-2025"}</td>
                      <td>
                        <div style={{ maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {purchase.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
                        </div>
                      </td>
                      <td style={{ fontWeight: "600" }}>{totalUnits}</td>
                      <td>
                        <div style={{ fontWeight: "800", color: "var(--text-main)", fontSize: "0.95rem" }}>
                          {formatCurrency(purchase.totalAmount)}
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setActiveBillModal(purchase)}
                        >
                          <FileText size={14} />
                          View Bill
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
