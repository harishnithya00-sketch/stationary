import React, { useState, useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import { DEPARTMENTS } from "../../data/initialStudents";
import { MLPredictionService } from "../../services/mlPredictionService";
import { Modal } from "../common/Modal";
import { ComparisonBarChart } from "../common/ChartComponents";
import { formatCurrency, formatDate } from "../../utils/formatters";
import {
  Users,
  Search,
  Building,
  GraduationCap,
  Sparkles,
  Eye,
  Receipt,
  BrainCircuit,
  TrendingUp,
  Mail,
  Phone,
  CheckCircle
} from "lucide-react";

export const StudentDirectory = () => {
  const { students, purchases, products, setActiveBillModal } = useStore();
  const { loginAsStudent } = useAuth();

  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [activeProfileStudent, setActiveProfileStudent] = useState(null);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (selectedDept !== "All Departments" && s.department !== selectedDept) {
        return false;
      }
      if (selectedSemester !== "all" && s.semester !== Number(selectedSemester)) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesRoll = s.rollNo.toLowerCase().includes(q);
        const matchesId = s.id.toLowerCase().includes(q);
        if (!matchesName && !matchesRoll && !matchesId) return false;
      }
      return true;
    });
  }, [students, search, selectedDept, selectedSemester]);

  // Profile data when modal is open
  const profilePurchases = useMemo(() => {
    if (!activeProfileStudent) return [];
    return purchases.filter(
      (p) => p.studentId === activeProfileStudent.id || p.rollNo === activeProfileStudent.rollNo
    );
  }, [activeProfileStudent, purchases]);

  const profilePrediction = useMemo(() => {
    if (!activeProfileStudent) return null;
    return MLPredictionService.predictStudentConsumption(activeProfileStudent, purchases, products);
  }, [activeProfileStudent, purchases, products]);

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "1.65rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            Student Management & Consumption Profiles
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "2px" }}>
            Directory of all registered college students with 360° consumption analytics and individual AI forecasts
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="badge badge-success" style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
            {students.length} Enrolled Students
          </span>
        </div>
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
            placeholder="Search by student name or roll number (e.g. 22CS101)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ width: "240px", fontSize: "0.85rem" }}
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

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
      </div>

      {/* Students Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Department</th>
                <th>Year & Sem</th>
                <th style={{ textAlign: "center" }}>Purchases</th>
                <th style={{ textAlign: "right" }}>Total Spent</th>
                <th>Most Used Stationery</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: student.avatarColor,
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "0.85rem"
                        }}
                      >
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: "700", color: "var(--text-main)" }}>{student.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600", color: "var(--primary-dark)" }}>
                      {student.rollNo}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-neutral">{student.deptCode}</span>
                  </td>
                  <td style={{ fontSize: "0.82rem" }}>
                    {student.year} • <strong>Sem {student.semester}</strong>
                  </td>
                  <td style={{ textAlign: "center", fontWeight: "600" }}>
                    {student.totalPurchasesCount || 0} bills
                  </td>
                  <td style={{ textAlign: "right", fontWeight: "700", color: "var(--text-main)" }}>
                    {formatCurrency(student.totalSpent || 0)}
                  </td>
                  <td style={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {student.mostUsedItem}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveProfileStudent(student)}
                    >
                      <Eye size={14} />
                      View 360° Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 360° Student Profile & AI Forecast Modal */}
      <Modal
        isOpen={Boolean(activeProfileStudent)}
        onClose={() => setActiveProfileStudent(null)}
        title="Student 360° Profile & Consumption Analytics"
        subtitle={`Detailed procurement dossier for ${activeProfileStudent?.name || ""}`}
        maxWidth="760px"
      >
        {activeProfileStudent && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Top Identity Card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
                padding: "16px",
                background: "var(--bg-card-subtle)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-light)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "50%",
                    backgroundColor: activeProfileStudent.avatarColor,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "1.3rem"
                  }}
                >
                  {activeProfileStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-main)" }}>
                    {activeProfileStudent.name}
                  </h3>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Roll No: <strong>{activeProfileStudent.rollNo}</strong> • {activeProfileStudent.department}
                  </div>
                  <div style={{ display: "flex", gap: "12px", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    <span>{activeProfileStudent.year} (Semester {activeProfileStudent.semester})</span>
                    <span>•</span>
                    <span>CGPA: {activeProfileStudent.cgpa}</span>
                    <span>•</span>
                    <span>{activeProfileStudent.hosteller ? "Hosteller" : "Day Scholar"}</span>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-subtle btn-sm"
                onClick={() => {
                  loginAsStudent(activeProfileStudent.id);
                  setActiveProfileStudent(null);
                }}
              >
                Impersonate / Login as Student
              </button>
            </div>

            {/* 4 Financial & Usage Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
              <div style={{ background: "#ffffff", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Total Spending</div>
                <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--primary-dark)", marginTop: "2px" }}>
                  {formatCurrency(activeProfileStudent.totalSpent || 0)}
                </div>
              </div>
              <div style={{ background: "#ffffff", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Total Purchases</div>
                <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-main)", marginTop: "2px" }}>
                  {activeProfileStudent.totalPurchasesCount || 0} Bills
                </div>
              </div>
              <div style={{ background: "#ffffff", padding: "12px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)", gridColumn: "span 2" }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Most Used Item</div>
                <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {activeProfileStudent.mostUsedItem}
                </div>
              </div>
            </div>

            {/* Individual AI Prediction Highlight */}
            {profilePrediction && (
              <div
                style={{
                  background: "linear-gradient(135deg, #f0fdf4, #ffffff)",
                  borderRadius: "var(--radius-lg)",
                  padding: "16px 20px",
                  border: "1px solid var(--primary-border)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", color: "var(--primary-dark)", fontSize: "0.92rem" }}>
                    <BrainCircuit size={17} color="var(--primary)" />
                    AI Consumption Forecast for Next Term (Semester {profilePrediction.nextSemester})
                  </div>
                  <span className="badge badge-success">{profilePrediction.confidenceScore}% Confidence</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-main)", lineHeight: 1.5, marginBottom: "14px" }}>
                  {profilePrediction.explanation}
                </p>

                <ComparisonBarChart data={profilePrediction.predictions.slice(0, 3)} />
              </div>
            )}

            {/* Recent Purchases List */}
            <div>
              <h4 style={{ fontSize: "0.92rem", fontWeight: "700", marginBottom: "10px" }}>
                Recent Purchase Invoices ({profilePurchases.length})
              </h4>
              <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                {profilePurchases.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.82rem" }}>
                    No purchase history on file for this student.
                  </div>
                ) : (
                  profilePurchases.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 14px",
                        background: "#ffffff",
                        border: "1px solid var(--border-light)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.82rem"
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "700", color: "var(--text-main)" }}>
                          {p.billNumber} • Semester {p.semester}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                          {formatDate(p.date)} • {p.items.map((it) => `${it.quantity}x ${it.name}`).join(", ").slice(0, 35)}...
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontWeight: "800", color: "var(--primary-dark)" }}>
                          {formatCurrency(p.totalAmount)}
                        </span>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                          onClick={() => setActiveBillModal(p)}
                        >
                          <Receipt size={13} />
                          Invoice
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
