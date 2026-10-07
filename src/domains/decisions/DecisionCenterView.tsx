import React, { useState } from 'react';
import { 
  Target, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  Award, 
  FileText,
  MapPin,
  ArrowRight,
  Sliders,
  Scale
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { EnvironmentalHotspot, DecisionIntervention } from '../../types';

interface DecisionCenterViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToSimulator: () => void;
}

export const DecisionCenterView: React.FC<DecisionCenterViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToSimulator,
}) => {
  const [budgetLimitM, setBudgetLimitM] = useState<number>(50);

  const interventions: DecisionIntervention[] = [
    {
      id: 'INT-01',
      title: 'Urban Riparian Bioswales & Wetland Buffers',
      category: 'nature_based',
      capitalCostM: 14.5,
      annualOpexM: 0.8,
      ecologicalBenefitScore: 92,
      carbonMitigationTonsYr: 42000,
      implementationYears: 2,
      tradeoffRisk: 'Requires land-use zoning reclassification in peri-urban zones.',
      priorityRank: 1,
      verdict: 'HIGHLY_RECOMMENDED',
    },
    {
      id: 'INT-02',
      title: 'High-Albedo Reflective Cool Roofs & Pavements',
      category: 'infrastructure',
      capitalCostM: 22.0,
      annualOpexM: 0.4,
      ecologicalBenefitScore: 84,
      carbonMitigationTonsYr: 28000,
      implementationYears: 3,
      tradeoffRisk: 'Moderate initial upfront procurement costs for commercial rooftops.',
      priorityRank: 2,
      verdict: 'HIGHLY_RECOMMENDED',
    },
    {
      id: 'INT-03',
      title: 'Commercial Solar Microgrids & Heat Pumps',
      category: 'clean_tech',
      capitalCostM: 38.0,
      annualOpexM: 1.2,
      ecologicalBenefitScore: 78,
      carbonMitigationTonsYr: 95000,
      implementationYears: 4,
      tradeoffRisk: 'High capital expenditure; sensitive to grid interconnect delays.',
      priorityRank: 3,
      verdict: 'FEASIBLE',
    },
    {
      id: 'INT-04',
      title: 'Impervious Concrete Development Moratorium',
      category: 'policy',
      capitalCostM: 4.0,
      annualOpexM: 1.5,
      ecologicalBenefitScore: 88,
      carbonMitigationTonsYr: 15000,
      implementationYears: 1,
      tradeoffRisk: 'Short-term commercial construction resistance and legal scrutiny.',
      priorityRank: 4,
      verdict: 'HIGH_TRADE_OFF',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-earth-leaf" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-leaf">
              MODULES 33 & 34 — DECISION CENTER & TRADE-OFF MATRIX
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Environmental Decision Center</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Multi-Criteria Decision Analysis (MCDA). Evaluate capital expenditure vs. ecological benefit, carbon mitigation returns, and unintended biophysical trade-offs.
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
                  ? 'bg-earth-leaf text-[#071A2B] border-earth-leaf font-bold shadow-md shadow-earth-leaf/20'
                  : 'glass-panel-1 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3 inline mr-1" />
              {spot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Decision Prioritization Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interventions.map((item) => (
          <GlassCard key={item.id} variant="strong" glow="emerald" className="p-6 border border-white/15 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-earth-leaf/20 text-earth-leaf font-bold font-mono flex items-center justify-center text-xs border border-earth-leaf/40">
                  #{item.priorityRank}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white leading-snug">{item.title}</h3>
                  <div className="text-[10px] font-mono text-slate-400 capitalize">{item.category.replace('_', ' ')} Intervention</div>
                </div>
              </div>

              <GlassBadge tone={item.verdict === 'HIGHLY_RECOMMENDED' ? 'emerald' : item.verdict === 'FEASIBLE' ? 'aqua' : 'coral'} size="sm">
                {item.verdict.replace('_', ' ')}
              </GlassBadge>
            </div>

            {/* Financial & Ecological Score Matrix */}
            <div className="grid grid-cols-3 gap-2 text-xs font-mono p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <div>
                <span className="text-[10px] text-slate-400 block">CapEx ($M)</span>
                <span className="text-white font-bold">${item.capitalCostM}M</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Ecological Return</span>
                <span className="text-earth-emerald font-bold">{item.ecologicalBenefitScore}/100</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">CO₂ Sequestration</span>
                <span className="text-earth-aqua font-bold">{item.carbonMitigationTonsYr.toLocaleString()} t/yr</span>
              </div>
            </div>

            {/* Tradeoff Warning */}
            <div className="p-2.5 rounded-xl glass-panel-1 border border-white/5 text-[11px] text-slate-300 font-mono flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-earth-sun flex-shrink-0 mt-0.5" />
              <span>{item.tradeoffRisk}</span>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-white/5">
              <span className="text-slate-400">Timeline: {item.implementationYears} Years</span>
              <button
                onClick={onNavigateToSimulator}
                className="text-earth-aqua hover:underline font-semibold flex items-center gap-1"
              >
                <span>Simulate Policy Levers</span> →
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
