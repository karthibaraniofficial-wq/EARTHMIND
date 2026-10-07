import React from 'react';
import {
  Globe2,
  Compass,
  Clock,
  Sliders,
  Droplets,
  Flame,
  Trees,
  Building2,
  FlaskConical,
  FileText,
  ChevronLeft,
  ChevronRight,
  Layers,
  Zap,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { GraduationCap, ShieldCheck } from '../components/icons';
import { useAppShell } from './AppShellContext';

export const SideRail: React.FC = () => {
  const { currentView, onNavigate, railExpanded, toggleRail } = useAppShell();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Globe2, desc: 'Global Telemetry' },
    { id: 'explorer', label: 'Earth Explorer', icon: Compass, desc: '3D Stage' },
    { id: 'climate', label: 'Climate & Carbon', icon: Flame, desc: 'Thermal Radiance' },
    { id: 'water', label: 'Water Intelligence', icon: Droplets, desc: 'Aquifers & Rivers' },
    { id: 'biodiversity', label: 'Biodiversity', icon: Trees, desc: 'Canopy & Wildlife' },
    { id: 'cities', label: 'Urban & Cities', icon: Building2, desc: 'Urban Heat Island' },
    { id: 'simulator', label: 'Simulation Lab', icon: Sliders, desc: 'WHAT-IF Biophysics' },
    { id: 'future_fork', label: 'Future Fork', icon: Clock, desc: 'Branching Futures' },
    { id: 'sentinel', label: 'Sentinel Radar', icon: ShieldAlert, desc: 'Autonomous Pulse' },
    { id: 'research', label: 'Research & Lab', icon: FlaskConical, desc: 'Scientific Hypotheses' },
    { id: 'forensics', label: 'Forensics', icon: Layers, desc: 'Change Detection' },
    { id: 'reports', label: 'Reports', icon: FileText, desc: 'Verified Dossiers' },
    { id: 'autopilot', label: 'Autopilot', icon: Zap, desc: 'Pareto Optimizer' },
    { id: 'academy', label: 'Academy', icon: GraduationCap, desc: 'Earth Curriculum' },
    { id: 'quality', label: 'Data Quality', icon: ShieldCheck, desc: 'Sensor Uncertainty' },
  ];

  return (
    <aside className="w-full h-full border-r border-white/10 bg-[#071A2B]/90 backdrop-blur-xl flex flex-col justify-between p-2 select-none">
      {/* Rail Header / Expand Toggle */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/10 mb-2">
        {railExpanded ? (
          <span className="text-[10px] font-mono uppercase tracking-wider text-earth-aqua font-bold truncate">
            NAVIGATION
          </span>
        ) : (
          <div className="w-2 h-2 rounded-full bg-earth-aqua mx-auto" />
        )}

        <button
          onClick={toggleRail}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title={railExpanded ? 'Collapse Navigation Rail (64px)' : 'Expand Navigation Rail (260px)'}
        >
          {railExpanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={!railExpanded ? item.label : undefined}
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
              {railExpanded && (
                <div className="overflow-hidden truncate">
                  <div className="text-xs font-mono font-medium truncate leading-tight">
                    {item.label}
                  </div>
                  <div
                    className={`text-[9px] font-sans truncate ${
                      isActive ? 'text-[#071A2B]/80' : 'text-slate-400'
                    }`}
                  >
                    {item.desc}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Rail Footer */}
      <div className="pt-2 border-t border-white/10 text-center">
        {railExpanded ? (
          <div className="text-[10px] font-mono text-slate-500 truncate">
            EARTHMIND SPATIAL OS
          </div>
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-slate-600 mx-auto" />
        )}
      </div>
    </aside>
  );
};
