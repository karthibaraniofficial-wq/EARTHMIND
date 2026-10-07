import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Sliders,
  Eye,
  RotateCcw,
  Download,
  Check,
  Globe2,
  Layers,
  Maximize2,
  Search,
  Zap,
  ShieldCheck,
  Activity,
  Compass,
  Database,
} from 'lucide-react';
import { Upload, Copy, Palette, Type, Accessibility as AccessIcon } from '../components/icons';
import { useEarthMindTheme } from './ThemeProvider';
import { THEME_PRESETS } from './ThemePresets';
import { ThemePresetId, CustomizationComplexity, DesignMode, PerformanceLevel } from './ThemeTokens';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassBadge } from '../components/glass/GlassBadge';
import { GlassSlider } from '../components/glass/GlassSlider';
import { GlassToggle } from '../components/glass/GlassToggle';
import { GlassSelect } from '../components/glass/GlassSelect';
import { GlassMetric } from '../components/glass/GlassMetric';

export const ThemeCustomizer: React.FC = () => {
  const {
    theme,
    presetId,
    complexity,
    mode,
    performanceLevel,
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
  } = useEarthMindTheme();

  const [activeSection, setActiveSection] = useState<
    'theme' | 'glass' | 'depth' | 'shape' | 'typography' | 'motion' | 'layout' | 'earth' | 'map' | 'data' | 'access'
  >('theme');
  const [tokenSearch, setTokenSearch] = useState('');
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  if (!isAppearanceStudioOpen) return null;

  const handleCopyCSS = () => {
    const css = `:root {
  --earthmind-bg: ${theme.colors.bg};
  --earthmind-surface: ${theme.colors.surface};
  --earthmind-glass-blur: ${theme.glass.blur}px;
  --earthmind-glass-opacity: ${theme.glass.opacity}%;
  --earthmind-radius: ${Math.round((theme.shape.cornerRadius / 100) * 32)}px;
  --earthmind-accent: ${theme.colors.accent};
}`;
    navigator.clipboard.writeText(css);
    setCopiedCSS(true);
    setTimeout(() => setCopiedCSS(false), 2000);
  };

  const handleImportSubmit = () => {
    const res = importThemeJSON(importText);
    if (res.success) {
      setImportModalOpen(false);
      setImportText('');
      setImportError('');
    } else {
      setImportError(res.error || 'Failed to import JSON');
    }
  };

  const handleDownloadJSON = () => {
    const json = exportThemeJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `earthmind-theme-${theme.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full h-full max-w-[1600px] max-h-[96vh] rounded-3xl glass-panel-3 border border-white/20 shadow-2xl flex flex-col overflow-hidden relative">
        {/* TOP TOOLBAR */}
        <header className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-earth-ocean to-earth-aqua text-[#071A2B] shadow-md">
              <Palette className="w-5 h-5 text-[#071A2B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white font-mono tracking-wider">
                  APPEARANCE STUDIO <span className="text-earth-aqua">2.0</span>
                </h2>
                <GlassBadge tone="aqua" size="sm">
                  0–100% ENGINE
                </GlassBadge>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Liquid Glass Physics • Dynamic Optical Depth • Spatial Theming OS
              </p>
            </div>
          </div>

          {/* COMPLEXITY SCALE SELECTOR (0% -> 25% -> 50% -> 75% -> 100%) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 px-2 uppercase tracking-wider">Complexity:</span>
            {([0, 25, 50, 75, 100] as CustomizationComplexity[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setComplexity(lvl)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  complexity === lvl
                    ? 'bg-earth-aqua text-[#071A2B] shadow-md shadow-earth-aqua/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {lvl}%
              </button>
            ))}
          </div>

          {/* DESIGN MODES SWITCHER */}
          <div className="hidden xl:flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
            <span className="text-[10px] text-slate-400 px-2">Mode:</span>
            {(['earth', 'focus', 'data', 'research', 'simulation', 'exhibition', 'control'] as DesignMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-2 py-0.5 rounded capitalize ${
                  mode === m ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <GlassButton variant="ghost" size="sm" onClick={resetTheme} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset
            </GlassButton>
            <GlassButton variant="ghost" size="sm" onClick={() => setImportModalOpen(true)} leftIcon={<Upload className="w-3.5 h-3.5" />}>
              Import
            </GlassButton>
            <GlassButton variant="ghost" size="sm" onClick={handleDownloadJSON} leftIcon={<Download className="w-3.5 h-3.5" />}>
              Export
            </GlassButton>
            <button
              onClick={() => toggleAppearanceStudio(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 3-PANE LAYOUT: LEFT CONTROLS | CENTER PREVIEW | RIGHT TOKEN INSPECTOR */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {/* =========================================================================
              LEFT PANE: CUSTOMIZATION CONTROLS (lg:col-span-4)
              ========================================================================= */}
          <aside className="lg:col-span-4 flex flex-col h-full overflow-hidden bg-slate-900/40">
            {/* Navigation Tabs for Sections */}
            <div className="flex items-center gap-1 overflow-x-auto p-2 border-b border-white/10 custom-scrollbar flex-shrink-0">
              {[
                { id: 'theme', label: 'Theme', icon: <Palette className="w-3.5 h-3.5" /> },
                { id: 'glass', label: 'Glass', icon: <Sliders className="w-3.5 h-3.5" /> },
                { id: 'depth', label: 'Depth', icon: <Layers className="w-3.5 h-3.5" /> },
                { id: 'shape', label: 'Shape', icon: <Maximize2 className="w-3.5 h-3.5" /> },
                { id: 'typography', label: 'Type', icon: <Type className="w-3.5 h-3.5" /> },
                { id: 'motion', label: 'Motion', icon: <Activity className="w-3.5 h-3.5" /> },
                { id: 'layout', label: 'Layout', icon: <Compass className="w-3.5 h-3.5" /> },
                { id: 'earth', label: 'Earth', icon: <Globe2 className="w-3.5 h-3.5" /> },
                { id: 'map', label: 'Map', icon: <Layers className="w-3.5 h-3.5" /> },
                { id: 'data', label: 'Data', icon: <Database className="w-3.5 h-3.5" /> },
                { id: 'access', label: 'A11y', icon: <AccessIcon className="w-3.5 h-3.5" /> },
              ].map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all ${
                    activeSection === sec.id
                      ? 'bg-earth-aqua text-[#071A2B] font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {sec.icon}
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>

            {/* Scrollable Control Panels */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
              {/* 1. THEME SECTION */}
              {activeSection === 'theme' && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-white/10">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      PLANETARY PRESETS (10 TIERS)
                    </h3>
                    <p className="text-[11px] text-slate-400">Instant aerospace and scientific optical profiles</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(THEME_PRESETS).map((p) => {
                      const isSelected = presetId === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setPreset(p.id)}
                          className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between ${
                            isSelected
                              ? 'bg-earth-aqua/20 border-earth-aqua shadow-[0_0_20px_rgba(24,200,200,0.3)]'
                              : 'glass-panel-1 border-white/10 hover:border-white/25 hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white font-mono">{p.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-earth-aqua" />}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.colors.accent }} />
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.colors.bg }} />
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.colors.accentSecondary }} />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-2 line-clamp-2">{p.description}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3 rounded-xl glass-panel-1 border border-white/10 space-y-2">
                    <label className="text-xs font-mono text-slate-300">Custom Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={theme.colors.accent}
                        onChange={(e) =>
                          updateTheme((prev) => ({
                            ...prev,
                            colors: { ...prev.colors, accent: e.target.value, glow: `${e.target.value}44` },
                          }))
                        }
                        className="w-10 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={theme.colors.accent}
                        onChange={(e) =>
                          updateTheme((prev) => ({
                            ...prev,
                            colors: { ...prev.colors, accent: e.target.value },
                          }))
                        }
                        className="flex-1 px-3 py-1 bg-slate-900/60 rounded-lg text-xs font-mono text-white border border-white/10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. GLASS SECTION */}
              {activeSection === 'glass' && (
                <div className="space-y-3">
                  <div className="pb-2 border-b border-white/10">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      LIQUID GLASS PHYSICS
                    </h3>
                    <p className="text-[11px] text-slate-400">Backdrop refraction, specular sheen & edge density</p>
                  </div>

                  <GlassSlider
                    label="Glass Opacity"
                    value={theme.glass.opacity}
                    onChange={(v) => updateTheme((p) => ({ ...p, glass: { ...p.glass, opacity: v } }))}
                    unit="%"
                    desc="Substrate transmissivity"
                  />
                  <GlassSlider
                    label="Backdrop Blur"
                    value={theme.glass.blur}
                    onChange={(v) => updateTheme((p) => ({ ...p, glass: { ...p.glass, blur: v } }))}
                    unit="%"
                    desc="Rayleigh dispersion radius (0-40px)"
                  />
                  <GlassSlider
                    label="Backdrop Saturation"
                    value={theme.glass.saturation}
                    onChange={(v) => updateTheme((p) => ({ ...p, glass: { ...p.glass, saturation: v } }))}
                    min={50}
                    max={200}
                    unit="%"
                    desc="Chrominance boost under glass"
                  />
                  <GlassSlider
                    label="Backdrop Brightness"
                    value={theme.glass.brightness}
                    onChange={(v) => updateTheme((p) => ({ ...p, glass: { ...p.glass, brightness: v } }))}
                    min={50}
                    max={150}
                    unit="%"
                    desc="Optical luminosity under glass"
                  />
                  <GlassSlider
                    label="Glass Density"
                    value={theme.glass.density}
                    onChange={(v) => updateTheme((p) => ({ ...p, glass: { ...p.glass, density: v } }))}
                    unit="%"
                    desc="Physical material thickness"
                  />
                  <GlassSlider
                    label="Specular Reflection"
                    value={theme.glass.reflection}
                    onChange={(v) => updateTheme((p) => ({ ...p, glass: { ...p.glass, reflection: v } }))}
                    unit="%"
                    desc="Pointer sheen intensity"
                  />
                  <GlassSlider
                    label="Film Noise / Grain"
                    value={theme.glass.noise}
                    onChange={(v) => updateTheme((p) => ({ ...p, glass: { ...p.glass, noise: v } }))}
                    unit="%"
                    desc="Optical glass micro-texture"
                  />
                  <GlassSlider
                    label="Border Visibility"
                    value={theme.glass.borderVisibility}
                    onChange={(v) => updateTheme((p) => ({ ...p, glass: { ...p.glass, borderVisibility: v } }))}
                    unit="%"
                    desc="Precision chamfer visibility"
                  />
                  <GlassSlider
                    label="Border Brightness"
                    value={theme.glass.borderBrightness}
                    onChange={(v) => updateTheme((p) => ({ ...p, glass: { ...p.glass, borderBrightness: v } }))}
                    unit="%"
                    desc="Bevel specular highlight"
                  />
                </div>
              )}

              {/* 3. DEPTH SECTION */}
              {activeSection === 'depth' && (
                <div className="space-y-3">
                  <div className="pb-2 border-b border-white/10">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      OPTICAL DEPTH & LIGHTING
                    </h3>
                    <p className="text-[11px] text-slate-400">Elevation, volumetric shadow & photon radiance</p>
                  </div>
                  <GlassSlider
                    label="Shadow Density"
                    value={theme.depth.shadow}
                    onChange={(v) => updateTheme((p) => ({ ...p, depth: { ...p.depth, shadow: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Layer Elevation"
                    value={theme.depth.elevation}
                    onChange={(v) => updateTheme((p) => ({ ...p, depth: { ...p.depth, elevation: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Ambient Illumination"
                    value={theme.depth.ambientLight}
                    onChange={(v) => updateTheme((p) => ({ ...p, depth: { ...p.depth, ambientLight: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Surface Depth Z-Offset"
                    value={theme.depth.surfaceDepth}
                    onChange={(v) => updateTheme((p) => ({ ...p, depth: { ...p.depth, surfaceDepth: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Photon Aura / Glow"
                    value={theme.depth.glow}
                    onChange={(v) => updateTheme((p) => ({ ...p, depth: { ...p.depth, glow: v } }))}
                    unit="%"
                  />
                </div>
              )}

              {/* 4. SHAPE SECTION */}
              {activeSection === 'shape' && (
                <div className="space-y-3">
                  <div className="pb-2 border-b border-white/10">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      SPATIAL GEOMETRY & SHAPES
                    </h3>
                    <p className="text-[11px] text-slate-400">Corner chamfers, card curvature & button radii</p>
                  </div>
                  <GlassSlider
                    label="Corner Radius"
                    value={theme.shape.cornerRadius}
                    onChange={(v) => updateTheme((p) => ({ ...p, shape: { ...p.shape, cornerRadius: v } }))}
                    unit="%"
                    desc="Global card roundness"
                  />
                  <GlassSlider
                    label="Panel Roundness"
                    value={theme.shape.panelRoundness}
                    onChange={(v) => updateTheme((p) => ({ ...p, shape: { ...p.shape, panelRoundness: v } }))}
                    unit="%"
                    desc="Structural panels curvature"
                  />
                  <GlassSlider
                    label="Button Roundness"
                    value={theme.shape.buttonRoundness}
                    onChange={(v) => updateTheme((p) => ({ ...p, shape: { ...p.shape, buttonRoundness: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Chip Roundness"
                    value={theme.shape.chipRoundness}
                    onChange={(v) => updateTheme((p) => ({ ...p, shape: { ...p.shape, chipRoundness: v } }))}
                    unit="%"
                  />
                </div>
              )}

              {/* 5. TYPOGRAPHY SECTION */}
              {activeSection === 'typography' && (
                <div className="space-y-3">
                  <div className="pb-2 border-b border-white/10">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      SCIENTIFIC TYPOGRAPHY
                    </h3>
                    <p className="text-[11px] text-slate-400">High-legibility fonts, tabular scales & metrics</p>
                  </div>
                  <GlassSelect
                    label="Font Family"
                    value={theme.typography.fontFamily}
                    onChange={(e) =>
                      updateTheme((p) => ({
                        ...p,
                        typography: { ...p.typography, fontFamily: e.target.value as any },
                      }))
                    }
                    options={[
                      { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Default)' },
                      { value: 'Inter', label: 'Inter (SaaS Minimal)' },
                      { value: 'JetBrains Mono', label: 'JetBrains Mono (Aerospace Command)' },
                      { value: 'Outfit', label: 'Outfit (Futuristic Spatial)' },
                      { value: 'System', label: 'System Native' },
                    ]}
                  />
                  <GlassSlider
                    label="Font Scale"
                    value={theme.typography.fontSizeScale}
                    onChange={(v) => updateTheme((p) => ({ ...p, typography: { ...p.typography, fontSizeScale: v } }))}
                    min={85}
                    max={135}
                    unit="%"
                  />
                  <GlassSlider
                    label="Heading Scale"
                    value={theme.typography.headingScale}
                    onChange={(v) => updateTheme((p) => ({ ...p, typography: { ...p.typography, headingScale: v } }))}
                    min={85}
                    max={135}
                    unit="%"
                  />
                  <GlassSlider
                    label="Data & Metrics Scale"
                    value={theme.typography.dataScale}
                    onChange={(v) => updateTheme((p) => ({ ...p, typography: { ...p.typography, dataScale: v } }))}
                    min={85}
                    max={140}
                    unit="%"
                  />
                  <GlassSlider
                    label="Letter Spacing"
                    value={theme.typography.letterSpacing}
                    onChange={(v) => updateTheme((p) => ({ ...p, typography: { ...p.typography, letterSpacing: v } }))}
                    min={-1}
                    max={3}
                    unit="px"
                  />
                </div>
              )}

              {/* 6. MOTION SECTION */}
              {activeSection === 'motion' && (
                <div className="space-y-3">
                  <div className="pb-2 border-b border-white/10">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      PHYSICAL MOTION SYSTEM
                    </h3>
                    <p className="text-[11px] text-slate-400">Spring kinetics, hover reaction & glass refraction</p>
                  </div>
                  <GlassSlider
                    label="Animation Intensity"
                    value={theme.motion.intensity}
                    onChange={(v) => updateTheme((p) => ({ ...p, motion: { ...p.motion, intensity: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Hover Motion"
                    value={theme.motion.hoverMotion}
                    onChange={(v) => updateTheme((p) => ({ ...p, motion: { ...p.motion, hoverMotion: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Transition Speed"
                    value={theme.motion.transitionSpeed}
                    onChange={(v) => updateTheme((p) => ({ ...p, motion: { ...p.motion, transitionSpeed: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Glass Refraction Motion"
                    value={theme.motion.glassRefraction}
                    onChange={(v) => updateTheme((p) => ({ ...p, motion: { ...p.motion, glassRefraction: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Parallax Depth"
                    value={theme.motion.parallax}
                    onChange={(v) => updateTheme((p) => ({ ...p, motion: { ...p.motion, parallax: v } }))}
                    unit="%"
                  />
                </div>
              )}

              {/* 7. LAYOUT SECTION */}
              {activeSection === 'layout' && (
                <div className="space-y-3">
                  <div className="pb-2 border-b border-white/10">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      WORKSPACE LAYOUT
                    </h3>
                  </div>
                  <GlassSlider
                    label="Information Density"
                    value={theme.layout.informationDensity}
                    onChange={(v) => updateTheme((p) => ({ ...p, layout: { ...p.layout, informationDensity: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Panel Spacing"
                    value={theme.layout.panelSpacing}
                    onChange={(v) => updateTheme((p) => ({ ...p, layout: { ...p.layout, panelSpacing: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Navigation Width"
                    value={theme.layout.navigationWidth}
                    onChange={(v) => updateTheme((p) => ({ ...p, layout: { ...p.layout, navigationWidth: v } }))}
                    unit="%"
                  />
                </div>
              )}

              {/* 8. EARTH SECTION */}
              {activeSection === 'earth' && (
                <div className="space-y-3">
                  <div className="pb-2 border-b border-white/10">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      3D PLANETARY ENGINE
                    </h3>
                  </div>
                  <GlassSlider
                    label="Atmosphere Scattering"
                    value={theme.earth.atmosphere}
                    onChange={(v) => updateTheme((p) => ({ ...p, earth: { ...p.earth, atmosphere: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Earth Radiance / Glow"
                    value={theme.earth.glow}
                    onChange={(v) => updateTheme((p) => ({ ...p, earth: { ...p.earth, glow: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Cloud Layer Opacity"
                    value={theme.earth.cloudVisibility}
                    onChange={(v) => updateTheme((p) => ({ ...p, earth: { ...p.earth, cloudVisibility: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Nocturnal City Lights"
                    value={theme.earth.nightLights}
                    onChange={(v) => updateTheme((p) => ({ ...p, earth: { ...p.earth, nightLights: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Rotation Physics Speed"
                    value={theme.earth.rotationSpeed}
                    onChange={(v) => updateTheme((p) => ({ ...p, earth: { ...p.earth, rotationSpeed: v } }))}
                    unit="%"
                  />
                </div>
              )}

              {/* 9. MAP & 10. DATA & 11. ACCESSIBILITY */}
              {activeSection === 'data' && (
                <div className="space-y-3">
                  <div className="pb-2 border-b border-white/10">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      DATA VISUALIZATION STYLING
                    </h3>
                  </div>
                  <GlassSlider
                    label="Chart Photon Glow"
                    value={theme.data.chartGlow}
                    onChange={(v) => updateTheme((p) => ({ ...p, data: { ...p.data, chartGlow: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Line / Bar Thickness"
                    value={theme.data.chartThickness}
                    onChange={(v) => updateTheme((p) => ({ ...p, data: { ...p.data, chartThickness: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Grid Visibility"
                    value={theme.data.gridVisibility}
                    onChange={(v) => updateTheme((p) => ({ ...p, data: { ...p.data, gridVisibility: v } }))}
                    unit="%"
                  />
                </div>
              )}

              {activeSection === 'map' && (
                <div className="space-y-3">
                  <div className="pb-2 border-b border-white/10">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      GIS & MAP CARTOGRAPHY
                    </h3>
                  </div>
                  <GlassSlider
                    label="Heatmap Intensity"
                    value={theme.map.heatmapIntensity}
                    onChange={(v) => updateTheme((p) => ({ ...p, map: { ...p.map, heatmapIntensity: v } }))}
                    unit="%"
                  />
                  <GlassSlider
                    label="Cartographic Grid"
                    value={theme.map.grid}
                    onChange={(v) => updateTheme((p) => ({ ...p, map: { ...p.map, grid: v } }))}
                    unit="%"
                  />
                </div>
              )}

              {activeSection === 'access' && (
                <div className="space-y-3">
                  <div className="pb-2 border-b border-white/10">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      ACCESSIBILITY & HARDWARE PROFILE
                    </h3>
                  </div>
                  <GlassToggle
                    label="Reduce Motion"
                    checked={theme.accessibility.reduceMotion}
                    onChange={(c) => updateTheme((p) => ({ ...p, accessibility: { ...p.accessibility, reduceMotion: c } }))}
                    desc="Disables non-essential physics and transitions"
                  />
                  <GlassToggle
                    label="High Contrast Glass"
                    checked={theme.accessibility.highContrast}
                    onChange={(c) => updateTheme((p) => ({ ...p, accessibility: { ...p.accessibility, highContrast: c } }))}
                    desc="Solidifies borders and increases text luminance"
                  />
                  <GlassToggle
                    label="Large Typography"
                    checked={theme.accessibility.largeText}
                    onChange={(c) => updateTheme((p) => ({ ...p, accessibility: { ...p.accessibility, largeText: c } }))}
                    desc="Increases base font size across all interfaces"
                  />
                  <GlassSelect
                    label="Performance Profile"
                    value={performanceLevel}
                    onChange={(e) => setPerformanceLevel(e.target.value as PerformanceLevel)}
                    options={[
                      { value: 'ultra', label: 'Ultra (Full Glass Refraction & Sheen)' },
                      { value: 'high', label: 'High (Standard Liquid Glass)' },
                      { value: 'balanced', label: 'Balanced (Optimized for Laptops)' },
                      { value: 'low', label: 'Low (Reduced Blur for Older GPUs)' },
                    ]}
                  />
                </div>
              )}
            </div>
          </aside>

          {/* =========================================================================
              CENTER PANE: LIVE EARTHMIND PREVIEW (lg:col-span-5)
              Changes update instantly. No page reload.
              ========================================================================= */}
          <main className="lg:col-span-5 flex flex-col h-full overflow-hidden bg-slate-950/60 p-4 relative">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-earth-aqua" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  REAL-TIME PREVIEW
                </span>
              </div>
              <GlassBadge tone="emerald" size="sm" pulse>
                LIVE SYNCHRONIZED
              </GlassBadge>
            </div>

            {/* LIVE PREVIEW VIEWPORT */}
            <div className="flex-1 rounded-2xl border border-white/15 overflow-y-auto custom-scrollbar p-4 space-y-4 relative bg-radial-aurora">
              {/* Mini Earth with atmospheric limb and HUD capsules */}
              <div className="relative h-56 rounded-2xl glass-panel-2 border border-white/10 overflow-hidden flex items-center justify-center">
                {/* Visual Living Earth Globe Representation */}
                <div
                  className="w-36 h-36 rounded-full relative shadow-2xl transition-all duration-300"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #18C8C8 0%, #087EA4 45%, #071A2B 90%)',
                    boxShadow: `0 0 ${theme.earth.glow * 0.6}px var(--earthmind-accent)`,
                  }}
                >
                  {/* Atmospheric Glow Ring */}
                  <div
                    className="absolute -inset-2 rounded-full border pointer-events-none transition-all duration-300"
                    style={{
                      borderColor: 'var(--earthmind-accent)',
                      opacity: theme.earth.atmosphere / 100,
                      boxShadow: `0 0 25px var(--earthmind-accent)`,
                    }}
                  />
                  {/* Subtle orbiting satellite marker */}
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-white animate-ping" />
                </div>

                {/* Floating Earth Glass HUD Data Capsules (Per Specification) */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-panel-highlight border border-white/20 text-[10px] font-mono font-bold text-white flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-earth-coral" />
                  <span>TEMP: +1.18°C</span>
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass-panel-highlight border border-white/20 text-[10px] font-mono font-bold text-white flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-earth-emerald" />
                  <span>AQI: GOOD (34)</span>
                </div>

                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full glass-panel-highlight border border-white/20 text-[10px] font-mono font-bold text-white flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-earth-aqua" />
                  <span>WATER: MODERATE</span>
                </div>

                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full glass-panel-highlight border border-white/20 text-[10px] font-mono font-bold text-white flex items-center gap-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-earth-leaf" />
                  <span>CANOPY: -4.2%</span>
                </div>
              </div>

              {/* Sample Redesigned Data Cards (5-part structure) */}
              <div className="grid grid-cols-2 gap-3">
                <GlassMetric
                  label="Global Temperature"
                  value="+1.18"
                  unit="°C"
                  trend="↑ 0.12°C"
                  trendDirection="up"
                  context="Compared with baseline"
                  statusTone="coral"
                  reversePolarity
                />

                <GlassMetric
                  label="Atmospheric AQI"
                  value="42"
                  unit="AQI"
                  trend="↓ 6.4%"
                  trendDirection="down"
                  context="Clean air status"
                  statusTone="emerald"
                />
              </div>

              {/* Sample Live Interactive Glass Controls */}
              <GlassCard variant="medium" className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold text-white uppercase">Live Component Suite</h4>
                  <GlassBadge tone="aqua" size="sm">ACTIVE</GlassBadge>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <GlassButton variant="primary" size="sm">
                    Action Primary
                  </GlassButton>
                  <GlassButton variant="emerald" size="sm">
                    Save Scenario
                  </GlassButton>
                  <GlassButton variant="ghost" size="sm">
                    Secondary
                  </GlassButton>
                </div>
              </GlassCard>
            </div>
          </main>

          {/* =========================================================================
              RIGHT PANE: TOKEN INSPECTOR (lg:col-span-3)
              ========================================================================= */}
          <aside className="lg:col-span-3 flex flex-col h-full overflow-hidden bg-slate-900/60 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-earth-aqua" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  TOKEN INSPECTOR
                </span>
              </div>
              <button
                onClick={handleCopyCSS}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                title="Copy CSS Tokens"
              >
                {copiedCSS ? <Check className="w-3 h-3 text-earth-emerald" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCSS ? 'Copied' : 'CSS'}</span>
              </button>
            </div>

            {/* Token Filter Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter CSS tokens..."
                value={tokenSearch}
                onChange={(e) => setTokenSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950/60 rounded-xl border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-earth-aqua"
              />
            </div>

            {/* Live Token Variables List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 font-mono text-[11px] pr-1">
              {[
                { name: '--earthmind-bg', val: theme.colors.bg },
                { name: '--earthmind-surface', val: theme.colors.surface },
                { name: '--earthmind-accent', val: theme.colors.accent },
                { name: '--earthmind-glass-opacity', val: `${theme.glass.opacity}%` },
                { name: '--earthmind-glass-blur', val: `${theme.glass.blur}px` },
                { name: '--earthmind-glass-density', val: `${theme.glass.density}%` },
                { name: '--earthmind-glass-reflection', val: `${theme.glass.reflection}%` },
                { name: '--earthmind-radius', val: `${Math.round((theme.shape.cornerRadius / 100) * 32)}px` },
                { name: '--earthmind-panel-radius', val: `${Math.round((theme.shape.panelRoundness / 100) * 36)}px` },
                { name: '--earthmind-font-sans', val: theme.typography.fontFamily },
                { name: '--earthmind-motion-duration', val: `${Math.round(250 * (100 / Math.max(10, theme.motion.transitionSpeed)))}ms` },
                { name: '--earthmind-earth-glow', val: `${theme.earth.glow}%` },
                { name: '--earthmind-chart-glow', val: `${theme.data.chartGlow}%` },
              ]
                .filter((t) => t.name.toLowerCase().includes(tokenSearch.toLowerCase()) || t.val.toLowerCase().includes(tokenSearch.toLowerCase()))
                .map((t) => (
                  <div key={t.name} className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between gap-2">
                    <span className="text-slate-400 truncate" title={t.name}>{t.name}</span>
                    <span className="text-earth-aqua font-bold truncate max-w-[50%]" title={t.val}>{t.val}</span>
                  </div>
                ))}
            </div>

            <div className="pt-3 border-t border-white/10 mt-2 flex flex-col gap-2">
              <GlassButton variant="ghost" size="sm" onClick={resetAllAppearance} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                Reset All to Default
              </GlassButton>
            </div>
          </aside>
        </div>
      </div>

      {/* IMPORT THEME MODAL */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 rounded-2xl glass-panel-3 border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-mono uppercase">Import EarthMind Theme JSON</h3>
              <button onClick={() => setImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              rows={8}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste serialized theme JSON here..."
              className="w-full p-3 rounded-xl bg-slate-900/80 border border-white/15 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-earth-aqua"
            />
            {importError && <p className="text-xs text-red-400 font-mono">{importError}</p>}
            <div className="flex justify-end gap-2">
              <GlassButton variant="ghost" size="sm" onClick={() => setImportModalOpen(false)}>
                Cancel
              </GlassButton>
              <GlassButton variant="primary" size="sm" onClick={handleImportSubmit}>
                Import Theme
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
