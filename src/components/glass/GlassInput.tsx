import React from 'react';

export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ leftIcon, rightIcon, error, label, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="block text-xs font-mono font-medium text-slate-300">{label}</label>}
        <div className="relative flex items-center">
          {leftIcon && <span className="absolute left-3 text-slate-400 pointer-events-none">{leftIcon}</span>}
          <input
            ref={ref}
            className={`w-full py-2 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[var(--earthmind-accent)] focus:ring-1 focus:ring-[var(--earthmind-accent)]/30 transition-all ${
              leftIcon ? 'pl-9' : 'pl-3.5'
            } ${rightIcon ? 'pr-9' : 'pr-3.5'} ${
              error ? 'border-red-500/70 focus:border-red-500' : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && <span className="absolute right-3 text-slate-400">{rightIcon}</span>}
        </div>
        {error && <p className="text-[11px] text-red-400 font-mono mt-0.5">{error}</p>}
      </div>
    );
  }
);
GlassInput.displayName = 'GlassInput';
