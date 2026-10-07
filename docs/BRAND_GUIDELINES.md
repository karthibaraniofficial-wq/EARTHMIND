# EARTHMIND Brand Identity & Visual Guidelines
*Planetary Environmental Intelligence Operating System*
*Version 4.0 — Science Expo 2026 Edition*

---

## 01. Brand Thesis & Philosophy

EARTHMIND represents the confluence of **Empirical Earth Observation** and **Multimodal Artificial Intelligence**.

The visual identity is engineered to communicate:

$$\text{EARTH} + \text{INTELLIGENCE} + \text{ENVIRONMENT} + \text{DIGITAL TWIN} + \text{SCIENCE} + \text{FUTURE}$$

It is deliberately distinguished from:
1. **Generic environmental icons** (e.g., standard green leaves or recycling arrows).
2. **Generic tech/AI startups** (e.g., gradient sparkle blobs, literal human brain graphics).
3. **Traditional enterprise software** (e.g., mundane flat dashboard badges).

The brand communicates **aerospace-grade scientific seriousness**, **planetary scale**, and **subtle futuristic intelligence**.

---

## 02. Logo Anatomy & Geometric Construction

The **EARTHMIND Symbol** is built upon a precision mathematical grid:

```text
                             [ North Sensor Polar Vertex ]
                                         (50, 18)
                                            ●
                                          / | \
                                       /    |    \
                                    /       |       \
               [ Back Orbital Arc ]         |         [ East Sensor Apex ]
                      (18, 36)              |               (79, 40)
                          ●                 |                  ●
                           \                |                 /
                            \       [ Planetary Core ]       /
                             \              ●               /
                              \          (50, 50)          /
                               \            |             /
                                \           |            /
                                 \          |           /
                                  \         |          /
                                   \        |         /
                                    ●-------●--------/
                         [ South Terrestrial Node ]
                                  (27, 72)
```

### Key Geometric Elements

1. **The Planetary Sphere ($R = 32\text{px}$)**:
   - Represents the physical Earth with custom radial atmospheric depth (`#0E3354` to `#071A2B`).
2. **The Inclined 3D Orbital Ring**:
   - Represents satellite remote sensing and digital twin observational coverage.
   - Passes behind the globe at a reduced opacity and dashes, then sweeps dynamically in front across the equator with gradient luminescence (`#18C8C8` &rarr; `#27C98A` &rarr; `#9B7CFF`).
3. **The Living Biosphere Meridian**:
   - A soft organic curvature linking the polar cap to the southern ocean, embodying biological life and hydrological flow.
4. **The Neural Intelligence Mesh**:
   - 4 discrete vertex nodes representing **Planetary Synthesis** (center), **Orbital Observation** (east), **Terrestrial In-Situ Data** (south-west), and **Atmospheric Telemetry** (north), connected by thin geodesic signal vectors.

---

## 03. Brand Color Architecture

All branding colors are derived from planetary physics, multispectral satellite sensors, and high-altitude atmospheric radiance:

| Color Name | Hex Code | RGB | Purpose / Meaning |
|:---|:---:|:---:|:---|
| **Deep Space Navy** | `#071A2B` | `rgb(7, 26, 43)` | Primary background substrate; represents deep space & ocean depth. |
| **Atmospheric Cyan** | `#18C8C8` | `rgb(24, 200, 200)` | Primary brand accent; represents the atmosphere, Rayleigh scattering & sensor data. |
| **Intelligence Emerald** | `#27C98A` | `rgb(39, 201, 138)` | Biosphere vitality; represents vegetative canopy, NDVI, and ecological resilience. |
| **Neural Aurora** | `#9B7CFF` | `rgb(155, 124, 255)` | Artificial intelligence; represents predictive reasoning and causal graphs. |
| **Hydrosphere Sky** | `#4FA8FF` | `rgb(79, 168, 255)` | Hydrological systems; represents freshwater aquifers and precipitation. |
| **Pure White** | `#FFFFFF` | `rgb(255, 255, 255)` | High-contrast typography, polar ice caps, and calibration nodes. |
| **Slate Gray** | `#94A3B8` | `rgb(148, 163, 184)` | Secondary telemetry typography and boundary axes. |

---

## 04. Official Vector Assets

All assets are located in the repository under [`public/brand/`](../public/brand/):

```text
public/brand/
├── earthmind-symbol.svg              # Primary Colored Symbol Mark
├── earthmind-symbol-white.svg        # Pure White Symbol Mark (for dark backgrounds)
├── earthmind-symbol-dark.svg         # Deep Navy Symbol Mark (for light backgrounds)
├── earthmind-symbol-monochrome.svg   # Neutral Outline Symbol Mark
├── earthmind-logo.svg                # Full Horizontal Logo (Symbol + Wordmark + Tagline)
├── earthmind-logo-white.svg          # Full Horizontal Logo (White Monochrome)
├── earthmind-logo-dark.svg           # Full Horizontal Logo (Dark Navy)
└── earthmind-logo-monochrome.svg     # Full Horizontal Logo (CurrentColor Stroke)
```

