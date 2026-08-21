// AI / ML Service: Admin Inventory Stock Demand Forecasting & Reorder Optimization
// Simulates XGBoost / Random Forest style multi-feature demand forecasting

export class AIForecastingService {
  /**
   * Generates comprehensive inventory demand forecast, stock risks, and smart reorder suggestions
   */
  static generateInventoryForecast(products, purchases, students) {
    if (!products || !products.length) return [];

    const totalStudents = students ? students.length : 50;

    return products.map(product => {
      // Calculate total historical units sold
      let unitsSold30Days = 0;
      let totalUnitsSold = 0;
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      purchases.forEach(purchase => {
        const pDate = new Date(purchase.date);
        purchase.items.forEach(item => {
          if (item.productId === product.id || item.name === product.name) {
            const q = Number(item.quantity) || 0;
            totalUnitsSold += q;
            if (pDate >= thirtyDaysAgo) {
              unitsSold30Days += q;
            }
          }
        });
      });

      // Monthly usage estimation
      const avgMonthlyUsage = Math.max(
        Math.round(unitsSold30Days * 1.2),
        Math.round((product.minStock || 50) * 1.5)
      );

      // AI Forecast multiplier based on upcoming exams & semester start factors
      const seasonalSurgeFactor = product.id === "prod-1" ? 1.36 : product.id === "prod-8" ? 1.45 : 1.22;
      const predictedNextMonthDemand = Math.round(avgMonthlyUsage * seasonalSurgeFactor);

      // Determine stock status and risk
      const currentStock = product.stock;
      let status = "Good";
      let statusClass = "status-good";
      let riskLevel = "low";
      let recommendation = "Stock level is sufficient. No action required.";
      let reorderQuantity = 0;

      if (currentStock === 0) {
        status = "Out of Stock";
        statusClass = "status-critical";
        riskLevel = "critical";
        reorderQuantity = predictedNextMonthDemand + product.minStock;
        recommendation = `URGENT: Stock depleted! Reorder at least ${reorderQuantity.toLocaleString()} ${product.unit}s immediately.`;
      } else if (currentStock < product.minStock || currentStock < predictedNextMonthDemand) {
        status = "Low Stock Risk";
        statusClass = "status-warning";
        riskLevel = "high";
        reorderQuantity = Math.max(
          predictedNextMonthDemand - currentStock + product.minStock,
          product.minStock
        );
        // Clean round to nice numbers
        if (reorderQuantity > 100) {
          reorderQuantity = Math.ceil(reorderQuantity / 50) * 50;
        } else if (reorderQuantity > 10) {
          reorderQuantity = Math.ceil(reorderQuantity / 5) * 5;
        }
        recommendation = `Purchase approximately ${reorderQuantity.toLocaleString()} additional ${product.name} to prevent shortage during upcoming submissions.`;
      } else if (currentStock > predictedNextMonthDemand * 2.5) {
        status = "Surplus";
        statusClass = "status-info";
        riskLevel = "minimal";
        recommendation = `Healthy buffer. Monitor aging stock (approx ${Math.round(currentStock / avgMonthlyUsage)} months supply).`;
      }

      // Model confidence
      const confidence = currentStock > 0 ? (88 + (product.popularity % 10)) : 99;

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image,
        currentStock: currentStock,
        minStock: product.minStock,
        avgMonthlyUsage: avgMonthlyUsage,
        predictedNextMonthDemand: predictedNextMonthDemand,
        status: status,
        statusClass: statusClass,
        riskLevel: riskLevel,
        recommendation: recommendation,
        reorderQuantity: reorderQuantity,
        unit: product.unit,
        price: product.price,
        confidence: Math.min(98, confidence),
        burnRateDays: avgMonthlyUsage > 0 ? Math.round((currentStock / (avgMonthlyUsage / 30))) : 999
      };
    });
  }
}
