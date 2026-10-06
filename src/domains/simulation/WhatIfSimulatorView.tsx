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
  Share2 
} from 'lucide-react';
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

  const setParams = (updater: React.SetStateAction<SimulationParameters>) => {
    const next = typeof updater === 'function' ? (updater as (prev: SimulationParameters) => SimulationParameters)(params) : updater;
    setInternalParams(next);
    onParamsChange?.(next);
  };

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  // Compute live simulated metrics based on non-linear coupling models
  const baselineMetrics: SimulationResultMetrics = {
    heatRisk: selectedHotspot.currentMetrics.heatRisk,
    floodRisk: selectedHotspot.currentMetrics.floodRisk,
    pollution: Math.round(selectedHotspot.currentMetrics.pollutionAqi / 3.6), // normalized to 0-100 scale
    waterStress: selectedHotspot.currentMetrics.waterStress,
    environmentalHealth: selectedHotspot.currentMetrics.environmentalHealth,
  };

  const simulatedMetrics = computeSimulationMetrics(params, baselineMetrics);
  const comparison = compareScenarios(simulatedMetrics, baselineMetrics);

  const handleSliderChange = (key: keyof SimulationParameters, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setParams(BASELINE_PARAMETERS);
  };

  // Quick Simulation Presets
  const applyPreset = (presetParams: Partial<SimulationParameters>) => {
    setParams({
      ...BASELINE_PARAMETERS,
      ...presetParams,
    });
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

  const slidersConfig: {
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
      id: 'waterDelta',
      label: 'Water Retention Capacity',
      icon: <Droplets className="w-4 h-4 text-earth-aqua" />,
      min: -50,
      max: 50,
      unit: '%',
      color: 'accent-earth-aqua',
      description: 'Wetland buffers, retention ponds & aquifer percolation wells',
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner: WHAT IF? Title and Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-earth-aqua animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              HERO EXPERIMENTATION LABORATORY • [SIMULATION ENGINE]
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">WHAT IF?</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
            Experiment with possible environmental futures. Modify policy and climate levers to instantly observe coupled microclimate, hydrological, and air quality reactions.
          </p>
        </div>

        {/* Global Hotspot Target selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">TARGET HOTSPOT:</span>
          <select
            value={selectedHotspot.id}
            onChange={(e) => {
              const spot = hotspots.find((h) => h.id === e.target.value);
              if (spot) onSelectHotspot(spot);
            }}
            className="px-3 py-2 rounded-xl glass-panel-2 border border-white/20 text-xs font-bold text-earth-aqua focus:outline-none cursor-pointer"
          >
            {hotspots.map((spot) => (
              <option key={spot.id} value={spot.id} className="bg-slate-900 text-white">
                {spot.name} ({spot.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Preset Buttons */}
      <GlassCard variant="medium" className="p-3.5 border border-white/10 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
          <Zap className="w-4 h-4 text-earth-sun" />
          <span>QUICK EXPERIMENTS:</span>
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
            🌧 Severe Monsoon Flash Surge (+45% Rain)
          </button>

          <button
            onClick={() => applyPreset({ urbanizationDelta: 40, trafficDelta: 35, treeCoverDelta: -15, wasteDelta: 40 })}
            className="px-2.5 py-1 rounded-lg text-xs font-medium glass-panel-1 border border-earth-coral/30 text-earth-coral hover:bg-earth-coral/15 transition-colors"
          >
            🏙 Rapid Unchecked Sprawl (+40% Urban)
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

      {/* Main 2-Column Split: Left Levers vs Right Dynamic Reactive Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 7 Policy Levers (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-wide">
              Environmental Levers & Policy Variables
            </h2>
            <span className="text-xs text-slate-400 font-mono">Real-time Reactive</span>
          </div>

          <div className="space-y-3">
            {slidersConfig.map((item) => {
              const val = params[item.id];
              const isChanged = val !== 0;

              return (
                <GlassCard
                  key={item.id}
                  variant="medium"
                  className={`p-4 border transition-all ${
                    isChanged ? 'border-earth-aqua/30 bg-slate-900/80' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/5">{item.icon}</div>
                      <div>
                        <span className="text-xs font-bold text-white block">{item.label}</span>
                        <span className="text-[11px] text-slate-400 block">{item.description}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-extrabold font-mono px-2 py-0.5 rounded-md ${
                          val > 0
                            ? 'bg-earth-emerald/20 text-earth-emerald'
                            : val < 0
                            ? 'bg-earth-coral/20 text-earth-coral'
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
        </div>

        {/* Right Column: Dynamic Simulation Results & Health Index (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Simulated Composite Health Outcome */}
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
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                SIMULATED OUTCOME
              </span>
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

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="text-xs text-slate-400">Projected Environmental Health</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-extrabold font-mono text-white">
                    {simulatedMetrics.environmentalHealth}
                  </span>
                  <span className="text-sm text-slate-400 font-mono">/ 100</span>
                </div>
              </div>

              {/* Delta relative to baseline */}
              <div className="text-right">
                <div className="text-xs text-slate-400">Net Variance</div>
                <div
                  className={`text-xl font-bold font-mono mt-1 ${
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

            {/* AI Transparent Reasoning Summary */}
            <div className="mt-5 p-3.5 rounded-xl bg-earth-aurora/10 border border-earth-aurora/25 text-xs text-slate-200 leading-relaxed font-sans">
              <div className="flex items-center gap-1.5 font-bold text-earth-aurora mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Coupling Reasoning</span>
              </div>
              "{comparison.aiReasoning}"
            </div>

            {/* Save to Scenarios Button */}
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
                Lab Matrix →
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
                [SIMULATION REACTION]
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

                {/* Evapotranspiration Cooling Waves from Canopy (scale based on treeCoverDelta) */}
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

            {/* Comparative Indicator Delta Bars */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Baseline vs Simulated Variance:</span>
                <span className="text-earth-aqua">Net Health Δ: {comparison.deltas.environmentalHealth > 0 ? `+${comparison.deltas.environmentalHealth}` : comparison.deltas.environmentalHealth} pts</span>
              </div>

              {/* Mini horizontal comparison bars */}
              {[
                { label: 'Heat Risk', base: baselineMetrics.heatRisk, sim: simulatedMetrics.heatRisk, color: 'bg-earth-coral' },
                { label: 'Flood Risk', base: baselineMetrics.floodRisk, sim: simulatedMetrics.floodRisk, color: 'bg-earth-sky' },
                { label: 'Pollution AQI', base: baselineMetrics.pollution, sim: simulatedMetrics.pollution, color: 'bg-earth-aurora' },
                { label: 'Water Stress', base: baselineMetrics.waterStress, sim: simulatedMetrics.waterStress, color: 'bg-earth-aqua' },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="w-24 text-slate-400 truncate">{row.label}</span>
                  <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden flex items-center">
                    <div className={`h-full ${row.color} opacity-40`} style={{ width: `${row.base}%` }} title={`Baseline: ${row.base}`} />
                    <div className={`h-full ${row.color}`} style={{ width: `${Math.abs(row.sim - row.base)}%` }} title={`Simulated: ${row.sim}`} />
                  </div>
                  <span className="w-12 text-right font-bold text-white">{row.sim}</span>
                </div>
              ))}
            </div>

            {/* Actionable Policy Recommendation */}
            <div className="mt-4 p-3 rounded-xl bg-earth-emerald/10 border border-earth-emerald/25 text-xs text-slate-200">
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
