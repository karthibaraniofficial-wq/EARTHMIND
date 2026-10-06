import React, { useState } from 'react';
import { 
  Compass, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Target, 
  Play, 
  Sliders, 
  MapPin,
  RotateCcw
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { EarthMindMission, MissionStep } from '../../types';

interface MissionModeViewProps {
  onNavigate: (view: string) => void;
  onSelectHotspotById?: (id: string) => void;
}

export const MissionModeView: React.FC<MissionModeViewProps> = ({
  onNavigate,
  onSelectHotspotById,
}) => {
  const [missions, setMissions] = useState<EarthMindMission[]>([
    {
      id: 'MISSION-01',
      title: 'Aral Sea Hydrological Resuscitation',
      location: 'Central Asia (Kazakhstan / Uzbekistan)',
      difficulty: 'Scientist',
      objective: 'Diagnose the 88% water body retreat, formulate a canal diversion hypothesis, and simulate biophysical stabilization.',
      story: 'Once the fourth-largest lake on Earth, the Aral Sea suffered catastrophic contraction due to excessive cotton irrigation diversions. You must investigate the satellite timeline and simulate a recovery plan.',
      badgeAward: 'Master Planetary Hydrologist Badge',
      status: 'in_progress',
      steps: [
        { stepNumber: 1, title: 'Inspect Orbital Water Retreat', instruction: 'Examine satellite water index (NDWI) in the Explorer.', targetView: 'explorer', targetHotspotId: 'aral_sea', completed: true },
        { stepNumber: 2, title: 'Satellite Change Scanner', instruction: 'Use the Curtain Swipe slider to measure the 2018-2026 contraction perimeter.', targetView: 'satellite_scanner', targetHotspotId: 'aral_sea', completed: true },
        { stepNumber: 3, title: 'Formulate Scientific Hypothesis', instruction: 'Set up an empirical hypothesis in the Research Lab testing water retention buffers.', targetView: 'research', targetHotspotId: 'aral_sea', completed: false },
        { stepNumber: 4, title: 'Run Coupled Simulation', instruction: 'Increase water buffer by +40% in the What-If Simulator and check risk reduction.', targetView: 'simulator', targetHotspotId: 'aral_sea', completed: false },
        { stepNumber: 5, title: 'Submit Peer-Reviewed Conclusion', instruction: 'Export the verified reproducibility dossier and receive your Young Scientist accolade.', targetView: 'reproducibility', targetHotspotId: 'aral_sea', completed: false },
      ],
    },
    {
      id: 'MISSION-02',
      title: 'Amazon Deforestation Tipping Point Defense',
      location: 'Amazon Rainforest (Brazil)',
      difficulty: 'Commander',
      objective: 'Halt the collapse of the atmospheric moisture recycling pump and restore contiguous wildlife biocorridors.',
      story: 'Canopy fragmentation in the southern arc of deforestation is approaching the 20-25% irreversible tipping point where tropical forest transitions to degraded savanna.',
      badgeAward: 'Amazonian Biome Guardian Badge',
      status: 'available',
      steps: [
        { stepNumber: 1, title: 'Identify Fragmentation Frontiers', instruction: 'Track NDVI foliar health in the Explorer.', targetView: 'explorer', targetHotspotId: 'amazon', completed: false },
        { stepNumber: 2, title: 'Inspect Causal Feedbacks', instruction: 'Trace the canopy loss -> rainfall failure causal loop.', targetView: 'causal_graph', targetHotspotId: 'amazon', completed: false },
        { stepNumber: 3, title: 'Call Multi-Agent Council', instruction: 'Debate land zoning reform with Ecology AI and Urban AI.', targetView: 'council', targetHotspotId: 'amazon', completed: false },
        { stepNumber: 4, title: 'Branch Future Fork', instruction: 'Verify Green Regeneration vs Stress 2050 trajectories.', targetView: 'future_fork', targetHotspotId: 'amazon', completed: false },
        { stepNumber: 5, title: 'Run Regional Autopilot', instruction: 'Generate an optimal $45M native reforestation policy package.', targetView: 'autopilot', targetHotspotId: 'amazon', completed: false },
      ],
    },
    {
      id: 'MISSION-03',
      title: 'Delhi Urban Heat Island Thermal Suppression',
      location: 'Delhi & NCR (India)',
      difficulty: 'Novice',
      objective: 'Reduce localized urban surface temperature by >2.5°C using cool roofs and green corridors.',
      story: 'Extreme diurnal summer heatwaves exceed 48°C in dense concrete districts, amplifying hospital emergency admissions and power brownouts.',
      badgeAward: 'Urban Resilience Architect Badge',
      status: 'available',
      steps: [
        { stepNumber: 1, title: 'Open 3D City Digital Twin', instruction: 'Inspect building canyon thermal radiance and asphalt albedo.', targetView: 'city_twin', targetHotspotId: 'delhi', completed: false },
        { stepNumber: 2, title: 'Deploy Green Corridors', instruction: 'Toggle native tree avenues to drop localized UHI by 1.6°C.', targetView: 'city_twin', targetHotspotId: 'delhi', completed: false },
        { stepNumber: 3, title: 'Install Reflective Cool Roofs', instruction: 'Convert tar rooftops to high-albedo coatings.', targetView: 'city_twin', targetHotspotId: 'delhi', completed: false },
        { stepNumber: 4, title: 'Simulate Compound Heat & Flood', instruction: 'Stress-test urban drainage under extreme monsoon rainfall.', targetView: 'compound_disaster', targetHotspotId: 'delhi', completed: false },
        { stepNumber: 5, title: 'Win Strategy Battle Mode', instruction: 'Pit Green Recovery against Business As Usual and present to judges.', targetView: 'battle_mode', targetHotspotId: 'delhi', completed: false },
      ],
    },
  ]);

  const [activeMissionId, setActiveMissionId] = useState<string>('MISSION-01');
  const activeMission = missions.find((m) => m.id === activeMissionId) || missions[0];

  const handleToggleStep = (stepNumber: number) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== activeMissionId) return m;
        return {
          ...m,
          steps: m.steps.map((s) =>
            s.stepNumber === stepNumber ? { ...s, completed: !s.completed } : s
          ),
        };
      })
    );
  };

  const handleJumpToStep = (step: MissionStep) => {
    if (step.targetHotspotId && onSelectHotspotById) {
      onSelectHotspotById(step.targetHotspotId);
    }
    onNavigate(step.targetView);
  };

  const completedStepsCount = activeMission.steps.filter((s) => s.completed).length;
  const progressPct = Math.round((completedStepsCount / activeMission.steps.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              FEATURE 116 • EARTHMIND MISSION MODE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">EarthMind Mission Mode</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Gamified young scientist missions: Investigate authentic satellite challenges, formulate hypotheses, test biophysical interventions, and earn peer-reviewed badges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <GlassBadge tone="aqua" size="sm" pulse>
            SCIENCE EXPO JUDGE READY
          </GlassBadge>
        </div>
      </div>

      {/* Mission Selector Carousel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {missions.map((m) => {
          const isSelected = m.id === activeMissionId;
          const done = m.steps.filter((s) => s.completed).length;
          return (
            <GlassCard
              key={m.id}
              variant="medium"
              onClick={() => setActiveMissionId(m.id)}
              className={`p-4 border cursor-pointer transition-all space-y-2 ${
                isSelected
                  ? 'border-earth-aqua bg-white/10 shadow-lg shadow-earth-aqua/10 ring-1 ring-earth-aqua'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">{m.id}</span>
                <GlassBadge
                  tone={m.difficulty === 'Novice' ? 'emerald' : m.difficulty === 'Scientist' ? 'aqua' : 'sun'}
                  size="sm"
                >
                  {m.difficulty}
                </GlassBadge>
              </div>

              <h3 className="text-sm font-bold text-white leading-tight">{m.title}</h3>
              <div className="text-[11px] text-slate-400 font-mono">{m.location}</div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Progress:</span>
                <span className="text-earth-aqua font-bold">{done}/{m.steps.length} Steps</span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Active Mission Briefing & Step Checklist */}
      <GlassCard variant="strong" className="p-6 border border-white/15 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-earth-aqua font-bold">{activeMission.id} BRIEFING</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-mono text-slate-400">{activeMission.location}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{activeMission.title}</h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed mt-1">
              {activeMission.story}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center min-w-[140px] flex-shrink-0">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Mission Completion</span>
            <span className="text-3xl font-black text-earth-aqua">{progressPct}%</span>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              {completedStepsCount} of {activeMission.steps.length} Done
            </span>
          </div>
        </div>

        {/* Award Badge Pill */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-amber-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Award upon completion: <strong>{activeMission.badgeAward}</strong></span>
          </div>
          {progressPct === 100 && (
            <GlassBadge tone="emerald" size="sm">UNLOCKED</GlassBadge>
          )}
        </div>

        {/* Step-by-Step Interactive Workflow */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-earth-aqua" />
            Mission Action Steps
          </h3>

          <div className="space-y-3">
            {activeMission.steps.map((step) => (
              <div
                key={step.stepNumber}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  step.completed
                    ? 'bg-earth-emerald/10 border-earth-emerald/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleStep(step.stepNumber)}
                    className="mt-0.5 text-earth-emerald hover:scale-110 transition-transform"
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-earth-emerald" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-500" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-earth-aqua">Step 0{step.stepNumber}</span>
                      <h4 className={`text-sm font-bold ${step.completed ? 'text-slate-300 line-through' : 'text-white'}`}>
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">{step.instruction}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleJumpToStep(step)}
                  className="px-4 py-2 rounded-xl bg-earth-aqua text-[#071A2B] font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-earth-aqua/90 transition-all self-end sm:self-auto flex-shrink-0"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
