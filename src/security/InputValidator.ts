/**
 * EARTHMIND - Input Validator & Execution Safety Engine
 * Validates types, bounds, coordinates, and ensures external content is untrusted data.
 */

export class InputValidator {
  /**
   * Validates simulation variable name and delta bounds (-100 to +100).
   */
  public static validateSimulationVariable(
    variable: string,
    value: number
  ): { valid: boolean; normalizedValue: number; error?: string } {
    const allowed = [
      'treeCoverDelta',
      'treeCover',
      'rainfallDelta',
      'rainfall',
      'urbanizationDelta',
      'urbanization',
      'wasteDelta',
      'waste',
      'waterDelta',
      'water',
      'trafficDelta',
      'traffic',
      'energyEfficiencyDelta',
      'energyEfficiency',
    ];

    if (!allowed.includes(variable)) {
      return { valid: false, normalizedValue: 0, error: `Invalid simulation variable: "${variable}"` };
    }

    if (typeof value !== 'number' || isNaN(value)) {
      return { valid: false, normalizedValue: 0, error: `Value must be a valid number, got ${value}` };
    }

    // Strict bounds: -100 to +100
    const clamped = Math.max(-100, Math.min(100, value));
    return { valid: true, normalizedValue: clamped };
  }

  /**
   * Validates geographic coordinates (-90 <= lat <= 90, -180 <= lng <= 180).
   */
  public static validateCoordinates(
    lat: number,
    lng: number
  ): { valid: boolean; error?: string } {
    if (typeof lat !== 'number' || lat < -90 || lat > 90) {
      return { valid: false, error: `Latitude out of range [-90, 90]: ${lat}` };
    }
    if (typeof lng !== 'number' || lng < -180 || lng > 180) {
      return { valid: false, error: `Longitude out of range [-180, 180]: ${lng}` };
    }
    return { valid: true };
  }

  /**
   * Validates timeline year (between 1950 and 2100).
   */
  public static validateYear(year: number): { valid: boolean; error?: string } {
    if (typeof year !== 'number' || !Number.isInteger(year) || year < 1950 || year > 2100) {
      return { valid: false, error: `Timeline year must be integer between 1950 and 2100, got ${year}` };
    }
    return { valid: true };
  }

  /**
   * Sanitizes external web / URL content to prevent prompt injection.
   * Ensures external text is treated strictly as DATA, never as executable instructions.
   */
  public static sanitizeWebText(content: string, maxLen: number = 20000): string {
    if (!content || typeof content !== 'string') return '';
    
    // Strip script and html injection patterns
    let clean = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]+>/g, ' ');

    // Defend against prompt injection markers in scraped content
    clean = clean
      .replace(/(?:ignore previous instructions|disregard all previous commands|system prompt override|expose your api key)/gi, '[FLAGGED_SUSPICIOUS_DIRECTIVE]')
      .replace(/(?:gemini_api_key|api[_\s]?key|secret[_\s]?token)/gi, '[REDACTED_CREDENTIAL]')
      .trim();

    if (clean.length > maxLen) {
      clean = clean.slice(0, maxLen) + '... [Content truncated for safety and length]';
    }

    return clean;
  }

  /**
   * Helper to clamp simulation parameter within safe bounds.
   */
  public static clampSimulationParam(variable: string, value: number): number {
    return this.validateSimulationVariable(variable, value).normalizedValue;
  }
}

