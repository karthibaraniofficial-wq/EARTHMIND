import React from 'react';

export type BadgeTone = 'aqua' | 'emerald' | 'leaf' | 'sky' | 'aurora' | 'sun' | 'coral' | 'neutral';

interface GlassBadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  pulse?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  children,
  tone = 'neutral',
  pulse = false,
  className = '',
  size = 'md',
}) => {
  const toneStyles: Record<BadgeTone, { bg: string; text: string; border: string; dot: string }> = {
    aqua: {
      bg: 'bg-earth-aqua/10',
      text: 'text-earth-aqua',
      border: 'border-earth-aqua/30',
      dot: 'bg-earth-aqua',
    },
    emerald: {
      bg: 'bg-earth-emerald/10',
      text: 'text-earth-emerald',
      border: 'border-earth-emerald/30',
      dot: 'bg-earth-emerald',
    },
    leaf: {
      bg: 'bg-earth-leaf/10',
      text: 'text-earth-leaf',
      border: 'border-earth-leaf/30',
      dot: 'bg-earth-leaf',
    },
    sky: {
      bg: 'bg-earth-sky/10',
      text: 'text-earth-sky',
      border: 'border-earth-sky/30',
      dot: 'bg-earth-sky',
    },
    aurora: {
      bg: 'bg-earth-aurora/10',
      text: 'text-earth-aurora',
      border: 'border-earth-aurora/30',
      dot: 'bg-earth-aurora',
    },
    sun: {
      bg: 'bg-earth-sun/10',
      text: 'text-earth-sun',
      border: 'border-earth-sun/30',
      dot: 'bg-earth-sun',
    },
    coral: {
      bg: 'bg-earth-coral/10',
      text: 'text-earth-coral',
      border: 'border-earth-coral/30',
      dot: 'bg-earth-coral',
    },
    neutral: {
      bg: 'bg-white/5',
      text: 'text-slate-300',
      border: 'border-white/10',
      dot: 'bg-slate-400',
    },
  };

  const current = toneStyles[tone];
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-md ${current.bg} ${current.text} ${current.border} ${sizeClass} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`} />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${current.dot}`} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};
