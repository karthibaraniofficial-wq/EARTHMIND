import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Scale, 
  Volume2, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Sliders, 
  MapPin, 
  Flame, 
  Droplets, 
  Trees, 
  Building2, 
  AlertTriangle, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { EnvironmentalHotspot, CouncilAgent } from '../../types';
import { useVoice } from '../../voice/VoiceContext';

interface EnvironmentalCouncilViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  onNavigateToSimulator: () => void;
}

export const EnvironmentalCouncilView: React.FC<EnvironmentalCouncilViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToSimulator,
}) => {
  const { speak, isSpeaking } = useVoice();
  const [selectedAgentId, setSelectedAgentId] = useState<string>('climate');
  const [isDebating, setIsDebating] = useState(false);
  const [activeTab, setActiveTab] = useState<'agents' | 'friction' | 'synthesis'>('agents');

  const councilAgents: CouncilAgent[] = [
    {
      id: 'climate',
      name: 'Dr. Elena Vance',
      role: 'Chief Atmospheric Climatologist',
      domain: 'climate',
      avatarColor: 'from-amber-500 to-rose-600',
      statement: `Thermal radiance in ${selectedHotspot.name} shows persistent surface heating (+2.4°C anomaly). We must prioritize urban albedo enhancement and carbon sink preservation before entering an irreversible positive feedback loop.`,
      verdict: 'ENDORSE',
      confidence: 0.94,
      keyMetric: '+2.4°C Radiative Forcing',
      suggestedAction: 'Deploy high-albedo reflective roof coatings and preserve peri-urban agroforestry belts.',
    },
    {
      id: 'water',
      name: 'Dr. Arun Kumar',
      role: 'Senior Hydrologist & Watershed Lead',
      domain: 'water',
      avatarColor: 'from-cyan-500 to-blue-600',
      statement: `Unchecked surface impermeability is depleting shallow aquifers. If monsoon runoff is not captured via bioswales, water stress will surpass 75/100 by the next dry cycle.`,
      verdict: 'CONCERN',
      confidence: 0.91,
      keyMetric: '57/100 Aquifer Stress',
      suggestedAction: 'Mandate decentralized stormwater infiltration trenches and wetland buffer restoration.',
    },
    {
      id: 'ecology',
      name: 'Dr. Maya Lin',
      role: 'Biodiversity & Landscape Ecologist',
      domain: 'ecology',
      avatarColor: 'from-emerald-500 to-teal-600',
      statement: `Canopy fragmentation in ${selectedHotspot.region} has severed primary avian and pollinator corridors. Increasing tree cover by +25% will restore baseline ecological connectivity and boost foliar particulate filtering.`,
      verdict: 'ENDORSE',
      confidence: 0.96,
      keyMetric: '-31% Native Canopy Loss',
      suggestedAction: 'Establish 5-meter wide contiguous green biocorridors connecting municipal parks.',
    },
    {
      id: 'urban',
      name: 'Dr. Marcus Sterling',
      role: 'Urban Systems & Spatial Planner',
      domain: 'urban',
      avatarColor: 'from-purple-500 to-indigo-600',
      statement: `While green buffers are critical, high housing demand means complete moratoriums on development are economically unviable. We must adopt vertical transit-oriented density rather than horizontal concrete sprawl.`,
      verdict: 'COUNTER_PROPOSE',
      confidence: 0.88,
      keyMetric: '+42% Impervious Sprawl',
      suggestedAction: 'Couple transit electrification with micro-pocket parks instead of broad land exclusion.',
    },
    {
      id: 'risk',
      name: 'Dr. Samantha Reed',
      role: 'Compound Hazard & Resilience Analyst',
      domain: 'risk',
      avatarColor: 'from-red-500 to-amber-600',
      statement: `The greatest danger is not single-hazard extremes, but compound events: a concurrent heatwave and electrical grid peak load will cause municipal system brownouts within 48 hours.`,
      verdict: 'CONCERN',
      confidence: 0.93,
      keyMetric: '72/100 Compound Vulnerability',
      suggestedAction: 'Install distributed solar microgrids with battery buffers for essential water pumps.',
    },
    {
      id: 'energy',
      name: 'Eng. David Chen',
      role: 'Clean Energy & Infrastructure Strategist',
      domain: 'energy',
      avatarColor: 'from-yellow-500 to-emerald-600',
      statement: `Heat pump transition and smart demand response can curtail 38% of peak cooling surges with an estimated capital return within 3.8 years. Infrastructure financing is ready.`,
      verdict: 'ENDORSE',
      confidence: 0.90,
      keyMetric: '$42M Investment Feasible',
      suggestedAction: 'Provide low-interest municipal green bonds for commercial heat pump retrofits.',
    },
  ];

  const activeAgent = councilAgents.find((a) => a.id === selectedAgentId) || councilAgents[0];

  const handlePlaySpokenDeliberation = (text: string) => {
    speak(text);
  };

  const getDomainIcon = (domain: CouncilAgent['domain']) => {
    switch (domain) {
      case 'climate': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'water': return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'ecology': return <Trees className="w-4 h-4 text-emerald-400" />;
      case 'urban': return <Building2 className="w-4 h-4 text-purple-400" />;
      case 'risk': return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'energy': return <Zap className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              FEATURE 117 • MULTI-AGENT ENVIRONMENTAL COUNCIL
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Multi-Agent Environmental Council</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            6 specialized AI domain models deliberate, challenge assumptions, and debate trade-offs. The Chief Decision Agent synthesizes a transparent, unified scientific consensus.
          </p>
        </div>

        {/* Hotspot Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {hotspots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => onSelectHotspot(spot)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                selectedHotspot.id === spot.id
                  ? 'bg-earth-aqua text-[#071A2B] border-earth-aqua font-bold shadow-md shadow-earth-aqua/30'
                  : 'glass-panel-1 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3 inline mr-1" />
              {spot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Council Chamber Status Banner */}
      <GlassCard variant="medium" className="p-5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-earth-aqua/10 border border-earth-aqua/30 flex items-center justify-center text-earth-aqua">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Council In Session</span>
              <GlassBadge tone="emerald" size="sm" pulse>86% CONSENSUS REACHED</GlassBadge>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              TARGET: {selectedHotspot.name} ({selectedHotspot.country}) • 6 Domain Agents Active
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePlaySpokenDeliberation(
              `The EarthMind Environmental Council has reached an 86% consensus for ${selectedHotspot.name}. While Climate and Ecology endorse expanding vegetative canopy, Urban Planning recommends combining transit electrification with localized bioswales to balance economic growth.`
            )}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs flex items-center gap-2 border border-white/10 transition-all"
          >
            <Volume2 className="w-4 h-4 text-earth-aqua" />
            <span>{isSpeaking ? 'Speaking...' : 'Play Spoken Synthesis'}</span>
          </button>

          <button
            onClick={onNavigateToSimulator}
            className="px-4 py-2 rounded-xl bg-earth-aqua text-[#071A2B] font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-earth-aqua/90 transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Test in Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            activeTab === 'agents'
              ? 'bg-white/15 text-white font-bold border border-white/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Domain Agent Testimonies (6)
        </button>
        <button
          onClick={() => setActiveTab('friction')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            activeTab === 'friction'
              ? 'bg-white/15 text-white font-bold border border-white/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Cross-Domain Tensions & Debates (2)
        </button>
        <button
          onClick={() => setActiveTab('synthesis')}
          className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
            activeTab === 'synthesis'
              ? 'bg-white/15 text-white font-bold border border-white/15'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Chief Decision Agent Synthesis
        </button>
      </div>

      {/* Tab 1: 6 Domain Agent Cards Grid */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {councilAgents.map((agent) => {
            const isSelected = agent.id === selectedAgentId;
            return (
              <GlassCard
                key={agent.id}
                variant="medium"
                onClick={() => setSelectedAgentId(agent.id)}
                className={`p-5 border cursor-pointer transition-all space-y-3 ${
                  isSelected
                    ? 'border-earth-aqua shadow-lg shadow-earth-aqua/10 bg-white/10'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.avatarColor} p-0.5 shadow-md`}>
                      <div className="w-full h-full bg-[#071A2B] rounded-[10px] flex items-center justify-center">
                        {getDomainIcon(agent.domain)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                      <div className="text-[11px] text-slate-400 font-mono">{agent.role}</div>
                    </div>
                  </div>

                  <GlassBadge
                    tone={
                      agent.verdict === 'ENDORSE'
                        ? 'emerald'
                        : agent.verdict === 'CONCERN'
                        ? 'coral'
                        : 'sun'
                    }
                    size="sm"
                  >
                    {agent.verdict}
                  </GlassBadge>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-white/20 pl-3">
                  "{agent.statement}"
                </p>

                <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Key Domain Signal:</span>
                    <span className="text-earth-aqua font-bold">{agent.keyMetric}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Model Confidence:</span>
                    <span className="text-slate-200">{(agent.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-2 text-slate-300">
                    <span className="text-slate-400 font-bold block mb-0.5">Proposed Action:</span>
                    <span className="text-xs font-sans text-slate-200">{agent.suggestedAction}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySpokenDeliberation(`${agent.name} states: ${agent.statement}`);
                    }}
                    className="text-[11px] font-mono text-earth-aqua hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Tab 2: Disagreements & Domain Friction */}
      {activeTab === 'friction' && (
        <div className="space-y-4">
          <GlassCard variant="medium" className="p-5 border border-amber-400/30 bg-amber-500/5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Debate #1: Urban Expansion vs Ecological Corridors
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Dr. Marcus Sterling (Urban AI)</strong> contends that rigid building exclusion zones drive up housing inflation and displace suburban commuters into carbon-heavy transport corridors. <strong>Dr. Maya Lin (Ecology AI)</strong> argues that without continuous 5-meter canopy corridors, local wildlife mortality will surge by 40% and foliar PM2.5 filtration will collapse.
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-earth-aqua">
              COUNCIL RESOLUTION: Adopt "Vertical Density + Micro-Bioswales" allowing high-density housing footprints while dedicating mandatory ground-level easements to contiguous vegetative drainage corridors.
            </div>
          </GlassCard>

          <GlassCard variant="medium" className="p-5 border border-cyan-400/30 bg-cyan-500/5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">
                Debate #2: Capital Allocation (Clean Tech vs Nature-Based Drainage)
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Eng. David Chen (Energy AI)</strong> requested 60% of municipal capital for heat pump incentives. <strong>Dr. Arun Kumar (Water AI)</strong> counter-argued that unmanaged aquifer depletion poses an immediate civil continuity threat that energy efficiency cannot resolve alone.
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-earth-aqua">
              COUNCIL RESOLUTION: 50/50 capital split utilizing dual-benefit bioswale corridors with integrated solar microgrid shade structures.
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tab 3: Chief Decision Agent Synthesis */}
      {activeTab === 'synthesis' && (
        <GlassCard variant="strong" className="p-6 border border-earth-aqua/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-earth-aqua/20 text-earth-aqua flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Chief Decision Agent Executive Resolution</h3>
              <div className="text-xs font-mono text-slate-400">Formal Multi-Agent Consensus Vector v3.2</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 text-xs leading-relaxed text-slate-200">
            <p>
              Having evaluated inputs from all 6 domain agents across <strong>{selectedHotspot.name}</strong>, the Council determines that <strong>compound thermal and hydrological stress</strong> is the primary system vulnerability.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono text-[11px]">
              <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                <span className="text-slate-400 block">Priority 1 (0-12 Mo):</span>
                <span className="text-earth-aqua font-bold text-xs mt-1 block">Stormwater Bioswales (+25%)</span>
                <span className="text-slate-400 mt-1 block">Relieves aquifer deficit and controls flash flooding.</span>
              </div>
              <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                <span className="text-slate-400 block">Priority 2 (12-36 Mo):</span>
                <span className="text-earth-emerald font-bold text-xs mt-1 block">Native Tree Biocorridors (+20%)</span>
                <span className="text-slate-400 mt-1 block">Restores biodiversity connectivity and drops UHI by 1.8°C.</span>
              </div>
              <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                <span className="text-slate-400 block">Priority 3 (36-60 Mo):</span>
                <span className="text-amber-400 font-bold text-xs mt-1 block">Transit Electrification (-15% Traffic)</span>
                <span className="text-slate-400 mt-1 block">Eliminates roadside NO₂ peaks in dense corridors.</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs font-mono text-slate-400">
              Confidence: <strong className="text-white">93.4%</strong> • Scientific Review: <strong className="text-earth-aqua">PASSED</strong>
            </div>
            <button
              onClick={onNavigateToSimulator}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-earth-aqua to-earth-emerald text-[#071A2B] font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-md transition-all"
            >
              <span>Load Consensus into Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
