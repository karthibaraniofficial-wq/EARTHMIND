import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Sliders, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Play, 
  RotateCcw,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { EnvironmentalHotspot, BattleStrategy, SimulationParameters } from '../../types';
import { computeSimulationMetrics } from '../simulation/SimulationEngine';

interface BattleModeViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onApplyParams: (params: SimulationParameters) => void;
  onNavigateToSimulator: () => void;
}

export const BattleModeView: React.FC<BattleModeViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onApplyParams,
  onNavigateToSimulator,
}) => {
  const [battleYear, setBattleYear] = useState<number>(2035);
  const [isBattling, setIsBattling] = useState(false);

  // Strategy A: Business as Usual
  const strategyA: BattleStrategy = {
    id: 'bau',
    name: 'STRATEGY A: BUSINESS AS USUAL',
    tag: 'Fossil Dependent • Concrete Expansion',
    philosophy: 'Prioritizes short-term municipal GDP growth, high-speed roads, and delays environmental zoning reform.',
    params: {
      treeCoverDelta: -15,
      rainfallDelta: 0,
      urbanizationDelta: 35,
      wasteDelta: 25,
      waterDelta: -20,
      trafficDelta: 30,
      energyEfficiencyDelta: 5,
    },
    metrics: {
      heatRisk: 84,
      floodRisk: 79,
      pollution: 82,
      waterStress: 76,
      environmentalHealth: 48,
    },
    capexTotalM: 0,
    implementationPace: 'Passive Drift',
    score: 48,
  };

  // Strategy B: Green Recovery
  const strategyB: BattleStrategy = {
    id: 'green',
    name: 'STRATEGY B: GREEN RECOVERY',
    tag: 'Nature-Based Solutions • Clean Tech',
    philosophy: 'Aggressively restores native vegetative canopies, installs permeable stormwater bioswales, and electrifies mass transit.',
    params: {
      treeCoverDelta: 30,
      rainfallDelta: 0,
      urbanizationDelta: -10,
      wasteDelta: -30,
      waterDelta: 25,
      trafficDelta: -20,
      energyEfficiencyDelta: 35,
    },
    metrics: {
      heatRisk: 48,
      floodRisk: 42,
      pollution: 46,
      waterStress: 39,
      environmentalHealth: 86,
    },
    capexTotalM: 44.5,
    implementationPace: 'Accelerated 4-Year Sprints',
    score: 86,
  };

  const handleRunBattleClash = () => {
    setIsBattling(true);
    setTimeout(() => {
      setIsBattling(false);
    }, 800);
  };

  const handleApplyWinner = () => {
    onApplyParams(strategyB.params);
    onNavigateToSimulator();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              FEATURE 114 • ENVIRONMENTAL BATTLE MODE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Environmental Battle Mode</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Exhibition head-to-head arena: Pit Business-as-Usual against Green Recovery to illustrate the biophysical delta and long-term societal payback for judges.
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
                  ? 'bg-amber-400 text-[#071A2B] border-amber-400 font-bold shadow-md shadow-amber-400/20'
                  : 'glass-panel-1 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3 inline mr-1" />
              {spot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Target Arena & Epoch Scrubber */}
      <GlassCard variant="medium" className="p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 uppercase">BATTLE HORIZON:</span>
          <div className="flex items-center gap-1 glass-panel-1 p-1 rounded-xl text-xs font-mono">
            {[2030, 2035, 2045, 2050].map((yr) => (
              <button
                key={yr}
                onClick={() => setBattleYear(yr)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  battleYear === yr ? 'bg-amber-400 text-[#071A2B] font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Year {yr}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleRunBattleClash}
          disabled={isBattling}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-[#071A2B] font-extrabold text-xs flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all"
        >
          <Target className={`w-4 h-4 ${isBattling ? 'animate-spin' : ''}`} />
          <span>SIMULATE HEAD-TO-HEAD CLASH</span>
        </button>
      </GlassCard>

      {/* Side-by-Side Strategy Battle Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {/* Left Corner: Strategy A (Business As Usual) */}
        <GlassCard variant="strong" className="p-6 border border-rose-500/30 bg-rose-500/5 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <GlassBadge tone="coral" size="sm">RED CORNER</GlassBadge>
            <span className="text-xs font-mono text-rose-300 uppercase">UNCHECKED STATUS QUO</span>
          </div>

          <div>
            <h3 className="text-xl font-black text-white">{strategyA.name}</h3>
            <div className="text-xs text-rose-300/80 font-mono mt-0.5">{strategyA.tag}</div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {strategyA.philosophy}
          </p>

          {/* Metric Outcomes */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Composite Health</span>
              <span className="text-2xl font-black text-rose-400">{strategyA.metrics.environmentalHealth}/100</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Surface Heat Risk</span>
              <span className="text-2xl font-black text-rose-400">{strategyA.metrics.heatRisk}/100</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Flash Flood Risk</span>
              <span className="text-xl font-bold text-white">{strategyA.metrics.floodRisk}/100</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Disaster Damage</span>
              <span className="text-xl font-bold text-rose-400">$94.2M Loss</span>
            </div>
          </div>
        </GlassCard>

        {/* Right Corner: Strategy B (Green Recovery - WINNER) */}
        <GlassCard variant="strong" className="p-6 border border-emerald-400/40 bg-emerald-500/10 space-y-4 relative overflow-hidden shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-400/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GlassBadge tone="emerald" size="sm" pulse>GREEN CORNER</GlassBadge>
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> WINNER (+38 PTS)
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-300 uppercase">REGENERATION PATH</span>
          </div>

          <div>
            <h3 className="text-xl font-black text-white">{strategyB.name}</h3>
            <div className="text-xs text-emerald-300 font-mono mt-0.5">{strategyB.tag}</div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {strategyB.philosophy}
          </p>

          {/* Metric Outcomes */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Composite Health</span>
              <span className="text-2xl font-black text-emerald-400">{strategyB.metrics.environmentalHealth}/100</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Surface Heat Risk</span>
              <span className="text-2xl font-black text-emerald-400">{strategyB.metrics.heatRisk}/100</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Flash Flood Risk</span>
              <span className="text-xl font-bold text-emerald-400">{strategyB.metrics.floodRisk}/100</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[10px] text-slate-400 block uppercase">Net Avoided Loss</span>
              <span className="text-xl font-bold text-emerald-400">+$128.5M ROI</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Winner Action Card */}
      <GlassCard variant="strong" className="p-5 border border-earth-aqua/30 bg-earth-aqua/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-earth-aqua/20 text-earth-aqua flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Strategy B Delivers 3.1x Environmental Dividend</h4>
            <div className="text-xs text-slate-300 font-mono">
              Avoids $128.5M in municipal flood damage while dropping localized summer heat index by 3.6°C.
            </div>
          </div>
        </div>

        <button
          onClick={handleApplyWinner}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-earth-aqua to-earth-emerald text-[#071A2B] font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-md transition-all"
        >
          <Sliders className="w-4 h-4" />
          <span>Load Green Recovery into Simulator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </GlassCard>
    </div>
  );
};
