# EARTHMIND: Architecture Decision Records (ADR)

## ADR-001: WebGL Three.js Digital Twin with Procedural Atmosphere Shader
- **Context**: The product requires a realistic, futuristic 3D Earth digital twin with responsive atmospheric glow, night lights, and dynamic overlay layers that run smoothly on normal student laptops.
- **Decision**: Implemented a procedural WebGL Three.js sphere with a custom vertex/fragment Fresnel shader for the atmospheric rim, a secondary cloud mesh rotating at a differential speed, and projected 3D Cartesian hotspot pins. Added a 2D CSS/SVG fallback mode if WebGL context fails.
- **Consequence**: Delivers a 60fps interactive globe with zero heavy external 3D asset downloads.

## ADR-002: Non-Linear Coupled Biophysical Simulation Engine
- **Context**: The core hero feature is the "WHAT IF?" simulator. Simulated numbers must feel scientifically credible, coupled, and reactive without making unsupported determinism claims.
- **Decision**: Built a mathematically coupled non-linear model in `SimulationEngine.ts`. Tree cover increases simultaneously cool microclimates (-0.55 per % canopy), attenuate flood surges (-0.42), and scrub particulate matter (-0.38), while rainfall increases trigger non-linear flash flood risk spikes that interact with urban impervious surface fractions.
- **Consequence**: Operators immediately see real-time reactive trade-offs when sliding levers.

## ADR-003: Standalone High-Performance SVG Icon Engine
- **Context**: Large monolithic icon packages like `lucide-react` had missing upstream chunks in partial installs on Windows, risking bundling bottlenecks.
- **Decision**: Created a zero-dependency SVG icon engine in `src/components/icons.tsx` and aliased `lucide-react` in `vite.config.ts`.
- **Consequence**: The production build compiles in seconds with zero external network dependencies and a lightweight bundle.

## ADR-004: Dual-Mode Platform Architecture (SaaS Mission Control + Science Expo Mode)
- **Context**: The project serves both as a startup-grade SaaS tool and as a Young Scientist '26 science exhibition presentation.
- **Decision**: Provided a global toggle between the complete SaaS Mission Control (Explorer, Memory, Forensics, Simulator, Scenarios, Reports, AI Assistant) and an academic slide-over Science Exhibition Mode designed specifically for judges.
