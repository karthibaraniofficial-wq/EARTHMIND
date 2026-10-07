/**
 * EARTHMIND - Secret & Environment Governance
 * Strict zero-secret-leakage verification.
 * Confines permanent API keys strictly to secure server runtimes.
 */

export class SecretManager {
  /**
   * Asserts that no sensitive API keys are exposed to the client bundle.
   */
  public static verifyClientIsolation(): { safe: boolean; findings: string[] } {
    const findings: string[] = [];
    
    // Check if GEMINI_API_KEY is accidentally exposed on client window/import.meta.env
    try {
      const metaEnv = (import.meta as any)?.env || {};
      if (metaEnv.GEMINI_API_KEY) {
        findings.push('CRITICAL: GEMINI_API_KEY detected in client bundle import.meta.env!');
      }
      if (metaEnv.VITE_GEMINI_API_KEY) {
        findings.push('CRITICAL: VITE_GEMINI_API_KEY detected in client bundle!');
      }
    } catch {
      // safe
    }

    if (typeof window !== 'undefined') {
      const win = window as any;
      if (win.GEMINI_API_KEY || win.__GEMINI_KEY__) {
        findings.push('CRITICAL: Global window object contains exposed API key!');
      }
    }

    return {
      safe: findings.length === 0,
      findings,
    };
  }

  /**
   * Sanitizes any log or diagnostic payload before display or network transmission.
   */
  public static sanitize(text: string): string {
    if (!text || typeof text !== 'string') return '';
    return text
      .replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_GEMINI_KEY]')
      .replace(/AQ\.[0-9A-Za-z-_]{40,}/g, '[REDACTED_API_KEY]')
      .replace(/(Bearer\s+)[A-Za-z0-9_\-\.]+/gi, '$1[REDACTED_TOKEN]')
      .replace(/(key=)[A-Za-z0-9_\-\.]+/gi, '$1[REDACTED_KEY]');
  }
}
