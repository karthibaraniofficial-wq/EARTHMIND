import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe2, 
  Compass, 
  Clock, 
  Sparkles, 
  Sliders, 
  Layers, 
  FileText, 
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
  ShieldCheck
} from 'lucide-react';
import { Palette, GraduationCap, PanelRight, PanelRightClose, Menu, X, Laptop } from '../components/icons';
import { GlassBadge } from '../components/glass/GlassBadge';
import { useVoice } from '../voice/VoiceContext';
import { useEarthMindTheme } from '../theme/ThemeProvider';
import { useAppShell } from './AppShellContext';

export interface GlobalTopBarProps {
  onOpenCommand: () => void;
  onToggleAi: () => void;
  isAiOpen: boolean;
  onStartGuidedDemo: () => void;
  isDemoActive: boolean;
  onToggleExhibitionMode: () => void;
  isExhibitionMode: boolean;
}

export const GlobalTopBar: React.FC<GlobalTopBarProps> = ({
  onOpenCommand,
  onToggleAi,
  isAiOpen,
  onStartGuidedDemo,
  isDemoActive,
  onToggleExhibitionMode,
  isExhibitionMode,
}) => {
  const { 
    currentView, 
    onNavigate, 
    contextPanelOpen, 
    toggleContextPanel, 
    isMobileNavOpen, 
    setIsMobileNavOpen,
    disclosureMode,
    setDisclosureMode
  } = useAppShell();
  const { toggleListening, isListening, isSpeaking } = useVoice();
  const { toggleAppearanceStudio } = useEarthMindTheme();
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
    { id: 'satellite_scanner', label: 'Satellite Scanner', icon: Satellite, desc: 'Curtain swipe change detection' },
    { id: 'sentinel', label: 'EarthMind Sentinel', icon: Satellite, desc: 'Autonomous anomaly radar & pulse' },
    { id: 'battle_mode', label: 'Policy Arena (Battle)', icon: Scale, desc: 'Gamified Pareto policy showdown' },
    { id: 'missions', label: 'Planetary Missions', icon: Globe2, desc: 'Guided scenario challenges' },
    { id: 'academy', label: 'EarthMind Academy', icon: GraduationCap, desc: 'Biophysical interactive curriculum' },
    { id: 'quality', label: 'Data Quality & Uncertainty', icon: ShieldCheck, desc: 'Sensor health, latency & confidence' },
  ];

  const isDomainActive = domainItems.some((d) => d.id === currentView);
  const isLabActive = labItems.some((l) => l.id === currentView);
  const isPowerActive = powerItems.some((p) => p.id === currentView);

  return (
    <header className="h-[56px] w-full border-b border-white/10 bg-[#071A2B]/95 backdrop-blur-xl flex items-center justify-between px-3 sm:px-4 z-[30] relative select-none">
      {/* LEFT: Identity */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden"
          title="Toggle Navigation Menu"
        >
          {isMobileNavOpen ? <X className="w-5 h-5 text-earth-aqua" /> : <Menu className="w-5 h-5" />}
        </button>

        <div 
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-earth-deep via-earth-ocean to-earth-aqua p-[1px] shadow-[0_0_15px_rgba(24,200,200,0.3)] group-hover:shadow-[0_0_20px_rgba(24,200,200,0.5)] transition-all">
            <div className="w-full h-full bg-[#071A2B] rounded-[7px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-earth-aqua">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
                <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
                <path d="M3.6 9h16.8M3.6 15h16.8" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" />
                <circle cx="12" cy="12" r="2.2" fill="#27C98A" />
                <circle cx="7" cy="8" r="1.4" fill="#18C8C8" />
                <circle cx="17" cy="8" r="1.4" fill="#9B7CFF" />
              </svg>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-extrabold tracking-wider text-sm sm:text-base text-white font-mono">
              EARTH<span className="text-earth-aqua">MIND</span>
            </span>
            <GlassBadge tone="aqua" size="sm">
              v4.0 OS
            </GlassBadge>
            <span className="text-[10px] text-slate-400 font-mono tracking-tight hidden xl:inline">
              PLANETARY INTELLIGENCE
            </span>
          </div>
        </div>
      </div>

      {/* CENTER: Navigation Links (Desktop) */}
      <nav 
        ref={dropdownRef}
        className="hidden lg:flex items-center gap-1 glass-panel-1 px-2 py-1 rounded-xl border border-white/10"
      >
        <button
          onClick={() => onNavigate('overview')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            currentView === 'overview'
              ? 'bg-white/15 text-white shadow-sm border border-white/15'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5 text-earth-sky" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => onNavigate('explorer')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            currentView === 'explorer'
              ? 'bg-white/15 text-white shadow-sm border border-white/15'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-earth-leaf" />
          <span>Explorer</span>
        </button>

        <button
          onClick={() => onNavigate('memory')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            currentView === 'memory'
              ? 'bg-white/15 text-white shadow-sm border border-white/15'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-earth-aurora" />
          <span>Earth Memory</span>
        </button>

        <button
          onClick={() => onNavigate('simulator')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
            currentView === 'simulator'
              ? 'bg-gradient-to-r from-earth-aqua to-earth-emerald text-[#071A2B] shadow-md shadow-earth-aqua/20'
              : 'text-earth-aqua hover:bg-earth-aqua/10 hover:text-white'
          }`}
        >
          <Sliders className={`w-3.5 h-3.5 ${currentView === 'simulator' ? 'text-[#071A2B]' : ''}`} />
          <span>WHAT-IF?</span>
        </button>

        {/* Dropdown: Domains */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'domains' ? null : 'domains')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              isDomainActive
                ? 'bg-white/15 text-earth-aqua border border-earth-aqua/40 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Domains</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {openDropdown === 'domains' && (
            <div className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl glass-panel-3 border border-white/15 shadow-2xl space-y-1 z-[60] animate-in fade-in zoom-in-95 duration-150">
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
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                      active
                        ? 'bg-earth-aqua text-[#071A2B] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#071A2B]' : 'text-earth-aqua'}`} />
                    <div>
                      <div className="text-xs font-semibold leading-tight">{item.label}</div>
                      <div className={`text-[10px] ${active ? 'text-[#071A2B]/80' : 'text-slate-400'}`}>
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dropdown: Labs & Intel */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'labs' ? null : 'labs')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              isLabActive
                ? 'bg-white/15 text-earth-aqua border border-earth-aqua/40 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Labs & Intel</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {openDropdown === 'labs' && (
            <div className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl glass-panel-3 border border-white/15 shadow-2xl space-y-1 z-[60] animate-in fade-in zoom-in-95 duration-150">
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
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                      active
                        ? 'bg-earth-aqua text-[#071A2B] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#071A2B]' : 'text-earth-aqua'}`} />
                    <div>
                      <div className="text-xs font-semibold leading-tight">{item.label}</div>
                      <div className={`text-[10px] ${active ? 'text-[#071A2B]/80' : 'text-slate-400'}`}>
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dropdown: Super-Tools */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'power' ? null : 'power')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              isPowerActive
                ? 'bg-earth-sun/20 text-earth-sun border border-earth-sun/40 font-semibold'
                : 'text-earth-sun/90 hover:text-earth-sun hover:bg-earth-sun/10'
            }`}
          >
            <Sparkles className="w-3 h-3 text-earth-sun" />
            <span>Super-Tools</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {openDropdown === 'power' && (
            <div className="absolute top-full right-0 mt-2 w-72 p-2 rounded-2xl glass-panel-3 border border-white/15 shadow-2xl space-y-1 max-h-96 overflow-y-auto custom-scrollbar z-[60] animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-earth-sun font-bold">
                Advanced Intelligence Tools
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
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                      active
                        ? 'bg-earth-sun text-[#071A2B] font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#071A2B]' : 'text-earth-sun'}`} />
                    <div>
                      <div className="text-xs font-semibold leading-tight">{item.label}</div>
                      <div className={`text-[10px] ${active ? 'text-[#071A2B]/80' : 'text-slate-400'}`}>
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* RIGHT: Actions & Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Progressive Disclosure Mode Segmented Control (FOCUS | DATA | EXPERT | EXPO) */}
        <div className="hidden 2xl:flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10 text-[10px] font-mono">
          {(['focus', 'data', 'expert', 'exhibition'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setDisclosureMode(m);
                if (m === 'exhibition' && !isExhibitionMode) {
                  onToggleExhibitionMode();
                } else if (m !== 'exhibition' && isExhibitionMode) {
                  onToggleExhibitionMode();
                }
              }}
              className={`px-2 py-0.5 rounded uppercase font-bold tracking-wider transition-all ${
                disclosureMode === m
                  ? 'bg-earth-aqua text-[#071A2B] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m === 'exhibition' ? 'EXPO' : m}
            </button>
          ))}
        </div>

        {/* Command Search (Ctrl+K) */}
        <button
          onClick={onOpenCommand}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg glass-panel-1 border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:border-earth-aqua/40 transition-all"
          title="Search anything across EarthMind (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-earth-aqua" />
          <span>Search</span>
          <kbd className="px-1 py-0.2 rounded bg-white/10 text-[10px] text-slate-400">⌘K</kbd>
        </button>

        {/* Autopilot quick jump */}
        <button
          onClick={() => onNavigate('autopilot')}
          className={`hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
            currentView === 'autopilot'
              ? 'bg-earth-sun text-[#071A2B] font-bold'
              : 'text-earth-sun hover:bg-earth-sun/10 border border-earth-sun/30'
          }`}
          title="Open Autopilot Regional Optimizer"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Autopilot</span>
        </button>

        {/* AI Assistant drawer trigger */}
        <button
          onClick={onToggleAi}
          className={`p-1.5 rounded-lg border transition-all ${
            isAiOpen
              ? 'bg-earth-aurora text-[#071A2B] border-earth-aurora shadow-lg shadow-earth-aurora/30'
              : 'text-slate-300 hover:text-white glass-panel-1 border-white/10 hover:border-earth-aurora/40'
          }`}
          title="AI Planetary Assistant"
        >
          <Bot className="w-4 h-4 text-earth-aurora" />
        </button>

        {/* Appearance Studio 2.0 */}
        <button
          onClick={() => toggleAppearanceStudio()}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white glass-panel-1 border border-white/10 hover:border-earth-aqua/40 transition-all"
          title="Open Liquid Glass Appearance Studio (Themes & Customization)"
        >
          <Palette className="w-4 h-4 text-earth-aqua" />
        </button>

        {/* Context Panel Toggle (Dock / Undock) */}
        <button
          onClick={() => toggleContextPanel()}
          className={`p-1.5 rounded-lg border transition-all hidden lg:flex items-center ${
            contextPanelOpen
              ? 'bg-earth-aqua/20 text-earth-aqua border-earth-aqua/50'
              : 'text-slate-400 hover:text-white glass-panel-1 border-white/10'
          }`}
          title={contextPanelOpen ? 'Collapse Intelligence Panel' : 'Dock Intelligence Panel'}
        >
          {contextPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
        </button>

        {/* Settings button */}
        <button
          onClick={() => onNavigate('settings')}
          className={`p-1.5 rounded-lg border transition-all ${
            currentView === 'settings'
              ? 'bg-white/20 text-white border-white/30'
              : 'text-slate-400 hover:text-white glass-panel-1 border-white/10'
          }`}
          title="System Settings & Telemetry"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* MOBILE DRAWER: When hamburger is clicked */}
      {isMobileNavOpen && (
        <div className="absolute top-[56px] inset-x-0 bg-[#071A2B]/98 backdrop-blur-2xl border-b border-white/15 p-4 z-[80] lg:hidden space-y-4 max-h-[calc(100vh-56px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { onNavigate('overview'); setIsMobileNavOpen(false); }}
              className="p-2.5 rounded-xl glass-panel-1 border border-white/10 text-left text-xs font-semibold text-white flex items-center gap-2"
            >
              <Globe2 className="w-4 h-4 text-earth-sky" /> Overview
            </button>
            <button
              onClick={() => { onNavigate('explorer'); setIsMobileNavOpen(false); }}
              className="p-2.5 rounded-xl glass-panel-1 border border-white/10 text-left text-xs font-semibold text-white flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-earth-leaf" /> Explorer
            </button>
            <button
              onClick={() => { onNavigate('memory'); setIsMobileNavOpen(false); }}
              className="p-2.5 rounded-xl glass-panel-1 border border-white/10 text-left text-xs font-semibold text-white flex items-center gap-2"
            >
              <Clock className="w-4 h-4 text-earth-aurora" /> Earth Memory
            </button>
            <button
              onClick={() => { onNavigate('simulator'); setIsMobileNavOpen(false); }}
              className="p-2.5 rounded-xl bg-earth-aqua text-[#071A2B] text-left text-xs font-bold flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" /> WHAT-IF?
            </button>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Planetary Domains</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {domainItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setIsMobileNavOpen(false); }}
                  className="p-2 rounded-lg text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <item.icon className="w-3.5 h-3.5 text-earth-aqua" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Super Tools</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {powerItems.slice(0, 8).map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setIsMobileNavOpen(false); }}
                  className="p-2 rounded-lg text-left text-xs text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                >
                  <item.icon className="w-3.5 h-3.5 text-earth-sun" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
