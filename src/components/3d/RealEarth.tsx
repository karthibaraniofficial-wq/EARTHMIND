import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { EnvironmentalHotspot, LayerType } from '../../types';
import { useTwinConfig } from '../../context/TwinConfigContext';
import { 
  RotateCcw, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Grid, 
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';
import { EarthMindLoading } from '../../branding';

export interface RealEarthProps {
  mode?: 'hero' | 'explorer' | 'memory' | 'overview';
  interactive?: boolean;
  showAtmosphere?: boolean;
  showClouds?: boolean;
  showNightLights?: boolean;
  showHotspots?: boolean;
  showEnvironmentalOverlay?: boolean;
  activeLayer?: LayerType;
  selectedYear?: number;
  hotspots?: EnvironmentalHotspot[];
  selectedHotspot?: EnvironmentalHotspot | null;
  onSelectHotspot?: (hotspot: EnvironmentalHotspot) => void;
  className?: string;
  autoRotateSpeed?: number;
}

export const RealEarth: React.FC<RealEarthProps> = ({
  mode = 'explorer',
  interactive = true,
  showAtmosphere = true,
  showClouds = true,
  showNightLights = true,
  showHotspots = true,
  showEnvironmentalOverlay = true,
  activeLayer = 'health',
  selectedYear = 2026,
  hotspots = [],
  selectedHotspot = null,
  onSelectHotspot,
  className = '',
  autoRotateSpeed,
}) => {
  const { config, updateConfig } = useTwinConfig();
  const mountRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [hoveredHotspot, setHoveredHotspot] = useState<EnvironmentalHotspot | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [hasWebGlError, setHasWebGlError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isRotating, setIsRotating] = useState<boolean>(config.earthAutoRotate);

  // Three.js object references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthGroupRef = useRef<THREE.Group | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);
  const overlayMeshRef = useRef<THREE.Mesh | null>(null);
  const overlayTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const gridGroupRef = useRef<THREE.Group | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Interaction & motion states
  const isDraggingRef = useRef(false);
  const previousMousePosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);
  const defaultDist = mode === 'hero' ? 2.5 : 2.3;
  const cameraDistanceRef = useRef(defaultDist);

  // Speed resolved from prop or global TwinConfig
  const effectiveRotateSpeed = autoRotateSpeed ?? config.earthRotationSpeed;

  // Convert real latitude/longitude to 3D Cartesian spherical coordinates
  const latLngToVector3 = useCallback((lat: number, lng: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }, []);

  // Generate dynamic transparent multi-spectral overlay texture
  const createEnvironmentalOverlayTexture = useCallback(
    (layer: LayerType, year: number): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const project = (lat: number, lng: number): [number, number] => {
        const x = ((lng + 180) / 360) * canvas.width;
        const y = ((90 - lat) / 180) * canvas.height;
        return [x, y];
      };

      const yearFactor = Math.min(1, Math.max(0, (year - 2010) / 16));

      if (layer === 'temperature') {
        const heatSpots: [number, number, number][] = [
          [28.6, 77.2, 140 + yearFactor * 60],
          [35.6, 139.6, 90 + yearFactor * 40],
          [36.7, -119.8, 110 + yearFactor * 50],
          [13.0, 14.5, 120 + yearFactor * 50],
        ];
        heatSpots.forEach(([lat, lng, radius]) => {
          const [cx, cy] = project(lat, lng);
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
          grad.addColorStop(0, 'rgba(255, 80, 80, 0.75)');
          grad.addColorStop(0.4, 'rgba(255, 180, 40, 0.45)');
          grad.addColorStop(0.8, 'rgba(255, 230, 80, 0.15)');
          grad.addColorStop(1, 'rgba(255, 80, 80, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (layer === 'green_cover') {
        const greenSpots: [number, number, number][] = [
          [-3.46, -62.2, 280 - yearFactor * 50],
          [51.9, 4.5, 120 - yearFactor * 20],
          [28.6, 77.2, 90 - yearFactor * 35],
        ];
        greenSpots.forEach(([lat, lng, radius]) => {
          const [cx, cy] = project(lat, lng);
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
          grad.addColorStop(0, 'rgba(39, 201, 138, 0.8)');
          grad.addColorStop(0.5, 'rgba(117, 214, 106, 0.4)');
          grad.addColorStop(1, 'rgba(39, 201, 138, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (layer === 'air_quality') {
        const [cx, cy] = project(28.6, 77.2);
        const grad = ctx.createRadialGradient(cx, cy, 15, cx, cy, 180 + yearFactor * 40);
        grad.addColorStop(0, 'rgba(155, 124, 255, 0.85)');
        grad.addColorStop(0.5, 'rgba(255, 107, 107, 0.35)');
        grad.addColorStop(1, 'rgba(155, 124, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, 180 + yearFactor * 40, 0, Math.PI * 2);
        ctx.fill();
      } else if (layer === 'water' || layer === 'flood') {
        const floodSpots: [number, number, number][] = [
          [51.9, 4.5, 140],
          [13.0, 14.5, 100 - yearFactor * 40],
          [28.6, 77.2, 130 + yearFactor * 30],
        ];
        floodSpots.forEach(([lat, lng, radius]) => {
          const [cx, cy] = project(lat, lng);
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
          grad.addColorStop(0, 'rgba(24, 200, 200, 0.8)');
          grad.addColorStop(0.6, 'rgba(79, 168, 255, 0.35)');
          grad.addColorStop(1, 'rgba(24, 200, 200, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (layer === 'urbanization') {
        const urbanCenters: [number, number, number][] = [
          [35.6, 139.6, 80 + yearFactor * 30],
          [28.6, 77.2, 100 + yearFactor * 50],
          [36.7, -119.8, 70 + yearFactor * 25],
        ];
        urbanCenters.forEach(([lat, lng, radius]) => {
          const [cx, cy] = project(lat, lng);
          const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius);
          grad.addColorStop(0, 'rgba(255, 209, 102, 0.85)');
          grad.addColorStop(0.5, 'rgba(255, 107, 107, 0.3)');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (layer === 'drought') {
        const droughtSpots: [number, number, number][] = [
          [13.0, 14.5, 170 + yearFactor * 60],
          [36.7, -119.8, 140 + yearFactor * 45],
          [28.6, 77.2, 110 + yearFactor * 40],
        ];
        droughtSpots.forEach(([lat, lng, radius]) => {
          const [cx, cy] = project(lat, lng);
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
          grad.addColorStop(0, 'rgba(235, 140, 52, 0.85)');
          grad.addColorStop(0.5, 'rgba(212, 100, 20, 0.4)');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (layer === 'wildfire') {
        const fireSpots: [number, number, number][] = [
          [-3.46, -62.2, 190 + yearFactor * 70],
          [36.7, -119.8, 130 + yearFactor * 50],
        ];
        fireSpots.forEach(([lat, lng, radius]) => {
          const [cx, cy] = project(lat, lng);
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
          grad.addColorStop(0, 'rgba(255, 60, 20, 0.9)');
          grad.addColorStop(0.4, 'rgba(255, 165, 0, 0.5)');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (layer === 'rainfall') {
        const rainSpots: [number, number, number][] = [
          [28.6, 77.2, 180],
          [51.9, 4.5, 120],
          [-3.46, -62.2, 220],
        ];
        rainSpots.forEach(([lat, lng, radius]) => {
          const [cx, cy] = project(lat, lng);
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
          grad.addColorStop(0, 'rgba(40, 160, 255, 0.8)');
          grad.addColorStop(0.6, 'rgba(24, 200, 200, 0.35)');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (layer === 'waste') {
        const wasteSpots: [number, number, number][] = [
          [28.6, 77.2, 120 + yearFactor * 40],
          [35.6, 139.6, 70],
        ];
        wasteSpots.forEach(([lat, lng, radius]) => {
          const [cx, cy] = project(lat, lng);
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
          grad.addColorStop(0, 'rgba(220, 100, 180, 0.85)');
          grad.addColorStop(0.5, 'rgba(180, 70, 150, 0.35)');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Composite Health Index
        hotspots.forEach((spot) => {
          const [cx, cy] = project(spot.coordinates.lat, spot.coordinates.lng);
          const isHealthy = spot.currentMetrics.environmentalHealth >= 70;
          const color = isHealthy ? 'rgba(39, 201, 138,' : 'rgba(255, 107, 107,';
          const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 90);
          grad.addColorStop(0, `${color} 0.7)`);
          grad.addColorStop(0.6, `${color} 0.25)`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, 90, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    },
    [hotspots]
  );

  // Reset Camera & Orientation
  const handleResetView = () => {
    targetRotationRef.current = { x: 0.22, y: 0 };
    cameraDistanceRef.current = defaultDist;
    if (cameraRef.current) {
      cameraRef.current.position.z = defaultDist;
    }
  };

  // Toggle Fullscreen Mode (Feature 010)
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Initialize Scene, Real Earth Textures, Shaders & Grids
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGlError(true);
        return;
      }
    } catch {
      setHasWebGlError(true);
      return;
    }

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(config.cameraFov, width / height, 0.1, 1000);
    camera.position.z = cameraDistanceRef.current;
    cameraRef.current = camera;

    // 2. High-Performance ACES Filmic Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Earth Group (Rotational tilt 23.5°)
    const earthGroup = new THREE.Group();
    earthGroup.rotation.x = 0.22;
    scene.add(earthGroup);
    earthGroupRef.current = earthGroup;

    // 4. Directional Sunlight vector
    const sunDirection = new THREE.Vector3(5, 3, 5).normalize();

    // 5. Texture Loading Manager
    const textureLoader = new THREE.TextureLoader();
    let loadedCount = 0;
    const totalTextures = 5;

    const onTextureLoad = () => {
      loadedCount++;
      const progress = Math.round((loadedCount / totalTextures) * 100);
      setLoadingProgress(progress);
      if (loadedCount >= totalTextures) {
        setIsLoaded(true);
      }
    };

    const dayTexture = textureLoader.load('/assets/earth/earth_day.jpg', onTextureLoad);
    const nightTexture = textureLoader.load('/assets/earth/earth_night.jpg', onTextureLoad);
    const specularTexture = textureLoader.load('/assets/earth/earth_specular.jpg', onTextureLoad);
    const normalTexture = textureLoader.load('/assets/earth/earth_normal.jpg', onTextureLoad);
    const cloudsTexture = textureLoader.load('/assets/earth/earth_clouds.png', onTextureLoad);

    dayTexture.wrapS = THREE.RepeatWrapping;
    nightTexture.wrapS = THREE.RepeatWrapping;
    specularTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapS = THREE.RepeatWrapping;
    cloudsTexture.wrapS = THREE.RepeatWrapping;

    // 6. Photorealistic Real Earth Material (Day / Night Terminator Shader)
    const earthRadius = 0.92;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);

    const earthShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uDayTexture: { value: dayTexture },
        uNightTexture: { value: nightTexture },
        uSpecularTexture: { value: specularTexture },
        uSunDirection: { value: sunDirection },
        uShowNightLights: { value: showNightLights && config.showNightLights },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D uDayTexture;
        uniform sampler2D uNightTexture;
        uniform sampler2D uSpecularTexture;
        uniform vec3 uSunDirection;
        uniform bool uShowNightLights;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(uSunDirection);

          float sunDot = dot(normal, sunDir);

          vec4 dayColor = texture2D(uDayTexture, vUv);
          vec4 nightColor = texture2D(uNightTexture, vUv);
          vec4 specColor = texture2D(uSpecularTexture, vUv);

          float dayLight = clamp(sunDot, 0.0, 1.0);
          vec3 ambient = vec3(0.06, 0.09, 0.14) * dayColor.rgb;
          vec3 diffuse = dayColor.rgb * dayLight * 1.25;

          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          vec3 halfVector = normalize(sunDir + viewDir);
          float specIntensity = pow(max(dot(normal, halfVector), 0.0), 32.0);
          vec3 specular = vec3(0.85, 0.95, 1.0) * specIntensity * specColor.r * 0.65;

          float nightFactor = smoothstep(0.08, -0.25, sunDot);
          vec3 nightLights = uShowNightLights ? nightColor.rgb * nightFactor * 1.6 : vec3(0.0);

          vec3 finalColor = ambient + diffuse + specular + nightLights;
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthShaderMaterial);
    earthGroup.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // 7. Transparent Cloud Layer Sphere
    if (showClouds && config.showClouds) {
      const cloudGeometry = new THREE.SphereGeometry(earthRadius * 1.015, 64, 64);
      const cloudMaterial = new THREE.MeshStandardMaterial({
        map: cloudsTexture,
        transparent: true,
        opacity: config.cloudOpacity,
        blending: THREE.AdditiveBlending,
      });
      const cloudsMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
      earthGroup.add(cloudsMesh);
      cloudsMeshRef.current = cloudsMesh;
    }

    // 8. Dedicated Environmental Overlay Sphere
    if (showEnvironmentalOverlay) {
      const overlayGeo = new THREE.SphereGeometry(earthRadius * 1.008, 64, 64);
      const overlayTex = createEnvironmentalOverlayTexture(activeLayer, selectedYear);
      overlayTextureRef.current = overlayTex;

      const overlayMat = new THREE.MeshBasicMaterial({
        map: overlayTex,
        transparent: true,
        opacity: config.overlayOpacity,
        blending: THREE.NormalBlending,
        depthWrite: false,
      });
      const overlayMesh = new THREE.Mesh(overlayGeo, overlayMat);
      earthGroup.add(overlayMesh);
      overlayMeshRef.current = overlayMesh;
    }

    // 9. Coordinate Grids (Features 014-017: Latitude, Longitude, Equator)
    if (config.showCoordinateGrid) {
      const gridGroup = new THREE.Group();
      earthGroup.add(gridGroup);
      gridGroupRef.current = gridGroup;

      // Latitude Parallels (-60, -30, 0, 30, 60)
      [-60, -30, 0, 30, 60].forEach((lat) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const r = earthRadius * 1.003 * Math.sin(phi);
        const y = earthRadius * 1.003 * Math.cos(phi);
        const segments = 64;
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          pts.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
        }
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        const isEquator = lat === 0;
        const mat = new THREE.LineBasicMaterial({
          color: isEquator && config.showEquatorLine ? 0x18c8c8 : 0x4fa8ff,
          transparent: true,
          opacity: isEquator ? 0.5 : 0.16,
        });
        const line = new THREE.Line(geom, mat);
        gridGroup.add(line);
      });

      // Longitude Meridians (every 45 degrees)
      [0, 45, 90, 135, 180, 225, 270, 315].forEach((lng) => {
        const theta = (lng + 180) * (Math.PI / 180);
        const segments = 48;
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= segments; i++) {
          const phi = (i / segments) * Math.PI;
          const r = earthRadius * 1.003 * Math.sin(phi);
          const y = earthRadius * 1.003 * Math.cos(phi);
          const x = -r * Math.cos(theta);
          const z = r * Math.sin(theta);
          pts.push(new THREE.Vector3(x, y, z));
        }
        const geom = new THREE.BufferGeometry().setFromPoints(pts);
        const isPrime = lng === 0;
        const mat = new THREE.LineBasicMaterial({
          color: isPrime && config.showPrimeMeridian ? 0x9b7cff : 0x4fa8ff,
          transparent: true,
          opacity: isPrime ? 0.45 : 0.14,
        });
        const line = new THREE.Line(geom, mat);
        gridGroup.add(line);
      });
    }

    // 10. Atmospheric Rim (Fresnel Scattering Shell)
    if (showAtmosphere && config.showAtmosphere) {
      const atmosphereGeo = new THREE.SphereGeometry(earthRadius * 1.12, 64, 64);
      const atmosphereMat = new THREE.ShaderMaterial({
        uniforms: {
          uSunDirection: { value: sunDirection },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: `
          uniform vec3 uSunDirection;
          varying vec3 vNormal;
          varying vec3 vWorldPosition;

          void main() {
            vec3 normal = normalize(vNormal);
            float rim = pow(0.7 - dot(normal, vec3(0.0, 0.0, 1.0)), 2.8);
            vec3 atmosphereColor = mix(vec3(0.12, 0.65, 0.95), vec3(0.15, 0.85, 0.85), rim);
            gl_FragColor = vec4(atmosphereColor, rim * 0.85);
          }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      });
      const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
      scene.add(atmosphereMesh);
      atmosphereMeshRef.current = atmosphereMesh;
    }

    // 11. Orbital Particle Field
    const particleCount = config.particleFieldDensity;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = earthRadius * (1.25 + Math.random() * 0.5);
      particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = r * Math.cos(phi);
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4fa8ff,
      size: 0.015,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 12. Hotspots Group with Breathing Beacons
    if (showHotspots && hotspots.length > 0) {
      const markersGroup = new THREE.Group();
      earthGroup.add(markersGroup);
      markersGroupRef.current = markersGroup;

      hotspots.forEach((spot) => {
        const pos = latLngToVector3(spot.coordinates.lat, spot.coordinates.lng, earthRadius * 1.018);
        const isSelected = selectedHotspot?.id === spot.id;

        const pinGeom = new THREE.SphereGeometry(0.022, 16, 16);
        const pinMat = new THREE.MeshBasicMaterial({
          color: isSelected ? 0x27c98a : 0x18c8c8,
        });
        const pin = new THREE.Mesh(pinGeom, pinMat);
        pin.position.copy(pos);
        pin.userData = { hotspot: spot };
        markersGroup.add(pin);

        const ringGeom = new THREE.RingGeometry(0.026, 0.042, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: isSelected ? 0x27c98a : 0x9b7cff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.position.copy(pos.clone().multiplyScalar(1.002));
        ring.lookAt(new THREE.Vector3(0, 0, 0));
        pin.add(ring);
      });
    }

    // 13. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, config.ambientLightIntensity);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, config.sunlightIntensity);
    sunLight.position.copy(sunDirection.clone().multiplyScalar(5));
    scene.add(sunLight);

    // 14. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 15. Wheel Zoom
    const handleWheel = (e: WheelEvent) => {
      if (!interactive || !cameraRef.current) return;
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.0015;
      cameraDistanceRef.current = THREE.MathUtils.clamp(
        cameraDistanceRef.current + zoomDelta,
        1.55,
        3.6
      );
      cameraRef.current.position.z = cameraDistanceRef.current;
    };
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 16. Animation Loop
    const clock = new THREE.Clock();
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (earthGroupRef.current) {
        if (targetRotationRef.current) {
          earthGroupRef.current.rotation.y += (targetRotationRef.current.y - earthGroupRef.current.rotation.y) * 0.06;
          earthGroupRef.current.rotation.x += (targetRotationRef.current.x - earthGroupRef.current.rotation.x) * 0.06;
          if (
            Math.abs(targetRotationRef.current.y - earthGroupRef.current.rotation.y) < 0.001 &&
            Math.abs(targetRotationRef.current.x - earthGroupRef.current.rotation.x) < 0.001
          ) {
            targetRotationRef.current = null;
          }
        } else if (!isDraggingRef.current && isRotating) {
          earthGroupRef.current.rotation.y += effectiveRotateSpeed;
        }
      }

      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += config.cloudDriftSpeed;
      }

      if (markersGroupRef.current) {
        markersGroupRef.current.children.forEach((child) => {
          if (child.children.length > 0) {
            const ring = child.children[0] as THREE.Mesh;
            const scale = 1.0 + Math.sin(time * 3.5) * 0.28;
            ring.scale.set(scale, scale, 1);
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('wheel', handleWheel);
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [
    activeLayer,
    effectiveRotateSpeed,
    createEnvironmentalOverlayTexture,
    hotspots,
    interactive,
    latLngToVector3,
    mode,
    selectedHotspot,
    selectedYear,
    showAtmosphere,
    showClouds,
    showEnvironmentalOverlay,
    showHotspots,
    showNightLights,
    isRotating,
    config,
  ]);

  // Update overlay texture dynamically
  useEffect(() => {
    if (!overlayMeshRef.current || !showEnvironmentalOverlay) return;
    const newTex = createEnvironmentalOverlayTexture(activeLayer, selectedYear);
    (overlayMeshRef.current.material as THREE.MeshBasicMaterial).map = newTex;
    (overlayMeshRef.current.material as THREE.MeshBasicMaterial).needsUpdate = true;
    overlayTextureRef.current = newTex;
  }, [activeLayer, selectedYear, createEnvironmentalOverlayTexture, showEnvironmentalOverlay]);

  // Rotate to selected hotspot
  useEffect(() => {
    if (!selectedHotspot || !earthGroupRef.current) return;
    const targetY = -((selectedHotspot.coordinates.lng + 90) * (Math.PI / 180));
    const targetX = (selectedHotspot.coordinates.lat - 15) * (Math.PI / 180);
    targetRotationRef.current = { x: targetX, y: targetY };
  }, [selectedHotspot]);

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    targetRotationRef.current = null;
    previousMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !earthGroupRef.current) return;

    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePosRef.current.x;
      const deltaY = e.clientY - previousMousePosRef.current.y;
      earthGroupRef.current.rotation.y += deltaX * 0.005;
      earthGroupRef.current.rotation.x += deltaY * 0.005;
      previousMousePosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Track geographic coordinates on sphere surface (Feature 018)
    if (earthMeshRef.current) {
      const earthIntersects = raycaster.intersectObject(earthMeshRef.current, false);
      if (earthIntersects.length > 0 && earthIntersects[0].point) {
        const p = earthIntersects[0].point.clone();
        // Invert Earth group rotation to get local sphere coordinates
        p.applyEuler(new THREE.Euler(-earthGroupRef.current.rotation.x, -earthGroupRef.current.rotation.y, 0, 'YXZ'));
        const r = p.length();
        const lat = 90 - (Math.acos(p.y / r) * 180) / Math.PI;
        const lng = ((Math.atan2(p.z, -p.x) * 180) / Math.PI) - 180;
        setCursorCoords({
          lat: Math.round(lat * 100) / 100,
          lng: Math.round(lng * 100) / 100,
        });
      } else {
        setCursorCoords(null);
      }
    }

    if (markersGroupRef.current) {
      const intersects = raycaster.intersectObjects(markersGroupRef.current.children, false);
      if (intersects.length > 0) {
        const spot = intersects[0].object.userData.hotspot as EnvironmentalHotspot;
        setHoveredHotspot(spot);
        setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        mountRef.current.style.cursor = 'pointer';
        return;
      }
    }
    setHoveredHotspot(null);
    setTooltipPos(null);
    if (mountRef.current) {
      mountRef.current.style.cursor = interactive ? 'grab' : 'default';
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !markersGroupRef.current || !onSelectHotspot) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(markersGroupRef.current.children, false);
    if (intersects.length > 0) {
      const spot = intersects[0].object.userData.hotspot as EnvironmentalHotspot;
      onSelectHotspot(spot);
    }
  };

  if (hasWebGlError) {
    return (
      <div className={`relative flex flex-col items-center justify-center p-8 rounded-3xl glass-panel-2 ${className}`}>
        <div className="w-72 h-72 rounded-full overflow-hidden border-2 border-earth-aqua/40 shadow-[0_0_40px_rgba(24,200,200,0.3)] relative">
          <img
            src="/assets/earth/earth_fallback.jpg"
            alt="Photorealistic Earth Digital Twin"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/80 via-transparent to-transparent flex flex-col items-center justify-end pb-4">
            <span className="text-xs font-mono font-bold text-earth-aqua">EARTHMIND REAL EARTH</span>
            <span className="text-[10px] text-slate-400">2D Satellite Twin Active</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setCursorCoords(null);
        }}
        onClick={handleClick}
        className="w-full h-full min-h-[460px] cursor-grab active:cursor-grabbing"
      />

      {/* Floating Viewport Quick Controls (Top-Right) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 glass-panel-2 p-1.5 rounded-xl border border-white/10 shadow-lg backdrop-blur-md">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            isRotating ? 'text-earth-aqua bg-earth-aqua/15' : 'text-slate-400 hover:text-white'
          }`}
          title={isRotating ? 'Pause Earth Rotation' : 'Resume Auto-Rotate'}
        >
          {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={handleResetView}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Reset Camera & Angle (Feature 009)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => updateConfig({ showCoordinateGrid: !config.showCoordinateGrid })}
          className={`p-1.5 rounded-lg text-xs transition-colors ${
            config.showCoordinateGrid ? 'text-earth-emerald bg-earth-emerald/15' : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Latitude/Longitude Grid Lines (Features 014-017)"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleToggleFullscreen}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Globe (Feature 010)'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Texture Loading Experience */}
      {!isLoaded && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-[#071A2B]/85 backdrop-blur-md transition-opacity duration-300">
          <EarthMindLoading 
            progress={loadingProgress}
            statusText="INITIALIZING PLANETARY OS..."
            subText="Calibrating NASA Blue Marble & Remote Sensors"
            size="sm"
          />
        </div>
      )}

      {/* Floating Hotspot Hover Tooltip */}
      {hoveredHotspot && tooltipPos && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="glass-panel-3 px-3.5 py-2.5 rounded-xl border border-earth-aqua/40 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-earth-emerald animate-ping" />
              <div className="text-xs font-bold text-white tracking-wide">{hoveredHotspot.name}</div>
            </div>
            <div className="text-[11px] text-slate-300 font-mono mt-0.5">
              Health: <span className="text-earth-emerald font-semibold">{hoveredHotspot.currentMetrics.environmentalHealth}</span>/100 • {hoveredHotspot.primaryRisk}
            </div>
            <div className="text-[10px] text-earth-aqua/90 mt-1 flex items-center gap-1 font-medium">
              <span>Click to inspect telemetry</span> →
            </div>
          </div>
        </div>
      )}

      {/* Active Layer & Scientific Attribution Badge (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex flex-col gap-1.5">
        <div className="glass-panel-1 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-earth-aqua animate-pulse" />
          <span className="uppercase tracking-wider text-[10px] text-slate-400 font-mono">
            {mode === 'memory' ? `EPOCH ${selectedYear}:` : 'PLANETARY OVERLAY:'}
          </span>
          <span className="font-semibold text-white capitalize">{activeLayer.replace('_', ' ')}</span>
        </div>

        {/* Live Geographic Coordinates Readout (Feature 018) */}
        {cursorCoords && (
          <div className="glass-panel-1 px-2.5 py-1 rounded border border-white/5 text-[10px] font-mono text-slate-300 flex items-center gap-2">
            <Compass className="w-3 h-3 text-earth-aqua" />
            <span>{Math.abs(cursorCoords.lat)}° {cursorCoords.lat >= 0 ? 'N' : 'S'}, {Math.abs(cursorCoords.lng)}° {cursorCoords.lng >= 0 ? 'E' : 'W'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-[9px] text-earth-leaf">NASA/SRTM</span>
          </div>
        )}

        <div className="text-[9px] font-mono text-slate-400 pl-1 hidden sm:block">
          Public Scientific Imagery • ESA Sentinel-2 / NASA Blue Marble
        </div>
      </div>
    </div>
  );
};
