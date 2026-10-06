# EARTHMIND

> **Planetary Environmental Intelligence Operating System**  
> *Explore Earth's Past. Understand Its Present. Simulate Its Future.*  
> Science Expo 2026 Edition

[![Production Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Google Gemini Live](https://img.shields.io/badge/AI-Gemini%202.0%20Live-4285F4.svg)]()
[![Three.js](https://img.shields.io/badge/3D-Three.js%20Photorealistic%20Globe-black.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()

---

## 1. Overview

**EARTHMIND** is an enterprise-grade planetary environmental intelligence platform and interactive operating system designed for environmental scientists, climate policymakers, educators, and exhibition audiences. 

The platform merges real-world biophysical observation data with real-time what-if simulations, interactive 3D geospatial visualization, and a multimodal voice intelligence layer powered by **Google Gemini 2.0 Live**.

---

## 2. Key Features

- **Photorealistic 3D Earth Visualization**: High-resolution atmospheric scattering, cloud dynamics, day/night terminators, and 3D terrain elevation rendering powered by Three.js and custom GLSL shaders.
- **Biophysical Layer Matrix**: 11 real-world planetary observation layers (Vegetation Cover / NDVI, Urbanization Index, Land Surface Temperature, Air Quality Index / PM2.5, Water Table Stress, Flood Risk, Drought Index, Wildfire Frequency, Precipitation Anomalies, Environmental Health Score).
- **Interactive "What If" Counterfactual Simulator**: Real-time biophysical feedback loops exploring climate scenarios (tree cover expansion, urban density modulation, industrial emissions regulation, renewable transition rates, water conservation policies).
- **Universal Voice Intelligence (Google Gemini 2.0 Live)**:
  - Real-time bidirectional voice conversation with natural speech.
  - Native 16kHz linear16 PCM audio capture and 24kHz audio playback.
  - Sub-second latency with speech interruption (barge-in) and buffer flushing.
  - 24 registered function-calling tools executing real application state changes.
  - Multi-language voice support (English, Tamil, Hindi, and colloquial mixed phrases).
- **Environmental Council & Policy Advisory**: Policy recommendation engine evaluating economic trade-offs, ecological ROI, and implementation feasibility across municipal and global jurisdictions.
- **Scientific Evidence Audit & Provenance**: Strict labeling and segregation of `OBSERVED`, `MODELLED`, `SIMULATED`, `ESTIMATED`, and `PROJECTED` datasets.
- **Automated Intelligence Reporting**: One-click generation of planetary audit reports with biophysical deltas, risk assessment matrices, and scenario comparisons.

---

## 3. Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        EARTHMIND CLIENT (SPA)                         │
├──────────────────┬──────────────────┬──────────────────┬───────────────┤
│ 3D Real Earth    │ Biophysical      │ Voice Assistant  │ Policy &      │
│ Three.js Globe   │ Layer Engine     │ UI & Waveform    │ Council View  │
└────────┬─────────┴────────┬─────────┴────────┬─────────┴───────┬───────┘
         │                  │                  │                 │
         └──────────────────┼──────────────────┼─────────────────┘
                            ▼                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 EARTHMIND CONTEXT & ACTION ENGINE                     │
│  - Biophysical State Sync          - 24 Tool Call Dispatchers          │
│  - Scenario Parameter Deltas       - Deterministic Offline Fallback    │
└───────────────────────────┬────────────────────────────────────────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
┌───────────────────────────────┐ ┌──────────────────────────────────────┐
│  LOCAL DEVELOPMENT GATEWAY    │ │   PRODUCTION VERCEL DEPLOYMENT       │
│  - Vite Server Proxy          │ │   - Global Edge CDN (dist/)          │
│  - ws:///api/gemini/live      │ │   - /api/health/ai Serverless Func   │
│  - Secure Upstream Forwarding │ │   - Configurable External Gateway    │
└──────────────┬────────────────┘ └──────────────┬───────────────────────┘
               │                                 │
               └────────────────┬────────────────┘
                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│             GOOGLE GEMINI 2.0 MULTIMODAL LIVE SERVICE                 │
│  - BidiGenerateContent WebSocket                                       │
│  - Bidirectional 16kHz / 24kHz Native Streaming Audio                  │
│  - Real-time Function Calling Protocol                                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Tech Stack

- **Frontend Core**: React 18, TypeScript 5.9, Vite 5
- **Styling & UI**: Tailwind CSS, Lucide Icons, Glassmorphism design system
- **3D Geospatial Engine**: Three.js, Custom WebGL Shaders, Orbit Controls
- **Voice Intelligence**: Google Gemini 2.0 Multimodal Live API (`gemini-2.0-flash-exp`)
- **Audio Pipeline**: Web Audio API (16kHz AudioWorklet/ScriptProcessor capture, 24kHz Linear PCM playback scheduler)
- **Deployment & Serverless**: Vercel (Edge CDN + Node Serverless API Functions)

---

## 5. Local Development

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/karthibaraniofficial-wq/EARTHMIND.git
cd EARTHMIND

# Install dependencies
npm install
```

### Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Populate your Google Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### Running Locally
```bash
# Start development server with live Gemini gateway
npm run dev

# Run automated voice & Gemini tool verification suite (20 tests)
npm run test:voice

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 6. Environment Variables

| Variable | Scope | Description |
|---|---|---|
| `GEMINI_API_KEY` | **Server-side only** | Google AI Studio API key for Gemini 2.0 Live voice pipeline. **Never exposed to browser.** |
| `VITE_GEMINI_LIVE_GATEWAY_URL` | Client optional | Optional external WebSocket URL for dedicated cloud gateways (e.g. `wss://gateway.yourdomain.com/api/gemini/live`). |
| `VITE_APP_NAME` | Client public | Application branding name (`EARTHMIND`). |
| `VITE_EXPO_EDITION` | Client public | Science exhibition release edition string. |

---

## 7. Gemini Live Architecture & Security

1. **Zero Client Secret Exposure**:
   - `GEMINI_API_KEY` is strictly confined to server-side environments (`process.env.GEMINI_API_KEY`).
   - Vite client builds, React components, and browser devtools never touch the permanent secret.
2. **Dynamic Server Gateway**:
   - During local execution, the Vite development gateway proxies audio streams directly to Google Generative Language endpoints without exposing credentials.
   - For serverless production deployments (Vercel), health diagnostic checks run through `/api/health/ai`.
3. **Resilient Local Fallback**:
   - If an API key is unconfigured, if network connectivity drops, or if external cloud endpoints fail, EARTHMIND's dual-mode voice engine immediately engages a deterministic offline speech recognition and synthesis pipeline.

---

## 8. Deployment & Vercel Setup

EARTHMIND is configured for native deployment on **Vercel**:

1. **Import Repository**:
   - Import `karthibaraniofficial-wq/EARTHMIND` in your Vercel Dashboard.
2. **Framework Preset**:
   - Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. **Environment Variables**:
   - In Vercel Project Settings → Environment Variables:
     - `GEMINI_API_KEY`: Enter your Google Gemini API key.
     - *(Optional)* `VITE_GEMINI_LIVE_GATEWAY_URL`: Provide your external persistent gateway URL if utilizing external WebSocket clustering.
4. **Deploy**:
   - Trigger deployment on branch `main`.

---

## 9. Scientific Data Disclaimer

All planetary metrics rendered within EARTHMIND are categorized into explicit scientific data classes:
- **`OBSERVED`**: Real-world satellite instrument readings and validated sensor datasets.
- **`MODELLED`**: IPCC Shared Socioeconomic Pathway (SSP) and climate consensus mathematical projections.
- **`SIMULATED`**: User-driven what-if counterfactual sandbox scenarios designed for educational and policy inquiry.

Simulated outcomes represent biophysical sandbox scenarios and must not be interpreted as deterministic operational forecasts.

---

## 10. Project Structure

```text
EARTHMIND/
├── api/                   # Vercel serverless function endpoints (/api/health/ai)
├── public/                # Static public assets, textures, and geo-data
├── scripts/               # Test suites and offline verification scripts
├── src/
│   ├── components/        # Reusable UI widgets, panels, and audio meters
│   ├── domains/           # Domain submodules (Council, Simulation, Hotspots)
│   ├── lib/
│   │   └── gemini/        # Google Gemini Live client, audio, tools, and context engine
│   ├── types/             # Centralized TypeScript definitions
│   └── voice/             # Dual-mode voice intelligence engine & intent routers
├── .env.example           # Environment template (placeholders only)
├── .gitignore             # Git ignore rules protecting secrets and caches
├── package.json           # Dependencies and build scripts
├── vercel.json            # Vercel SPA routing and serverless function rules
└── vite.config.ts         # Vite build configuration and secure dev gateway
```

---

## 11. Verification & Testing

Verify system integrity anytime using the built-in test suite:
```bash
npm run test:voice
```
Runs 20 automated tests validating:
- 14 Voice intent recognition patterns (including Tamil & Thanglish natural language).
- 24 Gemini tool declarations and schema constraints.
- Biophysical context generation and state serialization.
- Live tool execution and sandbox state mutation.

---

## 12. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
