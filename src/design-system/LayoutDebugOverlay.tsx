import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertCircle, X, Maximize2, Activity } from '../components/icons';
import { useAppShell } from './AppShellContext';

interface RegionMetrics {
  name: string;
  selector: string;
  rect: { x: number; y: number; width: number; height: number };
  zIndex: string;
  overflow: string;
  hasCollision?: boolean;
}

export const LayoutDebugOverlay: React.FC = () => {
  const { layoutDebug, toggleLayoutDebug, railExpanded, contextPanelOpen, contextPanelMode } = useAppShell();
  const [metrics, setMetrics] = useState<RegionMetrics[]>([]);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [hasHorizontalOverflow, setHasHorizontalOverflow] = useState(false);

  useEffect(() => {
    if (!layoutDebug) return;

    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setViewport({ width: vw, height: vh });
      setHasHorizontalOverflow(document.documentElement.scrollWidth > vw);

      const targets = [
        { name: 'TOP BAR', selector: 'header' },
        { name: 'SIDE RAIL', selector: '.earthmind-side-rail-region' },
        { name: 'MAIN VIEWPORT', selector: '.earthmind-main-viewport' },
        { name: 'CONTEXT PANEL', selector: '.earthmind-context-panel-region' },
        { name: 'STATUS BAR', selector: 'footer' },
        { name: 'VOICE DOCK', selector: '[data-region="voice-dock"]' },
      ];

      const scanned: RegionMetrics[] = [];
      for (const t of targets) {
        const el = document.querySelector(t.selector) as HTMLElement | null;
        if (el) {
          const b = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          scanned.push({
            name: t.name,
            selector: t.selector,
            rect: {
              x: Math.round(b.x),
              y: Math.round(b.y),
              width: Math.round(b.width),
              height: Math.round(b.height),
            },
            zIndex: style.zIndex,
            overflow: style.overflow,
          });
        }
      }

      setMetrics(scanned);
    };

    measure();
    const interval = setInterval(measure, 1500);
    window.addEventListener('resize', measure);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', measure);
    };
  }, [layoutDebug, railExpanded, contextPanelOpen, contextPanelMode]);

  if (!layoutDebug) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] border-2 border-dashed border-earth-aqua/40">
      {/* Visual Bounding Box Highlights for active regions */}
      {metrics.map((m) => (
        <div
          key={m.name}
          style={{
            position: 'absolute',
            left: `${m.rect.x}px`,
            top: `${m.rect.y}px`,
            width: `${m.rect.width}px`,
            height: `${m.rect.height}px`,
          }}
          className="border border-earth-aqua/50 bg-earth-aqua/5 pointer-events-none transition-all duration-200"
        >
          <span className="absolute top-0.5 left-1 bg-slate-950/90 text-earth-aqua text-[9px] font-mono px-1 py-0.5 rounded border border-earth-aqua/30">
            [{m.name}] {m.rect.width}×{m.rect.height} (z:{m.zIndex})
          </span>
        </div>
      ))}

      {/* Floating HUD Diagnostic Card */}
      <div className="absolute top-16 left-6 pointer-events-auto bg-[#071A2B]/95 text-slate-100 p-3.5 rounded-2xl border border-earth-aqua/50 shadow-2xl backdrop-blur-2xl max-w-sm text-xs font-mono space-y-2">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-1.5 text-earth-aqua font-bold">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>LAYOUT DIAGNOSTICS HUD</span>
          </div>
          <button
            onClick={toggleLayoutDebug}
            className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
            title="Close Layout HUD (Ctrl+Shift+L)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between text-slate-400">
            <span>Viewport:</span>
            <span className="text-white font-bold">{viewport.width} × {viewport.height}px</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Horiz Overflow:</span>
            <span className={hasHorizontalOverflow ? 'text-earth-coral font-bold' : 'text-earth-emerald'}>
              {hasHorizontalOverflow ? 'DETECTED!' : 'NONE (Clean)'}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Rail State:</span>
            <span className="text-earth-aqua font-bold">{railExpanded ? 'Expanded (260px)' : 'Icon (64px)'}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Context Panel:</span>
            <span className="text-earth-aurora font-bold">
              {contextPanelOpen ? `${contextPanelMode.toUpperCase()} (Docked)` : 'CLOSED (0px)'}
            </span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-2 space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Landmarks Scanned:</div>
          <div className="max-h-36 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {metrics.map((m) => (
              <div key={m.name} className="flex items-center justify-between text-[10px] bg-white/5 px-2 py-0.5 rounded">
                <span className="text-slate-300 truncate">{m.name}:</span>
                <span className="text-earth-aqua font-mono">{m.rect.width}×{m.rect.height}px</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[9px] text-slate-400 italic text-center pt-1 border-t border-white/5">
          Press Ctrl+Shift+L to toggle diagnostics
        </div>
      </div>
    </div>
  );
};
