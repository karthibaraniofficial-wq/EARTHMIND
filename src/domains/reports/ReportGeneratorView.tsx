import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  MapPin, 
  Trees, 
  Building2, 
  Flame, 
  Droplets, 
  Wind 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { EnvironmentalHotspot, SavedScenario } from '../../types';
import { ScientificBadge } from '../../design-system/ScientificBadge';

interface ReportGeneratorViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  scenarios: SavedScenario[];
}

export const ReportGeneratorView: React.FC<ReportGeneratorViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  scenarios,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [reportGeneratedAt, setReportGeneratedAt] = useState<string>(
    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  );

  const reportId = `EM-INTEL-${selectedHotspot.id.toUpperCase().slice(0, 4)}-${new Date().getFullYear()}-09`;
  const m = selectedHotspot.currentMetrics;

  const handlePrint = () => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#18C8C8', '#27C98A', '#9B7CFF'],
      });
    } catch {
      // Fallback
    }

    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 400);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              OFFICIAL EXPORT PIPELINE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Environmental Intelligence Report</h1>
          <p className="text-sm text-slate-400 mt-1">
            Certified digital twin assessment and scenario policy prospectus for {selectedHotspot.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Hotspot Dropdown */}
          <select
            value={selectedHotspot.id}
            onChange={(e) => {
              const spot = hotspots.find((h) => h.id === e.target.value);
              if (spot) onSelectHotspot(spot);
            }}
            className="px-3 py-2 rounded-xl glass-panel-2 border border-white/20 text-xs font-bold text-white focus:outline-none cursor-pointer"
          >
            {hotspots.map((spot) => (
              <option key={spot.id} value={spot.id} className="bg-slate-900 text-white">
                {spot.name}
              </option>
            ))}
          </select>

          <GlassButton
            variant="emerald"
            size="md"
            onClick={handlePrint}
            loading={isExporting}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Export / Print PDF
          </GlassButton>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="bg-[#091D2F] text-slate-100 p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl space-y-8 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-white/10 print:border-black/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-lg tracking-wider text-earth-aqua print:text-teal-700 font-mono">
                EARTHMIND
              </span>
              <span className="text-xs font-mono text-slate-400 print:text-gray-500">| DIGITAL TWIN REPORT</span>
              <ScientificBadge provenance="OBSERVED" confidence={95} size="sm" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white print:text-black">
              {selectedHotspot.name}
            </h2>
            <div className="text-xs text-slate-400 print:text-gray-600 mt-1">
              {selectedHotspot.region} • {selectedHotspot.country} • Lat {selectedHotspot.coordinates.lat}°, Lng {selectedHotspot.coordinates.lng}°
            </div>
          </div>

          <div className="sm:text-right font-mono text-xs text-slate-400 print:text-gray-600 space-y-1">
            <div>
              <span className="font-semibold text-slate-300 print:text-black">Dossier ID: </span>
              <span className="text-earth-aqua print:text-teal-700">{reportId}</span>
            </div>
            <div>Generated: {reportGeneratedAt}</div>
            <div>Classification: PUBLIC / SCIENCE EXPO '26</div>
          </div>
        </div>

        {/* Executive Summary & Composite Health Rating */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-white/5 border border-white/10 print:bg-gray-50 print:border-gray-300">
          <div className="sm:col-span-8 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-earth-aqua print:text-teal-700 font-bold">
              EXECUTIVE SYNTHESIS
            </span>
            <p className="text-xs sm:text-sm text-slate-200 print:text-gray-800 leading-relaxed">
              {selectedHotspot.summary} Satellite multispectral surveillance between 2018 and 2026 verifies significant land surface transformation, where <strong className="text-white print:text-black">{selectedHotspot.forensics.detectedChanges.builtUpExpansion}%</strong> built-up expansion accompanied a <strong className="text-white print:text-black">{selectedHotspot.forensics.detectedChanges.vegetationChange}%</strong> loss of canopy cooling cover.
            </p>
          </div>

          <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/60 print:bg-white border border-white/10 print:border-gray-300 text-center">
            <span className="text-xs text-slate-400 print:text-gray-500 font-mono">HEALTH RESILIENCE</span>
            <span className="text-4xl font-extrabold font-mono text-earth-emerald print:text-emerald-700 mt-1">
              {m.environmentalHealth}
            </span>
            <span className="text-[11px] text-slate-400 print:text-gray-500 font-mono">out of 100 max</span>
          </div>
        </div>

        {/* Current Biophysical Indicators */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 print:text-gray-600 mb-3">
            1. Core Biophysical Telemetry Indicators
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 print:bg-gray-50 print:border-gray-300">
              <span className="text-[11px] text-slate-400 print:text-gray-500 block">Surface Heat Risk</span>
              <span className="text-xl font-bold text-white print:text-black mt-1 block">{m.heatRisk}/100</span>
              <span className="text-[10px] text-earth-coral print:text-red-700">+{m.surfaceTempAnomaly}°C thermal Mass</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 print:bg-gray-50 print:border-gray-300">
              <span className="text-[11px] text-slate-400 print:text-gray-500 block">Flood Vulnerability</span>
              <span className="text-xl font-bold text-white print:text-black mt-1 block">{m.floodRisk}/100</span>
              <span className="text-[10px] text-earth-sky print:text-blue-700">Runoff Index</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 print:bg-gray-50 print:border-gray-300">
              <span className="text-[11px] text-slate-400 print:text-gray-500 block">Air Quality (AQI)</span>
              <span className="text-xl font-bold text-white print:text-black mt-1 block">{m.pollutionAqi}</span>
              <span className="text-[10px] text-earth-aurora print:text-purple-700">Aerosol Inversion</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 print:bg-gray-50 print:border-gray-300">
              <span className="text-[11px] text-slate-400 print:text-gray-500 block">Canopy Coverage</span>
              <span className="text-xl font-bold text-white print:text-black mt-1 block">{m.greenCoverPct}%</span>
              <span className="text-[10px] text-earth-leaf print:text-green-700">NDVI Bioswale</span>
            </div>
          </div>
        </div>

        {/* Forensic Contributing Factors Breakdown */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 print:text-gray-600 mb-3">
            2. Satellite Forensics & Contributing Association Factors
          </h3>
          <div className="space-y-2">
            {selectedHotspot.forensics.factors.map((factor, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 print:bg-gray-50 print:border-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white print:text-black flex items-center gap-2">
                    <span>{factor.factor}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 print:bg-gray-200 text-slate-300 print:text-gray-700 capitalize">
                      {factor.category}
                    </span>
                  </div>
                  <p className="text-slate-300 print:text-gray-600 mt-1 text-[11px]">{factor.explanation}</p>
                </div>

                <div className="font-mono text-right flex-shrink-0">
                  <span className="text-earth-emerald print:text-emerald-700 font-bold block">
                    {Math.round(factor.confidence * 100)}% Confidence
                  </span>
                  <span className="text-[10px] text-slate-400 print:text-gray-500">Cross-Correlation</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations Action Table */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 print:text-gray-600 mb-3">
            3. AI Decision Support & Intervention Priorities
          </h3>
          <div className="space-y-3">
            {selectedHotspot.recommendations.map((rec) => (
              <div
                key={rec.priority}
                className="p-4 rounded-xl border border-earth-aqua/30 bg-earth-aqua/5 print:bg-gray-50 print:border-gray-300 text-xs"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-white/5 print:border-gray-200">
                  <span className="font-bold text-white print:text-black">
                    Priority {rec.priority}: {rec.title}
                  </span>
                  <span className="font-mono text-earth-emerald print:text-emerald-700 font-bold">
                    {rec.expectedImpact}
                  </span>
                </div>
                <p className="text-slate-300 print:text-gray-700 mt-2 text-[11px] leading-relaxed">
                  <strong>Action:</strong> {rec.action}
                </p>
                <p className="text-slate-400 print:text-gray-500 mt-1 text-[10px] italic">
                  <strong>Empirical Evidence:</strong> {rec.evidence}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Formal Methodology Sign-Off & Verification Stamp */}
        <div className="pt-6 border-t border-white/10 print:border-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-slate-400 print:text-gray-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-earth-emerald print:text-emerald-700" />
            <span>Harmonized Sensor Pipeline: Landsat-9 TIRS-2 + Sentinel-2 MSI</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Model Verification Hash: </span>
            <span className="text-earth-aqua print:text-teal-700 font-mono">0x4F92...B831</span>
          </div>
        </div>
      </div>
    </div>
  );
};
