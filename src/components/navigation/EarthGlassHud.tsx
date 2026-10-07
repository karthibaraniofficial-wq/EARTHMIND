import React from 'react';
import { Flame, Wind, Droplets, Trees, AlertTriangle, Activity } from 'lucide-react';
import { EnvironmentalHotspot } from '../../types';

export interface EarthGlassHudProps {
  hotspot?: EnvironmentalHotspot | null;
  className?: string;
}

export const EarthGlassHud: React.FC<EarthGlassHudProps> = ({
  hotspot,
  className = '',
}) => {
  const metrics = hotspot?.currentMetrics || {
    temperature: 28.4,
    pollutionAqi: 42,
    waterStress: 38,
    greenCoverPercent: 68,
    floodRisk: 65,
    environmentalHealth: 72,
    heatRisk: 58,
  };

  const aqiLabel = metrics.pollutionAqi < 50 ? 'GOOD' : metrics.pollutionAqi < 100 ? 'MODERATE' : 'UNHEALTHY';
  const waterLabel = metrics.waterStress < 35 ? 'LOW' : metrics.waterStress < 65 ? 'MODERATE' : 'HIGH';
  const floodLabel = metrics.floodRisk > 60 ? 'HIGH' : metrics.floodRisk > 35 ? 'MODERATE' : 'LOW';

  return (
    <div
      className={`absolute inset-x-6 top-20 pointer-events-none flex flex-wrap items-center justify-between gap-3 z-20 ${className}`}
    >
      {/* Top Left: Temperature Capsule */}
      <div className="pointer-events-auto px-3.5 py-1.5 rounded-full glass-panel-highlight border border-white/20 text-xs font-mono font-bold text-white flex items-center gap-2 shadow-xl backdrop-blur-xl animate-in fade-in duration-300">
        <div className="p-1 rounded-full bg-earth-coral/20 text-earth-coral">
          <Flame className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-slate-400 font-sans">TEMP</span>
          <span className="text-earth-coral">+1.18°C</span>
        </div>
      </div>

      {/* Top Center-Left: Air Quality Capsule */}
      <div className="pointer-events-auto px-3.5 py-1.5 rounded-full glass-panel-highlight border border-white/20 text-xs font-mono font-bold text-white flex items-center gap-2 shadow-xl backdrop-blur-xl animate-in fade-in duration-300 hidden sm:flex">
        <div className="p-1 rounded-full bg-earth-emerald/20 text-earth-emerald">
          <Wind className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-slate-400 font-sans">AIR QUALITY</span>
          <span className="text-earth-emerald">{aqiLabel} ({metrics.pollutionAqi})</span>
        </div>
      </div>

      {/* Top Center-Right: Water Stress Capsule */}
      <div className="pointer-events-auto px-3.5 py-1.5 rounded-full glass-panel-highlight border border-white/20 text-xs font-mono font-bold text-white flex items-center gap-2 shadow-xl backdrop-blur-xl animate-in fade-in duration-300 hidden md:flex">
        <div className="p-1 rounded-full bg-earth-aqua/20 text-earth-aqua">
          <Droplets className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-slate-400 font-sans">WATER STRESS</span>
          <span className="text-earth-aqua">{waterLabel}</span>
        </div>
      </div>

      {/* Top Right: Forest Canopy Capsule */}
      <div className="pointer-events-auto px-3.5 py-1.5 rounded-full glass-panel-highlight border border-white/20 text-xs font-mono font-bold text-white flex items-center gap-2 shadow-xl backdrop-blur-xl animate-in fade-in duration-300 hidden lg:flex">
        <div className="p-1 rounded-full bg-earth-leaf/20 text-earth-leaf">
          <Trees className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-slate-400 font-sans">FOREST COVER</span>
          <span className="text-earth-leaf">-4.2%</span>
        </div>
      </div>

      {/* Top Far-Right: Flood Risk Capsule */}
      <div className="pointer-events-auto px-3.5 py-1.5 rounded-full glass-panel-highlight border border-white/20 text-xs font-mono font-bold text-white flex items-center gap-2 shadow-xl backdrop-blur-xl animate-in fade-in duration-300">
        <div className="p-1 rounded-full bg-earth-sun/20 text-earth-sun">
          <AlertTriangle className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-slate-400 font-sans">FLOOD RISK</span>
          <span className={metrics.floodRisk > 50 ? 'text-earth-sun' : 'text-earth-emerald'}>
            {floodLabel}
          </span>
        </div>
      </div>
    </div>
  );
};
