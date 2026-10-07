import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  AlertTriangle, 
  Trees, 
  Building2, 
  Flame, 
  Droplets, 
  Wind,
  Layers
} from 'lucide-react';
import { RealEarth } from '../../components/3d/RealEarth';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { EnvironmentalHotspot, LayerType } from '../../types';
import { ScientificBadge } from '../../design-system/ScientificBadge';

interface EarthMemoryViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  selectedYear?: number;
  onSelectYear?: (year: number) => void;
}

export const EarthMemoryView: React.FC<EarthMemoryViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  selectedYear: propYear,
  onSelectYear,
}) => {
  const [internalYear, setInternalYear] = useState<number>(2026);
  const selectedYear = propYear ?? internalYear;

  const setSelectedYear = (updater: React.SetStateAction<number>) => {
    const next = typeof updater === 'function' ? (updater as (prev: number) => number)(selectedYear) : updater;
    setInternalYear(next);
    onSelectYear?.(next);
  };

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // 1s per year
  const [memoryLayer, setMemoryLayer] = useState<LayerType>('green_cover');

  const history = selectedHotspot.history;
  const availableYears = history.map((h) => h.year);
  const baselineRecord = history[0]; // 2010
  const currentRecord = history.find((h) => h.year === selectedYear) || history[history.length - 1];

  // Playback timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setSelectedYear((prev) => {
          const currentIndex = availableYears.indexOf(prev);
          if (currentIndex >= availableYears.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return availableYears[currentIndex + 1];
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, availableYears, playbackSpeed]);

  // Compute dynamic deltas relative to 2010 baseline
  const vegDelta = Math.round((currentRecord.greenCoverPct - baselineRecord.greenCoverPct) * 10) / 10;
  const urbanDelta = Math.round((currentRecord.urbanCoverPct - baselineRecord.urbanCoverPct) * 10) / 10;
  const tempDelta = Math.round((currentRecord.surfaceTempAnomaly - baselineRecord.surfaceTempAnomaly) * 10) / 10;
  const waterDelta = Math.round((currentRecord.waterIndex - baselineRecord.waterIndex) * 10) / 10;
  const aqiDelta = currentRecord.airQualityAqi - baselineRecord.airQualityAqi;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Header & Hotspot Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              TEMPORAL ENVIRONMENTAL REPLAY
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-3xl font-extrabold text-white">Earth Memory (2010 – 2026)</h1>
            <ScientificBadge provenance="OBSERVED" confidence={96} sensor="Landsat-8 & Sentinel-2 Reanalysis" size="sm" />
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Scrub through 16 years of reconstructed multispectral satellite observations to visualize progressive ecological transformation and anthropogenic encroachment.
          </p>
        </div>

        {/* Hotspot Dropdown / Chips */}
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

      {/* Main Interactive Timeline Scrubber Bar */}
      <GlassCard variant="strong" glow="aqua" className="p-6 border border-white/20 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <GlassButton
              variant={isPlaying ? 'aurora' : 'primary'}
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              leftIcon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            >
              {isPlaying ? 'Pause Replay' : 'Play Timelapse'}
            </GlassButton>

            <button
              onClick={() => {
                setIsPlaying(false);
                setSelectedYear(2010);
              }}
              className="p-2 rounded-xl glass-panel-1 border border-white/10 text-slate-300 hover:text-white"
              title="Reset to 2010 Baseline"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="text-xs text-slate-400 font-mono hidden md:block">
              Speed:
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-transparent text-earth-aqua font-bold ml-1.5 focus:outline-none cursor-pointer"
              >
                <option value={1500} className="bg-slate-900 text-white">0.5x</option>
                <option value={1000} className="bg-slate-900 text-white">1.0x</option>
                <option value={500} className="bg-slate-900 text-white">2.0x</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">OBSERVED YEAR:</span>
            <span className="text-3xl font-extrabold font-mono text-earth-aqua tracking-wider">
              {selectedYear}
            </span>
            <GlassBadge tone={selectedYear === 2010 ? 'neutral' : selectedYear === 2026 ? 'coral' : 'sun'} size="sm">
              {selectedYear === 2010 ? 'Historical Baseline' : selectedYear === 2026 ? 'Current Epoch' : `+${selectedYear - 2010} Years`}
            </GlassBadge>
          </div>
        </div>

        {/* Range Slider Track */}
        <div className="relative pt-2 pb-4">
          <input
            type="range"
            min={2010}
            max={2026}
            step={2}
            value={selectedYear}
            onChange={(e) => {
              setIsPlaying(false);
              setSelectedYear(Number(e.target.value));
            }}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-earth-aqua focus:outline-none"
          />

          {/* Year Milestone Ticks */}
          <div className="flex justify-between mt-3 text-xs font-mono text-slate-400 px-1">
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => {
                  setIsPlaying(false);
                  setSelectedYear(yr);
                }}
                className={`transition-colors ${
                  selectedYear === yr ? 'text-earth-aqua font-bold scale-110' : 'hover:text-slate-200'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* 3D Real Earth Temporal Reconstruction Stage */}
      <GlassCard variant="strong" glow="aqua" className="p-4 sm:p-6 border border-white/20 overflow-hidden relative shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-earth-aqua animate-pulse" />
            <h3 className="text-base font-bold text-white">Photorealistic Earth Memory Digital Twin ({selectedYear})</h3>
            <span className="text-xs text-slate-400 font-mono hidden md:inline">• NASA Blue Marble + Temporal Multi-Spectral Overlay</span>
          </div>

          {/* Temporal Spectral Layer Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'green_cover' as LayerType, label: 'Canopy Loss', icon: <Trees className="w-3.5 h-3.5 text-earth-leaf" /> },
              { id: 'temperature' as LayerType, label: 'Thermal Anomaly', icon: <Flame className="w-3.5 h-3.5 text-earth-coral" /> },
              { id: 'urbanization' as LayerType, label: 'Urban Sprawl', icon: <Building2 className="w-3.5 h-3.5 text-earth-sun" /> },
              { id: 'water' as LayerType, label: 'Water Index', icon: <Droplets className="w-3.5 h-3.5 text-earth-sky" /> },
              { id: 'air_quality' as LayerType, label: 'Aerosol AQI', icon: <Wind className="w-3.5 h-3.5 text-earth-aurora" /> },
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => setMemoryLayer(layer.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  memoryLayer === layer.id
                    ? 'bg-earth-aqua/20 border border-earth-aqua text-white shadow-sm shadow-earth-aqua/30'
                    : 'glass-panel-1 border border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                {layer.icon}
                <span>{layer.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full h-[480px] relative rounded-2xl overflow-hidden glass-panel-2 border border-white/10">
          <RealEarth
            mode="memory"
            interactive={true}
            showAtmosphere={true}
            showClouds={true}
            showNightLights={true}
            showHotspots={true}
            showEnvironmentalOverlay={true}
            activeLayer={memoryLayer}
            selectedYear={selectedYear}
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={onSelectHotspot}
            className="w-full h-full"
          />
        </div>
      </GlassCard>

      {/* Before / After Dual Comparison Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Baseline (2010) */}
        <GlassCard variant="medium" className="p-6 border border-white/10">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h3 className="text-lg font-bold text-white">Baseline Reference (2010)</h3>
            </div>
            <GlassBadge tone="neutral" size="sm">Reference State</GlassBadge>
          </div>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Trees className="w-4 h-4 text-earth-leaf" />
                <span>Vegetation Canopy Cover</span>
              </div>
              <span className="text-lg font-bold font-mono text-white">{baselineRecord.greenCoverPct}%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Building2 className="w-4 h-4 text-earth-sun" />
                <span>Impervious Built-up Area</span>
              </div>
              <span className="text-lg font-bold font-mono text-white">{baselineRecord.urbanCoverPct}%</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Flame className="w-4 h-4 text-earth-coral" />
                <span>Land Surface Temp Anomaly</span>
              </div>
              <span className="text-lg font-bold font-mono text-white">0.0°C</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Droplets className="w-4 h-4 text-earth-sky" />
                <span>Water Surface Index</span>
              </div>
              <span className="text-lg font-bold font-mono text-white">{baselineRecord.waterIndex} pts</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Wind className="w-4 h-4 text-earth-aurora" />
                <span>Air Quality Index (AQI)</span>
              </div>
              <span className="text-lg font-bold font-mono text-white">{baselineRecord.airQualityAqi}</span>
            </div>
          </div>
        </GlassCard>

        {/* Selected Year State & Deltas */}
        <GlassCard variant="strong" glow="aurora" className="p-6 border border-white/20">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-earth-aurora animate-pulse" />
              <h3 className="text-lg font-bold text-white">Reconstructed State ({selectedYear})</h3>
            </div>
            <GlassBadge tone="aurora" size="sm">Active Temporal Slice</GlassBadge>
          </div>

          <div className="mt-5 space-y-4">
            {/* Canopy */}
            <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Trees className="w-4 h-4 text-earth-leaf" />
                <span>Vegetation Canopy Cover</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold font-mono text-white">{currentRecord.greenCoverPct}%</span>
                <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${vegDelta < 0 ? 'bg-earth-coral/20 text-earth-coral' : 'bg-earth-emerald/20 text-earth-emerald'}`}>
                  {vegDelta > 0 ? `+${vegDelta}%` : `${vegDelta}%`}
                </span>
              </div>
            </div>

            {/* Urban */}
            <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Building2 className="w-4 h-4 text-earth-sun" />
                <span>Impervious Built-up Area</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold font-mono text-white">{currentRecord.urbanCoverPct}%</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-earth-sun/20 text-earth-sun">
                  +{urbanDelta}%
                </span>
              </div>
            </div>

            {/* Temp Anomaly */}
            <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Flame className="w-4 h-4 text-earth-coral" />
                <span>Land Surface Temp Anomaly</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold font-mono text-white">+{currentRecord.surfaceTempAnomaly}°C</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-earth-coral/20 text-earth-coral">
                  +{tempDelta}°C
                </span>
              </div>
            </div>

            {/* Water */}
            <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Droplets className="w-4 h-4 text-earth-sky" />
                <span>Water Surface Index</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold font-mono text-white">{currentRecord.waterIndex} pts</span>
                <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${waterDelta < 0 ? 'bg-earth-coral/20 text-earth-coral' : 'bg-earth-emerald/20 text-earth-emerald'}`}>
                  {waterDelta > 0 ? `+${waterDelta}` : `${waterDelta}`}
                </span>
              </div>
            </div>

            {/* AQI */}
            <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Wind className="w-4 h-4 text-earth-aurora" />
                <span>Air Quality Index (AQI)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold font-mono text-white">{currentRecord.airQualityAqi}</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-earth-coral/20 text-earth-coral">
                  +{aqiDelta} AQI
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Historical Shift Summary Callout */}
      <div className="p-5 rounded-2xl glass-panel-2 border border-earth-aqua/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-earth-aqua uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Temporal Shift Assessment ({baselineRecord.year} vs {selectedYear})</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Over this {selectedYear - 2010}-year observational window in {selectedHotspot.name}, built-up impervious area expanded by <strong className="text-white">+{urbanDelta}%</strong>, directly correlating with a <strong className="text-earth-coral">+{tempDelta}°C</strong> land surface thermal anomaly and a <strong className="text-earth-coral">{vegDelta}%</strong> loss of native vegetative canopy.
          </p>
        </div>

        <GlassBadge tone={selectedYear >= 2020 ? 'coral' : 'sun'} size="md">
          {selectedYear >= 2020 ? 'High Anthropogenic Pressure' : 'Moderate Expansion'}
        </GlassBadge>
      </div>
    </div>
  );
};
