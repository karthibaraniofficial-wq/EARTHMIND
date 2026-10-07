import React, { useState, useRef, useEffect } from 'react';
import { GlassSurface } from './GlassSurface';

export interface GlassPopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
}

export const GlassPopover: React.FC<GlassPopoverProps> = ({
  trigger,
  content,
  position = 'bottom-right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const posClasses: Record<string, string> = {
    'bottom-right': 'top-full right-0 mt-2',
    'bottom-left': 'top-full left-0 mt-2',
    'top-right': 'bottom-full right-0 mb-2',
    'top-left': 'bottom-full left-0 mb-2',
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div className={`absolute z-50 ${posClasses[position]} animate-in fade-in zoom-in-95 duration-150`}>
          <GlassSurface
            variant="glass-strong"
            glow="accent"
            className={`p-3 rounded-2xl border-white/20 shadow-2xl ${className}`}
          >
            {content}
          </GlassSurface>
        </div>
      )}
    </div>
  );
};
