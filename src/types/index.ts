export type LayerType = 
  | 'health' 
  | 'temperature' 
  | 'air_quality' 
  | 'green_cover' 
  | 'water' 
  | 'urbanization' 
  | 'waste' 
  | 'flood'
  | 'drought'
  | 'wildfire'
  | 'rainfall';

export interface HistoricalDataPoint {
  year: number;
  greenCoverPct: number;
  urbanCoverPct: number;
  surfaceTempAnomaly: number; // °C variance from baseline
  waterIndex: number; // 0 - 100
  airQualityAqi: number; // 0 - 500
  floodRiskScore: number; // 0 - 100
}

export interface ContributingFactor {
  factor: string;
  confidence: number; // 0.0 - 1.0 (e.g. 0.88 = 88%)
  impact: 'positive' | 'negative' | 'neutral';
  explanation: string;
  category: 'anthropogenic' | 'climatic' | 'hydrological' | 'ecological';
}

export interface EnvironmentalHotspot {
  id: string;
  name: string;
  region: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  summary: string;
  primaryRisk: string;
  currentMetrics: {
    environmentalHealth: number; // 0-100
    heatRisk: number; // 0-100
    floodRisk: number; // 0-100
    pollutionAqi: number; // AQI index
    waterStress: number; // 0-100
    greenCoverPct: number;
    urbanExpansionPct: number; // delta over 8 yrs
    surfaceTempAnomaly: number; // °C
  };
  history: HistoricalDataPoint[];
  forensics: {
    period: string;
    detectedChanges: {
      vegetationChange: number; // e.g. -31.4%
      builtUpExpansion: number; // e.g. +42.1%
      surfaceTempDelta: number; // e.g. +2.4°C
      waterSurfaceDelta: number; // e.g. -18.2%
    };
    factors: ContributingFactor[];
    aiInvestigationSummary: string;
  };
  recommendations: {
    priority: number;
    title: string;
    action: string;
    expectedImpact: string;
    evidence: string;
  }[];
}

export interface SimulationParameters {
  treeCoverDelta: number;      // -20% to +50%
  rainfallDelta: number;       // -30% to +60%
  urbanizationDelta: number;   // -20% to +50%
  wasteDelta: number;          // -30% to +70%
  waterDelta: number;          // -50% to +50%
  trafficDelta: number;        // -30% to +60%
  energyEfficiencyDelta: number; // -30% to +50%
}

export interface SimulationResultMetrics {
  heatRisk: number;
  floodRisk: number;
  pollution: number;
  waterStress: number;
  environmentalHealth: number;
}

export interface SimulationComparison {
  baseline: SimulationResultMetrics;
  simulated: SimulationResultMetrics;
  deltas: {
    heatRisk: number;
    floodRisk: number;
    pollution: number;
    waterStress: number;
    environmentalHealth: number;
  };
  verdict: 'SIGNIFICANT_IMPROVEMENT' | 'MODERATE_IMPROVEMENT' | 'NEUTRAL' | 'DEGRADATION' | 'CRITICAL_RISK';
  aiReasoning: string;
  confidenceScore: number;
}

export interface SavedScenario {
  id: string;
  name: string;
  description: string;
  tag: 'Baseline' | 'Intervention' | 'Stress Test' | 'Optimistic' | 'Custom';
  params: SimulationParameters;
  metrics: SimulationResultMetrics;
  createdAt: string;
  author: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'APPLY_PRESET' | 'NAVIGATE' | 'TRIGGER_SIMULATION';
    payload?: any;
  };
  contextBadge?: string;
}

export type DataProvenance = 
  | 'OBSERVED' 
  | 'MODELLED' 
  | 'SIMULATED' 
  | 'ESTIMATED' 
  | 'DEMO DATA' 
  | 'PROJECTED';

export interface DataLineageStep {
  stage: 'SOURCE' | 'PROCESSING' | 'MODEL' | 'OUTPUT' | 'VISUALIZATION';
  name: string;
  details: string;
  instrument?: string;
  uncertaintyRating?: string;
}

export interface FutureProjectionRecord {
  year: number;
  ssp126TempDelta: number; // Low emissions (+1.5°C goal)
  ssp245TempDelta: number; // Intermediate reference (+2.4°C)
  ssp585TempDelta: number; // Fossil-fueled development (+4.4°C)
  uncertaintyMargin: number; // ± °C
  seaLevelRiseMm: number; // Sea level anomaly
  droughtProbabilityPct: number;
  carbonPpm: number;
}

export interface ScientificExperiment {
  id: string;
  title: string;
  hypothesis: string;
  independentVariable: string;
  deltaVal: number;
  dependentVariable: string;
  baselineVal: number;
  resultVal: number;
  uncertaintySigma: number;
  conclusion: string;
  status: 'formulated' | 'simulated' | 'verified';
  timestamp: string;
}

