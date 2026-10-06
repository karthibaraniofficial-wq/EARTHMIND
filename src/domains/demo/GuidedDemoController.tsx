import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  ChevronLeft,
  ChevronRight,
  RotateCcw, 
  X, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Clock 
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { EnvironmentalHotspot, SimulationParameters } from '../../types';

interface DemoStep {
  id: number;
  title: string;
  view: string;
  duration: number; // in seconds
  description: string;
  hotspotId?: string;
  actionPayload?: Partial<SimulationParameters>;
  highlightBadge: string;
}

interface GuidedDemoControllerProps {
  isActive: boolean;
  onExitDemo: () => void;
  onNavigate: (view: string) => void;
  onSelectHotspotById: (id: string) => void;
  onApplySimulationParameters: (params: Partial<SimulationParameters>) => void;
  hotspots: EnvironmentalHotspot[];
}

export const GuidedDemoController: React.FC<GuidedDemoControllerProps> = ({
  isActive,
  onExitDemo,
  onNavigate,
  onSelectHotspotById,
  onApplySimulationParameters,
  hotspots,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(12);

  const demoSteps: DemoStep[] = [
    {
      id: 1,
      title: '1. Open EarthMind Digital Twin',
      view: 'overview',
      duration: 10,
      description: 'Welcome to EARTHMIND — the planetary AI environmental digital twin and decision simulation platform for Young Scientist \'26.',
      highlightBadge: 'STEP 1/11: INITIALIZE',
    },
    {
      id: 2,
      title: '2. Select Sensitive Hotspot',
      view: 'explorer',
      duration: 11,
      description: 'Navigating to the Indo-Gangetic Basin on the photorealistic 3D NASA Earth Digital Twin to inspect regional environmental telemetry.',
      hotspotId: 'indo-gangetic-plain',
      highlightBadge: 'STEP 2/11: 3D LOCATION',
    },
    {
      id: 3,
      title: '3. Show Environmental Health',
      view: 'explorer',
      duration: 12,
      description: 'Opening the intelligence panel: Indo-Gangetic Basin shows a vulnerable 58/100 Health Score under heat and aerosol stress.',
      hotspotId: 'indo-gangetic-plain',
      highlightBadge: 'STEP 3/11: HEALTH TELEMETRY',
    },
    {
      id: 4,
      title: '4. Historical Timeline (2010 – 2026)',
      view: 'memory',
      duration: 13,
      description: 'Traveling through 16 years of satellite records in Earth Memory: built-up impervious concrete surged while vegetative canopy dropped by 31.4%.',
      hotspotId: 'indo-gangetic-plain',
      highlightBadge: 'STEP 4/11: EARTH MEMORY',
    },
    {
      id: 5,
      title: '5. Detect Environmental Change',
      view: 'forensics',
      duration: 13,
      description: 'Environmental Forensics isolates an observed +2.4°C land surface thermal anomaly with 94% model cross-correlation confidence.',
      hotspotId: 'indo-gangetic-plain',
      highlightBadge: 'STEP 5/11: FORENSICS',
    },
    {
      id: 6,
      title: '6. Open WHAT-IF? Scenario Lab',
      view: 'simulator',
      duration: 11,
      description: 'Entering the signature WHAT-IF? Laboratory to experiment with live coupled microclimate and policy levers.',
      hotspotId: 'indo-gangetic-plain',
      actionPayload: { treeCoverDelta: 0, rainfallDelta: 0, urbanizationDelta: 0, trafficDelta: 0 },
      highlightBadge: 'STEP 6/11: WHAT-IF LAB',
    },
    {
      id: 7,
      title: '7. Policy Intervention: +35% Tree Canopy',
      view: 'simulator',
      duration: 13,
      description: 'Increasing tree canopy by +35% with pocket Miyawaki forests and bioswales. Watch the biophysical system feedback respond.',
      hotspotId: 'indo-gangetic-plain',
      actionPayload: { treeCoverDelta: 35, waterDelta: 15 },
      highlightBadge: 'STEP 7/11: INCREASE CANOPY',
    },
    {
      id: 8,
      title: '8. Run Coupled Simulation',
      view: 'simulator',
      duration: 13,
      description: 'Adding clean transit (-25% combustion traffic). The engine recalculates all multi-stressors: heat risk drops 18 pts, health rises to 84/100.',
      hotspotId: 'indo-gangetic-plain',
      actionPayload: { treeCoverDelta: 35, waterDelta: 25, trafficDelta: -25, energyEfficiencyDelta: 30 },
      highlightBadge: 'STEP 8/11: SIMULATION REACTION',
    },
    {
      id: 9,
      title: '9. Compare Baseline vs Intervention',
      view: 'scenarios',
      duration: 13,
      description: 'Scenario Matrix synthesizes Green City 2030 against the Baseline: clear quantifiable proof of multi-stressor mitigation.',
      highlightBadge: 'STEP 9/11: SCENARIO MATRIX',
    },
    {
      id: 10,
      title: '10. AI Decision Engine Recommendation',
      view: 'overview',
      duration: 13,
      description: 'EARTHMIND AI delivers contextual, evidence-backed priorities: Priority 1 Urban Canopy Corridors with expected +16pt net resilience yield.',
      highlightBadge: 'STEP 10/11: AI DECISION',
    },
    {
      id: 11,
      title: '11. Impact & Certified Intelligence Dossier',
      view: 'reports',
      duration: 15,
      description: 'Exporting formal environmental planning dossier for Young Scientist \'26 judges: "Test environmental decisions before making them."',
      hotspotId: 'indo-gangetic-plain',
      highlightBadge: 'STEP 11/11: IMPACT DOSSIER',
    },
  ];

  const currentStep = demoSteps[currentStepIndex];

  // Execute step changes
  useEffect(() => {
    if (!isActive) return;

    if (currentStep.hotspotId) {
      onSelectHotspotById(currentStep.hotspotId);
    }
    if (currentStep.actionPayload) {
      onApplySimulationParameters(currentStep.actionPayload);
    }
    onNavigate(currentStep.view);
    setSecondsRemaining(currentStep.duration);
  }, [currentStepIndex, isActive]);

  // Step countdown
  useEffect(() => {
    if (!isActive || isPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (currentStepIndex < demoSteps.length - 1) {
            setCurrentStepIndex((curr) => curr + 1);
            return demoSteps[currentStepIndex + 1].duration;
          } else {
            // Completed all steps
            onExitDemo();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isPaused, currentStepIndex]);

  if (!isActive) return null;

  const progressPct = ((currentStep.duration - secondsRemaining) / currentStep.duration) * 100;

  return (
    <div className="fixed top-16 inset-x-4 z-50 max-w-4xl mx-auto animate-in slide-in-from-top duration-300">
      <GlassCard
        variant="strong"
        glow="emerald"
        className="p-4 border-2 border-earth-emerald/50 shadow-2xl bg-slate-950/90 backdrop-blur-2xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-earth-emerald animate-ping" />
            <GlassBadge tone="emerald" size="sm">
              {currentStep.highlightBadge}
            </GlassBadge>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              {currentStep.title}
            </h3>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-2.5 py-1 rounded-lg glass-panel-1 border border-white/15 text-xs text-white hover:bg-white/10 transition-colors flex items-center gap-1 font-mono"
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={() => {
                if (currentStepIndex > 0) {
                  setCurrentStepIndex((curr) => curr - 1);
                }
              }}
              disabled={currentStepIndex === 0}
              className="px-2 py-1 rounded-lg glass-panel-1 border border-white/15 text-xs text-white hover:bg-white/10 transition-colors flex items-center gap-1 font-mono disabled:opacity-40 disabled:cursor-not-allowed"
              title="Previous Step"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>Prev</span>
            </button>

            <button
              onClick={() => {
                if (currentStepIndex < demoSteps.length - 1) {
                  setCurrentStepIndex((curr) => curr + 1);
                } else {
                  onExitDemo();
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-earth-emerald/20 text-earth-emerald border border-earth-emerald/40 text-xs font-bold hover:bg-earth-emerald/30 transition-colors flex items-center gap-1"
            >
              <span>Next</span>
              <SkipForward className="w-3 h-3" />
            </button>

            <button
              onClick={onExitDemo}
              className="p-1 rounded-lg text-slate-400 hover:text-earth-coral transition-colors"
              title="Exit Guided Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description & Countdown */}
        <div className="mt-2.5 flex items-center justify-between text-xs gap-4">
          <p className="text-slate-200 leading-snug">
            {currentStep.description}
          </p>
          <div className="text-right flex-shrink-0 font-mono text-[11px] text-earth-aqua">
            <span>{secondsRemaining}s</span>
          </div>
        </div>

        {/* Substep Progress bar */}
        <div className="mt-2.5 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-earth-aqua to-earth-emerald rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </GlassCard>
    </div>
  );
};
