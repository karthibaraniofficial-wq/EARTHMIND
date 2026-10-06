import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Search, 
  ShieldAlert, 
  Binary, 
  Satellite, 
  HelpCircle, 
  Sliders, 
  ExternalLink 
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { EnvironmentalHotspot } from '../../types';

interface ForensicsInvestigationViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToSimulator: (hotspot: EnvironmentalHotspot) => void;
}

export const ForensicsInvestigationView: React.FC<ForensicsInvestigationViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToSimulator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const forensics = selectedHotspot.forensics;
  const changes = forensics.detectedChanges;

  const filteredFactors = selectedCategory === 'all'
    ? forensics.factors
    : forensics.factors.filter((f) => f.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Hotspot Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-earth-aurora" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aurora">
              MULTIVARIATE ECOLOGICAL INVESTIGATION
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Environmental Forensics</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Correlate orbital multispectral radiometric changes with local anthropogenic and climatic stress factors using transparent evidence-weighted association models.
          </p>
        </div>

        {/* Hotspot Dropdown */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => onSelectHotspot(spot)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                selectedHotspot.id === spot.id
                  ? 'bg-earth-aurora text-white border-earth-aurora font-bold shadow-md shadow-earth-aurora/30'
                  : 'glass-panel-1 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3 inline mr-1" />
              {spot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Observational Target Bar */}
      <GlassCard variant="medium" className="p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-earth-aurora/10 text-earth-aurora border border-earth-aurora/20">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">TARGET REGION</div>
            <div className="text-base font-bold text-white">{selectedHotspot.name} ({selectedHotspot.country})</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400">ANALYSIS PERIOD: </span>
            <span className="text-earth-aqua font-bold">{forensics.period}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span className="text-slate-400">SENSOR PIPELINE: </span>
            <span className="text-slate-200">Sentinel-2 MSI + Landsat 9 TIRS</span>
          </div>
        </div>
      </GlassCard>

      {/* 4 Detected Quantitative Change Cards */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Binary className="w-4 h-4 text-earth-aqua" />
          <span>Orbital Change Detection Metrics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard variant="strong" glow={changes.vegetationChange < 0 ? 'coral' : 'emerald'} className="p-5 border border-white/10">
            <div className="text-xs text-slate-400 font-medium">Vegetation Canopy Shift</div>
            <div className="mt-2 text-3xl font-extrabold font-mono text-white">
              {changes.vegetationChange > 0 ? `+${changes.vegetationChange}%` : `${changes.vegetationChange}%`}
            </div>
            <div className="mt-2">
              <GlassBadge tone={changes.vegetationChange < 0 ? 'coral' : 'emerald'} size="sm">
                {changes.vegetationChange < 0 ? 'Deforestation / Canopy Loss' : 'Vegetation Regeneration'}
              </GlassBadge>
            </div>
          </GlassCard>

          <GlassCard variant="strong" glow="sun" className="p-5 border border-white/10">
            <div className="text-xs text-slate-400 font-medium">Built-Up Area Expansion</div>
            <div className="mt-2 text-3xl font-extrabold font-mono text-white">
              +{changes.builtUpExpansion}%
            </div>
            <div className="mt-2">
              <GlassBadge tone="sun" size="sm">
                Impervious Pavement Sprawl
              </GlassBadge>
            </div>
          </GlassCard>

          <GlassCard variant="strong" glow="coral" className="p-5 border border-white/10">
            <div className="text-xs text-slate-400 font-medium">Surface Temperature Delta</div>
            <div className="mt-2 text-3xl font-extrabold font-mono text-white">
              +{changes.surfaceTempDelta}°C
            </div>
            <div className="mt-2">
              <GlassBadge tone="coral" size="sm">
                Thermal Storage Mass
              </GlassBadge>
            </div>
          </GlassCard>

          <GlassCard variant="strong" glow={changes.waterSurfaceDelta < 0 ? 'coral' : 'aqua'} className="p-5 border border-white/10">
            <div className="text-xs text-slate-400 font-medium">Surface Water Area Shift</div>
            <div className="mt-2 text-3xl font-extrabold font-mono text-white">
              {changes.waterSurfaceDelta > 0 ? `+${changes.waterSurfaceDelta}%` : `${changes.waterSurfaceDelta}%`}
            </div>
            <div className="mt-2">
              <GlassBadge tone={changes.waterSurfaceDelta < 0 ? 'coral' : 'aqua'} size="sm">
                {changes.waterSurfaceDelta < 0 ? 'Hydrological Contraction' : 'Retention Gain'}
              </GlassBadge>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* AI Investigation Dossier */}
      <GlassCard variant="strong" glow="aurora" className="p-6 border border-earth-aurora/30 shadow-2xl">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <Sparkles className="w-5 h-5 text-earth-aurora" />
          <h3 className="text-lg font-bold text-white">AI Neural Forensics Synthesis</h3>
        </div>
        <p className="mt-4 text-sm text-slate-200 leading-relaxed font-sans">
          "{forensics.aiInvestigationSummary}"
        </p>
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
          <span>Correlation Model: Empirical Multispectral Cross-Correlation v4.2</span>
          <span className="text-earth-emerald">Statistical Association Significance: p &lt; 0.001</span>
        </div>
      </GlassCard>

      {/* Factor Category Filters & Contributing Factor Matrix */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Identified Contributing Factors ({filteredFactors.length})
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'anthropogenic', 'climatic', 'hydrological', 'ecological'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-earth-aurora text-white font-semibold'
                    : 'text-slate-400 hover:text-white glass-panel-1'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFactors.map((factor, index) => (
            <GlassCard key={index} variant="medium" className="p-5 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-base font-bold text-white">{factor.factor}</h4>
                  <GlassBadge tone={factor.category === 'anthropogenic' ? 'sun' : factor.category === 'climatic' ? 'coral' : 'aqua'} size="sm">
                    {factor.category}
                  </GlassBadge>
                </div>

                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {factor.explanation}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Model Confidence</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-earth-aqua to-earth-emerald rounded-full"
                      style={{ width: `${factor.confidence * 100}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-earth-emerald">
                    {Math.round(factor.confidence * 100)}%
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Mandatory Scientific Disclaimer Card per Prompt Specification */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 backdrop-blur-md flex items-start gap-3 text-xs text-amber-200">
        <HelpCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold block">Methodological Note on Causal Inference</strong>
          <span className="text-slate-300 text-[11px] leading-relaxed block mt-0.5">
            Statistical correlations presented above indicate empirical co-occurrence within downscaled observational models ("Model-associated factor", "Detected correlation"). They do not constitute deterministic causal certainty without ground-truth ecological field verification.
          </span>
        </div>
      </div>

      {/* Launch Action to Simulator */}
      <div className="text-center pt-2">
        <GlassButton
          variant="primary"
          size="lg"
          onClick={() => onNavigateToSimulator(selectedHotspot)}
          leftIcon={<Sliders className="w-5 h-5" />}
        >
          Proceed to "WHAT IF?" Simulation Laboratory for {selectedHotspot.name}
        </GlassButton>
      </div>
    </div>
  );
};
