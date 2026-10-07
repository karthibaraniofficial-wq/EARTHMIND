/**
 * EARTHMIND - Uncertainty & Scientific Rigor Engine
 * Quantifies biophysical confidence, sensitivity ranges, assumptions, and data provenance.
 * Strictly enforces honesty: never confuses simulation with measured observation.
 */

export type ScientificProvenance = 
  | 'OBSERVED'      // Direct ground sensors or calibrated satellites
  | 'MEASURED'      // Quantitative physical measurements
  | 'MODELED'       // General circulation or climate projection model
  | 'SIMULATED'     // EarthMind counterfactual What-If calculation
  | 'ESTIMATED'     // Statistical approximation
  | 'PROJECTED'     // Future trajectory under scenario assumptions
  | 'PREDICTED'     // Machine learning predictive forecast
  | 'DEMO_DATA';    // Curated benchmark scenario for Science Expo presentation

export interface UncertaintyProfile {
  provenance: ScientificProvenance;
  provenanceBadge: string;
  confidence: number;            // 0.0 - 1.0
  marginOfErrorPct: number;      // e.g. ±14%
  keyAssumptions: string[];
  sensitivityDrivers: string[];
  spokenDisclaimer: string;
}

export class UncertaintyEngine {
  /**
   * Evaluates uncertainty profile for a given analysis or simulation result.
   */
  public static evaluateProfile(
    provenance: ScientificProvenance,
    confidence: number = 0.85,
    customDrivers: string[] = []
  ): UncertaintyProfile {
    let margin = 10;
    let badge = 'OBSERVED MEASUREMENT';
    let spoken = '';

    switch (provenance) {
      case 'OBSERVED':
      case 'MEASURED':
        margin = 4;
        badge = 'MEASURED OBSERVATION (HIGH CONFIDENCE)';
        spoken = 'According to calibrated remote sensing datasets,';
        break;

      case 'SIMULATED':
        margin = 16;
        badge = 'EARTHMIND BIOPHYSICAL SIMULATION';
        spoken = 'In this EarthMind simulation, under current parameter assumptions,';
        break;

      case 'PROJECTED':
      case 'MODELED':
        margin = 20;
        badge = 'SCENARIO PROJECTION (IPCC SSP)';
        spoken = 'Under this modeled climate scenario,';
        break;

      case 'ESTIMATED':
      case 'PREDICTED':
        margin = 15;
        badge = 'NEURAL PREDICTIVE ESTIMATE';
        spoken = 'Based on predictive model trends,';
        break;

      case 'DEMO_DATA':
        margin = 25;
        badge = 'SCIENCE EXPO BENCHMARK (SIMULATED)';
        spoken = 'For this demonstration scenario,';
        break;
    }

    return {
      provenance,
      provenanceBadge: badge,
      confidence: Math.max(0.1, Math.min(0.99, confidence)),
      marginOfErrorPct: margin,
      keyAssumptions: [
        'Stationary biophysical coupling assumptions over localized catchments.',
        'Linear baseline downscaling without unmodeled abrupt non-linear tipping points.',
      ],
      sensitivityDrivers: customDrivers.length > 0 ? customDrivers : ['Rainfall surge intensity', 'Urban surface imperviousness'],
      spokenDisclaimer: spoken,
    };
  }
}
