# EARTHMIND DESIGN SYSTEM 2.0 — LIQUID GLASS SPECIFICATION
*Planetary Environmental Intelligence Operating System*

---

## 01. DESIGN PHILOSOPHY & PRINCIPLES

### Earth is the Hero
The visual centerpiece of EARTHMIND is our living planet. All user interface surfaces are engineered as **translucent liquid glass floating above the Earth**, framing planetary data without occluding orbital geometry, atmospheric radiance, or environmental topography.

### Visual Priority Hierarchy
1. **Earth & Spatial Visualizations**: High-fidelity 3D globe, atmospheric scattering, cloud coverage, multi-spectral sensor overlays.
2. **Environmental Intelligence**: Anomaly alerts, causal linkages, biophysical state vectors.
3. **Primary Data Cards**: Standardized 5-part data capsules with live trend and baseline context.
4. **Interactive Controls**: What-If variables, timeline scrubbers, spatial camera controls.
5. **System Navigation**: Floating liquid glass top navbar and collapsible left rail.

---

## 02. COLOR ARCHITECTURE & DESIGN TOKENS

EARTHMIND employs a centralized token architecture mapped dynamically to CSS custom properties. No component uses raw hex codes in isolation.

```css
:root {
  /* Surface & Substrates */
  --earthmind-bg: #071A2B;
  --earthmind-surface: rgba(9, 28, 48, 0.72);
  --earthmind-surface-elevated: rgba(16, 42, 69, 0.82);
  --earthmind-glass: rgba(24, 200, 200, 0.08);
  --earthmind-glass-strong: rgba(24, 200, 200, 0.16);
  --earthmind-glass-soft: rgba(255, 255, 255, 0.04);
  
  /* Borders & Highlights */
  --earthmind-border: rgba(255, 255, 255, 0.12);
  --earthmind-border-bright: rgba(24, 200, 200, 0.35);

  /* Typography */
  --earthmind-text: #F1F5F9;
  --earthmind-text-secondary: #94A3B8;
  --earthmind-text-muted: #64748B;

  /* Accents & Status */
  --earthmind-accent: #18C8C8;
  --earthmind-accent-soft: rgba(24, 200, 200, 0.15);
  --earthmind-accent-secondary: #9B7CFF;
  --earthmind-success: #27C98A;
  --earthmind-warning: #FFD166;
  --earthmind-danger: #FF6B6B;
  --earthmind-info: #4FA8FF;

  /* Physics & Photons */
  --earthmind-shadow: rgba(7, 26, 43, 0.7);
  --earthmind-glow: rgba(24, 200, 200, 0.28);
}
```

---

## 03. LIQUID GLASS MATERIAL HIERARCHY

To ensure physical depth and legibility, glass intensity is strictly tiered:

| Tier | Variant | Opacity | Blur | Purpose |
|---|---|---|---|---|
| **Tier 1** | `.glass-panel-1` / `glass-soft` | 4–10% | 14px | Substrate rails, background sections, non-intrusive containers |
| **Tier 2** | `.glass-panel-2` / `glass-medium` | 50–70% | 20px | Standard data containers, interactive cards, form controls |
| **Tier 3** | `.glass-panel-3` / `glass-strong` | 75–85% | 26px | Active modal content, high-priority intelligence drawers |
| **Tier 4** | `.glass-panel-highlight` / `glass-floating` | Dynamic | 30px | Floating capsules, active HUD telemetry nodes |
| **Tier 5** | `.glass-modal` / `.glass-command` | 85–92% | 36px | Command palette (`⌘K`), Appearance Studio, confirmation modals |
| **Tier 6** | `.glass-tooltip` | 90% | 16px | Precision scientific tooltips with confidence bounds |

### Liquid Glass Physics & Specular Sheen
Every liquid glass surface includes:
1. **Pointer Reactive Specular Sheen**: Dynamic radial gradient centered on `(var(--pointer-x), var(--pointer-y))` providing physically believable ambient reflection without distracting rainbow iridescence.
2. **Top Chamfer Highlight**: 1px linear gradient highlight creating crisp optical edge refraction.
3. **Backdrop Filter Cascades**: Coordinated `blur`, `saturate`, and `brightness` filters ensuring high contrast for all scientific typography.

---

## 04. 0–100% CUSTOMIZATION ENGINE & PRESETS

EARTHMIND includes a full 5-tier customization engine managed by `EarthMindThemeEngine`:

