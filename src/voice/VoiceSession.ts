/**
 * EARTHMIND - Voice Session Manager & Reconnection Resilience
 * Session resumption, context compression, and connection lifecycle management.
 */

import { GeminiVoiceSession, ConversationTurn, SessionMetrics } from '../lib/gemini/GeminiSession';
import { VoiceMemory } from './VoiceMemory';

export class VoiceSession extends GeminiVoiceSession {
  private sessionToken: string;

  constructor() {
    super();
    this.sessionToken = `tok-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
  }

  public getSessionToken(): string {
    return this.sessionToken;
  }

  /**
   * Serializes session snapshot for resumption upon transient disconnect.
   */
  public createResumptionSnapshot(): {
    token: string;
    turns: ConversationTurn[];
    metrics: SessionMetrics;
    memory: any;
  } {
    return {
      token: this.sessionToken,
      turns: this.history.slice(-10), // Keep recent turns for context compression
      metrics: this.metrics,
      memory: VoiceMemory.get(),
    };
  }

  /**
   * Restores conversational context from snapshot.
   */
  public resumeFromSnapshot(snapshot: { turns: ConversationTurn[]; memory?: any }): void {
    if (snapshot.turns && snapshot.turns.length > 0) {
      this.history = [...snapshot.turns];
    }
    if (snapshot.memory) {
      VoiceMemory.update(snapshot.memory);
    }
  }
}
