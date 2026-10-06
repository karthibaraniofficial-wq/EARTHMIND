import React, { useState, useEffect } from 'react';
import { Navbar } from './components/navigation/Navbar';
import { StatusBar } from './components/navigation/StatusBar';
import { CommandPalette } from './components/navigation/CommandPalette';
import { AssistantDrawer } from './domains/ai/AssistantDrawer';
import { GuidedDemoController } from './domains/demo/GuidedDemoController';
import { ScienceExhibitionView } from './domains/exhibition/ScienceExhibitionView';
import { MethodologyModal } from './components/modals/MethodologyModal';
import { TwinConfigProvider, useTwinConfig } from './context/TwinConfigContext';
import { VoiceProvider, useVoice } from './voice/VoiceContext';

// Voice Intelligence Components
import { VoiceOrb } from './components/voice/VoiceOrb';
import { VoiceTranscript } from './components/voice/VoiceTranscript';
import { VoicePanel } from './components/voice/VoicePanel';
import { VoiceSettingsPanel } from './components/voice/VoiceSettingsPanel';
import { VoiceConfirmationModal } from './components/voice/VoiceConfirmationModal';
import { VoicePermissionModal } from './components/voice/VoicePermissionModal';
import { VoiceTestConsole } from './components/voice/VoiceTestConsole';
import { VoiceCommandSuggestions } from './components/voice/VoiceCommandSuggestions';

// Core Platform Views
import { LandingPage } from './landing/LandingPage';
import { OverviewDashboardView } from './domains/overview/OverviewDashboardView';
import { EarthExplorerView } from './domains/explorer/EarthExplorerView';
import { EarthMemoryView } from './domains/memory/EarthMemoryView';
import { ForensicsInvestigationView } from './domains/forensics/ForensicsInvestigationView';
import { WhatIfSimulatorView } from './domains/simulation/WhatIfSimulatorView';
import { ScenarioComparisonView } from './domains/scenarios/ScenarioComparisonView';
import { ReportGeneratorView } from './domains/reports/ReportGeneratorView';

// Specialized Planetary OS Domain Views
import { LayersHubView } from './domains/layers/LayersHubView';
import { WaterIntelligenceView } from './domains/water/WaterIntelligenceView';
import { ClimateCarbonView } from './domains/climate/ClimateCarbonView';
import { BiodiversityView } from './domains/biodiversity/BiodiversityView';
import { CityIntelligenceView } from './domains/cities/CityIntelligenceView';
import { FutureProjectionsView } from './domains/forecast/FutureProjectionsView';
import { ScientificLabView } from './domains/research/ScientificLabView';
import { DecisionCenterView } from './domains/decisions/DecisionCenterView';
import { SettingsView } from './settings/SettingsView';

// 120-Feature Power Intelligence & Super-Tools Views
import { EarthMindAutopilotView } from './domains/autopilot/EarthMindAutopilotView';
import { EnvironmentalCouncilView } from './domains/council/EnvironmentalCouncilView';
import { FutureForkView } from './domains/futurefork/FutureForkView';
import { CompoundDisasterView } from './domains/compound/CompoundDisasterView';
import { CityDigitalTwinView } from './domains/citytwin/CityDigitalTwinView';
import { CausalGraphView } from './domains/causal/CausalGraphView';
import { SatelliteScannerView } from './domains/satellite/SatelliteScannerView';
import { ReproducibilityView } from './domains/reproducibility/ReproducibilityView';
import { SentinelMonitorView } from './domains/sentinel/SentinelMonitorView';
import { BattleModeView } from './domains/battle/BattleModeView';
import { MissionModeView } from './domains/missions/MissionModeView';

// Curated Data & Presets
import { ENVIRONMENTAL_HOTSPOTS, PRESET_SCENARIOS } from './data/hotspotsData';
import { 
  EnvironmentalHotspot, 
  LayerType, 
  SavedScenario, 
  SimulationParameters 
} from './types';
import { BASELINE_PARAMETERS } from './domains/simulation/SimulationEngine';


