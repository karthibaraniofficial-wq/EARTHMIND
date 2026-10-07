import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  EarthMindTheme,
  ThemePresetId,
  CustomizationComplexity,
  DesignMode,
  PerformanceLevel,
  DEFAULT_THEME_ID,
} from './ThemeTokens';
import { THEME_PRESETS } from './ThemePresets';
import { EarthMindThemeEngine } from './EarthMindThemeEngine';
import {
  loadSavedTheme,
  saveTheme,
  loadSavedPresetId,
  savePresetId,
  loadSavedComplexity,
  saveComplexity,
  loadSavedDesignMode,
  saveDesignMode,
  clearThemeStorage,
} from './ThemePersistence';
import { serializeThemeToJSON, parseThemeFromJSON } from './ThemeSerializer';

interface ThemeContextValue {
  theme: EarthMindTheme;
  presetId: ThemePresetId;
  complexity: CustomizationComplexity;
  mode: DesignMode;
  performanceLevel: PerformanceLevel;
  isAppearanceStudioOpen: boolean;
  setPreset: (id: ThemePresetId) => void;
  updateTheme: (updater: Partial<EarthMindTheme> | ((prev: EarthMindTheme) => EarthMindTheme)) => void;
  setComplexity: (complexity: CustomizationComplexity) => void;
  setMode: (mode: DesignMode) => void;
  setPerformanceLevel: (level: PerformanceLevel) => void;
  resetTheme: () => void;
  resetAllAppearance: () => void;
  exportThemeJSON: () => string;
  importThemeJSON: (jsonStr: string) => { success: boolean; error?: string };
  setIsAppearanceStudioOpen: (open: boolean) => void;
  toggleAppearanceStudio: (open?: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const engine = useMemo(() => EarthMindThemeEngine.getInstance(), []);

  const [theme, setThemeState] = useState<EarthMindTheme>(() => loadSavedTheme());
  const [presetId, setPresetIdState] = useState<ThemePresetId>(() => loadSavedPresetId());
  const [complexity, setComplexityState] = useState<CustomizationComplexity>(() => loadSavedComplexity());
  const [mode, setModeState] = useState<DesignMode>(() => loadSavedDesignMode());
  const [isAppearanceStudioOpen, setIsAppearanceStudioOpen] = useState<boolean>(false);

  // Apply theme tokens to CSS variables whenever theme state updates
  useEffect(() => {
    engine.applyTheme(theme);
    saveTheme(theme);
  }, [theme, engine]);

  const setPreset = useCallback(
    (id: ThemePresetId) => {
      const targetPreset = THEME_PRESETS[id] || THEME_PRESETS[DEFAULT_THEME_ID];
      setPresetIdState(id);
      savePresetId(id);
      setThemeState({
        ...targetPreset,
        id,
      });
    },
    []
  );

  const updateTheme = useCallback(
    (updater: Partial<EarthMindTheme> | ((prev: EarthMindTheme) => EarthMindTheme)) => {
      setThemeState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
        // Mark as custom if modified from preset
        const updatedTheme: EarthMindTheme = {
          ...next,
          id: next.id === prev.id && prev.id !== 'custom' ? 'custom' : next.id,
        };
        if (updatedTheme.id === 'custom') {
          setPresetIdState('custom');
          savePresetId('custom');
        }
        return updatedTheme;
      });
    },
    []
  );

  const setComplexity = useCallback((newComplexity: CustomizationComplexity) => {
    setComplexityState(newComplexity);
    saveComplexity(newComplexity);
  }, []);

  const setMode = useCallback((newMode: DesignMode) => {
    setModeState(newMode);
    saveDesignMode(newMode);
  }, []);

  const setPerformanceLevel = useCallback(
    (level: PerformanceLevel) => {
      updateTheme((prev) => ({
        ...prev,
        performance: level,
      }));
    },
    [updateTheme]
  );

  const resetTheme = useCallback(() => {
    const base = THEME_PRESETS[presetId] || THEME_PRESETS[DEFAULT_THEME_ID];
    setThemeState({ ...base });
  }, [presetId]);

  const resetAllAppearance = useCallback(() => {
    clearThemeStorage();
    const defaultTheme = THEME_PRESETS[DEFAULT_THEME_ID];
    setPresetIdState(DEFAULT_THEME_ID);
    setComplexityState(50);
    setModeState('earth');
    setThemeState({ ...defaultTheme });
  }, []);

  const exportThemeJSON = useCallback(() => {
    return serializeThemeToJSON(theme);
  }, [theme]);

  const importThemeJSON = useCallback(
    (jsonStr: string) => {
      const res = parseThemeFromJSON(jsonStr);
      if (res.success && res.theme) {
        setThemeState(res.theme);
        setPresetIdState(res.theme.id);
        savePresetId(res.theme.id);
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to parse theme JSON' };
    },
    []
  );

  const toggleAppearanceStudio = useCallback((open?: boolean) => {
    setIsAppearanceStudioOpen((prev) => (open !== undefined ? open : !prev));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      presetId,
      complexity,
      mode,
      performanceLevel: theme.performance,
      isAppearanceStudioOpen,
      setPreset,
      updateTheme,
      setComplexity,
      setMode,
      setPerformanceLevel,
      resetTheme,
      resetAllAppearance,
      exportThemeJSON,
      importThemeJSON,
      setIsAppearanceStudioOpen,
      toggleAppearanceStudio,
    }),
    [
      theme,
      presetId,
      complexity,
      mode,
      isAppearanceStudioOpen,
      setPreset,
      updateTheme,
      setComplexity,
      setMode,
      setPerformanceLevel,
      resetTheme,
      resetAllAppearance,
      exportThemeJSON,
      importThemeJSON,
      toggleAppearanceStudio,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useEarthMindTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useEarthMindTheme must be used within a ThemeProvider');
  }
  return ctx;
};
