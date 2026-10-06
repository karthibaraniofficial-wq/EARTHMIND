import React, { useState } from 'react';
import { 
  Building2, 
  Flame, 
  Trees, 
  Car, 
  Activity, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Droplets
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { EnvironmentalHotspot, DataProvenance } from '../../types';

interface CityIntelligenceViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToSimulator: () => void;
}

export const CityIntelligenceView: React.FC<CityIntelligenceViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToSimulator,
}) => {
  const urbanMetrics = [
    { label: 'Impervious Surface Ratio', value: `${selectedHotspot.history[selectedHotspot.history.length - 1].urbanCoverPct}%`, note: 'Concrete / asphalt fraction', tone: 'sun', provenance: 'MODELLED' as DataProvenance },
    { label: 'Urban Heat Island (UHI) Peak', value: '+3.8°C', note: 'Core vs rural periphery', tone: 'coral', provenance: 'OBSERVED' as DataProvenance },
    { label: 'Public Green Space / Capita', value: '4.6 m²', note: 'WHO standard is ≥ 9.0 m²', tone: 'coral', provenance: 'ESTIMATED' as DataProvenance },
    { label: 'Urban Climate Resilience Score', value: `${100 - selectedHotspot.currentMetrics.heatRisk} / 100`, note: 'Multi-hazard adaptation index', tone: 'leaf', provenance: 'MODELLED' as DataProvenance },
  ];

  const cityProfiles = [
    {
      city: 'Delhi National Capital Region (NCR)',
      country: 'India',
      population: '32.9 Million',
      imperviousPct: '72.4%',
      uhiThermalDelta: '+4.2°C',
      resilienceScore: 42,
      criticalHazard: 'Severe Thermal Dome + Smog Inversion',
      sensor: 'Landsat-9 TIRS-2 & Sentinel-5P',
    },
    {
      city: 'Greater Tokyo Metropolis',
      country: 'Japan',
      population: '37.4 Million',
      imperviousPct: '68.1%',
      uhiThermalDelta: '+2.9°C',
      resilienceScore: 84,
      criticalHazard: 'Seismic & Tropical Typhoon Runoff',
      sensor: 'Sentinel-1 InSAR & Landsat-9',
    },
    {
      city: 'Rotterdam Port Metropolitan Grid',
      country: 'Netherlands',
      population: '1.2 Million',
      imperviousPct: '54.2%',
      uhiThermalDelta: '+1.6°C',
      resilienceScore: 88,
      criticalHazard: 'Sea Level Surge & Estuary Backflow',
      sensor: 'Copernicus Sentinel-2 & SAR',
    },
    {
      city: 'Greater Los Angeles Basin',
      country: 'California, USA',
      population: '12.5 Million',
      imperviousPct: '76.8%',
      uhiThermalDelta: '+3.5°C',
      resilienceScore: 61,
      criticalHazard: 'Santa Ana Wildfire Winds + Water Deficit',
      sensor: 'MODIS & Sentinel-2',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-earth-sun" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-sun">
              MODULE 07 & 37 — URBAN CANOPY & CITY INTELLIGENCE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Urban Climate & City Resilience</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Spaceborne radiometric mapping of Urban Heat Islands (UHI), impervious concrete sprawl, traffic density corridors, and municipal climate adaptation metrics.
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
                  ? 'bg-earth-sun text-[#071A2B] border-earth-sun font-bold shadow-md shadow-earth-sun/20'
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
        {urbanMetrics.map((item, idx) => (
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

      {/* City Profiles Comparison Matrix */}
      <GlassCard variant="strong" glow="sun" className="p-6 border border-white/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-base font-bold text-white font-mono uppercase flex items-center gap-2">
              <Building2 className="w-4 h-4 text-earth-sun" />
              <span>Metropolitan Resilience Diagnostics</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative analysis of impervious surface fraction, thermal amplification, and municipal adaptive capacity.
            </p>
          </div>
          <GlassButton variant="primary" size="sm" onClick={onNavigateToSimulator}>
            Simulate Urban Decarbonization Levers
          </GlassButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {cityProfiles.map((city, idx) => (
            <div key={idx} className="p-4 rounded-2xl glass-panel-1 border border-white/10 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{city.city}</h3>
                  <div className="text-[11px] font-mono text-slate-400">{city.country} • Population: {city.population}</div>
                </div>
                <GlassBadge tone={city.resilienceScore >= 75 ? 'leaf' : city.resilienceScore >= 50 ? 'sun' : 'coral'} size="sm">
                  Resilience: {city.resilienceScore}/100
                </GlassBadge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <div>
                  <span className="text-[10px] text-slate-400 block">Impervious Fraction</span>
                  <span className="text-white font-semibold">{city.imperviousPct}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">UHI Thermal Amplification</span>
                  <span className="text-earth-coral font-bold">{city.uhiThermalDelta}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5 pt-1">
                <span className="text-earth-coral font-bold">Primary Risk:</span>
                <span>{city.criticalHazard}</span>
              </div>

              <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-white/5 flex items-center justify-between">
                <span>Spacecraft: {city.sensor}</span>
                <span className="text-earth-leaf">[OBSERVED]</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
