import React from 'react';
import { Database, ShieldCheck, Satellite, AlertCircle, Sparkles, Binary } from 'lucide-react';
import { GlassModal } from '../glass/GlassModal';
import { GlassBadge } from '../glass/GlassBadge';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title="Scientific Methodology & Data Governance"
      subtitle="Young Scientist '26 Exhibition Verification & Data Transparency Framework"
      maxWidth="2xl"
    >
      <div className="space-y-6 text-xs text-slate-200 leading-relaxed font-sans">
        {/* Tier Badging Definition */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-earth-aqua font-bold mb-2 flex items-center gap-1.5">
            <Binary className="w-4 h-4" />
            <span>1. Data Classification Standard</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl glass-panel-2 border border-earth-leaf/30 space-y-1.5">
              <GlassBadge tone="leaf" size="sm">DEMO DATASET</GlassBadge>
              <div className="font-bold text-white text-xs mt-1">Empirical Satellite Baselines</div>
              <p className="text-[11px] text-slate-300">
                Observational time-series (2010–2026) calibrated from European Space Agency (ESA) Sentinel-2 MSI and NASA/USGS Landsat-9 TIRS-2 public products for 6 curated biome hotspots.
              </p>
            </div>

            <div className="p-3.5 rounded-xl glass-panel-2 border border-earth-aurora/30 space-y-1.5">
              <GlassBadge tone="aurora" size="sm">MODEL ESTIMATE</GlassBadge>
              <div className="font-bold text-white text-xs mt-1">Multivariate Forensics</div>
              <p className="text-[11px] text-slate-300">
                Statistical co-occurrence associations and confidence ratings (85%–96%) evaluated through downscaled spatial cross-correlation models. Denotes empirical correlation, not deterministic proof.
              </p>
            </div>

            <div className="p-3.5 rounded-xl glass-panel-2 border border-earth-aqua/30 space-y-1.5">
              <GlassBadge tone="aqua" size="sm">SIMULATION</GlassBadge>
              <div className="font-bold text-white text-xs mt-1">Coupled Physics Engine</div>
              <p className="text-[11px] text-slate-300">
                Non-linear biophysical equations computing microclimate evapotranspirative cooling, stormwater soil percolation curves, and particulate dispersion in response to user policy levers.
              </p>
            </div>
          </div>
        </div>

        {/* Remote Sensing Constellations */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-earth-aqua font-bold mb-2 flex items-center gap-1.5">
            <Satellite className="w-4 h-4" />
            <span>2. Observational Sensor Pipeline</span>
          </h4>
          <div className="p-4 rounded-xl glass-panel-1 border border-white/10 space-y-2.5 font-mono text-[11px]">
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <span className="text-slate-300">Vegetation Indices (NDVI / EVI)</span>
              <span className="text-earth-emerald">Sentinel-2A/B MSI Band 4 & 8 (10m Resolution)</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <span className="text-slate-300">Land Surface Temperature (LST)</span>
              <span className="text-earth-coral">Landsat-9 TIRS-2 Band 10 Split-Window Algorithm</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <span className="text-slate-300">Impervious Concrete Sprawl (NDBI)</span>
              <span className="text-earth-sun">Sentinel-2 SWIR / NIR Spectral Ratios</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <span className="text-slate-300">Hydrological Surface Water Index</span>
              <span className="text-earth-aqua">Modified NDWI (Green & SWIR Bands)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Aerosol Particulate Haze (PM2.5/AOD)</span>
              <span className="text-earth-aurora">MODIS Deep Blue Aerosol Optical Depth Products</span>
            </div>
          </div>
        </div>

        {/* Scientific Integrity & Causal Inference Rules */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-amber-300 font-bold block text-xs">
              Scientific Ethics & Honest Reporting Commitment
            </strong>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              In accordance with Young Scientist '26 judging guidelines, EARTHMIND never presents simulated results or demonstration datasets as actual live measured ground-truth telemetry. Model limitations are explicitly rendered across all forensic and simulation views.
            </p>
          </div>
        </div>
      </div>
    </GlassModal>
  );
};
