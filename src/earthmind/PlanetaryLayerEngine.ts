/**
 * EARTHMIND - Planetary Layer Engine (OS 4.0)
 * Centralized registry and query manager for all Earth observation raster/vector layers.
 */

import { LayerType } from '../types';

export interface LayerLegendStep {
  value: number | string;
  label: string;
  color: string;
}

export interface LayerLegend {
  min: number | string;
  max: number | string;
  unit: string;
  steps: LayerLegendStep[];
  gradientCss: string;
}

export interface PlanetaryLayer {
  id: LayerType;
  name: string;
  category: 'Atmospheric' | 'Terrestrial' | 'Hydrological' | 'Anthropogenic' | 'Ecological' | 'Climate';
  description: string;
  unit: string;
  source: string;
  date: string;
  resolution: string;
  confidence: number; // 0 - 100%
  visualizationType: 'raster' | 'heatmap' | 'vector' | 'contour' | 'particles';
  sensor: string;
  revisitFrequency: string;
  legend: LayerLegend;
  accentColor: string;
}

export const PLANETARY_LAYERS: PlanetaryLayer[] = [
  {
    id: 'health',
    name: 'Composite Ecological Health Index',
    category: 'Ecological',
    description: 'Multi-criteria planetary resilience score synthesizing canopy health, soil moisture, and thermal stress.',
    unit: 'Score (0 - 100 Index)',
    source: 'Harmonized Sentinel-2 / Landsat-9 MSI & TIRS',
    date: '2026-10-01',
    resolution: '10 - 30m',
    confidence: 96,
    visualizationType: 'raster',
    sensor: 'MSI (Sentinel-2) / OLI-2 (Landsat-9)',
    revisitFrequency: '5 days',
    accentColor: '#10B981',
    legend: {
      min: 0,
      max: 100,
      unit: 'Score [0-100]',
      steps: [
        { value: 0, label: 'Critical / Degraded', color: '#EF4444' },
        { value: 50, label: 'Moderate Vulnerability', color: '#F59E0B' },
        { value: 100, label: 'Optimal / Thriving', color: '#10B981' },
      ],
      gradientCss: 'linear-gradient(90deg, #EF4444, #F59E0B, #10B981)',
    },
  },
  {
    id: 'temperature',
    name: 'Land Surface Temperature (LST)',
    category: 'Atmospheric',
    description: 'Direct radiometric skin temperature highlighting urban heat islands and biophysical thermal anomalies.',
    unit: '°C Anomaly',
    source: 'NASA / USGS Landsat-9 TIRS-2 & MODIS Terra',
    date: '2026-10-04',
    resolution: '30m (Resampled)',
    confidence: 94,
    visualizationType: 'heatmap',
    sensor: 'TIRS-2 Bands 10/11',
    revisitFrequency: '8 - 16 days',
    accentColor: '#EF4444',
    legend: {
      min: -5,
      max: 10,
      unit: '°C Anomaly',
      steps: [
        { value: -5, label: 'Sub-zero cooling', color: '#3B82F6' },
        { value: 0, label: 'Baseline', color: '#10B981' },
        { value: 5, label: 'Elevated Heat (+5°C)', color: '#F97316' },
        { value: 10, label: 'Extreme Anomaly (+10°C)', color: '#EF4444' },
      ],
      gradientCss: 'linear-gradient(90deg, #3B82F6, #10B981, #F97316, #EF4444)',
    },
  },
  {
    id: 'rainfall',
    name: 'Precipitation & Monsoonal Flux',
    category: 'Hydrological',
    description: 'GPM Dual-frequency Precipitation Radar recording heavy convective rainfall and monsoonal anomalies.',
    unit: 'mm / 24h',
    source: 'NASA / JAXA GPM Core Observatory DPR & GMI',
    date: '2026-10-06',
    resolution: '5 km',
    confidence: 93,
    visualizationType: 'particles',
    sensor: 'Dual-frequency Precipitation Radar',
    revisitFrequency: '3 hours',
    accentColor: '#38BDF8',
    legend: {
      min: 0,
      max: 250,
      unit: 'mm / day',
      steps: [
        { value: 0, label: 'Dry (0 mm)', color: '#94A3B8' },
        { value: 50, label: 'Moderate Rain (50 mm)', color: '#38BDF8' },
        { value: 150, label: 'Heavy Torrential (150 mm)', color: '#2563EB' },
        { value: 250, label: 'Extreme Cloudburst (>250 mm)', color: '#7C3AED' },
      ],
      gradientCss: 'linear-gradient(90deg, #94A3B8, #38BDF8, #2563EB, #7C3AED)',
    },
  },
  {
    id: 'air_quality',
    name: 'Aerosol Optical Depth (PM2.5 / NO2)',
    category: 'Atmospheric',
    description: 'Tropospheric trace gas column concentrations and fine aerosol extinction coefficients.',
    unit: 'AQI Index',
    source: 'ESA Copernicus Sentinel-5P TROPOMI & MODIS',
    date: '2026-10-07',
    resolution: '3.5 km',
    confidence: 95,
    visualizationType: 'raster',
    sensor: 'TROPOMI Ultraviolet-Visible-NIR-SWIR',
    revisitFrequency: 'Daily',
    accentColor: '#F59E0B',
    legend: {
      min: 0,
      max: 500,
      unit: 'AQI',
      steps: [
        { value: 50, label: 'Good (0-50)', color: '#10B981' },
        { value: 100, label: 'Moderate (51-100)', color: '#FBBF24' },
        { value: 200, label: 'Unhealthy (151-200)', color: '#F97316' },
        { value: 300, label: 'Very Unhealthy (201-300)', color: '#EF4444' },
        { value: 500, label: 'Hazardous (>300)', color: '#881337' },
      ],
      gradientCss: 'linear-gradient(90deg, #10B981, #FBBF24, #F97316, #EF4444, #881337)',
    },
  },
  {
    id: 'flood',
    name: 'Flood Inundation & Hydrological Risk',
    category: 'Hydrological',
    description: 'Synthetic Aperture Radar (SAR) specular water detection penetrating cloud cover in extreme precipitation.',
    unit: 'Flood Risk Index (0-100)',
    source: 'ESA Sentinel-1 C-SAR & NISAR S-Band SAR',
    date: '2026-10-05',
    resolution: '10m',
    confidence: 97,
    visualizationType: 'raster',
    sensor: 'C-Band Synthetic Aperture Radar',
    revisitFrequency: '6 days',
    accentColor: '#06B6D4',
    legend: {
      min: 0,
      max: 100,
      unit: 'Risk Score',
      steps: [
        { value: 0, label: 'Minimal Inundation (0-20)', color: '#0EA5E9' },
        { value: 50, label: 'Flash Flood Hazard (40-70)', color: '#F59E0B' },
        { value: 100, label: 'Catastrophic Submersion (>80)', color: '#DC2626' },
      ],
      gradientCss: 'linear-gradient(90deg, #0EA5E9, #F59E0B, #DC2626)',
    },
  },
  {
    id: 'drought',
    name: 'Evaporative Stress & Drought Index',
    category: 'Climate',
    description: 'Evaporative Stress Index (ESI) detecting rapid agricultural flash droughts and soil moisture exhaustion.',
    unit: 'ESI Z-Score',
    source: 'NOAA GOES-R & ECOSTRESS ISS Thermal Radiometer',
    date: '2026-10-03',
    resolution: '70m',
    confidence: 91,
    visualizationType: 'heatmap',
    sensor: 'ECOSTRESS Multispectral Thermal Radiometer',
    revisitFrequency: '4 days',
    accentColor: '#D97706',
    legend: {
      min: -3,
      max: 3,
      unit: 'ESI Score',
      steps: [
        { value: -3, label: 'Severe Drought Flashpoint', color: '#78350F' },
        { value: -1, label: 'Water Deficit Warning', color: '#D97706' },
        { value: 1, label: 'Adequate Hydration', color: '#10B981' },
      ],
      gradientCss: 'linear-gradient(90deg, #78350F, #D97706, #10B981)',
    },
  },
  {
    id: 'green_cover',
    name: 'Photosynthetic Canopy Density (NDVI)',
    category: 'Terrestrial',
    description: 'Normalized Difference Vegetation Index tracking chlorophyll absorption and regional afforestation.',
    unit: 'NDVI (-0.2 to +1.0)',
    source: 'Sentinel-2 MSI Red/NIR Band Ratios',
    date: '2026-10-06',
    resolution: '10m',
    confidence: 96,
    visualizationType: 'raster',
    sensor: 'MSI Bands 4 and 8',
    revisitFrequency: '5 days',
    accentColor: '#10B981',
    legend: {
      min: 0,
      max: 1,
      unit: 'NDVI',
      steps: [
        { value: 0.1, label: 'Barren Soil / Urban', color: '#D97706' },
        { value: 0.4, label: 'Grassland / Shrub', color: '#84CC16' },
        { value: 0.8, label: 'Dense Forest Canopy', color: '#047857' },
      ],
      gradientCss: 'linear-gradient(90deg, #D97706, #84CC16, #047857)',
    },
  },
  {
    id: 'forest_cover',
    name: 'Forest Canopy Height & Biomass',
    category: 'Terrestrial',
    description: 'Spaceborne LiDAR waveform metrics mapping tree height structure and carbon stock density.',
    unit: 'Canopy Meters / Mg C/ha',
    source: 'NASA GEDI ISS LiDAR & ICESat-2 ATLAS',
    date: '2026-09-28',
    resolution: '25m footprint',
    confidence: 95,
    visualizationType: 'contour',
    sensor: 'Global Ecosystem Dynamics Investigation LiDAR',
    revisitFrequency: 'Orbit Groundtrack',
    accentColor: '#059669',
    legend: {
      min: 0,
      max: 50,
      unit: 'Meters Canopy',
      steps: [
        { value: 0, label: 'Cleared / Deforested', color: '#F59E0B' },
        { value: 20, label: 'Secondary Forest (20m)', color: '#10B981' },
        { value: 45, label: 'Primary Rainforest (>40m)', color: '#064E3B' },
      ],
      gradientCss: 'linear-gradient(90deg, #F59E0B, #10B981, #064E3B)',
    },
  },
  {
    id: 'deforestation',
    name: 'Near-Real-Time Deforestation Alerts (GLAD)',
    category: 'Terrestrial',
    description: 'Automated 10m tree loss alert algorithms detecting illegal logging corridors and road scars.',
    unit: 'Loss Hectares / Alerts',
    source: 'Global Land Analysis & Discovery (GLAD) Sentinel-2 Alerts',
    date: '2026-10-07',
    resolution: '10m',
    confidence: 94,
    visualizationType: 'heatmap',
    sensor: 'Automated Multi-spectral Disturbance Alert Engine',
    revisitFrequency: 'Weekly',
    accentColor: '#DC2626',
    legend: {
      min: 0,
      max: 500,
      unit: 'Hectares / Wk',
      steps: [
        { value: 0, label: 'Stable Forest', color: '#10B981' },
        { value: 100, label: 'Disturbance Detected', color: '#F97316' },
        { value: 500, label: 'Acute Clearing Front', color: '#DC2626' },
      ],
      gradientCss: 'linear-gradient(90deg, #10B981, #F97316, #DC2626)',
    },
  },
  {
    id: 'water',
    name: 'Surface Water Extent (NDWI)',
    category: 'Hydrological',
    description: 'Normalized Difference Water Index tracking reservoir shrinking, lake shrinkage, and river braiding.',
    unit: 'Water Surface Area (km²)',
    source: 'Sentinel-2 Green/NIR Spectral Bands',
    date: '2026-10-02',
    resolution: '10m',
    confidence: 96,
    visualizationType: 'raster',
    sensor: 'MSI Band 3/8',
    revisitFrequency: '5 days',
    accentColor: '#0284C7',
    legend: {
      min: 0,
      max: 100,
      unit: 'Surface %',
      steps: [
        { value: 0, label: 'Dry Basin', color: '#E2E8F0' },
        { value: 50, label: 'Shallow Wetland', color: '#38BDF8' },
        { value: 100, label: 'Deep Perennial Water', color: '#0369A1' },
      ],
      gradientCss: 'linear-gradient(90deg, #E2E8F0, #38BDF8, #0369A1)',
    },
  },
  {
    id: 'groundwater',
    name: 'GRACE-FO Terrestrial Aquifer Depletion',
    category: 'Hydrological',
    description: 'Satellite gravimetry detecting deep underground aquifer depletion anomalies across basins.',
    unit: 'Equivalent Water Height (cm)',
    source: 'NASA / GFZ GRACE-FO Satellite Gravimetry',
    date: '2026-09-15',
    resolution: '300 km (Downscaled to basin)',
    confidence: 90,
    visualizationType: 'contour',
    sensor: 'K-Band Microwave Ranging Gravimeter',
    revisitFrequency: 'Monthly',
    accentColor: '#6366F1',
    legend: {
      min: -30,
      max: 20,
      unit: 'cm EWH',
      steps: [
        { value: -30, label: 'Severe Aquifer Depletion (-30cm)', color: '#EF4444' },
        { value: 0, label: 'Neutral Replenishment', color: '#6366F1' },
        { value: 20, label: 'Aquifer Recharging (+20cm)', color: '#10B981' },
      ],
      gradientCss: 'linear-gradient(90deg, #EF4444, #6366F1, #10B981)',
    },
  },
  {
    id: 'urbanization',
    name: 'Impervious Surface & Urban Expansion (NDBI)',
    category: 'Anthropogenic',
    description: 'Built-up index mapping concrete sprawl, asphalt paving, and loss of permeable natural soils.',
    unit: '% Built Surface Cover',
    source: 'Landsat-9 SWIR & NIR Bands',
    date: '2026-09-30',
    resolution: '30m',
    confidence: 95,
    visualizationType: 'raster',
    sensor: 'OLI-2 Bands 5/6',
    revisitFrequency: '16 days',
    accentColor: '#8B5CF6',
    legend: {
      min: 0,
      max: 100,
      unit: '% Built',
      steps: [
        { value: 0, label: 'Natural Permeable Cover', color: '#10B981' },
        { value: 50, label: 'Suburban / Mixed', color: '#A855F7' },
        { value: 100, label: 'Dense Concrete Core (>80%)', color: '#4C1D95' },
      ],
      gradientCss: 'linear-gradient(90deg, #10B981, #A855F7, #4C1D95)',
    },
  },
  {
    id: 'pollution',
    name: 'Industrial Waste & Point Source Emissions',
    category: 'Anthropogenic',
    description: 'Multispectral water discharge anomalies and airborne toxic plume monitoring.',
    unit: 'Pollution Hazard Index (0-100)',
    source: 'Sentinel-2 SWIR & PlanetScope 3m Constellation',
    date: '2026-10-06',
    resolution: '3 - 10m',
    confidence: 92,
    visualizationType: 'heatmap',
    sensor: 'High-Resolution Visual & SWIR Sensors',
    revisitFrequency: '2 - 3 days',
    accentColor: '#F43F5E',
    legend: {
      min: 0,
      max: 100,
      unit: 'Hazard Index',
      steps: [
        { value: 0, label: 'Clean Baseline (0-20)', color: '#10B981' },
        { value: 50, label: 'Moderate Runoff (50)', color: '#F59E0B' },
        { value: 100, label: 'Toxic Industrial Point Source', color: '#BE123C' },
      ],
      gradientCss: 'linear-gradient(90deg, #10B981, #F59E0B, #BE123C)',
    },
  },
  {
    id: 'carbon',
    name: 'OCO-2 / OCO-3 Atmospheric CO2 Flux',
    category: 'Climate',
    description: 'Column-averaged carbon dioxide mole fraction (XCO2) mapping urban plumes and natural sinks.',
    unit: 'XCO2 Parts Per Million (PPM)',
    source: 'NASA Orbiting Carbon Observatory (OCO-2 / OCO-3)',
    date: '2026-10-04',
    resolution: '2 km',
    confidence: 96,
    visualizationType: 'heatmap',
    sensor: 'Three High-Resolution Grating Spectrometers',
    revisitFrequency: '16 days',
    accentColor: '#EC4899',
    legend: {
      min: 410,
      max: 435,
      unit: 'PPM CO2',
      steps: [
        { value: 415, label: 'Background Oceanic (415 ppm)', color: '#0284C7' },
        { value: 423, label: 'Global Mean (423 ppm)', color: '#F59E0B' },
        { value: 435, label: 'Megacity Emission Plume (>430 ppm)', color: '#E11D48' },
      ],
      gradientCss: 'linear-gradient(90deg, #0284C7, #F59E0B, #E11D48)',
    },
  },
  {
    id: 'wildfire',
    name: 'Active Thermal Fire Radiative Power (VIIRS)',
    category: 'Terrestrial',
    description: '375m active fire detections and Mega-watt thermal energy release tracking frontline fire spread.',
    unit: 'Fire Radiative Power (MW)',
    source: 'NASA / NOAA Suomi NPP & NOAA-20 VIIRS I-Band',
    date: '2026-10-07',
    resolution: '375m',
    confidence: 98,
    visualizationType: 'heatmap',
    sensor: 'Visible Infrared Imaging Radiometer Suite',
    revisitFrequency: '12 hours',
    accentColor: '#FF4500',
    legend: {
      min: 0,
      max: 1000,
      unit: 'MW Power',
      steps: [
        { value: 0, label: 'No Active Fire', color: '#64748B' },
        { value: 100, label: 'Moderate Smoldering (100 MW)', color: '#F97316' },
        { value: 1000, label: 'Crown Mega-fire (>500 MW)', color: '#DC2626' },
      ],
      gradientCss: 'linear-gradient(90deg, #64748B, #F97316, #DC2626)',
    },
  },
  {
    id: 'biodiversity',
    name: 'Species Habitat Intactness & Corridors',
    category: 'Ecological',
    description: 'Ecological corridor connectivity and human footprint pressure on IUCN threatened biodiversity ranges.',
    unit: 'Biodiversity Intactness Index (BII %)',
    source: 'IPBES / UNEP-WCMC & Global Biodiversity Information Facility',
    date: '2026-08-20',
    resolution: '1 km',
    confidence: 89,
    visualizationType: 'raster',
    sensor: 'Modelled Eco-spatial Bioclimatic Envelopes',
    revisitFrequency: 'Annual',
    accentColor: '#14B8A6',
    legend: {
      min: 0,
      max: 100,
      unit: 'BII Score',
      steps: [
        { value: 20, label: 'High Fragmentation / Extinction Risk', color: '#DC2626' },
        { value: 60, label: 'Buffer Zone Ecological Corridor', color: '#F59E0B' },
        { value: 95, label: 'Pristine Wilderness Core (>90%)', color: '#0D9488' },
      ],
      gradientCss: 'linear-gradient(90deg, #DC2626, #F59E0B, #0D9488)',
    },
  },
  {
    id: 'sea_level',
    name: 'Satellite Altimetry Coastal Sea Level Anomaly',
    category: 'Climate',
    description: 'Radar altimetry tracking coastal dynamic topography, thermal expansion, and storm surge baseline lift.',
    unit: 'Sea Level Anomaly (mm)',
    source: 'Sentinel-6 Michael Freilich & Jason-3 Poseidon-4',
    date: '2026-09-29',
    resolution: 'Track Point (Downscaled 5km)',
    confidence: 97,
    visualizationType: 'contour',
    sensor: 'Synthetic Aperture Radar Altimeter (Poseidon-4)',
    revisitFrequency: '10 days',
    accentColor: '#2563EB',
    legend: {
      min: -50,
      max: 120,
      unit: 'mm Anomaly',
      steps: [
        { value: -20, label: 'Negative / Deep Oceanic', color: '#06B6D4' },
        { value: 30, label: 'Regional Mean (+30mm)', color: '#3B82F6' },
        { value: 100, label: 'Severe Coastal Transgression (>90mm)', color: '#831843' },
      ],
      gradientCss: 'linear-gradient(90deg, #06B6D4, #3B82F6, #831843)',
    },
  },
  {
    id: 'heat_risk',
    name: 'Wet-Bulb Globe Temperature & Heat Mortality',
    category: 'Climate',
    description: 'Combined ambient temperature and relative humidity calculating lethal human thermoregulation stress.',
    unit: 'Wet Bulb °C',
    source: 'ECMWF ERA5 Reanalysis & NASA MERRA-2',
    date: '2026-10-06',
    resolution: '25 km',
    confidence: 96,
    visualizationType: 'heatmap',
    sensor: 'Coupled Hydro-Thermal Atmospheric Assimilation',
    revisitFrequency: 'Hourly',
    accentColor: '#B91C1C',
    legend: {
      min: 20,
      max: 36,
      unit: 'TW (°C)',
      steps: [
        { value: 24, label: 'Safe Thermoregulation (<26°C)', color: '#10B981' },
        { value: 29, label: 'Extreme Physical Strain (29°C)', color: '#F59E0B' },
        { value: 33, label: 'Critical Danger (32-34°C)', color: '#EF4444' },
        { value: 35, label: 'Physiological Survival Limit (35°C)', color: '#450A0A' },
      ],
      gradientCss: 'linear-gradient(90deg, #10B981, #F59E0B, #EF4444, #450A0A)',
    },
  },
];

export class PlanetaryLayerEngine {
  public static getAllLayers(): PlanetaryLayer[] {
    return PLANETARY_LAYERS;
  }

  public static getLayerById(id: LayerType): PlanetaryLayer {
    const found = PLANETARY_LAYERS.find((l) => l.id === id);
    return found || PLANETARY_LAYERS[0];
  }

  public static getLayersByCategory(category: PlanetaryLayer['category']): PlanetaryLayer[] {
    return PLANETARY_LAYERS.filter((l) => l.category === category);
  }

  public static getSupportedLayerIds(): LayerType[] {
    return PLANETARY_LAYERS.map((l) => l.id);
  }
}
