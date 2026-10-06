import React from 'react';

export type GlassVariant = 'subtle' | 'medium' | 'strong' | 'highlight';
export type GlowColor = 'none' | 'aqua' | 'emerald' | 'aurora' | 'sun' | 'coral';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: GlassVariant;
  glow?: GlowColor;
  interactive?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'medium',
  glow = 'none',
  interactive = false,
  className = '',
  ...props
}) => {
  const variantStyles: Record<GlassVariant, string> = {
    subtle: 'glass-panel-1',
    medium: 'glass-panel-2',
    strong: 'glass-panel-3',
    highlight: 'glass-panel-highlight',
  };

  const glowStyles: Record<GlowColor, string> = {
    none: '',
    aqua: 'border-earth-aqua/30 shadow-[0_0_30px_rgba(24,200,200,0.15)]',
    emerald: 'border-earth-emerald/30 shadow-[0_0_30px_rgba(39,201,138,0.15)]',
    aurora: 'border-earth-aurora/35 shadow-[0_0_35px_rgba(155,124,255,0.18)]',
    sun: 'border-earth-sun/30 shadow-[0_0_30px_rgba(255,209,102,0.15)]',
    coral: 'border-earth-coral/30 shadow-[0_0_30px_rgba(255,107,107,0.15)]',
  };

  const interactiveStyle = interactive
    ? 'glass-card-interactive cursor-pointer active:scale-[0.99]'
    : '';

  return (
    <div
      className={`rounded-2xl transition-all duration-300 relative overflow-hidden ${variantStyles[variant]} ${glowStyles[glow]} ${interactiveStyle} ${className}`}
      {...props}
    >
      {/* Subtle top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
