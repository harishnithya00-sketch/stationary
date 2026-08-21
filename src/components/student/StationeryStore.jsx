import React, { useState, useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { CATEGORIES } from "../../data/initialProducts";
import { formatCurrency } from "../../utils/formatters";
import {
  Search,
  ShoppingCart,
  Zap,
  SlidersHorizontal,
  Plus,
  Minus,
  Check,
  Sparkles,
  AlertCircle
} from "lucide-react";

export const StationeryStore = ({ onOpenCart }) => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    addToCart
  } = useStore();

  const [quantities, setQuantities] = useState({});
  const [priceFilter, setPriceFilter] = useState("all"); // 'all', 'under20', '20to100', 'above100'

  const handleQtyChange = (productId, delta, maxStock) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, Math.min(maxStock, current + delta));
      return { ...prev, [productId]: next };
    });
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== "All Items" && p.category !== selectedCategory) {
          return false;
        }
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesCat = p.category.toLowerCase().includes(q);
          const matchesDesc = (p.description || "").toLowerCase().includes(q);
          if (!matchesName && !matchesCat && !matchesDesc) return false;
        }
        // Price filter
        if (priceFilter === "under20" && p.price >= 20) return false;
        if (priceFilter === "20to100" && (p.price < 20 || p.price > 100)) return false;
        if (priceFilter === "above100" && p.price <= 100) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return (b.popularity || 0) - (a.popularity || 0);
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, priceFilter, sortBy]);

  const handleBuyNow = (product) => {
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);
    onOpenCart();
  };

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Store Header & Category Chips */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div>
            <h1 style={{ fontSize: "1.65rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
              Campus Stationery Marketplace
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "2px" }}>
              Instant college subsidized supplies, lab materials, printouts & project kits
            </p>
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "600" }}>
              Sort by:
            </span>
            <select
              className="form-select"
              style={{ width: "170px", padding: "6px 12px", fontSize: "0.85rem" }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "8px",
            scrollbarWidth: "none"
          }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.825rem",
                  fontWeight: isSelected ? "700" : "500",
                  background: isSelected ? "var(--primary-dark)" : "white",
                  color: isSelected ? "white" : "var(--text-muted)",
                  border: isSelected ? "1px solid var(--primary-dark)" : "1px solid var(--border-light)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar: Quick Price Range Selection */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 16px",
          background: "white",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-light)",
          fontSize: "0.82rem",
          flexWrap: "wrap"
        }}
      >
        <span style={{ fontWeight: "700", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "6px" }}>
          <SlidersHorizontal size={14} color="var(--primary)" />
          Price Filter:
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          {[
            { id: "all", label: "All Prices" },
            { id: "under20", label: "Under ₹20" },
            { id: "20to100", label: "₹20 – ₹100" },
            { id: "above100", label: "₹100+" }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPriceFilter(p.id)}
              className={`btn btn-sm ${priceFilter === p.id ? "btn-subtle" : "btn-secondary"}`}
              style={{ fontSize: "0.78rem", padding: "4px 10px" }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>
          Showing <strong>{filteredProducts.length}</strong> items
        </span>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "60px 20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <AlertCircle size={40} color="var(--text-light)" />
          <h3 style={{ fontSize: "1.1rem", color: "var(--text-main)" }}>No stationery items matched your search</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Try adjusting your search keywords or switching category filters.
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All Items");
              setPriceFilter("all");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filteredProducts.map((product) => {
            const qty = quantities[product.id] || 1;
            const inStock = product.stock > 0;
            const isLowStock = product.stock > 0 && product.stock <= product.minStock;

            return (
              <div
                key={product.id}
                className="card card-hoverable"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: 0,
                  overflow: "hidden",
                  border: "1px solid var(--border-light)"
                }}
              >
                {/* Product Image Header */}
                <div style={{ position: "relative", width: "100%", height: "180px", background: "#f8fafc" }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />

                  {/* Badges */}
                  <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <span className="badge badge-neutral" style={{ background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(4px)" }}>
                      {product.category}
                    </span>
                    {product.isPopular && (
                      <span className="badge badge-purple" style={{ background: "rgba(124, 58, 237, 0.9)", color: "white" }}>
                        ★ Best Seller
                      </span>
                    )}
                  </div>

                  {/* Stock status indicator */}
                  <div style={{ position: "absolute", bottom: "10px", right: "12px" }}>
                    {!inStock ? (
                      <span className="badge badge-danger">Out of Stock</span>
                    ) : isLowStock ? (
                      <span className="badge badge-warning">Only {product.stock} Left</span>
                    ) : (
                      <span className="badge badge-success">In Stock ({product.stock})</span>
                    )}
                  </div>
                </div>

                {/* Product Details Body */}
                <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.4, marginBottom: "14px", flex: 1 }}>
                    {product.description}
                  </p>

                  {/* Price and Quantity Selector Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: "1px solid var(--border-light)",
                      marginBottom: "14px"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--primary-dark)" }}>
                        {formatCurrency(product.price)}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        per {product.unit} • {product.packSize}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    {inStock && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background: "var(--bg-card-subtle)",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border-light)",
                          padding: "2px"
                        }}
                      >
                        <button
                          onClick={() => handleQtyChange(product.id, -1, product.stock)}
                          disabled={qty <= 1}
                          style={{
                            width: "28px",
                            height: "28px",
                            border: "none",
                            background: "transparent",
                            cursor: qty <= 1 ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-main)"
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ width: "32px", textAlign: "center", fontWeight: "700", fontSize: "0.85rem" }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => handleQtyChange(product.id, 1, product.stock)}
                          disabled={qty >= product.stock}
                          style={{
                            width: "28px",
                            height: "28px",
                            border: "none",
                            background: "transparent",
                            cursor: qty >= product.stock ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-main)"
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions: Add to Cart & Buy Now */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={!inStock}
                      onClick={() => addToCart(product, qty)}
                      style={{ opacity: !inStock ? 0.5 : 1 }}
                    >
                      <ShoppingCart size={15} />
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={!inStock}
                      onClick={() => handleBuyNow(product)}
                      style={{ opacity: !inStock ? 0.5 : 1 }}
                    >
                      <Zap size={15} />
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
