# EARTHMIND SYSTEM ARCHITECTURE MAP (OS 4.0)

> **Document Type**: Comprehensive Planetary Intelligence OS Audit & System Topology
> **Status**: Verified Locally — Phase 0 & Phase 1 Complete
> **Deployment Safety**: LOCAL ONLY. No commits, no pushes, no Vercel deployments.

---

## 1. Executive System Topology

EARTHMIND is architected as a **Planetary Environmental Intelligence Operating System** running on a modern client-first Vite + React 18 + TypeScript runtime with real-time biophysical modeling, multi-modal Gemini Live voice routing, spatial liquid glass rendering, and curated Earth observation telemetry.

```text
                                  ┌────────────────────────────────┐
                                  │   OPERATOR INTERACTION TIER    │
                                  │ Voice 3.0 / Keyboard / Mouse   │
                                  │ Appearance Studio / HUD Rail   │
                                  └───────────────┬────────────────┘
                                                  │
                                  ┌───────────────▼────────────────┐
                                  │    EARTHMIND COMMAND BUS       │
                                  │   Unified Event Dispatcher     │
                                  └───────────────┬────────────────┘
                                                  │
                  ┌───────────────────────────────┼───────────────────────────────┐
                  │                               │                               │
    ┌─────────────▼─────────────┐   ┌─────────────▼─────────────┐   ┌─────────────▼─────────────┐
    │     APPLICATION STATE     │   │    VOICE & MULTI-MODAL    │   │     INTELLIGENCE ENGINE   │
    │  EarthMind Core Context   │   │  VoiceEngine (WebSocket/  │   │  ResearchOrchestrator     │
    │  TwinConfigContext        │   │  WebAudio / Fallback)     │   │  FactCheck & Evidence     │
    │  Simulation Parameters    │   │  VoiceCommandParser       │   │  SourceQualityEngine      │
    └─────────────┬─────────────┘   └─────────────┬─────────────┘   └─────────────┬─────────────┘
                  │                               │                               │
                  └───────────────────────────────┼───────────────────────────────┘
                                                  │
                  ┌───────────────────────────────┼───────────────────────────────┐
                  │                               │                               │
    ┌─────────────▼─────────────┐   ┌─────────────▼─────────────┐   ┌─────────────▼─────────────┐
    │    DOMAIN SERVICE TIER    │   │    PLANETARY ENGINE       │   │    PRESENTATION LAYER     │
    │  SimulationEngine (Math)  │   │  Three.js 3D Earth        │   │  Liquid Glass System 2.0  │
    │  CalculationEngine        │   │  Multi-Layer Raster       │   │  Appearance Studio        │
    │  Forensics & Attribution  │   │  City Digital Twin (3D)   │   │  29 Domain Views          │
    │  Decision & Sentinel      │   │  Hotspot Telemetry Cache  │   │  Glass Primitives Suite   │
    └───────────────────────────┘   └───────────────────────────┘   └───────────────────────────┘
```

---

## 2. Subsystem Identification & Mapping

| Subsystem | Architecture / Implementation | Source Location | Key Roles |
|---|---|---|---|
| **Frontend Runtime** | React 18.3.1, TypeScript 5.9.3, Vite 5.4.21, Tailwind CSS | `src/App.tsx`, `src/main.tsx`, `index.html` | SPA host, spatial shell, dynamic routing |
| **Theme & Design** | Liquid Glass 2.0 Token Engine, CSS variables, pointer sheen physics | `src/theme/`, `src/components/glass/`, `src/index.css` | 0-100% customization, 10 presets, 22 glass primitives |
| **State Management** | React Context (`TwinConfigContext`, `VoiceContext`, `ThemeProvider`) + `EarthMindContext` | `src/context/`, `src/voice/VoiceContext.tsx`, `src/earthmind/EarthMindContext.ts` | Authoritative single-source-of-truth across UI, Voice, Tools |
| **Voice Intelligence** | Dual-tier Web Speech API + Gemini Live WebSockets + Fallback Engine | `src/voice/` | Multi-intent routing, Tamil/English/Mixed, Screen understanding |
| **AI & Research** | Gemini 2.0 / Flash grounding + Google Search fallback + Evidence Graph | `src/intelligence/`, `src/web/` | 5-stage research pipeline, Fact checking, Source authority scoring |
| **Simulation Lab** | Deterministic biophysical coupled math engine (No LLM hallucinations) | `src/domains/simulation/SimulationEngine.ts`, `src/earthmind/CalculationEngine.ts` | Coupled albedo, evapotranspiration, runoff, carbon, heat/flood risk |
| **Earth & Spatial** | Three.js WebGL globe, orbital atmosphere, markers, raster tiles | `src/domains/explorer/`, `src/domains/satellite/` | Interactive Earth, hotspot focusing, multi-spectral band modes |
| **Domains (29 Views)** | Modular environmental intelligence domain views | `src/domains/` | Explorer, Memory, Forensics, Water, Climate, Autopilot, Council, etc. |
| **Security & Guardrails**| Rate limiter, prompt sanitizer, tool permission manager, destructive gates | `src/security/` | Command validation, confirmation modals, API key defense |
| **Testing** | Automated TSX benchmark test runner | `scripts/testVoiceSuite.ts` | 82 unit/integration tests validating routing, tools, and math |

