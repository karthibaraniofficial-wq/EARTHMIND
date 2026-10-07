import React from 'react';

export type GlassSurfaceVariant =
  | 'glass-soft'
  | 'glass-medium'
  | 'glass-strong'
  | 'glass-floating'
  | 'glass-panel'
  | 'glass-modal'
  | 'glass-command'
  | 'glass-tooltip';

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  variant?: GlassSurfaceVariant;
  intensity?: number;        // 0 - 100 override
  blur?: number;             // px override
  opacity?: number;          // 0 - 1 override
  border?: boolean | string;
  shadow?: boolean | string;
  glow?: 'none' | 'aqua' | 'emerald' | 'aurora' | 'sun' | 'coral' | 'accent';
  radius?: number | string;  // px override
  interactive?: boolean;
  elevation?: number;        // 0 - 100
  sheen?: boolean;
  className?: string;
}

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  variant = 'glass-medium',
  intensity,
  blur,
  opacity,
  border = true,
  shadow = true,
  glow = 'none',
  radius,
  interactive = false,
  elevation,
  sheen = true,
  className = '',
  style = {},
  ...props
}) => {
  const variantClassMap: Record<GlassSurfaceVariant, string> = {
    'glass-soft': 'glass-panel-1',
    'glass-medium': 'glass-panel-2',
    'glass-strong': 'glass-panel-3',
    'glass-floating': 'glass-panel-highlight',
    'glass-panel': 'glass-panel-2',
    'glass-modal': 'glass-modal',
    'glass-command': 'glass-command',
    'glass-tooltip': 'glass-tooltip',
  };

  const glowStyles: Record<string, string> = {
    none: '',
    aqua: 'border-earth-aqua/30 shadow-[0_0_30px_rgba(24,200,200,0.18)]',
    emerald: 'border-earth-emerald/30 shadow-[0_0_30px_rgba(39,201,138,0.18)]',
    aurora: 'border-earth-aurora/35 shadow-[0_0_35px_rgba(155,124,255,0.22)]',
    sun: 'border-earth-sun/30 shadow-[0_0_30px_rgba(255,209,102,0.18)]',
    coral: 'border-earth-coral/30 shadow-[0_0_30px_rgba(255,107,107,0.18)]',
    accent: 'border-[var(--earthmind-accent)]/30 shadow-[0_0_30px_var(--earthmind-glow)]',
  };

  const interactiveClasses = interactive
    ? 'glass-card-interactive cursor-pointer active:scale-[0.99] transition-transform duration-200'
    : '';

  const dynamicStyles: React.CSSProperties = {
    ...style,
    ...(blur !== undefined ? { backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)` } : {}),
    ...(opacity !== undefined ? { opacity } : {}),
    ...(radius !== undefined ? { borderRadius: typeof radius === 'number' ? `${radius}px` : radius } : {}),
    ...(border === false ? { border: 'none' } : typeof border === 'string' ? { border } : {}),
    ...(shadow === false ? { boxShadow: 'none' } : typeof shadow === 'string' ? { boxShadow: shadow } : {}),
  };

  return (
    <div
      className={`relative overflow-hidden ${variantClassMap[variant]} ${glowStyles[glow]} ${interactiveClasses} ${className}`}
      style={dynamicStyles}
      {...props}
    >
      {/* Dynamic Specular Sheen reacting to pointer movement */}
      {sheen && <div className="liquid-glass-sheen" />}

      {/* Subtle top edge highlight line for physical realism */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {children}
    </div>
  );
};
