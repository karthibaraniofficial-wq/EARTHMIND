import React, { useState } from 'react';
import { 
  Droplets, 
  Waves, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Gauge, 
  Activity, 
  MapPin, 
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { EnvironmentalHotspot, DataProvenance } from '../../types';

interface WaterIntelligenceViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToSimulator: () => void;
  onNavigateToExplorer: () => void;
}

export const WaterIntelligenceView: React.FC<WaterIntelligenceViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToSimulator,
  onNavigateToExplorer,
}) => {
  const [selectedSubsystem, setSelectedSubsystem] = useState<'lakes' | 'rivers' | 'reservoirs' | 'watersheds'>('lakes');

  const waterMetrics = [
    { label: 'Basin Hydrological Stress', value: `${selectedHotspot.currentMetrics.waterStress}/100`, tone: selectedHotspot.currentMetrics.waterStress > 70 ? 'coral' : 'aqua', note: 'Withdrawal vs Recharge' },
    { label: 'Surface Water Index (NDWI)', value: `${selectedHotspot.history[selectedHotspot.history.length - 1].waterIndex} pts`, tone: 'leaf', note: 'Satellite optical & radar' },
    { label: 'Flood Runoff Surge Risk', value: `${selectedHotspot.currentMetrics.floodRisk}%`, tone: selectedHotspot.currentMetrics.floodRisk > 60 ? 'coral' : 'sun', note: 'Extreme storm exposure' },
    { label: 'Aquifer Depletion Velocity', value: '-2.4 cm/yr', tone: 'coral', note: 'GRACE-FO gravimetry estimate' },
  ];

  const monitoredBodies = [
    {
      name: 'Lake Chad Basin (Sahel)',
      country: 'Chad / Nigeria / Cameroon / Niger',
      type: 'Endorheic Lake',
      baselineAreaKm2: '26,000 km² (1963)',
      currentAreaKm2: '1,500 km² (2026)',
      surfaceLossPct: '-94.2%',
      waterHealthScore: 28,
      status: 'CRITICAL_DEPLETION',
      provenance: 'OBSERVED' as DataProvenance,
      sensor: 'Landsat-9 / Sentinel-2 MSI',
    },
    {
      name: 'Rhine-Meuse Estuary & Delta',
      country: 'Netherlands / Germany',
      type: 'Tidal Delta & River Network',
      baselineAreaKm2: '3,800 km²',
      currentAreaKm2: '3,650 km²',
      surfaceLossPct: '-3.9%',
      waterHealthScore: 82,
      status: 'MANAGED_RESILIENCE',
      provenance: 'OBSERVED' as DataProvenance,
      sensor: 'Sentinel-1 SAR C-band',
    },
    {
      name: 'Indo-Gangetic Groundwater Aquifer',
      country: 'Northern India / Pakistan',
      type: 'Alluvial Deep Aquifer',
      baselineAreaKm2: 'Over 2.2M km²',
      currentAreaKm2: 'Subsurface Piezometric Head Loss',
      surfaceLossPct: '-31.8%',
      waterHealthScore: 46,
      status: 'HIGH_STRESS',
      provenance: 'MODELLED' as DataProvenance,
      sensor: 'GRACE-FO Gravimetry + Central Ground Water Board',
    },
    {
      name: 'Central Valley Agricultural Aquifer',
      country: 'California, USA',
      type: 'Confined Aquifer & Canal Grid',
      baselineAreaKm2: 'San Joaquin & Sacramento Basins',
      currentAreaKm2: 'Subsidence-compromised storage',
      surfaceLossPct: '-22.5%',
      waterHealthScore: 54,
      status: 'VULNERABLE',
      provenance: 'OBSERVED' as DataProvenance,
      sensor: 'InSAR Sentinel-1 Land Subsidence',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Header & Hotspot Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              MODULE 05 — HYDROLOGICAL INTELLIGENCE OS
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Water & Basin Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time optical and synthetic aperture radar (SAR) monitoring of inland lakes, reservoir depletion, river discharge anomalies, and watershed vulnerability scores.
          </p>
        </div>

        {/* Hotspot Dropdown Chips */}
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

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {waterMetrics.map((metric, i) => (
          <GlassCard key={i} variant="medium" className="p-5 border border-white/10">
            <span className="text-xs font-mono text-slate-400 block">{metric.label}</span>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">{metric.value}</div>
            <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>{metric.note}</span>
              <GlassBadge tone={metric.tone as any} size="sm">[OBSERVED]</GlassBadge>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Monitored Global Water Bodies Table */}
      <GlassCard variant="strong" glow="aqua" className="p-6 border border-white/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <Waves className="w-5 h-5 text-earth-aqua" />
              <span>Sentinel-1/2 High-Precision Water Body Tracking</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous multi-temporal shoreline contour extraction and surface area shrinkage metrics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <GlassButton variant="primary" size="sm" onClick={onNavigateToSimulator}>
              Simulate Water Retention Levers
            </GlassButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {monitoredBodies.map((body, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl glass-panel-1 border border-white/10 space-y-3 hover:border-earth-aqua/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{body.name}</h3>
                  <div className="text-[11px] font-mono text-slate-400">{body.country} • {body.type}</div>
                </div>
                <GlassBadge 
                  tone={body.status === 'CRITICAL_DEPLETION' ? 'coral' : body.status === 'HIGH_STRESS' ? 'sun' : 'leaf'} 
                  size="sm"
                >
                  {body.status.replace('_', ' ')}
                </GlassBadge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div>
                  <span className="text-[10px] text-slate-400 block">Baseline Surface</span>
                  <span className="text-white font-semibold">{body.baselineAreaKm2}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Observed Area</span>
                  <span className="text-white font-semibold">{body.currentAreaKm2}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Surface Delta:</span>
                  <span className={`font-bold ${body.surfaceLossPct.startsWith('-') ? 'text-earth-coral' : 'text-earth-emerald'}`}>
                    {body.surfaceLossPct}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Score:</span>
                  <span className="text-sm font-bold text-earth-aqua">{body.waterHealthScore}/100</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-white/5 flex items-center justify-between">
                <span>Sensor: {body.sensor}</span>
                <span className="text-earth-leaf">[{body.provenance}]</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Watershed Vulnerability & Intervention Strategy Callout */}
      <div className="p-6 rounded-3xl glass-panel-2 border border-earth-aqua/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-earth-aqua uppercase tracking-wider font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Biophysical Coupling Recommendation</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed max-w-3xl">
            In the <strong className="text-white">{selectedHotspot.name}</strong>, increasing localized stormwater retention capacity by <strong className="text-earth-aqua">+20%</strong> combined with a <strong className="text-earth-leaf">+15% native riparian canopy buffer</strong> reduces modeled downstream flash flood runoff peak volumes by <strong className="text-earth-emerald">34.8%</strong> while recharging local groundwater tables.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <GlassButton variant="primary" size="md" onClick={onNavigateToSimulator}>
            Test in WHAT-IF Lab →
          </GlassButton>
        </div>
      </div>
    </div>
  );
};
