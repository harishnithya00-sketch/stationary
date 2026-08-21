import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Database } from "../data/database";
import { useAuth } from "./AuthContext";
import { useNotification } from "./NotificationContext";
import confetti from "canvas-confetti";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const { currentStudent, reloadStudentData } = useAuth();
  const { addToast, addNotification } = useNotification();

  const [products, setProducts] = useState(() => Database.getProducts());
  const [students, setStudents] = useState(() => Database.getStudents());
  const [purchases, setPurchases] = useState(() => Database.getPurchases());
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeBillModal, setActiveBillModal] = useState(null); // stores bill object when viewing/generating
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [sortBy, setSortBy] = useState("popular"); // 'popular', 'price-low', 'price-high', 'name'

  // Sync data refresh helper
  const refreshData = () => {
    setProducts(Database.getProducts());
    setStudents(Database.getStudents());
    setPurchases(Database.getPurchases());
    reloadStudentData();
  };

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    if (product.stock <= 0) {
      addToast("error", "Out of Stock", `${product.name} is currently out of stock.`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        const initialQty = Math.min(product.stock, quantity);
        return [...prevCart, { product, quantity: initialQty }];
      }
    });

    addToast(
      "success",
      "Added to Cart",
      `${quantity}x ${product.name} added to your cart.`
    );
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    if (newQuantity > prod.stock) {
      addToast(
        "warning",
        "Stock Limit Reached",
        `Only ${prod.stock} units available in stock.`
      );
      newQuantity = prod.stock;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart totals calculation
  const cartSummary = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const discount = subtotal >= 500 ? Math.round(subtotal * 0.05) : 0; // 5% bulk student concession on orders >= 500
    const total = Math.max(0, subtotal + tax - discount);
    const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return {
      subtotal,
      tax,
      discount,
      total,
      totalItemsCount
    };
  }, [cart]);

  // Checkout and Generate Bill
  const checkoutAndGenerateBill = (customDetails = {}) => {
    if (cart.length === 0) {
      addToast("warning", "Cart is Empty", "Add items to your cart before generating a bill.");
      return null;
    }

    if (!currentStudent) {
      addToast("error", "Student Not Selected", "Please select or login with a student account.");
      return null;
    }

    const purchaseItems = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      unit: item.product.unit
    }));

    const purchaseData = {
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      rollNo: currentStudent.rollNo,
      department: currentStudent.department,
      deptCode: currentStudent.deptCode,
      semester: currentStudent.semester,
      academicYear: "2024-2025",
      items: purchaseItems,
      subtotal: cartSummary.subtotal,
      discount: cartSummary.discount,
      tax: cartSummary.tax,
      totalAmount: cartSummary.total,
      paymentMethod: customDetails.paymentMethod || "Student Smart Card / UPI",
      notes: customDetails.notes || "Official College Stationery Dispense"
    };

    const newBill = Database.createPurchase(purchaseData);
    refreshData();
    clearCart();
    setIsCartOpen(false);
    setActiveBillModal(newBill);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    addToast(
      "success",
      "Purchase Successful!",
      `Bill #${newBill.billNumber} generated for ${formatCurrency(newBill.totalAmount)}.`
    );

    addNotification({
      type: "success",
      title: "Bill Generated",
      message: `Invoice #${newBill.billNumber} for ${currentStudent.name} (${formatCurrency(newBill.totalAmount)}) generated successfully.`,
      forRole: "both"
    });

    return newBill;
  };

  // Admin inventory operations
  const addProduct = (productData) => {
    const created = Database.addProduct(productData);
    refreshData();
    addToast("success", "Product Added", `${created.name} added to inventory.`);
    return created;
  };

  const updateProduct = (id, fields) => {
    const updated = Database.updateProduct(id, fields);
    refreshData();
    addToast("success", "Product Updated", `${updated.name} inventory record updated.`);
    return updated;
  };

  const deleteProduct = (id) => {
    const prod = products.find((p) => p.id === id);
    Database.deleteProduct(id);
    refreshData();
    addToast("info", "Product Removed", `${prod?.name || "Item"} has been removed.`);
  };

  const quickReorderStock = (productId, amount) => {
    const updated = Database.adjustStock(productId, amount);
    refreshData();
    addToast(
      "success",
      "Stock Replenished",
      `Added +${amount} units to ${updated.name}. New Stock: ${updated.stock}`
    );
    return updated;
  };

  const resetAllData = () => {
    Database.resetToDefaults();
    refreshData();
    clearCart();
    addToast("info", "Database Reset", "System restored to default sample seeds.");
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        students,
        purchases,
        cart,
        isCartOpen,
        setIsCartOpen,
        activeBillModal,
        setActiveBillModal,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        cartSummary,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        checkoutAndGenerateBill,
        addProduct,
        updateProduct,
        deleteProduct,
        quickReorderStock,
        resetAllData,
        refreshData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

const formatCurrency = (amt) => `₹${Number(amt || 0).toLocaleString("en-IN")}`;
