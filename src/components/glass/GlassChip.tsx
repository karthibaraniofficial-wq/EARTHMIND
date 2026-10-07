import React from 'react';

export interface GlassChipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  active?: boolean;
  leftIcon?: React.ReactNode;
  onRemove?: () => void;
  clickable?: boolean;
}

export const GlassChip: React.FC<GlassChipProps> = ({
  children,
  active = false,
  leftIcon,
  onRemove,
  clickable = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium backdrop-blur-md border transition-all select-none ${
        active
          ? 'bg-[var(--earthmind-accent-soft)] border-[var(--earthmind-accent)] text-white shadow-sm'
          : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
      } ${clickable ? 'cursor-pointer active:scale-95' : ''} ${className}`}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-red-400 text-slate-400 font-bold"
        >
          ×
        </button>
      )}
    </div>
  );
};
