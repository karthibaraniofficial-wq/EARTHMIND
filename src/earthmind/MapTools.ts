/**
 * EARTHMIND - Geospatial & 3D Map Tools
 * Hotspot positioning, camera transitions, and remote sensing layer overlays.
 */

import { AppActionContext } from '../voice/VoiceActionExecutor';
import { EnvironmentalHotspot, LayerType } from '../types';

export class MapTools {
  public static selectLocation(
    locationIdOrName: string,
    ctx: AppActionContext
  ): { success: boolean; hotspot?: EnvironmentalHotspot; message: string } {
    const raw = locationIdOrName.toLowerCase().replace(/[\s_\-]+/g, '');
    
    // Fuzzy matching
    const spot = ctx.hotspots.find(
      (h) => h.id.replace(/[\s_\-]+/g, '').includes(raw) || 
             h.name.toLowerCase().replace(/[\s_\-]+/g, '').includes(raw) ||
             (raw.includes('tamil') && h.id === 'chennai') ||
             (raw.includes('india') && (h.id === 'indo-gangetic-plain' || h.id === 'chennai'))
    );

    if (spot) {
      ctx.onSelectHotspot(spot);
      return {
        success: true,
        hotspot: spot,
        message: `Planetary camera focused on ${spot.name} (${spot.region}, ${spot.country}). Primary risk: ${spot.primaryRisk}.`,
      };
    }

    return {
      success: false,
      message: `Hotspot "${locationIdOrName}" not found in current Earth observation database.`,
    };
  }

  public static toggleLayer(
    layerName: string,
    ctx: AppActionContext
  ): { success: boolean; layer?: LayerType; message: string } {
    const clean = layerName.toLowerCase().trim();
    const map: Record<string, LayerType> = {
      health: 'health',
      temp: 'temperature',
      temperature: 'temperature',
      heat: 'temperature',
      aqi: 'air_quality',
      air: 'air_quality',
      air_quality: 'air_quality',
      pollution: 'air_quality',
      green: 'green_cover',
      vegetation: 'green_cover',
      forest: 'green_cover',
      tree: 'green_cover',
      water: 'water',
      urban: 'urbanization',
      flood: 'flood',
      flooding: 'flood',
      drought: 'drought',
      wildfire: 'wildfire',
      fire: 'wildfire',
      rainfall: 'rainfall',
      precipitation: 'rainfall',
    };

    const target = map[clean];
    if (target) {
      ctx.onChangeLayer(target);
      return {
        success: true,
        layer: target,
        message: `${target.replace('_', ' ')} satellite sensor layer activated on the 3D globe.`,
      };
    }

    return {
      success: false,
      message: `Sensor layer "${layerName}" not recognized.`,
    };
  }

  public static getHighestRiskHotspot(ctx: AppActionContext): {
    hotspot: EnvironmentalHotspot;
    riskScore: number;
    explanation: string;
  } {
    let highestSpot = ctx.hotspots[0];
    let highestRiskScore = -1;

    for (const h of ctx.hotspots) {
      // Risk score composite: 100 - environmentalHealth or max of specific risks
      const risk = Math.max(h.currentMetrics.floodRisk, h.currentMetrics.heatRisk, 100 - h.currentMetrics.environmentalHealth);
      if (risk > highestRiskScore) {
        highestRiskScore = risk;
        highestSpot = h;
      }
    }

    ctx.onSelectHotspot(highestSpot);
    const explanation = `${highestSpot.name} (${highestSpot.region}, ${highestSpot.country}) currently exhibits the highest combined environmental risk (composite risk index: ${highestRiskScore}/100). Primary danger: ${highestSpot.primaryRisk}.`;

    return {
      hotspot: highestSpot,
      riskScore: highestRiskScore,
      explanation,
    };
  }

  public static showFloodHotspots(ctx: AppActionContext): {
    hotspots: EnvironmentalHotspot[];
    explanation: string;
  } {
    ctx.onChangeLayer('flood');
    const floodSpots = ctx.hotspots.filter(
      (h) => h.primaryRisk.toLowerCase().includes('flood') || h.currentMetrics.floodRisk >= 60
    );

    const names = floodSpots.map((h) => h.name).join(', ');
    const explanation = `Flood risk remote sensing layer activated. Identified high flood exposure hotspots: ${names}.`;

    return {
      hotspots: floodSpots,
      explanation,
    };
  }

  public static explainAreaColor(ctx: AppActionContext): {
    layer: string;
    threshold: string;
    explanation: string;
  } {
    const layer = ctx.activeLayer || 'health';
    const spot = ctx.selectedHotspot;
    let explanation = `On the active ${layer.replace('_', ' ')} layer, red indicates high stress or critical risk (scores above 75/100). In ${spot ? spot.name : 'this region'}, this represents severe ${spot ? spot.primaryRisk.toLowerCase() : 'environmental'} vulnerability under current observation parameters.`;

    if (layer === 'temperature') {
      explanation = `Red indicates positive surface thermal anomalies (> +2.5°C above decadal baseline), characteristic of urban heat islands and radiative trapping.`;
    } else if (layer === 'flood') {
      explanation = `Red highlights low-lying alluvial floodplains and impervious urban zones where modeled runoff exceeds stormwater capacity, creating acute flash inundation risk.`;
    } else if (layer === 'green_cover') {
      explanation = `Red indicates critical canopy loss and degraded vegetation cover (< 20% density), where deforested soil accelerates erosion and runoff.`;
    }

    return {
      layer,
      threshold: 'Red = Severe Risk Index (>75/100)',
      explanation,
    };
  }
}
