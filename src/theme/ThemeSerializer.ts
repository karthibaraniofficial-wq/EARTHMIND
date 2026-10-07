import { EarthMindTheme } from './ThemeTokens';
import { validateTheme } from './ThemeValidator';

export function serializeThemeToJSON(theme: EarthMindTheme): string {
  return JSON.stringify(
    {
      version: '2.0.0',
      schema: 'earthmind-liquid-glass',
      exportedAt: new Date().toISOString(),
      theme,
    },
    null,
    2
  );
}

export function parseThemeFromJSON(jsonString: string): { success: boolean; theme?: EarthMindTheme; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    const candidate = parsed.theme ? parsed.theme : parsed;
    const { valid, theme, errors } = validateTheme(candidate);
    if (!valid && errors.length > 0) {
      return { success: false, error: errors.join(', ') };
    }
    return { success: true, theme };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Invalid JSON syntax' };
  }
}

export function exportThemeToUrlHash(theme: EarthMindTheme): string {
  try {
    const minified = JSON.stringify(theme);
    const encoded = btoa(encodeURIComponent(minified));
    return `#theme=${encoded}`;
  } catch {
    return '';
  }
}

export function importThemeFromUrlHash(hash: string): EarthMindTheme | null {
  try {
    const match = hash.match(/#theme=([^&]+)/);
    if (!match) return null;
    const decoded = decodeURIComponent(atob(match[1]));
    const { theme } = validateTheme(JSON.parse(decoded));
    return theme;
  } catch {
    return null;
  }
}
