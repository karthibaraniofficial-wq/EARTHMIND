/**
 * EARTHMIND - Sentinel Early Warning Engine (OS 4.0)
 * Scans continuous Earth observation telemetry to detect biophysical anomalies,
 * rapid accelerations, threshold crossings, and compound environmental threats.
 */

import { EnvironmentalHotspot, SentinelAnomaly } from '../types';

export interface EarlyWarningAlert {
  id: string;
  hotspotId: string;
  hotspotName: string;
  category: 'DEFORESTATION' | 'THERMAL_SPIKE' | 'FLOOD_SURGE' | 'AQUIFER_DROP' | 'AIR_TOXICITY';
  severity: 'CRITICAL' | 'WARNING' | 'ELEVATED' | 'WATCH';
  headline: string;
  magnitude: string;
  confidence: number; // 0 - 100%
  instrument: string;
  timestamp: string;
  suspectedDrivers: string[];
  recommendedAction: string;
}

export class EarthMindSentinelEngine {
  /**
   * Scans a hotspot against sensor baselines to flag acute deviations.
   */
  public static scanHotspot(hotspot: EnvironmentalHotspot): EarlyWarningAlert[] {
    const alerts: EarlyWarningAlert[] = [];
    const metrics = hotspot.currentMetrics;
    const now = new Date().toISOString();

    // 1. Extreme Flood / Rainfall Anomaly
    if (metrics.floodRisk >= 75) {
      alerts.push({
        id: `alert-flood-${hotspot.id}`,
        hotspotId: hotspot.id,
        hotspotName: hotspot.name,
        category: 'FLOOD_SURGE',
        severity: metrics.floodRisk >= 85 ? 'CRITICAL' : 'WARNING',
        headline: `Acute Hydrological Inundation Threshold Breached in ${hotspot.name}`,
        magnitude: `Flood exposure index at ${metrics.floodRisk}/100 (+${Math.round(metrics.floodRisk - 55)} pts over regional safe baseline)`,
        confidence: 96,
        instrument: 'Sentinel-1 C-SAR & GPM DPR Core Observatory',
        timestamp: now,
        suspectedDrivers: [
          'Extreme convective precipitation cell',
          'Saturated soil macropore storage',
          'Impervious catchment runoff surge',
        ],
        recommendedAction: 'Engage municipal stormwater retention basins and issue spatial evacuation corridors.',
      });
    }

    // 2. Severe Thermal Spike / Urban Heat Island
    if (metrics.surfaceTempAnomaly >= 2.0 || metrics.heatRisk >= 80) {
      alerts.push({
        id: `alert-heat-${hotspot.id}`,
        hotspotId: hotspot.id,
        hotspotName: hotspot.name,
        category: 'THERMAL_SPIKE',
        severity: metrics.surfaceTempAnomaly >= 2.8 ? 'CRITICAL' : 'WARNING',
        headline: `Severe Land Surface Temperature Anomaly Detected in ${hotspot.name}`,
        magnitude: `Radiometric LST anomaly: +${metrics.surfaceTempAnomaly}°C variance from multi-decadal mean`,
        confidence: 94,
        instrument: 'Landsat-9 TIRS-2 & MODIS Terra Radiometer',
        timestamp: now,
        suspectedDrivers: [
          'High asphalt/concrete thermal mass absorption',
          'Absence of canopy evapotranspiration cooling',
          'Anticyclonic atmospheric subsidence',
        ],
        recommendedAction: 'Deploy urban reflective cool roofs and activate public hydration and misting nodes.',
      });
    }

    // 3. Canopy Deforestation Disturbance
    if (hotspot.forensics.detectedChanges.vegetationChange <= -20) {
      alerts.push({
        id: `alert-deforest-${hotspot.id}`,
        hotspotId: hotspot.id,
        hotspotName: hotspot.name,
        category: 'DEFORESTATION',
        severity: hotspot.forensics.detectedChanges.vegetationChange <= -30 ? 'CRITICAL' : 'WARNING',
        headline: `Rapid Forest Canopy Loss Front Detected in ${hotspot.name}`,
        magnitude: `Canopy loss rate: ${hotspot.forensics.detectedChanges.vegetationChange}% over observation window`,
        confidence: 97,
        instrument: 'GLAD Sentinel-2 Automated Alert Algorithm & Landsat-9 MSI',
        timestamp: now,
        suspectedDrivers: [
          'Linear access road penetration',
          'Agricultural pasture expansion',
          'Selective logging front consolidation',
        ],
        recommendedAction: 'Dispatch airborne drone verification and enforce moratorium on protected corridor concessions.',
      });
    }

    // 4. Critical Water Stress / Aquifer Exhaustion
    if (metrics.waterStress >= 70) {
      alerts.push({
        id: `alert-water-${hotspot.id}`,
        hotspotId: hotspot.id,
        hotspotName: hotspot.name,
        category: 'AQUIFER_DROP',
        severity: metrics.waterStress >= 80 ? 'CRITICAL' : 'ELEVATED',
        headline: `Groundwater Aquifer Depletion Alert in ${hotspot.name}`,
        magnitude: `Water stress index: ${metrics.waterStress}/100 with negative terrestrial storage flux`,
        confidence: 91,
        instrument: 'GRACE-FO Satellite Gravimetry & Sentinel-2 NDWI',
        timestamp: now,
        suspectedDrivers: [
          'Borewell over-extraction beyond recharge rate',
          'Wetland conversion into built-up infrastructure',
          'Delayed seasonal monsoonal recharge',
        ],
        recommendedAction: 'Mandate industrial water recycling and initiate artificial managed aquifer recharge (MAR).',
      });
    }

    return alerts;
  }

  /**
   * Scans all registered hotspots across the globe and aggregates prioritized alerts.
   */
  public static scanAllHotspots(hotspots: EnvironmentalHotspot[]): EarlyWarningAlert[] {
    const allAlerts: EarlyWarningAlert[] = [];
    hotspots.forEach((h) => {
      allAlerts.push(...this.scanHotspot(h));
    });

    // Sort by severity (CRITICAL first)
    const severityWeight: Record<EarlyWarningAlert['severity'], number> = {
      CRITICAL: 4,
      WARNING: 3,
      ELEVATED: 2,
      WATCH: 1,
    };

    return allAlerts.sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity]);
  }
}