function AppContent() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [hotspots] = useState<EnvironmentalHotspot[]>(ENVIRONMENTAL_HOTSPOTS);
  const [selectedHotspot, setSelectedHotspot] = useState<EnvironmentalHotspot>(ENVIRONMENTAL_HOTSPOTS[0]);
  const [activeLayer, setActiveLayer] = useState<LayerType>('health');
  
  // Scenarios state
  const [scenarios, setScenarios] = useState<SavedScenario[]>(PRESET_SCENARIOS);
  const [activeScenario, setActiveScenario] = useState<SavedScenario>(PRESET_SCENARIOS[0]);
  
  // Interactive Modals & Drawers
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [isExhibitionMode, setIsExhibitionMode] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  // Active simulation parameters for cross-domain awareness
  const [simParams, setSimParams] = useState<SimulationParameters>(BASELINE_PARAMETERS);
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const { setAppContext } = useVoice();
  const { updateConfig } = useTwinConfig();

  // Cross-Navigation Handlers
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHotspot = (spot: EnvironmentalHotspot) => {
    setSelectedHotspot(spot);
  };

  const handleSaveScenario = (newScenario: SavedScenario) => {
    setScenarios((prev) => [newScenario, ...prev]);
    setActiveScenario(newScenario);
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLoadScenarioIntoSimulator = (scenario: SavedScenario) => {
    setSimParams(scenario.params);
    setActiveScenario(scenario);
    setCurrentView('simulator');
  };

  const handleApplySimPreset = (preset: Partial<SimulationParameters>) => {
    setSimParams((prev) => ({ ...prev, ...preset }));
    setCurrentView('simulator');
  };

  // Synchronize Voice Intelligence Subsystem with authoritative live state
  useEffect(() => {
    setAppContext({
      currentView,
      onNavigate: handleNavigate,
      hotspots,
      selectedHotspot,
      onSelectHotspot: handleSelectHotspot,
      activeLayer,
      onChangeLayer: setActiveLayer,
      simParams,
      onUpdateSimParams: (params) => setSimParams(params),
      scenarios,
      onSaveScenario: handleSaveScenario,
      isExhibitionMode,
      onToggleExhibition: setIsExhibitionMode,
      isDemoActive,
      onToggleDemo: setIsDemoActive,
      isAiOpen,
      onToggleAi: setIsAiOpen,
      selectedYear,
      onSelectYear: setSelectedYear,
      updateTwinConfig: updateConfig,
    });
  }, [
    currentView,
    hotspots,
    selectedHotspot,
    activeLayer,
    simParams,
    scenarios,
    isExhibitionMode,
    isDemoActive,
    isAiOpen,
    selectedYear,
    updateConfig,
  ]);


  return (
    <div className="min-h-screen bg-[#071A2B] text-slate-100 flex flex-col font-sans selection:bg-earth-aqua/30 selection:text-white relative">
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCommand={() => setIsCommandOpen(true)}
        onToggleAi={() => setIsAiOpen(!isAiOpen)}
        isAiOpen={isAiOpen}
        onStartGuidedDemo={() => setIsDemoActive(true)}
        isDemoActive={isDemoActive}
        onToggleExhibitionMode={() => setIsExhibitionMode(!isExhibitionMode)}
        isExhibitionMode={isExhibitionMode}
      />

      {/* 2. Main Content Routing Shell */}
      <main className="flex-1 w-full flex flex-col">
        {currentView === 'landing' && (
          <LandingPage
            onEnterPlatform={(view) => handleNavigate(view || 'overview')}
            onStartGuidedDemo={() => {
              setIsDemoActive(true);
              handleNavigate('explorer');
            }}
            hotspots={hotspots}
          />
        )}

        {currentView === 'overview' && (
          <OverviewDashboardView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            activeScenario={activeScenario}
            onNavigate={handleNavigate}
            onStartGuidedDemo={() => {
              setIsDemoActive(true);
              handleNavigate('explorer');
            }}
          />
        )}

        {currentView === 'explorer' && (
          <EarthExplorerView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            activeLayer={activeLayer}
            onChangeLayer={setActiveLayer}
            onNavigateToSimulator={() => handleNavigate('simulator')}
            onNavigateToMemory={() => handleNavigate('memory')}
            onNavigateToForensics={() => handleNavigate('forensics')}
          />
        )}

        {currentView === 'memory' && (
          <EarthMemoryView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            selectedYear={selectedYear}
            onSelectYear={setSelectedYear}
          />
        )}

        {currentView === 'layers' && (
          <LayersHubView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            activeLayer={activeLayer}
            onChangeLayer={setActiveLayer}
            onNavigateToExplorer={() => handleNavigate('explorer')}
          />
        )}

        {currentView === 'forensics' && (
          <ForensicsInvestigationView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'simulator' && (
          <WhatIfSimulatorView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onSaveScenario={handleSaveScenario}
            onNavigateToComparison={() => handleNavigate('scenarios')}
            params={simParams}
            onParamsChange={setSimParams}
          />
        )}

        {currentView === 'scenarios' && (
          <ScenarioComparisonView
            scenarios={scenarios}
            onDeleteScenario={handleDeleteScenario}
            onLoadScenarioIntoSimulator={handleLoadScenarioIntoSimulator}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'forecast' && (
          <FutureProjectionsView
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'water' && (
          <WaterIntelligenceView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onNavigateToSimulator={() => handleNavigate('simulator')}
            onNavigateToExplorer={() => handleNavigate('explorer')}
          />
        )}

        {currentView === 'climate' && (
          <ClimateCarbonView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'biodiversity' && (
          <BiodiversityView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'cities' && (
          <CityIntelligenceView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'research' && (
          <ScientificLabView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'decisions' && (
          <DecisionCenterView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'reports' && (
          <ReportGeneratorView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            scenarios={scenarios}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView />
        )}

        {currentView === 'autopilot' && (
          <EarthMindAutopilotView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onApplyOptimizedParams={(params) => setSimParams(params)}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'council' && (
          <EnvironmentalCouncilView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'future_fork' && (
          <FutureForkView
            onNavigateToSimulator={() => handleNavigate('simulator')}
            onApplyPreset={handleApplySimPreset}
          />
        )}

        {currentView === 'compound_disaster' && (
          <CompoundDisasterView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'city_twin' && (
          <CityDigitalTwinView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'causal_graph' && (
          <CausalGraphView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'satellite_scanner' && (
          <SatelliteScannerView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'reproducibility' && (
          <ReproducibilityView
            onApplyParamsAndNavigate={(params) => {
              setSimParams(params);
              handleNavigate('simulator');
            }}
          />
        )}

        {currentView === 'sentinel' && (
          <SentinelMonitorView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onNavigateToSimulator={() => handleNavigate('simulator')}
            onNavigateToAutopilot={() => handleNavigate('autopilot')}
          />
        )}

        {currentView === 'battle_mode' && (
          <BattleModeView
            hotspots={hotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={handleSelectHotspot}
            onApplyParams={(params) => setSimParams(params)}
            onNavigateToSimulator={() => handleNavigate('simulator')}
          />
        )}

        {currentView === 'missions' && (
          <MissionModeView
            onNavigate={handleNavigate}
            onSelectHotspotById={(id) => {
              const spot = hotspots.find((h) => h.id === id);
              if (spot) setSelectedHotspot(spot);
            }}
          />
        )}
      </main>

      {/* 3. Global Status Bar (Footer) */}
      <StatusBar
        activeHotspotName={selectedHotspot.name}
        activeScenarioName={activeScenario.name}
        simEngineStatus="RECONVERGED"
        onOpenMethodology={() => setIsMethodologyOpen(true)}
      />

      {/* 4. Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={handleNavigate}
        hotspots={hotspots}
        onSelectHotspot={handleSelectHotspot}
        onChangeLayer={setActiveLayer}
        onToggleExhibition={() => setIsExhibitionMode(!isExhibitionMode)}
        onToggleAi={() => setIsAiOpen(!isAiOpen)}
        onApplyPromptScenario={(action) => {
          if (action === 'SIM_TREE_25') {
            setSimParams({ ...BASELINE_PARAMETERS, treeCoverDelta: 25 });
          } else if (action === 'SIM_RAIN_40') {
            setSimParams({ ...BASELINE_PARAMETERS, rainfallDelta: 40 });
          }
        }}
      />

      {/* 5. Context-Aware AI Assistant Drawer */}
      <AssistantDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        selectedHotspot={selectedHotspot}
        activeLayer={activeLayer}
        currentSimParams={simParams}
        onApplySimPreset={handleApplySimPreset}
        onNavigate={handleNavigate}
      />

      {/* 6. Guided Demo Mode Automated Orchestration */}
      <GuidedDemoController
        isActive={isDemoActive}
        onExitDemo={() => setIsDemoActive(false)}
        onNavigate={handleNavigate}
        onSelectHotspotById={(id) => {
          const spot = hotspots.find((h) => h.id === id);
          if (spot) setSelectedHotspot(spot);
        }}
        onApplySimulationParameters={handleApplySimPreset}
        hotspots={hotspots}
      />

      {/* 7. Science Exhibition Presentation Overlay */}
      {isExhibitionMode && (
        <div className="fixed inset-0 z-50 bg-[#071A2B]/95 backdrop-blur-2xl overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
          <ScienceExhibitionView
            onClose={() => setIsExhibitionMode(false)}
            onNavigateToSimulator={() => {
              setIsExhibitionMode(false);
              handleNavigate('simulator');
            }}
          />
        </div>
      )}

      {/* 8. Methodology & Data Sources Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      {/* 9. EARTHMIND Voice Intelligence Subsystem */}
      <VoiceOrb />
      <VoiceTranscript />
      <VoicePanel />
      <VoiceSettingsPanel />
      <VoiceConfirmationModal />
      <VoicePermissionModal />
      <VoiceTestConsole />
    </div>
  );
}

export function App() {
  return (
    <TwinConfigProvider>
      <VoiceProvider>
        <AppContent />
      </VoiceProvider>
    </TwinConfigProvider>
  );
}

export default App;

