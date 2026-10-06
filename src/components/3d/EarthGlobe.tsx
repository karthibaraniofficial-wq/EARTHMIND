import React from 'react';
import { RealEarth, RealEarthProps } from './RealEarth';
import { EnvironmentalHotspot, LayerType } from '../../types';

export interface EarthGlobeProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot | null;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  activeLayer: LayerType;
  className?: string;
  isInteractive?: boolean;
}

/**
 * EarthGlobe - Unified Real Earth Proxy
 * Seamlessly forwards all legacy EarthGlobe calls to the photorealistic NASA RealEarth digital twin.
 */
export const EarthGlobe: React.FC<EarthGlobeProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  activeLayer,
  className = '',
  isInteractive = true,
}) => {
  return (
    <RealEarth
      mode="explorer"
      interactive={isInteractive}
      showAtmosphere={true}
      showClouds={true}
      showNightLights={true}
      showHotspots={true}
      showEnvironmentalOverlay={true}
      activeLayer={activeLayer}
      hotspots={hotspots}
      selectedHotspot={selectedHotspot}
      onSelectHotspot={onSelectHotspot}
      className={className}
    />
  );
};

export default EarthGlobe;
