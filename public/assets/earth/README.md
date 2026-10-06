# EARTHMIND Photorealistic Earth Assets

Authoritative, public-domain scientific imagery and textures used by the **EARTHMIND** Planetary Digital Twin visualization system (`RealEarth.tsx`).

## Asset Inventory & Sources

| Filename | Description | Resolution / Format | Source / Attribution | License |
| :--- | :--- | :--- | :--- | :--- |
| `earth_day.jpg` | True-color surface reflectance mosaic (Blue Marble: Next Generation) | 2048 x 1024 JPEG | NASA Visible Earth / Goddard Space Flight Center | Public Domain (NASA Open Data Policy) |
| `earth_night.jpg` | Global nocturnal city lights illumination | 2048 x 1024 JPEG | NASA Earth Observatory / Suomi NPP VIIRS DNB | Public Domain (NASA Open Data Policy) |
| `earth_clouds.png` | Atmospheric cloud cover mosaic with alpha channel transparency | 2048 x 1024 PNG | NASA Visible Earth / MODIS Terra composite | Public Domain (NASA Open Data Policy) |
| `earth_clouds_alpha.png` | Dedicated cloud transparency mask | 2048 x 1024 PNG | NASA Visible Earth / MODIS Terra composite | Public Domain (NASA Open Data Policy) |
| `earth_normal.jpg` | Topographical relief bump and normal vector perturbation map | 2048 x 1024 JPEG | USGS / NASA Shuttle Radar Topography Mission (SRTM) | Public Domain |
| `earth_specular.jpg` | Land/water mask for ocean specular sunlight reflection | 2048 x 1024 JPEG | NASA Goddard Space Flight Center | Public Domain |
| `earth_fallback.jpg` | High-fidelity static satellite view for WebGL-disabled runtimes | 2048 x 1024 JPEG | NASA Earth Observatory / ESA Sentinel-3 OLCI Composite | Public Domain |

## Offline Readiness
All texture maps are stored locally within this directory. The application **does not** depend on external image CDNs or live map tile servers at runtime.
