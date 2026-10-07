import React from 'react';
import { Activity, ShieldCheck, Cpu, HardDrive } from 'lucide-react';
import { EarthMindCommandBus } from '../../earthmind/EarthMindCommandBus';

interface StatusBarProps {
  activeHotspotName?: string;
  activeScenarioName?: string;
  simEngineStatus?: 'IDLE' | 'CALCULATING' | 'RECONVERGED';
  onOpenMethodology?: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  activeHotspotName = 'Indo-Gangetic Basin',
  activeScenarioName = 'Business as Usual',
  simEngineStatus = 'RECONVERGED',
  onOpenMethodology,
}) => {
  return (
    <footer className="w-full px-4 py-2 bg-[#051320]/90 backdrop-blur-md border-t border-white/5 select-none text-[11px] text-slate-400 font-mono flex flex-wrap items-center justify-between gap-3">
      {/* Left: System status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-earth-emerald animate-pulse" />
          <span className="text-white font-medium">EARTHMIND NEURAL TWIN</span>
          <span className="text-slate-500">|</span>
          <span className="text-earth-aqua">SIMULATION ONLINE</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-earth-aurora" />
          <span>Engine: <span className="text-slate-200">{simEngineStatus}</span></span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-slate-400">
          <Activity className="w-3.5 h-3.5 text-earth-leaf" />
          <span>Convergence: <span className="text-slate-200">0.92</span></span>
        </div>
      </div>

      {/* Center: Context labels & Information Density Switcher */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5">
          <span className="text-slate-500">Target:</span>
          <span className="text-earth-sky font-semibold">{activeHotspotName}</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5">
          <span className="text-slate-500">Scenario:</span>
          <span className="text-earth-sun font-semibold">{activeScenarioName}</span>
        </div>

        {/* Phase 29: Information Density Mode Switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px]">
          {(['focus', 'data', 'expert'] as const).map((density) => (
            <button
              key={density}
              onClick={() => {
                document.documentElement.setAttribute('data-density', density);
                EarthMindCommandBus.setDensityMode(density);
              }}
              className="px-2 py-0.5 rounded uppercase font-mono transition-colors text-slate-400 hover:text-white hover:bg-white/10"
              title={`Switch UI Information Density: ${density.toUpperCase()}`}
            >
              {density}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Data integrity & timestamp */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMethodology}
          className="flex items-center gap-1 text-slate-300 hover:text-earth-aqua px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          title="Inspect Data Governance & Methodology"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-earth-emerald" />
          <span>Methodology & Data</span>
        </button>
        <span className="text-slate-500">|</span>
        <div className="flex items-center gap-1 text-slate-500">
          <HardDrive className="w-3 h-3" />
          <span>OCT 2026 REPO</span>
        </div>
      </div>
    </footer>
  );
};
