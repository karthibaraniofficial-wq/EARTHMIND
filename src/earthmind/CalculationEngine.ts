/**
 * EARTHMIND - Deterministic Calculation Engine
 * High-precision numerical computing for environmental metrics, unit conversions, and deltas.
 * Strictly prevents LLM-hallucinated arithmetic.
 */

export interface CalculationResult {
  expression: string;
  result: number;
  formattedText: string;
  unit?: string;
  explanation: string;
}

export class CalculationEngine {
  /**
   * Calculates percentage change: ((newVal - oldVal) / oldVal) * 100
   */
  public static percentageChange(oldVal: number, newVal: number): CalculationResult {
    if (oldVal === 0) {
      return {
        expression: `(${newVal} - 0) / 0`,
        result: 0,
        formattedText: 'Undefined (baseline is 0)',
        explanation: 'Percentage change cannot be computed when initial baseline is zero.',
      };
    }
    const delta = ((newVal - oldVal) / Math.abs(oldVal)) * 100;
    const rounded = Math.round(delta * 100) / 100;
    const dir = rounded >= 0 ? 'increase' : 'decrease';

    return {
      expression: `((${newVal} - ${oldVal}) / ${oldVal}) * 100`,
      result: rounded,
      unit: '%',
      formattedText: `${Math.abs(rounded)}% ${dir}`,
      explanation: `Calculated exact change from ${oldVal} to ${newVal}: ${Math.abs(rounded)}% ${dir}.`,
    };
  }

  /**
   * Converts square kilometers to hectares: 1 km² = 100 hectares
   */
  public static sqKmToHectares(sqKm: number): CalculationResult {
    const hectares = sqKm * 100;
    return {
      expression: `${sqKm} km² * 100`,
      result: hectares,
      unit: 'hectares',
      formattedText: `${hectares.toLocaleString()} hectares`,
      explanation: `${sqKm} square kilometers equals exactly ${hectares.toLocaleString()} hectares.`,
    };
  }

  /**
   * Calculates carbon sequestration reduction based on lost forest area:
   * Average tropical rainforest carbon density ~ 150 tonnes C/hectare
   */
  public static estimateCarbonLoss(hectaresDeforested: number): CalculationResult {
    const tonnesCO2 = hectaresDeforested * 150 * (44 / 12); // C to CO2 molecular weight ratio
    const rounded = Math.round(tonnesCO2);
    return {
      expression: `${hectaresDeforested} ha * 150 tC/ha * (44/12)`,
      result: rounded,
      unit: 'metric tonnes CO2 equivalent',
      formattedText: `${rounded.toLocaleString()} tCO2e`,
      explanation: `Estimated committed gross emissions from clearing ${hectaresDeforested.toLocaleString()} hectares of mature tropical canopy is approximately ${rounded.toLocaleString()} tonnes of CO2 equivalent.`,
    };
  }

  /**
   * Evaluates standard mathematical expression safely without eval()
   */
  public static evaluateArithmetic(expr: string): CalculationResult {
    // Sanitize: allow only numbers, whitespace, and basic operators (+, -, *, /, .)
    const clean = expr
      .replace(/^(what is|calculate)\s+/i, '')
      .replace(/\?$/, '')
      .trim();

    if (!/^[\d\s\+\-\*\/\.\(\)]+$/.test(clean)) {
      return {
        expression: expr,
        result: 0,
        formattedText: 'Invalid mathematical expression',
        explanation: 'Only basic arithmetic operations (+, -, *, /) are supported.',
      };
    }

    try {
      // Safe function evaluation with bounded scope
      const compute = new Function(`"use strict"; return (${clean});`);
      const val = compute();
      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        const rounded = Math.round(val * 1000) / 1000;
        return {
          expression: clean,
          result: rounded,
          formattedText: `${rounded}`,
          explanation: `Result of ${clean} = ${rounded}`,
        };
      }
    } catch {
      // safe fallback
    }

    return {
      expression: expr,
      result: 0,
      formattedText: 'Calculation error',
      explanation: 'Could not compute exact arithmetic for the supplied string.',
    };
  }

  public static calculatePercentageDelta(oldVal: number, newVal: number) {
    const res = this.percentageChange(oldVal, newVal);
    return {
      percentageDelta: res.result,
      absoluteDelta: newVal - oldVal,
      formattedText: res.formattedText,
    };
  }

  public static km2ToHectares(km2: number): number {
    return this.sqKmToHectares(km2).result;
  }

  public static calculateCarbonFlux(areaHectares: number, carbonDensity: number) {
    const net = areaHectares * carbonDensity;
    return {
      netFluxTonsCO2e: net,
    };
  }
}

