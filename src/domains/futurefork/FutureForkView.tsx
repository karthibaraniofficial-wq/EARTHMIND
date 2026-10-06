import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  ArrowRight, 
  Flame, 
  Droplets, 
  Trees, 
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { FutureForkBranch, SimulationParameters } from '../../types';

interface FutureForkViewProps {
  onNavigateToSimulator: () => void;
  onApplyPreset?: (params: Partial<SimulationParameters>) => void;
}

export const FutureForkView: React.FC<FutureForkViewProps> = ({
  onNavigateToSimulator,
  onApplyPreset,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2050);
  const [selectedBranchKey, setSelectedBranchKey] = useState<'green' | 'base' | 'stress'>('green');

  const branches: FutureForkBranch[] = [
    {
      id: 'fork-green',
      key: 'green',
      name: 'GREEN REGENERATION',
      year: selectedYear,
      tagline: 'Aggressive Nature-Based Solutions & Carbon Drawdown',
      tempAnomaly: selectedYear === 2030 ? 1.3 : selectedYear === 2040 ? 1.4 : 1.2,
      floodRisk: selectedYear === 2030 ? 52 : selectedYear === 2040 ? 44 : 36,
      healthScore: selectedYear === 2030 ? 76 : selectedYear === 2040 ? 82 : 89,
      co2Ppm: selectedYear === 2030 ? 425 : selectedYear === 2040 ? 410 : 388,
      color: 'from-emerald-400 to-teal-500',
      description: 'Massive afforestation, strict impervious surface caps, decentralized stormwater infiltration, and global carbon-negative energy deployment.',
      actionsTaken: [
        'Global native forest restoration (+35% canopy coverage)',
        'Urban permeable pavement & bioswale mandate',
        'Phaseout of internal combustion and heavy industrial coal',
        'Agroforestry soil carbon sequestration standard',
      ],
    },
    {
      id: 'fork-base',
      key: 'base',
      name: 'BASELINE STATUS QUO',
      year: selectedYear,
      tagline: 'Current Policies with Incremental Technological Adaptation',
      tempAnomaly: selectedYear === 2030 ? 1.5 : selectedYear === 2040 ? 1.9 : 2.4,
      floodRisk: selectedYear === 2030 ? 63 : selectedYear === 2040 ? 71 : 78,
      healthScore: selectedYear === 2030 ? 68 : selectedYear === 2040 ? 61 : 55,
      co2Ppm: selectedYear === 2030 ? 438 : selectedYear === 2040 ? 468 : 504,
      color: 'from-blue-400 to-indigo-500',
      description: 'Slow market-driven renewables transition with continued urban sprawl and moderate deforestation rate across tropical biomes.',
      actionsTaken: [
        'Current Paris Agreement pledges partially met',
        'Incremental electric vehicle adoption without grid overhaul',
        'Patchy wetland conservation and ongoing aquifer drawdown',
        'Moderate urban heat island expansion (+1.8°C)',
      ],
    },
    {
      id: 'fork-stress',
      key: 'stress',
      name: 'CLIMATE STRESS RUNAWAY',
      year: selectedYear,
      tagline: 'Unabated Fossil Expansion & Severe Tipping Points',
      tempAnomaly: selectedYear === 2030 ? 1.8 : selectedYear === 2040 ? 2.8 : 4.2,
      floodRisk: selectedYear === 2030 ? 74 : selectedYear === 2040 ? 86 : 94,
      healthScore: selectedYear === 2030 ? 58 : selectedYear === 2040 ? 42 : 28,
      co2Ppm: selectedYear === 2030 ? 455 : selectedYear === 2040 ? 528 : 625,
      tippingPointAlert: 'CRITICAL: Amazon dieback triggered. Boreal permafrost methane pulse active.',
      color: 'from-rose-500 to-red-600',
      description: 'Resource nationalism, unchecked concrete sprawl, wetland drainage, and deforestation triggering irreversible biophysical feedback cascades.',
      actionsTaken: [
        'Rolling back environmental zoning regulations',
        'High-density concrete sprawl (+65% impervious land cover)',
        'Collapse of tropical rainforest moisture recycling pump',
        'Severe multi-breadbasket compound crop failures',
      ],
    },
  ];

  const activeBranch = branches.find((b) => b.key === selectedBranchKey) || branches[0];

  const handleLoadBranchIntoSimulator = () => {
    if (!onApplyPreset) {
      onNavigateToSimulator();
      return;
    }

    if (selectedBranchKey === 'green') {
      onApplyPreset({
        treeCoverDelta: 35,
        waterDelta: 25,
        trafficDelta: -25,
        energyEfficiencyDelta: 40,
        urbanizationDelta: -10,
      });
    } else if (selectedBranchKey === 'stress') {
      onApplyPreset({
        treeCoverDelta: -20,
        waterDelta: -30,
        trafficDelta: 30,
        energyEfficiencyDelta: -20,
        urbanizationDelta: 45,
      });
    } else {
      onApplyPreset({
        treeCoverDelta: 5,
        waterDelta: 0,
        trafficDelta: 10,
        energyEfficiencyDelta: 15,
        urbanizationDelta: 15,
      });
    }
    onNavigateToSimulator();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              FEATURE 46 • MULTIPLE-FUTURE BRANCHING ENGINE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Future Fork</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Explore branched planetary trajectories from 2026. Compare how policy decisions divert Earth toward regenerative recovery or catastrophic runaway tipping points.
          </p>
        </div>

        {/* Timeline Year Scrubber */}
        <div className="flex items-center gap-1.5 glass-panel-2 p-1.5 rounded-2xl border border-white/10">
          {[2026, 2030, 2040, 2050].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedYear === yr
                  ? 'bg-earth-aqua text-[#071A2B] shadow-md shadow-earth-aqua/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {yr === 2026 ? '2026 (Present)' : yr}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Branching Tree Architecture Diagram */}
      <GlassCard variant="strong" className="p-6 border border-white/15 relative overflow-hidden">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-white mb-2 shadow-inner">
            <span>EPOCH 2026: PRESENT MULTIVARIATE EQUILIBRIUM</span>
          </div>
          <div className="w-0.5 h-6 bg-white/30 mx-auto" />
          <div className="max-w-xl mx-auto border-t-2 border-white/20 relative">
            <div className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-emerald-400" />
            <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rounded-full bg-blue-400" />
            <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-rose-500" />
          </div>
        </div>

        {/* 3 Interactive Branch Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {branches.map((b) => {
            const isSelected = b.key === selectedBranchKey;
            return (
              <div
                key={b.key}
                onClick={() => setSelectedBranchKey(b.key)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'glass-panel-3 border-earth-aqua shadow-xl shadow-earth-aqua/10 ring-1 ring-earth-aqua'
                    : 'glass-panel-1 border-white/10 hover:border-white/25 hover:bg-white/5 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      b.key === 'green' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      b.key === 'stress' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {b.name}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{b.year}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {b.tagline}
                  </p>

                  {/* Core Metrics Pill Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
                    <div className="p-2 rounded-xl bg-black/25 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Temp Delta</span>
                      <span className={`text-base font-bold ${
                        b.tempAnomaly > 2.0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        +{b.tempAnomaly}°C
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/25 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Eco Health</span>
                      <span className={`text-base font-bold ${
                        b.healthScore >= 70 ? 'text-emerald-400' : b.healthScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {b.healthScore}/100
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/25 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Atmospheric CO₂</span>
                      <span className="text-sm font-bold text-white">{b.co2Ppm} ppm</span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/25 border border-white/5">
                      <span className="text-[10px] text-slate-400 block">Flood Risk</span>
                      <span className="text-sm font-bold text-white">{b.floodRisk}/100</span>
                    </div>
                  </div>

                  {b.tippingPointAlert && (
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[10px] font-mono text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
                      <span>{b.tippingPointAlert}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Click to Inspect</span>
                  <span className="text-earth-aqua font-bold flex items-center gap-1">
                    Select <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Selected Branch Deep Dive */}
      <GlassCard variant="medium" className="p-6 border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase">ACTIVE FUTURE BRANCH:</span>
              <GlassBadge
                tone={activeBranch.key === 'green' ? 'emerald' : activeBranch.key === 'stress' ? 'coral' : 'aqua'}
                size="sm"
              >
                {activeBranch.name} ({selectedYear})
              </GlassBadge>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">{activeBranch.tagline}</h2>
          </div>

          <button
            onClick={handleLoadBranchIntoSimulator}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-earth-aqua to-earth-emerald text-[#071A2B] font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-md transition-all flex-shrink-0"
          >
            <Sliders className="w-4 h-4" />
            <span>Load Branch Parameters into Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {activeBranch.description}
        </p>

        {/* Action Commitments for this pathway */}
        <div className="pt-2">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
            KEY POLICIES ENFORCED IN THIS BRANCH:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeBranch.actionsTaken.map((action, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200 flex items-start gap-2">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  activeBranch.key === 'green' ? 'text-emerald-400' : activeBranch.key === 'stress' ? 'text-rose-400' : 'text-blue-400'
                }`} />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
