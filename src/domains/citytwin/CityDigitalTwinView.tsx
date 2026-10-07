import React, { useState } from 'react';
import { 
  Building2, 
  Trees, 
  Flame, 
  Droplets, 
  Sun, 
  Layers, 
  Sliders, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  MapPin,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { EnvironmentalHotspot } from '../../types';

interface CityDigitalTwinViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToSimulator: () => void;
}

export const CityDigitalTwinView: React.FC<CityDigitalTwinViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToSimulator,
}) => {
  // Interactive Urban Interventions
  const [hasGreenCorridors, setHasGreenCorridors] = useState(false);
  const [hasCoolRoofs, setHasCoolRoofs] = useState(false);
  const [hasPermeablePavements, setHasPermeablePavements] = useState(false);
  const [hasUrbanTrees, setHasUrbanTrees] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'thermal' | 'stormwater'>('thermal');

  // Dynamic Microclimate Calculations based on active interventions
  const baselineUhi = 4.6; // °C over rural baseline
  const uhiReduction = 
    (hasGreenCorridors ? 1.6 : 0) +
    (hasCoolRoofs ? 1.2 : 0) +
    (hasUrbanTrees ? 0.8 : 0);
  const currentUhi = Math.max(1.0, Math.round((baselineUhi - uhiReduction) * 10) / 10);

  const baselineInfiltration = 14; // % rainfall percolated
  const infiltrationIncrease =
    (hasPermeablePavements ? 32 : 0) +
    (hasGreenCorridors ? 18 : 0);
  const currentInfiltration = Math.min(85, baselineInfiltration + infiltrationIncrease);

  const energySavingsPct = Math.round(
    (hasCoolRoofs ? 18 : 0) +
    (hasGreenCorridors ? 12 : 0) +
    (hasUrbanTrees ? 6 : 0)
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              FEATURE 73 • 3D URBAN MICROCLIMATE DIGITAL TWIN
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">3D City Digital Twin</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Simulate street canyon radiation, building heat ejection, and urban hydrology. Toggle physical interventions and watch microclimate metrics transform in real-time.
          </p>
        </div>

        {/* Hotspot Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => onSelectHotspot(spot)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                selectedHotspot.id === spot.id
                  ? 'bg-earth-aqua text-[#071A2B] border-earth-aqua font-bold shadow-md shadow-earth-aqua/20'
                  : 'glass-panel-1 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3 inline mr-1" />
              {spot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Twin Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 3D/Isometric Procedural City Viewport */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard variant="strong" className="p-0 border border-white/15 overflow-hidden relative">
            {/* Viewport Top Bar */}
            <div className="p-3 bg-[#071A2B]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-20 relative">
              <div className="flex items-center gap-2">
                <GlassBadge tone="aqua" size="sm">CANOPY RESOLUTION: 1.0M</GlassBadge>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  {selectedHotspot.name.toUpperCase()} DOWNTOWN CORE
                </span>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 glass-panel-1 p-1 rounded-xl text-xs font-mono">
                <button
                  onClick={() => setViewMode('thermal')}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                    viewMode === 'thermal' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3 h-3" /> Thermal Radiance
                </button>
                <button
                  onClick={() => setViewMode('stormwater')}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                    viewMode === 'stormwater' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Droplets className="w-3 h-3" /> Hydro Infiltration
                </button>
                <button
                  onClick={() => setViewMode('visual')}
                  className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                    viewMode === 'visual' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3 h-3" /> Natural RGB
                </button>
              </div>
            </div>

            {/* Stylized Procedural City Canvas Simulation */}
            <div className="h-96 w-full bg-[#081827] relative flex items-center justify-center overflow-hidden p-6 select-none">
              {/* Isometric City Grid Floor */}
              <div className="w-full max-w-lg aspect-video rounded-2xl bg-gradient-to-b from-[#0a233b] to-[#061423] border border-white/10 shadow-2xl relative p-6 transform -rotate-1 skew-x-1 transition-all duration-700">
                {/* Central Roadway */}
                <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-16 transition-colors duration-500 border-x border-white/10 ${
                  hasPermeablePavements
                    ? 'bg-emerald-950/40 border-emerald-500/40'
                    : viewMode === 'thermal'
                    ? 'bg-amber-600/50'
                    : 'bg-slate-800'
                }`}>
                  <div className="w-0.5 h-full border-r border-dashed border-white/30 mx-auto" />
                  {/* Green Corridor Foliage overlay if toggled */}
                  {hasGreenCorridors && (
                    <div className="absolute inset-0 bg-emerald-500/30 flex flex-col justify-around items-center animate-in fade-in">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.8)] flex items-center justify-center">
                          <Trees className="w-4 h-4 text-emerald-950" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Left City Block Buildings */}
                <div className="absolute top-6 bottom-6 left-6 w-32 flex flex-col justify-between">
                  <div className={`h-24 rounded-xl border p-2 shadow-lg transition-all ${
                    hasCoolRoofs
                      ? 'bg-slate-100/90 border-cyan-400 text-slate-900'
                      : viewMode === 'thermal'
                      ? 'bg-red-500/70 border-red-400 text-white'
                      : 'bg-slate-700/80 border-white/20 text-white'
                  }`}>
                    <div className="text-[10px] font-mono font-bold uppercase">Tower A (32F)</div>
                    <div className="text-[11px] font-bold mt-1">
                      {hasCoolRoofs ? '28°C Cool Roof' : '58°C Tar Roof'}
                    </div>
                  </div>

                  <div className={`h-16 rounded-xl border p-2 shadow-lg transition-all ${
                    hasCoolRoofs
                      ? 'bg-slate-100/90 border-cyan-400 text-slate-900'
                      : viewMode === 'thermal'
                      ? 'bg-orange-500/70 border-orange-400 text-white'
                      : 'bg-slate-700/80 border-white/20 text-white'
                  }`}>
                    <div className="text-[10px] font-mono font-bold uppercase">Plaza B (14F)</div>
                    <div className="text-[11px] font-bold mt-0.5">
                      {hasCoolRoofs ? '26°C Albedo' : '52°C Surface'}
                    </div>
                  </div>
                </div>

                {/* Right City Block Buildings */}
                <div className="absolute top-6 bottom-6 right-6 w-32 flex flex-col justify-between">
                  <div className={`h-16 rounded-xl border p-2 shadow-lg transition-all ${
                    hasCoolRoofs
                      ? 'bg-slate-100/90 border-cyan-400 text-slate-900'
                      : viewMode === 'thermal'
                      ? 'bg-rose-600/70 border-rose-400 text-white'
                      : 'bg-slate-700/80 border-white/20 text-white'
                  }`}>
                    <div className="text-[10px] font-mono font-bold uppercase">Commercial C</div>
                    <div className="text-[11px] font-bold mt-0.5">
                      {hasCoolRoofs ? '27°C Cool Roof' : '56°C Peak'}
                    </div>
                  </div>

                  <div className={`h-24 rounded-xl border p-2 shadow-lg transition-all ${
                    hasCoolRoofs
                      ? 'bg-slate-100/90 border-cyan-400 text-slate-900'
                      : viewMode === 'thermal'
                      ? 'bg-red-500/70 border-red-400 text-white'
                      : 'bg-slate-700/80 border-white/20 text-white'
                  }`}>
                    <div className="text-[10px] font-mono font-bold uppercase">Tower D (28F)</div>
                    <div className="text-[11px] font-bold mt-1">
                      {hasCoolRoofs ? '29°C Shield' : '59°C Radiance'}
                    </div>
                  </div>
                </div>

                {/* Trees overlay in sidewalk buffers */}
                {hasUrbanTrees && (
                  <div className="absolute inset-0 pointer-events-none flex justify-between px-24 py-8">
                    <div className="flex flex-col justify-around">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      ))}
                    </div>
                    <div className="flex flex-col justify-around">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Thermal / Infiltration Legend Pill */}
              <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[11px] text-slate-300 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase">Live Sensor Overlay</div>
                {viewMode === 'thermal' && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded bg-gradient-to-r from-blue-500 via-amber-400 to-red-600" />
                    <span>24°C → 59°C Radiative Temp</span>
                  </div>
                )}
                {viewMode === 'stormwater' && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded bg-gradient-to-r from-slate-700 to-cyan-400" />
                    <span>Infiltration: {currentInfiltration}% of rainfall</span>
                  </div>
                )}
                {viewMode === 'visual' && <div>True Color 4K Reflectance</div>}
              </div>
            </div>
          </GlassCard>

          {/* Real-Time Live Microclimate Impact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <GlassCard variant="medium" className="p-3.5 border border-white/10">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Urban Heat Island Peak</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-2xl font-black ${currentUhi <= 2.5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  +{currentUhi}°C
                </span>
                {uhiReduction > 0 && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                    -{uhiReduction.toFixed(1)}°C
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Baseline: +{baselineUhi}°C</div>
            </GlassCard>

            <GlassCard variant="medium" className="p-3.5 border border-white/10">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Stormwater Percolation</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-cyan-400">{currentInfiltration}%</span>
                {infiltrationIncrease > 0 && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                    +{infiltrationIncrease}%
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Runoff Buffer: {currentInfiltration > 40 ? 'EXCELLENT' : 'LOW'}</div>
            </GlassCard>

            <GlassCard variant="medium" className="p-3.5 border border-white/10">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Building Cooling Demand</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">-{energySavingsPct}%</span>
                <span className="text-xs font-bold text-emerald-400">Savings</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Grid Peak Load Shaved</div>
            </GlassCard>
          </div>
        </div>

        {/* Right Col: Interactive Judge Intervention Controls */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-earth-aqua" />
            Interactive Urban Interventions
          </h3>

          <div className="space-y-3">
            {/* 1. Green Corridors */}
            <GlassCard
              variant="medium"
              onClick={() => setHasGreenCorridors(!hasGreenCorridors)}
              className={`p-4 border cursor-pointer transition-all ${
                hasGreenCorridors
                  ? 'border-emerald-400/50 bg-emerald-500/10 shadow-md ring-1 ring-emerald-400'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-400/20 text-emerald-400">
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Add Green Corridors</div>
                    <div className="text-[11px] text-slate-400 font-mono">-1.6°C UHI • +18% Water Retention</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasGreenCorridors}
                  onChange={() => {}}
                  className="rounded border-emerald-400 text-emerald-400 focus:ring-0"
                />
              </div>
            </GlassCard>

            {/* 2. Cool Roofs */}
            <GlassCard
              variant="medium"
              onClick={() => setHasCoolRoofs(!hasCoolRoofs)}
              className={`p-4 border cursor-pointer transition-all ${
                hasCoolRoofs
                  ? 'border-cyan-400/50 bg-cyan-500/10 shadow-md ring-1 ring-cyan-400'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-400/20 text-cyan-400">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Install Cool Roofs (Albedo 0.7)</div>
                    <div className="text-[11px] text-slate-400 font-mono">-1.2°C UHI • -18% Cooling Energy</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasCoolRoofs}
                  onChange={() => {}}
                  className="rounded border-cyan-400 text-cyan-400 focus:ring-0"
                />
              </div>
            </GlassCard>

            {/* 3. Permeable Pavements */}
            <GlassCard
              variant="medium"
              onClick={() => setHasPermeablePavements(!hasPermeablePavements)}
              className={`p-4 border cursor-pointer transition-all ${
                hasPermeablePavements
                  ? 'border-earth-aqua/50 bg-earth-aqua/10 shadow-md ring-1 ring-earth-aqua'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-earth-aqua/20 text-earth-aqua">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Permeable Pavement Retrofit</div>
                    <div className="text-[11px] text-slate-400 font-mono">+32% Infiltration • Prevents Runoff</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasPermeablePavements}
                  onChange={() => {}}
                  className="rounded border-earth-aqua text-earth-aqua focus:ring-0"
                />
              </div>
            </GlassCard>

            {/* 4. Urban Tree Grid */}
            <GlassCard
              variant="medium"
              onClick={() => setHasUrbanTrees(!hasUrbanTrees)}
              className={`p-4 border cursor-pointer transition-all ${
                hasUrbanTrees
                  ? 'border-emerald-400/50 bg-emerald-500/10 shadow-md ring-1 ring-emerald-400'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-400/20 text-emerald-400">
                    <Trees className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Sidewalk Tree Canopy Grid</div>
                    <div className="text-[11px] text-slate-400 font-mono">-0.8°C UHI • Pedestrian Shade</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={hasUrbanTrees}
                  onChange={() => {}}
                  className="rounded border-emerald-400 text-emerald-400 focus:ring-0"
                />
              </div>
            </GlassCard>
          </div>

          <div className="pt-2">
            <button
              onClick={onNavigateToSimulator}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-earth-aqua to-earth-emerald text-[#071A2B] font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 shadow-md transition-all"
            >
              <Sliders className="w-4 h-4" />
              <span>Export Urban Parameters to Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
