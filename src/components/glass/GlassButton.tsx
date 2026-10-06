import React from 'react';

export type ButtonVariant = 'primary' | 'emerald' | 'aurora' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none relative overflow-hidden active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-to-r from-earth-ocean to-earth-aqua text-white shadow-[0_0_20px_rgba(24,200,200,0.3)] hover:shadow-[0_0_30px_rgba(24,200,200,0.5)] border border-white/20 hover:border-white/40',
    emerald: 'bg-gradient-to-r from-emerald-600 to-earth-emerald text-white shadow-[0_0_20px_rgba(39,201,138,0.3)] hover:shadow-[0_0_30px_rgba(39,201,138,0.5)] border border-white/20 hover:border-white/40',
    aurora: 'bg-gradient-to-r from-purple-600 to-earth-aurora text-white shadow-[0_0_20px_rgba(155,124,255,0.3)] hover:shadow-[0_0_30px_rgba(155,124,255,0.5)] border border-white/20 hover:border-white/40',
    ghost: 'glass-panel-1 text-slate-200 hover:text-white hover:glass-panel-2 border border-white/10 hover:border-white/25',
    danger: 'bg-gradient-to-r from-red-600 to-earth-coral text-white shadow-[0_0_20px_rgba(255,107,107,0.3)] hover:shadow-[0_0_30px_rgba(255,107,107,0.5)] border border-white/20 hover:border-white/40',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Top subtle highlight shimmer */}
      <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}

      <span>{children}</span>

      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
