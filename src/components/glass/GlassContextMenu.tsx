import React, { useState, useEffect } from 'react';
import { GlassSurface } from './GlassSurface';

export interface GlassContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

export interface GlassContextMenuProps {
  children: React.ReactNode;
  items: GlassContextMenuItem[];
  className?: string;
}

export const GlassContextMenu: React.FC<GlassContextMenuProps> = ({
  children,
  items,
  className = '',
}) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleClick = () => setPosition(null);
    if (position) {
      document.addEventListener('click', handleClick);
    }
    return () => document.removeEventListener('click', handleClick);
  }, [position]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onContextMenu={handleContextMenu} className={className}>
      {children}

      {position && (
        <div
          className="fixed z-50 animate-in fade-in zoom-in-95 duration-100 min-w-[180px]"
          style={{ top: position.y, left: position.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <GlassSurface
            variant="glass-strong"
            className="p-1 rounded-xl border-white/20 shadow-2xl space-y-0.5"
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  setPosition(null);
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-xs font-mono transition-colors ${
                  item.danger
                    ? 'text-red-400 hover:bg-red-500/20'
                    : 'text-slate-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon && <span className="text-earth-aqua">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </GlassSurface>
        </div>
      )}
    </div>
  );
};
