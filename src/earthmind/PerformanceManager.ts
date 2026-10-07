/**
 * EARTHMIND - Performance Engine (OS 4.0)
 * Monitors real-time frames per second (FPS), render timing, and provides adaptive
 * hardware throttling across LOW, BALANCED, HIGH, and ULTRA visual profiles.
 */

export type PerformanceTier = 'low' | 'balanced' | 'high' | 'ultra';

export interface PerformanceDiagnostics {
  fps: number;
  frameTimeMs: number;
  activeTier: PerformanceTier;
  enableBlur: boolean;
  enableParticles: boolean;
  enableReflections: boolean;
  maxParticles: number;
  earthSphereSegments: number;
  reducedMotion: boolean;
}

export class PerformanceManager {
  private static activeTier: PerformanceTier = 'high';
  private static currentFps: number = 60;
  private static lastFrameTime: number = performance.now();
  private static frameCount: number = 0;
  private static isMonitoring: boolean = false;
  private static listeners: Set<(diag: PerformanceDiagnostics) => void> = new Set();

  /**
   * Initialize hardware-aware FPS loop and profile detection.
   */
  public static init(): void {
    if (this.isMonitoring || typeof window === 'undefined') return;
    this.isMonitoring = true;

    // Detect mobile or low memory devices
    const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      this.activeTier = 'balanced';
    }

    let lastSec = performance.now();
    let framesThisSec = 0;

    const tick = (now: number) => {
      this.frameCount++;
      framesThisSec++;

      if (now - lastSec >= 1000) {
        this.currentFps = Math.round((framesThisSec * 1000) / (now - lastSec));
        framesThisSec = 0;
        lastSec = now;

        // Auto-throttle if sustained frame drop detected
        if (this.currentFps < 22 && this.activeTier === 'ultra') {
          this.setTier('high');
        } else if (this.currentFps < 18 && this.activeTier === 'high') {
          this.setTier('balanced');
        }

        this.notify();
      }

      this.lastFrameTime = now;
      if (this.isMonitoring) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }

  public static setTier(tier: PerformanceTier): void {
    this.activeTier = tier;
    this.notify();
  }

  public static getTier(): PerformanceTier {
    return this.activeTier;
  }

  public static getDiagnostics(): PerformanceDiagnostics {
    const tier = this.activeTier;
    return {
      fps: this.currentFps,
      frameTimeMs: Math.round(1000 / Math.max(1, this.currentFps)),
      activeTier: tier,
      enableBlur: tier !== 'low',
      enableParticles: tier === 'high' || tier === 'ultra',
      enableReflections: tier === 'ultra',
      maxParticles: tier === 'ultra' ? 2500 : tier === 'high' ? 1200 : tier === 'balanced' ? 400 : 0,
      earthSphereSegments: tier === 'ultra' ? 64 : tier === 'high' ? 48 : tier === 'balanced' ? 32 : 24,
      reducedMotion: tier === 'low',
    };
  }

  public static subscribe(listener: (diag: PerformanceDiagnostics) => void): () => void {
    this.listeners.add(listener);
    listener(this.getDiagnostics());
    return () => this.listeners.delete(listener);
  }

  private static notify(): void {
    const diag = this.getDiagnostics();
    this.listeners.forEach((l) => {
      try {
        l(diag);
      } catch {
        // safe
      }
    });
  }
}

// Auto initialize on load in browser
if (typeof window !== 'undefined') {
  PerformanceManager.init();
}
