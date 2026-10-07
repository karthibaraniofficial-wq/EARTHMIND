# EARTHMIND: Project State

- **Current Phase**: EARTHMIND VOICE INTELLIGENCE 2.0 UPGRADE COMPLETE & VERIFIED
- **Current Module**: Multimodal Voice Intelligence Subsystem, Google Search Grounding, Research Intelligence Layer, Scientific Reasoning Engine, Deterministic Math, 28-Tool Master Registry, Dual-Tier Answer Composer, Section 48 Diagnostic Telemetry
- **Current Status**: RELEASED & VERIFIED (All 37 automated tests passed flawlessly, production build `npm run build` succeeds cleanly in 1m 17s with 0 errors)

---

## Completed in Voice Intelligence 2.0 Upgrade:

1. **AI Model Governance & Architecture**:
   - Primary real-time voice model: `GEMINI_LIVE_MODEL=gemini-3.8-live` (never `gemini-2.0-flash-exp`).
   - Secondary research model: `GEMINI_RESEARCH_MODEL=gemini-3.8-flash` for web search, URL analysis, and deep reasoning.
   - Centralized governance in `src/config/aiModels.ts`, eliminating all hardcoded model names across the codebase.
   - Dynamic health endpoint `/api/health/ai` and Vite dev server reporting live model configurations.

2. **Google Search Grounding & Web Intelligence (`src/web/`)**:
   - `GoogleSearchProvider.ts`: Multi-query expansion, live Google Search grounding against `/api/research/query`, and curated offline fallback index.
   - `WebSourceParser.ts`: Domain extraction, official agency identification (NASA, NOAA, IPCC, ISRO, Nature, Copernicus), and source normalization.
   - `URLResearchProvider.ts`: Real-time web retrieval against `/api/research/url`, content sanitization, and honest error handling (never fakes reading URLs).
   - `CitationManager.ts`: Formatted APA-style citations and spoken conversational attribution phrases.

3. **Multi-Source Quality & Corroboration Engine (`src/intelligence/`)**:
   - `SourceQualityEngine.ts`: 5-dimensional scoring (`authority_score`, `freshness_score`, `relevance_score`, `cross_source_score`, `scientific_reliability`).
   - `EvidenceEngine.ts`: Multi-source agreement vs. conflict detection (`AGREEMENT`, `CONFLICT`, `UNCERTAINTY`).
   - `FactCheckEngine.ts`: Verifies scientific claims and returns verdicts (`SUPPORTED`, `PARTIALLY_SUPPORTED`, `UNSUPPORTED`, `CONTRADICTED`, `INSUFFICIENT_EVIDENCE`).
   - `ScientificReasoningEngine.ts`: Distinguishes correlation from causation, analyzes multi-domain couplings (deforestation, rainfall, runoff, sponge cities), and supports explanation depth levels 1 through 5.
   - `UncertaintyEngine.ts`: Standardized provenance metadata (`OBSERVED`, `MEASURED`, `MODELED`, `SIMULATED`, `ESTIMATED`, `PROJECTED`, `PREDICTED`, `DEMO_DATA`).
   - `AnswerComposer.ts`: Dual-tier synthesis separating spoken audio (1-3 concise sentences) from structured screen cards (`EARTHMIND ANALYSIS` vs. `EXTERNAL EVIDENCE`).
   - `IntentRouter.ts`: 14-category intent classifier with English, Tamil, Hindi, and Tamil-English code-switching support.

4. **EarthMind Domain Control & Tools Registry (`src/earthmind/`)**:
   - `EarthMindTools.ts`: Consolidated 28-tool master registry with parameter bounds validation and category routing.
   - `CalculationEngine.ts`: Deterministic arithmetic, percentage changes, unit conversions (km² to ha), and carbon fluxes (strictly preventing LLM math hallucinations).
   - `EarthMindStateBridge.ts`: Single source of truth bridge ensuring Voice, Mouse, Keyboard, and AI operate on identical state.
   - Added Chennai hotspot in `src/data/hotspotsData.ts` with historical flood risk time-series (2010–2026), Pallikaranai marshland encroachment forensics, and sponge-city recommendations.

5. **Security & Prompt Injection Defenses (`src/security/`)**:
   - `SecretManager.ts`: Zero client-side API key exposure; permanent keys confined to server environments.
   - `InputValidator.ts`: Parameter clamping (-100% to +100%, years 1950–2100), coordinate verification, and prompt injection filtering for external web content.
   - `ToolPermissionManager.ts`: Tier classification (`READ_ONLY`, `SAFE_ACTION`, `HIGH_IMPACT_ACTION`) with mandatory confirmation modals for destructive operations.

6. **UI Components & Operational Telemetry (`src/components/voice/`)**:
   - `VoicePanel.tsx`: 5-tab hub (`Control`, `Research`, `Timeline`, `Diagnostics`, `History`) with complete Section 48 14-metric telemetry board.
   - `VoiceResearchSourcesPanel.tsx`: Interactive sliding drawer with verified citations, authority scores, copy citation, and cross-source comparisons.
   - `ResearchTimeline.tsx`: Live 5-stage research milestone visualization (`SEARCHING` -> `SOURCE DISCOVERY` -> `SOURCE VALIDATION` -> `EVIDENCE ANALYSIS` -> `ANSWER`).
   - `VoiceTranscript.tsx`: Dual-tier visual cards separating `EARTHMIND ANALYSIS` from `EXTERNAL EVIDENCE` with clickable source chips.
   - Voice Focus Spotlight HUD mounted in `src/App.tsx`.

7. **Reports & Exports (`src/reports/`)**:
   - `ResearchReportGenerator.ts`: Generates structured environmental research briefs exportable as Markdown, HTML, JSON, or printable document.

8. **Verification & Quality Gates**:
   - Automated Test Suite: `scripts/testVoiceSuite.ts` (37/37 tests passed).
   - Production Build: `npm run build` (`tsc -b && vite build`) passed with 0 errors.
