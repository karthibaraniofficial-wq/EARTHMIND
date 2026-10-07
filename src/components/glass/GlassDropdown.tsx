import React, { useState, useRef, useEffect } from 'react';
import { GlassSurface } from './GlassSurface';

export interface GlassDropdownItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  desc?: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface GlassDropdownProps {
  trigger: React.ReactNode;
  items: GlassDropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const GlassDropdown: React.FC<GlassDropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 z-50 min-w-[200px] ${
            align === 'right' ? 'right-0' : 'left-0'
          } animate-in fade-in zoom-in-95 duration-150`}
        >
          <GlassSurface
            variant="glass-strong"
            className={`p-1.5 rounded-2xl border-white/20 shadow-2xl space-y-1 ${className}`}
          >
            {items.map((item) => (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-mono transition-all ${
                  item.danger
                    ? 'text-red-400 hover:bg-red-500/15'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                } ${item.disabled ? 'opacity-40 pointer-events-none' : ''}`}
              >
                {item.icon && <span className="flex-shrink-0 text-earth-aqua">{item.icon}</span>}
                <div>
                  <div className="leading-tight font-medium">{item.label}</div>
                  {item.desc && <div className="text-[10px] text-slate-400 font-sans mt-0.5">{item.desc}</div>}
                </div>
              </button>
            ))}
          </GlassSurface>
        </div>
      )}
    </div>
  );
};
