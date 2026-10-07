import React from 'react';
import { Compass, Calendar, Layers, Activity } from '../components/icons';
import { ScientificBadge, ScientificProvenance } from './ScientificBadge';

export interface EarthHUDProps {
  locationName: string;
  lat: number;
  lon: number;
  year?: number;
  activeLayerName?: string;
  provenance?: ScientificProvenance;
  confidence?: number;
  className?: string;
}

export const EarthHUD: React.FC<EarthHUDProps> = ({
  locationName,
  lat,
  lon,
  year = 2026,
  activeLayerName = 'Ecological Health Composite',
  provenance = 'OBSERVED',
  confidence = 94,
  className = '',
}) => {
  const formatCoord = (val: number, isLat: boolean) => {
    const dir = isLat ? (val >= 0 ? '°N' : '°S') : (val >= 0 ? '°E' : '°W');
    return `${Math.abs(val).toFixed(4)}${dir}`;
  };

  return (
    <div
      className={`pointer-events-auto select-none p-3 rounded-2xl glass-panel-2 border border-white/15 backdrop-blur-xl bg-[#071A2B]/85 text-slate-100 shadow-xl max-w-xs space-y-2 animate-in fade-in duration-300 ${className}`}
      data-testid="earth-hud"
    >
      {/* Top Location and Status */}
      <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
        <div>
          <span className="text-[9px] font-mono uppercase text-earth-aqua tracking-widest block font-bold">
            PLANETARY TELEMETRY
          </span>
          <h3 className="text-sm font-extrabold text-white truncate max-w-[180px]">
            {locationName}
          </h3>
        </div>
        <ScientificBadge provenance={provenance} confidence={confidence} size="sm" />
      </div>

      {/* Coordinate & Temporal Grid */}
      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
          <Compass className="w-3 h-3 text-earth-sky flex-shrink-0" />
          <span className="text-slate-300 truncate">
            {formatCoord(lat, true)}, {formatCoord(lon, false)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
          <Calendar className="w-3 h-3 text-earth-sun flex-shrink-0" />
          <span className="text-slate-200 font-bold">{year}</span>
        </div>
      </div>

      {/* Active Layer Status */}
      <div className="flex items-center justify-between text-[10px] font-mono bg-white/5 px-2 py-1 rounded-lg border border-white/5">
        <div className="flex items-center gap-1.5 truncate">
          <Layers className="w-3 h-3 text-earth-leaf flex-shrink-0" />
          <span className="text-slate-300 truncate">{activeLayerName}</span>
        </div>
        <span className="text-earth-emerald text-[9px] font-bold uppercase ml-1 flex-shrink-0">
          CALIBRATED
        </span>
      </div>
    </div>
  );
};