- **0% (Simple Presets)**: Select from 10 calibrated scientific presets.
- **25% (Basic Appearance)**: Modify background tone, primary accent, glass opacity, and corner radii.
- **50% (Advanced Appearance)**: Tune blur radius, shadow elevation, photon aura, and animation velocity.
- **75% (Professional Customization)**: Control specular reflection intensity, film noise/grain, panel density, and cartography overlays.
- **100% (Full Operator Control)**: Direct parameterization of every individual token in the system.

### The 10 Planetary Presets
1. **EarthMind Pure**: Crisp scientific clarity with neutral glass and maximal text contrast.
2. **EarthMind Glass**: Maximum translucency, deep optical blur, and high floating depth.
3. **EarthMind Aurora**: Default signature with cyan, purple, and emerald atmospheric radiance.
4. **EarthMind Ocean**: Pelagic blues, sea ice luminescence, and hydro-spectral clarity.
5. **EarthMind Forest**: Emerald biosphere radiance with photosynthetic NDVI accents.
6. **EarthMind Arctic**: Glacial cryosphere aesthetic with crystalline ice glass.
7. **EarthMind Mission**: Aerospace command center with tactical amber HUD and dark stealth.
8. **EarthMind Mono**: Minimalist high-fashion monochromatic glass with precision typography.
9. **EarthMind Expo**: High-visibility Science Expo mode tuned for projection screens and judges.
10. **Custom**: Fully operator-tailored visual profile with export/import support.

---

## 05. COMPONENT SUITE SPECIFICATION

All components reside in `src/components/glass/` and implement token inheritance:

- `GlassSurface`: Core primitive with variants, elevation, and pointer sheen.
- `GlassCard`: Standard content container with interactive hover physics.
- `GlassPanel`: Structured view container with title, subtitle, and action slots.
- `GlassButton`: Tactile push button with primary, emerald, aurora, amber, ghost, and glass variants.
- `GlassIconButton`: Compact square/circle icon action trigger with optional live pulse badge.
- `GlassInput`: Floating search and text input with glow focus states.
- `GlassSelect`: Precision dropdown with glass option styling.
- `GlassSlider`: 0–100% range slider with track gradient and value display.
- `GlassToggle`: Pill toggle switch with animated active aura.
- `GlassChip`: Category tag capsule with optional remove action.
- `GlassBadge`: Compact indicator with tone variants (aqua, emerald, sun, coral, aurora).
- `GlassTooltip`: Scientific inspection tooltip displaying value, unit, timestamp, source, and confidence.
- `GlassModal`: Dialog shell with backdrop blur and escape/click-outside dismiss.
- `GlassDrawer`: Sliding sheet from left, right, or bottom.
- `GlassTabs`: Pill or segmented tab strip with smooth indicator.
- `GlassAccordion`: Expandable accordion container for complex parameters.
- `GlassTable`: Tabular data grid with hover states and column alignment.
- `GlassToast`: Floating notification capsule with status icon and auto-dismiss.
- `GlassPopover`: Triggered floating card with multi-directional positioning.
- `GlassDropdown`: Compact action menu with hover states.
- `GlassContextMenu`: Native right-click replacement menu.
- `GlassMetric`: Standardized 5-part data card structure (Icon, Label, Primary Value, Trend, Context).

---

## 06. DESIGN MODES

The system supports 7 distinct operator modes:
- **FOCUS MODE**: Minimizes chrome for distraction-free analysis.
- **EARTH MODE**: Planet dominates 80%+ of the viewport.
- **DATA MODE**: High tabular and chart density for technical auditing.
- **RESEARCH MODE**: Peer-reviewed sources and literature evidence take priority.
- **SIMULATION MODE**: What-If variables, coupled biophysical sliders, and scenario comparisons dominate.
- **EXHIBITION MODE**: Presentation-tuned layout optimized for Science Expo displays and judges.
- **CONTROL MODE**: Full density controls, autopilot toggles, and live console telemetry.

---

## 07. ACCESSIBILITY & PERFORMANCE TIERS

### Accessibility Standards
- **Contrast**: Text elements conform to WCAG AA guidelines against glass backdrops.
- **Keyboard Navigation**: Full focus visibility rings on all interactive elements.
- **Reduce Motion**: Respects `prefers-reduced-motion` and manual toggle, setting animation durations to 0.001ms.
- **Color-Blind Safe**: Status indicators never rely on color alone; accompanied by text labels and directional icons.

### Performance Profiles
- **Ultra**: Full glass refraction, real-time specular reflections, high particle fidelity.
- **High**: Standard liquid glass with balanced backdrop blur.
- **Balanced**: Reduced blur radius (12px), optimized for standard laptops.
- **Low**: Replaces expensive CSS `backdrop-filter` with solid opaque fallback substrates for older GPUs.
