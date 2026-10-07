import { EarthMindTheme, PerformanceLevel } from './ThemeTokens';

/**
 * EarthMindThemeEngine
 * Translates theme tokens into dynamic CSS variables and manages liquid glass physics
 */

export class EarthMindThemeEngine {
  private static instance: EarthMindThemeEngine;
  private currentTheme: EarthMindTheme | null = null;
  private pointerListening = false;
  private rafId: number | null = null;
  private pointerPos = { x: 50, y: 50 };

  private constructor() {
    this.initPointerPhysics();
  }

  public static getInstance(): EarthMindThemeEngine {
    if (!EarthMindThemeEngine.instance) {
      EarthMindThemeEngine.instance = new EarthMindThemeEngine();
    }
    return EarthMindThemeEngine.instance;
  }

  /**
   * Applies the full theme token hierarchy to document.documentElement
   */
  public applyTheme(theme: EarthMindTheme): void {
    this.currentTheme = theme;
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const style = root.style;

    // 1. Core Color Tokens
    style.setProperty('--earthmind-bg', theme.colors.bg);
    style.setProperty('--earthmind-surface', theme.colors.surface);
    style.setProperty('--earthmind-surface-elevated', theme.colors.surfaceElevated);
    style.setProperty('--earthmind-glass', theme.colors.glass);
    style.setProperty('--earthmind-glass-strong', theme.colors.glassStrong);
    style.setProperty('--earthmind-glass-soft', theme.colors.glassSoft);
    style.setProperty('--earthmind-border', theme.colors.border);
    style.setProperty('--earthmind-border-bright', theme.colors.borderBright);
    style.setProperty('--earthmind-text', theme.colors.text);
    style.setProperty('--earthmind-text-secondary', theme.colors.textSecondary);
    style.setProperty('--earthmind-text-muted', theme.colors.textMuted);
    style.setProperty('--earthmind-accent', theme.colors.accent);
    style.setProperty('--earthmind-accent-soft', theme.colors.accentSoft);
    style.setProperty('--earthmind-accent-secondary', theme.colors.accentSecondary);
    style.setProperty('--earthmind-success', theme.colors.success);
    style.setProperty('--earthmind-warning', theme.colors.warning);
    style.setProperty('--earthmind-danger', theme.colors.danger);
    style.setProperty('--earthmind-info', theme.colors.info);
    style.setProperty('--earthmind-shadow', theme.colors.shadow);
    style.setProperty('--earthmind-glow', theme.colors.glow);

    // Performance adaptation
    const perf = theme.performance;
    const blurMultiplier = perf === 'low' ? 0.3 : perf === 'balanced' ? 0.7 : perf === 'high' ? 1.0 : 1.25;
    const motionMultiplier = theme.accessibility.reduceMotion ? 0 : perf === 'low' ? 0.2 : perf === 'balanced' ? 0.8 : 1.0;

    // 2. Glass Physics Tokens
    const calculatedBlur = Math.round((theme.glass.blur / 100) * 36 * blurMultiplier);
    const calculatedOpacity = (theme.glass.opacity / 100).toFixed(2);
    style.setProperty('--earthmind-glass-blur', `${calculatedBlur}px`);
    style.setProperty('--earthmind-glass-opacity', calculatedOpacity);
    style.setProperty('--earthmind-glass-saturate', `${theme.glass.saturation}%`);
    style.setProperty('--earthmind-glass-brightness', `${theme.glass.brightness}%`);
    style.setProperty('--earthmind-glass-density', `${(theme.glass.density / 100).toFixed(2)}`);
    style.setProperty('--earthmind-glass-reflection', `${(theme.glass.reflection / 100).toFixed(2)}`);
    style.setProperty('--earthmind-glass-noise', `${(theme.glass.noise / 100).toFixed(2)}`);
    style.setProperty('--earthmind-border-opacity', `${(theme.glass.borderVisibility / 100).toFixed(2)}`);
    style.setProperty('--earthmind-border-brightness', `${(theme.glass.borderBrightness / 100).toFixed(2)}`);

    // 3. Depth & Shadows
    const shadowIntensity = (theme.depth.shadow / 100).toFixed(2);
    style.setProperty('--earthmind-depth-shadow-opacity', shadowIntensity);
    style.setProperty('--earthmind-depth-elevation', `${Math.round((theme.depth.elevation / 100) * 32)}px`);
    style.setProperty('--earthmind-glow-intensity', `${(theme.depth.glow / 100).toFixed(2)}`);

    // 4. Shape & Corner Radii
    const baseRadius = Math.round((theme.shape.cornerRadius / 100) * 32);
    const panelRadius = Math.round((theme.shape.panelRoundness / 100) * 36);
    const buttonRadius = Math.round((theme.shape.buttonRoundness / 100) * 28);
    const chipRadius = Math.round((theme.shape.chipRoundness / 100) * 999);
    style.setProperty('--earthmind-radius', `${baseRadius}px`);
    style.setProperty('--earthmind-panel-radius', `${panelRadius}px`);
    style.setProperty('--earthmind-button-radius', `${buttonRadius}px`);
    style.setProperty('--earthmind-chip-radius', `${chipRadius}px`);

    // 5. Typography
    const fontStack =
      theme.typography.fontFamily === 'Inter'
        ? "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        : theme.typography.fontFamily === 'JetBrains Mono'
        ? "'JetBrains Mono', 'Fira Code', monospace"
        : theme.typography.fontFamily === 'Outfit'
        ? "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif"
        : theme.typography.fontFamily === 'System'
        ? "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        : "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

    style.setProperty('--earthmind-font-sans', fontStack);
    style.setProperty('--earthmind-font-size-scale', `${theme.typography.fontSizeScale}%`);
    style.setProperty('--earthmind-letter-spacing', `${theme.typography.letterSpacing}px`);

    // 6. Motion Tokens
    const baseDuration = Math.round(250 * (100 / Math.max(10, theme.motion.transitionSpeed)));
    style.setProperty('--earthmind-motion-duration', `${Math.round(baseDuration * motionMultiplier)}ms`);
    style.setProperty('--earthmind-motion-intensity', `${(theme.motion.intensity / 100 * motionMultiplier).toFixed(2)}`);

    // 7. Earth & Map & Data Overrides
    style.setProperty('--earthmind-earth-glow', `${(theme.earth.glow / 100).toFixed(2)}`);
    style.setProperty('--earthmind-earth-speed', `${(theme.earth.rotationSpeed / 50).toFixed(2)}`);
    style.setProperty('--earthmind-chart-glow', `${(theme.data.chartGlow / 100).toFixed(2)}`);

    // Set dataset attributes for conditional CSS rules
    root.setAttribute('data-theme-id', theme.id);
    root.setAttribute('data-performance', theme.performance);
    if (theme.accessibility.highContrast) root.setAttribute('data-high-contrast', 'true');
    else root.removeAttribute('data-high-contrast');

    if (theme.accessibility.reduceMotion) root.setAttribute('data-reduce-motion', 'true');
    else root.removeAttribute('data-reduce-motion');
  }

  /**
   * Initializes subtle pointer physics for liquid glass specular reflection
   */
  private initPointerPhysics(): void {
    if (typeof window === 'undefined' || this.pointerListening) return;

    this.pointerListening = true;
    window.addEventListener(
      'pointermove',
      (e) => {
        if (!this.currentTheme || this.currentTheme.motion.glassRefraction <= 0) return;

        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        this.pointerPos = { x, y };

        if (!this.rafId) {
          this.rafId = requestAnimationFrame(() => {
            document.documentElement.style.setProperty('--pointer-x', `${this.pointerPos.x.toFixed(1)}%`);
            document.documentElement.style.setProperty('--pointer-y', `${this.pointerPos.y.toFixed(1)}%`);
            this.rafId = null;
          });
        }
      },
      { passive: true }
    );
  }

  /**
   * Suggests an automatic performance profile based on hardware & connection
   */
  public autoDetectPerformance(): PerformanceLevel {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'high';

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;

    if (isMobile || cores <= 4 || memory < 4) {
      return 'balanced';
    }
    if (cores >= 8 && memory >= 8) {
      return 'ultra';
    }
    return 'high';
  }
}
