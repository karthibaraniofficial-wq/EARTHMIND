import React, { useState } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Save, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Zap, 
  Flame, 
  Droplets, 
  Wind, 
  Trees, 
  Building2, 
  Trash2, 
  Car, 
  Lightbulb, 
  Share2,
  Calendar,
  Layers,
  ArrowRight,
  Play,
  Info
} from 'lucide-react';
import { Loader2 } from '../../components/icons';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassModal } from '../../components/glass/GlassModal';
import { 
  SimulationParameters, 
  SimulationResultMetrics, 
  SavedScenario, 
  EnvironmentalHotspot 
} from '../../types';
import { 
  BASELINE_PARAMETERS, 
  computeSimulationMetrics, 
  compareScenarios 
} from './SimulationEngine';
import { ScientificBadge } from '../../design-system/ScientificBadge';
import { ScoreContributionBar, ScoreContributionItem } from '../../design-system/ScoreContributionBar';

interface WhatIfSimulatorViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onSaveScenario: (scenario: SavedScenario) => void;
  onNavigateToComparison: () => void;
  params?: SimulationParameters;
  onParamsChange?: (params: SimulationParameters) => void;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onSaveScenario,
  onNavigateToComparison,
  params: externalParams,
  onParamsChange,
}) => {
  const [internalParams, setInternalParams] = useState<SimulationParameters>(externalParams || BASELINE_PARAMETERS);
  const params = externalParams || internalParams;

  const [activeTab, setActiveTab] = useState<'primary' | 'advanced' | 'all'>('primary');
  const [simState, setSimState] = useState<'IDLE' | 'RUNNING' | 'CONVERGED'>('CONVERGED');
  const [selectedBaselineYear, setSelectedBaselineYear] = useState<number>(2026);

  const setParams = (updater: React.SetStateAction<SimulationParameters>) => {
    const next = typeof updater === 'function' ? (updater as (prev: SimulationParameters) => SimulationParameters)(params) : updater;
    setInternalParams(next);
    onParamsChange?.(next);
    setSimState('IDLE'); // Indicate modification waiting for re-convergence
  };

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  // Baseline metrics from selected hotspot
  const baselineMetrics: SimulationResultMetrics = {
    heatRisk: selectedHotspot.currentMetrics.heatRisk,
    floodRisk: selectedHotspot.currentMetrics.floodRisk,
    pollution: Math.round(selectedHotspot.currentMetrics.pollutionAqi / 3.6),
    waterStress: selectedHotspot.currentMetrics.waterStress,
    environmentalHealth: selectedHotspot.currentMetrics.environmentalHealth,
  };

  const simulatedMetrics = computeSimulationMetrics(params, baselineMetrics);
  const comparison = compareScenarios(simulatedMetrics, baselineMetrics);

  const handleRunSimulation = () => {
    setSimState('RUNNING');
    setTimeout(() => {
      setSimState('CONVERGED');
    }, 450);
  };

  const handleSliderChange = (key: keyof SimulationParameters, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setParams(BASELINE_PARAMETERS);
    setSimState('CONVERGED');
  };

  const applyPreset = (presetParams: Partial<SimulationParameters>) => {
    setParams({
      ...BASELINE_PARAMETERS,
      ...presetParams,
    });
    setSimState('RUNNING');
    setTimeout(() => setSimState('CONVERGED'), 400);
  };

  const handleSaveScenarioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioName.trim()) return;

    const newScenario: SavedScenario = {
      id: `custom-scenario-${Date.now()}`,
      name: scenarioName.trim(),
      description: scenarioDescription.trim() || `Simulated policy variant for ${selectedHotspot.name}`,
      tag: 'Custom',
      params: { ...params },
      metrics: { ...simulatedMetrics },
      createdAt: new Date().toISOString().split('T')[0],
      author: 'User Simulation Session',
    };

    onSaveScenario(newScenario);
    setIsSaveModalOpen(false);
    setScenarioName('');
    setScenarioDescription('');
    setSavedSuccessMsg(true);
    setTimeout(() => setSavedSuccessMsg(false), 4000);
  };

  // Explainable Score Decomposition
  const simulatedScoreBreakdown: ScoreContributionItem[] = [
    {
      id: 'tree',
      name: 'Canopy Evapotranspiration',
      percentage: 28,
      deltaPoints: Math.round(params.treeCoverDelta * 0.35 * 10) / 10,
      color: 'bg-emerald-400',
      rationale: `${params.treeCoverDelta >= 0 ? '+' : ''}${params.treeCoverDelta}% canopy alters microclimate heat flux and soil moisture retention.`,
    },
    {
      id: 'water',
      name: 'Hydrological Percolation Capacity',
      percentage: 24,
      deltaPoints: Math.round(params.waterDelta * 0.3 * 10) / 10,
      color: 'bg-cyan-400',
      rationale: `${params.waterDelta >= 0 ? '+' : ''}${params.waterDelta}% percolation alters flash hydrograph attenuation and aquifer recharge.`,
    },
    {
      id: 'heat',
      name: 'Thermal Surface Radiance',
      percentage: 18,
      deltaPoints: -Math.round((simulatedMetrics.heatRisk - baselineMetrics.heatRisk) * 0.2 * 10) / 10,
      color: 'bg-amber-400',
      rationale: `Microclimate thermal forcing delta of ${Math.abs(comparison.deltas.heatRisk)} pts.`,
    },
    {
      id: 'aerosol',
      name: 'Atmospheric Particulate AQI',
      percentage: 15,
      deltaPoints: -Math.round((simulatedMetrics.pollution - baselineMetrics.pollution) * 0.25 * 10) / 10,
      color: 'bg-purple-400',
      rationale: `Fossil traffic density (${params.trafficDelta}%) alters tropospheric particulate dispersion.`,
    },
    {
      id: 'urban',
      name: 'Impervious Surface Ratio',
      percentage: 15,
      deltaPoints: -Math.round(params.urbanizationDelta * 0.25 * 10) / 10,
      color: 'bg-rose-400',
      rationale: `Impervious conversion (${params.urbanizationDelta}%) shifts ground absorption to overland runoff.`,
    },
  ];

  const primarySliders: {
    id: keyof SimulationParameters;
    label: string;
    icon: React.ReactNode;
    min: number;
    max: number;
    unit: string;
    color: string;
    description: string;
  }[] = [
    {
      id: 'treeCoverDelta',
      label: 'Tree Canopy Cover',
      icon: <Trees className="w-4 h-4 text-earth-leaf" />,
      min: -20,
      max: 50,
      unit: '%',
      color: 'accent-earth-leaf',
      description: 'Native afforestation, pocket Miyawaki forests & bioswale corridors',
    },
    {
      id: 'rainfallDelta',
      label: 'Precipitation Intensity',
      icon: <Droplets className="w-4 h-4 text-earth-sky" />,
      min: -30,
      max: 60,
      unit: '%',
      color: 'accent-earth-sky',
      description: 'Monsoon shift, atmospheric river anomalies & drought periods',
    },
    {
      id: 'urbanizationDelta',
      label: 'Urban Sprawl / Pavement',
      icon: <Building2 className="w-4 h-4 text-earth-sun" />,
      min: -20,
      max: 50,
      unit: '%',
      color: 'accent-earth-sun',
      description: 'Impervious concrete surface conversion & commercial zoning',
    },
    {
      id: 'waterDelta',
      label: 'Water Retention Capacity',
      icon: <Droplets className="w-4 h-4 text-earth-aqua" />,
      min: -50,
      max: 50,
      unit: '%',
      color: 'accent-earth-aqua',
      description: 'Wetland buffers, retention ponds & aquifer percolation wells',
    },
  ];

  const advancedSliders: {
    id: keyof SimulationParameters;
    label: string;
    icon: React.ReactNode;
    min: number;
    max: number;
    unit: string;
    color: string;
    description: string;
  }[] = [
    {
      id: 'wasteDelta',
      label: 'Municipal Waste Generation',
      icon: <Trash2 className="w-4 h-4 text-earth-coral" />,
      min: -30,
      max: 70,
      unit: '%',
      color: 'accent-earth-coral',
      description: 'Landfill expansion, organic breakdown & packaging waste',
    },
    {
      id: 'trafficDelta',
      label: 'Combustion Traffic Density',
      icon: <Car className="w-4 h-4 text-earth-aurora" />,
      min: -30,
      max: 60,
      unit: '%',
      color: 'accent-earth-aurora',
      description: 'Fossil-fuel private vehicles, freight transport & congestion',
    },
    {
      id: 'energyEfficiencyDelta',
      label: 'Clean Energy & Heat Albedo',
      icon: <Lightbulb className="w-4 h-4 text-earth-sun" />,
      min: -30,
      max: 50,
      unit: '%',
      color: 'accent-earth-sun',
      description: 'Renewable grid adoption, cool roofs & district thermal cooling',
    },
  ];

  const visibleSliders = 
    activeTab === 'primary' 
      ? primarySliders 
      : activeTab === 'advanced' 
      ? advancedSliders 
      : [...primarySliders, ...advancedSliders];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* SECTION 9 WORKFLOW HERO HEADER: Step-by-Step Mission Flow */}
      <div className="p-4 rounded-2xl glass-panel-2 border border-white/15 bg-[#071A2B]/90 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-earth-aqua animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-earth-aqua font-bold">
                WHAT-IF • COUPLED BIOPHYSICAL SCENARIO SIMULATOR
              </span>
              <ScientificBadge provenance="SIMULATED" confidence={88} size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              Environmental Scenario Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl font-medium leading-relaxed">
              Formulate policy and climate counterfactuals. Modulate biophysical levers to evaluate coupled microclimate, hydrological, and air-quality outcomes.
            </p>
          </div>

          {/* Workflow Step Indicator Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            {/* Step 1: Location */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-slate-400">1. TARGET:</span>
              <select
                value={selectedHotspot.id}
                onChange={(e) => {
                  const spot = hotspots.find((h) => h.id === e.target.value);
                  if (spot) onSelectHotspot(spot);
                }}
                className="bg-transparent text-earth-aqua font-bold focus:outline-none cursor-pointer"
              >
                {hotspots.map((spot) => (
                  <option key={spot.id} value={spot.id} className="bg-slate-900 text-white">
                    {spot.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Baseline */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-slate-400">2. BASELINE:</span>
              <select
                value={selectedBaselineYear}
                onChange={(e) => setSelectedBaselineYear(Number(e.target.value))}
                className="bg-transparent text-earth-sun font-bold focus:outline-none cursor-pointer"
              >
                <option value={2026} className="bg-slate-900 text-white">2026 (Active)</option>
                <option value={2022} className="bg-slate-900 text-white">2022 (La Niña)</option>
                <option value={2018} className="bg-slate-900 text-white">2018 (Pre-Heatwave)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 8-Step Interactive Narrative Bar */}
        <div className="hidden md:flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400">
          <span className="text-earth-aqua font-bold">1. Location Selected</span>
          <span>→</span>
          <span className="text-earth-sun font-bold">2. Baseline Grounded</span>
          <span>→</span>
          <span className={simState === 'IDLE' ? 'text-amber-400 font-bold underline animate-pulse' : 'text-slate-300'}>
            3. Modify Variables
          </span>
          <span>→</span>
          <span className={simState === 'RUNNING' ? 'text-earth-aqua font-bold animate-pulse' : 'text-slate-300'}>
            4. Run Simulation
          </span>
          <span>→</span>
          <span className={simState === 'CONVERGED' ? 'text-earth-emerald font-bold' : 'text-slate-400'}>
            5. Inspect Result
          </span>
          <span>→</span>
          <span className="text-slate-400">6. Understand Why</span>
          <span>→</span>
          <span className="text-slate-400">7. Compare Scenarios</span>
          <span>→</span>
          <span className="text-slate-400">8. Decide & Report</span>
        </div>
      </div>

      {/* Quick Experiment Presets */}
      <GlassCard variant="medium" className="p-3 border border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
          <Zap className="w-4 h-4 text-earth-sun" />
          <span className="font-bold">PRESET SCENARIOS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset({ treeCoverDelta: 35, waterDelta: 25, trafficDelta: -20, energyEfficiencyDelta: 25 })}
            className="px-2.5 py-1 rounded-lg text-xs font-medium glass-panel-1 border border-earth-emerald/30 text-earth-emerald hover:bg-earth-emerald/15 transition-colors"
          >
            🌱 Maximum Re-greening (+35% Tree)
          </button>

          <button
            onClick={() => applyPreset({ rainfallDelta: 45, urbanizationDelta: 20, waterDelta: -15 })}
            className="px-2.5 py-1 rounded-lg text-xs font-medium glass-panel-1 border border-earth-sky/30 text-earth-sky hover:bg-earth-sky/15 transition-colors"
          >
            🌧 Severe Monsoon Surge (+45% Rain)
          </button>

          <button
            onClick={() => applyPreset({ urbanizationDelta: 40, trafficDelta: 35, treeCoverDelta: -15, wasteDelta: 40 })}
            className="px-2.5 py-1 rounded-lg text-xs font-medium glass-panel-1 border border-earth-coral/30 text-earth-coral hover:bg-earth-coral/15 transition-colors"
          >
            🏙 Rapid Urban Sprawl (+40% Pavement)
          </button>

          <button
            onClick={() => applyPreset({ wasteDelta: -30, trafficDelta: -30, energyEfficiencyDelta: 40 })}
            className="px-2.5 py-1 rounded-lg text-xs font-medium glass-panel-1 border border-earth-aurora/30 text-earth-aurora hover:bg-earth-aurora/15 transition-colors"
          >
            ⚡ Clean Transit & Circular Grid
          </button>

          <button
            onClick={handleReset}
            className="px-2.5 py-1 rounded-lg text-xs font-medium glass-panel-1 border border-white/15 text-slate-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </GlassCard>

      {/* Main 2-Column Split: VARIABLES (Left 7 cols) vs RESULTS (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        {/* Left Column: Simulation Variables & Levers */}
        <div className={`lg:col-span-7 space-y-4 min-w-0 transition-opacity ${simState === 'IDLE' ? 'opacity-100 ring-1 ring-earth-aqua/30 rounded-2xl p-1' : 'opacity-95'}`}>
          {/* Header with Progressive Disclosure Controls */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <span>Simulation Levers & Policy Variables</span>
                {simState === 'IDLE' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Modifications Active
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Adjust sliders to model counterfactual impacts on biophysical coupling.
              </p>
            </div>

            {/* Progressive Disclosure Level Tabs */}
            <div className="flex items-center p-0.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
              <button
                onClick={() => setActiveTab('primary')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'primary' ? 'bg-earth-aqua text-[#071A2B] font-bold shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Primary (4)
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'advanced' ? 'bg-earth-aqua text-[#071A2B] font-bold shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                Advanced (3)
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'all' ? 'bg-earth-aqua text-[#071A2B] font-bold shadow' : 'text-slate-300 hover:text-white'
                }`}
              >
                All (7)
              </button>
            </div>
          </div>

          {/* Slider Cards Container */}
          <div className="space-y-3">
            {visibleSliders.map((item) => {
              const val = params[item.id];
              const isChanged = val !== 0;

              return (
                <GlassCard
                  key={item.id}
                  variant="medium"
                  className={`p-4 border transition-all ${
                    isChanged ? 'border-earth-aqua/40 bg-slate-900/90 shadow-md shadow-earth-aqua/10' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5">{item.icon}</div>
                      <div>
                        <span className="text-xs font-bold text-white block">{item.label}</span>
                        <span className="text-[11px] text-slate-400 block">{item.description}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-extrabold font-mono px-2 py-0.5 rounded-md ${
                          val > 0
                            ? 'bg-earth-emerald/20 text-earth-emerald border border-earth-emerald/30'
                            : val < 0
                            ? 'bg-earth-coral/20 text-earth-coral border border-earth-coral/30'
                            : 'bg-white/5 text-slate-300'
                        }`}
                      >
                        {val > 0 ? `+${val}` : val}
                        {item.unit}
                      </span>
                    </div>
                  </div>

                  {/* Range input */}
                  <div className="pt-2">
                    <input
                      type="range"
                      min={item.min}
                      max={item.max}
                      step={5}
                      value={val}
                      onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                      className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer ${item.color} focus:outline-none`}
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>{item.min}{item.unit}</span>
                      <span className="text-slate-400">Baseline (0%)</span>
                      <span>+{item.max}{item.unit}</span>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Dedicated [ RUN SIMULATION ] Action Bar */}
          <div className="p-4 rounded-2xl glass-panel-2 border border-earth-aqua/30 bg-[#071A2B]/95 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-earth-aqua" />
                <span>Coupled Biophysical Convergence Engine</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Solves coupled radiative flux, stormwater runoff, and microclimate feedback balance.
              </p>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={simState === 'RUNNING'}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-all ${
                simState === 'RUNNING'
                  ? 'bg-earth-aqua/50 text-[#071A2B] cursor-wait'
                  : 'bg-gradient-to-r from-earth-aqua to-earth-emerald text-[#071A2B] shadow-lg shadow-earth-aqua/25 hover:brightness-110 active:scale-95'
              }`}
            >
              {simState === 'RUNNING' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Models...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Run Coupled Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: RESULT & EXPLAINABILITY HIERARCHY */}
        <div className={`lg:col-span-5 space-y-5 min-w-0 transition-all ${simState === 'CONVERGED' ? 'opacity-100 ring-1 ring-earth-emerald/30 rounded-2xl p-1' : 'opacity-90'}`}>
          {/* Main Simulated Outcome Card */}
          <GlassCard
            variant="strong"
            glow={
              comparison.verdict === 'SIGNIFICANT_IMPROVEMENT' || comparison.verdict === 'MODERATE_IMPROVEMENT'
                ? 'emerald'
                : comparison.verdict === 'DEGRADATION' || comparison.verdict === 'CRITICAL_RISK'
                ? 'coral'
                : 'aqua'
            }
            className="p-6 border border-white/20 shadow-2xl relative"
          >
            {/* Top Provenance & Verdict Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  PROJECTED RESULT
                </span>
                <ScientificBadge provenance="SIMULATED" confidence={88} size="sm" />
              </div>
              <GlassBadge
                tone={
                  comparison.verdict === 'SIGNIFICANT_IMPROVEMENT'
                    ? 'emerald'
                    : comparison.verdict === 'MODERATE_IMPROVEMENT'
                    ? 'leaf'
                    : comparison.verdict === 'DEGRADATION'
                    ? 'coral'
                    : comparison.verdict === 'CRITICAL_RISK'
                    ? 'coral'
                    : 'neutral'
                }
                size="sm"
                pulse
              >
                {comparison.verdict.replace('_', ' ')}
              </GlassBadge>
            </div>

            {/* Score Comparison Display: Baseline -> Simulated */}
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="text-xs text-slate-400">Environmental Health Score</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-extrabold font-mono text-white">
                    {simulatedMetrics.environmentalHealth}
                  </span>
                  <span className="text-sm text-slate-400 font-mono">/ 100</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Baseline Reference: <span className="text-white font-bold">{baselineMetrics.environmentalHealth}</span>
                </div>
              </div>

              {/* Net Variance */}
              <div className="text-right">
                <div className="text-xs text-slate-400">Net Variance</div>
                <div
                  className={`text-2xl font-bold font-mono mt-1 ${
                    comparison.deltas.environmentalHealth > 0
                      ? 'text-earth-emerald'
                      : comparison.deltas.environmentalHealth < 0
                      ? 'text-earth-coral'
                      : 'text-slate-400'
                  }`}
                >
                  {comparison.deltas.environmentalHealth > 0
                    ? `+${comparison.deltas.environmentalHealth}`
                    : comparison.deltas.environmentalHealth} pts
                </div>
                <span className="text-[10px] font-mono text-earth-aqua">
                  88% model confidence
                </span>
              </div>
            </div>

            {/* Health Meter Progress Bar */}
            <div className="mt-4 w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  simulatedMetrics.environmentalHealth >= 75
                    ? 'bg-gradient-to-r from-earth-aqua to-earth-emerald'
                    : simulatedMetrics.environmentalHealth >= 55
                    ? 'bg-gradient-to-r from-earth-sun to-earth-leaf'
                    : 'bg-gradient-to-r from-red-600 to-earth-coral'
                }`}
                style={{ width: `${simulatedMetrics.environmentalHealth}%` }}
              />
            </div>

            {/* SECTION 15: Explainable Score Breakdown */}
            <div className="mt-5">
              <ScoreContributionBar
                score={simulatedMetrics.environmentalHealth}
                items={simulatedScoreBreakdown}
                label="Why Did The Score Change? (Driver Attribution)"
                defaultExpanded={true}
              />
            </div>

            {/* AI Transparent Reasoning Summary */}
            <div className="mt-4 p-3.5 rounded-xl bg-earth-aurora/10 border border-earth-aurora/25 text-xs text-slate-200 leading-relaxed font-sans">
              <div className="flex items-center gap-1.5 font-bold text-earth-aurora mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Coupling Reasoning</span>
              </div>
              "{comparison.aiReasoning}"
            </div>

            {/* Save to Scenarios & Compare Action Buttons */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <GlassButton
                variant="emerald"
                size="md"
                onClick={() => setIsSaveModalOpen(true)}
                leftIcon={<Save className="w-4 h-4" />}
                className="w-full"
              >
                Save This Scenario
              </GlassButton>

              <GlassButton
                variant="ghost"
                size="md"
                onClick={onNavigateToComparison}
                title="View in Multi-Scenario Lab"
              >
                Compare in Lab →
              </GlassButton>
            </div>

            {savedSuccessMsg && (
              <div className="mt-2 text-center text-xs text-earth-emerald font-semibold animate-in fade-in">
                ✓ Scenario saved successfully to Comparison Lab!
              </div>
            )}
          </GlassCard>

          {/* 4 Multi-stressor Reactive Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Heat Risk */}
            <GlassCard variant="medium" className="p-4 border border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-earth-coral" /> Heat Risk
                </span>
                <span className="font-mono text-[10px] text-slate-500">Base {baselineMetrics.heatRisk}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white">{simulatedMetrics.heatRisk}</span>
                <span
                  className={`text-xs font-mono font-bold ${
                    comparison.deltas.heatRisk < 0 ? 'text-earth-emerald' : comparison.deltas.heatRisk > 0 ? 'text-earth-coral' : 'text-slate-400'
                  }`}
                >
                  {comparison.deltas.heatRisk > 0 ? `+${comparison.deltas.heatRisk}` : comparison.deltas.heatRisk}
                </span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-earth-coral rounded-full transition-all" style={{ width: `${simulatedMetrics.heatRisk}%` }} />
              </div>
            </GlassCard>

            {/* Flood Risk */}
            <GlassCard variant="medium" className="p-4 border border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-earth-sky" /> Flood Risk
                </span>
                <span className="font-mono text-[10px] text-slate-500">Base {baselineMetrics.floodRisk}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white">{simulatedMetrics.floodRisk}</span>
                <span
                  className={`text-xs font-mono font-bold ${
                    comparison.deltas.floodRisk < 0 ? 'text-earth-emerald' : comparison.deltas.floodRisk > 0 ? 'text-earth-coral' : 'text-slate-400'
                  }`}
                >
                  {comparison.deltas.floodRisk > 0 ? `+${comparison.deltas.floodRisk}` : comparison.deltas.floodRisk}
                </span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-earth-sky rounded-full transition-all" style={{ width: `${simulatedMetrics.floodRisk}%` }} />
              </div>
            </GlassCard>

            {/* Pollution */}
            <GlassCard variant="medium" className="p-4 border border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-earth-aurora" /> Pollution
                </span>
                <span className="font-mono text-[10px] text-slate-500">Base {baselineMetrics.pollution}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white">{simulatedMetrics.pollution}</span>
                <span
                  className={`text-xs font-mono font-bold ${
                    comparison.deltas.pollution < 0 ? 'text-earth-emerald' : comparison.deltas.pollution > 0 ? 'text-earth-coral' : 'text-slate-400'
                  }`}
                >
                  {comparison.deltas.pollution > 0 ? `+${comparison.deltas.pollution}` : comparison.deltas.pollution}
                </span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-earth-aurora rounded-full transition-all" style={{ width: `${simulatedMetrics.pollution}%` }} />
              </div>
            </GlassCard>

            {/* Water Stress */}
            <GlassCard variant="medium" className="p-4 border border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-earth-aqua" /> Water Stress
                </span>
                <span className="font-mono text-[10px] text-slate-500">Base {baselineMetrics.waterStress}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-white">{simulatedMetrics.waterStress}</span>
                <span
                  className={`text-xs font-mono font-bold ${
                    comparison.deltas.waterStress < 0 ? 'text-earth-emerald' : comparison.deltas.waterStress > 0 ? 'text-earth-coral' : 'text-slate-400'
                  }`}
                >
                  {comparison.deltas.waterStress > 0 ? `+${comparison.deltas.waterStress}` : comparison.deltas.waterStress}
                </span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-earth-aqua rounded-full transition-all" style={{ width: `${simulatedMetrics.waterStress}%` }} />
              </div>
            </GlassCard>
          </div>

          {/* Interactive Biophysical System Response Visualizer */}
          <GlassCard variant="strong" glow="aqua" className="p-5 border border-white/15 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-earth-aqua animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Biophysical Coupling Schematic
                </span>
              </div>
              <GlassBadge tone="aqua" size="sm">
                [COUPLED PHYSICS]
              </GlassBadge>
            </div>

            {/* Microclimate Feedback SVG Canvas */}
            <div className="mt-3 relative rounded-xl bg-slate-950/70 p-4 border border-white/10 overflow-hidden">
              <svg viewBox="0 0 400 160" className="w-full h-36">
                <defs>
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0B2338" />
                    <stop offset="100%" stopColor="#071A2B" />
                  </linearGradient>
                  <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#13354E" />
                    <stop offset="100%" stopColor="#091B29" />
                  </linearGradient>
                  <linearGradient id="coolingWave" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#27C98A" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#18C8C8" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Sky background */}
                <rect x="0" y="0" width="400" height="110" fill="url(#skyGrad)" rx="8" />

                {/* Ground plane */}
                <rect x="0" y="110" width="400" height="50" fill="url(#groundGrad)" rx="4" />

                {/* Evapotranspiration Cooling Waves from Canopy */}
                <path
                  d="M 60 110 Q 80 50, 100 110 Q 120 40, 140 110"
                  fill="url(#coolingWave)"
                  className="transition-all duration-500"
                  opacity={0.3 + Math.max(0, params.treeCoverDelta / 60)}
                />

                {/* Tree Canopy Representation */}
                <g transform="translate(60, 85)" className="transition-all duration-300">
                  <circle cx="20" cy="10" r={16 + params.treeCoverDelta * 0.15} fill="#27C98A" opacity="0.85" />
                  <circle cx="34" cy="14" r={13 + params.treeCoverDelta * 0.12} fill="#75D66A" opacity="0.9" />
                  <rect x="25" y="24" width="4" height="15" fill="#4B382A" rx="1" />
                  <text x="27" y="50" fill="#75D66A" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    Canopy ({params.treeCoverDelta > 0 ? `+${params.treeCoverDelta}%` : `${params.treeCoverDelta}%`})
                  </text>
                </g>

                {/* Urban Built-Up Concrete Representation */}
                <g transform="translate(240, 60)" className="transition-all duration-300">
                  <rect x="10" y={20 - params.urbanizationDelta * 0.2} width="22" height={40 + params.urbanizationDelta * 0.2} fill="#FFD166" opacity="0.75" rx="2" />
                  <rect x="36" y={10 - params.urbanizationDelta * 0.3} width="26" height={50 + params.urbanizationDelta * 0.3} fill="#6C8CFF" opacity="0.65" rx="2" />
                  <text x="35" y="75" fill="#FFD166" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    Urban ({params.urbanizationDelta > 0 ? `+${params.urbanizationDelta}%` : `${params.urbanizationDelta}%`})
                  </text>
                </g>

                {/* Precipitation Rain Vector */}
                {params.rainfallDelta !== 0 && (
                  <g className="transition-all duration-300">
                    <line x1="180" y1="15" x2="175" y2="40" stroke="#4FA8FF" strokeWidth={1 + Math.max(0, params.rainfallDelta / 20)} strokeDasharray="3 3" />
                    <line x1="200" y1="20" x2="195" y2="45" stroke="#4FA8FF" strokeWidth={1 + Math.max(0, params.rainfallDelta / 20)} strokeDasharray="3 3" />
                    <line x1="220" y1="10" x2="215" y2="35" stroke="#4FA8FF" strokeWidth={1 + Math.max(0, params.rainfallDelta / 20)} strokeDasharray="3 3" />
                  </g>
                )}

                {/* Heat Island Thermal Bubble */}
                <circle
                  cx="275"
                  cy="45"
                  r={22 + (simulatedMetrics.heatRisk / 100) * 18}
                  fill="none"
                  stroke="#FF6B6B"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  opacity={0.3 + (simulatedMetrics.heatRisk / 100) * 0.5}
                />

                {/* Coupling Reaction Arrows */}
                <path
                  d="M 120 70 C 170 30, 210 30, 245 65"
                  fill="none"
                  stroke={comparison.deltas.heatRisk <= 0 ? '#27C98A' : '#FF6B6B'}
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <text x="185" y="32" fill="#E2E8F0" fontSize="8" textAnchor="middle" fontFamily="monospace">
                  {comparison.deltas.heatRisk <= 0 ? 'Microclimate Cooling ↓' : 'Thermal Amplification ↑'}
                </text>
              </svg>

              <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-earth-emerald inline-block" /> Vegetative Evapotranspiration
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-earth-coral inline-block" /> Anthropogenic Thermal Mass
                </span>
              </div>
            </div>

            {/* Strategic Policy Recommendation */}
            <div className="mt-4 p-3.5 rounded-xl bg-earth-emerald/10 border border-earth-emerald/25 text-xs text-slate-200">
              <strong className="text-earth-emerald font-bold block mb-0.5">
                Strategic Policy Recommendation:
              </strong>
              {comparison.deltas.environmentalHealth >= 5 ? (
                <span>
                  High-yield resilience intervention confirmed. Prioritizing native canopy (+{params.treeCoverDelta}%) combined with clean efficiency produces compounding returns across both stormwater percolation and microclimate moderation.
                </span>
              ) : comparison.deltas.environmentalHealth <= -5 ? (
                <span className="text-earth-coral">
                  Critical vulnerability warning: current sprawl and traffic vectors trigger severe compound thermal entrapment (+{comparison.deltas.heatRisk} pts heat risk). Compensatory buffer zones are urgently required.
                </span>
              ) : (
                <span>
                  Equilibrium policy variant. Minor local trade-offs observed between runoff retention and thermal storage. Recommend tuning canopy to +25% for optimal return.
                </span>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Save Scenario Dialog Modal */}
      <GlassModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Save Simulation Scenario"
        subtitle="Persist this policy configuration to compare side-by-side with other scenarios"
        maxWidth="md"
      >
        <form onSubmit={handleSaveScenarioSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Scenario Name
            </label>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="e.g. 2030 Eco-Canopy Initiative"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm focus:outline-none focus:border-earth-aqua"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description & Notes
            </label>
            <textarea
              value={scenarioDescription}
              onChange={(e) => setScenarioDescription(e.target.value)}
              placeholder="Brief rationale of the intervention parameters..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white text-sm focus:outline-none focus:border-earth-aqua"
            />
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between">
            <span>Projected Environmental Health:</span>
            <span className="text-earth-emerald font-bold text-sm">
              {simulatedMetrics.environmentalHealth} / 100
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <GlassButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsSaveModalOpen(false)}
            >
              Cancel
            </GlassButton>

            <GlassButton type="submit" variant="emerald" size="sm">
              Save to Scenario Lab
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  );
};
