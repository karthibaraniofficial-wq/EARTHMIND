import React from 'react';
import { 
  HeartHandshake, 
  Flame, 
  Droplets, 
  Trees, 
  TrendingUp, 
  Sparkles, 
  MapPin, 
  Sliders, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Play 
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassMetric } from '../../components/glass/GlassMetric';
import { EnvironmentalHotspot, SavedScenario } from '../../types';

interface OverviewDashboardViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  activeScenario: SavedScenario;
  onNavigate: (view: string) => void;
  onStartGuidedDemo: () => void;
}

export const OverviewDashboardView: React.FC<OverviewDashboardViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  activeScenario,
  onNavigate,
  onStartGuidedDemo,
}) => {
  const m = selectedHotspot.currentMetrics;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Top Banner: Hero Welcome with Active Hotspot context */}
      <GlassCard variant="highlight" glow="aqua" className="p-6 border border-earth-aqua/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-earth-emerald animate-ping" />
              <GlassBadge tone="aqua" size="sm">
                PLANETARY DIGITAL TWIN MONITORING
              </GlassBadge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Observing {selectedHotspot.name}, {selectedHotspot.country}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {selectedHotspot.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <GlassButton
              variant="primary"
              size="md"
              onClick={() => onNavigate('simulator')}
              leftIcon={<Sliders className="w-4 h-4" />}
            >
              Launch WHAT-IF? Simulator
            </GlassButton>

            <GlassButton
              variant="emerald"
              size="md"
              onClick={onStartGuidedDemo}
              leftIcon={<Play className="w-4 h-4" />}
            >
              Start Guided Tour
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* 4 Core Platform Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassMetric
          label="Environmental Health"
          value={m.environmentalHealth}
          unit="/100"
          delta={2.1}
          deltaLabel="vs regional avg"
          statusTone="emerald"
          icon={<HeartHandshake className="w-4 h-4 text-earth-emerald" />}
          subtext="Composite Ecological Resilience"
        />

        <GlassMetric
          label="Surface Heat Risk"
          value={m.heatRisk}
          unit="/100"
          delta={m.surfaceTempAnomaly}
          deltaLabel="°C thermal anomaly"
          reversePolarity={true}
          statusTone="coral"
          icon={<Flame className="w-4 h-4 text-earth-coral" />}
          subtext="Urban microclimate mass"
        />

        <GlassMetric
          label="Water Resilience"
          value={100 - m.waterStress}
          unit="%"
          delta={-4.5}
          deltaLabel="seasonal deficit"
          statusTone="aqua"
          icon={<Droplets className="w-4 h-4 text-earth-aqua" />}
          subtext="Aquifer recharge margin"
        />

        <GlassMetric
          label="Vegetative Canopy Cover"
          value={m.greenCoverPct}
          unit="%"
          delta={-12.4}
          deltaLabel="since 2018"
          statusTone="sun"
          icon={<Trees className="w-4 h-4 text-earth-leaf" />}
          subtext="Urban sprawl: +42.1%"
        />
      </div>

      {/* Middle Row: Trend Analysis Graph + Monitored Hotspot Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Environmental Trend 2010 - 2026 (lg:col-span-7) */}
        <div className="lg:col-span-7">
          <GlassCard variant="medium" className="p-6 border border-white/10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white">Historical Multi-Decadal Trajectory</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Vegetation vs Urbanization Expansion (2010 – 2026)</p>
                </div>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('memory')}
                >
                  Scrub Timeline →
                </GlassButton>
              </div>

              {/* Responsive SVG Chart */}
              <div className="mt-6 h-56 w-full flex flex-col justify-end">
                <div className="relative h-44 w-full flex items-end justify-between gap-2 px-2 pb-6 border-b border-white/10">
                  {/* Grid lines */}
                  <div className="absolute inset-x-0 top-0 border-b border-white/5 text-[9px] font-mono text-slate-600 pl-1">80%</div>
                  <div className="absolute inset-x-0 top-1/2 border-b border-white/5 text-[9px] font-mono text-slate-600 pl-1">40%</div>

                  {selectedHotspot.history.map((record, index) => {
                    const greenHeight = (record.greenCoverPct / 100) * 140;
                    const urbanHeight = (record.urbanCoverPct / 100) * 140;

                    return (
                      <div key={record.year} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Hover Tooltip */}
                        <div className="absolute -top-12 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity glass-panel-3 px-2 py-1 rounded text-[10px] font-mono text-white whitespace-nowrap">
                          {record.year}: Green {record.greenCoverPct}% | Urban {record.urbanCoverPct}%
                        </div>

                        <div className="w-full flex items-end justify-center gap-1">
                          {/* Green Bar */}
                          <div
                            className="w-2 sm:w-3.5 bg-earth-emerald rounded-t transition-all group-hover:bg-earth-leaf"
                            style={{ height: `${greenHeight}px` }}
                          />
                          {/* Urban Bar */}
                          <div
                            className="w-2 sm:w-3.5 bg-earth-sun rounded-t transition-all group-hover:bg-amber-300"
                            style={{ height: `${urbanHeight}px` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 absolute -bottom-5">
                          {record.year.toString().slice(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Chart Legend */}
                <div className="flex items-center justify-center gap-6 mt-4 text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-earth-emerald" />
                    <span>Vegetation Canopy (%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-earth-sun" />
                    <span>Impervious Built-up Area (%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Observation Source: Multispectral NDVI / NDBI Sentinel Harmonized</span>
              <span className="text-earth-aqua font-semibold">16-Year Delta: -31.4% Net Canopy</span>
            </div>
          </GlassCard>
        </div>

        {/* Global Hotspots Teleport Grid (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <GlassCard variant="medium" className="p-6 border border-white/10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white">Monitored Global Hotspots</h3>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('explorer')}
                >
                  3D Real Earth →
                </GlassButton>
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {hotspots.map((spot) => {
                  const isSelected = spot.id === selectedHotspot.id;
                  return (
                    <div
                      key={spot.id}
                      onClick={() => onSelectHotspot(spot)}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-earth-aqua/15 border-earth-aqua shadow-sm'
                          : 'glass-panel-1 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-earth-aqua' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold text-white">{spot.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-earth-emerald">
                          {spot.currentMetrics.environmentalHealth}/100
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>{spot.country} • {spot.primaryRisk}</span>
                        <span className="text-[10px] text-earth-coral font-mono">
                          +{spot.currentMetrics.surfaceTempAnomaly}°C
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
              <span>6 High-Sensitivity Biomes</span>
              <span className="text-earth-emerald font-semibold">All Telemetry Synchronized</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* AI Decision Recommendations Hero Section */}
      <GlassCard variant="strong" glow="aurora" className="p-6 border border-earth-aurora/30 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-earth-aurora" />
            <h3 className="text-lg font-bold text-white">
              EARTHMIND AI Decision Engine • Evidence-Based Priorities
            </h3>
          </div>
          <GlassBadge tone="aurora" size="sm">Decision Support Active</GlassBadge>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {selectedHotspot.recommendations.map((rec) => (
            <div key={rec.priority} className="p-4 rounded-xl glass-panel-2 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-earth-aurora font-bold">
                    PRIORITY {rec.priority}
                  </span>
                  <GlassBadge tone={rec.priority === 1 ? 'emerald' : rec.priority === 2 ? 'aqua' : 'sun'} size="sm">
                    {rec.priority === 1 ? 'Highest Yield' : rec.priority === 2 ? 'Resilience' : 'Adaptation'}
                  </GlassBadge>
                </div>
                <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{rec.action}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-earth-emerald font-mono">
                {rec.expectedImpact}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
