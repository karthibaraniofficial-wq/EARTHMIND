import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Compass, 
  Clock, 
  Sliders, 
  FileText, 
  Sparkles, 
  X, 
  ArrowRight, 
  Globe, 
  Layers, 
  Droplets, 
  Flame, 
  Trees, 
  Building2, 
  Calendar, 
  FlaskConical, 
  Scale, 
  Settings, 
  Presentation,
  Mic
} from 'lucide-react';
import { GlassCard } from '../glass/GlassCard';
import { EnvironmentalHotspot, LayerType } from '../../types';
import { useVoice } from '../../voice/VoiceContext';


interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  hotspots: EnvironmentalHotspot[];
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onApplyPromptScenario?: (action: string) => void;
  onChangeLayer?: (layer: LayerType) => void;
  onToggleExhibition?: () => void;
  onToggleAi?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  hotspots,
  onSelectHotspot,
  onApplyPromptScenario,
  onChangeLayer,
  onToggleExhibition,
  onToggleAi,
}) => {
  const { startListening, toggleVoicePanel } = useVoice();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickPrompts = [
    { text: 'Talk to EarthMind (Voice Intelligence Control)', action: 'START_VOICE', triggerVoice: true },
    { text: 'Open Amazon Basin in 3D Explorer', action: 'OPEN_AMAZON', spotId: 'amazon-rainforest', view: 'explorer' },
    { text: 'Show Flood Risk & Runoff Hazard Layer', action: 'SHOW_FLOOD', layer: 'flood' as LayerType, view: 'explorer' },
    { text: 'Travel to Historical Epoch (2015 Memory)', action: 'TRAVEL_2015', view: 'memory' },
    { text: 'Run Green City 2030 (+25% Tree Cover)', action: 'SIM_TREE_25', view: 'simulator' },
    { text: 'Simulate Extreme Rainfall (+40% Precipitation)', action: 'SIM_RAIN_40', view: 'simulator' },
    { text: 'Compare Baseline vs High Urban Growth Scenarios', action: 'COMPARE_PRESETS', view: 'scenarios' },
    { text: 'Generate Environmental Intelligence Report (PDF)', action: 'GEN_REPORT', view: 'reports' },
    { text: 'Explain this area scientifically with EarthMind AI', action: 'EXPLAIN_AREA', triggerAi: true },
    { text: 'Start Science Expo Mode for Judges', action: 'START_EXHIBITION', triggerExpo: true },
    { text: 'Open Long-Range Future Projections (2050–2100)', action: 'OPEN_FORECAST', view: 'forecast' },
    { text: 'Open Hydrological Intelligence & Lakes', action: 'OPEN_WATER', view: 'water' },
    { text: 'Open Scientific Research Lab & Hypotheses', action: 'OPEN_RESEARCH', view: 'research' },
    { text: 'Open Decision Center & Cost-Impact Trade-offs', action: 'OPEN_DECISIONS', view: 'decisions' },
    { text: 'Open Twin OS 500-Option Config Center', action: 'OPEN_SETTINGS', view: 'settings' },
  ];

  const filteredHotspots = hotspots.filter(
    (h) =>
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.region.toLowerCase().includes(query.toLowerCase()) ||
      h.country.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPrompts = quickPrompts.filter((p) =>
    p.text.toLowerCase().includes(query.toLowerCase())
  );

  const views = [
    { label: 'Overview Dashboard', view: 'overview', icon: Globe },
    { label: 'Earth Explorer (3D)', view: 'explorer', icon: Compass },
    { label: 'Earth Memory (Timeline)', view: 'memory', icon: Clock },
    { label: 'Multi-Spectral Layers', view: 'layers', icon: Layers },
    { label: 'WHAT-IF? Simulator', view: 'simulator', icon: Sliders },
    { label: 'Scenario Comparison', view: 'scenarios', icon: FileText },
    { label: 'Environmental Forensics', view: 'forensics', icon: Sparkles },
    { label: 'Future Projections (2050)', view: 'forecast', icon: Calendar },
    { label: 'Water Intelligence', view: 'water', icon: Droplets },
    { label: 'Climate & Carbon', view: 'climate', icon: Flame },
    { label: 'Biodiversity & Canopy', view: 'biodiversity', icon: Trees },
    { label: 'Urban & Cities', view: 'cities', icon: Building2 },
    { label: 'Scientific Lab', view: 'research', icon: FlaskConical },
    { label: 'Decision Center', view: 'decisions', icon: Scale },
    { label: 'Executive Reports', view: 'reports', icon: FileText },
    { label: 'Twin OS Settings', view: 'settings', icon: Settings },
    { label: '⚡ EarthMind Autopilot', view: 'autopilot', icon: Sparkles },
    { label: '👥 Multi-Agent Council', view: 'council', icon: Scale },
    { label: '🔀 Future Fork (2026–2050)', view: 'future_fork', icon: Calendar },
    { label: '🌊 Compound Disaster Simulator', view: 'compound_disaster', icon: Flame },
    { label: '🏙️ 3D City Digital Twin', view: 'city_twin', icon: Building2 },
    { label: '🧬 Environmental Causal Graph', view: 'causal_graph', icon: Sparkles },
    { label: '🛰️ Satellite Change Scanner & Swipe', view: 'satellite_scanner', icon: Layers },
    { label: '📡 EarthMind Sentinel & Planet Pulse', view: 'sentinel', icon: Globe },
    { label: '🧪 Scientific Reproducibility Mode', view: 'reproducibility', icon: FileText },
    { label: '⚔️ Strategy Battle Mode', view: 'battle_mode', icon: Sliders },
    { label: '🎯 EarthMind Mission Mode', view: 'missions', icon: Compass },
  ];

  const filteredViews = views.filter((v) =>
    v.label.toLowerCase().includes(query.toLowerCase()) ||
    v.view.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <GlassCard
        variant="strong"
        glow="aurora"
        className="w-full max-w-3xl relative z-10 border border-white/20 shadow-2xl shadow-purple-950/50 overflow-hidden"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-earth-aqua flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a natural command or question... (e.g. 'Open Amazon', 'Show flood risk', 'Run green city', 'Settings')"
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-mono"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[65vh] overflow-y-auto p-3 space-y-4">
          {/* Quick Navigation Targets */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 mb-1.5">
              Planetary OS Modules ({filteredViews.length})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {filteredViews.map(({ label, view, icon: Icon }) => (
                <button
                  key={view}
                  onClick={() => {
                    onNavigate(view);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 text-left transition-colors font-mono"
                >
                  <Icon className="w-3.5 h-3.5 text-earth-aqua flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Intelligence & Natural Commands */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 mb-1.5 flex items-center justify-between">
              <span>Natural Language Commands ({filteredPrompts.length})</span>
              <span className="text-earth-aurora font-semibold">AI Powered</span>
            </div>
            <div className="space-y-1">
              {filteredPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (prompt.spotId) {
                      const spot = hotspots.find((h) => h.id === prompt.spotId);
                      if (spot) onSelectHotspot(spot);
                    }
                    if (prompt.layer && onChangeLayer) {
                      onChangeLayer(prompt.layer);
                    }
                    if (prompt.triggerAi && onToggleAi) {
                      onToggleAi();
                    }
                    if ((prompt as any).triggerVoice) {
                      startListening();
                    }
                    if (prompt.triggerExpo && onToggleExhibition) {
                      onToggleExhibition();
                    }
                    if (onApplyPromptScenario && prompt.action) {
                      onApplyPromptScenario(prompt.action);
                    }
                    if (prompt.view) {
                      onNavigate(prompt.view);
                    }
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-earth-aurora/15 border border-transparent hover:border-earth-aurora/30 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-earth-aurora flex-shrink-0" />
                    <span className="font-mono">{prompt.text}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-earth-aurora group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Monitored Hotspots */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 mb-1.5">
              Monitored Geographic Biomes ({filteredHotspots.length})
            </div>
            <div className="space-y-1">
              {filteredHotspots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => {
                    onSelectHotspot(spot);
                    onNavigate('explorer');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200 hover:text-white hover:bg-earth-aqua/15 border border-transparent hover:border-earth-aqua/30 transition-all text-left font-mono"
                >
                  <div>
                    <div className="font-semibold text-white">{spot.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {spot.region}, {spot.country} • {spot.primaryRisk}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-earth-emerald font-semibold">
                      {spot.currentMetrics.environmentalHealth}/100
                    </div>
                    <div className="text-[10px] text-slate-400">Health Score</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