---

## 3. Phase 1 — Feature Inventory & Status Matrix

| System / Feature | Location | Status | Purpose & Capabilities | Dependencies | Risk / Upgrade Path |
|---|---|---|---|---|---|
| **Earth Explorer** | `src/domains/explorer/` | **WORKING** | 3D WebGL Earth, hotspot markers, active layer overlays | Three.js, hotspot data | Extend with unified layer manager and dynamic legends |
| **Earth Memory** | `src/domains/memory/` | **WORKING** | Multi-decadal historical comparison (2000 vs 2026) | Hotspot history | Connect to EarthMindCommandBus & temporal delta engine |
| **Forensics Lab** | `src/domains/forensics/` | **WORKING** | Satellite driver attribution & factor decomposition | Forensics data, AI | Ensure correlation vs causality distinction is explicit |
| **What-If Simulator** | `src/domains/simulation/` | **WORKING** | 7-variable coupled counterfactual biophysical model | SimulationEngine | Upgrade to Simulation Lab 2.0 with Future Fork & Compound |
| **Future Fork** | `src/domains/futurefork/` | **WORKING** | Scenario branching (Green vs Base vs Stress) | SimulationEngine | Link directly with unified command bus |
| **Compound Disaster** | `src/domains/compound/` | **WORKING** | Multi-hazard amplification modeling | Compound hazard data | Enrich with coupled risk engine formulas |
| **City Digital Twin** | `src/domains/citytwin/` | **WORKING** | 3D procedural urban twin (flood/heat/density) | Three.js, Procedural mesh | Enhance with 3D City Intelligence Mode |
| **Environmental Council** | `src/domains/council/` | **WORKING** | Multi-agent council debate (Climate, Water, Ecology, Urban, Risk) | CouncilAgent model | Orchestrate with synthesized Decision Agent consensus |
| **Autopilot Agent** | `src/domains/autopilot/` | **WORKING** | Autonomous 9-stage environmental investigation | SimulationEngine | Add safety confirmation gates for parameter overrides |
| **Sentinel Monitor** | `src/domains/sentinel/` | **WORKING** | Early warning anomaly detection & sensor watch | Sentinel data | Add EarthMind Sentinel automated telemetry scan |
| **Scientific Lab** | `src/domains/research/` | **WORKING** | Hypothesis formulation & experimentation | ScientificExperiment | Add Save/Reproduce experiment state serialization |
| **Decision Center** | `src/domains/decisions/` | **WORKING** | Intervention ranking (Cost, Capex, Ecological benefit) | DecisionIntervention | Upgrade with multi-scenario trade-off optimizer |
| **Voice Intelligence** | `src/voice/` | **WORKING** | Multi-modal speech, 82 verified tests, screen context | Web Speech, Gemini Live | Upgrade to Voice 3.0 with context retention ("What about 2035?") |
| **Web Research** | `src/intelligence/`, `src/web/` | **WORKING** | Google Search grounding, 5-stage pipeline, Source authority | Fetch API, Curated registry | Expand SourceQualityEngine (NASA, NOAA, ESA, ISRO, IPCC) |
| **Liquid Glass 2.0** | `src/theme/`, `src/components/glass/` | **WORKING** | Spatial theming, 0-100% controls, Appearance Studio | CSS variables, Tailwind | Extend to Information Density modes (Focus, Data, Expert) |

---

## 4. Architectural Boundaries (Phase 2)

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. PRESENTATION LAYER (UI)                                             │
│    Components, Glass Primitives, Views, Theme Customizer, HUD          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Commands / User Actions
┌───────────────────────────────────▼────────────────────────────────────┐
│ 2. EARTHMIND COMMAND & EVENT BUS                                       │
│    EarthMindCommandBus, EarthMindEventBus, Unified Action Dispatcher   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ State Updates / Events
┌───────────────────────────────────▼────────────────────────────────────┐
│ 3. APPLICATION STATE & CONTEXT                                         │
│    EarthMindCoreContext, TwinConfigContext, VoiceContext, ThemeContext  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Invocations & Subscriptions
┌───────────────────────────────────▼────────────────────────────────────┐
│ 4. DOMAIN ENGINES & INTELLIGENCE SERVICES                              │
│    SimulationEngine, RiskEngine, ForensicsEngine, DecisionEngine,      │
│    SourceQualityEngine, ResearchOrchestrator, ScreenUnderstanding      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Raw Data Fetch & Grounding
┌───────────────────────────────────▼────────────────────────────────────┐
│ 5. DATA, OBSERVATION & EXTERNAL PROVIDERS                              │
│    Hotspots Data, Historical Timeseries, GoogleSearchProvider, Gemini  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Deployment Safety Commitment

- **Local Development Mode**: Verified.
- **Git Commit**: BLOCKED.
- **Git Push**: BLOCKED.
- **Vercel Deployment**: BLOCKED.
- **Status**: Ready for local Phase 2–45 systematic upgrades.
