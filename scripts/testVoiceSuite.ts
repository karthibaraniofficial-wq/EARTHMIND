import { parseVoiceCommand } from '../src/voice/VoiceCommandParser';
import { routeVoiceIntent } from '../src/voice/VoiceIntentRouter';
import { DEFAULT_VOICE_SETTINGS } from '../src/voice/VoiceSettings';
import { GEMINI_TOOL_DECLARATIONS, executeGeminiTool } from '../src/lib/gemini/GeminiTools';
import { buildEarthMindContext, serializeEarthMindContext } from '../src/lib/gemini/GeminiContext';
import { BASELINE_PARAMETERS } from '../src/domains/simulation/SimulationEngine';
import { EnvironmentalHotspot, LayerType, SavedScenario, SimulationParameters } from '../src/types';

interface TestCase {
  id: string;
  input: string;
  expectedIntent: string;
  expectedParamKey?: string;
  expectedParamVal?: any;
}

const testCases: TestCase[] = [
  { id: 'TEST 01', input: 'Open What If', expectedIntent: 'NAVIGATE', expectedParamKey: 'target', expectedParamVal: 'simulator' },
  { id: 'TEST 02', input: 'Increase tree cover by 20 percent', expectedIntent: 'SET_SIMULATION_VARIABLE', expectedParamKey: 'variable', expectedParamVal: 'treeCover' },
  { id: 'TEST 03', input: 'Run the simulation', expectedIntent: 'RUN_SIMULATION' },
  { id: 'TEST 04', input: 'Compare with baseline', expectedIntent: 'COMPARE_SCENARIOS' },
  { id: 'TEST 05', input: 'Show flood risk', expectedIntent: 'SELECT_LAYER', expectedParamKey: 'layer', expectedParamVal: 'flood' },
  { id: 'TEST 06', input: 'Go to Amazon', expectedIntent: 'SELECT_LOCATION', expectedParamKey: 'location', expectedParamVal: 'amazon' },
  { id: 'TEST 07', input: 'Go to 2018', expectedIntent: 'SELECT_YEAR', expectedParamKey: 'year', expectedParamVal: 2018 },
  { id: 'TEST 08', input: 'Start Science Expo', expectedIntent: 'START_DEMO' },
  { id: 'TEST 09', input: 'Stop speaking', expectedIntent: 'STOP_SPEAKING' },
  { id: 'TEST 10', input: 'Generate report', expectedIntent: 'GENERATE_REPORT' },
  { id: 'TEST 11 (Tamil)', input: 'Tree cover-ஐ 20 சதவீதம் அதிகப்படுத்து', expectedIntent: 'SET_SIMULATION_VARIABLE', expectedParamKey: 'variable', expectedParamVal: 'treeCover' },
  { id: 'TEST 12 (Thanglish)', input: 'Flood risk show pannu', expectedIntent: 'SELECT_LAYER', expectedParamKey: 'layer', expectedParamVal: 'flood' },
  { id: 'TEST 13 (Multi-command)', input: 'Increase tree cover by 20 percent and reduce traffic by 10 percent', expectedIntent: 'COMPOUND' },
  { id: 'TEST 14 (Destructive / Confirmation)', input: 'Reset everything', expectedIntent: 'RESET_SIMULATION' }
];

console.log('====================================================');
console.log('EARTHMIND VOICE INTELLIGENCE & GEMINI LIVE TEST SUITE');
console.log('====================================================\n');

let passed = 0;
let failed = 0;

// PART 1: VOICE INTENT & ROUTING TESTS
console.log('--- PART 1: Voice Intent Parsing & Offline Fallback Routing ---');
for (const tc of testCases) {
  const intent = parseVoiceCommand(tc.input);
  const route = routeVoiceIntent(intent, DEFAULT_VOICE_SETTINGS);

  let ok = intent.intent === tc.expectedIntent;
  if (ok && tc.expectedParamKey) {
    const val = (intent.params as any)?.[tc.expectedParamKey];
    if (val !== tc.expectedParamVal) {
      ok = false;
    }
  }

  if (tc.id.includes('TEST 14')) {
    if (!route.requiresConfirmation) {
      ok = false;
      console.log(`[FAIL] ${tc.id}: Expected requiresConfirmation=true`);
    }
  }

  if (ok) {
    console.log(`[PASS] ${tc.id}: "${tc.input}" -> ${intent.intent} (Confidence: ${intent.confidence})`);
    console.log(`       Spoken Response: "${route.spokenResponse}"`);
    passed++;
  } else {
    console.log(`[FAIL] ${tc.id}: "${tc.input}"`);
    console.log(`       Got: ${intent.intent}`, intent.params);
    console.log(`       Expected: ${tc.expectedIntent}`, tc.expectedParamKey ? { [tc.expectedParamKey]: tc.expectedParamVal } : '');
    failed++;
  }
}

// PART 2: GEMINI TOOL DECLARATIONS & SCHEMA INTEGRITY
console.log('\n--- PART 2: Google Gemini Live Tool Declarations ---');
if (GEMINI_TOOL_DECLARATIONS.length === 24) {
  console.log(`[PASS] TEST 15: All 24 Gemini Tool Declarations loaded (Read: 9, Action: 15)`);
  passed++;
} else {
  console.log(`[FAIL] TEST 15: Expected 24 tool declarations, got ${GEMINI_TOOL_DECLARATIONS.length}`);
  failed++;
}

