import React from 'react';
import { EarthMindSymbol } from './EarthMindSymbol';
import { BRAND_TOKENS } from './brand';

export interface EarthMindLoadingProps {
  progress?: number;
  statusText?: string;
  subText?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const EarthMindLoading: React.FC<EarthMindLoadingProps> = ({
  progress,
  statusText = 'INITIALIZING PLANETARY INTELLIGENCE...',
  subText = 'Calibrating Multi-Spectral Satellite Rasters & Biophysical Twins',
  size = 'md',
  fullScreen = false,
}) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50 bg-[#071A2B]/95 backdrop-blur-2xl flex items-center justify-center p-4'
    : 'w-full h-full min-h-[220px] flex items-center justify-center p-4';

  const symbolSize = size === 'sm' ? 44 : size === 'lg' ? 84 : 64;

  return (
    <div className={containerClass}>
      <div className="glass-panel-3 p-6 sm:p-8 rounded-3xl border border-earth-aqua/30 shadow-[0_0_50px_rgba(24,200,200,0.18)] max-w-sm w-full text-center space-y-4">
        {/* Animated Brand Symbol with pulsing orbital aura */}
        <div className="relative mx-auto w-fit">
          <div className="absolute -inset-3 rounded-full bg-earth-aqua/15 blur-lg animate-pulse pointer-events-none" />
          <EarthMindSymbol
            size={symbolSize}
            variant="primary"
            animated="orbit"
            className="relative drop-shadow-[0_0_15px_rgba(24,200,200,0.4)]"
          />
        </div>

        {/* Telemetry Status Messages */}
        <div className="space-y-1">
          <div className="text-xs sm:text-sm font-bold font-mono text-white tracking-wider flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-earth-aqua animate-ping" />
            {statusText}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-tight">
            {subText}
          </div>
        </div>

        {/* Optional Progress Bar */}
        {typeof progress === 'number' && (
          <div className="space-y-1.5 pt-1">
            <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-earth-aqua via-earth-emerald to-earth-aurora rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>{BRAND_TOKENS.name} OS</span>
              <span className="text-earth-aqua font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
