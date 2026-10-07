import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { GlassSurface } from './GlassSurface';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface GlassToastProps {
  id: string;
  type?: ToastType;
  title: string;
  message?: string;
  onClose?: (id: string) => void;
  className?: string;
}

export const GlassToast: React.FC<GlassToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const iconMap: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-4 h-4 text-earth-emerald flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-earth-sun flex-shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-earth-coral flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-earth-aqua flex-shrink-0" />,
  };

  const glowMap: Record<ToastType, 'emerald' | 'sun' | 'coral' | 'aqua'> = {
    success: 'emerald',
    warning: 'sun',
    error: 'coral',
    info: 'aqua',
  };

  return (
    <GlassSurface
      variant="glass-floating"
      glow={glowMap[type]}
      className={`p-3.5 pr-8 flex items-start gap-3 rounded-2xl border border-white/20 shadow-2xl relative animate-in slide-in-from-top-2 duration-200 max-w-sm ${className}`}
    >
      {iconMap[type]}
      <div className="flex-1">
        <h4 className="text-xs font-bold text-white font-mono leading-tight">{title}</h4>
        {message && <p className="text-[11px] text-slate-300 font-sans mt-0.5 leading-snug">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={() => onClose(id)}
          className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </GlassSurface>
  );
};
