import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { GlassSurface } from './GlassSurface';

export interface GlassAccordionItem {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

export interface GlassAccordionProps {
  items: GlassAccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const GlassAccordion: React.FC<GlassAccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(() =>
    items.filter((i) => i.defaultOpen).map((i) => i.id)
  );

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <GlassSurface
            key={item.id}
            variant="glass-soft"
            className="border-white/10 overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between p-3.5 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.icon && <span className="text-[var(--earthmind-accent)]">{item.icon}</span>}
                <div>
                  <div className="text-xs font-bold text-white font-mono">{item.title}</div>
                  {item.subtitle && <div className="text-[10px] text-slate-400 mt-0.5">{item.subtitle}</div>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.badge}
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[var(--earthmind-accent)]' : ''
                  }`}
                />
              </div>
            </button>

            {isOpen && (
              <div className="p-4 pt-1 border-t border-white/5 animate-in fade-in duration-150">
                {item.content}
              </div>
            )}
          </GlassSurface>
        );
      })}
    </div>
  );
};
