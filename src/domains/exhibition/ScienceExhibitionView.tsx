import React, { useState } from 'react';
import { 
  Presentation, 
  Award, 
  Lightbulb, 
  Target, 
  Database, 
  Cpu, 
  Sliders, 
  TrendingUp, 
  Globe2, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  Layers,
  ShieldCheck 
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';

interface ScienceExhibitionViewProps {
  onClose: () => void;
  onNavigateToSimulator: () => void;
}

export const ScienceExhibitionView: React.FC<ScienceExhibitionViewProps> = ({
  onClose,
  onNavigateToSimulator,
}) => {
  const [activeSection, setActiveSection] = useState<number>(0);

  const sections = [
    {
      id: 'problem',
      title: '01 — PROBLEM',
      subtitle: 'The Urban Climate Paradox',
      icon: <Target className="w-5 h-5 text-earth-coral" />,
      tagline: 'Environmental decisions are difficult because their long-term consequences are interconnected.',
      content: (
        <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
          <p>
            Municipal planners and environmental agencies are forced to make multimillion-dollar zoning and infrastructure decisions without tools to forecast compounding biophysical repercussions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl glass-panel-1 border border-earth-coral/20">
              <span className="text-xl font-bold font-mono text-earth-coral block">+2.4°C</span>
              <span className="text-xs text-slate-300 mt-1 block">Average urban surface thermal amplification</span>
            </div>
            <div className="p-3.5 rounded-xl glass-panel-1 border border-earth-sun/20">
              <span className="text-xl font-bold font-mono text-earth-sun block">-31.4%</span>
              <span className="text-xs text-slate-300 mt-1 block">Peri-urban canopy loss over 16-year timeline</span>
            </div>
            <div className="p-3.5 rounded-xl glass-panel-1 border border-earth-sky/20">
              <span className="text-xl font-bold font-mono text-earth-sky block">42%</span>
              <span className="text-xs text-slate-300 mt-1 block">Increase in stormwater runoff surge due to concrete sprawl</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Traditional environmental dashboards are purely retrospective—they tell decision-makers what broke yesterday, but provide zero capability to test what will happen tomorrow.
          </p>
        </div>
      ),
    },
    {
      id: 'idea',
      title: '02 — IDEA',
      subtitle: 'Planetary Digital Twin Engine',
      icon: <Lightbulb className="w-5 h-5 text-earth-aqua" />,
      tagline: 'EARTHMIND creates an interactive environmental digital twin.',
      content: (
        <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
          <p>
            By synthesizing planetary-scale multi-spectral satellite imagery with local topography and biophysical laws, EARTHMIND constructs a live digital replica of sensitive geographic biomes.
          </p>
          <div className="p-4 rounded-xl bg-earth-aqua/10 border border-earth-aqua/25 text-xs text-slate-200">
            <strong className="text-earth-aqua block text-sm font-bold mb-1">Interactive Digital Twin</strong>
            Unlike static map viewers, an environmental digital twin couples atmospheric, hydrological, and vegetative subsystems into a unified reactive state. When one variable shifts, the entire interconnected microclimate responds dynamically.
          </div>
        </div>
      ),
    },
    {
      id: 'data',
      title: '03 — DATA',
      subtitle: 'Harmonized Geospatial & Satellite Observations',
      icon: <Database className="w-5 h-5 text-earth-leaf" />,
      tagline: 'Historical environmental and geospatial information (2010 – 2026).',
      content: (
        <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
          <p>
            EARTHMIND fuses public scientific remote-sensing missions to construct verified baseline observations:
          </p>
          <div className="space-y-2 pt-1 font-mono text-xs">
            <div className="p-3 rounded-xl glass-panel-1 border border-white/5 flex items-center justify-between">
              <span className="text-white">Optical Surface Reflectance (NDVI/NDBI)</span>
              <span className="text-earth-aqua">Sentinel-2 MSI (10m)</span>
            </div>
            <div className="p-3 rounded-xl glass-panel-1 border border-white/5 flex items-center justify-between">
              <span className="text-white">Land Surface Temperature (LST)</span>
              <span className="text-earth-coral">Landsat-9 TIRS-2 (30m/100m)</span>
            </div>
            <div className="p-3 rounded-xl glass-panel-1 border border-white/5 flex items-center justify-between">
              <span className="text-white">Soil Moisture & Structural Density</span>
              <span className="text-earth-leaf">Sentinel-1 SAR C-band</span>
            </div>
            <div className="p-3 rounded-xl glass-panel-1 border border-white/5 flex items-center justify-between">
              <span className="text-white">Aerosol Optical Depth (AOD)</span>
              <span className="text-earth-aurora">MODIS Terra / Aqua (1km)</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ai',
      title: '04 — AI',
      subtitle: 'Pattern Detection & Decision-Support Models',
      icon: <Cpu className="w-5 h-5 text-earth-aurora" />,
      tagline: 'Evidence-weighted pattern detection and forensic correlation.',
      content: (
        <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
          <p>
            Rather than hallucinating ungrounded assertions, EARTHMIND AI applies structured multivariate pattern detection to isolate significant co-occurrences between anthropogenic expansion and ecological distress.
          </p>
          <div className="p-4 rounded-xl bg-earth-aurora/10 border border-earth-aurora/25 text-xs text-slate-200">
            <strong className="text-earth-aurora block text-sm font-bold mb-1">Scientific Integrity Framework</strong>
            Every forensic factor is rated with empirical confidence scores (85% – 96%) and labeled as "Model-associated factor" or "Observed correlation" without overstepping into unverified causal determinism.
          </div>
        </div>
      ),
    },
    {
      id: 'simulation',
      title: '05 — SIMULATION',
      subtitle: 'What-If Environmental Experiments',
      icon: <Sliders className="w-5 h-5 text-earth-emerald" />,
      tagline: 'Simulating non-linear policy interventions before real-world deployment.',
      content: (
        <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
          <p>
            The signature capability: operators manipulate 7 policy levers (Tree Canopy, Precipitation, Urban Sprawl, Municipal Waste, Water Retention, Traffic Density, Clean Energy).
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg glass-panel-1 text-center border border-white/5">🌱 Tree Canopy</div>
            <div className="p-2.5 rounded-lg glass-panel-1 text-center border border-white/5">🌧 Precipitation</div>
            <div className="p-2.5 rounded-lg glass-panel-1 text-center border border-white/5">🏙 Urban Sprawl</div>
            <div className="p-2.5 rounded-lg glass-panel-1 text-center border border-white/5">🗑 Municipal Waste</div>
            <div className="p-2.5 rounded-lg glass-panel-1 text-center border border-white/5">💧 Water Retention</div>
            <div className="p-2.5 rounded-lg glass-panel-1 text-center border border-white/5">🚗 Traffic Density</div>
            <div className="p-2.5 rounded-lg glass-panel-1 text-center border border-white/5">⚡ Clean Energy</div>
            <div className="p-2.5 rounded-lg bg-earth-emerald/10 text-earth-emerald font-bold text-center border border-earth-emerald/30">💚 Health Score</div>
          </div>
        </div>
      ),
    },
    {
      id: 'comparison',
      title: '06 — COMPARISON',
      subtitle: 'Compare Alternative Futures',
      icon: <Layers className="w-5 h-5 text-earth-sky" />,
      tagline: 'Benchmark policy pathways side-by-side against historical baselines.',
      content: (
        <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
          <p>
            The Scenario Comparison Lab evaluates four simultaneous pathways: Baseline Reference, Green City 2030, Unregulated Urban Boom, and Compound Climate Extreme.
          </p>
          <div className="p-4 rounded-xl bg-earth-sky/10 border border-earth-sky/25 text-xs text-slate-200">
            <strong className="text-earth-sky block text-sm font-bold mb-1">Synthesis Matrix</strong>
            Examine deltas across heat risk, flood vulnerability, air pollution, and water stress simultaneously to ensure a policy solving one problem does not silently worsen another.
          </div>
        </div>
      ),
    },
    {
      id: 'decision',
      title: '07 — DECISION',
      subtitle: 'Identify Better Interventions',
      icon: <ShieldCheck className="w-5 h-5 text-earth-sun" />,
      tagline: 'Rank intervention options by resilience yield and cost-effectiveness.',
      content: (
        <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
          <p>
            EARTHMIND translates complex simulation results into actionable municipal priorities. For example, in the Indo-Gangetic Basin, pairing +35% urban canopy with decentralized percolation yields a +28 point composite resilience improvement.
          </p>
          <div className="p-4 rounded-xl bg-earth-sun/10 border border-earth-sun/25 text-xs text-slate-200">
            <strong className="text-earth-sun block text-sm font-bold mb-1">Decision Optimization</strong>
            Decision makers receive priority-ordered interventions accompanied by peer-reviewed empirical references and expected percentage reductions in multi-stressor indices.
          </div>
        </div>
      ),
    },
    {
      id: 'impact',
      title: '08 — IMPACT',
      subtitle: 'Support More Informed Environmental Planning',
      icon: <Award className="w-5 h-5 text-earth-emerald" />,
      tagline: 'Empowering cities and regions with predictive environmental governance.',
      content: (
        <div className="space-y-4 text-slate-200 text-sm leading-relaxed">
          <p>
            EARTHMIND replaces fragmented spreadsheets and retrospective reports with an interactive, verified digital twin. Decision makers can safely prototype environmental interventions virtually before committing public capital.
          </p>
          <div className="p-4 rounded-xl bg-earth-emerald/10 border border-earth-emerald/30 text-xs text-earth-emerald">
            <strong className="block text-sm font-bold mb-1">Young Scientist '26 Exhibition Defense Statement</strong>
            "Explore Earth's Past. Understand Its Present. Simulate Its Future." EARTHMIND bridges scientific satellite data and interactive decision modeling into a production-grade SaaS experience ready for urban planning.
          </div>
        </div>
      ),
    },
  ];

  const current = sections[activeSection];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Presentation className="w-5 h-5 text-earth-sun" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-sun font-bold">
              YOUNG SCIENTIST '26 SCIENCE EXHIBITION MODE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Exhibition Defense & Architecture</h1>
          <p className="text-xs text-slate-400 mt-0.5">Formal scientific briefing presentation for distinguished judges</p>
        </div>

        <GlassButton variant="ghost" size="sm" onClick={onClose}>
          Exit Presentation Mode
        </GlassButton>
      </div>

      {/* Slide Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {sections.map((sec, idx) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(idx)}
            className={`p-2.5 rounded-xl text-left transition-all border ${
              activeSection === idx
                ? 'bg-earth-sun text-slate-950 border-earth-sun font-bold shadow-lg shadow-earth-sun/20'
                : 'glass-panel-1 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <div className="text-[10px] font-mono opacity-80">{sec.title.split(' — ')[0]}</div>
            <div className="text-xs font-bold truncate mt-0.5">{sec.title.split(' — ')[1] || sec.title}</div>
          </button>
        ))}
      </div>

      {/* Main Slide Card */}
      <GlassCard variant="strong" glow="sun" className="p-8 border-2 border-earth-sun/30 shadow-2xl">
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              {current.icon}
              <span className="text-xs font-mono uppercase tracking-wider text-earth-sun font-bold">
                {current.title}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1.5">{current.subtitle}</h2>
            <div className="text-xs text-earth-aqua font-medium mt-1">{current.tagline}</div>
          </div>

          <GlassBadge tone="sun" size="sm">
            Slide {activeSection + 1} of {sections.length}
          </GlassBadge>
        </div>

        {/* Content Body */}
        <div className="py-6">{current.content}</div>

        {/* Slide Navigation Controls */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => setActiveSection((p) => Math.max(0, p - 1))}
            disabled={activeSection === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </GlassButton>

          <div className="flex items-center gap-2">
            {activeSection === sections.length - 1 ? (
              <GlassButton
                variant="primary"
                size="md"
                onClick={onNavigateToSimulator}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Launch Live Simulator Demonstration
              </GlassButton>
            ) : (
              <GlassButton
                variant="primary"
                size="sm"
                onClick={() => setActiveSection((p) => Math.min(sections.length - 1, p + 1))}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next Section
              </GlassButton>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
