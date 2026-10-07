import React, { useState } from 'react';
import {
  Globe2,
  Compass,
  Clock,
  Sliders,
  Droplets,
  Flame,
  Trees,
  Wind,
  Building2,
  HeartHandshake,
  AlertTriangle,
  FlaskConical,
  FileText,
  Mic,
  Presentation,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Layers,
  Zap,
} from 'lucide-react';
import { Palette, GraduationCap, ShieldCheck } from '../icons';
import { useEarthMindTheme } from '../../theme/ThemeProvider';

export type RailMode = 'icon' | 'compact' | 'full';

export interface LeftNavRailProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAppearanceStudio?: () => void;
  onToggleExhibition?: () => void;
  onOpenVoice?: () => void;
}

export const LeftNavRail: React.FC<LeftNavRailProps> = ({
  currentView,
  onNavigate,
  onOpenAppearanceStudio,
  onToggleExhibition,
  onOpenVoice,
}) => {
  const [mode, setMode] = useState<RailMode>('icon');
  const [isHovered, setIsHovered] = useState(false);
  const { toggleAppearanceStudio } = useEarthMindTheme();

  // Hover expands when collapsed in 'icon' mode
  const effectiveMode = isHovered && mode === 'icon' ? 'compact' : mode;

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Globe2, desc: 'Global Twin Telemetry' },
    { id: 'explorer', label: 'Earth Explorer', icon: Compass, desc: '3D Multi-Spectral Stage' },
    { id: 'climate', label: 'Climate & Carbon', icon: Flame, desc: 'Emissions & Heat Anomaly' },
    { id: 'water', label: 'Water Intelligence', icon: Droplets, desc: 'Lakes & Aquifers' },
    { id: 'biodiversity', label: 'Biodiversity', icon: Trees, desc: 'Forest Canopy & Wildlife' },
    { id: 'cities', label: 'Urban & Cities', icon: Building2, desc: 'Urban Heat Island' },
    { id: 'simulator', label: 'Simulation Lab', icon: Sliders, desc: 'WHAT-IF? Biophysics' },
    { id: 'future_fork', label: 'Future Fork', icon: Clock, desc: 'Branching Scenarios' },
    { id: 'research', label: 'Research & Lab', icon: FlaskConical, desc: 'Empirical Hypotheses' },
    { id: 'forensics', label: 'Forensics', icon: Layers, desc: 'Satellite Change Audit' },
    { id: 'reports', label: 'Reports', icon: FileText, desc: 'Verified Dossiers' },
    { id: 'autopilot', label: 'Autopilot', icon: Zap, desc: 'Pareto Optimization' },
    { id: 'academy', label: 'Academy', icon: GraduationCap, desc: 'Biophysical Quizzes' },
    { id: 'quality', label: 'Data Quality', icon: ShieldCheck, desc: 'Sensor Governance' },
  ];

  const widthClass =
    effectiveMode === 'full'
      ? 'w-60'
      : effectiveMode === 'compact'
      ? 'w-48'
      : 'w-14';

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-2 top-20 bottom-12 z-30 transition-all duration-300 ease-out flex flex-col ${widthClass} hidden md:flex pointer-events-auto`}
    >
      <div className="h-full w-full rounded-2xl glass-panel-2 border border-white/10 shadow-2xl flex flex-col justify-between p-2 overflow-hidden backdrop-blur-2xl">
        {/* Top Header & Rail Mode Toggle */}
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/10 mb-2">
          {effectiveMode !== 'icon' ? (
            <span className="text-[10px] font-mono uppercase tracking-wider text-earth-aqua font-bold truncate">
              NAVIGATION
            </span>
          ) : (
            <div className="w-2 h-2 rounded-full bg-earth-aqua mx-auto" />
          )}

          <button
            onClick={() => setMode(mode === 'icon' ? 'compact' : mode === 'compact' ? 'full' : 'icon')}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Toggle Rail Expansion Mode"
          >
            {mode === 'icon' ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : mode === 'compact' ? (
              <Maximize2 className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={effectiveMode === 'icon' ? item.label : undefined}
                className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-earth-aqua text-[#071A2B] font-bold shadow-md shadow-earth-aqua/25'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-[#071A2B]' : 'text-earth-aqua'
                  }`}
                />
                {effectiveMode !== 'icon' && (
                  <div className="overflow-hidden truncate">
                    <div className="text-xs font-mono font-medium truncate leading-tight">
                      {item.label}
                    </div>
                    {effectiveMode === 'full' && (
                      <div
                        className={`text-[9px] font-sans truncate ${
                          isActive ? 'text-[#071A2B]/80' : 'text-slate-400'
                        }`}
                      >
                        {item.desc}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Fast Access Studio & Voice Tools */}
        <div className="pt-2 border-t border-white/10 space-y-1">
          <button
            onClick={() => toggleAppearanceStudio(true)}
            title="Appearance Studio (Theme Engine)"
            className="w-full flex items-center gap-2.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Palette className="w-4 h-4 text-earth-aurora flex-shrink-0" />
            {effectiveMode !== 'icon' && (
              <span className="text-xs font-mono font-bold truncate">Appearance Studio</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
