import React from 'react';
import { GlassSurface, GlassSurfaceVariant } from './GlassSurface';

export interface GlassPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  variant?: GlassSurfaceVariant;
  glow?: 'none' | 'aqua' | 'emerald' | 'aurora' | 'sun' | 'coral' | 'accent';
  className?: string;
  children: React.ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  title,
  subtitle,
  headerAction,
  variant = 'glass-medium',
  glow = 'none',
  className = '',
  children,
  ...props
}) => {
  return (
    <GlassSurface
      variant={variant}
      glow={glow}
      className={`flex flex-col p-5 ${className}`}
      {...props}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-white/10">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">{title}</h3>
            ) : (
              title
            )}
            {subtitle && (
              <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>
            )}
          </div>
          {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
        </div>
      )}
      <div className="flex-1 w-full">{children}</div>
    </GlassSurface>
  );
};
