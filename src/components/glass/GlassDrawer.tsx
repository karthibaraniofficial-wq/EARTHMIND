import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { GlassSurface } from './GlassSurface';

export interface GlassDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  position?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const GlassDrawer: React.FC<GlassDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  position = 'right',
  size = 'md',
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<string, string> = {
    sm: position === 'bottom' ? 'h-72' : 'w-80',
    md: position === 'bottom' ? 'h-96' : 'w-96',
    lg: position === 'bottom' ? 'h-[500px]' : 'w-[480px]',
    xl: position === 'bottom' ? 'h-[640px]' : 'w-[600px]',
  };

  const posClasses: Record<string, string> = {
    right: 'inset-y-0 right-0 animate-in slide-in-from-right duration-250',
    left: 'inset-y-0 left-0 animate-in slide-in-from-left duration-250',
    bottom: 'inset-x-0 bottom-0 animate-in slide-in-from-bottom duration-250',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className={`fixed ${posClasses[position]} ${sizeClasses[size]} max-w-full z-50 flex flex-col`}>
        <GlassSurface
          variant="glass-strong"
          glow="accent"
          className="h-full w-full flex flex-col border-white/20 shadow-2xl rounded-none md:rounded-l-2xl overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div>
              {typeof title === 'string' ? (
                <h3 className="text-base font-bold text-white font-mono uppercase">{title}</h3>
              ) : (
                title
              )}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1">{children}</div>
        </GlassSurface>
      </div>
    </div>
  );
};
