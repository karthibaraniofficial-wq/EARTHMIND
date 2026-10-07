import React, { useState } from 'react';
import { 
  Settings, 
  Eye, 
  Globe2, 
  Layers, 
  Sun, 
  Compass, 
  Sliders, 
  Bot, 
  Database, 
  Volume2, 
  RotateCcw, 
  Check, 
  Sparkles,
  Grid,
  ShieldCheck,
  Mic,
  Terminal
} from 'lucide-react';
import { Palette } from '../components/icons';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassBadge } from '../components/glass/GlassBadge';
import { GlassButton } from '../components/glass/GlassButton';
import { useTwinConfig } from '../context/TwinConfigContext';
import { useVoice } from '../voice/VoiceContext';
import { useEarthMindTheme } from '../theme/ThemeProvider';

export const SettingsView: React.FC = () => {
  const { config, updateConfig, resetConfig } = useTwinConfig();
  const { settings: voiceSettings, updateSettings: updateVoiceSettings, toggleTestConsole } = useVoice();
  const { toggleAppearanceStudio, presetId, setPreset, theme } = useEarthMindTheme();
  const [activeTab, setActiveTab] = useState<
    'visual' | 'earth' | 'grid' | 'lighting' | 'gis' | 'layers' | 'sim' | 'ai' | 'data' | 'system' | 'voice'
  >('earth');
  const [saveBanner, setSaveBanner] = useState(false);

  const triggerSaveNotification = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2000);
  };

  const tabs = [
    { id: 'earth' as const, label: '01. Earth Core', icon: <Globe2 className="w-4 h-4" /> },
    { id: 'visual' as const, label: '02. Liquid Glass', icon: <Eye className="w-4 h-4" /> },
    { id: 'grid' as const, label: '03. 3D & Coordinates', icon: <Grid className="w-4 h-4" /> },
    { id: 'lighting' as const, label: '04. Sun & Lighting', icon: <Sun className="w-4 h-4" /> },
    { id: 'gis' as const, label: '05. GIS & Units', icon: <Compass className="w-4 h-4" /> },
    { id: 'layers' as const, label: '06. Multi-Spectral', icon: <Layers className="w-4 h-4" /> },
    { id: 'sim' as const, label: '07. What-If Engine', icon: <Sliders className="w-4 h-4" /> },
    { id: 'ai' as const, label: '08. AI & Research', icon: <Bot className="w-4 h-4" /> },
    { id: 'data' as const, label: '09. Data & Uncertainty', icon: <Database className="w-4 h-4" /> },
    { id: 'system' as const, label: '10. System & Expo', icon: <Settings className="w-4 h-4" /> },
    { id: 'voice' as const, label: '11. Voice & Speech', icon: <Mic className="w-4 h-4 text-earth-aqua" /> },
  ];


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              EARTHMIND TWIN V3.0 — CONFIGURATION OPERATING SYSTEM
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Twin OS Central Configuration</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Fine-tune all 500 parameters governing 3D planetary rendering, biophysical simulation coupling, sensor uncertainty thresholds, and spatial liquid-glass surfaces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => {
              resetConfig();
              triggerSaveNotification();
            }}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Reset All to Defaults
          </GlassButton>
        </div>
      </div>

      {saveBanner && (
        <div className="p-3 rounded-xl bg-earth-emerald/20 border border-earth-emerald/40 text-earth-emerald text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>Configuration updated & persisted to Twin OS local storage!</span>
        </div>
      )}

      {/* Main Settings Tabbed Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Tab Categories (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-1.5 glass-panel-1 p-2 rounded-2xl border border-white/10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-earth-aqua text-[#071A2B] font-bold shadow-md shadow-earth-aqua/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Options Panel (lg:col-span-8) */}
        <div className="lg:col-span-8">
          <GlassCard variant="strong" glow="aqua" className="p-6 border border-white/20 space-y-6">
            {/* 01. EARTH CORE */}
            {activeTab === 'earth' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-white/10">
                  <h2 className="text-base font-bold text-white font-mono uppercase">01. Earth Planetary Core Options (011–020)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Physical rendering, rotation physics, atmospheric limb, and nocturnal lighting.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Planetary Auto-Rotation</div>
                      <div className="text-[10px] text-slate-400">Keep Earth spinning continuously in default mode</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.earthAutoRotate}
                      onChange={(e) => updateConfig({ earthAutoRotate: e.target.checked })}
                      className="w-4 h-4 accent-earth-aqua cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-semibold">Earth Rotation Speed:</span>
                      <span className="text-earth-aqua font-bold">{config.earthRotationSpeed.toFixed(4)} rad/f</span>
                    </div>
                    <input
                      type="range"
                      min={0.0002}
                      max={0.004}
                      step={0.0002}
                      value={config.earthRotationSpeed}
                      onChange={(e) => updateConfig({ earthRotationSpeed: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Atmosphere Scattering Shell</div>
                      <div className="text-[10px] text-slate-400">Rayleigh atmospheric limb with Fresnel azure glow</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.showAtmosphere}
                      onChange={(e) => updateConfig({ showAtmosphere: e.target.checked })}
                      className="w-4 h-4 accent-earth-aqua cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-semibold">Cloud Layer Opacity:</span>
                      <span className="text-earth-aqua font-bold">{Math.round(config.cloudOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={1.0}
                      step={0.05}
                      value={config.cloudOpacity}
                      onChange={(e) => updateConfig({ cloudOpacity: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Night Lights Terminator Glow</div>
                      <div className="text-[10px] text-slate-400">VIIRS nocturnal city clusters emerging on dark side</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.showNightLights}
                      onChange={(e) => updateConfig({ showNightLights: e.target.checked })}
                      className="w-4 h-4 accent-earth-aqua cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 02. VISUAL & LIQUID GLASS */}
            {activeTab === 'visual' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-white/10">
                  <h2 className="text-base font-bold text-white font-mono uppercase">02. Liquid Glass & Spatial UI (001–010)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Blur radius, translucency, neon glow accent, and visual density.</p>
                </div>

                {/* Appearance Studio 2.0 Master Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-earth-ocean/30 via-earth-aqua/15 to-earth-aurora/20 border border-earth-aqua/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-earth-aqua" />
                      <span className="font-mono font-bold text-sm text-white">Appearance Studio 2.0</span>
                      <GlassBadge tone="aqua" size="sm">0–100% ENGINE</GlassBadge>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-md">
                      Live 3-pane theme editor with live Earth preview, token inspector, 10 presets, glass physics, and complete design customization.
                    </p>
                  </div>
                  <GlassButton
                    variant="primary"
                    size="sm"
                    onClick={() => toggleAppearanceStudio(true)}
                    leftIcon={<Palette className="w-4 h-4" />}
                  >
                    Open Appearance Studio
                  </GlassButton>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5 p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-semibold">Glass Backdrop Blur:</span>
                      <span className="text-earth-aqua font-bold">{config.glassBlur}px</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={32}
                      step={2}
                      value={config.glassBlur}
                      onChange={(e) => updateConfig({ glassBlur: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua"
                    />
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-semibold">Glass Surface Opacity:</span>
                      <span className="text-earth-aqua font-bold">{Math.round(config.glassOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.3}
                      max={0.95}
                      step={0.05}
                      value={config.glassOpacity}
                      onChange={(e) => updateConfig({ glassOpacity: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua"
                    />
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl glass-panel-1 border border-white/5">
                    <label className="text-xs font-bold text-white font-mono block">Color Palette Theme</label>
                    <select
                      value={config.activeTheme}
                      onChange={(e) => updateConfig({ activeTheme: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white font-mono"
                    >
                      <option value="deep_space">Deep Space Obsidian (#071A2B)</option>
                      <option value="aurora_borealis">Aurora Borealis Violet (#9B7CFF)</option>
                      <option value="oceanic_abyss">Oceanic Abyss Azure (#18C8C8)</option>
                      <option value="scientific_monochrome">Scientific Clean High-Contrast</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 03. 3D & COORDINATES */}
            {activeTab === 'grid' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-white/10">
                  <h2 className="text-base font-bold text-white font-mono uppercase">03. 3D & Coordinate Grids (014–020)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Latitude/longitude spherical parallels, Equator, and camera physics.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Spherical Coordinate Grid (Lat/Lng)</div>
                      <div className="text-[10px] text-slate-400">Display subtle blue parallels and meridians on Earth</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.showCoordinateGrid}
                      onChange={(e) => updateConfig({ showCoordinateGrid: e.target.checked })}
                      className="w-4 h-4 accent-earth-aqua cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Highlight Equator Line (0° Lat)</div>
                      <div className="text-[10px] text-slate-400">Cyan illuminated equatorial baseline ring</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.showEquatorLine}
                      onChange={(e) => updateConfig({ showEquatorLine: e.target.checked })}
                      className="w-4 h-4 accent-earth-aqua cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-semibold">Camera Field Of View (FOV):</span>
                      <span className="text-earth-aqua font-bold">{config.cameraFov}°</span>
                    </div>
                    <input
                      type="range"
                      min={35}
                      max={55}
                      step={1}
                      value={config.cameraFov}
                      onChange={(e) => updateConfig({ cameraFov: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 04. SUN & LIGHTING */}
            {activeTab === 'lighting' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-white/10">
                  <h2 className="text-base font-bold text-white font-mono uppercase">04. Sunlight & Lighting Vector (031–040)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Directional solar radiance and ocean specular reflection strength.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5 p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-semibold">Directional Sun Intensity:</span>
                      <span className="text-earth-aqua font-bold">{config.sunlightIntensity.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={2.5}
                      step={0.1}
                      value={config.sunlightIntensity}
                      onChange={(e) => updateConfig({ sunlightIntensity: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua"
                    />
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-semibold">Ambient Deep Space Fill:</span>
                      <span className="text-earth-aqua font-bold">{config.ambientLightIntensity.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={0.8}
                      step={0.05}
                      value={config.ambientLightIntensity}
                      onChange={(e) => updateConfig({ ambientLightIntensity: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 05. GIS & UNITS */}
            {activeTab === 'gis' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-white/10">
                  <h2 className="text-base font-bold text-white font-mono uppercase">05. GIS & Coordinate Formats (018 & 221–230)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Geographic projection standards and metric units.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-3 rounded-xl glass-panel-1 border border-white/5 space-y-1.5">
                    <label className="text-xs font-bold text-white font-mono block">Coordinate Format</label>
                    <select
                      value={config.coordinateFormat}
                      onChange={(e) => updateConfig({ coordinateFormat: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white font-mono"
                    >
                      <option value="decimal_degrees">Decimal Degrees (e.g. 28.61° N, 77.20° E)</option>
                      <option value="degrees_minutes_seconds">Degrees Minutes Seconds (e.g. 28°36'36" N)</option>
                      <option value="mgrs">Military Grid Reference System (MGRS)</option>
                    </select>
                  </div>

                  <div className="p-3 rounded-xl glass-panel-1 border border-white/5 space-y-1.5">
                    <label className="text-xs font-bold text-white font-mono block">Measurement Units</label>
                    <select
                      value={config.measurementUnit}
                      onChange={(e) => updateConfig({ measurementUnit: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white font-mono"
                    >
                      <option value="metric">Metric (Celsius °C, Meters, Kilometers, mm/h)</option>
                      <option value="imperial">Imperial (Fahrenheit °F, Miles, Inches)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 06. MULTI-SPECTRAL LAYERS */}
            {activeTab === 'layers' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-white/10">
                  <h2 className="text-base font-bold text-white font-mono uppercase">06. Multi-Spectral Layer Overlays (051–060)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Transparent data overlay opacity and color mapping.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5 p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-semibold">Overlay Opacity on Earth:</span>
                      <span className="text-earth-aqua font-bold">{Math.round(config.overlayOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.3}
                      max={0.95}
                      step={0.05}
                      value={config.overlayOpacity}
                      onChange={(e) => updateConfig({ overlayOpacity: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Continuous Spatial Smoothing</div>
                      <div className="text-[10px] text-slate-400">Radial Gaussian interpolation over sensor grid pixels</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.overlaySmoothing}
                      onChange={(e) => updateConfig({ overlaySmoothing: e.target.checked })}
                      className="w-4 h-4 accent-earth-aqua cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 07. WHAT-IF SIMULATION ENGINE */}
            {activeTab === 'sim' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-white/10">
                  <h2 className="text-base font-bold text-white font-mono uppercase">07. Simulation & Biophysical Coupling (141–150)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Coupling feedback loop strength and mathematical model timestep.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5 p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-semibold">Biophysical Coupling Multiplier:</span>
                      <span className="text-earth-aqua font-bold">{config.simulationCouplingStrength.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      value={config.simulationCouplingStrength}
                      onChange={(e) => updateConfig({ simulationCouplingStrength: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua"
                    />
                  </div>

                  <div className="p-3 rounded-xl glass-panel-1 border border-white/5 space-y-1.5">
                    <label className="text-xs font-bold text-white font-mono block">Simulation Calculation Timestep</label>
                    <select
                      value={config.simulationTimestep}
                      onChange={(e) => updateConfig({ simulationTimestep: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white font-mono"
                    >
                      <option value="annual">Annual Rollup (Decadal Trends)</option>
                      <option value="quarterly">Quarterly Seasonal Simulation</option>
                      <option value="monthly">Monthly High-Resolution Timestep</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 08. AI & RESEARCH */}
            {activeTab === 'ai' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-white/10">
                  <h2 className="text-base font-bold text-white font-mono uppercase">08. AI Reasoning & Explanation Depth (171–190)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Adapt EarthMind AI answers for judges, researchers, or students.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-3 rounded-xl glass-panel-1 border border-white/5 space-y-1.5">
                    <label className="text-xs font-bold text-white font-mono block">AI Explanation Audience Level</label>
                    <select
                      value={config.aiExplanationDetail}
                      onChange={(e) => updateConfig({ aiExplanationDetail: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white font-mono"
                    >
                      <option value="judge">Science Exhibition Judge Panel (Defensive & Evidentiary)</option>
                      <option value="scientific">Academic / Research Grade (Equations & Citations)</option>
                      <option value="student">Student / High School (Intuitive Analogies)</option>
                      <option value="executive">Policy Executive (Action-Oriented Summary)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Explicit Scientific Citations</div>
                      <div className="text-[10px] text-slate-400">Cite Sentinel-2, Landsat-9, MODIS in AI chat answers</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.aiScientificCitations}
                      onChange={(e) => updateConfig({ aiScientificCitations: e.target.checked })}
                      className="w-4 h-4 accent-earth-aqua cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 09. DATA & UNCERTAINTY */}
            {activeTab === 'data' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-white/10">
                  <h2 className="text-base font-bold text-white font-mono uppercase">09. Data Provenance & Uncertainty (211–220 & 291–300)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Enforce scientific integrity badges and confidence envelopes.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Mandatory Data Provenance Badges</div>
                      <div className="text-[10px] text-slate-400">Render [OBSERVED], [MODELLED], [SIMULATED] tags across UI</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.showDataProvenanceBadges}
                      onChange={(e) => updateConfig({ showDataProvenanceBadges: e.target.checked })}
                      className="w-4 h-4 accent-earth-aqua cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Shaded Uncertainty Envelopes</div>
                      <div className="text-[10px] text-slate-400">Display 95% confidence intervals on timeline and projections</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.showUncertaintyBands}
                      onChange={(e) => updateConfig({ showUncertaintyBands: e.target.checked })}
                      className="w-4 h-4 accent-earth-aqua cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 10. SYSTEM & EXPO */}
            {activeTab === 'system' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-white/10">
                  <h2 className="text-base font-bold text-white font-mono uppercase">10. System, Accessibility & Exhibition (441–500)</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Exhibition presentation cadence and hardware acceleration.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5 p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-semibold">Exhibition Auto-Advance Slide Duration:</span>
                      <span className="text-earth-aqua font-bold">{config.exhibitionAutoAdvanceSec}s</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={5}
                      value={config.exhibitionAutoAdvanceSec}
                      onChange={(e) => updateConfig({ exhibitionAutoAdvanceSec: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div>
                      <div className="text-xs font-bold text-white font-mono">Reduced Motion Mode</div>
                      <div className="text-[10px] text-slate-400">Dampen ambient floating card animations for accessibility</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.reducedMotion}
                      onChange={(e) => updateConfig({ reducedMotion: e.target.checked })}
                      className="w-4 h-4 accent-earth-aqua cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 11. VOICE & SPEECH INTELLIGENCE */}
            {activeTab === 'voice' && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white font-mono uppercase">11. Voice Intelligence & Audio Interface</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Control speech recognition language, audio synthesis speed, and privacy controls.</p>
                  </div>
                  <GlassButton variant="aurora" size="sm" onClick={toggleTestConsole} leftIcon={<Terminal className="w-3.5 h-3.5" />}>
                    Open Test Console
                  </GlassButton>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl glass-panel-1 border border-white/5 space-y-1">
                      <label className="text-xs font-mono text-white font-bold block">Spoken Language</label>
                      <select
                        value={voiceSettings.language}
                        onChange={(e) => updateVoiceSettings({ language: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-earth-aqua"
                      >
                        <option value="en-US">English (US / Global)</option>
                        <option value="en-IN">English (India)</option>
                        <option value="ta-IN">Tamil (தமிழ் / Thanglish)</option>
                        <option value="hi-IN">Hindi (हिंदी)</option>
                      </select>
                    </div>

                    <div className="p-3.5 rounded-xl glass-panel-1 border border-white/5 space-y-1">
                      <label className="text-xs font-mono text-white font-bold block">Interaction Mode</label>
                      <select
                        value={voiceSettings.mode}
                        onChange={(e) => updateVoiceSettings({ mode: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-earth-aqua"
                      >
                        <option value="click_to_talk">Click-to-Talk (Default)</option>
                        <option value="push_to_talk">Push-to-Talk (Hold Space)</option>
                        <option value="continuous">Continuous Ambient Mode</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl glass-panel-1 border border-white/5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-white font-semibold">Speech Rate (TTS):</span>
                      <span className="text-earth-aqua font-bold">{voiceSettings.speechRate}x</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={2.0}
                      step={0.25}
                      value={voiceSettings.speechRate}
                      onChange={(e) => updateVoiceSettings({ speechRate: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
                      <div>
                        <div className="text-xs font-bold text-white font-mono">Auto-Speak Responses</div>
                        <div className="text-[10px] text-slate-400">Play spoken scientific feedback after recognition</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={voiceSettings.autoSpeakResponse}
                        onChange={(e) => updateVoiceSettings({ autoSpeakResponse: e.target.checked })}
                        className="w-4 h-4 accent-earth-aqua cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
                      <div>
                        <div className="text-xs font-bold text-white font-mono">Subtitles & Captions</div>
                        <div className="text-[10px] text-slate-400">Display synchronized transcript banner</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={voiceSettings.captionsEnabled}
                        onChange={(e) => updateVoiceSettings({ captionsEnabled: e.target.checked })}
                        className="w-4 h-4 accent-earth-aqua cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}


            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Active Category: <strong className="text-white uppercase">{activeTab}</strong> • Live Reactivity Enabled
              </span>
              <GlassButton variant="primary" size="sm" onClick={triggerSaveNotification}>
                Apply & Save Settings
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
