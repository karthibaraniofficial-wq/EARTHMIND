/**
 * EARTHMIND DESIGN SYSTEM — SPATIAL TOKENS & SYSTEM CONTRACTS
 * Planetary Environmental Intelligence UI Architecture
 * Defines authoritative spatial dimensions, z-index hierarchy, spacing scale, and breakpoints.
 */

export const ZIndexTokens = {
  base: 0,
  content: 10,
  sticky: 20,
  navigation: 30,
  context: 40,
  floating: 50,
  dropdown: 60,
  tooltip: 70,
  modal: 80,
  command: 90,
  critical: 100,
} as const;

export type ZIndexLevel = keyof typeof ZIndexTokens;

export const SpacingTokens = {
  space1: '4px',
  space2: '8px',
  space3: '12px',
  space4: '16px',
  space5: '20px',
  space6: '24px',
  space7: '32px',
  space8: '40px',
  space9: '48px',
  space10: '64px',
} as const;

export const LayoutTokens = {
  topBarHeight: '56px',
  statusBarHeight: '36px',
  railWidthCollapsed: '64px',
  railWidthExpanded: '260px',
  contextWidthDocked: 'clamp(340px, 26vw, 420px)',
  safeTop: '64px',
  safeBottom: '48px',
  safeLeft: '16px',
  safeRight: '16px',
} as const;

export const BreakpointTokens = {
  mobile: 430,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1440,
  ultra: 1920,
} as const;

export const TypographyTokens = {
  pageTitle: 'text-2xl sm:text-3xl font-extrabold tracking-tight',
  sectionTitle: 'text-lg sm:text-xl font-bold tracking-normal',
  cardTitle: 'text-sm font-bold tracking-wide',
  subheading: 'text-xs sm:text-sm text-slate-300 font-medium',
  metadata: 'text-xs font-mono text-slate-400',
  scientificSource: 'text-[10px] font-mono tracking-tight text-slate-500 uppercase',
  metricValue: 'text-2xl sm:text-3xl font-bold font-mono tracking-tight',
} as const;

export const SurfaceLevelTokens = {
  level1Page: 'bg-[var(--earthmind-bg)]',
  level2Workspace: 'bg-[var(--earthmind-surface)] border border-white/10',
  level3Card: 'bg-[var(--earthmind-surface-elevated)] border border-white/15 shadow-xl',
  level4Supporting: 'bg-white/5 border border-white/10',
  level5Micro: 'bg-white/5 border border-white/5 rounded-lg',
} as const;
