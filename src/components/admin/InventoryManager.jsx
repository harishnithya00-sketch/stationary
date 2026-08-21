import React, { useState, useMemo } from "react";
import { useStore } from "../../context/StoreContext";
import { CATEGORIES } from "../../data/initialProducts";
import { Modal } from "../common/Modal";
import { formatCurrency } from "../../utils/formatters";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Search,
  CheckCircle2,
  ArrowUpDown,
  SlidersHorizontal,
  RefreshCw,
  TrendingDown
} from "lucide-react";

export const InventoryManager = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    quickReorderStock
  } = useStore();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [stockFilter, setStockFilter] = useState("all"); // 'all', 'low', 'out', 'healthy'

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Paper & Sheets",
    price: "",
    costPrice: "",
    stock: "",
    minStock: 50,
    unit: "pc",
    packSize: "Single",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&auto=format&fit=crop&q=80",
    description: "",
    tags: []
  });

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      category: "Paper & Sheets",
      price: "",
      costPrice: "",
      stock: "",
      minStock: 50,
      unit: "pc",
      packSize: "Single",
      image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&auto=format&fit=crop&q=80",
      description: "",
      tags: ["Essential"]
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      costPrice: product.costPrice || Math.round(product.price * 0.6),
      stock: product.stock,
      minStock: product.minStock,
      unit: product.unit || "pc",
      packSize: product.packSize || "Single",
      image: product.image,
      description: product.description || "",
      tags: product.tags || []
    });
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) return;

    addProduct({
      ...formData,
      price: Number(formData.price),
      costPrice: Number(formData.costPrice || (formData.price * 0.6).toFixed(0)),
      stock: Number(formData.stock),
      minStock: Number(formData.minStock)
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      ...formData,
      price: Number(formData.price),
      costPrice: Number(formData.costPrice),
      stock: Number(formData.stock),
      minStock: Number(formData.minStock)
    });
    setEditingProduct(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== "All Items" && p.category !== selectedCategory) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (stockFilter === "low" && (p.stock === 0 || p.stock > p.minStock)) return false;
      if (stockFilter === "out" && p.stock > 0) return false;
      if (stockFilter === "healthy" && p.stock <= p.minStock) return false;

      return true;
    });
  }, [products, search, selectedCategory, stockFilter]);

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="animate-fade" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "1.65rem", fontWeight: "800", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            Inventory Management
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: "2px" }}>
            Manage stationery stock, update subsidised prices, configure safety thresholds, and restock items
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={18} />
          Add New Stationery Item
        </button>
      </div>

      {/* Stock Alerts Summary Banner */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
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
                background: "#fee2e2",
                color: "var(--accent-red)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: "700", color: "#991b1b", fontSize: "0.92rem" }}>
                Inventory Replenishment Alert
              </div>
              <div style={{ fontSize: "0.8rem", color: "#b91c1c" }}>
                {outOfStockCount > 0 && `${outOfStockCount} item(s) are completely out of stock. `}
                {lowStockCount > 0 && `${lowStockCount} item(s) are below minimum safety threshold.`}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="btn btn-sm btn-secondary"
              style={{ fontSize: "0.78rem" }}
              onClick={() => setStockFilter("low")}
            >
              Filter Low Stock ({lowStockCount})
            </button>
            {outOfStockCount > 0 && (
              <button
                className="btn btn-sm btn-danger"
                style={{ fontSize: "0.78rem" }}
                onClick={() => setStockFilter("out")}
              >
                Filter Out of Stock ({outOfStockCount})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "280px" }}>
          <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
            <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "12px" }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "36px", fontSize: "0.85rem" }}
              placeholder="Search items by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            style={{ width: "200px", fontSize: "0.85rem" }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Pills */}
        <div style={{ display: "flex", gap: "6px" }}>
          {[
            { id: "all", label: "All Items" },
            { id: "healthy", label: "In Stock" },
            { id: "low", label: "Low Stock" },
            { id: "out", label: "Out of Stock" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStockFilter(f.id)}
              className={`btn btn-sm ${stockFilter === f.id ? "btn-dark" : "btn-secondary"}`}
              style={{ fontSize: "0.78rem", padding: "6px 12px" }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th style={{ textAlign: "right" }}>Cost Price</th>
                <th style={{ textAlign: "right" }}>Selling Price</th>
                <th style={{ textAlign: "center" }}>Current Stock</th>
                <th style={{ textAlign: "center" }}>Min Threshold</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const isOut = product.stock === 0;
                const isLow = product.stock > 0 && product.stock <= product.minStock;

                return (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: "42px", height: "42px", borderRadius: "var(--radius-md)", objectFit: "cover" }}
                        />
                        <div>
                          <div style={{ fontWeight: "700", color: "var(--text-main)" }}>{product.name}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            Unit: {product.unit} • {product.packSize}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{product.category}</span>
                    </td>
                    <td style={{ textAlign: "right", color: "var(--text-muted)" }}>
                      {formatCurrency(product.costPrice || product.price * 0.6)}
                    </td>
                    <td style={{ textAlign: "right", fontWeight: "700", color: "var(--primary-dark)" }}>
                      {formatCurrency(product.price)}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontWeight: "800", fontSize: "0.95rem", color: isOut ? "var(--accent-red)" : isLow ? "var(--accent-amber)" : "var(--text-main)" }}>
                          {product.stock}
                        </span>
                        {/* Quick stock add buttons */}
                        <button
                          className="btn btn-secondary btn-icon"
                          style={{ width: "22px", height: "22px", border: "1px solid var(--border-light)", fontSize: "0.7rem" }}
                          onClick={() => quickReorderStock(product.id, 50)}
                          title="Quick +50 stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", color: "var(--text-muted)", fontWeight: "600" }}>
                      {product.minStock} {product.unit}s
                    </td>
                    <td>
                      {isOut ? (
                        <span className="badge badge-danger">Out of Stock</span>
                      ) : isLow ? (
                        <span className="badge badge-warning">Low Stock</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          className="btn btn-secondary btn-icon"
                          style={{ width: "30px", height: "30px" }}
                          onClick={() => handleOpenEdit(product)}
                          title="Edit Item"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-icon"
                          style={{ width: "30px", height: "30px" }}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          title="Delete Item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Stationery Item"
        subtitle="Introduce new products or laboratory items to the campus catalog"
        maxWidth="580px"
      >
        <form onSubmit={handleSaveAdd}>
          <div className="form-group">
            <label className="form-label">Item Name *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Graph Sheets Pack of 20"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.filter((c) => c !== "All Items").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Unit Type</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. sheet, book, pack"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                className="form-input"
                placeholder="₹ Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Stock *</label>
              <input
                type="number"
                required
                min="0"
                className="form-input"
                placeholder="Qty"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Min Stock Level *</label>
              <input
                type="number"
                required
                min="1"
                className="form-input"
                placeholder="Alert Level"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Product specification, brand, or usage instructions..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Stationery Item
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        title={`Edit Product: ${editingProduct?.name || ""}`}
        subtitle="Update pricing, stock levels, or item specifications"
        maxWidth="580px"
      >
        <form onSubmit={handleSaveEdit}>
          <div className="form-group">
            <label className="form-label">Item Name *</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.filter((c) => c !== "All Items").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                className="form-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div className="form-group">
              <label className="form-label">Current Stock Count *</label>
              <input
                type="number"
                required
                min="0"
                className="form-input"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Min Alert Level *</label>
              <input
                type="number"
                required
                min="1"
                className="form-input"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
            <button type="button" className="btn btn-secondary" onClick={() => setEditingProduct(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
