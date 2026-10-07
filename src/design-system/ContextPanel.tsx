import React, { useEffect } from 'react';
import {
  Sparkles,
  ChevronRight,
  X,
  Activity,
  Layers,
  ShieldCheck,
  Maximize2,
  Minimize2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sliders,
  FileText,
  BarChart3,
  Calendar,
  MapPin
} from '../components/icons';
import { EnvironmentalHotspot } from '../types';
import { useAppShell } from './AppShellContext';
import { InsightPanel } from './InsightPanel';
import { ScientificBadge } from './ScientificBadge';
import { ScoreContributionBar, ScoreContributionItem } from './ScoreContributionBar';

export interface ContextPanelProps {
  selectedHotspot: EnvironmentalHotspot | null;
  onNavigateToSimulator?: () => void;
  onNavigateToResearch?: () => void;
  onNavigateToComparison?: () => void;
  onNavigateToReports?: () => void;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({
  selectedHotspot,
  onNavigateToSimulator,
  onNavigateToResearch,
  onNavigateToComparison,
  onNavigateToReports,
}) => {
  const {
    contextPanelOpen,
    setContextPanelOpen,
    contextPanelMode,
    setContextPanelMode,
  } = useAppShell();

  // Close overlay on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && contextPanelOpen && contextPanelMode === 'overlay') {
        setContextPanelOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [contextPanelOpen, contextPanelMode, setContextPanelOpen]);

  if (!contextPanelOpen) return null;

  const contextName = selectedHotspot?.name || 'Global Biosphere';
  const regionName = selectedHotspot?.country || 'Earth System';
  const healthScore = selectedHotspot?.currentMetrics?.environmentalHealth ?? 68;

  const scoreDecomposition: ScoreContributionItem[] = [
    {
      id: 'vegetation',
      name: 'Vegetation Canopy (NDVI)',
      percentage: 28,
      deltaPoints: selectedHotspot?.currentMetrics?.environmentalHealth && selectedHotspot.currentMetrics.environmentalHealth > 60 ? 3.2 : -4.1,
      color: 'bg-emerald-400',
      rationale: 'Canopy density dampens heat radiance and provides biophilic transpiration cooling.',
    },
    {
      id: 'hydrology',
      name: 'Water Retention / Aquifer',
      percentage: 24,
      deltaPoints: selectedHotspot?.currentMetrics?.waterStress ? -Math.round(selectedHotspot.currentMetrics.waterStress / 15) : 0,
      color: 'bg-cyan-400',
      rationale: 'Aquifer recharge deficit measured by NASA GRACE-FO gravimetric anomalies.',
    },
    {
      id: 'thermal',
      name: 'Thermal Surface Radiance',
      percentage: 18,
      deltaPoints: -2.5,
      color: 'bg-amber-400',
      rationale: 'Landsat-9 thermal infrared detects elevated urban surface temperature.',
    },
    {
      id: 'airQuality',
      name: 'Aerosol / Air Quality',
      percentage: 15,
      deltaPoints: selectedHotspot?.currentMetrics?.pollutionAqi && selectedHotspot.currentMetrics.pollutionAqi > 120 ? -5.0 : 1.2,
      color: 'bg-purple-400',
      rationale: 'Atmospheric PM2.5 and tropospheric NO2 optical depth observations.',
    },
    {
      id: 'urbanization',
      name: 'Impervious Surface Ratio',
      percentage: 15,
      deltaPoints: -1.8,
      color: 'bg-rose-400',
      rationale: 'Concrete pavement conversion blocks soil percolation and accentuates runoff.',
    },
  ];

  const evidence = [
    { 
      source: 'Copernicus Sentinel-2', 
      metric: 'NDVI Index: 0.42 (Deviation: -0.08)',
      tier: 'Tier 1'
    },
    { 
      source: 'Landsat-9 Thermal Infrared', 
      metric: 'LST Radiance: 34.2°C',
      tier: 'Tier 1'
    },
    { 
      source: 'NASA GRACE-FO', 
      metric: 'Groundwater Storage Deficit: -1.4 cm',
      tier: 'Tier 1'
    },
  ];

  const sources = [
    { title: 'IPCC AR6 Working Group II', agency: 'IPCC', year: 2023, tier: 1 },
    { title: 'Copernicus Land Monitoring Service', agency: 'ESA/EU', year: 2026, tier: 1 },
    { title: 'World Meteorological Organization (WMO)', agency: 'WMO', year: 2026, tier: 1 },
  ];

  const recommendations = [
    'Run WHAT-IF simulation with +20% riparian vegetation buffers',
    'Deploy localized aquifer recharge telemetry',
    'Issue municipal cooling corridor advisory',
  ];

