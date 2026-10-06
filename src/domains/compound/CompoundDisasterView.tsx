import React, { useState } from 'react';
import { 
  CloudRain, 
  Building2, 
  AlertTriangle, 
  Flame, 
  Waves, 
  ShieldAlert, 
  ShieldCheck, 
  Sliders, 
  Clock, 
  Activity, 
  ArrowRight, 
  RotateCcw,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { EnvironmentalHotspot, CompoundHazard } from '../../types';

interface CompoundDisasterViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToSimulator: () => void;
}

export const CompoundDisasterView: React.FC<CompoundDisasterViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToSimulator,
}) => {
  const [hazards, setHazards] = useState<CompoundHazard[]>([
    {
      id: 'rain',
      name: 'Extreme Cloudburst Rainfall (>120mm/hr)',
      category: 'precipitation',
      severity: 85,
      enabled: true,
      amplificationCoeff: 1.45,
      description: 'Atmospheric river moisture dumping convective volume exceeding 50-year return period.',
    },
    {
      id: 'urban',
      name: 'High Impervious Concrete Sprawl (NDBI +45%)',
      category: 'urbanization',
      severity: 78,
      enabled: true,
      amplificationCoeff: 1.35,
      description: 'Paved surfaces eliminate natural biophysical percolation, speeding hydro runoff velocity.',
    },
    {
      id: 'drainage',
      name: 'Obstructed / Inadequate Drainage Infrastructure',
      category: 'drainage',
      severity: 82,
      enabled: true,
      amplificationCoeff: 1.50,
      description: 'Sedimented storm drains and concrete canal bottlenecks prevent gravity outfall discharge.',
    },
    {
      id: 'heat',
      name: 'Antecedent Heatwave & Soil Crust Desiccation',
      category: 'heatwave',
      severity: 65,
      enabled: false,
      amplificationCoeff: 1.25,
      description: 'Hardened soil crust exhibits hydrophobic properties, repelling water into surface sheet flow.',
    },
    {
      id: 'coastal',
      name: 'Coastal High-Tide Surge & Estuarine Backflow',
      category: 'coastal',
      severity: 70,
      enabled: false,
      amplificationCoeff: 1.40,
      description: 'Astronomical spring tide blocks river mouths, reversing gravity drainage back into streets.',
    },
  ]);

  const [simulationHour, setSimulationHour] = useState<number>(36);
  const [bioswalesEnabled, setBioswalesEnabled] = useState(false);
  const [detentionTanksEnabled, setDetentionTanksEnabled] = useState(false);

  const toggleHazard = (id: string) => {
    setHazards((prev) =>
      prev.map((h) => (h.id === id ? { ...h, enabled: !h.enabled } : h))
    );
  };

  const activeHazards = hazards.filter((h) => h.enabled);
  const hazardCount = activeHazards.length;

  // Non-linear compounding formula: Multi-hazard risks compound exponentially
  const baseAvgSeverity = hazardCount > 0
    ? activeHazards.reduce((acc, h) => acc + h.severity, 0) / hazardCount
    : 10;
  
  const compoundingMultiplier = hazardCount === 0 ? 1 : Math.pow(1.22, hazardCount - 1);
  const mitigationReduction = (bioswalesEnabled ? 18 : 0) + (detentionTanksEnabled ? 22 : 0);
  
  const rawScore = baseAvgSeverity * compoundingMultiplier - mitigationReduction;
  const compoundRiskScore = Math.max(10, Math.min(99, Math.round(rawScore)));

  const escalationTimeline = [
    { hour: 0, title: 'Storm Inception', desc: 'Precipitation starts; urban drainage at 30% capacity.' },
    { hour: 12, title: 'Soil Infiltration Saturation', desc: 'Surface sheet runoff forms across high impervious corridors.' },
    { hour: 24, title: 'Stormwater Network Choke', desc: 'Underground canals breach; localized inundation of major roadways.' },
    { hour: 36, title: 'Subsurface Transit Failure', desc: 'Critical underpasses and metro pump vaults flooded; traffic paralysis.' },
    { hour: 48, title: 'Power Grid Substation Flashover', desc: 'High-voltage substations tripped; municipal water pumps lose primary power.' },
    { hour: 72, title: 'Epidemiological Hazard Peak', desc: 'Sewage contamination in standing stormwater; disease transmission threshold crossed.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-rose-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400">
              FEATURE 70 • COMPOUND MULTI-HAZARD SIMULATOR
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Compound Disaster Simulator</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Model simultaneous cascading extremes. Demonstrates how concurrent atmospheric, urban, and infrastructural failures multiply disaster risk rather than acting independently.
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
                  ? 'bg-rose-500 text-white border-rose-500 font-bold shadow-md shadow-rose-500/20'
                  : 'glass-panel-1 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3 inline mr-1" />
              {spot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Hazard Multiplier Gauge */}
      <GlassCard variant="strong" className="p-6 border border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-[#0a2540] to-[#071A2B] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <GlassBadge tone={compoundRiskScore > 75 ? 'coral' : compoundRiskScore > 50 ? 'sun' : 'emerald'} size="sm" pulse>
              {compoundRiskScore > 75 ? 'CRITICAL COMPOUND RISK' : compoundRiskScore > 50 ? 'HIGH CASCADE RISK' : 'MODERATE RISK'}
            </GlassBadge>
            <span className="text-xs font-mono text-slate-400">
              {hazardCount} CONCURRENT HAZARDS ACTIVE
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Non-Linear Amplification Factor: {compoundingMultiplier.toFixed(2)}x
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            When heavy cloudbursts strike impermeable concrete with choked drains, water depth surges 2.4x faster than isolated modeling predicts due to zero percolation and zero gravity outflow.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center p-4 rounded-2xl bg-black/40 border border-white/10 min-w-[130px]">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Compound Score</span>
            <span className={`text-4xl font-black ${
              compoundRiskScore > 75 ? 'text-rose-400' : compoundRiskScore > 50 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {compoundRiskScore}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">/100 Index</span>
          </div>

          <div className="text-center p-4 rounded-2xl bg-black/40 border border-white/10 min-w-[130px]">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Recovery Period</span>
            <span className="text-4xl font-black text-white">
              {Math.max(2, Math.round(compoundRiskScore / 2.2))}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">Weeks to Baseline</span>
          </div>
        </div>
      </GlassCard>

      {/* Multi-Hazard Selectors & Mitigations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Hazards Switcher */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Select Concurrent Hazards
          </h3>

          <div className="space-y-3">
            {hazards.map((h) => (
              <GlassCard
                key={h.id}
                variant="medium"
                onClick={() => toggleHazard(h.id)}
                className={`p-4 border cursor-pointer transition-all ${
                  h.enabled
                    ? 'border-rose-500/50 bg-rose-500/10 shadow-md'
                    : 'border-white/10 opacity-60 hover:opacity-100 hover:bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={h.enabled}
                        onChange={() => {}}
                        className="rounded border-rose-500 text-rose-500 focus:ring-0"
                      />
                      <span className="text-sm font-bold text-white">{h.name}</span>
                    </div>
                    <p className="text-xs text-slate-300 pl-6">{h.description}</p>
                  </div>
                  <GlassBadge tone={h.enabled ? 'coral' : 'neutral'} size="sm">
                    {h.amplificationCoeff}x factor
                  </GlassBadge>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Active Countermeasures */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-earth-emerald" />
              Active Resilience Countermeasures
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setBioswalesEnabled(!bioswalesEnabled)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  bioswalesEnabled
                    ? 'bg-earth-emerald/20 border-earth-emerald text-white'
                    : 'glass-panel-1 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">Nature-Based Bioswales (-18 Risk)</div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5">Captures 35% of first-flush street runoff.</div>
              </button>

              <button
                onClick={() => setDetentionTanksEnabled(!detentionTanksEnabled)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  detentionTanksEnabled
                    ? 'bg-earth-aqua/20 border-earth-aqua text-white'
                    : 'glass-panel-1 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">Subsurface Detention Vaults (-22 Risk)</div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5">Buffers 500,000m³ peak surge volume.</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: 72-Hour Escalation Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              72-Hour Escalation
            </h3>
            <span className="text-xs font-mono text-amber-400 font-bold">Hour {simulationHour}</span>
          </div>

          <GlassCard variant="medium" className="p-4 border border-white/10 space-y-4">
            <input
              type="range"
              min={0}
              max={72}
              step={12}
              value={simulationHour}
              onChange={(e) => setSimulationHour(Number(e.target.value))}
              className="w-full accent-amber-400"
            />

            <div className="space-y-3">
              {escalationTimeline.map((step) => {
                const isCurrent = simulationHour === step.hour;
                const isPassed = simulationHour >= step.hour;
                return (
                  <div
                    key={step.hour}
                    onClick={() => setSimulationHour(step.hour)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-amber-400/20 border-amber-400 text-white shadow-sm'
                        : isPassed
                        ? 'bg-white/5 border-white/10 text-slate-300'
                        : 'opacity-40 border-transparent text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-amber-300 font-bold">
                      <span>Hour {step.hour}:00</span>
                      {isCurrent && <span className="uppercase text-[10px]">Active Status</span>}
                    </div>
                    <div className="font-bold text-white mt-0.5">{step.title}</div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