export interface DecisionIntervention {
  id: string;
  title: string;
  category: 'nature_based' | 'infrastructure' | 'policy' | 'clean_tech';
  capitalCostM: number; // $M USD
  annualOpexM: number;
  ecologicalBenefitScore: number; // 0 - 100
  carbonMitigationTonsYr: number;
  implementationYears: number;
  tradeoffRisk: string;
  priorityRank: number;
  verdict: 'HIGHLY_RECOMMENDED' | 'FEASIBLE' | 'COST_PROHIBITIVE' | 'HIGH_TRADE_OFF';
}

// -------------------------------------------------------------
// EARTHMIND POWER INTELLIGENCE TYPES
// -------------------------------------------------------------

export type AutopilotStage = 
  | 'IDLE'
  | 'ANALYZE' 
  | 'IDENTIFY_RISKS' 
  | 'GENERATE_INTERVENTIONS' 
  | 'SIMULATE' 
  | 'COMPARE' 
  | 'OPTIMIZE' 
  | 'EXPLAIN' 
  | 'ACTION_PLAN' 
  | 'COMPLETED';

export interface AutopilotPlanItem {
  priority: number;
  title: string;
  variableKey: keyof SimulationParameters;
  suggestedDelta: number;
  modeledBenefit: string;
  tradeoff: string;
  confidence: number;
}

export interface CouncilAgent {
  id: string;
  name: string;
  role: string;
  domain: 'climate' | 'water' | 'ecology' | 'urban' | 'risk' | 'energy';
  avatarColor: string;
  statement: string;
  verdict: 'ENDORSE' | 'CONCERN' | 'COUNTER_PROPOSE' | 'NEUTRAL';
  confidence: number;
  keyMetric: string;
  suggestedAction: string;
}

export interface FutureForkBranch {
  id: string;
  key: 'green' | 'base' | 'stress';
  name: string;
  year: number;
  tagline: string;
  tempAnomaly: number;
  floodRisk: number;
  healthScore: number;
  co2Ppm: number;
  tippingPointAlert?: string;
  color: string;
  description: string;
  actionsTaken: string[];
}

export interface CompoundHazard {
  id: string;
  name: string;
  category: 'precipitation' | 'urbanization' | 'drainage' | 'heatwave' | 'coastal';
  severity: number; // 0 - 100
  enabled: boolean;
  amplificationCoeff: number;
  description: string;
}

export interface CausalNode {
  id: string;
  label: string;
  category: 'anthropogenic' | 'biophysical' | 'climatic' | 'impact';
  value: number; // current delta %
  baseline: number;
  unit: string;
  description: string;
}

export interface CausalEdge {
  from: string;
  to: string;
  weight: number; // -1.0 to 1.0 (positive or negative correlation)
  lagHours?: number;
  mechanism: string;
  isFeedback?: boolean;
}

export type SatelliteBandMode = 
  | 'true_color' 
  | 'false_color_ir' 
  | 'ndwi' 
  | 'ndbi' 
  | 'thermal';

export interface ReproducibilityRecord {
  experimentId: string;
  stateHash: string;
  timestamp: string;
  hotspotId: string;
  hotspotName: string;
  modelVersion: string;
  datasetVersion: string;
  inputParams: SimulationParameters;
  outputMetrics: SimulationResultMetrics;
  uncertaintySigma: number;
  reproducedCount: number;
  methodologyNotes: string;
}

export interface SentinelAnomaly {
  id: string;
  hotspotId: string;
  region: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'ELEVATED' | 'WATCH';
  sensor: string;
  deltaSummary: string;
  detectedTime: string;
  whyShouldICare: string;
  recommendedAction: string;
  status: 'PENDING_INVESTIGATION' | 'INVESTIGATING' | 'MITIGATION_PROPOSED' | 'RESOLVED';
}

export interface BattleStrategy {
  id: string;
  name: string;
  tag: string;
  philosophy: string;
  params: SimulationParameters;
  metrics: SimulationResultMetrics;
  capexTotalM: number;
  implementationPace: string;
  score: number;
}

export interface MissionStep {
  stepNumber: number;
  title: string;
  instruction: string;
  targetView: string;
  targetHotspotId?: string;
  completed: boolean;
}

export interface EarthMindMission {
  id: string;
  title: string;
  location: string;
  difficulty: 'Novice' | 'Scientist' | 'Commander';
  objective: string;
  story: string;
  badgeAward: string;
  steps: MissionStep[];
  status: 'available' | 'in_progress' | 'completed';
}

