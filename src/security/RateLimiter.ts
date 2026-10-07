/**
 * EARTHMIND - Rate Limiter & Token Abuse Prevention
 * Protects real-time research endpoints and tool invocations from rapid quota exhaustion.
 */

export class RateLimiter {
  private static timestamps: Map<string, number[]> = new Map();

  /**
   * Checks whether an action for a given key is permitted within rate constraints.
   * @param key Identifier (e.g. 'web-research', 'tool-execution')
   * @param limit Max allowed calls in the given window
   * @param windowMs Time window in milliseconds
   */
  public static check(key: string, limit: number = 10, windowMs: number = 60000): { allowed: boolean; remaining: number; retryAfterMs: number } {
    const now = Date.now();
    const history = this.timestamps.get(key) || [];
    
    // Filter out timestamps outside window
    const active = history.filter((ts) => now - ts < windowMs);

    if (active.length >= limit) {
      const oldest = active[0];
      const retryAfterMs = Math.max(0, windowMs - (now - oldest));
      this.timestamps.set(key, active);
      return { allowed: false, remaining: 0, retryAfterMs };
    }

    active.push(now);
    this.timestamps.set(key, active);
    return {
      allowed: true,
      remaining: limit - active.length,
      retryAfterMs: 0,
    };
  }

  public static reset(key?: string): void {
    if (key) {
      this.timestamps.delete(key);
    } else {
      this.timestamps.clear();
    }
  }
}