// PART 3: GEMINI CONTEXT GROUNDING ENGINE
console.log('\n--- PART 3: EarthMind Context Grounding Engine ---');
const mockHotspot: EnvironmentalHotspot = {
  id: 'amazon',
  name: 'Amazon Rainforest',
  region: 'South America',
  country: 'Brazil',
  coordinates: { lat: -3.4653, lng: -62.2159 },
  summary: 'Primary moisture pump',
  primaryRisk: 'Deforestation & Tipping Point',
  currentMetrics: {
    environmentalHealth: 71,
    heatRisk: 65,
    floodRisk: 58,
    pollutionAqi: 42,
    waterStress: 54,
    greenCoverPct: 78,
    urbanExpansionPct: 12,
    surfaceTempAnomaly: 1.4,
  },
  history: [],
  forensics: {
    period: '2018-2026',
    detectedChanges: {
      vegetationChange: -14.2,
      builtUpExpansion: 8.4,
      surfaceTempDelta: 1.8,
      waterSurfaceDelta: -6.5,
    },
    factors: [],
    aiInvestigationSummary: 'Canopy fragmentation detected',
  },
  recommendations: [],
};

let currentSimParams: SimulationParameters = { ...BASELINE_PARAMETERS };
let currentView = 'explorer';
let currentLayer: LayerType = 'health';

const mockAppContext = {
  get currentView() { return currentView; },
  onNavigate: (v: string) => { currentView = v; },
  hotspots: [mockHotspot],
  selectedHotspot: mockHotspot,
  onSelectHotspot: () => {},
  get activeLayer() { return currentLayer; },
  onChangeLayer: (l: LayerType) => { currentLayer = l; },
  get simParams() { return currentSimParams; },
  onUpdateSimParams: (p: SimulationParameters) => { currentSimParams = p; },
  scenarios: [] as SavedScenario[],
  onSaveScenario: () => {},
  isExhibitionMode: false,
  onToggleExhibition: () => {},
  isDemoActive: false,
  onToggleDemo: () => {},
  isAiOpen: false,
  onToggleAi: () => {},
  selectedYear: 2026,
  onSelectYear: () => {},
};

const builtContext = buildEarthMindContext(mockAppContext);
const serializedContext = serializeEarthMindContext(builtContext);

if (builtContext.selectedLocation.name === 'Amazon Rainforest' && builtContext.simulation.result.environmentalHealth > 0) {
  console.log(`[PASS] TEST 16: Structured EarthMind Context Engine generated valid biophysical delta snapshot`);
  console.log(`       Serialized payload length: ${serializedContext.length} chars (compact token footprint)`);
  passed++;
} else {
  console.log(`[FAIL] TEST 16: Context generation failed:`, builtContext);
  failed++;
}

// PART 4: GEMINI TOOL EXECUTION RUNTIME
console.log('\n--- PART 4: Gemini Live Tool Execution & State Mutator ---');
async function runToolTests() {
  // Test Tool 1: setSimulationVariable
  const res1 = await executeGeminiTool('setSimulationVariable', { variable: 'treeCoverDelta', value: 25 }, mockAppContext);
  if (res1.success && currentSimParams.treeCoverDelta === 25 && currentView === 'simulation') {
    console.log(`[PASS] TEST 17: Gemini Tool [setSimulationVariable] updated treeCoverDelta to +25% & switched view to simulation`);
    passed++;
  } else {
    console.log(`[FAIL] TEST 17: setSimulationVariable failed:`, res1);
    failed++;
  }

  // Test Tool 2: runSimulation
  const res2 = await executeGeminiTool('runSimulation', {}, mockAppContext);
  if (res2.success && res2.result?.environmentalHealth > 0) {
    console.log(`[PASS] TEST 18: Gemini Tool [runSimulation] computed Environmental Health Score: ${res2.result.environmentalHealth}`);
    passed++;
  } else {
    console.log(`[FAIL] TEST 18: runSimulation failed:`, res2);
    failed++;
  }

  // Test Tool 3: navigate
  const res3 = await executeGeminiTool('navigate', { targetView: 'autopilot' }, mockAppContext);
  if (res3.success && currentView === 'autopilot') {
    console.log(`[PASS] TEST 19: Gemini Tool [navigate] successfully routed to 'autopilot'`);
    passed++;
  } else {
    console.log(`[FAIL] TEST 19: navigate failed:`, res3);
    failed++;
  }

  // Test Tool 4: getCurrentEarthMindContext
  const res4 = await executeGeminiTool('getCurrentEarthMindContext', {}, mockAppContext);
  if (res4.success && res4.result?.currentModule === 'autopilot') {
    console.log(`[PASS] TEST 20: Gemini Tool [getCurrentEarthMindContext] returned live operational state`);
    passed++;
  } else {
    console.log(`[FAIL] TEST 20: getCurrentEarthMindContext failed:`, res4);
    failed++;
  }

  console.log('\n----------------------------------------------------');
  console.log(`SUMMARY: ${passed} PASSED / ${failed} FAILED (Total: ${passed + failed})`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('ALL TESTS PASSED! Voice Intelligence & Gemini Live Engine 100% Operational.');
    process.exit(0);
  }
}

runToolTests();
