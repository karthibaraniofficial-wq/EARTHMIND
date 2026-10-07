import React, { useState } from 'react';
import { 
  Layers, 
  Flame, 
  Wind, 
  Trees, 
  Droplets, 
  Building2, 
  Trash2, 
  Waves, 
  Sun, 
  Zap, 
  CloudRain,
  ShieldCheck,
  Database,
  ExternalLink,
  Info,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { GlassCard } from '../../components/glass/GlassCard';
import { GlassBadge } from '../../components/glass/GlassBadge';
import { GlassButton } from '../../components/glass/GlassButton';
import { RealEarth } from '../../components/3d/RealEarth';
import { EnvironmentalHotspot, LayerType, DataProvenance } from '../../types';

interface LayersHubViewProps {
  hotspots: EnvironmentalHotspot[];
  selectedHotspot: EnvironmentalHotspot;
  onSelectHotspot: (hotspot: EnvironmentalHotspot) => void;
  activeLayer: LayerType;
  onChangeLayer: (layer: LayerType) => void;
  onNavigateToExplorer: () => void;
}

interface LayerMetadata {
  id: LayerType;
  name: string;
  category: 'Atmospheric' | 'Terrestrial' | 'Hydrological' | 'Anthropogenic';
  satelliteMission: string;
  sensorInstrument: string;
  spatialResolution: string;
  revisitFrequency: string;
  units: string;
  provenance: DataProvenance;
  uncertaintyMargin: string;
  description: string;
  colorTone: string;
  icon: React.ReactNode;
}

export const LayersHubView: React.FC<LayersHubViewProps> = ({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  activeLayer,
  onChangeLayer,
  onNavigateToExplorer,
}) => {
  const layerRegistry: LayerMetadata[] = [
    {
      id: 'health',
      name: 'Composite Ecological Health Index',
      category: 'Terrestrial',
      satelliteMission: 'Sentinel-2 & Landsat-9 Harmonized',
      sensorInstrument: 'MSI (10m) / TIRS-2 (100m)',
      spatialResolution: '10 – 30 meters',
      revisitFrequency: '5 days',
      units: 'Score (0 – 100 Index)',
      provenance: 'MODELLED',
      uncertaintyMargin: '± 4.2 pts',
      description: 'Multi-criteria composite synthesizing photosynthetic canopy vigor, thermal stress, impervious surface ratio, and soil hydration retention into a single planetary resilience score.',
      colorTone: '#27C98A',
      icon: <Layers className="w-5 h-5 text-earth-leaf" />,
    },
    {
      id: 'temperature',
      name: 'Land Surface Thermal Radiance (LST)',
      category: 'Atmospheric',
      satelliteMission: 'Landsat-9 / TIRS-2',
      sensorInstrument: 'Thermal Infrared Sensor 2 (Bands 10/11)',
      spatialResolution: '100 meters (resampled to 30m)',
      revisitFrequency: '8 – 16 days',
      units: 'Degrees Celsius (°C anomaly)',
      provenance: 'OBSERVED',
      uncertaintyMargin: '± 0.4°C radiometric error',
      description: 'Direct radiometric skin temperature observations. Reveals urban heat islands, asphalt heat retention, and evapotranspirative cooling deficits in deforested corridors.',
      colorTone: '#FF6B6B',
      icon: <Flame className="w-5 h-5 text-earth-coral" />,
    },
    {
      id: 'air_quality',
      name: 'Aerosol Optical Depth (AOD / PM2.5)',
      category: 'Atmospheric',
      satelliteMission: 'Terra & Aqua / Sentinel-5P',
      sensorInstrument: 'MODIS & TROPOMI',
      spatialResolution: '1.1 km to 3.5 km',
      revisitFrequency: 'Daily (24h)',
      units: 'AQI / Optical Extinction (τ)',
      provenance: 'OBSERVED',
      uncertaintyMargin: '± 8% optical thickness',
      description: 'Atmospheric column particle scattering measuring tropospheric nitrogen dioxide (NO2), sulphur dioxide (SO2), and particulate matter (PM2.5) inversion layers.',
      colorTone: '#9B7CFF',
      icon: <Wind className="w-5 h-5 text-earth-aurora" />,
    },
    {
      id: 'green_cover',
      name: 'Vegetation Canopy Index (NDVI)',
      category: 'Terrestrial',
      satelliteMission: 'Sentinel-2 MSI',
      sensorInstrument: 'Multispectral Instrument (Bands 4 & 8)',
      spatialResolution: '10 meters',
      revisitFrequency: '5 days',
      units: 'Normalized Ratio (-1.0 to +1.0)',
      provenance: 'OBSERVED',
      uncertaintyMargin: '± 0.03 NDVI',
      description: 'Near-infrared reflectance evaluating chlorophyll activity, tree canopy density, agricultural crop maturation, and forest loss along critical biodiversity frontiers.',
      colorTone: '#27C98A',
      icon: <Trees className="w-5 h-5 text-earth-emerald" />,
    },
    {
      id: 'water',
      name: 'Hydrological Surface & Retention Index (NDWI)',
      category: 'Hydrological',
      satelliteMission: 'Sentinel-1 & Sentinel-2',
      sensorInstrument: 'C-SAR Radar & MSI Green/NIR',
      spatialResolution: '10 – 20 meters',
      revisitFrequency: '6 days (cloud-penetrating radar)',
      units: 'Normalized Index / Water Area km²',
      provenance: 'OBSERVED',
      uncertaintyMargin: '± 3.1% shoreline delineation',
      description: 'Combined optical NDWI and synthetic aperture radar backscatter mapping wetlands, reservoirs, river discharge, and persistent soil moisture saturation.',
      colorTone: '#18C8C8',
      icon: <Droplets className="w-5 h-5 text-earth-aqua" />,
    },
    {
      id: 'urbanization',
      name: 'Impervious Surface & Concrete Sprawl (NDBI)',
      category: 'Anthropogenic',
      satelliteMission: 'Landsat-9 OLI-2 & Sentinel-2',
      sensorInstrument: 'Shortwave Infrared (SWIR)',
      spatialResolution: '10 – 30 meters',
      revisitFrequency: '8 days',
      units: 'Percent Built-up Cover (%)',
      provenance: 'MODELLED',
      uncertaintyMargin: '± 2.5% classification accuracy',
      description: 'Built-up index isolating artificial roofing, concrete pavements, and road density versus permeable soils and urban park buffers.',
      colorTone: '#FFD166',
      icon: <Building2 className="w-5 h-5 text-earth-sun" />,
    },
    {
      id: 'flood',
      name: 'Stormwater Runoff & Flood Vulnerability',
      category: 'Hydrological',
      satelliteMission: 'SRTM Topography & Sentinel-1 SAR',
      sensorInstrument: 'Radar Interferometry + Runoff Model',
      spatialResolution: '30 meters',
      revisitFrequency: 'Dynamic Event Response',
      units: 'Vulnerability Index (0 – 100)',
      provenance: 'SIMULATED',
      uncertaintyMargin: '± 7.4% hydrological runoff error',
      description: 'Topographic wetness index (TWI) combined with soil impermeability and rainfall accumulation forecasts to model basin inundation hazards.',
      colorTone: '#4FA8FF',
      icon: <Waves className="w-5 h-5 text-earth-sky" />,
    },
    {
      id: 'drought',
      name: 'Evaporative Drought Severity (EDDI / PDSI)',
      category: 'Hydrological',
      satelliteMission: 'MODIS & GRACE-FO',
      sensorInstrument: 'Evapotranspiration & Gravimetry',
      spatialResolution: '100 km (Downscaled to 1 km)',
      revisitFrequency: 'Bi-weekly',
      units: 'Standardized Anomaly (σ)',
      provenance: 'MODELLED',
      uncertaintyMargin: '± 0.2 σ evaporative demand',
      description: 'Atmospheric moisture deficit and deep groundwater table depletion tracking agricultural drought in arid and semi-arid agrarian biomes.',
      colorTone: '#EB8C34',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
    },
    {
      id: 'wildfire',
      name: 'Pyrogenic Fuel & Wildfire Radiance',
      category: 'Terrestrial',
      satelliteMission: 'VIIRS / Suomi NPP',
      sensorInstrument: 'Active Thermal Fire Detection (I-band 375m)',
      spatialResolution: '375 meters',
      revisitFrequency: '12 hours (day & night passes)',
      units: 'Fire Radiative Power (MW)',
      provenance: 'OBSERVED',
      uncertaintyMargin: '± 50m location precision',
      description: 'Thermal anomalies detecting active fire perimeters, dry biomass fuel density, and smoke plume propagation along deforestation edges.',
      colorTone: '#FF3C14',
      icon: <Zap className="w-5 h-5 text-red-500" />,
    },
    {
      id: 'rainfall',
      name: 'Precipitation Intensity & Monsoon Fronts',
      category: 'Atmospheric',
      satelliteMission: 'GPM (Global Precipitation Measurement)',
      sensorInstrument: 'Dual-frequency Precipitation Radar (DPR)',
      spatialResolution: '5 km',
      revisitFrequency: '3 hours global constellation',
      units: 'Millimeters per Hour (mm/h)',
      provenance: 'OBSERVED',
      uncertaintyMargin: '± 1.2 mm/h precipitation error',
      description: 'Microwave constellation tracking precipitation accumulation, convective storm cells, and seasonal monsoon circulation corridors.',
      colorTone: '#28A0FF',
      icon: <CloudRain className="w-5 h-5 text-blue-400" />,
    },
  ];

  const currentMeta = layerRegistry.find((l) => l.id === activeLayer) || layerRegistry[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 min-w-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-earth-aqua" />
            <span className="text-xs font-mono uppercase tracking-wider text-earth-aqua">
              PLANETARY SENSOR ARCHITECTURE
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Multi-Spectral Layers Hub</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Inspect all 10 verified remote-sensing layers synthesized into the EARTHMIND Digital Twin. Calibrated from ESA, NASA, and USGS satellite constellations with rigorous uncertainty bounds.
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="sm"
          onClick={onNavigateToExplorer}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Open 3D Explorer
        </GlassButton>
      </div>

      {/* Main 2-Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Real Earth Layer Preview (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard variant="strong" glow="aqua" className="p-4 border border-white/20 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-earth-aqua animate-pulse" />
                <span className="text-xs font-bold text-white font-mono uppercase">
                  ACTIVE LAYER: {currentMeta.name}
                </span>
              </div>
              <GlassBadge tone={currentMeta.provenance === 'OBSERVED' ? 'emerald' : 'sun'} size="sm">
                [{currentMeta.provenance}]
              </GlassBadge>
            </div>

            <div className="w-full h-[400px] rounded-2xl overflow-hidden glass-panel-2 border border-white/10 relative">
              <RealEarth
                mode="explorer"
                interactive={true}
                showAtmosphere={true}
                showClouds={true}
                showNightLights={true}
                showHotspots={true}
                showEnvironmentalOverlay={true}
                activeLayer={activeLayer}
                hotspots={hotspots}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={onSelectHotspot}
                className="w-full h-full"
              />
            </div>

            <div className="mt-3 px-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Sensor: {currentMeta.sensorInstrument}</span>
              <span>Resolution: {currentMeta.spatialResolution}</span>
            </div>
          </GlassCard>

          {/* Scientific Data Lineage Panel */}
          <GlassCard variant="medium" className="p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-white font-mono uppercase">
                <Database className="w-4 h-4 text-earth-aqua" />
                <span>Data Lineage Pipeline</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">ISO 19115 Geospatial Provenance</span>
            </div>

            <div className="space-y-2.5 pt-1 text-xs font-mono">
              <div className="flex items-start gap-3 p-2.5 rounded-xl glass-panel-1 border border-white/5">
                <span className="px-2 py-0.5 rounded bg-earth-aqua/20 text-earth-aqua text-[10px] font-bold">STAGE 1</span>
                <div>
                  <div className="text-white font-semibold">Raw Top-Of-Atmosphere Radiance (L1C)</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{currentMeta.satelliteMission} • ESA Copernicus Open Access Hub</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl glass-panel-1 border border-white/5">
                <span className="px-2 py-0.5 rounded bg-earth-aurora/20 text-earth-aurora text-[10px] font-bold">STAGE 2</span>
                <div>
                  <div className="text-white font-semibold">Atmospheric Correction & Terrain Orthorectification (L2A)</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Sen2Cor v2.10 • SRTM 30m Digital Elevation Model</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl glass-panel-1 border border-white/5">
                <span className="px-2 py-0.5 rounded bg-earth-emerald/20 text-earth-emerald text-[10px] font-bold">STAGE 3</span>
                <div>
                  <div className="text-white font-semibold">Biophysical Transformation & Anomaly Extraction</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Multi-temporal rolling baseline (2010–2026 reference)</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl glass-panel-1 border border-earth-aqua/30 bg-earth-aqua/5">
                <span className="px-2 py-0.5 rounded bg-earth-aqua text-[#071A2B] text-[10px] font-bold">STAGE 4</span>
                <div>
                  <div className="text-white font-semibold">RealEarth WebGL Spherical Projection</div>
                  <div className="text-[10px] text-earth-aqua mt-0.5">Three.js shader mesh ({currentMeta.uncertaintyMargin})</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right: Layer Catalog Grid (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base font-bold text-white font-mono">10 Planetary Layers Catalog</h2>
            <span className="text-xs text-slate-400 font-mono">Click to activate layer in RealEarth</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {layerRegistry.map((layer) => {
              const isActive = activeLayer === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => onChangeLayer(layer.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isActive
                      ? 'glass-panel-3 border-earth-aqua shadow-lg shadow-earth-aqua/15 ring-1 ring-earth-aqua'
                      : 'glass-panel-1 border-white/10 hover:border-white/20 hover:glass-panel-2'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                        {layer.icon}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white leading-snug">{layer.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{layer.satelliteMission}</div>
                      </div>
                    </div>
                    {isActive && (
                      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-earth-aqua animate-ping" />
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                    {layer.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">{layer.units}</span>
                    <span className="text-earth-aqua font-semibold">{layer.uncertaintyMargin}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
