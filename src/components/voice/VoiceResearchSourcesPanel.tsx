/**
 * EARTHMIND - Voice Research Sources Panel
 * Renders verified scientific sources with multi-dimensional quality scores,
 * formal citations, external links, and cross-source comparisons.
 */

import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ShieldCheck, Calendar, BookOpen, X, Sparkles, Scale } from '../icons';
import { GlassCard } from '../glass/GlassCard';
import { GlassBadge } from '../glass/GlassBadge';
import { GlassButton } from '../glass/GlassButton';
import { WebSource } from '../../web/WebSourceParser';
import { useVoice } from '../../voice/VoiceContext';

import { ResearchPipelineIndicator } from './ResearchPipelineIndicator';

interface VoiceResearchSourcesPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  sources?: WebSource[];
}

export const VoiceResearchSourcesPanel: React.FC<VoiceResearchSourcesPanelProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  sources: propSources,
}) => {
  const { isSourcesPanelOpen, setIsSourcesPanelOpen, researchSources } = useVoice();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [comparingIds, setComparingIds] = useState<string[]>([]);

  const isOpen = propIsOpen !== undefined ? propIsOpen : isSourcesPanelOpen;
  const onClose = propOnClose || (() => setIsSourcesPanelOpen(false));
  const activeSources = propSources || researchSources;

  if (!isOpen) return null;

  const handleCopyCitation = (source: WebSource) => {
    const year = source.publicationDate ? new Date(source.publicationDate).getFullYear() : 2026;
    const pub = source.publisher.split('(')[0].trim();
    const citation = `${pub} (${year}). "${source.title}". Available at: ${source.url}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(source.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCompare = (id: string) => {
    setComparingIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev.slice(-1), id]
    );
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[80] w-full sm:w-[480px] p-4 flex flex-col justify-end pointer-events-none animate-in fade-in slide-in-from-right duration-200">
      <div className="pointer-events-auto w-full max-h-[92vh] flex flex-col">
        <GlassCard variant="strong" glow="aqua" className="flex flex-col flex-1 overflow-hidden border border-earth-aqua/30 shadow-2xl bg-[#071A2B]/95 backdrop-blur-2xl">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-earth-aqua/20 text-earth-aqua">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  Verified Scientific Sources
                  <GlassBadge tone="emerald" size="sm">
                    {activeSources.length} Active
                  </GlassBadge>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Grounding Lineage • SourceQualityEngine Certified
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Research Pipeline Flow: SEARCHING -> SOURCES -> VALIDATING -> ANALYZING -> ANSWER */}
          <div className="px-4 pt-3 pb-1">
            <ResearchPipelineIndicator currentStage={activeSources.length > 0 ? 'validating' : 'searching'} />
          </div>

          {/* Sources List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
            {activeSources.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-earth-aqua/50 animate-pulse" />
                <p>No external research sources queried for this active turn.</p>
                <p className="text-[10px] text-slate-500">
                  Ask "Search the latest climate news" or "Fact check this claim".
                </p>
              </div>
            ) : (
              activeSources.map((source) => {
                const isComparing = comparingIds.includes(source.id);

                return (
                  <div
                    key={source.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isComparing
                        ? 'bg-earth-aqua/10 border-earth-aqua/60 shadow-lg'
                        : 'glass-panel-1 border-white/10 hover:border-earth-aqua/30'
                    }`}
                  >
                    {/* Top Row: Publisher & Domain */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <span className="text-[11px] font-bold text-earth-aqua block leading-tight">
                          {source.publisher}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {source.domain}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {source.isPeerReviewed && (
                          <GlassBadge tone="aqua" size="sm">
                            Peer-Reviewed
                          </GlassBadge>
                        )}
                        <GlassBadge
                          tone={source.authorityScore >= 90 ? 'emerald' : 'sun'}
                          size="sm"
                        >
                          Auth: {source.authorityScore}%
                        </GlassBadge>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-xs font-semibold text-white mb-1.5 leading-snug">
                      {source.title}
                    </h4>

                    {/* Snippet */}
                    <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                      "{source.snippet}"
                    </p>

                    {/* Quality Score Badges */}
                    <div className="grid grid-cols-4 gap-1.5 p-2 rounded-lg bg-black/30 border border-white/5 font-mono text-[9px] mb-3">
                      <div>
                        <span className="text-slate-400 block">AUTHORITY</span>
                        <span className="text-earth-emerald font-bold">{source.authorityScore}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">FRESHNESS</span>
                        <span className="text-earth-aqua font-bold">{source.freshnessScore}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">RELEVANCE</span>
                        <span className="text-amber-300 font-bold">{source.relevanceScore}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">RELIABILITY</span>
                        <span className="text-cyan-300 font-bold">{source.scientificReliability}</span>
                      </div>
                    </div>

                    {/* Dates & Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {source.publicationDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCompare(source.id)}
                          className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition-colors ${
                            isComparing
                              ? 'bg-earth-aqua text-black font-bold'
                              : 'text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                          title="Compare with another source"
                        >
                          <Scale className="w-3 h-3" />
                          {isComparing ? 'Comparing' : 'Compare'}
                        </button>
                        <button
                          onClick={() => handleCopyCitation(source)}
                          className="px-2 py-1 rounded text-[10px] font-mono text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1 transition-colors"
                          title="Copy formal citation"
                        >
                          {copiedId === source.id ? (
                            <>
                              <Check className="w-3 h-3 text-earth-emerald" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Cite
                            </>
                          )}
                        </button>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 rounded text-[10px] font-mono text-earth-aqua hover:bg-earth-aqua/10 flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
