import React from 'react';

export interface GlassToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  desc?: string;
  className?: string;
}

export const GlassToggle: React.FC<GlassToggleProps> = ({
  label,
  checked,
  onChange,
  desc,
  className = '',
}) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/10 hover:border-white/20 transition-all cursor-pointer select-none ${className}`}
    >
      <div className="pr-4">
        <div className="text-xs font-bold text-white font-mono">{label}</div>
        {desc && <div className="text-[10px] text-slate-400 mt-0.5">{desc}</div>}
      </div>

      <div
        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 border ${
          checked
            ? 'bg-[var(--earthmind-accent)] border-[var(--earthmind-accent)] shadow-[0_0_12px_var(--earthmind-glow)]'
            : 'bg-slate-800/80 border-white/10'
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </div>
  );
};
