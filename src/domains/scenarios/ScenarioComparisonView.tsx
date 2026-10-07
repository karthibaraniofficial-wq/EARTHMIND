import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Sliders, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { SavedScenario, SimulationResultMetrics } from '../../types';

interface ScenarioComparisonViewProps {
  scenarios: SavedScenario[];
  onDeleteScenario: (id: string) => void;
  onLoadScenarioIntoSimulator: (scenario: SavedScenario) => void;
  onNavigateToSimulator: () => void;
}

export const ScenarioComparisonView: React.FC<ScenarioComparisonViewProps> = ({
  scenarios,
  onDeleteScenario,
  onLoadScenarioIntoSimulator,
  onNavigateToSimulator,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    scenarios.slice(0, 4).map((s) => s.id)
  );

  const baseline = scenarios.find((s) => s.tag === 'Baseline') || scenarios[0];
  const comparedScenarios = scenarios.filter((s) => selectedIds.includes(s.id));

  const toggleSelectScenario = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const getMetricDelta = (val: number, baseVal: number, reverse: boolean = true) => {
    const delta = val - baseVal;
    if (delta === 0) return { delta: 0, color: 'text-slate-400', isGood: null };
    const isGood = reverse ? delta < 0 : delta > 0;
    return {
      delta,
      color: isGood ? 'text-earth-emerald' : 'text-earth-coral',
      isGood,
    };
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              MULTI-SCENARIO SYNTHESIS MATRIX
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Scenario Comparison Lab</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Examine side-by-side divergences across climate policy pathways, stress tests, and active urban interventions against verified baselines.
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="md"
          onClick={onNavigateToSimulator}
          leftIcon={<Sliders className="w-4 h-4" />}
        >
          Create New Scenario
        </GlassButton>
      </div>

      {/* Scenario Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        <span className="text-xs font-mono text-slate-400 flex-shrink-0">SELECT TO COMPARE (MAX 4):</span>
        {scenarios.map((sc) => {
          const isSelected = selectedIds.includes(sc.id);
          return (
            <button
              key={sc.id}
              onClick={() => toggleSelectScenario(sc.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-earth-aqua/15 text-white border-earth-aqua shadow-sm'
                  : 'glass-panel-1 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-earth-aqua' : 'bg-slate-600'}`} />
              <span>{sc.name}</span>
              <span className="text-[10px] font-mono text-earth-emerald font-bold">
                {sc.metrics.environmentalHealth}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Side-by-Side Comparison Table Matrix */}
      <GlassCard variant="strong" glow="aqua" className="p-6 border border-white/20 shadow-2xl overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-white/10 font-mono text-xs text-slate-400">
            <div className="col-span-4 uppercase tracking-wider">INDICATOR / METRIC</div>
            {comparedScenarios.map((sc) => (
              <div key={sc.id} className="col-span-2 text-center">
                <div className="font-bold text-white text-sm truncate" title={sc.name}>{sc.name}</div>
                <div className="text-[10px] text-earth-aqua mt-0.5">{sc.tag}</div>
              </div>
            ))}
          </div>

          {/* Row: Composite Health Score (Primary) */}
          <div className="grid grid-cols-12 gap-4 py-4 border-b border-white/10 items-center bg-white/5 rounded-xl px-2 my-2">
            <div className="col-span-4">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-earth-sun" /> Environmental Health Score
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Composite 0 – 100 resilience rating</span>
            </div>
            {comparedScenarios.map((sc) => {
              const diff = sc.metrics.environmentalHealth - baseline.metrics.environmentalHealth;
              return (
                <div key={sc.id} className="col-span-2 text-center">
                  <div className="text-2xl font-extrabold font-mono text-earth-emerald">
                    {sc.metrics.environmentalHealth}
                  </div>
                  {sc.id !== baseline.id && (
                    <div className={`text-[10px] font-mono font-bold ${diff >= 0 ? 'text-earth-emerald' : 'text-earth-coral'}`}>
                      {diff >= 0 ? `+${diff}` : diff} vs Base
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Row: Heat Island Risk */}
          <div className="grid grid-cols-12 gap-4 py-3.5 border-b border-white/5 items-center px-2">
            <div className="col-span-4">
              <span className="font-semibold text-white text-xs block">Heat Island Risk Index</span>
              <span className="text-[10px] text-slate-400">Thermal absorption & cooling deficit (lower is better)</span>
            </div>
            {comparedScenarios.map((sc) => {
              const { delta, color } = getMetricDelta(sc.metrics.heatRisk, baseline.metrics.heatRisk, true);
              return (
                <div key={sc.id} className="col-span-2 text-center font-mono">
                  <div className="text-base font-bold text-white">{sc.metrics.heatRisk}</div>
                  {sc.id !== baseline.id && (
                    <div className={`text-[10px] font-semibold ${color}`}>
                      {delta > 0 ? `+${delta}` : delta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Row: Flood Vulnerability */}
          <div className="grid grid-cols-12 gap-4 py-3.5 border-b border-white/5 items-center px-2">
            <div className="col-span-4">
              <span className="font-semibold text-white text-xs block">Flood Vulnerability Score</span>
              <span className="text-[10px] text-slate-400">Peak runoff surge & soil saturation (lower is better)</span>
            </div>
            {comparedScenarios.map((sc) => {
              const { delta, color } = getMetricDelta(sc.metrics.floodRisk, baseline.metrics.floodRisk, true);
              return (
                <div key={sc.id} className="col-span-2 text-center font-mono">
                  <div className="text-base font-bold text-white">{sc.metrics.floodRisk}</div>
                  {sc.id !== baseline.id && (
                    <div className={`text-[10px] font-semibold ${color}`}>
                      {delta > 0 ? `+${delta}` : delta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Row: Air Pollution Index */}
          <div className="grid grid-cols-12 gap-4 py-3.5 border-b border-white/5 items-center px-2">
            <div className="col-span-4">
              <span className="font-semibold text-white text-xs block">Air Pollution Stress Index</span>
              <span className="text-[10px] text-slate-400">Fine particulate (PM2.5) & NO2 entrapment (lower is better)</span>
            </div>
            {comparedScenarios.map((sc) => {
              const { delta, color } = getMetricDelta(sc.metrics.pollution, baseline.metrics.pollution, true);
              return (
                <div key={sc.id} className="col-span-2 text-center font-mono">
                  <div className="text-base font-bold text-white">{sc.metrics.pollution}</div>
                  {sc.id !== baseline.id && (
                    <div className={`text-[10px] font-semibold ${color}`}>
                      {delta > 0 ? `+${delta}` : delta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Row: Water Stress */}
          <div className="grid grid-cols-12 gap-4 py-3.5 border-b border-white/5 items-center px-2">
            <div className="col-span-4">
              <span className="font-semibold text-white text-xs block">Aquifer Water Stress</span>
              <span className="text-[10px] text-slate-400">Watershed deficit & recharge capability (lower is better)</span>
            </div>
            {comparedScenarios.map((sc) => {
              const { delta, color } = getMetricDelta(sc.metrics.waterStress, baseline.metrics.waterStress, true);
              return (
                <div key={sc.id} className="col-span-2 text-center font-mono">
                  <div className="text-base font-bold text-white">{sc.metrics.waterStress}</div>
                  {sc.id !== baseline.id && (
                    <div className={`text-[10px] font-semibold ${color}`}>
                      {delta > 0 ? `+${delta}` : delta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-12 gap-4 pt-5 items-center px-2">
            <div className="col-span-4 text-xs font-mono text-slate-400">SCENARIO ACTIONS</div>
            {comparedScenarios.map((sc) => (
              <div key={sc.id} className="col-span-2 flex flex-col gap-1.5 items-center">
                <button
                  onClick={() => onLoadScenarioIntoSimulator(sc)}
                  className="w-full py-1.5 px-2 rounded-lg bg-earth-aqua/15 text-earth-aqua border border-earth-aqua/30 text-xs font-semibold hover:bg-earth-aqua/25 transition-all text-center"
                >
                  Load in Simulator
                </button>

                {sc.tag === 'Custom' && (
                  <button
                    onClick={() => onDeleteScenario(sc.id)}
                    className="text-[11px] text-slate-400 hover:text-earth-coral transition-colors flex items-center gap-1 mt-1"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Synthesis Takeaway Card */}
      <GlassCard variant="medium" className="p-5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-earth-emerald uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Optimal Pathway Recommendation</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Among evaluated pathways, the <strong className="text-white">Green City 2030</strong> intervention delivers the most favorable resilience profile, cutting composite risk by 15 points through complementary urban canopy (+35%) and decentralized water retention (+25%).
          </p>
        </div>

        <GlassBadge tone="emerald" size="md">
          Recommended Intervention
        </GlassBadge>
      </GlassCard>
    </div>
  );
};