---

## 05. Wordmark Typography

### Primary Wordmark
```text
EARTHMIND
```
- **Typeface:** Plus Jakarta Sans / Inter / System Geometric Sans-Serif
- **Weight:** 800 (ExtraBold)
- **Letter Spacing:** `1.5px` (`0.06em`)
- **Hierarchy:** `EARTH` (`#FFFFFF` in dark mode / `#071A2B` in light mode) + `MIND` (`#18C8C8` in dark mode / `#0E8686` in light mode).

### Tagline
```text
PLANETARY ENVIRONMENTAL INTELLIGENCE
```
- **Typeface:** JetBrains Mono / SFMono-Regular / Monospace
- **Weight:** 600 (SemiBold)
- **Letter Spacing:** `2.2px` (`0.2em`)
- **Color:** `#94A3B8` (Slate 400)

---

## 06. Size & Clear Space Rules

### Clear Space ($X$)
The minimum clear space surrounding the logo is equal to the radius of the central planetary sphere ($X = 0.5 \times \text{Height}$ of symbol):

```text
    ┌──────────────────────────────────────────────┐
    │  X                                        X  │
    │     ┌───────┐                                │
    │  X  │   🌍   │   EARTHMIND               X  │
    │     └───────┘   PLANETARY INTELLIGENCE       │
    │  X                                        X  │
    └──────────────────────────────────────────────┘
```
No other graphic elements, typography, or UI card borders may intrude into this exclusion zone.

### Minimum Size Standards
- **Favicon & System Tray:** `16 × 16 px` &rarr; Use `earthmind-symbol.svg`
- **Navigation Bar / Header:** `24 × 24 px` &rarr; Use `earthmind-symbol.svg` or `32 × 32 px` with wordmark
- **Voice Orb Assistant:** `28 × 28 px` to `48 × 48 px` &rarr; Use reactive `EarthMindSymbol`
- **Report Headers & Hero Banners:** `48 × 48 px` to `72 × 72 px` &rarr; Use `earthmind-logo.svg`

---

## 07. Light vs. Dark Mode Usage

1. **Dark Surfaces (`#071A2B`, `#030D16`, Deep Space Glass):**
   - Always use the **Primary Colored Logo** (`earthmind-logo.svg` / `earthmind-symbol.svg`) or **White Logo** (`earthmind-logo-white.svg`).
2. **Light Surfaces (White Print, Export PDF, Light Backgrounds):**
   - Always use the **Dark Logo** (`earthmind-logo-dark.svg` / `earthmind-symbol-dark.svg`).
   - Never place the cyan-only logo on light gray without contrast verification.
3. **Monochrome Contexts (Terminal, Single-color print):**
   - Use `earthmind-logo-monochrome.svg` inheriting `currentColor`.

---

## 08. UI & Component Integration

The brand system is exposed as first-class React components in `src/branding/`:

```tsx
import { EarthMindLogo, EarthMindSymbol, EarthMindLoading } from '@/branding';

// 1. Navigation Bar (Full Logo)
<EarthMindLogo variant="full" size="md" badgeText="v4.0 OS" />

// 2. Collapsed Sidebar Rail (Symbol Only)
<EarthMindSymbol size="sm" variant="cyan" />

// 3. Hero Section (Large with animation)
<EarthMindLogo variant="stacked" size="xl" animated="pulse" showTagline />

// 4. Voice Intelligence Assistant Orb
<EarthMindSymbol
  size={28}
  variant={isSpeaking ? 'emerald' : isListening ? 'cyan' : 'primary'}
  animated={isThinking ? 'orbit' : isSpeaking ? 'pulse' : false}
/>

// 5. Texture & Telemetry Loading Screen
<EarthMindLoading progress={85} />
```

---

## 09. Incorrect Usage (Don'ts)

| Violation | Description |
|:---|:---|
| ❌ **Do NOT distort or stretch** | Always preserve the 1:1 aspect ratio of the planetary symbol. |
| ❌ **Do NOT use rainbow gradients** | Stick strictly to the Atmospheric Cyan, Intelligence Emerald, and Deep Navy palette. |
| ❌ **Do NOT replace with a stock leaf** | The symbol is a planetary-neural twin, not a garden club logo. |
| ❌ **Do NOT add drop shadows to text** | Use clean liquid glass backgrounds and subtle glow filters instead. |
| ❌ **Do NOT spin the logo endlessly** | Use orbital animations only during active state transitions (e.g. AI processing, texture loading). |

---

<div align="center">
<sub>EARTHMIND Brand Guidelines &bull; Proprietary Visual Standard &bull; Science Expo 2026 Edition</sub>
</div>
