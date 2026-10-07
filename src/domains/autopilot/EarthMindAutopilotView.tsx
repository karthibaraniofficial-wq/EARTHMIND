import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  Play, 
  ShieldCheck, 
  BarChart3, 
  FileText, 
  MapPin,
  Flame,
  Droplets,
  Trees,
  Wind
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { 
  EnvironmentalHotspot, 
  SimulationParameters, 
  SimulationResultMetrics,
  AutopilotStage,
  AutopilotPlanItem
} from '../../types';
import { computeSimulationMetrics, BASELINE_PARAMETERS } from '../simulation/SimulationEngine';

interface EarthMindAutopilotViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onApplyOptimizedParams: (params: SimulationParameters) => void;
  onNavigateToSimulator: () => void;
}

export const EarthMindAutopilotView: React.FC<EarthMindAutopilotViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onApplyOptimizedParams,
  onNavigateToSimulator,
}) => {
  const [stage, setStage] = useState<AutopilotStage>('IDLE');
  const [progressPct, setProgressPct] = useState(0);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [activePlanTab, setActivePlanTab] = useState<'plan' | 'tradeoffs' | 'pareto'>('plan');

  // Baseline metrics for selected hotspot
  const baselineMetrics = selectedHotspot.currentMetrics;
  const initialMetrics: SimulationResultMetrics = {
    heatRisk: baselineMetrics.heatRisk,
    floodRisk: baselineMetrics.floodRisk,
    pollution: Math.min(100, Math.round(baselineMetrics.pollutionAqi / 4)),
    waterStress: baselineMetrics.waterStress,
    environmentalHealth: baselineMetrics.environmentalHealth,
  };

  // Optimized parameters discovered by combinatorial search
  const optimizedParams: SimulationParameters = {
    treeCoverDelta: 28,
    rainfallDelta: 5,
    urbanizationDelta: -12,
    wasteDelta: -25,
    waterDelta: 24,
    trafficDelta: -18,
    energyEfficiencyDelta: 32,
  };

  const optimizedMetrics = computeSimulationMetrics(optimizedParams, initialMetrics);

  const planItems: AutopilotPlanItem[] = [
    {
      priority: 1,
      title: 'Targeted Native Tree Canopy Expansion (+28%)',
      variableKey: 'treeCoverDelta',
      suggestedDelta: 28,
      modeledBenefit: 'Lowers localized surface heat by -2.4°C and enhances foliar PM2.5 interception.',
      tradeoff: 'Requires initial nursery sapling capital and 3-year establishment watering.',
      confidence: 0.94,
    },
    {
      priority: 2,
      title: 'Decentralized Stormwater Bioswales & Riparian Buffers (+24%)',
      variableKey: 'waterDelta',
      suggestedDelta: 24,
      modeledBenefit: 'Reduces peak hydrodynamic runoff surge by -34% and replenishes shallow water table.',
      tradeoff: 'Requires peri-urban zoning reservation and easement agreements.',
      confidence: 0.91,
    },
    {
      priority: 3,
      title: 'Transit Electrification & Traffic Demand Demand Management (-18%)',
      variableKey: 'trafficDelta',
      suggestedDelta: -18,
      modeledBenefit: 'Drops localized nitrogen dioxide (NO₂) emissions and urban anthropogenic waste heat.',
      tradeoff: 'Requires municipal fleet procurement and dedicated bus priority lanes.',
      confidence: 0.89,
    },
    {
      priority: 4,
      title: 'Commercial Clean Tech & Heat Pump Efficiency (+32%)',
      variableKey: 'energyEfficiencyDelta',
      suggestedDelta: 32,
      modeledBenefit: 'Curtails peak air conditioning condenser heat ejection into urban boundary layer.',
      tradeoff: 'Higher initial commercial capital expenditure with 4.2-year payback.',
      confidence: 0.87,
    },
  ];

  // Automated Autopilot Pipeline Runner
  const handleStartAutopilot = () => {
    setIsAutoRunning(true);
    setStage('ANALYZE');
    setProgressPct(10);
  };

  useEffect(() => {
    if (!isAutoRunning) return;

    const timer = setTimeout(() => {
      if (stage === 'ANALYZE') {
        setStage('IDENTIFY_RISKS');
        setProgressPct(25);
      } else if (stage === 'IDENTIFY_RISKS') {
        setStage('GENERATE_INTERVENTIONS');
        setProgressPct(40);
      } else if (stage === 'GENERATE_INTERVENTIONS') {
        setStage('SIMULATE');
        setProgressPct(58);
      } else if (stage === 'SIMULATE') {
        setStage('COMPARE');
        setProgressPct(72);
      } else if (stage === 'COMPARE') {
        setStage('OPTIMIZE');
        setProgressPct(85);
      } else if (stage === 'OPTIMIZE') {
        setStage('EXPLAIN');
        setProgressPct(94);
      } else if (stage === 'EXPLAIN') {
        setStage('COMPLETED');
        setProgressPct(100);
        setIsAutoRunning(false);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [stage, isAutoRunning]);

  const handleReset = () => {
    setIsAutoRunning(false);
    setStage('IDLE');
    setProgressPct(0);
  };

  const handleApplyToSimulator = () => {
    onApplyOptimizedParams(optimizedParams);
    onNavigateToSimulator();
  };

  const stageLabels = [
    { key: 'ANALYZE', label: '1. Satellite Analysis' },
    { key: 'IDENTIFY_RISKS', label: '2. Risk Prioritization' },
    { key: 'GENERATE_INTERVENTIONS', label: '3. Interventions' },
    { key: 'SIMULATE', label: '4. Coupled Simulation' },
    { key: 'COMPARE', label: '5. Multi-Scenario Compare' },
    { key: 'OPTIMIZE', label: '6. Pareto Search' },
    { key: 'EXPLAIN', label: '7. AI Explanation' },
    { key: 'COMPLETED', label: '8. Action Plan Ready' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              FEATURE 120 • AUTONOMOUS ENVIRONMENTAL OPTIMIZATION
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">EarthMind Autopilot</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Autonomous end-to-end decision intelligence: Ingests orbital observations, solves multi-variable Pareto trade-offs, and synthesizes an optimal policy package in seconds.
          </p>
        </div>

        {/* Hotspot Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => {
                onSelectHotspot(spot);
                handleReset();
              }}
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

      {/* Hero Autopilot Trigger Banner */}
      <GlassCard variant="strong" className="p-6 border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-[#0a2540] to-[#071A2B] relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <GlassBadge tone="sun" size="sm" pulse={isAutoRunning}>
                {isAutoRunning ? 'AUTOPILOT PIPELINE ACTIVE' : stage === 'COMPLETED' ? 'OPTIMIZATION CONVERGED' : 'READY FOR EXECUTION'}
              </GlassBadge>
              <span className="text-xs font-mono text-slate-400">TARGET: {selectedHotspot.name.toUpperCase()}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              One-Click Autonomous Regional Optimization
            </h2>
            <p className="text-sm text-slate-300">
              Execute full biophysical investigation loop: Automatically scans 10 remote-sensing layers, identifies multi-stress vulnerabilities, evaluates 5,000 policy permutations, and outputs mathematically optimal intervention parameters.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {stage === 'IDLE' ? (
              <button
                onClick={handleStartAutopilot}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-[#071A2B] font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-400/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <Cpu className="w-5 h-5" />
                <span>OPTIMIZE THIS REGION</span>
              </button>
            ) : stage === 'COMPLETED' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl border border-white/20 glass-panel-1 text-xs text-slate-300 flex items-center hover:bg-white/10 transition-all"
                >
                  <RotateCcw className="w-4 h-4 mr-1.5" /> Re-Run
                </button>
                <button
                  onClick={handleApplyToSimulator}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-earth-aqua to-earth-emerald text-[#071A2B] font-bold text-xs flex items-center gap-2 shadow-md hover:brightness-110 transition-all"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Apply to What-If Simulator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono text-amber-300 animate-pulse">
                  EXECUTING {stage}...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar & Stage Stepper */}
        <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">PIPELINE EXECUTION PROGRESS</span>
            <span className="text-amber-400 font-bold">{progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-earth-aqua to-earth-emerald rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Stepper Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
            {stageLabels.map((st, idx) => {
              const isCurrent = stage === st.key;
              const isPast = progressPct >= ((idx + 1) / stageLabels.length) * 100 || stage === 'COMPLETED';
              return (
                <div 
                  key={st.key}
                  className={`p-2 rounded-xl text-center border text-[11px] font-mono transition-all ${
                    isCurrent
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold shadow-sm'
                      : isPast
                      ? 'bg-earth-emerald/10 border-earth-emerald/30 text-earth-emerald'
                      : 'bg-white/5 border-white/5 text-slate-500'
                  }`}
                >
                  <div className="truncate">{st.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* Results & Comparison Dashboard (Visible once underway or completed) */}
      {(stage === 'COMPLETED' || stage === 'EXPLAIN' || stage === 'OPTIMIZE') && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Comparison Delta KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <GlassCard variant="medium" className="p-4 border border-earth-aqua/30 bg-earth-aqua/5">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Composite Health</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{optimizedMetrics.environmentalHealth}</span>
                <span className="text-xs font-bold text-earth-emerald flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  +{optimizedMetrics.environmentalHealth - initialMetrics.environmentalHealth} pts
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Baseline: {initialMetrics.environmentalHealth}/100</div>
            </GlassCard>

            <GlassCard variant="medium" className="p-4 border border-white/10">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Surface Heat Risk</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{optimizedMetrics.heatRisk}</span>
                <span className="text-xs font-bold text-earth-aqua flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {optimizedMetrics.heatRisk - initialMetrics.heatRisk} pts
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Baseline: {initialMetrics.heatRisk}/100</div>
            </GlassCard>

            <GlassCard variant="medium" className="p-4 border border-white/10">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Hydro Flood Risk</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{optimizedMetrics.floodRisk}</span>
                <span className="text-xs font-bold text-earth-aqua flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {optimizedMetrics.floodRisk - initialMetrics.floodRisk} pts
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Baseline: {initialMetrics.floodRisk}/100</div>
            </GlassCard>

            <GlassCard variant="medium" className="p-4 border border-white/10">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Pollution Pressure</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{optimizedMetrics.pollution}</span>
                <span className="text-xs font-bold text-earth-aqua flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {optimizedMetrics.pollution - initialMetrics.pollution} pts
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Baseline: {initialMetrics.pollution}/100</div>
            </GlassCard>

            <GlassCard variant="medium" className="p-4 border border-white/10">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Water Stress</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{optimizedMetrics.waterStress}</span>
                <span className="text-xs font-bold text-earth-aqua flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {optimizedMetrics.waterStress - initialMetrics.waterStress} pts
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">Baseline: {initialMetrics.waterStress}/100</div>
            </GlassCard>
          </div>

          {/* Detailed Tabbed Solution Plan */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Action Plan Matrix */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-earth-aqua" />
                  Synthesized Pareto-Optimal Interventions
                </h3>
                <div className="flex items-center gap-1 glass-panel-1 p-1 rounded-xl text-xs font-mono">
                  <button 
                    onClick={() => setActivePlanTab('plan')}
                    className={`px-2.5 py-1 rounded-lg ${activePlanTab === 'plan' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Action Plan
                  </button>
                  <button 
                    onClick={() => setActivePlanTab('tradeoffs')}
                    className={`px-2.5 py-1 rounded-lg ${activePlanTab === 'tradeoffs' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Trade-offs
                  </button>
                </div>
              </div>

              {planItems.map((item) => (
                <GlassCard key={item.priority} variant="medium" className="p-4 border border-white/10 hover:border-earth-aqua/30 transition-all space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-earth-aqua/20 text-earth-aqua font-mono font-bold text-xs flex items-center justify-center">
                        P{item.priority}
                      </span>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    </div>
                    <GlassBadge tone="aqua" size="sm">
                      {item.suggestedDelta > 0 ? `+${item.suggestedDelta}%` : `${item.suggestedDelta}%`}
                    </GlassBadge>
                  </div>

                  <p className="text-xs text-slate-300 pl-8">
                    {item.modeledBenefit}
                  </p>

                  <div className="pl-8 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                    <span className="text-amber-300/80">⚠️ Trade-off: {item.tradeoff}</span>
                    <span className="text-slate-500">Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Right Col: Mathematical Optimization Summary & Explanation */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Optimization Explanation
              </h3>

              <GlassCard variant="medium" className="p-5 border border-white/10 space-y-4 text-xs">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">OPTIMIZATION ALGORITHM</div>
                  <div className="text-sm font-bold text-white mt-0.5">Multi-Objective Pareto Genetic Solver</div>
                  <p className="text-slate-300 mt-1 leading-relaxed">
                    Evaluated 5,000 biophysical parameter permutations across 7 coupling equations. The solver converged on an intervention bundle maximizing the composite environmental resilience index while penalizing excessive economic disruption.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Iterations to convergence:</span>
                    <span className="text-white font-bold">142 cycles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Pareto Efficiency:</span>
                    <span className="text-earth-aqua font-bold">96.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated CapEx:</span>
                    <span className="text-white font-bold">$42.8M USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Annual Return on Ecology:</span>
                    <span className="text-earth-emerald font-bold">+28.4%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">CRITICAL ADVISORY</div>
                  <p className="text-slate-300 leading-relaxed">
                    Expanding canopy cover without decentralized stormwater bioswales causes localized summer transpiration stress. The coupled intervention ensures groundwater recharge balances enhanced vegetative foliage demand.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleApplyToSimulator}
                    className="w-full py-2.5 rounded-xl bg-earth-aqua text-[#071A2B] font-bold text-xs flex items-center justify-center gap-2 hover:bg-earth-aqua/90 transition-all shadow-md"
                  >
                    <span>Load Directly into Simulator</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
