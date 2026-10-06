/**
 * EARTHMIND - Google Gemini Live Event Emitter & Types
 * Strongly typed events for streaming bidirectional voice, transcripts, tools, and state.
 */

import { GeminiLiveError } from './GeminiErrors';

export type GeminiLiveConnectionStatus =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'LISTENING'
  | 'THINKING'
  | 'TOOL_CALLING'
  | 'SPEAKING'
  | 'INTERRUPTED'
  | 'ERROR';

export interface ToolCallRequest {
  id: string;
  name: string;
  args: Record<string, any>;
}

export interface ToolCallResponse {
  id: string;
  name: string;
  response: {
    result: any;
  };
}

export interface GeminiLiveEvents {
  status: (status: GeminiLiveConnectionStatus) => void;
  audio: (pcmData: ArrayBuffer) => void;
  userTranscript: (text: string, isFinal: boolean) => void;
  modelTranscript: (text: string, isFinal: boolean) => void;
  turnComplete: () => void;
  interrupted: () => void;
  toolCall: (calls: ToolCallRequest[]) => void;
  error: (error: GeminiLiveError) => void;
  latency: (roundTripMs: number) => void;
}

export type EventKey = keyof GeminiLiveEvents;

export class GeminiEventEmitter {
  private listeners: Map<EventKey, Set<Function>> = new Map();

  public on<K extends EventKey>(event: K, handler: GeminiLiveEvents[K]): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  public off<K extends EventKey>(event: K, handler: GeminiLiveEvents[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  public emit<K extends EventKey>(event: K, ...args: Parameters<GeminiLiveEvents[K]>): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((h) => {
        try {
          (h as any)(...args);
        } catch (err) {
          console.error(`[GeminiLive] Event listener error on ${event}:`, err);
        }
      });
    }
  }

  public removeAllListeners(): void {
    this.listeners.clear();
  }
}
