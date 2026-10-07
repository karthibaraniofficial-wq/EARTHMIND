/**
 * EARTHMIND - Tool Permission & Authority Manager
 * Separates tools into READ_ONLY, SAFE_ACTION, and HIGH_IMPACT_ACTION.
 * Enforces mandatory confirmation for destructive or high-impact actions.
 */

export type ToolPermissionTier = 'READ_ONLY' | 'SAFE_ACTION' | 'HIGH_IMPACT_ACTION';

export interface ToolSecurityProfile {
  name: string;
  tier: ToolPermissionTier;
  description: string;
  confirmationPrompt?: string;
}

export class ToolPermissionManager {
  private static toolRegistry: Map<string, ToolSecurityProfile> = new Map([
    // READ ONLY TOOLS
    ['getCurrentEarthMindContext', { name: 'getCurrentEarthMindContext', tier: 'READ_ONLY', description: 'Read active application state' }],
    ['getCurrentLocation', { name: 'getCurrentLocation', tier: 'READ_ONLY', description: 'Read selected hotspot' }],
    ['getActiveLayers', { name: 'getActiveLayers', tier: 'READ_ONLY', description: 'Read active sensor layer' }],
    ['getSimulationState', { name: 'getSimulationState', tier: 'READ_ONLY', description: 'Read simulation variables' }],
    ['getSimulationResults', { name: 'getSimulationResults', tier: 'READ_ONLY', description: 'Read biophysical metrics' }],
    ['getChartData', { name: 'getChartData', tier: 'READ_ONLY', description: 'Read active chart time-series' }],
    ['getMapData', { name: 'getMapData', tier: 'READ_ONLY', description: 'Read geospatial layer metadata' }],
    ['getScenario', { name: 'getScenario', tier: 'READ_ONLY', description: 'Read active scenario parameters' }],
    ['getReport', { name: 'getReport', tier: 'READ_ONLY', description: 'Read generated report data' }],

    // SAFE ACTION TOOLS
    ['navigate', { name: 'navigate', tier: 'SAFE_ACTION', description: 'Switch application views' }],
    ['selectLocation', { name: 'selectLocation', tier: 'SAFE_ACTION', description: 'Pan globe to hotspot' }],
    ['selectYear', { name: 'selectYear', tier: 'SAFE_ACTION', description: 'Shift timeline year' }],
    ['toggleLayer', { name: 'toggleLayer', tier: 'SAFE_ACTION', description: 'Toggle satellite layer' }],
    ['setSimulationVariable', { name: 'setSimulationVariable', tier: 'SAFE_ACTION', description: 'Adjust simulation parameter' }],
    ['runSimulation', { name: 'runSimulation', tier: 'SAFE_ACTION', description: 'Execute simulation calculation' }],
    ['compareScenarios', { name: 'compareScenarios', tier: 'SAFE_ACTION', description: 'Open scenario comparison lab' }],
    ['loadScenario', { name: 'loadScenario', tier: 'SAFE_ACTION', description: 'Load saved scenario' }],
    ['saveScenario', { name: 'saveScenario', tier: 'SAFE_ACTION', description: 'Save current scenario' }],
    ['generateReport', { name: 'generateReport', tier: 'SAFE_ACTION', description: 'Synthesize research report' }],
    ['startExhibition', { name: 'startExhibition', tier: 'SAFE_ACTION', description: 'Launch guided presentation' }],
    ['nextExhibitionStep', { name: 'nextExhibitionStep', tier: 'SAFE_ACTION', description: 'Next presentation step' }],
    ['previousExhibitionStep', { name: 'previousExhibitionStep', tier: 'SAFE_ACTION', description: 'Previous presentation step' }],
    ['stopSpeech', { name: 'stopSpeech', tier: 'SAFE_ACTION', description: 'Halt ongoing speech' }],

    // RESEARCH & SCIENTIFIC REASONING TOOLS
    ['searchWeb', { name: 'searchWeb', tier: 'SAFE_ACTION', description: 'Live web research and Google search grounding' }],
    ['researchUrl', { name: 'researchUrl', tier: 'SAFE_ACTION', description: 'Inspect and summarize specific document or URL' }],
    ['factCheckClaim', { name: 'factCheckClaim', tier: 'SAFE_ACTION', description: 'Verify claim against scientific databases' }],
    ['calculate', { name: 'calculate', tier: 'SAFE_ACTION', description: 'Execute deterministic numerical calculation' }],

    // HIGH IMPACT / DESTRUCTIVE TOOLS
    ['resetSimulation', {
      name: 'resetSimulation',
      tier: 'HIGH_IMPACT_ACTION',
      description: 'Reset all simulation variables and scenarios to baseline',
      confirmationPrompt: 'This will reset all current What-If parameters back to default scientific baseline. Do you wish to continue?',
    }],
    ['deleteScenario', {
      name: 'deleteScenario',
      tier: 'HIGH_IMPACT_ACTION',
      description: 'Permanently delete a saved counterfactual scenario',
      confirmationPrompt: 'This will permanently delete the selected scenario. Should I continue?',
    }],
    ['resetAllData', {
      name: 'resetAllData',
      tier: 'HIGH_IMPACT_ACTION',
      description: 'Purge custom local scenario state and history',
      confirmationPrompt: 'Are you sure you want to purge all custom scenarios and interaction logs?',
    }],
  ]);

  public static getToolTier(toolName: string): ToolPermissionTier {
    return this.toolRegistry.get(toolName)?.tier || 'SAFE_ACTION';
  }

  public static requiresConfirmation(toolName: string): boolean {
    return this.getToolTier(toolName) === 'HIGH_IMPACT_ACTION';
  }

  public static getConfirmationPrompt(toolName: string): string {
    return (
      this.toolRegistry.get(toolName)?.confirmationPrompt ||
      `Executing "${toolName}" may alter critical application state. Do you wish to proceed?`
    );
  }

  public static isAuthorized(toolName: string): boolean {
    // Prototype allows all registered tools with tier check
    return this.toolRegistry.has(toolName);
  }
}
