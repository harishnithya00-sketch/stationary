import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../utils/formatters";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Receipt,
  X,
  CreditCard,
  Building2
} from "lucide-react";

export const CartDrawer = ({ isOpen, onClose }) => {
  const {
    cart,
    cartSummary,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    checkoutAndGenerateBill
  } = useStore();
  const { currentStudent } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState("Student Smart Card / UPI");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const sName = currentStudent?.student_name || currentStudent?.name || "Harish V";
  const sReg = currentStudent?.registration_number || currentStudent?.rollNo || "24IT101";

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      checkoutAndGenerateBill({
        paymentMethod,
        registration_number: sReg,
        student_name: sName
      });
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "flex-end"
      }}
      onClick={onClose}
    >
      <div
        className="animate-fade"
        style={{
          width: "100%",
          maxWidth: "480px",
          height: "100%",
          background: "#ffffff",
          boxShadow: "var(--shadow-xl)",
          display: "flex",
          flexDirection: "column",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#ffffff"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-md)",
                background: "var(--primary-subtle)",
                color: "var(--primary-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ShoppingCart size={19} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--text-main)" }}>
                Stationery Cart
              </h2>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {cartSummary.totalItemsCount} items selected
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-icon"
            style={{ width: "32px", height: "32px", border: "none", background: "var(--bg-card-subtle)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Student Verification Ribbon */}
        {currentStudent && (
          <div
            style={{
              padding: "10px 24px",
              background: "var(--bg-card-subtle)",
              borderBottom: "1px solid var(--border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.8rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Building2 size={14} color="var(--primary)" />
              <span>
                Billing to: <strong>{sName}</strong> (<span style={{ fontFamily: "var(--font-mono)" }}>{sReg}</span>)
              </span>
            </div>
            <span className="badge badge-success" style={{ fontSize: "0.68rem" }}>
              Sem {currentStudent.semester}
            </span>
          </div>
        )}

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {cart.length === 0 ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "var(--text-muted)",
                gap: "12px"
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "var(--bg-card-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-light)"
                }}
              >
                <ShoppingCart size={32} />
              </div>
              <div style={{ fontWeight: "700", color: "var(--text-main)" }}>Your cart is empty</div>
              <div style={{ fontSize: "0.82rem", maxWidth: "260px" }}>
                Add stationery items, A4 sheets, record notebooks, or lab materials from the store.
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Selected Items
                </span>
                <button
                  onClick={clearCart}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent-red)",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <Trash2 size={13} />
                  Clear Cart
                </button>
              </div>

              {cart.map((item) => {
                const itemTotal = item.product.price * item.quantity;
                return (
                  <div
                    key={item.product.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-light)",
                      background: "#ffffff"
                    }}
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: "56px", height: "56px", borderRadius: "var(--radius-md)", objectFit: "cover" }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.product.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        {formatCurrency(item.product.price)} each
                      </div>

                      {/* Quantity Modifier */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            background: "var(--bg-card-subtle)",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--border-light)",
                            padding: "2px"
                          }}
                        >
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            style={{
                              width: "22px",
                              height: "22px",
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{ width: "26px", textAlign: "center", fontSize: "0.8rem", fontWeight: "700" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            style={{
                              width: "22px",
                              height: "22px",
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div style={{ fontWeight: "700", color: "var(--primary-dark)", fontSize: "0.95rem" }}>
                          {formatCurrency(itemTotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer Billing Breakdown & Generate Bill Action */}
        {cart.length > 0 && (
          <div
            style={{
              padding: "20px 24px",
              borderTop: "1px solid var(--border-light)",
              background: "#ffffff"
            }}
          >
            {/* Calculation summary */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: "600", color: "var(--text-main)" }}>
                  {formatCurrency(cartSummary.subtotal)}
                </span>
              </div>
              {cartSummary.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--primary)" }}>
                  <span>Student Concession (5% on ₹500+)</span>
                  <span style={{ fontWeight: "700" }}>-{formatCurrency(cartSummary.discount)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)" }}>
                <span>Campus Tax & GST (5%)</span>
                <span style={{ fontWeight: "600", color: "var(--text-main)" }}>
                  +{formatCurrency(cartSummary.tax)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "10px",
                  borderTop: "1px solid var(--border-light)",
                  fontSize: "1.2rem",
                  fontWeight: "800",
                  color: "var(--primary-dark)"
                }}
              >
                <span>Total Payable</span>
                <span>{formatCurrency(cartSummary.total)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="form-group" style={{ marginBottom: "16px" }}>
              <label className="form-label" style={{ fontSize: "0.78rem" }}>
                Payment Method
              </label>
              <select
                className="form-select"
                style={{ fontSize: "0.85rem", padding: "8px 12px" }}
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Student Smart Card / UPI">Student Smart Card / UPI</option>
                <option value="Direct UPI / PhonePe / GPay">Direct UPI (QR Instant)</option>
                <option value="Campus Stationery Credits">Campus Stationery Credits Account</option>
                <option value="Cash at Store Counter">Cash at Store Counter</option>
              </select>
            </div>

            {/* Generate Bill Button */}
            <button
              className="btn btn-dark btn-lg"
              style={{ width: "100%", gap: "10px" }}
              disabled={isProcessing}
              onClick={handleCheckout}
            >
              {isProcessing ? (
                <span>Generating Digital Bill...</span>
              ) : (
                <>
                  <Receipt size={19} />
                  <span>Generate Official Bill ({formatCurrency(cartSummary.total)})</span>
                </>
              )}
            </button>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "10px" }}>
              <ShieldCheck size={14} color="var(--primary)" />
              <span>Nandha Engineering College Digital Verified Invoice</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
