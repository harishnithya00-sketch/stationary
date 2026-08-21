// Database Manager for Nandha Engineering College Smart Stationery System
// LocalStorage Persistence, Unique Registration Number Indexing & Auto-Recalculation
import { INITIAL_PRODUCTS } from "./initialProducts";
import { INITIAL_STUDENTS } from "./initialStudents";
import { INITIAL_PURCHASES } from "./initialPurchases";

const STORAGE_KEYS = {
  PRODUCTS: "smartstat_products_v2",
  STUDENTS: "smartstat_students_v2",
  PURCHASES: "smartstat_purchases_v2",
  ADMIN_SETTINGS: "smartstat_admin_settings_v2",
  NOTIFICATIONS: "smartstat_notifications_v2"
};

export const Database = {
  // Initialize Database
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PURCHASES)) {
      localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(INITIAL_PURCHASES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_SETTINGS)) {
      localStorage.setItem(
        STORAGE_KEYS.ADMIN_SETTINGS,
        JSON.stringify({
          collegeName: "Nandha Engineering College",
          storeName: "Central Campus Stationery & Digital Store",
          gstNumber: "33AABCN1234F1Z9",
          taxRate: 5,
          lowStockThresholdGlobal: 100,
          currency: "₹"
        })
      );
    }
  },

  // Reset to default seed data
  resetToDefaults: () => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(INITIAL_PURCHASES));
    return { success: true, message: "Database reset to clean Nandha Engineering College initial seeds." };
  },

  // Products CRUD
  getProducts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts: (products) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  addProduct: (product) => {
    const products = Database.getProducts();
    const newProduct = {
      ...product,
      id: `prod-${Date.now()}`,
      popularity: product.popularity || 70,
      stock: Number(product.stock),
      price: Number(product.price),
      costPrice: Number(product.costPrice || (product.price * 0.6).toFixed(0)),
      minStock: Number(product.minStock || 50)
    };
    products.unshift(newProduct);
    Database.saveProducts(products);
    return newProduct;
  },

  updateProduct: (id, updatedFields) => {
    const products = Database.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...updatedFields,
        stock: updatedFields.stock !== undefined ? Number(updatedFields.stock) : products[index].stock,
        price: updatedFields.price !== undefined ? Number(updatedFields.price) : products[index].price,
        minStock: updatedFields.minStock !== undefined ? Number(updatedFields.minStock) : products[index].minStock
      };
      Database.saveProducts(products);
      return products[index];
    }
    return null;
  },

  deleteProduct: (id) => {
    const products = Database.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    Database.saveProducts(filtered);
    return filtered;
  },

  adjustStock: (id, delta) => {
    const products = Database.getProducts();
    const product = products.find((p) => p.id === id);
    if (product) {
      product.stock = Math.max(0, product.stock + delta);
      Database.saveProducts(products);
      return product;
    }
    return null;
  },

  // Students Authentication & Management
  getStudents: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  saveStudents: (students) => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getStudentByRegNo: (regNo) => {
    if (!regNo) return null;
    const cleanReg = regNo.trim().toUpperCase();
    const students = Database.getStudents();
    return students.find(
      (s) =>
        (s.registration_number && s.registration_number.toUpperCase() === cleanReg) ||
        (s.rollNo && s.rollNo.toUpperCase() === cleanReg) ||
        s.id === regNo ||
        s.student_id === regNo
    ) || null;
  },

  verifyStudentCredentials: (regNo, passwordHash) => {
    const student = Database.getStudentByRegNo(regNo);
    if (!student) return null;
    if (student.password_hash === passwordHash) {
      return student;
    }
    return null;
  },

  addStudent: (studentData) => {
    const students = Database.getStudents();
    const cleanReg = studentData.registration_number.trim().toUpperCase();

    // Check unique registration number
    const existing = students.find(
      (s) => (s.registration_number && s.registration_number.toUpperCase() === cleanReg) || (s.rollNo && s.rollNo.toUpperCase() === cleanReg)
    );
    if (existing) {
      throw new Error("This Registration Number is already registered.");
    }

    const newStudent = {
      student_id: `STU-${cleanReg}`,
      student_name: studentData.student_name || studentData.name,
      registration_number: cleanReg,
      id: `STU-${cleanReg}`,
      name: studentData.student_name || studentData.name,
      rollNo: cleanReg,
      email: studentData.email.trim().toLowerCase(),
      department: studentData.department,
      deptCode: studentData.deptCode || studentData.department.split(" ").map(w => w[0]).join("").slice(0, 4),
      year: studentData.year.toString(),
      semester: Number(studentData.semester),
      section: (studentData.section || "A").toUpperCase(),
      phone: studentData.phone || "+91 98450 00000",
      cgpa: studentData.cgpa || 8.0,
      hosteller: studentData.hosteller !== undefined ? studentData.hosteller : true,
      avatarColor: studentData.avatarColor || "#059669",
      password_hash: studentData.password_hash,
      totalPurchasesCount: 0,
      totalSpent: 0,
      mostUsedItem: "None Yet",
      created_at: new Date().toISOString()
    };

    students.unshift(newStudent);
    Database.saveStudents(students);
    return newStudent;
  },

  updateStudentProfile: (regNo, updatedFields) => {
    const students = Database.getStudents();
    const cleanReg = regNo.trim().toUpperCase();
    const index = students.findIndex(
      (s) => (s.registration_number && s.registration_number.toUpperCase() === cleanReg) || (s.rollNo && s.rollNo.toUpperCase() === cleanReg)
    );

    if (index !== -1) {
      // Registration number must NOT be modified
      const current = students[index];
      const updated = {
        ...current,
        student_name: updatedFields.student_name || updatedFields.name || current.student_name,
        name: updatedFields.student_name || updatedFields.name || current.name,
        email: updatedFields.email ? updatedFields.email.trim().toLowerCase() : current.email,
        department: updatedFields.department || current.department,
        year: updatedFields.year !== undefined ? updatedFields.year.toString() : current.year,
        semester: updatedFields.semester !== undefined ? Number(updatedFields.semester) : current.semester,
        section: updatedFields.section ? updatedFields.section.toUpperCase() : current.section,
        phone: updatedFields.phone || current.phone,
        password_hash: updatedFields.password_hash || current.password_hash
      };

      students[index] = updated;
      Database.saveStudents(students);
      return updated;
    }
    return null;
  },

  // Purchases / Orders
  getPurchases: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PURCHASES);
      return data ? JSON.parse(data) : INITIAL_PURCHASES;
    } catch {
      return INITIAL_PURCHASES;
    }
  },

  savePurchases: (purchases) => {
    localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
  },

  createPurchase: (purchaseData) => {
    const purchases = Database.getPurchases();
    const products = Database.getProducts();
    const students = Database.getStudents();

    const regNo = (purchaseData.registration_number || purchaseData.rollNo || "").trim().toUpperCase();
    const newBillNumber = `NEC-BILL-2024-${1000 + purchases.length + 1}`;

    const newPurchase = {
      id: `PUR-${Date.now()}`,
      billNumber: newBillNumber,
      date: new Date().toISOString().split("T")[0],
      registration_number: regNo,
      student_name: purchaseData.student_name || purchaseData.studentName,
      studentId: purchaseData.studentId || `STU-${regNo}`,
      studentName: purchaseData.student_name || purchaseData.studentName,
      rollNo: regNo,
      department: purchaseData.department,
      deptCode: purchaseData.deptCode || "ENGG",
      semester: Number(purchaseData.semester) || 1,
      academicYear: purchaseData.academicYear || "2024-2025",
      items: purchaseData.items,
      subtotal: purchaseData.subtotal,
      discount: purchaseData.discount || 0,
      tax: purchaseData.tax || 0,
      totalAmount: purchaseData.totalAmount,
      paymentMethod: purchaseData.paymentMethod || "Student Smart Card / UPI",
      paymentStatus: "Paid",
      isAnomaly: false
    };

    // Deduct stock
    purchaseData.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId || p.name === item.name);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        prod.popularity = (prod.popularity || 70) + 1;
      }
    });

    // Update student totals
    const student = students.find(
      (s) => (s.registration_number && s.registration_number.toUpperCase() === regNo) || (s.rollNo && s.rollNo.toUpperCase() === regNo)
    );
    if (student) {
      student.totalPurchasesCount = (student.totalPurchasesCount || 0) + 1;
      student.totalSpent = (student.totalSpent || 0) + purchaseData.totalAmount;
    }

    purchases.unshift(newPurchase);
    Database.savePurchases(purchases);
    Database.saveProducts(products);
    Database.saveStudents(students);

    return newPurchase;
  },

  getSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SETTINGS);
      return data
        ? JSON.parse(data)
        : {
            collegeName: "Nandha Engineering College",
            storeName: "Central Campus Stationery & Digital Store",
            gstNumber: "33AABCN1234F1Z9",
            taxRate: 5,
            currency: "₹"
          };
    } catch {
      return {
        collegeName: "Nandha Engineering College",
        storeName: "Central Campus Stationery & Digital Store",
        gstNumber: "33AABCN1234F1Z9",
        taxRate: 5,
        currency: "₹"
      };
    }
  }
};

// Initialize DB on import
Database.init();
