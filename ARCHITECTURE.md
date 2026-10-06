# EARTHMIND: Architecture & Domain Design

## 1. Domain Structure
```
src/
├── assets/                  # Earth textures, SVG indicators, badges
├── components/
│   ├── 3d/                  # WebGL Three.js Earth Digital Twin
│   │   ├── EarthGlobe.tsx   # Interactive 3D Sphere, Atmosphere glow, Clouds, City lights
│   │   ├── HotspotMarker.tsx # 3D Geolocation markers with pulsing rings
│   │   ├── LayerOverlays.tsx # Dynamic WebGL/Canvas shader layers (Heat, Green, Flood, Risk)
│   │   └── OrbitControls.ts # Smooth rotation, zoom, damping
│   ├── glass/               # Liquid Glass Design System
│   │   ├── GlassCard.tsx
│   │   ├── GlassButton.tsx
│   │   ├── GlassBadge.tsx
│   │   ├── GlassModal.tsx
│   │   └── GlassMetric.tsx
│   ├── navigation/          # Floating glass sidebar, header, global command palette
│   │   ├── Navbar.tsx
│   │   ├── CommandPalette.tsx (Ctrl+K)
│   │   └── StatusBar.tsx
│   ├── common/              # Tooltips, sliders, tabs, toggles
│   │   ├── GlassSlider.tsx
│   │   └── MetricIndicator.tsx
├── domains/
│   ├── explorer/            # Earth Explorer & Hotspot Intelligence
│   │   ├── EarthExplorerView.tsx
│   │   ├── LayerSelector.tsx
│   │   └── HotspotIntelligencePanel.tsx
│   ├── memory/              # Temporal Forensics (2010-2026)
│   │   ├── EarthMemoryView.tsx
│   │   ├── TimelineScrubber.tsx
│   │   └── BeforeAfterSplit.tsx
│   ├── forensics/           # Environmental Forensics Engine
│   │   ├── ForensicsInvestigationView.tsx
│   │   ├── FactorCorrelationMatrix.tsx
│   │   └── AnomalyDetector.tsx
│   ├── simulation/          # WHAT-IF Simulation Engine
│   │   ├── WhatIfSimulatorView.tsx
│   │   ├── PolicySliders.tsx
│   │   ├── SimulationEngine.ts
│   │   └── IndicatorCharts.tsx
│   ├── scenarios/           # Multi-Scenario Lab
│   │   ├── ScenarioComparisonView.tsx
│   │   └── ScenarioMatrix.tsx
│   ├── ai/                  # EARTHMIND AI Decision Engine & Assistant
│   │   ├── DecisionEngineView.tsx
│   │   ├── AssistantDrawer.tsx
│   │   └── ReasoningCard.tsx
│   ├── reports/             # Environmental Intelligence Report
│   │   ├── ReportGeneratorView.tsx
│   │   └── PrintableReport.tsx
│   ├── exhibition/          # Young Scientist '26 Presentation Mode
│   │   └── ScienceExhibitionView.tsx
│   └── demo/                # Guided Exhibition Tour (2-3 min automated workflow)
│       └── GuidedDemoController.tsx
├── landing/                 # World-Class SaaS Landing Page
│   ├── LandingPage.tsx
│   ├── HeroSection.tsx
│   ├── FeaturesGrid.tsx
│   └── IntelligenceShowcase.tsx
├── types/                   # Unified TypeScript Contracts
│   ├── environmental.ts
│   ├── simulation.ts
│   ├── forensics.ts
│   └── scenario.ts
├── data/                    # Curated Hotspot Datasets & Empirical Simulation Models
│   ├── hotspotsData.ts
│   ├── historicalRecords.ts
│   └── presetScenarios.ts
└── App.tsx                  # Main router & active view state orchestration
```

## 2. Mathematical Simulation Engine Formulation
The simulation model calculates reactive non-linear environmental indicators based on policy inputs:
- $\Delta \text{TreeCover} \in [-20\%, +50\%]$
- $\Delta \text{Rainfall} \in [-30\%, +60\%]$
- $\Delta \text{Urbanization} \in [-20\%, +50\%]$
- $\Delta \text{Waste} \in [-30\%, +70\%]$
- $\Delta \text{WaterAvail} \in [-50\%, +50\%]$
- $\Delta \text{Traffic} \in [-30\%, +60\%]$
- $\Delta \text{EnergyEfficiency} \in [-30\%, +50\%]$

### Indicators Computed:
1. **Heat Island Risk**:
   $$\text{HeatRisk} = \text{Clamp}(72 - 0.55 \Delta T_{\text{tree}} + 0.45 \Delta U_{\text{urban}} + 0.20 \Delta T_{\text{traffic}} - 0.25 \Delta E_{\text{eff}}, 10, 100)$$
2. **Flood Vulnerability**:
   $$\text{FloodRisk} = \text{Clamp}(61 + 0.60 \Delta R_{\text{rain}} + 0.35 \Delta U_{\text{urban}} - 0.40 \Delta T_{\text{tree}} - 0.25 \Delta W_{\text{water}}, 10, 100)$$
3. **Air Pollution Index**:
   $$\text{Pollution} = \text{Clamp}(68 - 0.35 \Delta T_{\text{tree}} + 0.40 \Delta T_{\text{traffic}} + 0.30 \Delta U_{\text{urban}} - 0.30 \Delta E_{\text{eff}} + 0.15 \Delta W_{\text{waste}}, 10, 100)$$
4. **Water Stress Index**:
   $$\text{WaterStress} = \text{Clamp}(57 - 0.50 \Delta W_{\text{water}} - 0.35 \Delta R_{\text{rain}} + 0.30 \Delta U_{\text{urban}} - 0.15 \Delta T_{\text{tree}}, 10, 100)$$
5. **Composite Environmental Health Score**:
   $$\text{EnvHealth} = \text{Clamp}(100 - 0.28 \times \text{HeatRisk} - 0.24 \times \text{FloodRisk} - 0.26 \times \text{Pollution} - 0.22 \times \text{WaterStress}, 0, 100)$$
