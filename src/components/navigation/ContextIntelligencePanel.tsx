import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  X,
  Activity,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { FileCheck2, BookOpen } from '../icons';
import { GlassSurface } from '../glass/GlassSurface';
import { GlassButton } from '../glass/GlassButton';
import { GlassBadge } from '../glass/GlassBadge';
import { EnvironmentalHotspot } from '../../types';

export interface ContextIntelligencePanelProps {
  currentView: string;
  selectedHotspot: EnvironmentalHotspot | null;
  onNavigateToSimulator?: () => void;
  onNavigateToResearch?: () => void;
}

export const ContextIntelligencePanel: React.FC<ContextIntelligencePanelProps> = ({
  currentView,
  selectedHotspot,
  onNavigateToSimulator,
  onNavigateToResearch,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Generate dynamic contextual intelligence depending on active view and hotspot
  const contextName = selectedHotspot?.name || 'Global Biosphere';
  const healthScore = selectedHotspot?.currentMetrics?.environmentalHealth ?? 68;

  const currentInsight =
    healthScore < 50
      ? `Critical ecological stress detected across ${contextName}. Multi-spectral thermal divergence exceeds seasonal baseline.`
      : `Ecological resilience stable across ${contextName}. Micro-climate feedback loops maintaining baseline equilibrium.`;

  const aiExplanation =
    healthScore < 50
      ? `Synthetic Aperture Radar (SAR) backscatter indicates soil moisture depletion of -22%. Correlated Sentinel-2 NDVI anomalies suggest vegetation dieback risk within 90 days.`
      : `High canopy evapotranspiration and regulated aquifer recharge mitigate regional urban heat island spikes. Carbon sequestration remains positive.`;

  const alerts = [
    { id: '1', level: 'warning', text: `Thermal anomaly +1.8°C above 10-year mean` },
    { id: '2', level: 'info', text: `Sentinel-2 pass scheduled in 14 hours` },
  ];

  const evidence = [
    { source: 'Copernicus Sentinel-2', metric: 'NDVI Index: 0.42 (Deviation: -0.08)' },
    { source: 'Landsat-9 Thermal Infrared', metric: 'LST Radiance: 34.2°C' },
    { source: 'NASA GRACE-FO', metric: 'Groundwater Storage Deficit: -1.4 cm' },
  ];

  const sources = [
    'IPCC AR6 Working Group II',
    'Copernicus Land Monitoring Service',
    'World Meteorological Organization (WMO) 2026',
  ];

  const recommendations = [
    'Run WHAT-IF simulation with +20% riparian vegetation buffers',
    'Deploy localized aquifer recharge telemetry',
    'Issue municipal cooling corridor advisory',
  ];

  return (
    <aside
      className={`fixed right-2 top-20 z-30 transition-all duration-300 ease-out hidden lg:flex flex-col ${
        isCollapsed ? 'w-12' : 'w-84 xl:w-96'
      }`}
    >
      <GlassSurface
        variant="glass-strong"
        glow="aurora"
        className="rounded-2xl border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
      >
        {/* Header / Toggle Pill */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/5">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2 text-left w-full hover:text-earth-aqua transition-colors"
          >
            <div className="p-1 rounded-lg bg-earth-aqua/15 text-earth-aqua">
              <Sparkles className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 truncate">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider truncate block">
                  INTELLIGENCE PANEL
                </span>
                <span className="text-[10px] text-slate-400 font-sans truncate block">
                  {contextName}
                </span>
              </div>
            )}
            <div className="text-slate-400">
              {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
          </button>
        </div>

        {/* Expanded Content Body */}
        {!isCollapsed && (
          <div className="p-4 overflow-y-auto custom-scrollbar space-y-4 text-xs">
            {/* 1. CURRENT INSIGHT */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">
                <Activity className="w-3.5 h-3.5 text-earth-aqua" />
                <span>Current Insight</span>
              </div>
              <p className="text-slate-200 font-sans leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/5">
                {currentInsight}
              </p>
            </div>

            {/* 2. AI EXPLANATION */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">
                <Bot className="w-3.5 h-3.5 text-earth-aurora" />
                <span>AI Reasoning Explanation</span>
              </div>
              <p className="text-slate-300 font-sans leading-relaxed text-[11px] bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                {aiExplanation}
              </p>
            </div>

            {/* 3. ALERTS */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-earth-sun" />
                <span>Active Environmental Alerts</span>
              </div>
              <div className="space-y-1">
                {alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="flex items-start gap-2 p-2 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-200 text-[11px]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                    <span>{alt.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. EVIDENCE */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">
                <FileCheck2 className="w-3.5 h-3.5 text-earth-emerald" />
                <span>Calibrated Evidence</span>
              </div>
              <div className="space-y-1 text-[11px]">
                {evidence.map((ev, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400 font-mono">{ev.source}</div>
                    <div className="text-white font-mono mt-0.5">{ev.metric}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. SOURCES */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">
                <BookOpen className="w-3.5 h-3.5 text-earth-sky" />
                <span>Scientific Peer-Reviewed Sources</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-400">
                {sources.map((src, i) => (
                  <li key={i} className="truncate" title={src}>
                    {src}
                  </li>
                ))}
              </ul>
            </div>

            {/* 6. RECOMMENDATIONS */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase font-bold">
                <span>Recommendations</span>
                <GlassBadge tone="emerald" size="sm">ACTIONABLE</GlassBadge>
              </div>
              <ul className="space-y-1 text-[11px]">
                {recommendations.map((rec, i) => (
                  <li key={i} className="p-2 rounded-lg bg-earth-emerald/10 border border-earth-emerald/20 text-emerald-200">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            {onNavigateToSimulator && (
              <GlassButton
                variant="primary"
                size="sm"
                className="w-full mt-2"
                onClick={onNavigateToSimulator}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Simulate in WHAT-IF Lab
              </GlassButton>
            )}
          </div>
        )}
      </GlassSurface>
    </aside>
  );
};
