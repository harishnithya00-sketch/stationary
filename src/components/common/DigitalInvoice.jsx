import React from "react";
import { Printer, CheckCircle, GraduationCap, QrCode } from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/formatters";

export const DigitalInvoice = ({ bill, onClose }) => {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const regNo = bill.registration_number || bill.rollNo || bill.studentId || "";
  const sName = bill.student_name || bill.studentName || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Action Toolbar */}
      <div
        className="no-print"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--border-light)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary-dark)", fontWeight: "700" }}>
          <CheckCircle size={18} color="var(--primary)" />
          <span>Purchase Successful & Verified</span>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-primary btn-sm" onClick={handlePrint}>
            <Printer size={15} />
            Print Official Bill
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div
        id="printable-invoice"
        style={{
          background: "#ffffff",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-lg)",
          padding: "32px",
          fontFamily: "var(--font-sans)",
          color: "#0f172a"
        }}
      >
        {/* College Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "2px solid #064e3b",
            paddingBottom: "16px",
            marginBottom: "20px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "var(--radius-md)",
                background: "#064e3b",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <GraduationCap size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#064e3b", margin: 0, letterSpacing: "-0.01em" }}>
                NANDHA ENGINEERING COLLEGE
              </h2>
              <div style={{ fontSize: "0.82rem", color: "#475569", fontWeight: "600" }}>
                Central Campus Stationery & Digital Services Division
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                Erode - Perundurai Main Road, Vaikkaalmedu • GSTIN: 33AABCN1234F1Z9
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "inline-block",
                background: "#ecfdf5",
                color: "#064e3b",
                fontWeight: "800",
                fontSize: "0.78rem",
                padding: "4px 10px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid #a7f3d0",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            >
              Official Tax Invoice
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: "700", marginTop: "6px", fontFamily: "var(--font-mono)" }}>
              {bill.billNumber}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
              Date: {formatDate(bill.date)}
            </div>
          </div>
        </div>

        {/* Student & Bill Details 2-Column Box */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            background: "#f8fafc",
            padding: "16px",
            borderRadius: "var(--radius-md)",
            border: "1px solid #e2e8f0",
            marginBottom: "20px",
            fontSize: "0.85rem"
          }}
        >
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
              Student Information
            </div>
            <div style={{ fontWeight: "700", fontSize: "0.95rem", color: "#0f172a", marginTop: "2px" }}>
              {sName}
            </div>
            <div style={{ color: "#475569", marginTop: "2px" }}>
              <strong>Registration Number:</strong> <span style={{ fontFamily: "var(--font-mono)", fontWeight: "600" }}>{regNo}</span>
            </div>
            <div style={{ color: "#475569" }}>
              <strong>Department:</strong> {bill.department} ({bill.deptCode || "ENGG"})
            </div>
            <div style={{ color: "#475569" }}>
              <strong>Academic Semester:</strong> Semester {bill.semester}
            </div>
          </div>

          <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "16px" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>
              Payment & Verification
            </div>
            <div style={{ color: "#475569", marginTop: "4px" }}>
              <strong>Payment Status:</strong> <span style={{ color: "#059669", fontWeight: "700" }}>PAID</span>
            </div>
            <div style={{ color: "#475569" }}>
              <strong>Payment Method:</strong> {bill.paymentMethod || "Student Smart Card / UPI"}
            </div>
            <div style={{ color: "#475569" }}>
              <strong>Academic Year:</strong> {bill.academicYear || "2024-2025"}
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #cbd5e1", textAlign: "left" }}>
              <th style={{ padding: "10px", width: "40px" }}>#</th>
              <th style={{ padding: "10px" }}>Stationery Item Description</th>
              <th style={{ padding: "10px", textAlign: "center", width: "70px" }}>Qty</th>
              <th style={{ padding: "10px", textAlign: "right", width: "90px" }}>Unit Price</th>
              <th style={{ padding: "10px", textAlign: "right", width: "110px" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, idx) => {
              const itemTotal = item.quantity * item.price;
              return (
                <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "10px", color: "#64748b" }}>{idx + 1}</td>
                  <td style={{ padding: "10px", fontWeight: "600", color: "#0f172a" }}>
                    {item.name}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center", fontWeight: "700" }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: "10px", textAlign: "right", color: "#475569" }}>
                    {formatCurrency(item.price)}
                  </td>
                  <td style={{ padding: "10px", textAlign: "right", fontWeight: "700", color: "#0f172a" }}>
                    {formatCurrency(itemTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Calculation Summary & Stamp */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {/* Verification Barcode & Stamp */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "var(--radius-sm)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px"
              }}
            >
              <QrCode size={48} color="#064e3b" />
              <span style={{ fontSize: "0.55rem", color: "#64748b", marginTop: "2px" }}>NANDHA VERIFIED</span>
            </div>
            <div>
              <div
                style={{
                  display: "inline-block",
                  padding: "4px 8px",
                  border: "2px solid #059669",
                  borderRadius: "var(--radius-sm)",
                  color: "#059669",
                  fontWeight: "800",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em"
                }}
              >
                ✓ STORE DISPENSED
              </div>
              <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "4px" }}>
                Nandha Central Stationery Division
              </div>
            </div>
          </div>

          {/* Totals Table */}
          <div style={{ width: "240px", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#475569" }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: "600" }}>{formatCurrency(bill.subtotal)}</span>
            </div>
            {bill.discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#059669" }}>
                <span>Student Concession:</span>
                <span style={{ fontWeight: "600" }}>-{formatCurrency(bill.discount)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: "#475569" }}>
              <span>GST / Campus Cess (5%):</span>
              <span style={{ fontWeight: "600" }}>+{formatCurrency(bill.tax)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderTop: "2px solid #064e3b",
                marginTop: "6px",
                fontSize: "1.1rem",
                fontWeight: "800",
                color: "#064e3b"
              }}
            >
              <span>Net Amount:</span>
              <span>{formatCurrency(bill.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "12px",
            borderTop: "1px dashed #cbd5e1",
            textAlign: "center",
            fontSize: "0.72rem",
            color: "#64748b"
          }}
        >
          Nandha Engineering College Central Stationery & Digital Store • Computer-generated tax invoice – valid without physical signature.
        </div>
      </div>
    </div>
  );
};
