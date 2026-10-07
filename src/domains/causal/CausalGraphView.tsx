import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  RotateCcw, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  Flame,
  Droplets,
  Trees,
  Building2,
  Zap,
  Wind,
  MapPin
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { EnvironmentalHotspot, CausalNode, CausalEdge } from '../../types';

interface CausalGraphViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToSimulator: () => void;
}

export const CausalGraphView: React.FC<CausalGraphViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToSimulator,
}) => {
  // Initial Nodes in the biophysical causal DAG
  const [nodes, setNodes] = useState<CausalNode[]>([
    {
      id: 'urbanization',
      label: 'Impervious Concrete Sprawl',
      category: 'anthropogenic',
      value: 25,
      baseline: 0,
      unit: '% delta',
      description: 'Paved surfaces replacing natural vegetative soils.',
    },
    {
      id: 'vegetation',
      label: 'Tree Canopy Loss',
      category: 'biophysical',
      value: -18,
      baseline: 0,
      unit: '% delta',
      description: 'Foliar canopy removal lowering localized evapotranspiration.',
    },
    {
      id: 'surface_temp',
      label: 'Surface Radiative Temperature',
      category: 'climatic',
      value: 2.1,
      baseline: 0,
      unit: '°C anomaly',
      description: 'Daytime sensible heat storage in dark asphalt and concrete.',
    },
    {
      id: 'cooling_demand',
      label: 'HVAC Cooling Energy Demand',
      category: 'impact',
      value: 28,
      baseline: 0,
      unit: '% surge',
      description: 'Grid air conditioning power draw during peak diurnal heat.',
    },
    {
      id: 'waste_heat',
      label: 'Anthropogenic Condenser Heat',
      category: 'anthropogenic',
      value: 19,
      baseline: 0,
      unit: '% surge',
      description: 'Compressor exhaust heat dumped directly into street canyon.',
    },
    {
      id: 'runoff',
      label: 'Surface Runoff Coefficient',
      category: 'biophysical',
      value: 34,
      baseline: 0,
      unit: '% delta',
      description: 'Precipitation unable to infiltrate into ground aquifers.',
    },
    {
      id: 'flood_risk',
      label: 'Monsoon Flash Flood Vulnerability',
      category: 'impact',
      value: 31,
      baseline: 0,
      unit: 'pts risk',
      description: 'Hydrodynamic peak inundation during intense downpours.',
    },
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>('urbanization');
  const [activeTab, setActiveTab] = useState<'graph' | 'feedback' | 'correlation'>('graph');

  // Interactive node perturbation: changes cascade to downstream connected nodes
  const handlePerturbNode = (id: string, delta: number) => {
    setNodes((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, value: Math.round((n.value + delta) * 10) / 10 } : n));
      
      // Propagate downstream if urbanization was changed
      if (id === 'urbanization') {
        return next.map((n) => {
          if (n.id === 'vegetation') return { ...n, value: Math.round((-0.7 * delta + n.value) * 10) / 10 };
          if (n.id === 'surface_temp') return { ...n, value: Math.round((0.08 * delta + n.value) * 10) / 10 };
          if (n.id === 'runoff') return { ...n, value: Math.round((0.9 * delta + n.value) * 10) / 10 };
          if (n.id === 'flood_risk') return { ...n, value: Math.round((0.8 * delta + n.value) * 10) / 10 };
          return n;
        });
      }
      return next;
    });
  };

  const handleReset = () => {
    setNodes([
      { id: 'urbanization', label: 'Impervious Concrete Sprawl', category: 'anthropogenic', value: 25, baseline: 0, unit: '% delta', description: 'Paved surfaces replacing natural vegetative soils.' },
      { id: 'vegetation', label: 'Tree Canopy Loss', category: 'biophysical', value: -18, baseline: 0, unit: '% delta', description: 'Foliar canopy removal lowering localized evapotranspiration.' },
      { id: 'surface_temp', label: 'Surface Radiative Temperature', category: 'climatic', value: 2.1, baseline: 0, unit: '°C anomaly', description: 'Daytime sensible heat storage in dark asphalt and concrete.' },
      { id: 'cooling_demand', label: 'HVAC Cooling Energy Demand', category: 'impact', value: 28, baseline: 0, unit: '% surge', description: 'Grid air conditioning power draw during peak diurnal heat.' },
      { id: 'waste_heat', label: 'Anthropogenic Condenser Heat', category: 'anthropogenic', value: 19, baseline: 0, unit: '% surge', description: 'Compressor exhaust heat dumped directly into street canyon.' },
      { id: 'runoff', label: 'Surface Runoff Coefficient', category: 'biophysical', value: 34, baseline: 0, unit: '% delta', description: 'Precipitation unable to infiltrate into ground aquifers.' },
      { id: 'flood_risk', label: 'Monsoon Flash Flood Vulnerability', category: 'impact', value: 31, baseline: 0, unit: 'pts risk', description: 'Hydrodynamic peak inundation during intense downpours.' },
    ]);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              FEATURE 53 • ENVIRONMENTAL CAUSAL GRAPH & FEEDBACK ENGINE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Environmental Causal Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Uncover the physical mechanisms governing ecological changes. Distinguish true causal drivers from spurious correlations and inspect biophysical runaway feedback loops.
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
                  ? 'bg-earth-aqua text-[#071A2B] border-earth-aqua font-bold shadow-md shadow-earth-aqua/20'
                  : 'glass-panel-1 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3 inline mr-1" />
              {spot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'graph' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cause → Effect DAG Flow
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'feedback' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Feedback Loop Detector (2 Loops)
          </button>
          <button
            onClick={() => setActiveTab('correlation')}
            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'correlation' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Correlation vs Causation Matrix
          </button>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl glass-panel-1 hover:bg-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5 border border-white/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Perturbations</span>
        </button>
      </div>

      {/* Tab 1: Interactive Cause -> Effect DAG Network */}
      {activeTab === 'graph' && (
        <div className="space-y-6">
          {/* Visual Step-by-Step Causal Cascade Chain */}
          <GlassCard variant="strong" className="p-6 border border-white/15 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-earth-aqua" />
                  Cascading Impact Pathway: Urban Thermal & Hydro Chain
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Click "+10" or "-10" on any node to perturb the causal shockwave downstream.
                </p>
              </div>
              <GlassBadge tone="aqua" size="sm">STRUCTURAL EQUATION MODEL (SEM)</GlassBadge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {nodes.map((node, index) => {
                const isSelected = node.id === selectedNodeId;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? 'glass-panel-3 border-earth-aqua shadow-lg shadow-earth-aqua/10 ring-1 ring-earth-aqua'
                        : 'glass-panel-1 border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-slate-400">Node {index + 1}</span>
                        <GlassBadge
                          tone={node.category === 'anthropogenic' ? 'sun' : node.category === 'climatic' ? 'coral' : 'aqua'}
                          size="sm"
                        >
                          {node.category}
                        </GlassBadge>
                      </div>

                      <h4 className="text-xs font-bold text-white leading-tight">{node.label}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{node.description}</p>
                    </div>

                    <div className="pt-3 border-t border-white/10 mt-3 space-y-2">
                      <div className="flex items-baseline justify-between font-mono">
                        <span className="text-xs text-slate-400">Active Value:</span>
                        <span className={`text-base font-bold ${
                          node.value > 0 ? 'text-amber-400' : node.value < 0 ? 'text-rose-400' : 'text-slate-200'
                        }`}>
                          {node.value > 0 ? `+${node.value}` : node.value} {node.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePerturbNode(node.id, 10);
                          }}
                          className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] font-bold"
                        >
                          +10
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePerturbNode(node.id, -10);
                          }}
                          className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] font-bold"
                        >
                          -10
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Node Inspector Deep Dive */}
          <GlassCard variant="medium" className="p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-earth-aqua/10 text-earth-aqua border border-earth-aqua/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedNode.label}</h4>
                  <div className="text-xs font-mono text-slate-400">
                    Category: {selectedNode.category.toUpperCase()} • Current State: {selectedNode.value} {selectedNode.unit}
                  </div>
                </div>
              </div>

              <button
                onClick={onNavigateToSimulator}
                className="px-4 py-2 rounded-xl bg-earth-aqua text-[#071A2B] font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-earth-aqua/90 transition-all"
              >
                <span>Counterfactual Simulation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedNode.description} In the Indo-Gangetic & coastal plains, this node possesses a high path coefficient (β = 0.78), meaning small perturbations trigger rapid non-linear magnification in peak heatwave mortality and drainage choke points.
            </p>
          </GlassCard>
        </div>
      )}

      {/* Tab 2: Feedback Loop Detector */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <GlassCard variant="medium" className="p-5 border border-rose-500/30 bg-rose-500/5 space-y-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white">
                Feedback Loop #1: Urban Thermal Runaway (Positive / Destabilizing)
              </h3>
            </div>
            <div className="font-mono text-xs text-rose-300 p-3 rounded-xl bg-black/30 border border-white/10 space-y-1">
              <div>Surface Temp ↑ ➔ HVAC AC Cooling Demand ↑ ➔ Condenser Waste Heat Dump ↑ ➔ Street Air Temp ↑ (Loop Closes)</div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every +1.0°C rise in surface temperature drives a +12% surge in air conditioning condenser exhaust heat. Without reflective cool roofs and night ventilation corridors, this heat gets trapped in street canyons, creating an amplifying diurnal feedback cycle.
            </p>
          </GlassCard>

          <GlassCard variant="medium" className="p-5 border border-emerald-500/30 bg-emerald-500/5 space-y-3">
            <div className="flex items-center gap-2">
              <Trees className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Feedback Loop #2: Vegetative Transpiration Cushion (Negative / Stabilizing)
              </h3>
            </div>
            <div className="font-mono text-xs text-emerald-300 p-3 rounded-xl bg-black/30 border border-white/10 space-y-1">
              <div>Canopy Cover ↑ ➔ Latent Heat of Evapotranspiration ↑ ➔ Surface Temp ↓ ➔ Vapor Pressure Deficit Normalized</div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Native tree canopies transpire soil moisture into the boundary layer, converting sensible heat into latent heat. This dampens microclimate temperature spikes naturally without grid energy consumption.
            </p>
          </GlassCard>
        </div>
      )}

      {/* Tab 3: Correlation vs Causation Inspector */}
      {activeTab === 'correlation' && (
        <GlassCard variant="medium" className="p-5 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white">
            Empirical Correlation vs Causal Path Coefficient (β)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Raw observational data often exhibits confounding factors. By employing structural equation modeling (SEM) and do-calculus, EARTHMIND isolates genuine physical causation from coincident seasonal correlations.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-2.5">Variable Pair</th>
                  <th className="py-2.5">Pearson Correlation (r)</th>
                  <th className="py-2.5">Causal Path (β)</th>
                  <th className="py-2.5">Causal Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                <tr>
                  <td className="py-2.5 font-bold">Impervious Surface ➔ Peak Runoff</td>
                  <td className="py-2.5 text-earth-aqua">+0.94</td>
                  <td className="py-2.5 text-earth-emerald font-bold">+0.88</td>
                  <td className="py-2.5"><GlassBadge tone="emerald" size="sm">STRONG DIRECT CAUSAL</GlassBadge></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">Vegetation Loss ➔ Surface Heat</td>
                  <td className="py-2.5 text-earth-aqua">-0.87</td>
                  <td className="py-2.5 text-earth-emerald font-bold">-0.79</td>
                  <td className="py-2.5"><GlassBadge tone="emerald" size="sm">STRONG DIRECT CAUSAL</GlassBadge></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">Ice Cream Sales ➔ Wildfire Risk</td>
                  <td className="py-2.5 text-amber-400">+0.82</td>
                  <td className="py-2.5 text-slate-400">0.00</td>
                  <td className="py-2.5"><GlassBadge tone="neutral" size="sm">SPURIOUS (Confounded by Summer Temp)</GlassBadge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
