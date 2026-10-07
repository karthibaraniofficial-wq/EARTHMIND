import React from 'react';

export type IconButtonVariant = 'primary' | 'ghost' | 'glass' | 'danger' | 'accent';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface GlassIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  active?: boolean;
  tooltip?: string;
  badge?: React.ReactNode;
}

export const GlassIconButton: React.FC<GlassIconButtonProps> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  active = false,
  tooltip,
  badge,
  className = '',
  ...props
}) => {
  const sizeMap: Record<IconButtonSize, string> = {
    xs: 'w-7 h-7 text-xs rounded-lg',
    sm: 'w-8 h-8 text-sm rounded-xl',
    md: 'w-10 h-10 text-base rounded-xl',
    lg: 'w-12 h-12 text-lg rounded-2xl',
  };

  const variantMap: Record<IconButtonVariant, string> = {
    primary: 'bg-gradient-to-r from-earth-ocean to-earth-aqua text-white shadow-lg border border-white/20',
    ghost: 'glass-panel-1 text-slate-300 hover:text-white hover:glass-panel-2 border border-white/10',
    glass: 'glass-panel-2 text-white hover:border-[var(--earthmind-accent)]/50 border border-white/20 shadow-md',
    danger: 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40',
    accent: 'bg-[var(--earthmind-accent-soft)] text-[var(--earthmind-accent)] border border-[var(--earthmind-accent)]/40 hover:bg-[var(--earthmind-accent)]/20',
  };

  const activeClasses = active
    ? 'border-[var(--earthmind-accent)] bg-[var(--earthmind-accent-soft)] text-white shadow-[0_0_15px_var(--earthmind-glow)]'
    : '';

  return (
    <button
      title={tooltip}
      className={`relative inline-flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none select-none overflow-hidden ${sizeMap[size]} ${variantMap[variant]} ${activeClasses} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center">{icon}</span>
      {badge && <span className="absolute -top-1 -right-1 z-20">{badge}</span>}
    </button>
  );
};
