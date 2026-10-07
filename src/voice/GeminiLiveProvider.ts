/**
 * EARTHMIND - Gemini Live Voice Provider
 * Primary real-time multimodal voice interface powered by Gemini 3.8 Live.
 * Handles bidirectional 16kHz PCM audio streaming, native 24kHz synthesis, and barge-in.
 */

import { GeminiLiveClient } from '../lib/gemini/GeminiLiveClient';
import { GeminiLiveConnectionStatus } from '../lib/gemini/GeminiEvents';
import { getGeminiLiveModel } from '../config/aiModels';
import { AppActionContext } from './VoiceActionExecutor';
import { VoiceDiagnostics } from './VoiceDiagnostics';
import { VoiceResponseManager } from './VoiceResponseManager';

export class GeminiLiveProvider {
  private client: GeminiLiveClient;
  private isConnected: boolean = false;

  constructor(options?: { voiceName?: any }) {
    this.client = new GeminiLiveClient({
      model: getGeminiLiveModel(),
      voiceConfig: {
        voiceName: options?.voiceName || 'Aoede',
        inputSampleRate: 16000,
        outputSampleRate: 24000,
      },
    });

    this.setupTelemetry();
  }

  private setupTelemetry(): void {
    this.client.on('status', (st: GeminiLiveConnectionStatus) => {
      this.isConnected = st === 'CONNECTED' || st === 'LISTENING' || st === 'SPEAKING' || st === 'TOOL_CALLING';
      VoiceDiagnostics.update({
        geminiLiveStatus: st === 'CONNECTED' || st === 'LISTENING' || st === 'SPEAKING' || st === 'TOOL_CALLING'
          ? 'CONNECTED' 
          : st === 'CONNECTING' 
          ? 'CONNECTING' 
          : st === 'ERROR' 
          ? 'ERROR' 
          : 'DISCONNECTED',
      });
    });

    this.client.on('interrupted', () => {
      VoiceResponseManager.interrupt();
    });
  }

  public getClient(): GeminiLiveClient {
    return this.client;
  }

  public async connect(): Promise<boolean> {
    return this.client.connect();
  }

  public disconnect(): void {
    this.client.disconnect();
  }

  public setAppContext(ctx: AppActionContext): void {
    this.client.setAppContext(ctx);
  }

  public async startAudioStream(stream: MediaStream, onInputLevel?: (level: number) => void): Promise<void> {
    await this.client.startAudioStream(stream, onInputLevel);
  }

  public stopAudioStream(): void {
    this.client.stopAudioStream();
  }

  public sendTextMessage(text: string): void {
    this.client.sendTextPrompt(text);
  }

  public interrupt(): void {
    this.client.stopSpeaking();
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }
}
