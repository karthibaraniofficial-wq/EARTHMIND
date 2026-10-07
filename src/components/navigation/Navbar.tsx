import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe2, 
  Compass, 
  Clock, 
  Sparkles, 
  Sliders, 
  Layers, 
  FileText, 
  Presentation, 
  Play, 
  Search, 
  Bot,
  Settings,
  ChevronDown,
  Droplets,
  Flame,
  Trees,
  Building2,
  Calendar,
  FlaskConical,
  Scale,
  Mic,
  Zap,
  Activity,
  Satellite,
  ShieldCheck,
  Target
} from 'lucide-react';
import { Palette } from '../icons';
import { GlassButton } from '../glass/GlassButton';
import { GlassBadge } from '../glass/GlassBadge';
import { useVoice } from '../../voice/VoiceContext';
import { VoiceStatusIndicator } from '../voice/VoiceStatusIndicator';
import { useEarthMindTheme } from '../../theme/ThemeProvider';
import { EarthMindLogo } from '../../branding';

export interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenCommand: () => void;
  onToggleAi: () => void;
  isAiOpen: boolean;
  onStartGuidedDemo: () => void;
  isDemoActive: boolean;
  onToggleExhibitionMode: () => void;
  isExhibitionMode: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCommand,
  onToggleAi,
  isAiOpen,
  onStartGuidedDemo,
  isDemoActive,
  onToggleExhibitionMode,
  isExhibitionMode,
}) => {
  const { toggleListening, isListening, isSpeaking } = useVoice();
  const { toggleAppearanceStudio, theme } = useEarthMindTheme();
  const [openDropdown, setOpenDropdown] = useState<'domains' | 'labs' | 'power' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const domainItems = [
    { id: 'layers', label: 'Multi-Spectral Layers', icon: Layers, desc: '10 Planetary remote sensors' },
    { id: 'water', label: 'Water Intelligence', icon: Droplets, desc: 'Lakes, rivers & aquifers' },
    { id: 'climate', label: 'Climate & Carbon', icon: Flame, desc: 'Thermal radiance & emissions' },
    { id: 'biodiversity', label: 'Biodiversity & Canopy', icon: Trees, desc: 'Wildlife corridors & NDVI' },
    { id: 'cities', label: 'Urban & Cities', icon: Building2, desc: 'UHI & concrete sprawl' },
  ];

  const labItems = [
    { id: 'scenarios', label: 'Scenario Comparison', icon: Layers, desc: 'Side-by-side matrices' },
    { id: 'forensics', label: 'Environmental Forensics', icon: Sparkles, desc: 'Satellite change detection' },
    { id: 'forecast', label: 'Future Projections', icon: Calendar, desc: '2030 – 2100 IPCC pathways' },
    { id: 'research', label: 'Scientific Lab', icon: FlaskConical, desc: 'Empirical hypothesis builder' },
    { id: 'decisions', label: 'Decision Center', icon: Scale, desc: 'Cost-impact trade-offs' },
    { id: 'reports', label: 'Executive Reports', icon: FileText, desc: 'Verified PDF dossiers' },
  ];

  const powerItems = [
    { id: 'autopilot', label: 'EarthMind Autopilot', icon: Zap, desc: 'One-click Pareto regional optimizer' },
    { id: 'council', label: 'Multi-Agent Council', icon: Scale, desc: '6 AI domain agents debate' },
    { id: 'future_fork', label: 'Future Fork', icon: Calendar, desc: '2026 → 2050 branching futures' },
    { id: 'compound_disaster', label: 'Compound Disaster', icon: Flame, desc: 'Cascading multi-hazard simulator' },
    { id: 'city_twin', label: '3D City Digital Twin', icon: Building2, desc: 'Canyon heat & cool roof twin' },
    { id: 'causal_graph', label: 'Causal Graph & Feedbacks', icon: Activity, desc: 'Cause-effect DAG & feedbacks' },
    { id: 'satellite_scanner', label: 'Satellite Change Scanner', icon: Satellite, desc: 'Curtain swipe change detection' },
    { id: 'sentinel', label: 'EarthMind Sentinel', icon: Satellite, desc: 'Autonomous anomaly radar & pulse' },
    { id: 'reproducibility', label: 'Reproducibility Mode', icon: ShieldCheck, desc: 'ISO 17025 verifiable ledger' },
    { id: 'battle_mode', label: 'Strategy Battle Mode', icon: Target, desc: 'Business as Usual vs Green Recovery' },
    { id: 'missions', label: 'Mission Mode', icon: Compass, desc: 'Gamified young scientist missions' },
  ];

  const isDomainActive = domainItems.some((d) => d.id === currentView);
  const isLabActive = labItems.some((l) => l.id === currentView);
  const isPowerActive = powerItems.some((p) => p.id === currentView);

  return (
    <header className="sticky top-2 z-40 w-full px-2 sm:px-4 select-none pointer-events-none">
      <div className="max-w-7xl mx-auto rounded-2xl px-3.5 py-2 glass-panel-3 border border-white/15 shadow-2xl backdrop-blur-2xl pointer-events-auto flex items-center justify-between gap-3" ref={dropdownRef}>
        {/* Brand & Logo */}
        <div 
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <EarthMindLogo
            variant="full"
            size="md"
            badgeText="v4.0 OS"
            showTagline
          />
        </div>

        {/* Center Grouped Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 glass-panel-1 px-2.5 py-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => onNavigate('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentView === 'overview'
                ? 'bg-white/15 text-white shadow-sm border border-white/15'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => onNavigate('explorer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentView === 'explorer'
                ? 'bg-white/15 text-white shadow-sm border border-white/15'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explorer</span>
          </button>

          <button
            onClick={() => onNavigate('memory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentView === 'memory'
                ? 'bg-white/15 text-white shadow-sm border border-white/15'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Earth Memory</span>
          </button>

          <button
            onClick={() => onNavigate('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentView === 'simulator'
                ? 'bg-gradient-to-r from-earth-aqua to-earth-emerald text-[#071A2B] font-bold shadow-md shadow-earth-aqua/20'
                : 'text-earth-aqua hover:bg-earth-aqua/10 hover:text-white'
            }`}
          >
            <Sliders className={`w-3.5 h-3.5 ${currentView === 'simulator' ? 'text-[#071A2B]' : ''}`} />
            <span>WHAT-IF?</span>
          </button>

          {/* Group 1: Planetary Domains Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'domains' ? null : 'domains')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isDomainActive
                  ? 'bg-white/15 text-earth-aqua border border-earth-aqua/40 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Domains</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {openDropdown === 'domains' && (
              <div className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl glass-panel-3 border border-white/15 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                {domainItems.map((item) => {
                  const Icon = item.icon;
                  const active = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all ${
                        active
                          ? 'bg-earth-aqua/20 text-white border border-earth-aqua/40'
                          : 'hover:bg-white/5 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-earth-aqua mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold leading-tight">{item.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Group 2: Intelligence & Labs Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'labs' ? null : 'labs')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isLabActive
                  ? 'bg-white/15 text-earth-aurora border border-earth-aurora/40 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Labs & Intel</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {openDropdown === 'labs' && (
              <div className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl glass-panel-3 border border-white/15 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50">
                {labItems.map((item) => {
                  const Icon = item.icon;
                  const active = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all ${
                        active
                          ? 'bg-earth-aurora/20 text-white border border-earth-aurora/40'
                          : 'hover:bg-white/5 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-earth-aurora mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold leading-tight">{item.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Group 3: Power AI & Super-Tools Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'power' ? null : 'power')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isPowerActive
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 font-bold shadow-sm'
                  : 'text-amber-300/90 hover:text-amber-200 hover:bg-amber-400/10'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Super-Tools</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            </button>

            {openDropdown === 'power' && (
              <div className="absolute top-full right-0 mt-2 w-72 p-2 rounded-2xl glass-panel-3 border border-amber-400/30 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 z-50 max-h-[480px] overflow-y-auto custom-scrollbar">
                <div className="px-3 py-1 text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                  ⚡ 120-POWER SYSTEMS & AUTONOMOUS ENGINES
                </div>
                {powerItems.map((item) => {
                  const Icon = item.icon;
                  const active = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all ${
                        active
                          ? 'bg-amber-400/20 text-white border border-amber-400/40'
                          : 'hover:bg-white/5 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold leading-tight">{item.label}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Quick Autopilot Launch Pill */}
          <button
            onClick={() => onNavigate('autopilot')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
              currentView === 'autopilot'
                ? 'bg-amber-400 text-[#071A2B] border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                : 'bg-amber-400/10 text-amber-300 border-amber-400/40 hover:bg-amber-400/20 hover:border-amber-400'
            }`}
            title="Launch EarthMind Autopilot (Feature 120)"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Autopilot</span>
          </button>

          {/* Ambient Voice Status Indicator */}
          <VoiceStatusIndicator />

          {/* Dedicated Voice Intelligence Toggle */}
          <button
            onClick={toggleListening}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isListening
                ? 'bg-earth-aqua text-[#071A2B] border-earth-aqua shadow-[0_0_15px_rgba(24,200,200,0.5)] font-bold'
                : isSpeaking
                ? 'bg-earth-emerald text-[#071A2B] border-earth-emerald animate-pulse'
                : 'glass-panel-1 border-white/10 text-earth-aqua hover:bg-earth-aqua/10 hover:border-earth-aqua/40'
            }`}
            title="Talk to EarthMind Voice Intelligence (Ctrl+Shift+V or Space)"
          >
            <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-pulse' : ''}`} />
            <span className="hidden lg:inline">{isListening ? 'Listening' : isSpeaking ? 'Responding' : 'Voice'}</span>
          </button>

          {/* Quick Search Ctrl+K */}
          <button
            onClick={onOpenCommand}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel-1 border border-white/10 text-xs text-slate-300 hover:text-white hover:glass-panel-2 transition-all"
            title="Open Command Palette (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-earth-aqua" />
            <span className="hidden xl:inline text-[11px] text-slate-400">Ask EarthMind...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded border border-white/10 text-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Appearance Studio (Theme Engine & Liquid Glass) */}
          <button
            onClick={() => toggleAppearanceStudio(true)}
            className="p-2 rounded-xl transition-all border glass-panel-1 border-white/10 text-earth-aurora hover:text-white hover:bg-earth-aurora/20 hover:border-earth-aurora/40 relative shadow-sm"
            title="Appearance Studio (0–100% Planetary Liquid Glass 2.0)"
          >
            <Palette className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-earth-aqua rounded-full animate-ping" />
          </button>

          {/* Settings Console Button */}
          <button
            onClick={() => onNavigate('settings')}
            className={`p-2 rounded-xl transition-all border ${
              currentView === 'settings'
                ? 'bg-white/20 text-white border-white/30 shadow-md'
                : 'glass-panel-1 border-white/10 text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Twin OS 500-Option Config Center"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Exhibition / Judge Presentation Mode */}
          <button
            onClick={onToggleExhibitionMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isExhibitionMode
                ? 'bg-earth-sun text-slate-950 border-earth-sun shadow-[0_0_15px_rgba(255,209,102,0.4)]'
                : 'glass-panel-1 border-white/10 text-earth-sun hover:bg-earth-sun/10'
            }`}
            title="Young Scientist '26 Exhibition Mode for Judges"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Science Expo</span>
          </button>

          {/* Guided Demo Button */}
          <GlassButton
            variant={isDemoActive ? 'danger' : 'emerald'}
            size="sm"
            onClick={onStartGuidedDemo}
            leftIcon={<Play className={`w-3.5 h-3.5 ${isDemoActive ? 'animate-pulse' : ''}`} />}
          >
            <span className="hidden sm:inline">{isDemoActive ? 'Exit Demo' : 'Guided Demo'}</span>
            <span className="sm:hidden">{isDemoActive ? 'Exit' : 'Demo'}</span>
          </GlassButton>

          {/* AI Assistant Drawer Toggle */}
          <button
            onClick={onToggleAi}
            className={`relative p-2 rounded-xl transition-all border ${
              isAiOpen
                ? 'bg-earth-aurora text-white border-earth-aurora shadow-[0_0_20px_rgba(155,124,255,0.4)]'
                : 'glass-panel-1 text-earth-aurora border-white/10 hover:border-earth-aurora/40 hover:bg-earth-aurora/10'
            }`}
            title="EARTHMIND AI Intelligence Assistant"
          >
            <Bot className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-earth-emerald rounded-full border-2 border-[#071A2B] animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  );
};
