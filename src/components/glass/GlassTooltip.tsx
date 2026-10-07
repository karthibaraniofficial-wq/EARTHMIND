import React, { useState } from 'react';

export interface GlassTooltipContent {
  title?: string;
  value?: string | number;
  unit?: string;
  timestamp?: string;
  source?: string;
  confidence?: 'High' | 'Medium' | 'Low' | string;
  uncertainty?: string;
  notes?: string;
}

export interface GlassTooltipProps {
  children: React.ReactNode;
  content: GlassTooltipContent | string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const GlassTooltip: React.FC<GlassTooltipProps> = ({
  children,
  content,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const posClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const isComplex = typeof content === 'object';

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          className={`absolute z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 ${posClasses[position]}`}
        >
          <div className="glass-tooltip p-3 text-xs w-56 text-slate-200 border border-white/20 shadow-2xl rounded-xl space-y-1.5">
            {!isComplex ? (
              <div className="font-sans text-xs">{content}</div>
            ) : (
              <>
                {content.title && (
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {content.title}
                  </div>
                )}
                {content.value !== undefined && (
                  <div className="text-base font-bold text-white font-mono flex items-baseline gap-1">
                    <span>{content.value}</span>
                    {content.unit && <span className="text-xs text-[var(--earthmind-accent)]">{content.unit}</span>}
                  </div>
                )}
                {content.timestamp && (
                  <div className="text-[10px] text-slate-400 font-mono">
                    Time: {content.timestamp}
                  </div>
                )}
                {content.source && (
                  <div className="text-[10px] text-slate-400">
                    Source: <span className="text-slate-300 font-mono">{content.source}</span>
                  </div>
                )}
                {(content.confidence || content.uncertainty) && (
                  <div className="flex items-center gap-1.5 pt-1 border-t border-white/10 text-[10px] font-mono">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="text-earth-emerald font-semibold">{content.confidence || 'High'}</span>
                    {content.uncertainty && <span className="text-slate-400">({content.uncertainty})</span>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
