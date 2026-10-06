import React, { useState } from 'react';
import { 
  Satellite, 
  Sliders, 
  Sparkles, 
  Eye, 
  Layers, 
  ShieldCheck, 
  Calendar, 
  CloudRain, 
  MapPin, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { EnvironmentalHotspot, SatelliteBandMode } from '../../types';

interface SatelliteScannerViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToSimulator: () => void;
}

export const SatelliteScannerView: React.FC<SatelliteScannerViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToSimulator,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // % from left (0 to 100)
  const [bandMode, setBandMode] = useState<SatelliteBandMode>('true_color');
  const [cloudMaskEnabled, setCloudMaskEnabled] = useState(true);
  const [showScannerClusters, setShowScannerClusters] = useState(true);

  const forensics = selectedHotspot.forensics;
  const changes = forensics.detectedChanges;

  // Band filter appearance settings
  const getBandStyle = (is2018: boolean) => {
    switch (bandMode) {
      case 'false_color_ir':
        return is2018 
          ? 'hue-rotate-[290deg] saturate-200 contrast-125' 
          : 'hue-rotate-[290deg] saturate-150 contrast-125 brightness-95';
      case 'ndwi':
        return is2018
          ? 'hue-rotate-[180deg] saturate-200 contrast-150'
          : 'hue-rotate-[180deg] saturate-125 contrast-150';
      case 'ndbi':
        return is2018
          ? 'hue-rotate-[45deg] saturate-150 contrast-150'
          : 'hue-rotate-[45deg] saturate-200 contrast-150';
      case 'thermal':
        return is2018
          ? 'sepia hue-rotate-[320deg] saturate-200'
          : 'sepia hue-rotate-[300deg] saturate-250';
      default:
        return is2018 ? 'brightness-105 contrast-105' : 'brightness-95 contrast-110';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Satellite className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              FEATURE 24 & 25 • SATELLITE CHANGE SCANNER & SWIPE COMPARISON
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Satellite Intelligence & Change Scanner</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Interactive before/after orbital curtain comparison. Drag the swipe slider to reveal pixel-level radiometric land-use transformation between 2018 and 2026.
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

      {/* Control Bar: Spectral Bands & Mask Toggles */}
      <GlassCard variant="medium" className="p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 uppercase">Spectral Band:</span>
          <div className="flex items-center gap-1 glass-panel-1 p-1 rounded-xl text-xs font-mono">
            {[
              { id: 'true_color', label: 'True Color (RGB)' },
              { id: 'false_color_ir', label: 'False Color IR (NDVI)' },
              { id: 'ndwi', label: 'Water Index (NDWI)' },
              { id: 'ndbi', label: 'Built-up (NDBI)' },
              { id: 'thermal', label: 'Thermal IR (TIRS)' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setBandMode(b.id as SatelliteBandMode)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  bandMode === b.id
                    ? 'bg-earth-aqua text-[#071A2B] font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={cloudMaskEnabled}
              onChange={(e) => setCloudMaskEnabled(e.target.checked)}
              className="rounded border-earth-aqua text-earth-aqua focus:ring-0"
            />
            <span>QA Cloud Masking (Level-2A)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showScannerClusters}
              onChange={(e) => setShowScannerClusters(e.target.checked)}
              className="rounded border-amber-400 text-amber-400 focus:ring-0"
            />
            <span>Anomaly Clusters Highlight</span>
          </label>
        </div>
      </GlassCard>

      {/* Interactive Curtain Swipe Viewport */}
      <GlassCard variant="strong" className="p-0 border border-white/15 overflow-hidden relative">
        {/* Top Badges */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2">
          <GlassBadge tone="aqua" size="sm">
            2018 HISTORICAL BASELINE
          </GlassBadge>
          <span className="text-xs font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
            Sentinel-2 L2A (10m)
          </span>
        </div>

        <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
            Landsat-9 + Sentinel-2
          </span>
          <GlassBadge tone="sun" size="sm">
            2026 CURRENT OBSERVATION
          </GlassBadge>
        </div>

        {/* The Dual Layer Swipe Stage */}
        <div className="relative h-[440px] w-full select-none overflow-hidden bg-[#071524]">
          {/* Layer 1: 2026 Current Image (Bottom Full) */}
          <div className={`absolute inset-0 transition-all ${getBandStyle(false)}`}>
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `radial-gradient(circle at center, rgba(14,40,65,0.7) 0%, rgba(7,26,43,0.95) 100%), repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 20px)`,
                backgroundColor: '#0c2238'
              }}
            >
              {/* Stylized orbital map landscape features */}
              <div className="w-full h-full relative flex items-center justify-center">
                <div className="w-96 h-64 rounded-full bg-earth-ocean/40 blur-2xl" />
                <div className="w-64 h-48 rounded-full bg-emerald-900/30 blur-xl" />
              </div>
            </div>

            {/* Change Scanner Anomaly Box if enabled */}
            {showScannerClusters && (
              <div className="absolute top-1/3 right-1/4 z-10 p-3 rounded-xl bg-amber-500/20 border border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.3)] backdrop-blur-sm animate-pulse">
                <div className="text-[10px] font-mono text-amber-300 font-bold uppercase flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Cluster #01: High Radiometric Delta
                </div>
                <div className="text-xs font-bold text-white mt-0.5">
                  Canopy Delta: {changes.vegetationChange}% • Temp: +{changes.surfaceTempDelta}°C
                </div>
              </div>
            )}
          </div>

          {/* Layer 2: 2018 Baseline Image (Clipped by slider position) */}
          <div 
            className={`absolute inset-0 overflow-hidden border-r-2 border-white transition-all shadow-[0_0_25px_rgba(255,255,255,0.3)] ${getBandStyle(true)}`}
            style={{ width: `${sliderPos}%` }}
          >
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `radial-gradient(circle at center, rgba(20,55,85,0.7) 0%, rgba(7,26,43,0.95) 100%), repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 20px)`,
                backgroundColor: '#0f2c49',
                width: '100vw'
              }}
            >
              <div className="w-full h-full relative flex items-center justify-center">
                <div className="w-96 h-64 rounded-full bg-emerald-600/30 blur-2xl" />
                <div className="w-64 h-48 rounded-full bg-cyan-600/30 blur-xl" />
              </div>
            </div>
          </div>

          {/* Interactive Draggable Handle */}
          <div 
            className="absolute top-0 bottom-0 z-30 flex items-center justify-center pointer-events-none -ml-4"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-white text-[#071A2B] shadow-2xl border-2 border-earth-aqua flex items-center justify-center cursor-ew-resize">
              <Sliders className="w-4 h-4" />
            </div>
          </div>

          {/* Invisible Range Input for Full-Width Dragging */}
          <input
            type="range"
            min={0}
            max={100}
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
          />

          {/* Bottom Swipe Position Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300">
            DRAG CURTAIN: {sliderPos}% (2018 ↔ 2026)
          </div>
        </div>
      </GlassCard>

      {/* Quantitative Change Detection Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="medium" className="p-4 border border-white/10">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Canopy Cover Change</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-400">{changes.vegetationChange}%</span>
            <span className="text-xs font-bold text-rose-400 flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> Net Loss
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">Normalized NDVI Delta</div>
        </GlassCard>

        <GlassCard variant="medium" className="p-4 border border-white/10">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Impervious Surface (NDBI)</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-400">+{changes.builtUpExpansion}%</span>
            <span className="text-xs font-bold text-amber-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> Concrete Sprawl
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">Paved land cover expansion</div>
        </GlassCard>

        <GlassCard variant="medium" className="p-4 border border-white/10">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Surface Radiance (TIRS)</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-white">+{changes.surfaceTempDelta}°C</span>
            <span className="text-xs font-bold text-rose-400 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> Thermal Peak
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">Diurnal sensible heat</div>
        </GlassCard>

        <GlassCard variant="medium" className="p-4 border border-white/10">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Open Water Extent (NDWI)</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-cyan-400">{changes.waterSurfaceDelta}%</span>
            <span className="text-xs font-bold text-cyan-400 flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> Surface Area
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">Satellite lake/wetland perimeter</div>
        </GlassCard>
      </div>
    </div>
  );
};
