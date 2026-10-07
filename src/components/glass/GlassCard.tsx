import React from 'react';
import { GlassSurface, GlassSurfaceVariant } from './GlassSurface';

export type GlassVariant = 'subtle' | 'medium' | 'strong' | 'highlight' | 'floating';
export type GlowColor = 'none' | 'aqua' | 'emerald' | 'aurora' | 'sun' | 'coral' | 'accent';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: GlassVariant;
  glow?: GlowColor;
  interactive?: boolean;
  className?: string;
  sheen?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'medium',
  glow = 'none',
  interactive = false,
  className = '',
  sheen = true,
  ...props
}) => {
  const surfaceVariantMap: Record<GlassVariant, GlassSurfaceVariant> = {
    subtle: 'glass-soft',
    medium: 'glass-medium',
    strong: 'glass-strong',
    highlight: 'glass-floating',
    floating: 'glass-floating',
  };

  return (
    <GlassSurface
      variant={surfaceVariantMap[variant]}
      glow={glow}
      interactive={interactive}
      sheen={sheen}
      className={`rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </GlassSurface>
  );
};
