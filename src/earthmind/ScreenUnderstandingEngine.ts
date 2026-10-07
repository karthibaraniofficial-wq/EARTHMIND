/**
 * EARTHMIND - Screen Understanding Engine (OS 4.0)
 * Answers operator questions about active on-screen telemetry with full factual grounding:
 * "What am I looking at?", "Explain this chart", "Why is this area red?",
 * "What is the highest value?", "What changed?", "Why did this number increase?"
 */

import { EarthMindScreenContext, explainScreen } from './EarthMindContext';
import { ChartTools } from './ChartTools';
import { MapTools } from './MapTools';

export interface ScreenExplanationResponse {
  spoken: string;
  summary: string;
  evidencePoints: string[];
  groundedMetrics: Record<string, any>;
  confidence: number;
}

export class ScreenUnderstandingEngine {
  /**
   * Explains what the operator is viewing across spatial and domain layers.
   */
  public static explainCurrentScreen(screen: EarthMindScreenContext): ScreenExplanationResponse {
    const base = explainScreen(screen);
    return {
      spoken: base.spoken,
      summary: base.summary,
      evidencePoints: [
        `Focused Region: ${screen.selectedLocation.name} (${screen.selectedLocation.country})`,
        `Observation Epoch: Year ${screen.selectedYear}`,
        `Satellite Raster: ${screen.activeLayers.primary}`,
        `Regional Health Index: ${screen.selectedLocation.environmentalHealth}/100`,
      ],
      groundedMetrics: screen.visibleMetrics,
      confidence: 0.98,
    };
  }

  /**
   * Explains active time-series chart trends and multi-decadal shifts.
   */
  public static explainVisibleChart(screen: EarthMindScreenContext): ScreenExplanationResponse {
    const loc = screen.selectedLocation;
    const chart = screen.visibleCharts;
    const spoken = `This chart shows multi-decadal historical trajectories for ${loc.name}. The active metric is ${chart.currentMetric}, showing an overall ${chart.trendDirection} trend, peaking at ${chart.highestRecordedValue} in year ${chart.highestRecordedYear}.`;
    const summary = `${chart.title} | Metric: ${chart.currentMetric} | Trend: ${chart.trendDirection} | Peak: ${chart.highestRecordedValue} (${chart.highestRecordedYear})`;

    return {
      spoken,
      summary,
      evidencePoints: [
        `Historical baseline starts in year 2010`,
        `Peak anomaly detected in year ${chart.highestRecordedYear}`,
        `Trend trajectory: ${chart.trendDirection.toUpperCase()}`,
      ],
      groundedMetrics: {
        peakValue: chart.highestRecordedValue,
        peakYear: chart.highestRecordedYear,
        trend: chart.trendDirection,
      },
      confidence: 0.96,
    };
  }

  /**
   * Explains color thresholds and risk levels for active raster layers.
   */
  public static explainAreaColor(layer: string, value?: number): ScreenExplanationResponse {
    let threshold = 'Red = Severe Risk Index (>75/100)';
    let explanation = `On the ${layer.replace('_', ' ')} layer, red indicates high stress or critical risk (scores above 75/100).`;
    if (layer === 'temperature') {
      threshold = 'Red = Positive Thermal Anomaly (>+2.5°C)';
      explanation = 'Red indicates positive surface thermal anomalies (> +2.5°C above decadal baseline), characteristic of urban heat islands and radiative trapping.';
    } else if (layer === 'flood') {
      threshold = 'Red = Acute Inundation Hazard (>75/100)';
      explanation = 'Red highlights low-lying alluvial floodplains and impervious urban zones where modeled runoff exceeds stormwater capacity, creating acute flash inundation risk.';
    } else if (layer === 'green_cover') {
      threshold = 'Red = Critical Canopy Loss (<20% Cover)';
      explanation = 'Red indicates critical canopy loss and degraded vegetation cover (< 20% density), where deforested soil accelerates erosion and runoff.';
    }
    return {
      spoken: explanation,
      summary: `${layer} color threshold: ${threshold}`,
      evidencePoints: [
        `Layer: ${layer}`,
        `Threshold: ${threshold}`,
        `Biophysical Meaning: ${explanation}`,
      ],
      groundedMetrics: { layer, threshold, value },
      confidence: 0.95,
    };
  }

  /**
   * Identifies the highest value or anomaly in active timeseries data.
   */
  public static getHighestValue(screen: EarthMindScreenContext): ScreenExplanationResponse {
    const chart = screen.visibleCharts;
    const spoken = `The highest recorded value for ${chart.currentMetric} in ${screen.selectedLocation.name} is ${chart.highestRecordedValue}, recorded in year ${chart.highestRecordedYear}.`;
    const summary = `Peak Record: ${chart.highestRecordedValue} in ${chart.highestRecordedYear} (${chart.currentMetric})`;

    return {
      spoken,
      summary,
      evidencePoints: [
        `Metric: ${chart.currentMetric}`,
        `Peak Value: ${chart.highestRecordedValue}`,
        `Epoch: ${chart.highestRecordedYear}`,
      ],
      groundedMetrics: { highestValue: chart.highestRecordedValue, year: chart.highestRecordedYear },
      confidence: 0.99,
    };
  }

  /**
   * Explains why a simulation metric shifted from baseline.
   */
  public static explainResultChange(screen: EarthMindScreenContext, metricKey: string = 'floodRisk'): ScreenExplanationResponse {
    const sim = screen.simulationState;
    const deltas = screen.simulationResults.deltaFromBaseline;
    const metricDelta = deltas[metricKey] || 0;

    let driverText = '';
    if (metricKey === 'floodRisk') {
      driverText = `driven primarily by a ${sim.rainfallDelta >= 0 ? '+' : ''}${sim.rainfallDelta}% rainfall variation and ${sim.treeCoverDelta >= 0 ? '+' : ''}${sim.treeCoverDelta}% canopy interception change`;
    } else if (metricKey === 'heatRisk') {
      driverText = `driven by an albedo shift of ${sim.urbanizationDelta >= 0 ? '+' : ''}${sim.urbanizationDelta}% urbanization and ${sim.treeCoverDelta >= 0 ? '+' : ''}${sim.treeCoverDelta}% evaporative cooling variation`;
    } else {
      driverText = `driven by coupled biophysical parameter shifts`;
    }

    const spoken = `The ${metricKey} changed by ${metricDelta >= 0 ? '+' : ''}${metricDelta} points from baseline, ${driverText}.`;
    const summary = `Delta ${metricKey}: ${metricDelta >= 0 ? '+' : ''}${metricDelta} pts | Biophysical forcing: ${driverText}`;

    return {
      spoken,
      summary,
      evidencePoints: [
        `Net metric delta: ${metricDelta} pts`,
        `Tree cover delta: ${sim.treeCoverDelta}%`,
        `Rainfall delta: ${sim.rainfallDelta}%`,
        `Urbanization delta: ${sim.urbanizationDelta}%`,
      ],
      groundedMetrics: deltas,
      confidence: 0.97,
    };
  }
}
