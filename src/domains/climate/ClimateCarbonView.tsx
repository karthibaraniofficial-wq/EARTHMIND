import React, { useState } from 'react';
import { 
  Flame, 
  Wind, 
  Sun, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Leaf, 
  Factory, 
  Gauge, 
  MapPin, 
  ShieldAlert,
  ArrowRight,
  Zap
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { EnvironmentalHotspot, DataProvenance } from '../../types';

interface ClimateCarbonViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToSimulator: () => void;
}

export const ClimateCarbonView: React.FC<ClimateCarbonViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToSimulator,
}) => {
  const [carbonTargetPpm, setCarbonTargetPpm] = useState<number>(420);

  const climateMetrics = [
    { label: 'Surface Thermal Anomaly', value: `+${selectedHotspot.currentMetrics.surfaceTempAnomaly}°C`, delta: '+1.8°C vs 2010', tone: 'coral', provenance: 'OBSERVED' as DataProvenance },
    { label: 'Estimated Carbon Intensity', value: '442 ppm', delta: '+28 ppm decadal surge', tone: 'coral', provenance: 'MODELLED' as DataProvenance },
    { label: 'Microclimate Volatility Index', value: '74 / 100', delta: 'High variance', tone: 'sun', provenance: 'SIMULATED' as DataProvenance },
    { label: 'Carbon Sequestration Deficit', value: '-3.2 Mt CO₂e/yr', delta: 'Deforestation loss', tone: 'coral', provenance: 'ESTIMATED' as DataProvenance },
  ];

  const carbonHotspots = [
    { region: 'Amazon Deforestation Perimeter', country: 'Brazil / Peru', source: 'LULUCF Biomass Burning', emissionsMt: '184.2 Mt CO₂e', status: 'CRITICAL' },
    { region: 'Indo-Gangetic Thermal Corridor', country: 'India', source: 'Coal Power & Agricultural Stubble', emissionsMt: '312.8 Mt CO₂e', status: 'VERY_HIGH' },
    { region: 'Greater Tokyo Urban Core', country: 'Japan', source: 'Transportation & Commercial Power', emissionsMt: '64.5 Mt CO₂e', status: 'MODERATE' },
    { region: 'California Central Valley Agri-Zone', country: 'USA', source: 'Enteric Methane & Pumping Grids', emissionsMt: '42.1 Mt CO₂e', status: 'MODERATE' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-earth-coral" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-coral">
              MODULES 04 & 35 — CLIMATE DYNAMICS & CARBON INTELLIGENCE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Climate Dynamics & Carbon Budget</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Synthesized thermal radiance anomalies, greenhouse gas atmospheric concentration (NOAA/OCO-2), and regional carbon sequestration sinks.
          </p>
        </div>

        {/* Hotspots Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => onSelectHotspot(spot)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                selectedHotspot.id === spot.id
                  ? 'bg-earth-coral text-white border-earth-coral font-bold shadow-md shadow-earth-coral/20'
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
        {climateMetrics.map((item, idx) => (
          <GlassCard key={idx} variant="medium" className="p-5 border border-white/10">
            <span className="text-xs font-mono text-slate-400 block">{item.label}</span>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">{item.value}</div>
            <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>{item.delta}</span>
              <GlassBadge tone={item.tone as any} size="sm">[{item.provenance}]</GlassBadge>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Carbon Hotspots & Mitigation Strategies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <GlassCard variant="strong" glow="coral" className="p-6 border border-white/20 space-y-4 h-full">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-earth-coral" />
                <h2 className="text-base font-bold text-white font-mono uppercase">Monitored Emissions Corridors</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">OCO-2 / Sentinel-5P</span>
            </div>

            <div className="space-y-3 pt-1">
              {carbonHotspots.map((ch, idx) => (
                <div key={idx} className="p-4 rounded-xl glass-panel-1 border border-white/5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-white">{ch.region}</div>
                    <div className="text-[11px] font-mono text-slate-400">{ch.country} • {ch.source}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold font-mono text-earth-coral">{ch.emissionsMt}</div>
                    <GlassBadge tone={ch.status === 'CRITICAL' ? 'coral' : 'sun'} size="sm">
                      {ch.status}
                    </GlassBadge>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Carbon Abatement Levers Simulator Callout */}
        <div className="lg:col-span-5">
          <GlassCard variant="strong" glow="emerald" className="p-6 border border-white/20 space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <Leaf className="w-5 h-5 text-earth-leaf" />
                <h2 className="text-base font-bold text-white font-mono uppercase">Biological Sequestration Levers</h2>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mt-4">
                A localized agroforestry restoration initiative across 15,000 hectares in <strong className="text-white">{selectedHotspot.name}</strong> will sequester approximately <strong className="text-earth-leaf">1.4 Mt CO₂e/yr</strong> while lowering localized Land Surface Temperature by <strong className="text-earth-emerald">0.8°C</strong> through increased canopy transpiration.
              </p>

              <div className="mt-5 p-3.5 rounded-xl bg-earth-emerald/10 border border-earth-emerald/30 text-xs font-mono text-slate-300 space-y-1.5">
                <div className="flex justify-between">
                  <span>Carbon Abatement Cost:</span>
                  <span className="text-white font-bold">$22 / ton CO₂e</span>
                </div>
                <div className="flex justify-between">
                  <span>Albedo Cooling Feedback:</span>
                  <span className="text-earth-emerald font-bold">+14% Albedo Reflection</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidence Margin:</span>
                  <span className="text-slate-400 font-bold">± 12% [MODELLED]</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <GlassButton variant="emerald" size="md" className="w-full justify-center" onClick={onNavigateToSimulator}>
                Launch Carbon Mitigation Scenario →
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
