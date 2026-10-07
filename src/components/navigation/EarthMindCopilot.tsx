import React, { useState, useEffect } from 'react';
import { Sparkles, X, ArrowRight, Lightbulb } from 'lucide-react';
import { GlassCard } from '../glass/GlassCard';
import { GlassButton } from '../glass/GlassButton';
import { GlassBadge } from '../glass/GlassBadge';
import { EarthMindCopilotEngine, CopilotSuggestion } from '../../earthmind/EarthMindCopilotEngine';
import { EarthMindStateBridge } from '../../earthmind/EarthMindStateBridge';
import { buildScreenContext } from '../../earthmind/EarthMindContext';
import { EarthMindCommandBus } from '../../earthmind/EarthMindCommandBus';

export const EarthMindCopilot: React.FC = () => {
  const [suggestion, setSuggestion] = useState<CopilotSuggestion | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    const update = () => {
      const ctx = EarthMindStateBridge.getContext();
      if (ctx) {
        const screenCtx = buildScreenContext(ctx);
        const next = EarthMindCopilotEngine.getContextualSuggestion(screenCtx);
        setSuggestion(next);
      }
    };

    update();
    const unsubscribe = EarthMindStateBridge.subscribe(update);
    return () => unsubscribe();
  }, []);

  if (!suggestion || isDismissed) return null;

  const handleAction = () => {
    if (suggestion.commandType === 'NAVIGATE_VIEW') {
      EarthMindCommandBus.navigateView(suggestion.payload.view);
    } else if (suggestion.commandType === 'APPLY_SIMULATION') {
      EarthMindCommandBus.setSimulationParameters(suggestion.payload);
      EarthMindCommandBus.navigateView('simulator');
    }
    setIsMinimized(true);
  };

  return (
    <div className="fixed bottom-[calc(var(--statusbar-height,36px)+12px)] left-4 sm:left-[calc(var(--rail-width,64px)+16px)] z-[40] max-w-sm pointer-events-auto transition-all duration-300">
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full glass-panel-2 border border-earth-aqua/30 text-earth-aqua shadow-lg hover:border-earth-aqua/60 hover:scale-105 transition-all text-xs font-mono"
          title="Open EarthMind Copilot Contextual Suggestion"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-earth-aqua" />
          <span>COPILOT INSIGHT</span>
        </button>
      ) : (
        <GlassCard
          variant="strong"
          className="p-4 border-earth-aqua/30 shadow-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-earth-aqua" />
              <span className="text-xs font-mono tracking-wider text-earth-aqua uppercase">
                {suggestion.category} RECOMMENDATION
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-slate-400 hover:text-white p-1 text-xs"
                title="Minimize"
              >
                —
              </button>
              <button
                onClick={() => setIsDismissed(true)}
                className="text-slate-400 hover:text-white p-1"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            <h4 className="text-sm font-semibold text-white leading-tight">
              {suggestion.headline}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {suggestion.body}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="text-xs py-1 px-2.5"
            >
              Later
            </GlassButton>
            <GlassButton
              variant="primary"
              size="sm"
              onClick={handleAction}
              className="text-xs py-1 px-3 flex items-center gap-1.5"
            >
              <span>{suggestion.actionLabel}</span>
              <ArrowRight className="w-3 h-3" />
            </GlassButton>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
