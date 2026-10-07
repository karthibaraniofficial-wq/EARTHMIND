/**
 * EARTHMIND - Voice Subsystem Telemetry & Real-Time Diagnostics
 * Full operational diagnostic metrics conforming to Science Expo 2026 specs.
 */

import { getGeminiLiveModel, getGeminiResearchModel } from '../config/aiModels';

export interface DiagnosticsSnapshot {
  geminiLiveStatus: 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED' | 'ERROR';
  voiceEngine: 'LIVE' | 'DETERMINISTIC_FALLBACK';
  liveModel: string;
  researchModel: string;
  webSearchStatus: 'AVAILABLE' | 'OFFLINE';
  urlResearchStatus: 'AVAILABLE' | 'OFFLINE';
  toolsRegisteredCount: number;
  micStatus: 'READY' | 'ACTIVE' | 'MUTED' | 'DENIED';
  speakerStatus: 'READY' | 'PLAYING';
  bargeInEnabled: boolean;
  webSourcesAvailable: boolean;
  citationsEnabled: boolean;
  fallbackReady: boolean;
  roundtripLatencyMs: number;
  packetCount: number;
}

export class VoiceDiagnostics {
  private static status: DiagnosticsSnapshot = {
    geminiLiveStatus: 'DISCONNECTED',
    voiceEngine: 'LIVE',
    liveModel: getGeminiLiveModel(),
    researchModel: getGeminiResearchModel(),
    webSearchStatus: 'AVAILABLE',
    urlResearchStatus: 'AVAILABLE',
    toolsRegisteredCount: 28,
    micStatus: 'READY',
    speakerStatus: 'READY',
    bargeInEnabled: true,
    webSourcesAvailable: true,
    citationsEnabled: true,
    fallbackReady: true,
    roundtripLatencyMs: 0,
    packetCount: 0,
  };

  public static getSnapshot(): DiagnosticsSnapshot {
    return {
      ...this.status,
      liveModel: getGeminiLiveModel(),
      researchModel: getGeminiResearchModel(),
    };
  }

  public static update(patch: Partial<DiagnosticsSnapshot>): void {
    this.status = {
      ...this.status,
      ...patch,
    };
  }

  public static recordPacket(): void {
    this.status.packetCount++;
  }

  public static setLatency(ms: number): void {
    this.status.roundtripLatencyMs = ms;
  }
}
