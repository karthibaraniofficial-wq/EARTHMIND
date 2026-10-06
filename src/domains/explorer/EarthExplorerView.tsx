import React, { useState } from 'react';
import { 
  Flame, 
  Wind, 
  Trees, 
  Droplets, 
  Building2, 
  AlertTriangle, 
  HeartHandshake, 
  Search, 
  MapPin, 
  Info 
} from 'lucide-react';
import { RealEarth } from '../../components/3d/RealEarth';
import { HotspotIntelligencePanel } from './HotspotIntelligencePanel';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { EnvironmentalHotspot, LayerType } from '../../types';
import { VoiceCommandSuggestions } from '../../components/voice/VoiceCommandSuggestions';


interface EarthExplorerViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot | null;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  activeLayer: LayerType;
  onChangeLayer: (layer: LayerType) => void;
  onNavigateToSimulator: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToMemory: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToForensics: (hotspot: EnvironmentalHotspot) => void;
}

export const EarthExplorerView: React.FC<EarthExplorerViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  activeLayer,
  onChangeLayer,
  onNavigateToSimulator,
  onNavigateToMemory,
  onNavigateToForensics,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const layers: { id: LayerType; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
    { id: 'health', label: 'Health Score', icon: <HeartHandshake className="w-3.5 h-3.5" />, color: 'text-earth-emerald', desc: 'Composite Ecological Resilience' },
    { id: 'temperature', label: 'Surface Temp', icon: <Flame className="w-3.5 h-3.5" />, color: 'text-earth-coral', desc: 'Land Surface Temp Anomaly' },
    { id: 'air_quality', label: 'Air Quality AQI', icon: <Wind className="w-3.5 h-3.5" />, color: 'text-earth-aurora', desc: 'Aerosol Optical Depth & Inversions' },
    { id: 'green_cover', label: 'Green Cover', icon: <Trees className="w-3.5 h-3.5" />, color: 'text-earth-leaf', desc: 'Canopy Density & Bioswales' },
    { id: 'water', label: 'Water Stress', icon: <Droplets className="w-3.5 h-3.5" />, color: 'text-earth-aqua', desc: 'Aquifer & Basin Retention' },
    { id: 'urbanization', label: 'Urban Sprawl', icon: <Building2 className="w-3.5 h-3.5" />, color: 'text-earth-sun', desc: 'Impervious Surface Expansion' },
    { id: 'flood', label: 'Flood Risk', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-earth-sky', desc: 'Runoff Vulnerability Index' },
  ];

  const filteredHotspots = hotspots.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full h-[calc(100vh-100px)] min-h-[640px] flex flex-col overflow-hidden bg-radial-aurora">
      {/* Top Floating Overlay: Quick Hotspot Selector & Search */}
      <div className="absolute top-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Hotspot Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 pointer-events-auto custom-scrollbar">
          {hotspots.map((spot) => {
            const isSelected = selectedHotspot?.id === spot.id;
            return (
              <button
                key={spot.id}
                onClick={() => onSelectHotspot(spot)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-earth-aqua text-[#071A2B] border-earth-aqua font-bold shadow-lg shadow-earth-aqua/25'
                    : 'glass-panel-1 border-white/10 text-slate-300 hover:text-white hover:glass-panel-2'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{spot.name}</span>
                <span className={`text-[10px] font-mono ml-0.5 ${isSelected ? 'text-[#071A2B]' : 'text-slate-400'}`}>
                  {spot.currentMetrics.environmentalHealth}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search location bar */}
        <div className="relative pointer-events-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter hotspots..."
            className="pl-9 pr-3 py-1.5 text-xs bg-slate-900/70 backdrop-blur-md rounded-xl border border-white/15 text-white placeholder-slate-400 focus:outline-none focus:border-earth-aqua/50 w-44 sm:w-56"
          />
        </div>
      </div>

      {/* Main 3D Stage & Context Panel Container */}
      <div className="relative flex-1 w-full h-full flex flex-col lg:flex-row items-center justify-between p-4 pt-16">
        {/* 3D Earth Digital Twin */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center">
          <RealEarth
            mode="explorer"
            interactive={true}
            showAtmosphere={true}
            showClouds={true}
            showNightLights={true}
            showHotspots={true}
            showEnvironmentalOverlay={true}
            activeLayer={activeLayer}
            hotspots={filteredHotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={onSelectHotspot}
            className="w-full h-full"
          />

          {/* Interactive Hint Indicator */}
          <div className="absolute top-2 left-4 pointer-events-none hidden sm:flex items-center gap-2 glass-panel-1 px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-slate-400">
            <Info className="w-3.5 h-3.5 text-earth-aqua" />
            <span>Drag to rotate • Scroll to zoom • Click glowing nodes to inspect</span>
          </div>
        </div>

        {/* Right Hotspot Intelligence Panel */}
        {selectedHotspot && (
          <div className="absolute lg:relative right-4 top-16 bottom-16 z-30 flex items-stretch">
            <HotspotIntelligencePanel
              hotspot={selectedHotspot}
              onClose={() => onSelectHotspot(null as any)}
              onNavigateToSimulator={onNavigateToSimulator}
              onNavigateToMemory={onNavigateToMemory}
              onNavigateToForensics={onNavigateToForensics}
            />
          </div>
        )}
      </div>

      {/* Bottom Floating Layer Control Bar */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex flex-col items-center justify-center pointer-events-none gap-2">
        <div className="pointer-events-auto">
          <VoiceCommandSuggestions currentView="explorer" />
        </div>
        <GlassCard
          variant="strong"
          glow="aqua"
          className="pointer-events-auto p-1.5 rounded-2xl border border-white/15 shadow-2xl flex items-center gap-1 overflow-x-auto max-w-full custom-scrollbar"
        >
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-3 hidden sm:inline">
            Overlays:
          </span>
          {layers.map((layer) => {
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => onChangeLayer(layer.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-earth-ocean to-earth-aqua text-white font-bold shadow-md shadow-earth-aqua/30 border border-white/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title={layer.desc}
              >
                <span className={isActive ? 'text-white' : layer.color}>{layer.icon}</span>
                <span>{layer.label}</span>
              </button>
            );
          })}
        </GlassCard>
      </div>
    </div>
  );
};
