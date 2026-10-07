import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface GlassSelectOption {
  value: string;
  label: string;
  desc?: string;
}

export interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: GlassSelectOption[];
}

export const GlassSelect: React.FC<GlassSelectProps> = ({
  label,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-xs font-mono font-medium text-slate-300">{label}</label>}
      <div className="relative">
        <select
          className={`w-full appearance-none py-2 pl-3.5 pr-8 bg-slate-900/70 backdrop-blur-md rounded-xl border border-white/15 text-white text-sm focus:outline-none focus:border-[var(--earthmind-accent)] transition-all cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#071A2B] text-slate-100">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
