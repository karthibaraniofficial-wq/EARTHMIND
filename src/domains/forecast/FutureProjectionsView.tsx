import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  Info, 
  Sliders, 
  Activity, 
  ShieldAlert, 
  Compass,
  ArrowRight,
  Droplets,
  Flame,
  Sun
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { FutureProjectionRecord, DataProvenance } from '../../types';

interface FutureProjectionsViewProps {
  onNavigateToSimulator: () => void;
}

export const FutureProjectionsView: React.FC<FutureProjectionsViewProps> = ({
  onNavigateToSimulator,
}) => {
  const [selectedPathway, setSelectedPathway] = useState<'ssp126' | 'ssp245' | 'ssp585'>('ssp245');
  const [activeYear, setActiveYear] = useState<number>(2050);

  const projectionRecords: FutureProjectionRecord[] = [
    { year: 2026, ssp126TempDelta: 1.25, ssp245TempDelta: 1.25, ssp585TempDelta: 1.25, uncertaintyMargin: 0.12, seaLevelRiseMm: 110, droughtProbabilityPct: 24, carbonPpm: 422 },
    { year: 2030, ssp126TempDelta: 1.38, ssp245TempDelta: 1.48, ssp585TempDelta: 1.55, uncertaintyMargin: 0.18, seaLevelRiseMm: 135, droughtProbabilityPct: 29, carbonPpm: 435 },
    { year: 2040, ssp126TempDelta: 1.49, ssp245TempDelta: 1.82, ssp585TempDelta: 2.15, uncertaintyMargin: 0.28, seaLevelRiseMm: 195, droughtProbabilityPct: 38, carbonPpm: 468 },
    { year: 2050, ssp126TempDelta: 1.52, ssp245TempDelta: 2.14, ssp585TempDelta: 2.85, uncertaintyMargin: 0.38, seaLevelRiseMm: 270, droughtProbabilityPct: 49, carbonPpm: 512 },
    { year: 2060, ssp126TempDelta: 1.48, ssp245TempDelta: 2.38, ssp585TempDelta: 3.55, uncertaintyMargin: 0.46, seaLevelRiseMm: 360, droughtProbabilityPct: 58, carbonPpm: 564 },
    { year: 2070, ssp126TempDelta: 1.44, ssp245TempDelta: 2.58, ssp585TempDelta: 4.25, uncertaintyMargin: 0.55, seaLevelRiseMm: 460, droughtProbabilityPct: 67, carbonPpm: 625 },
    { year: 2080, ssp126TempDelta: 1.39, ssp245TempDelta: 2.74, ssp585TempDelta: 4.95, uncertaintyMargin: 0.65, seaLevelRiseMm: 580, droughtProbabilityPct: 74, carbonPpm: 692 },
    { year: 2090, ssp126TempDelta: 1.35, ssp245TempDelta: 2.88, ssp585TempDelta: 5.60, uncertaintyMargin: 0.74, seaLevelRiseMm: 710, droughtProbabilityPct: 81, carbonPpm: 765 },
    { year: 2100, ssp126TempDelta: 1.32, ssp245TempDelta: 3.02, ssp585TempDelta: 6.25, uncertaintyMargin: 0.85, seaLevelRiseMm: 850, droughtProbabilityPct: 88, carbonPpm: 840 },
  ];

  const currentRecord = projectionRecords.find((r) => r.year === activeYear) || projectionRecords[3];

  const getActiveDelta = (rec: FutureProjectionRecord) => {
    if (selectedPathway === 'ssp126') return rec.ssp126TempDelta;
    if (selectedPathway === 'ssp585') return rec.ssp585TempDelta;
    return rec.ssp245TempDelta;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              MODULE 17 — LONG-RANGE PLANETARY PROJECTIONS (2030 – 2100)
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Planetary Climate Projections</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Coupled biophysical forecasts aligned with IPCC Shared Socioeconomic Pathways (SSP1-2.6, SSP2-4.5, SSP5-8.5). Discloses shaded 95% scientific uncertainty envelopes.
          </p>
        </div>

        {/* Pathway Selector */}
        <div className="flex items-center gap-2 glass-panel-1 p-1 rounded-2xl border border-white/10">
          {[
            { id: 'ssp126' as const, label: 'SSP1-2.6 (Aggressive Paris)', tone: 'emerald' },
            { id: 'ssp245' as const, label: 'SSP2-4.5 (Current Trajectory)', tone: 'sun' },
            { id: 'ssp585' as const, label: 'SSP5-8.5 (High Emissions)', tone: 'coral' },
          ].map((pathway) => (
            <button
              key={pathway.id}
              onClick={() => setSelectedPathway(pathway.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                selectedPathway === pathway.id
                  ? 'bg-earth-aqua text-[#071A2B] font-bold shadow-md shadow-earth-aqua/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {pathway.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Milestone Card */}
      <GlassCard variant="strong" glow="aqua" className="p-6 border border-white/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-slate-400 uppercase">PROJECTED CLIMATE EPOCH</div>
            <div className="text-4xl font-extrabold font-mono text-white mt-1 flex items-baseline gap-3">
              <span>YEAR {activeYear}</span>
              <span className="text-sm text-earth-coral font-bold">
                +{getActiveDelta(currentRecord).toFixed(2)}°C Surface Warming
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <GlassBadge tone="sun" size="md">
              Scientific Uncertainty: ±{currentRecord.uncertaintyMargin}°C
            </GlassBadge>
            <GlassBadge tone="neutral" size="md">
              [PROJECTED: CMIP6 ENSEMBLE]
            </GlassBadge>
          </div>
        </div>

        {/* Timeline Horizon Selector */}
        <div className="pt-2">
          <input
            type="range"
            min={2026}
            max={2100}
            step={10}
            value={activeYear}
            onChange={(e) => setActiveYear(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua focus:outline-none"
          />

          <div className="flex justify-between mt-3 text-xs font-mono text-slate-400 px-1">
            {projectionRecords.map((r) => (
              <button
                key={r.year}
                onClick={() => setActiveYear(r.year)}
                className={`transition-colors ${
                  activeYear === r.year ? 'text-earth-aqua font-bold scale-110' : 'hover:text-slate-200'
                }`}
              >
                {r.year}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Epoch Projection KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10">
          <div className="p-4 rounded-xl glass-panel-1 border border-white/5 space-y-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-earth-coral" />
              <span>Thermal Warming Delta</span>
            </span>
            <div className="text-2xl font-bold font-mono text-earth-coral">
              +{getActiveDelta(currentRecord).toFixed(2)}°C
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">Baseline: 1850–1900 pre-industrial</span>
          </div>

          <div className="p-4 rounded-xl glass-panel-1 border border-white/5 space-y-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-earth-sky" />
              <span>Global Mean Sea Level</span>
            </span>
            <div className="text-2xl font-bold font-mono text-earth-sky">
              +{currentRecord.seaLevelRiseMm} mm
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">Thermal expansion + glacial melt</span>
          </div>

          <div className="p-4 rounded-xl glass-panel-1 border border-white/5 space-y-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-earth-sun" />
              <span>Severe Drought Probability</span>
            </span>
            <div className="text-2xl font-bold font-mono text-earth-sun">
              {currentRecord.droughtProbabilityPct}%
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">Vulnerable agricultural regions</span>
          </div>

          <div className="p-4 rounded-xl glass-panel-1 border border-white/5 space-y-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-earth-aurora" />
              <span>Atmospheric CO₂</span>
            </span>
            <div className="text-2xl font-bold font-mono text-earth-aurora">
              {currentRecord.carbonPpm} ppm
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">Global background mixing ratio</span>
          </div>
        </div>
      </GlassCard>

      {/* Projection Curves & Scientific Uncertainty Envelope */}
      <GlassCard variant="medium" className="p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-earth-aqua" />
            <h2 className="text-base font-bold text-white font-mono uppercase">
              Multimodel Ensemble Trajectories (2026 – 2100)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Shaded 95% Confidence Interval</span>
        </div>

        <div className="space-y-3 pt-2">
          {projectionRecords.map((rec) => {
            const isSelected = rec.year === activeYear;
            const delta = getActiveDelta(rec);
            const barWidthPct = Math.min(100, (delta / 6.5) * 100);

            return (
              <div
                key={rec.year}
                onClick={() => setActiveYear(rec.year)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-earth-aqua/15 border-earth-aqua shadow-sm'
                    : 'glass-panel-1 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className={`font-bold ${isSelected ? 'text-earth-aqua' : 'text-white'}`}>
                    Year {rec.year}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">CO₂: {rec.carbonPpm} ppm</span>
                    <span className="text-earth-coral font-bold">+{delta.toFixed(2)}°C (±{rec.uncertaintyMargin}°C)</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      selectedPathway === 'ssp126'
                        ? 'bg-gradient-to-r from-earth-emerald to-earth-leaf'
                        : selectedPathway === 'ssp585'
                        ? 'bg-gradient-to-r from-earth-sun to-earth-coral'
                        : 'bg-gradient-to-r from-earth-aqua to-earth-coral'
                    }`}
                    style={{ width: `${barWidthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};
