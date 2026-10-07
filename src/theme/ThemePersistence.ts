import { EarthMindTheme, ThemePresetId, CustomizationComplexity, DesignMode, DEFAULT_THEME_ID } from './ThemeTokens';
import { THEME_PRESETS } from './ThemePresets';
import { validateTheme } from './ThemeValidator';

const STORAGE_KEY_THEME = 'earthmind_ui_theme_v2';
const STORAGE_KEY_PRESET = 'earthmind_ui_preset_id';
const STORAGE_KEY_COMPLEXITY = 'earthmind_ui_complexity';
const STORAGE_KEY_MODE = 'earthmind_ui_design_mode';
const STORAGE_KEY_CUSTOM = 'earthmind_ui_custom_theme';

export function loadSavedTheme(): EarthMindTheme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_THEME);
    if (raw) {
      const parsed = JSON.parse(raw);
      const { theme } = validateTheme(parsed);
      return theme;
    }
  } catch (e) {
    console.warn('Failed to load saved EarthMind theme from localStorage:', e);
  }

  // Fallback to saved preset or default preset
  const savedPreset = loadSavedPresetId();
  return THEME_PRESETS[savedPreset] || THEME_PRESETS[DEFAULT_THEME_ID];
}

export function saveTheme(theme: EarthMindTheme): void {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, JSON.stringify(theme));
    if (theme.id === 'custom') {
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(theme));
    }
  } catch (e) {
    console.warn('Failed to save EarthMind theme to localStorage:', e);
  }
}

export function loadSavedPresetId(): ThemePresetId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRESET) as ThemePresetId | null;
    if (raw && THEME_PRESETS[raw]) {
      return raw;
    }
  } catch {}
  return DEFAULT_THEME_ID;
}

export function savePresetId(id: ThemePresetId): void {
  try {
    localStorage.setItem(STORAGE_KEY_PRESET, id);
  } catch {}
}

export function loadSavedComplexity(): CustomizationComplexity {
  try {
    const raw = Number(localStorage.getItem(STORAGE_KEY_COMPLEXITY));
    if ([0, 25, 50, 75, 100].includes(raw)) {
      return raw as CustomizationComplexity;
    }
  } catch {}
  return 50; // default balanced complexity
}

export function saveComplexity(complexity: CustomizationComplexity): void {
  try {
    localStorage.setItem(STORAGE_KEY_COMPLEXITY, String(complexity));
  } catch {}
}

export function loadSavedDesignMode(): DesignMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MODE) as DesignMode | null;
    if (raw && ['focus', 'earth', 'data', 'research', 'simulation', 'exhibition', 'control'].includes(raw)) {
      return raw;
    }
  } catch {}
  return 'earth';
}

export function saveDesignMode(mode: DesignMode): void {
  try {
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  } catch {}
}

export function clearThemeStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_THEME);
    localStorage.removeItem(STORAGE_KEY_PRESET);
    localStorage.removeItem(STORAGE_KEY_COMPLEXITY);
    localStorage.removeItem(STORAGE_KEY_MODE);
  } catch {}
}
