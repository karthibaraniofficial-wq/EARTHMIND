/**
 * EARTHMIND - Google Gemini Live Session Manager
 * Manages conversational session lifecycle, latency auditing, and transcript persistence.
 */

import { GeminiLiveConnectionStatus } from './GeminiEvents';
import { EarthMindContext } from './GeminiContext';

export interface ConversationTurn {
  id: string;
  role: 'user' | 'model' | 'tool';
  timestamp: string;
  content: string;
  toolCalls?: Array<{ name: string; args: any; result?: any }>;
  latencyMs?: number;
}

export interface SessionMetrics {
  totalTurns: number;
  totalAudioPacketsSent: number;
  totalAudioPacketsReceived: number;
  totalToolCalls: number;
  averageLatencyMs: number;
  lastLatencyMs: number;
}

export class GeminiVoiceSession {
  public id: string;
  public startedAt: string;
  public endedAt: string | null = null;
  public status: GeminiLiveConnectionStatus = 'DISCONNECTED';
  public lastKnownContext: EarthMindContext | null = null;
  public history: ConversationTurn[] = [];
  public metrics: SessionMetrics = {
    totalTurns: 0,
    totalAudioPacketsSent: 0,
    totalAudioPacketsReceived: 0,
    totalToolCalls: 0,
    averageLatencyMs: 0,
    lastLatencyMs: 0,
  };

  private latencySamples: number[] = [];

  constructor() {
    this.id = `gemini-live-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.startedAt = new Date().toISOString();
  }

  public recordTurn(role: 'user' | 'model' | 'tool', content: string, toolCalls?: any[]): ConversationTurn {
    const turn: ConversationTurn = {
      id: `turn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      role,
      timestamp: new Date().toISOString(),
      content,
      toolCalls,
      latencyMs: this.metrics.lastLatencyMs,
    };
    this.history.push(turn);
    this.metrics.totalTurns++;
    return turn;
  }

  public recordLatency(ms: number): void {
    this.metrics.lastLatencyMs = Math.round(ms);
    this.latencySamples.push(ms);
    if (this.latencySamples.length > 20) {
      this.latencySamples.shift();
    }
    const sum = this.latencySamples.reduce((a, b) => a + b, 0);
    this.metrics.averageLatencyMs = Math.round(sum / this.latencySamples.length);
  }

  public recordPacketSent(): void {
    this.metrics.totalAudioPacketsSent++;
  }

  public recordPacketReceived(): void {
    this.metrics.totalAudioPacketsReceived++;
  }

  public recordToolCall(): void {
    this.metrics.totalToolCalls++;
  }

  public end(): void {
    this.endedAt = new Date().toISOString();
    this.status = 'DISCONNECTED';
  }

  public exportAudit(): Record<string, any> {
    return {
      sessionId: this.id,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      metrics: this.metrics,
      historyCount: this.history.length,
      history: this.history,
    };
  }
}
