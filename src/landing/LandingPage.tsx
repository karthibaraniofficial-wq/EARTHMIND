import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Sliders, 
  Clock, 
  ShieldCheck, 
  Award, 
  Layers, 
  Play, 
  CheckCircle2, 
  Flame, 
  Droplets, 
  Trees, 
  Wind, 
  Globe2 
} from 'lucide-react';
import { RealEarth } from '../components/3d/RealEarth';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassBadge } from '../components/glass/GlassBadge';
import { EnvironmentalHotspot } from '../types';
import { EarthMindLogo, EarthMindSymbol } from '../branding';

interface LandingPageProps {
  onEnterPlatform: (view?: string) => void;
  onStartGuidedDemo: () => void;
  hotspots: EnvironmentalHotspot[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterPlatform,
  onStartGuidedDemo,
  hotspots,
}) => {
  const dummySelect = () => {};

  return (
    <div className="relative w-full overflow-hidden aurora-bg">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 py-16">
        {/* Background glow highlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-earth-aqua/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-earth-aurora/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-panel-2 border border-earth-aqua/30 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <EarthMindSymbol size="xs" variant="primary" animated="pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-earth-aqua">
                PLANETARY ENVIRONMENTAL INTELLIGENCE OS
              </span>
            </div>

            <div className="pt-1">
              <EarthMindLogo variant="full" size="xl" showTagline={false} />
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
              Explore Earth's Past.{' '}
              <span className="aurora-glow-text block mt-1">Simulate Its Future.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              An AI-powered environmental digital twin for understanding change, testing scenarios, and making better decisions.
            </p>

            <div className="p-3 rounded-xl glass-panel-1 border border-earth-aqua/25 text-xs text-earth-aqua/90 flex items-center gap-2 max-w-lg mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-earth-aqua flex-shrink-0" />
              <span><strong>Principle:</strong> Test environmental decisions before making them.</span>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <GlassButton
                variant="primary"
                size="lg"
                onClick={() => onEnterPlatform('explorer')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Explore Earth Twin
              </GlassButton>

              <GlassButton
                variant="emerald"
                size="lg"
                onClick={() => onEnterPlatform('simulator')}
                leftIcon={<Sliders className="w-5 h-5" />}
              >
                Run "WHAT IF?" Simulation
              </GlassButton>

              <GlassButton
                variant="ghost"
                size="lg"
                onClick={onStartGuidedDemo}
                leftIcon={<Play className="w-4 h-4 text-earth-aurora" />}
              >
                2-Min Guided Tour
              </GlassButton>
            </div>

            {/* Credibility / Exhibition Footnote */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-earth-sun" />
                <span>Young Scientist '26 Project</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-earth-emerald" />
                <span>Sentinel-2 & Landsat-9 Calibrated</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: 3D Earth Globe + Floating Glass Intelligence Cards */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[480px]">
            {/* Interactive 3D Earth */}
            <div className="w-full h-[520px] max-w-[540px]">
              <RealEarth
                mode="hero"
                interactive={true}
                showAtmosphere={true}
                showClouds={true}
                showNightLights={true}
                showHotspots={true}
                showEnvironmentalOverlay={true}
                activeLayer="health"
                hotspots={hotspots}
                selectedHotspot={hotspots[0]}
                onSelectHotspot={dummySelect}
                className="w-full h-full"
              />
            </div>

            {/* Floating Glass Intelligence Cards around Earth (Section 6) */}
            <div className="absolute top-8 left-0 sm:left-4 z-20 animate-float-slow hidden sm:block">
              <GlassCard variant="strong" glow="emerald" className="px-3.5 py-2.5 rounded-xl border border-earth-emerald/40 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <Trees className="w-4 h-4 text-earth-leaf" />
                  <span className="text-xs font-bold text-white">Green Cover +18%</span>
                </div>
                <div className="text-[10px] text-earth-emerald font-mono mt-0.5">Canopy albedo cooling</div>
              </GlassCard>
            </div>

            <div className="absolute bottom-16 left-2 sm:left-8 z-20 animate-float-slow [animation-delay:2s] hidden sm:block">
              <GlassCard variant="strong" glow="aqua" className="px-3.5 py-2.5 rounded-xl border border-earth-aqua/40 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-earth-coral" />
                  <span className="text-xs font-bold text-white">Heat Risk ↓ 12%</span>
                </div>
                <div className="text-[10px] text-earth-aqua font-mono mt-0.5">Microclimate mitigation</div>
              </GlassCard>
            </div>

            <div className="absolute top-16 right-0 sm:right-6 z-20 animate-float-slow [animation-delay:4s] hidden sm:block">
              <GlassCard variant="strong" glow="sun" className="px-3.5 py-2.5 rounded-xl border border-earth-sun/40 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-earth-sky" />
                  <span className="text-xs font-bold text-white">Flood Risk 64%</span>
                </div>
                <div className="text-[10px] text-earth-sun font-mono mt-0.5">Stormwater buffer active</div>
              </GlassCard>
            </div>

            <div className="absolute bottom-8 right-2 sm:right-10 z-20 animate-float-slow [animation-delay:1s] hidden sm:block">
              <GlassCard variant="strong" glow="aurora" className="px-3.5 py-2.5 rounded-xl border border-earth-aurora/40 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-earth-aurora" />
                  <span className="text-xs font-bold text-white">Environmental Health 78</span>
                </div>
                <div className="text-[10px] text-earth-aurora font-mono mt-0.5">Resilient state verified</div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE HERO CORE EXPERIENCE PARADIGM */}
      <section className="py-16 px-4 border-t border-white/5 bg-slate-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua font-bold">
              THE EXPERIMENTATION LOOP
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">From Past to Predictive Future</h2>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              PAST → PRESENT → UNDERSTAND → SIMULATE → COMPARE → DECIDE → FUTURE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard variant="medium" className="p-6 border border-white/10 hover:border-earth-aqua/40 transition-all">
              <div className="p-3 rounded-xl bg-earth-aqua/10 text-earth-aqua w-fit mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Earth Memory & Forensics</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Reconstruct 16 years of historical satellite records from 2010 through 2026. Isolate canopy depletion, impervious concrete sprawl, and surface temperature anomalies.
              </p>
            </GlassCard>

            <GlassCard variant="strong" glow="emerald" className="p-6 border border-earth-emerald/40 hover:border-earth-emerald transition-all shadow-xl">
              <div className="p-3 rounded-xl bg-earth-emerald/10 text-earth-emerald w-fit mb-4">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. "WHAT IF?" Simulation</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Test real policy levers before deployment: tree canopy (+50%), rainfall extremes (+60%), transit shifts, and waste circularity with instant reactive microclimate feedbacks.
              </p>
            </GlassCard>

            <GlassCard variant="medium" className="p-6 border border-white/10 hover:border-earth-aurora/40 transition-all">
              <div className="p-3 rounded-xl bg-earth-aurora/10 text-earth-aurora w-fit mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Multi-Scenario Decision AI</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Benchmark policy pathways side-by-side in the Scenario Lab. Receive transparent evidence-based recommendations from EARTHMIND AI and export certified reports.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* 3. FINAL CALL TO ACTION */}
      <section className="py-20 px-4 border-t border-white/10 bg-radial-aurora text-center relative">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <GlassBadge tone="sun" size="md">
            YOUNG SCIENTIST '26 SCIENCE EXHIBITION
          </GlassBadge>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to test Earth's environmental future?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Enter the live digital twin platform to inspect planetary hotspots, run non-linear policy experiments, and experience context-aware decision intelligence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <GlassButton
              variant="primary"
              size="lg"
              onClick={() => onEnterPlatform('overview')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Enter Mission Control Platform
            </GlassButton>

            <GlassButton
              variant="emerald"
              size="lg"
              onClick={onStartGuidedDemo}
              leftIcon={<Play className="w-4 h-4" />}
            >
              Launch Guided Demo Tour
            </GlassButton>
          </div>
        </div>
      </section>
    </div>
  );
};