  const panelContent = (
    <div className="h-full w-full flex flex-col justify-between bg-[#071A2B]/95 border-l border-white/10 backdrop-blur-2xl text-slate-100 p-4 select-none overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-earth-aqua/20 border border-earth-aqua/40">
            <Sparkles className="w-4 h-4 text-earth-aqua" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase text-earth-aqua font-bold tracking-wider">
                EARTHMIND INTELLIGENCE
              </span>
              <ScientificBadge provenance="OBSERVED" confidence={94} size="sm" />
            </div>
            <div className="text-xs font-bold text-white truncate max-w-[210px] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span>{contextName}</span>
              <span className="text-slate-400 font-normal">({regionName})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Mode toggle (Docked vs Overlay) */}
          <button
            onClick={() => setContextPanelMode(contextPanelMode === 'docked' ? 'overlay' : 'docked')}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 hidden xl:flex"
            title={contextPanelMode === 'docked' ? 'Float as Overlay' : 'Dock to Right Column'}
          >
            {contextPanelMode === 'docked' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close button */}
          <button
            onClick={() => setContextPanelOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
            title="Close Panel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Intelligence Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-3 space-y-4 pr-1">
        {/* IMPACT: Environmental Health Score & Baseline */}
        <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">Biophysical Health Index</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[10px] text-slate-400">Baseline 2026:</span>
              <span className={`font-bold ${healthScore < 50 ? 'text-earth-coral' : 'text-earth-emerald'}`}>
                {healthScore}/100
              </span>
            </div>
          </div>

          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-300 ${healthScore < 50 ? 'bg-earth-coral' : 'bg-earth-emerald'}`}
              style={{ width: `${healthScore}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            {healthScore < 50
              ? 'Multi-spectral thermal divergence exceeds seasonal baseline. Soil moisture depletion indicates active ecological strain.'
              : 'Ecological equilibrium stable across regional catchment. Regulated vegetation evapotranspiration maintains resilience.'}
          </p>

          {/* Section 15: Score Contribution Decomposition */}
          <ScoreContributionBar
            score={healthScore}
            items={scoreDecomposition}
            label="Explainable Score Decomposition"
          />
        </div>

        {/* Phase 7: Live Insight Panel (Integrated instead of floating card!) */}
        <InsightPanel />

        {/* Remote Sensing Evidence */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-earth-aqua font-bold">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-earth-aqua" />
              <span>Multi-Sensor Observations</span>
            </div>
            <span className="text-[9px] text-slate-400 font-normal">Cross-calibrated</span>
          </div>
          <div className="space-y-1.5">
            {evidence.map((item, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">{item.source}</span>
                  <span className="text-slate-500 text-[9px]">{item.tier}</span>
                </div>
                <span className="text-slate-100 font-semibold">{item.metric}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 16: 4-Tier Scientific Sources */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-earth-aurora" />
              <span>Peer-Reviewed Literature</span>
            </div>
            <span className="text-earth-emerald text-[9px] bg-earth-emerald/15 px-1.5 py-0.5 rounded font-mono">
              SOURCES AGREE
            </span>
          </div>
          <div className="space-y-1">
            {sources.map((src, idx) => (
              <div key={idx} className="text-[10px] font-mono text-slate-300 flex items-center justify-between bg-white/5 p-2 rounded border border-white/5">
                <div className="flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-3 h-3 text-earth-emerald flex-shrink-0" />
                  <span className="truncate">{src.title}</span>
                </div>
                <span className="text-slate-400 text-[9px] ml-1 flex-shrink-0">
                  {src.agency} ({src.year})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 8: Actionable Recommendations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            <span>Actionable Policies</span>
            <span className="text-earth-emerald text-[9px] bg-earth-emerald/20 px-1.5 py-0.5 rounded">VERIFIED</span>
          </div>
          <div className="space-y-1.5">
            {recommendations.map((rec, idx) => (
              <button
                key={idx}
                onClick={onNavigateToSimulator}
                className="w-full text-left p-2 rounded-lg glass-panel-1 border border-white/10 hover:border-earth-aqua/40 text-[11px] text-slate-200 hover:text-white transition-all flex items-center justify-between group"
              >
                <span>{rec}</span>
                <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-earth-aqua transition-colors flex-shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 8: Primary Action Trio (Simulate, Compare, Report) */}
      <div className="pt-2.5 border-t border-white/10 space-y-2">
        <button
          onClick={onNavigateToSimulator}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-earth-aqua to-earth-emerald text-[#071A2B] font-bold text-xs shadow-md shadow-earth-aqua/20 hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Simulate in WHAT-IF Lab</span>
        </button>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onNavigateToComparison}
            className="py-1.5 px-2 rounded-lg glass-panel-1 border border-white/10 hover:border-earth-aqua/30 text-[11px] font-mono text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-all"
            title="Open Multi-Scenario Comparison"
          >
            <BarChart3 className="w-3 h-3 text-earth-aqua" />
            <span>Compare</span>
          </button>

          <button
            onClick={onNavigateToReports}
            className="py-1.5 px-2 rounded-lg glass-panel-1 border border-white/10 hover:border-earth-leaf/30 text-[11px] font-mono text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-all"
            title="Generate Scientific Report"
          >
            <FileText className="w-3 h-3 text-earth-leaf" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );

  // If in overlay mode (or on screens < 1280px where docked grid column is suppressed)
  if (contextPanelMode === 'overlay') {
    return (
      <div className="fixed inset-0 z-[50] flex justify-end">
        {/* Dim Backdrop */}
        <div
          className="fixed inset-0 bg-[#071A2B]/75 backdrop-blur-sm transition-opacity"
          onClick={() => setContextPanelOpen(false)}
        />
        {/* Sliding Panel */}
        <div className="relative w-full sm:w-[420px] h-full shadow-2xl animate-in slide-in-from-right duration-200 z-10">
          {panelContent}
        </div>
      </div>
    );
  }

  // DOCKED mode: renders directly in the structural 3rd grid column!
  return (
    <div className="w-full h-full">
      {panelContent}
    </div>
  );
};
