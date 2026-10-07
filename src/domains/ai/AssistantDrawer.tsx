import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Sliders, 
  AlertCircle, 
  ShieldCheck, 
  Check,
  Mic
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassButton } from '../../components/glass/GlassButton';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { useVoice } from '../../voice/VoiceContext';

import { 
  AiChatMessage, 
  EnvironmentalHotspot, 
  LayerType, 
  SimulationParameters, 
  SimulationResultMetrics 
} from '../../types';

interface AssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHotspot: EnvironmentalHotspot;
  activeLayer: LayerType;
  currentSimParams?: SimulationParameters;
  currentSimMetrics?: SimulationResultMetrics;
  onApplySimPreset?: (params: Partial<SimulationParameters>) => void;
  onNavigate?: (view: string) => void;
}

export const AssistantDrawer: React.FC<AssistantDrawerProps> = ({
  isOpen,
  onClose,
  selectedHotspot,
  activeLayer,
  currentSimParams,
  currentSimMetrics,
  onApplySimPreset,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Greetings. I am EARTHMIND AI, your context-aware environmental digital twin intelligence assistant. I am currently monitoring ${selectedHotspot.name} with the ${activeLayer.replace('_', ' ')} layer active. How can I assist your investigation?`,
      timestamp: 'Just now',
      contextBadge: `${selectedHotspot.name} • Health ${selectedHotspot.currentMetrics.environmentalHealth}`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { toggleListening, isListening, liveTranscript } = useVoice();

  // Populate input if speaking into drawer
  useEffect(() => {
    if (isListening && liveTranscript) {
      setInput(liveTranscript);
    }
  }, [isListening, liveTranscript]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  const quickChips = [
    { label: 'What changed here since 2018?', query: 'What changed in this hotspot since 2018?' },
    { label: 'What if green cover +30%?', query: 'What happens if we increase green cover by 30%?' },
    { label: 'Why is this region warming?', query: 'Why is this region experiencing surface warming?' },
    { label: 'Best intervention outcome?', query: 'Which policy intervention delivers the highest environmental resilience?' },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q) return;

    const userMsg: AiChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Context-aware intelligent response synthesis
    setTimeout(() => {
      let reply = '';
      let suggestedAction: AiChatMessage['suggestedAction'];

      const lowerQ = q.toLowerCase();

      if (lowerQ.includes('autopilot') || lowerQ.includes('optimize')) {
        reply = `Initiating EarthMind Autopilot for ${selectedHotspot.name}. Running combinatorial Pareto search across 5,000 policy permutations to synthesize an optimal intervention package.`;
        suggestedAction = {
          label: 'Launch Regional Autopilot',
          actionType: 'NAVIGATE',
          payload: 'autopilot',
        };
      } else if (lowerQ.includes('council') || lowerQ.includes('debate') || lowerQ.includes('agents')) {
        reply = `Convening the 6-agent EarthMind Environmental Council (Climate, Water, Ecology, Urban, Risk, Energy) to deliberate biophysical trade-offs for ${selectedHotspot.name}.`;
        suggestedAction = {
          label: 'Open Council Chamber',
          actionType: 'NAVIGATE',
          payload: 'council',
        };
      } else if (lowerQ.includes('fork') || lowerQ.includes('future') || lowerQ.includes('2050')) {
        reply = `EarthMind Future Fork has branched 3 trajectories from 2026: Green Regeneration (+1.2°C), Baseline (+2.4°C), and Climate Stress (+4.2°C).`;
        suggestedAction = {
          label: 'Explore Future Fork',
          actionType: 'NAVIGATE',
          payload: 'future_fork',
        };
      } else if (lowerQ.includes('city') || lowerQ.includes('canyon') || lowerQ.includes('cool roof')) {
        reply = `Opening 3D City Digital Twin for ${selectedHotspot.name}. You can interactively test cool roofs, permeable pavements, and urban green corridors.`;
        suggestedAction = {
          label: 'Open 3D City Twin',
          actionType: 'NAVIGATE',
          payload: 'city_twin',
        };
      } else if (lowerQ.includes('compound') || lowerQ.includes('disaster')) {
        reply = `Loading Compound Multi-Hazard Simulator. Stress-testing concurrent cloudburst rainfall, impervious surfaces, and drainage bottlenecks.`;
        suggestedAction = {
          label: 'Open Compound Simulator',
          actionType: 'NAVIGATE',
          payload: 'compound_disaster',
        };
      } else if (lowerQ.includes('what changed') || lowerQ.includes('history') || lowerQ.includes('2018')) {
        reply = `In ${selectedHotspot.name}, satellite radar and multispectral time-series confirm that built-up impervious area expanded by +${selectedHotspot.forensics.detectedChanges.builtUpExpansion}%, while vegetative canopy contracted by ${selectedHotspot.forensics.detectedChanges.vegetationChange}%. This matches an observed +${selectedHotspot.forensics.detectedChanges.surfaceTempDelta}°C land surface temperature anomaly in our downscaled observations.`;
        suggestedAction = {
          label: 'Inspect Earth Memory Timeline',
          actionType: 'NAVIGATE',
          payload: 'memory',
        };
      } else if (lowerQ.includes('green cover') || lowerQ.includes('tree') || lowerQ.includes('+30') || lowerQ.includes('what if')) {
        reply = `Increasing tree canopy coverage by +30% in ${selectedHotspot.name} generates significant local microclimate benefits: modeled urban heat island risk drops by ~16 points due to enhanced vegetative evapotranspiration, and peak flash flood vulnerability declines by ~12 points through soil percolation absorption.`;
        suggestedAction = {
          label: 'Apply +30% Canopy in Simulator',
          actionType: 'APPLY_PRESET',
          payload: { treeCoverDelta: 30 },
        };
      } else if (lowerQ.includes('why') || lowerQ.includes('warming') || lowerQ.includes('cause')) {
        const topFactor = selectedHotspot.forensics.factors[0];
        reply = `Empirical forensic analysis indicates that ${topFactor.factor.toLowerCase()} is the primary model-associated factor (Confidence: ${Math.round(topFactor.confidence * 100)}%). ${topFactor.explanation}`;
        suggestedAction = {
          label: 'Open Forensic Deep-Dive',
          actionType: 'NAVIGATE',
          payload: 'forensics',
        };
      } else if (lowerQ.includes('best') || lowerQ.includes('intervention') || lowerQ.includes('recommend')) {
        const topRec = selectedHotspot.recommendations[0];
        reply = `For ${selectedHotspot.name}, the highest-yield intervention is Priority 1: "${topRec.title}". ${topRec.action} This produces an estimated ${topRec.expectedImpact} supported by ${topRec.evidence}.`;
        suggestedAction = {
          label: 'Simulate Priority 1 Scenario',
          actionType: 'NAVIGATE',
          payload: 'simulator',
        };
      } else {
        reply = `Based on current telemetry for ${selectedHotspot.name}, the Environmental Health score is ${selectedHotspot.currentMetrics.environmentalHealth}/100 with ${selectedHotspot.primaryRisk.toLowerCase()} as the primary risk. You can run the Autopilot optimizer, convene the Environmental Council, or test reactive futures in the WHAT-IF Simulator.`;
      }

      const botMsg: AiChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction,
        contextBadge: `${selectedHotspot.name} • ${activeLayer}`,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#071A2B]/75 backdrop-blur-sm z-[80] transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-[80] w-full sm:w-[460px] bg-[#071A2B]/95 backdrop-blur-2xl border-l border-white/15 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Glowing AI Orb */}
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-earth-aqua via-earth-aurora to-earth-emerald p-0.5 shadow-[0_0_20px_rgba(155,124,255,0.4)]">
            <div className="w-full h-full bg-[#071A2B] rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-earth-aurora animate-pulse" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-earth-emerald rounded-full border-2 border-[#071A2B]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">EARTHMIND AI</h3>
              <GlassBadge tone="aurora" size="sm">Decision Support</GlassBadge>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Active Context: {selectedHotspot.name}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Context Status Strip */}
      <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-earth-aqua" />
          <span className="text-slate-200">{selectedHotspot.name}</span>
        </div>
        <div>
          <span>Layer: </span>
          <span className="text-earth-aurora font-semibold capitalize">{activeLayer.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.contextBadge && (
              <span className="text-[10px] font-mono text-slate-500 mb-1 px-1">
                {msg.contextBadge}
              </span>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-earth-ocean to-earth-aqua text-white font-medium shadow-md'
                  : 'glass-panel-2 border border-white/10 text-slate-200 shadow-sm'
              }`}
            >
              <p>{msg.text}</p>

              {/* Action Chip Trigger */}
              {msg.suggestedAction && (
                <div className="mt-3 pt-2.5 border-t border-white/10">
                  <button
                    onClick={() => {
                      if (msg.suggestedAction?.actionType === 'APPLY_PRESET' && onApplySimPreset) {
                        onApplySimPreset(msg.suggestedAction.payload);
                      }
                      if (msg.suggestedAction?.actionType === 'NAVIGATE' && onNavigate) {
                        onNavigate(msg.suggestedAction.payload);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-earth-aurora/20 text-earth-aurora border border-earth-aurora/35 font-bold hover:bg-earth-aurora/30 transition-all text-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{msg.suggestedAction.label}</span>
                    <ArrowRight className="w-3 h-3 ml-0.5" />
                  </button>
                </div>
              )}
            </div>

            <span className="text-[10px] text-slate-500 mt-1 px-1 font-mono">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 p-3 rounded-2xl glass-panel-1 border border-white/10 text-xs text-earth-aurora w-32">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span className="animate-pulse">Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-3 border-t border-white/10 bg-slate-950/40">
        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
          Suggested Questions:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.query)}
              className="text-[11px] px-2.5 py-1 rounded-lg glass-panel-1 text-slate-300 hover:text-white hover:border-earth-aurora/40 border border-white/10 transition-colors"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box Form */}
      <div className="p-3 border-t border-white/10 bg-slate-950/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${selectedHotspot.name}...`}
            className="flex-1 bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-earth-aqua"
          />
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-earth-aqua text-[#071A2B] border-earth-aqua shadow-[0_0_15px_rgba(24,200,200,0.5)]'
                : 'glass-panel-1 border-white/15 text-slate-300 hover:text-earth-aqua hover:border-earth-aqua/40'
            }`}
            title="Speak your question to EarthMind"
          >
            <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-pulse' : ''}`} />
          </button>
          <GlassButton
            type="submit"
            variant="aurora"
            size="sm"
            disabled={!input.trim() || isThinking}
          >
            <Send className="w-3.5 h-3.5" />
          </GlassButton>
        </form>
      </div>
    </div>
    </>
  );
};
