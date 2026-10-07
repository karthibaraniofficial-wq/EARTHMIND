import React, { useState, useEffect } from 'react';
import { 
  Satellite, 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Sliders, 
  MapPin, 
  RotateCcw, 
  FileText,
  Clock,
  TrendingDown,
  TrendingUp,
  Globe2
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { EnvironmentalHotspot, SentinelAnomaly } from '../../types';

interface SentinelMonitorViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToSimulator: () => void;
  onNavigateToAutopilot?: () => void;
}

export const SentinelMonitorView: React.FC<SentinelMonitorViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToSimulator,
  onNavigateToAutopilot,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'brief' | 'rankings'>('queue');

  const [anomalies, setAnomalies] = useState<SentinelAnomaly[]>([
    {
      id: 'ANOM-2026-01',
      hotspotId: 'chad',
      region: 'Lake Chad Basin',
      title: 'Sudden Evaporative Open-Water Surface Contraction',
      severity: 'CRITICAL',
      sensor: 'Sentinel-2 MSI + Sentinel-3 OLCI',
      deltaSummary: '-14.8% surface retreat in 90 days vs 10-year rolling mean.',
      detectedTime: '34 mins ago',
      whyShouldICare: 'Directly threatens freshwater access for 30 million pastoralists; heightens acute food insecurity and transboundary displacement risk.',
      recommendedAction: 'Enforce emergency seasonal irrigation quotas and deploy satellite water level tracking telemetry.',
      status: 'INVESTIGATING',
    },
    {
      id: 'ANOM-2026-02',
      hotspotId: 'delhi',
      region: 'Indo-Gangetic Urban Corridor',
      title: 'Diurnal Land Surface Temperature Anomaly Spike',
      severity: 'WARNING',
      sensor: 'Landsat-9 TIRS + MODIS Terra',
      deltaSummary: '+3.1°C thermal radiance deviation above seasonal normal.',
      detectedTime: '2 hours ago',
      whyShouldICare: 'Causes localized heat-stroke spikes in high-density informal settlements; stresses power grid with unmitigated air conditioning demand.',
      recommendedAction: 'Trigger urban cool roof subsidy and activate nighttime park cooling airflow corridors.',
      status: 'PENDING_INVESTIGATION',
    },
    {
      id: 'ANOM-2026-03',
      hotspotId: 'amazon',
      region: 'Amazon Southern Arc of Deforestation',
      title: 'Unprecedented Fragmentation of Avian Canopy Corridor',
      severity: 'CRITICAL',
      sensor: 'Sentinel-1 SAR + GEDI Lidar',
      deltaSummary: '12km clear-cut buffer detected severing primary ecological corridor.',
      detectedTime: '4 hours ago',
      whyShouldICare: 'Breaches regional forest moisture recycling pump; triggers localized rainfall failure for downstream agricultural basins.',
      recommendedAction: 'Initiate emergency satellite enforcement alert and mandate native buffer restoration.',
      status: 'MITIGATION_PROPOSED',
    },
    {
      id: 'ANOM-2026-04',
      hotspotId: 'aral_sea',
      region: 'Aral Sea Salt Flats',
      title: 'Toxic Dust Aerosol Plume Surge (AOD > 1.8)',
      severity: 'ELEVATED',
      sensor: 'Copernicus Sentinel-5P TROPOMI',
      deltaSummary: 'Wind-driven saline-toxic dust storm dispersing across 400km.',
      detectedTime: '6 hours ago',
      whyShouldICare: 'Saline particulates deposit on arable fields, causing soil salinization and respiratory illnesses.',
      recommendedAction: 'Accelerate drought-resilient Haloxylon (Saxaul) ground cover plantation.',
      status: 'PENDING_INVESTIGATION',
    },
  ]);

  const handleRunManualScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Satellite className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              FEATURE 103 & 14 • AUTONOMOUS SENTINEL & LIVE PLANET PULSE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">EarthMind Sentinel & Planet Pulse</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Autonomous orbital monitoring system: Constantly scans multi-spectral feeds worldwide, correlates biophysical departures, and alerts human operators to emergent ecological crises.
          </p>
        </div>

        <button
          onClick={handleRunManualScan}
          disabled={isScanning}
          className="px-4 py-2.5 rounded-xl bg-earth-aqua text-[#071A2B] font-bold text-xs flex items-center gap-2 hover:bg-earth-aqua/90 shadow-md transition-all self-start md:self-auto"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Orbital Scan in Progress...' : 'Scan Planet Now'}</span>
        </button>
      </div>

      {/* Planetary Health & Earth Pulse Dashboard (Feature 14, 15, 16) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Earth Pulse Indicator */}
        <GlassCard variant="strong" className="p-5 border border-earth-aqua/30 bg-earth-aqua/5 flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-earth-aqua/20 text-earth-aqua border border-earth-aqua/40 flex items-center justify-center animate-pulse">
              <Activity className="w-7 h-7 text-earth-aqua" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-earth-emerald ring-2 ring-[#071A2B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase">EARTH BIOPHYSICAL PULSE</span>
              <GlassBadge tone="emerald" size="sm">ACTIVE RHYTHM</GlassBadge>
            </div>
            <div className="text-2xl font-black text-white mt-0.5">64 BPM EQUILIBRIUM</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Normal circadian & seasonal hydrological respiration rate.
            </div>
          </div>
        </GlassCard>

        {/* Card 2: Planetary Stress Index */}
        <GlassCard variant="medium" className="p-5 border border-rose-500/30 bg-rose-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Planetary Stress Index</span>
            <GlassBadge tone="coral" size="sm">ELEVATED</GlassBadge>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-rose-400">74</span>
            <span className="text-xs font-mono text-slate-400">/ 100</span>
            <span className="text-xs font-bold text-rose-400 flex items-center ml-2">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +2.8 pts (Diurnal)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Driven by Amazon canopy loss & Indo-Gangetic aquifer depletion.
          </p>
        </GlassCard>

        {/* Card 3: Planetary Recovery Index */}
        <GlassCard variant="medium" className="p-5 border border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Planetary Recovery Index</span>
            <GlassBadge tone="emerald" size="sm">TRACKING</GlassBadge>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-emerald-400">38</span>
            <span className="text-xs font-mono text-slate-400">/ 100</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center ml-2">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +1.4 pts (Yearly)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Supported by European rewilding & renewable transition pace.
          </p>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            activeTab === 'queue' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Active Anomaly Queue ({anomalies.length})
        </button>
        <button
          onClick={() => setActiveTab('brief')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            activeTab === 'brief' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Daily Earth Intelligence Briefing
        </button>
        <button
          onClick={() => setActiveTab('rankings')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            activeTab === 'rankings' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Global Environmental Change Rankings
        </button>
      </div>

      {/* Tab 1: Anomaly Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {anomalies.map((anom) => (
            <GlassCard
              key={anom.id}
              variant="medium"
              className={`p-5 border transition-all space-y-3 ${
                anom.severity === 'CRITICAL'
                  ? 'border-rose-500/40 bg-rose-500/5'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    anom.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white">{anom.region}</span>
                      <GlassBadge tone={anom.severity === 'CRITICAL' ? 'coral' : 'sun'} size="sm">
                        {anom.severity}
                      </GlassBadge>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {anom.detectedTime}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-0.5">{anom.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onNavigateToAutopilot && (
                    <button
                      onClick={onNavigateToAutopilot}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-[#071A2B] font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-110"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Optimize Region</span>
                    </button>
                  )}
                  <button
                    onClick={onNavigateToSimulator}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1"
                  >
                    <span>Simulate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Data Delta & Sensor */}
              <div className="p-3 rounded-xl bg-black/30 border border-white/5 font-mono text-xs flex flex-wrap items-center justify-between gap-2">
                <span className="text-rose-300 font-bold">{anom.deltaSummary}</span>
                <span className="text-slate-400">Sensor: {anom.sensor}</span>
              </div>

              {/* Feature 111: "Why should I care?" card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider block">
                    ⚡ WHY SHOULD I CARE? (SOCIETAL IMPACT)
                  </span>
                  <p className="text-slate-300 leading-relaxed">{anom.whyShouldICare}</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-earth-aqua font-bold uppercase tracking-wider block">
                    🛡️ RECOMMENDED POLICY INTERVENTION
                  </span>
                  <p className="text-slate-300 leading-relaxed">{anom.recommendedAction}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Tab 2: Daily Brief */}
      {activeTab === 'brief' && (
        <GlassCard variant="strong" className="p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-earth-aqua" />
            <div>
              <h3 className="text-lg font-bold text-white">Daily Planetary Intelligence Briefing</h3>
              <div className="text-xs font-mono text-slate-400">Date: 2026-10-06 • Classification: Level-1 Public Geospatial</div>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Global satellite surveillance recorded 18 elevated radiometric anomalies over the preceding 24-hour orbital cycle. The primary biophysical concern remains the coupled evaporation stress in the Sahel and tropical agroforestry fragmentation. Planetary composite resilience remains stable at 71/100, though regional water table deficits are widening.
          </p>
        </GlassCard>
      )}

      {/* Tab 3: Rankings */}
      {activeTab === 'rankings' && (
        <GlassCard variant="medium" className="p-5 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white">Global Environmental Change Rankings (2018 - 2026)</h3>
          <div className="space-y-2 text-xs font-mono">
            {[
              { rank: 1, name: 'Lake Chad Basin', delta: '-94.2% surface area loss', tag: 'Desiccation' },
              { rank: 2, name: 'Aral Sea (South Basin)', delta: '-88.5% open water perimeter', tag: 'Saline Desertification' },
              { rank: 3, name: 'Amazon Southern Arc', delta: '-31.4% contiguous tree canopy', tag: 'Deforestation' },
              { rank: 4, name: 'Indo-Gangetic Plain', delta: '-4.2cm/yr GRACE aquifer drop', tag: 'Groundwater Deficit' },
              { rank: 5, name: 'Delhi Metropolitan Area', delta: '+42.1% impervious concrete cover', tag: 'Urban Heat Island' },
            ].map((item) => (
              <div key={item.rank} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-earth-aqua/20 text-earth-aqua font-bold flex items-center justify-center">
                    #{item.rank}
                  </span>
                  <span className="font-bold text-white">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-rose-400 font-bold">{item.delta}</span>
                  <GlassBadge tone="neutral" size="sm">{item.tag}</GlassBadge>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};
