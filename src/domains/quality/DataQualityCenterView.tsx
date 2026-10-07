import React, { useState } from 'react';
import { 
  Database, 
  Satellite, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Info,
  Calendar,
  Search
} from 'lucide-react';
import { ShieldCheck, FileCheck, RefreshCw } from '../../components/icons';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { PlanetaryLayerEngine, PlanetaryLayer } from '../../earthmind/PlanetaryLayerEngine';

export const DataQualityCenterView: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const layers = PlanetaryLayerEngine.getAllLayers();

  const filteredLayers = layers.filter((layer) => {
    const matchesCategory = filterCategory === 'all' || layer.category === filterCategory;
    const matchesSearch = layer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          layer.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          layer.sensor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const avgConfidence = Math.round(layers.reduce((acc, l) => acc + l.confidence, 0) / layers.length);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              EARTH OBSERVATION DATA GOVERNANCE & PROVENANCE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Data Quality Center</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Audit spatial resolution, sensor instrumentation, observation revisit intervals, and uncertainty margins across all active Earth observation layers.
          </p>
        </div>

        {/* Global Summary Badge Card */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl glass-panel-2 border border-emerald-500/30 text-right">
            <span className="text-xs font-mono text-slate-400 block">MEAN SENSOR RELIABILITY</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{avgConfidence}% CALIBRATED</span>
          </div>
        </div>
      </div>

      {/* Control Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by sensor, satellite, or layer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl glass-panel-1 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-earth-aqua/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['all', 'Atmospheric', 'Terrestrial', 'Hydrological', 'Anthropogenic', 'Ecological', 'Climate'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 text-xs rounded-xl font-mono whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-earth-aqua text-black font-semibold'
                  : 'text-slate-400 hover:text-white glass-panel-1'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Quality Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLayers.map((layer) => (
          <GlassCard
            key={layer.id}
            variant="medium"
            className="p-5 space-y-4 hover:border-earth-aqua/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <GlassBadge tone="aqua">{layer.category}</GlassBadge>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{layer.confidence}% ACCURACY</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {layer.name}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {layer.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Satellite Source:</span>
                <span className="text-slate-200 font-mono text-right">{layer.source.split('/')[0]}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Sensor Instrument:</span>
                <span className="text-slate-200 font-mono">{layer.sensor}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Spatial Resolution:</span>
                <span className="text-earth-aqua font-mono">{layer.resolution}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Revisit Cadence:</span>
                <span className="text-slate-200 font-mono">{layer.revisitFrequency}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Last Calibrated:</span>
                <span className="text-slate-200 font-mono">{layer.date}</span>
              </div>
            </div>

            {/* Visual Legend Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>{layer.legend.min} {layer.legend.unit}</span>
                <span>{layer.legend.max} {layer.legend.unit}</span>
              </div>
              <div
                className="h-2 rounded-full w-full"
                style={{ background: layer.legend.gradientCss }}
              />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
