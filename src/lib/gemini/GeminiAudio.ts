/**
 * EARTHMIND - Google Gemini Live Audio Processing Engine
 * High-performance, low-latency 16kHz PCM capture and 24kHz PCM native playback with barge-in interruption.
 */

import { GeminiAudioError } from './GeminiErrors';

/**
 * Encodes Float32Array PCM samples to 16-bit signed integer linear PCM (Little Endian)
 */
export function floatTo16BitPCM(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output;
}

/**
 * Converts Int16Array to base64 string
 */
export function int16ToBase64(int16Array: Int16Array): string {
  let binary = '';
  const bytes = new Uint8Array(int16Array.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts base64 string to Float32Array (for 24kHz Gemini Live audio output)
 */
export function base64ToFloat32(base64: string): Float32Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / (int16[i] < 0 ? 0x8000 : 0x7fff);
  }
  return float32;
}

/**
 * Audio Capture Manager (16kHz PCM)
 */
export class GeminiAudioRecorder {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private isRecording: boolean = false;
  private onAudioChunk: ((base64Pcm: string, rawFloat: Float32Array) => void) | null = null;
  private onLevel: ((level: number) => void) | null = null;

  public async start(
    stream: MediaStream,
    onAudioChunk: (base64Pcm: string, rawFloat: Float32Array) => void,
    onLevel?: (level: number) => void
  ): Promise<void> {
    if (this.isRecording) return;
    this.mediaStream = stream;
    this.onAudioChunk = onAudioChunk;
    this.onLevel = onLevel || null;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      // Target 16kHz for Gemini Multimodal Live API
      this.audioContext = new AudioCtx({ sampleRate: 16000 });

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.sourceNode = this.audioContext.createMediaStreamSource(stream);
      // Buffer size 2048 gives ~128ms chunks at 16kHz - ideal for real-time streaming
      this.processorNode = this.audioContext.createScriptProcessor(2048, 1, 1);

      this.processorNode.onaudioprocess = (event) => {
        if (!this.isRecording) return;
        const inputData = event.inputBuffer.getChannelData(0);

        // Compute RMS level for UI meter
        if (this.onLevel) {
          let sumSquares = 0;
          for (let i = 0; i < inputData.length; i++) {
            sumSquares += inputData[i] * inputData[i];
          }
          const rms = Math.sqrt(sumSquares / inputData.length);
          const normalized = Math.min(1, rms * 5); // Boost visual sensitivity
          this.onLevel(normalized);
        }

        const int16Data = floatTo16BitPCM(inputData);
        const base64Pcm = int16ToBase64(int16Data);
        this.onAudioChunk?.(base64Pcm, inputData);
      };

      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);
      this.isRecording = true;
    } catch (err: any) {
      this.stop();
      throw new GeminiAudioError(`Failed to initialize audio capture: ${err.message}`);
    }
  }

  public stop(): void {
    this.isRecording = false;
    if (this.processorNode) {
      try {
        this.processorNode.disconnect();
      } catch (_) {}
      this.processorNode = null;
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch (_) {}
      this.sourceNode = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (_) {}
      this.audioContext = null;
    }
    this.onLevel?.(0);
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }
}

/**
 * Audio Player Manager (24kHz Native PCM)
 * Plays queued audio chunks gaplessly and supports instant barge-in flushing.
 */
export class GeminiAudioPlayer {
  private audioContext: AudioContext | null = null;
  private nextPlayTime: number = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private onLevel: ((level: number) => void) | null = null;
  private isPlaying: boolean = false;

  constructor(onLevel?: (level: number) => void) {
    this.onLevel = onLevel || null;
  }

  private initContext(): AudioContext {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx({ sampleRate: 24000 });
      this.nextPlayTime = 0;
    }
    return this.audioContext;
  }

  /**
   * Schedules a raw base64 PCM chunk for playback at 24kHz
   */
  public async queueAudioChunk(base64Audio: string): Promise<void> {
    try {
      const ctx = this.initContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const floatData = base64ToFloat32(base64Audio);
      if (floatData.length === 0) return;

      const audioBuffer = ctx.createBuffer(1, floatData.length, 24000);
      audioBuffer.copyToChannel(floatData as any, 0);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      const startTime = Math.max(currentTime, this.nextPlayTime);
      source.start(startTime);
      this.nextPlayTime = startTime + audioBuffer.duration;

      this.activeSources.push(source);
      this.isPlaying = true;

      // Update output level meter
      if (this.onLevel) {
        let sumSquares = 0;
        for (let i = 0; i < Math.min(floatData.length, 512); i++) {
          sumSquares += floatData[i] * floatData[i];
        }
        const rms = Math.sqrt(sumSquares / Math.min(floatData.length, 512));
        this.onLevel(Math.min(1, rms * 4));
      }

      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx !== -1) {
          this.activeSources.splice(idx, 1);
        }
        if (this.activeSources.length === 0) {
          this.isPlaying = false;
          this.onLevel?.(0);
        }
      };
    } catch (err: any) {
      console.warn('[GeminiAudioPlayer] Playback error:', err);
    }
  }

  /**
   * Instantly halts and flushes all pending audio for immediate interruption/barge-in.
   */
  public flush(): void {
    for (const src of this.activeSources) {
      try {
        src.stop(0);
        src.disconnect();
      } catch (_) {}
    }
    this.activeSources = [];
    if (this.audioContext) {
      this.nextPlayTime = this.audioContext.currentTime;
    }
    this.isPlaying = false;
    this.onLevel?.(0);
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public destroy(): void {
    this.flush();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (_) {}
      this.audioContext = null;
    }
  }
}
