import React, { useState } from 'react';
import { 
  Trees, 
  Leaf, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Activity, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Compass,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { EnvironmentalHotspot, DataProvenance } from '../../types';

interface BiodiversityViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToSimulator: () => void;
}

export const BiodiversityView: React.FC<BiodiversityViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToSimulator,
}) => {
  const bioMetrics = [
    { label: 'Ecosystem Resilience Score', value: `${selectedHotspot.currentMetrics.environmentalHealth} / 100`, note: 'Biological buffer capacity', tone: 'leaf', provenance: 'MODELLED' as DataProvenance },
    { label: 'Vegetative Canopy Density', value: `${selectedHotspot.currentMetrics.greenCoverPct}%`, note: 'Sentinel-2 NDVI ≥ 0.4', tone: 'leaf', provenance: 'OBSERVED' as DataProvenance },
    { label: 'Habitat Fragmentation Index', value: '0.58', note: 'Patch connectivity metric', tone: 'coral', provenance: 'MODELLED' as DataProvenance },
    { label: 'IUCN Species Pressure Rank', value: 'Class IV (Vulnerable)', note: 'Red List spatial intersection', tone: 'sun', provenance: 'OBSERVED' as DataProvenance },
  ];

  const ecologicalCorridors = [
    { name: 'Amazon Trans-Purus Wildlife Corridor', country: 'Brazil', lengthKm: '840 km', fragmentationStatus: 'High Severance', treeLoss10Yr: '-24.8%', protectedStatus: 'Indigenous Reserve / APA' },
    { name: 'Terai Arc Biodiversity Highway', country: 'India / Nepal', lengthKm: '900 km', fragmentationStatus: 'Moderate', treeLoss10Yr: '-14.2%', protectedStatus: 'National Parks Network' },
    { name: 'Rhine-Meuse Riparian Buffer Grid', country: 'Netherlands', lengthKm: '320 km', fragmentationStatus: 'Intact Reconnected', treeLoss10Yr: '+4.1%', protectedStatus: 'Natura 2000' },
    { name: 'Sierra Nevada Migration Foothills', country: 'California, USA', lengthKm: '650 km', fragmentationStatus: 'Wildfire Compromised', treeLoss10Yr: '-18.5%', protectedStatus: 'USFS Wilderness' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trees className="w-5 h-5 text-earth-emerald" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-emerald">
              MODULES 06 & 10 — BIODIVERSITY & VEGETATIVE INTEGRITY
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Biodiversity & Habitat Corridors</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Sentinel-2 multispectral canopy density analysis combined with ecological patch connectivity, species threat indices, and protected territory tracking.
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
                  ? 'bg-earth-emerald text-[#071A2B] border-earth-emerald font-bold shadow-md shadow-earth-emerald/20'
                  : 'glass-panel-1 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3 inline mr-1" />
              {spot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bioMetrics.map((item, idx) => (
          <GlassCard key={idx} variant="medium" className="p-5 border border-white/10">
            <span className="text-xs font-mono text-slate-400 block">{item.label}</span>
            <div className="text-2xl font-extrabold font-mono text-white mt-1">{item.value}</div>
            <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>{item.note}</span>
              <GlassBadge tone={item.tone as any} size="sm">[{item.provenance}]</GlassBadge>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Ecological Corridors Monitoring Table */}
      <GlassCard variant="strong" glow="emerald" className="p-6 border border-white/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2">
              <Leaf className="w-4 h-4 text-earth-leaf" />
              <span>Critical Continental Migration Corridors</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Assessing landscape connectivity barriers and deforestation fragmentation rates.
            </p>
          </div>
          <GlassButton variant="primary" size="sm" onClick={onNavigateToSimulator}>
            Simulate Canopy Restoration Levers
          </GlassButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {ecologicalCorridors.map((c, idx) => (
            <div key={idx} className="p-4 rounded-2xl glass-panel-1 border border-white/10 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{c.name}</h3>
                  <div className="text-[11px] font-mono text-slate-400">{c.country} • {c.protectedStatus}</div>
                </div>
                <GlassBadge tone={c.fragmentationStatus.includes('High') ? 'coral' : c.fragmentationStatus.includes('Moderate') ? 'sun' : 'leaf'} size="sm">
                  {c.fragmentationStatus}
                </GlassBadge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div>
                  <span className="text-[10px] text-slate-400 block">Corridor Span</span>
                  <span className="text-white font-semibold">{c.lengthKm}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Decadal Canopy Shift</span>
                  <span className={`font-semibold ${c.treeLoss10Yr.startsWith('-') ? 'text-earth-coral' : 'text-earth-emerald'}`}>
                    {c.treeLoss10Yr}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                <span>Methodology: Landscape Matrix Analysis</span>
                <span className="text-earth-leaf">[OBSERVED: Sentinel-2]</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
