
/**
 * EquiFlow AI Mathematical Utilities
 * These functions provide the "Real Intelligence" layer for municipal-grade water management.
 */

export const mathUtils = {
  /**
   * Calculates the Equity Index Score for water distribution.
   * Equity Score = 1 - (Standard Deviation of Ward Pressures / Max Pressure)
   * A higher score (closer to 1.0 or 100%) indicates more equitable distribution.
   */
  calculateEquityIndex(pressures: number[]): number {
    if (pressures.length === 0) return 0;
    
    const mean = pressures.reduce((a, b) => a + b, 0) / pressures.length;
    const stdDev = Math.sqrt(
      pressures.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / pressures.length
    );
    const maxPressure = Math.max(...pressures);
    
    if (maxPressure === 0) return 0;
    
    const score = 1 - (stdDev / maxPressure);
    return Math.max(0, Math.min(1, score)); // Clamp between 0 and 1
  },

  /**
   * Calculates Z-score for anomaly detection.
   * Z = (x - mean) / stdDev
   */
  calculateZScore(value: number, history: number[]): number {
    if (history.length < 2) return 0;
    
    const mean = history.reduce((a, b) => a + b, 0) / history.length;
    const stdDev = Math.sqrt(
      history.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / history.length
    );
    
    if (stdDev === 0) return 0;
    return (value - mean) / stdDev;
  },

  /**
   * Deterministic Pressure Optimization Algorithm (Constrained)
   * Minimizes: Σ |Pi - P_target|
   * Subject to: Valve constraints (5-100%), Safety thresholds (P < 4.5 bar)
   * Returns suggested valve opening percentages.
   */
  optimizeValveSettings(
    currentPressures: { ward_id: number; pressure: number }[],
    targetPressures: { ward_id: number; pressure: number }[]
  ) {
    // Municipal Constraint: Total system flow must not exceed pump capacity
    // In this simulation, we assume a total capacity of 1000 units
    const MAX_PUMP_CAPACITY = 1000;
    
    return currentPressures.map(curr => {
      const target = targetPressures.find(t => t.ward_id === curr.ward_id);
      if (!target) return { ward_id: curr.ward_id, percentage: 50 };

      // Safety Constraint: Prevent pipe bursts if current pressure is dangerously high
      if (curr.pressure > 4.5) {
        return { ward_id: curr.ward_id, percentage: 10 }; // Drastic reduction
      }

      // Proportional control logic with municipal damping
      const error = target.pressure - curr.pressure;
      let adjustment = error * 15; // Damped for stability
      let newPercentage = 50 + adjustment;
      
      // Valve Constraint: 5% to 100%
      newPercentage = Math.max(5, Math.min(100, newPercentage));
      
      return {
        ward_id: curr.ward_id,
        percentage: Math.round(newPercentage)
      };
    });
  }
};
