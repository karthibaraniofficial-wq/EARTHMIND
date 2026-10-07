/**
 * EARTHMIND - Voice Response Manager & Visual Synchronization
 * Manages dual-tier spoken response dispatch, visual card payloads,
 * instant interruption (barge-in), and visual highlighting.
 */

import { ScreenPayload, DualTierResponse } from '../intelligence/AnswerComposer';

export type ResponseListener = (response: DualTierResponse) => void;
export type HighlightListener = (target: { type: string; id: string }) => void;

export class VoiceResponseManager {
  private static responseListeners: Set<ResponseListener> = new Set();
  private static highlightListeners: Set<HighlightListener> = new Set();
  private static activeResponse: DualTierResponse | null = null;
  private static isSpeaking: boolean = false;

  public static onResponse(listener: ResponseListener): () => void {
    this.responseListeners.add(listener);
    return () => this.responseListeners.delete(listener);
  }

  public static onHighlight(listener: HighlightListener): () => void {
    this.highlightListeners.add(listener);
    return () => this.highlightListeners.delete(listener);
  }

  public static dispatch(response: DualTierResponse): void {
    this.activeResponse = response;
    this.responseListeners.forEach((fn) => {
      try {
        fn(response);
      } catch {
        // safe execution
      }
    });

    // Check if visual highlighting is requested
    if (response.screenPayload.visualHighlightTarget) {
      const t = response.screenPayload.visualHighlightTarget;
      this.triggerHighlight(t.type, t.targetId);
    }
  }

  public static triggerHighlight(type: string, id: string): void {
    this.highlightListeners.forEach((fn) => {
      try {
        fn({ type, id });
      } catch {
        // safe execution
      }
    });
  }

  public static interrupt(): void {
    this.isSpeaking = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public static setSpeaking(speaking: boolean): void {
    this.isSpeaking = speaking;
  }

  public static getActiveResponse(): DualTierResponse | null {
    return this.activeResponse;
  }
}
