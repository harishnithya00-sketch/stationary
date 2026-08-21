// Historical Purchase Data linked to Student Registration Numbers for Nandha Engineering College
import { INITIAL_PRODUCTS } from "./initialProducts";
import { INITIAL_STUDENTS } from "./initialStudents";

export const generateInitialPurchases = () => {
  const purchases = [];
  let billCounter = 1001;

  // Key sample purchases for Harish V (24IT101 - 2nd Year, 3rd Sem Information Technology)
  const harish = INITIAL_STUDENTS[0];
  const harishHistory = [
    // Semester 1 (2023-2024)
    {
      date: "2023-09-12",
      semester: 1,
      academicYear: "2023-2024",
      items: [
        { productId: "prod-1", name: "A4 Copier Sheets (75 GSM)", quantity: 100, price: 2 },
        { productId: "prod-2", name: "Blue Ballpoint Pen (0.7mm)", quantity: 5, price: 10 },
        { productId: "prod-6", name: "College Long Notebook (192 Pages, Ruled)", quantity: 4, price: 45 },
        { productId: "prod-4", name: "Engineering Drawing Pencil (2B / 2H)", quantity: 2, price: 8 }
      ]
    },
    {
      date: "2023-11-25",
      semester: 1,
      academicYear: "2023-2024",
      items: [
        { productId: "prod-1", name: "A4 Copier Sheets (75 GSM)", quantity: 50, price: 2 },
        { productId: "prod-5", name: "Dust-Free Eraser (Large)", quantity: 2, price: 5 },
        { productId: "prod-18", name: "Laser B&W Printout (Per Page)", quantity: 25, price: 3 }
      ]
    },
    // Semester 2 (2023-2024)
    {
      date: "2024-02-14",
      semester: 2,
      academicYear: "2023-2024",
      items: [
        { productId: "prod-1", name: "A4 Copier Sheets (75 GSM)", quantity: 150, price: 2 },
        { productId: "prod-2", name: "Blue Ballpoint Pen (0.7mm)", quantity: 8, price: 10 },
        { productId: "prod-8", name: "Hardbound Laboratory Record Notebook", quantity: 3, price: 65 },
        { productId: "prod-11", name: "Engineering Lab Observation Sheet (Pack of 25)", quantity: 2, price: 30 }
      ]
    },
    {
      date: "2024-04-20",
      semester: 2,
      academicYear: "2023-2024",
      items: [
        { productId: "prod-9", name: "Transparent Project Report File", quantity: 4, price: 20 },
        { productId: "prod-18", name: "Laser B&W Printout (Per Page)", quantity: 40, price: 3 },
        { productId: "prod-13", name: "Pastel Highlighter Set (4 Colors)", quantity: 1, price: 60 }
      ]
    },
    // Semester 3 (Current Ongoing 2024-2025)
    {
      date: "2024-08-14",
      semester: 3,
      academicYear: "2024-2025",
      items: [
        { productId: "prod-1", name: "A4 Copier Sheets (75 GSM)", quantity: 180, price: 2 },
        { productId: "prod-2", name: "Blue Ballpoint Pen (0.7mm)", quantity: 12, price: 10 },
        { productId: "prod-3", name: "Black Gel Pen (Pilot Style 0.5mm)", quantity: 3, price: 15 },
        { productId: "prod-8", name: "Hardbound Laboratory Record Notebook", quantity: 5, price: 65 }
      ]
    },
    {
      date: "2024-08-20",
      semester: 3,
      academicYear: "2024-2025",
      items: [
        { productId: "prod-9", name: "Transparent Project Report File", quantity: 5, price: 20 },
        { productId: "prod-10", name: "Button Document Folder (Polypropylene)", quantity: 2, price: 25 },
        { productId: "prod-18", name: "Laser B&W Printout (Per Page)", quantity: 50, price: 3 }
      ]
    }
  ];

  harishHistory.forEach((hist) => {
    const subtotal = hist.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const tax = Math.round(subtotal * 0.05);
    const discount = subtotal >= 500 ? Math.round(subtotal * 0.05) : 0;
    const total = subtotal + tax - discount;
    const billId = `NEC-BILL-2024-${billCounter++}`;

    purchases.push({
      id: `PUR-${billId}`,
      billNumber: billId,
      registration_number: harish.registration_number,
      student_name: harish.student_name,
      studentId: harish.student_id,
      studentName: harish.student_name,
      rollNo: harish.registration_number,
      department: harish.department,
      deptCode: harish.deptCode,
      semester: hist.semester,
      academicYear: hist.academicYear,
      date: hist.date,
      items: hist.items,
      subtotal,
      discount,
      tax,
      totalAmount: total,
      paymentMethod: "Student Smart Card / UPI",
      paymentStatus: "Paid",
      isAnomaly: false
    });
  });

  // Aarav Sharma (22CS101) sample history
  const aarav = INITIAL_STUDENTS[1];
  if (aarav) {
    const aaravHistory = [
      {
        date: "2022-09-15",
        semester: 1,
        academicYear: "2022-2023",
        items: [
          { productId: "prod-1", name: "A4 Copier Sheets (75 GSM)", quantity: 120, price: 2 },
          { productId: "prod-2", name: "Blue Ballpoint Pen (0.7mm)", quantity: 8, price: 10 },
          { productId: "prod-6", name: "College Long Notebook (192 Pages, Ruled)", quantity: 4, price: 45 }
        ]
      },
      {
        date: "2023-08-22",
        semester: 3,
        academicYear: "2023-2024",
        items: [
          { productId: "prod-1", name: "A4 Copier Sheets (75 GSM)", quantity: 160, price: 2 },
          { productId: "prod-8", name: "Hardbound Laboratory Record Notebook", quantity: 4, price: 65 }
        ]
      },
      {
        date: "2024-08-16",
        semester: 5,
        academicYear: "2024-2025",
        items: [
          { productId: "prod-1", name: "A4 Copier Sheets (75 GSM)", quantity: 190, price: 2 },
          { productId: "prod-9", name: "Transparent Project Report File", quantity: 6, price: 20 }
        ]
      }
    ];

    aaravHistory.forEach((hist) => {
      const subtotal = hist.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
      const tax = Math.round(subtotal * 0.05);
      const discount = subtotal >= 500 ? Math.round(subtotal * 0.05) : 0;
      const total = subtotal + tax - discount;
      const billId = `NEC-BILL-2024-${billCounter++}`;

      purchases.push({
        id: `PUR-${billId}`,
        billNumber: billId,
        registration_number: aarav.registration_number,
        student_name: aarav.student_name,
        studentId: aarav.student_id,
        studentName: aarav.student_name,
        rollNo: aarav.registration_number,
        department: aarav.department,
        deptCode: aarav.deptCode,
        semester: hist.semester,
        academicYear: hist.academicYear,
        date: hist.date,
        items: hist.items,
        subtotal,
        discount,
        tax,
        totalAmount: total,
        paymentMethod: "Student Smart Card / UPI",
        paymentStatus: "Paid",
        isAnomaly: false
      });
    });
  }

  // Devansh Kulkarni (22CS116) - Anomaly demonstration
  const devansh = INITIAL_STUDENTS.find(s => s.hasAnomaly);
  if (devansh) {
    const anomalyDates = ["2024-07-15", "2024-07-28", "2024-08-05", "2024-08-14", "2024-08-19"];
    anomalyDates.forEach((date, i) => {
      const items = [
        { productId: "prod-1", name: "A4 Copier Sheets (75 GSM)", quantity: 140 + (i * 25), price: 2 },
        { productId: "prod-2", name: "Blue Ballpoint Pen (0.7mm)", quantity: 15, price: 10 },
        { productId: "prod-9", name: "Transparent Project Report File", quantity: 12, price: 20 }
      ];
      const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + tax;
      const billId = `NEC-BILL-2024-${billCounter++}`;

      purchases.push({
        id: `PUR-${billId}`,
        billNumber: billId,
        registration_number: devansh.registration_number,
        student_name: devansh.student_name,
        studentId: devansh.student_id,
        studentName: devansh.student_name,
        rollNo: devansh.registration_number,
        department: devansh.department,
        deptCode: devansh.deptCode,
        semester: devansh.semester,
        academicYear: "2024-2025",
        date,
        items,
        subtotal,
        discount: 0,
        tax,
        totalAmount: total,
        paymentMethod: "UPI",
        paymentStatus: "Paid",
        isAnomaly: true,
        anomalyReason: "Monthly A4 consumption exceeds 650 sheets (Standard threshold: 100-200 sheets)"
      });
    });
  }

  // Distributed non-duplicate purchases for remaining students
  const sampleDates = [
    "2024-08-01", "2024-08-03", "2024-08-05", "2024-08-08", "2024-08-10",
    "2024-08-12", "2024-08-14", "2024-08-15", "2024-08-17", "2024-08-18",
    "2024-08-19", "2024-08-20", "2024-08-21"
  ];

  INITIAL_STUDENTS.slice(2, 40).forEach((student, sIdx) => {
    if (student.hasAnomaly) return;
    const count = 2 + (sIdx % 3);
    for (let c = 0; c < count; c++) {
      const pCount = 1 + ((sIdx + c) % 3);
      const items = [];
      for (let p = 0; p < pCount; p++) {
        const prod = INITIAL_PRODUCTS[(sIdx * 3 + c + p) % INITIAL_PRODUCTS.length];
        const qty = prod.id === "prod-1" ? (30 + ((sIdx * 10) % 80)) : (1 + ((sIdx + p) % 4));
        items.push({
          productId: prod.id,
          name: prod.name,
          quantity: qty,
          price: prod.price
        });
      }
      const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
      const tax = Math.round(subtotal * 0.05);
      const discount = subtotal >= 400 ? Math.round(subtotal * 0.05) : 0;
      const total = subtotal + tax - discount;
      const date = sampleDates[(sIdx + c) % sampleDates.length];
      const billId = `NEC-BILL-2024-${billCounter++}`;

      purchases.push({
        id: `PUR-${billId}`,
        billNumber: billId,
        registration_number: student.registration_number,
        student_name: student.student_name,
        studentId: student.student_id,
        studentName: student.student_name,
        rollNo: student.registration_number,
        department: student.department,
        deptCode: student.deptCode,
        semester: student.semester,
        academicYear: "2024-2025",
        date,
        items,
        subtotal,
        discount,
        tax,
        totalAmount: total,
        paymentMethod: (sIdx + c) % 2 === 0 ? "Student Smart Card" : "UPI / Cash",
        paymentStatus: "Paid",
        isAnomaly: false
      });
    }
  });

  return purchases;
};

export const INITIAL_PURCHASES = generateInitialPurchases();
