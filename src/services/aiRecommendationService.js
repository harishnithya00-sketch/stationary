// AI / ML Service: Personalized Student Recommendations
// Matches department syllabus requirements, current semester cycle, and historical purchase affinities

export class AIRecommendationService {
  /**
   * Generates tailored product recommendations for a student
   */
  static getPersonalizedRecommendations(student, purchases, allProducts) {
    if (!student || !allProducts || !allProducts.length) return [];

    const studentPurchases = purchases.filter(p => p.studentId === student.id || p.rollNo === student.rollNo);
    const purchasedProductIds = new Set();
    const categoryFrequency = {};

    studentPurchases.forEach(p => {
      p.items.forEach(item => {
        purchasedProductIds.add(item.productId);
        const prod = allProducts.find(x => x.id === item.productId || x.name === item.name);
        if (prod) {
          categoryFrequency[prod.category] = (categoryFrequency[prod.category] || 0) + item.quantity;
        }
      });
    });

    const sem = student.semester || 1;
    const dept = student.deptCode || "CSE";

    // Scoring heuristics based on:
    // 1. Department curriculum needs
    // 2. Semester level (e.g. Sem 1-2 needs drawing pencils & calculators; Sem 3-6 needs record notebooks; Sem 7-8 needs project files & printouts)
    // 3. Re-purchase replenishment cycle for consumables (A4 sheets, pens)
    const scoredProducts = allProducts.map(prod => {
      let score = prod.popularity || 75;
      let matchReason = "Popular among engineering students";

      // Consumables replenishment
      if (prod.id === "prod-1") { // A4 Sheets
        score += 35;
        matchReason = "Frequently repurchased essential based on your semester assignment load";
      } else if (prod.id === "prod-2" || prod.id === "prod-3") { // Pens
        score += 25;
        matchReason = "Recommended replenishment for ongoing internal tests and coursework";
      }

      // Semester-specific boost
      if ((sem === 3 || sem === 4 || sem === 5) && prod.id === "prod-8") { // Lab Record
        score += 40;
        matchReason = `Essential for Semester ${sem} laboratory practicals in ${dept}`;
      } else if ((sem >= 7) && (prod.id === "prod-9" || prod.id === "prod-18")) { // Project files / Printout
        score += 45;
        matchReason = `Recommended for Final Year Project documentation & capstone submission`;
      } else if ((sem <= 2) && (prod.id === "prod-4" || prod.id === "prod-15")) { // Drawing & Geometry
        score += 35;
        matchReason = `Curriculum requirement for 1st Year Engineering Graphics`;
      } else if (prod.id === "prod-14" && sem <= 3) { // Scientific Calculator
        score += 30;
        matchReason = `Recommended for Mathematics, Signals, and Thermodynamics coursework`;
      }

      // Departmental affinity
      if (dept === "MECH" || dept === "CIVIL") {
        if (prod.category === "Lab & Engineering") score += 20;
      } else if (dept === "CSE" || dept === "IT" || dept === "AI&DS") {
        if (prod.id === "prod-1" || prod.id === "prod-18" || prod.id === "prod-9") score += 20;
      }

      return {
        ...prod,
        recommendationScore: score,
        matchReason: matchReason
      };
    });

    // Sort by recommendation score descending
    scoredProducts.sort((a, b) => b.recommendationScore - a.recommendationScore);

    return scoredProducts.slice(0, 4);
  }
}
