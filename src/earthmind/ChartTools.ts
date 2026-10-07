/**
 * EARTHMIND - Chart & Time-Series Intelligence Tools
 * Extracts and explains graph data series, trend trajectories, and multi-decadal historical deltas.
 */

import { AppActionContext } from '../voice/VoiceActionExecutor';
import { HistoricalDataPoint } from '../types';

export class ChartTools {
  public static getActiveChartSummary(ctx: AppActionContext): {
    title: string;
    metric: string;
    currentValue: number;
    highestRecorded: { year: number; value: number };
    lowestRecorded: { year: number; value: number };
    netChange: { delta: number; pctChange: number; direction: string };
    history: HistoricalDataPoint[];
    explanation: string;
  } {
    const spot = ctx.selectedHotspot;
    const history = spot?.history || [];
    const metric = ctx.activeLayer || 'health';

    let maxVal = -Infinity;
    let maxYear = 2026;
    let minVal = Infinity;
    let minYear = 2010;

    history.forEach((dp) => {
      const val = this.extractMetricValue(dp, metric);
      if (val > maxVal) {
        maxVal = val;
        maxYear = dp.year;
      }
      if (val < minVal) {
        minVal = val;
        minYear = dp.year;
      }
    });

    const firstPoint = history[0];
    const lastPoint = history[history.length - 1];
    const firstVal = firstPoint ? this.extractMetricValue(firstPoint, metric) : 0;
    const lastVal = lastPoint ? this.extractMetricValue(lastPoint, metric) : 0;
    const delta = Math.round((lastVal - firstVal) * 10) / 10;
    const pct = firstVal !== 0 ? Math.round(((delta / firstVal) * 100) * 10) / 10 : 0;

    return {
      title: `${spot ? spot.name : 'Regional'} Historical ${metric.toUpperCase()} Trajectory`,
      metric,
      currentValue: lastVal,
      highestRecorded: { year: maxYear, value: maxVal },
      lowestRecorded: { year: minYear, value: minVal },
      netChange: {
        delta,
        pctChange: pct,
        direction: delta >= 0 ? 'increasing' : 'decreasing',
      },
      history,
      explanation: `Over the historical observation window (${firstPoint?.year || 2010} to ${lastPoint?.year || 2026}), ${metric} has shifted by ${delta > 0 ? '+' : ''}${delta} (${pct}%). Peak value of ${maxVal} was recorded in ${maxYear}.`,
    };
  }

  public static compareHistoricalYears(
    yearA: number,
    yearB: number,
    ctx: AppActionContext
  ): {
    spotName: string;
    yearA: number;
    yearB: number;
    deltaFloodRisk: number;
    deltaGreenCover: number;
    deltaSurfaceTemp: number;
    explanation: string;
  } {
    const history = ctx.selectedHotspot?.history || [];
    const ptA = history.find((h) => h.year === yearA) || history[0];
    const ptB = history.find((h) => h.year === yearB) || history[history.length - 1];

    const dFlood = Math.round((ptB.floodRiskScore - ptA.floodRiskScore) * 10) / 10;
    const dGreen = Math.round((ptB.greenCoverPct - ptA.greenCoverPct) * 10) / 10;
    const dTemp = Math.round((ptB.surfaceTempAnomaly - ptA.surfaceTempAnomaly) * 10) / 10;

    return {
      spotName: ctx.selectedHotspot?.name || 'Selected Hotspot',
      yearA: ptA.year,
      yearB: ptB.year,
      deltaFloodRisk: dFlood,
      deltaGreenCover: dGreen,
      deltaSurfaceTemp: dTemp,
      explanation: `Comparing ${ptA.year} to ${ptB.year}: Flood risk changed by ${dFlood > 0 ? '+' : ''}${dFlood} points, green cover by ${dGreen > 0 ? '+' : ''}${dGreen}%, and surface temperature anomaly by ${dTemp > 0 ? '+' : ''}${dTemp}°C.`,
    };
  }

  private static extractMetricValue(dp: HistoricalDataPoint, layer: string): number {
    switch (layer) {
      case 'flood':
        return dp.floodRiskScore;
      case 'temperature':
        return dp.surfaceTempAnomaly;
      case 'green_cover':
      case 'vegetation':
        return dp.greenCoverPct;
      case 'air_quality':
        return dp.airQualityAqi;
      case 'water':
        return dp.waterIndex;
      default:
        return dp.greenCoverPct;
    }
  }
}
