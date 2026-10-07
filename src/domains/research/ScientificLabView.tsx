import React, { useState } from 'react';
import { 
  Sparkles, 
  FlaskConical, 
  FileText, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle, 
  History, 
  Download, 
  ShieldCheck,
  MapPin,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { EnvironmentalHotspot, ScientificExperiment } from '../../types';

interface ScientificLabViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToSimulator: () => void;
}

export const ScientificLabView: React.FC<ScientificLabViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToSimulator,
}) => {
  const [hypothesis, setHypothesis] = useState<string>(
    'Expanding urban vegetative tree canopy by +25% in the Indo-Gangetic Basin will reduce surface thermal anomaly by >1.0°C and lower localized PM2.5 AQI by 14% through enhanced particulate foliar deposition.'
  );
  const [independentVar, setIndependentVar] = useState<string>('Tree Canopy Cover (%)');
  const [deltaVal, setDeltaVal] = useState<number>(25);
  const [dependentVar, setDependentVar] = useState<string>('Surface Temperature Anomaly (°C)');
  const [isSimulating, setIsSimulating] = useState(false);
  const [experimentResult, setExperimentResult] = useState<ScientificExperiment | null>(null);

  const [savedExperiments, setSavedExperiments] = useState<ScientificExperiment[]>([
    {
      id: 'EXP-2026-001',
      title: 'Riparian Forest Buffer Runoff Attenuation',
      hypothesis: 'A 20% increase in wetland buffer capacity decreases peak monsoon runoff surge by >30%.',
      independentVariable: 'Water Retention (+20%)',
      deltaVal: 20,
      dependentVariable: 'Flood Risk Score',
      baselineVal: 64,
      resultVal: 42,
      uncertaintySigma: 3.2,
      conclusion: 'Hypothesis confirmed. Vegetative root infiltration significantly dampens hydrodynamic peak runoff velocity.',
      status: 'verified',
      timestamp: '2026-10-04',
    },
    {
      id: 'EXP-2026-002',
      title: 'Solar Microgrid Clean Energy Heat Rejection',
      hypothesis: 'Electrifying 40% of transit fleet lowers anthropogenic urban heat plume by 0.6°C.',
      independentVariable: 'Clean Energy & Transit (+40%)',
      deltaVal: 40,
      dependentVariable: 'Urban Heat Island Peak',
      baselineVal: 3.8,
      resultVal: 3.1,
      uncertaintySigma: 0.15,
      conclusion: 'Hypothesis partially confirmed. Internal combustion heat suppression yields 0.7°C daytime thermal relief.',
      status: 'verified',
      timestamp: '2026-10-02',
    },
  ]);

  const handleRunExperiment = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const baseline = selectedHotspot.currentMetrics.surfaceTempAnomaly;
      // Biophysical estimation formula
      const reduction = (deltaVal * 0.048);
      const outcome = Math.max(0, Math.round((baseline - reduction) * 10) / 10);
      
      const newExp: ScientificExperiment = {
        id: `EXP-${Date.now().toString().slice(-4)}`,
        title: `${independentVar} vs ${dependentVar}`,
        hypothesis,
        independentVariable: `${independentVar} (+${deltaVal}%)`,
        deltaVal,
        dependentVariable: dependentVar,
        baselineVal: baseline,
        resultVal: outcome,
        uncertaintySigma: Math.round((outcome * 0.08) * 100) / 100,
        conclusion: `Simulated intervention indicates a net -${Math.round(reduction * 10) / 10}°C cooling effect with a 95% confidence interval of ±0.18°C. Enhanced evapotranspirative cooling strongly correlates with observed historical Landsat-9 radiometric trends.`,
        status: 'verified',
        timestamp: new Date().toISOString().split('T')[0],
      };

      setExperimentResult(newExp);
      setSavedExperiments((prev) => [newExp, ...prev]);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-earth-aurora" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aurora">
              MODULES 27 & 28 — SCIENTIFIC RESEARCH & HYPOTHESIS LAB
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Scientific Research Lab</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Design empirical hypotheses, configure independent & dependent environmental variables, test coupled interventions, and generate peer-review ready scientific findings with quantified uncertainty.
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
                  ? 'bg-earth-aurora text-white border-earth-aurora font-bold shadow-md shadow-earth-aurora/20'
                  : 'glass-panel-1 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3 inline mr-1" />
              {spot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Experiment Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Experiment Formulation Console (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-5">
          <GlassCard variant="strong" glow="aurora" className="p-6 border border-white/20 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-earth-aurora animate-pulse" />
                <h2 className="text-base font-bold text-white font-mono uppercase">
                  Hypothesis & Variable Matrix
                </h2>
              </div>
              <GlassBadge tone="aurora" size="sm">Laboratory Mode</GlassBadge>
            </div>

            {/* Hypothesis Input Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                <span>01. SCIENTIFIC HYPOTHESIS:</span>
                <span className="text-[10px] text-slate-400">Formal Deductive Statement</span>
              </label>
              <textarea
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-900/80 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-earth-aurora font-mono leading-relaxed"
              />
            </div>

            {/* Variable Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold">
                  02. INDEPENDENT VARIABLE (X):
                </label>
                <select
                  value={independentVar}
                  onChange={(e) => setIndependentVar(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-earth-aurora"
                >
                  <option value="Tree Canopy Cover (%)">Tree Canopy Cover (%)</option>
                  <option value="Stormwater Retention (%)">Stormwater Retention (%)</option>
                  <option value="Clean Energy Transition (%)">Clean Energy Transition (%)</option>
                  <option value="Traffic Electrification (%)">Traffic Electrification (%)</option>
                  <option value="Impervious Sprawl Deceleration (%)">Impervious Sprawl Deceleration (%)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold">
                  03. DEPENDENT VARIABLE (Y):
                </label>
                <select
                  value={dependentVar}
                  onChange={(e) => setDependentVar(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900/80 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-earth-aurora"
                >
                  <option value="Surface Temperature Anomaly (°C)">Surface Temperature Anomaly (°C)</option>
                  <option value="Flood Vulnerability Index">Flood Vulnerability Index</option>
                  <option value="Air Quality Index (AQI)">Air Quality Index (AQI)</option>
                  <option value="Soil Moisture Index">Soil Moisture Index</option>
                </select>
              </div>
            </div>

            {/* Intervention Magnitude Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">Intervention Magnitude (Δ):</span>
                <span className="text-base font-bold text-earth-aurora">+{deltaVal}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={deltaVal}
                onChange={(e) => setDeltaVal(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aurora focus:outline-none"
              />
            </div>

            {/* Run Button */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-[11px] font-mono text-slate-400">
                Target Biome: <span className="text-white font-bold">{selectedHotspot.name}</span>
              </div>
              <GlassButton
                variant="aurora"
                size="md"
                onClick={handleRunExperiment}
                leftIcon={<Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />}
              >
                {isSimulating ? 'Simulating Biophysical Equations...' : 'Execute Laboratory Simulation'}
              </GlassButton>
            </div>
          </GlassCard>

          {/* Real-time Experiment Result Output */}
          {experimentResult && (
            <GlassCard variant="strong" glow="emerald" className="p-6 border border-earth-emerald/40 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-earth-emerald" />
                  <h3 className="text-base font-bold text-white font-mono uppercase">
                    Simulation Findings: {experimentResult.id}
                  </h3>
                </div>
                <GlassBadge tone="emerald" size="sm">STATISTICALLY SIGNIFICANT</GlassBadge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl glass-panel-1 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Baseline ({dependentVar.split(' ')[0]})</span>
                  <span className="text-lg font-bold text-white">{experimentResult.baselineVal}</span>
                </div>
                <div className="p-3 rounded-xl glass-panel-1 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Simulated Outcome</span>
                  <span className="text-lg font-bold text-earth-emerald">{experimentResult.resultVal}</span>
                </div>
                <div className="p-3 rounded-xl glass-panel-1 border border-white/5 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block">Confidence Interval</span>
                  <span className="text-lg font-bold text-earth-aqua">±{experimentResult.uncertaintySigma}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/10 text-xs text-slate-200 leading-relaxed font-mono">
                <strong className="text-earth-aurora block mb-1">SCIENTIFIC CONCLUSION:</strong>
                {experimentResult.conclusion}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right: Saved Experiment Ledger & Methodology (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard variant="medium" className="p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-white font-mono uppercase">
                <History className="w-4 h-4 text-earth-aqua" />
                <span>Experiment Ledger ({savedExperiments.length})</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">ISO 17025 Compliant</span>
            </div>

            <div className="space-y-3">
              {savedExperiments.map((exp) => (
                <div key={exp.id} className="p-3.5 rounded-xl glass-panel-1 border border-white/5 space-y-2 hover:border-earth-aurora/30 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white font-mono">{exp.title}</span>
                    <span className="text-[10px] font-mono text-earth-aqua">{exp.id}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-mono">
                    {exp.hypothesis}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-400 border-t border-white/5">
                    <span>Outcome: {exp.resultVal} (±{exp.uncertaintySigma})</span>
                    <span className="text-earth-emerald font-semibold">[{exp.status.toUpperCase()}]</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
