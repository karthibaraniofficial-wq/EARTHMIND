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
}
