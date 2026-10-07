import React from 'react';

export interface GlassSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  desc?: string;
  accentColor?: string;
  className?: string;
}

export const GlassSlider: React.FC<GlassSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  desc,
  accentColor = 'var(--earthmind-accent)',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className={`space-y-1.5 p-3 rounded-xl glass-panel-1 border border-white/10 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="font-semibold text-white font-mono">{label}</span>
          {desc && <div className="text-[10px] text-slate-400 font-sans mt-0.5">{desc}</div>}
        </div>
        <div className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 font-mono text-xs font-bold text-white shadow-inner">
          {value}
          {unit}
        </div>
      </div>

      <div className="relative flex items-center py-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800/80 focus:outline-none"
          style={{
            background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${percentage}%, rgba(30, 41, 59, 0.8) ${percentage}%, rgba(30, 41, 59, 0.8) 100%)`,
          }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};
