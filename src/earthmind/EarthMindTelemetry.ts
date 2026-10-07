/**
 * EARTHMIND - Platform Observability & Telemetry (OS 4.0)
 * Safely tracks subsystem latencies, simulation durations, and tool execution times.
 * Never stores secrets or unmasked user credentials.
 */

export interface ExecutionMetric {
  id: string;
  subsystem: 'VOICE' | 'SIMULATION' | 'RESEARCH' | 'EARTH_RENDERER' | 'TOOL_CALL';
  operation: string;
  durationMs: number;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
}

export class EarthMindTelemetry {
  private static metrics: ExecutionMetric[] = [];
  private static readonly maxMetrics = 200;

  /**
   * Times an async operation and records telemetry safely.
   */
  public static async measure<T>(
    subsystem: ExecutionMetric['subsystem'],
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      const res = await fn();
      const durationMs = Math.round(performance.now() - start);
      this.record({
        id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        subsystem,
        operation,
        durationMs,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
      });
      return res;
    } catch (err) {
      const durationMs = Math.round(performance.now() - start);
      this.record({
        id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        subsystem,
        operation,
        durationMs,
        timestamp: new Date().toISOString(),
        status: 'ERROR',
      });
      throw err;
    }
  }

  public static record(metric: ExecutionMetric): void {
    this.metrics.unshift(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.pop();
    }
  }

  public static getRecentMetrics(): readonly ExecutionMetric[] {
    return this.metrics;
  }

  public static getAverageLatency(subsystem: ExecutionMetric['subsystem']): number {
    const subset = this.metrics.filter((m) => m.subsystem === subsystem && m.status === 'SUCCESS');
    if (subset.length === 0) return 0;
    const sum = subset.reduce((acc, m) => acc + m.durationMs, 0);
    return Math.round(sum / subset.length);
  }
}
