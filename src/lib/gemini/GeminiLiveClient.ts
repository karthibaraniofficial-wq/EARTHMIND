/**
 * EARTHMIND - Google Gemini Live WebSocket Client
 * Real-time bidirectional streaming audio, native 24kHz voice output, and tool calling.
 */

import { GeminiEventEmitter, GeminiLiveConnectionStatus } from './GeminiEvents';
import { GeminiVoiceSession } from './GeminiSession';
import { GeminiAudioRecorder, GeminiAudioPlayer } from './GeminiAudio';
import { DEFAULT_GEMINI_LIVE_CONFIG, EARTHMIND_SYSTEM_INSTRUCTION, GeminiLiveClientOptions } from './GeminiLiveConfig';
import { GEMINI_TOOL_DECLARATIONS, executeGeminiTool } from './GeminiTools';
import { AppActionContext } from '../../voice/VoiceActionExecutor';
import { buildEarthMindContext, serializeEarthMindContext } from './GeminiContext';
import { GeminiLiveError } from './GeminiErrors';

export class GeminiLiveClient extends GeminiEventEmitter {
  private ws: WebSocket | null = null;
  private options: Required<GeminiLiveClientOptions>;
  private session: GeminiVoiceSession;
  private recorder: GeminiAudioRecorder;
  private player: GeminiAudioPlayer;
  private status: GeminiLiveConnectionStatus = 'DISCONNECTED';
  private appContext: AppActionContext | null = null;

  private isMuted: boolean = false;
  private lastPingTime: number = 0;
  private pingInterval: any = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private isIntentionalClose: boolean = false;

  constructor(options?: GeminiLiveClientOptions) {
    super();
    this.options = {
      wsUrl: options?.wsUrl || this.resolveDefaultWsUrl(),
      model: options?.model || DEFAULT_GEMINI_LIVE_CONFIG.model,
      voiceConfig: {
        ...DEFAULT_GEMINI_LIVE_CONFIG.voice,
        ...(options?.voiceConfig || {}),
      },
      systemInstruction: options?.systemInstruction || EARTHMIND_SYSTEM_INSTRUCTION,
      debug: options?.debug ?? false,
    };

    this.session = new GeminiVoiceSession();
    this.recorder = new GeminiAudioRecorder();
    this.player = new GeminiAudioPlayer((lvl) => {
      // Audio playback output level (for waveform)
      if (this.status === 'SPEAKING' || lvl > 0.05) {
        // Can be consumed by audio meters
      }
    });
  }

  private resolveDefaultWsUrl(): string {
    const customGateway = (import.meta as any)?.env?.VITE_GEMINI_LIVE_GATEWAY_URL;
    if (customGateway && typeof customGateway === 'string' && customGateway.trim().length > 0) {
      return customGateway.trim();
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}${DEFAULT_GEMINI_LIVE_CONFIG.defaultEndpoint}`;
  }

  public setAppContext(ctx: AppActionContext): void {
    this.appContext = ctx;
    this.session.lastKnownContext = buildEarthMindContext(ctx);
  }

  public getSession(): GeminiVoiceSession {
    return this.session;
  }

  public getStatus(): GeminiLiveConnectionStatus {
    return this.status;
  }

  private setStatus(status: GeminiLiveConnectionStatus): void {
    this.status = status;
    this.session.status = status;
    this.emit('status', status);
  }

  /**
   * Connects to the Gemini Live WebSocket gateway
   */
  public async connect(): Promise<boolean> {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return true;
    }

    this.isIntentionalClose = false;
    this.setStatus('CONNECTING');

    return new Promise((resolve) => {
      try {
        this.ws = new WebSocket(this.options.wsUrl);

        const connectionTimeout = setTimeout(() => {
          if (this.status === 'CONNECTING') {
            console.warn('[GeminiLiveClient] Connection timed out');
            this.handleConnectionFailure('Connection timed out');
            resolve(false);
          }
        }, 8000);

        this.ws.onopen = () => {
          clearTimeout(connectionTimeout);
          this.reconnectAttempts = 0;
          this.sendSetupMessage();
          this.startHeartbeat();
        };

        this.ws.onmessage = async (event) => {
          await this.handleServerMessage(event.data);
        };

        this.ws.onerror = (err) => {
          console.warn('[GeminiLiveClient] WebSocket error:', err);
          this.emit('error', new GeminiLiveError('WebSocket connection error', 'WEBSOCKET_ERROR', err));
        };

        this.ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          this.stopHeartbeat();
          if (!this.isIntentionalClose) {
            console.warn(`[GeminiLiveClient] WebSocket closed with code ${event.code}: ${event.reason}`);
            this.handleDisconnect();
          } else {
            this.setStatus('DISCONNECTED');
          }
          resolve(false);
        };

        // When setup completes, we resolve true
        const setupListener = this.on('status', (newStatus) => {
          if (newStatus === 'CONNECTED') {
            setupListener();
            resolve(true);
          }
        });
      } catch (err: any) {
        this.handleConnectionFailure(err.message || 'Failed to open WebSocket');
        resolve(false);
      }
    });
  }

  /**
   * Sends the initial BidiGenerateContentSetup message
   */
  private sendSetupMessage(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    // Grounding with current application context if available
    let dynamicPrompt = this.options.systemInstruction;
    if (this.appContext) {
      const liveContextStr = serializeEarthMindContext(buildEarthMindContext(this.appContext));
      dynamicPrompt += `\n\nCURRENT APPLICATION STATE UPON INITIALIZATION:\n${liveContextStr}`;
    }

    const setupMessage = {
      setup: {
        model: this.options.model,
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: this.options.voiceConfig.voiceName || 'Aoede',
              },
            },
          },
        },
        systemInstruction: {
          parts: [{ text: dynamicPrompt }],
        },
        tools: [
          {
            functionDeclarations: GEMINI_TOOL_DECLARATIONS,
          },
        ],
      },
    };

    if (this.options.debug) {
      console.log('[GeminiLiveClient] Sending setup message:', setupMessage);
    }

    this.ws.send(JSON.stringify(setupMessage));
  }

  /**
   * Parses and handles inbound messages from Gemini Live
   */
  private async handleServerMessage(data: any): Promise<void> {
    try {
      const messageText = typeof data === 'string' ? data : await data.text();
      const msg = JSON.parse(messageText);

      // 1. Setup Complete
      if (msg.setupComplete) {
        this.setStatus('CONNECTED');
        return;
      }

      // 2. Server Content (Audio / Text / Interruption)
      if (msg.serverContent) {
        const sc = msg.serverContent;

        // Barge-in Interruption detected by model
        if (sc.interrupted) {
          this.player.flush();
          this.emit('interrupted');
          this.setStatus('LISTENING');
          return;
        }

        if (sc.modelTurn && sc.modelTurn.parts) {
          for (const part of sc.modelTurn.parts) {
            // Text transcript
            if (part.text) {
              this.emit('modelTranscript', part.text, false);
              this.session.recordTurn('model', part.text);
            }

            // Real-time 24kHz Native PCM Audio
            if (part.inlineData && part.inlineData.data) {
              this.setStatus('SPEAKING');
              this.session.recordPacketReceived();
              await this.player.queueAudioChunk(part.inlineData.data);
            }
          }
        }

        if (sc.turnComplete) {
          this.emit('turnComplete');
          // If player finishes playing, transition to LISTENING
          if (!this.player.getIsPlaying()) {
            this.setStatus('LISTENING');
          }
        }
      }

      // 3. Tool Calling
      if (msg.toolCall && msg.toolCall.functionCalls) {
        this.setStatus('TOOL_CALLING');
        const calls = msg.toolCall.functionCalls;
        this.emit('toolCall', calls);

        const responses: any[] = [];
        for (const call of calls) {
          this.session.recordToolCall();
          let result: any = { error: 'No application context available' };

          if (this.appContext) {
            const execRes = await executeGeminiTool(call.name, call.args || {}, this.appContext);
            result = {
              success: execRes.success,
              message: execRes.message,
              ...(execRes.result ? { data: execRes.result } : {}),
            };
          }

          responses.push({
            id: call.id,
            name: call.name,
            response: { result },
          });

          this.session.recordTurn('tool', `Tool [${call.name}] executed: ${JSON.stringify(result)}`, [
            { name: call.name, args: call.args, result },
          ]);
        }

        // Return tool results back to Gemini Live session
        this.sendToolResponse(responses);
      }
    } catch (err: any) {
      console.warn('[GeminiLiveClient] Error handling message:', err);
    }
  }

  /**
   * Sends tool execution results back to Gemini Live
   */
  private sendToolResponse(functionResponses: any[]): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const payload = {
      toolResponse: {
        functionResponses,
      },
    };

    if (this.options.debug) {
      console.log('[GeminiLiveClient] Sending tool response:', payload);
    }

    this.ws.send(JSON.stringify(payload));
  }

  /**
   * Starts microphone recording and streams 16kHz PCM audio
   */
  public async startAudioStream(stream: MediaStream, onInputLevel?: (level: number) => void): Promise<void> {
    if (this.status !== 'CONNECTED' && this.status !== 'LISTENING' && this.status !== 'SPEAKING') {
      const connected = await this.connect();
      if (!connected) return;
    }

    this.setStatus('LISTENING');

    await this.recorder.start(
      stream,
      (base64Pcm, _rawFloat) => {
        if (this.isMuted) return;

        // Send realtime audio mediaChunk to Gemini Live
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const audioMsg = {
            realtimeInput: {
              mediaChunks: [
                {
                  mimeType: 'audio/pcm;rate=16000',
                  data: base64Pcm,
                },
              ],
            },
          };
          this.ws.send(JSON.stringify(audioMsg));
          this.session.recordPacketSent();
        }
      },
      (level) => {
        onInputLevel?.(level);
        // Local client barge-in: If user talks loudly while model is speaking, flush playback
        if (level > 0.4 && this.player.getIsPlaying()) {
          this.player.flush();
          this.setStatus('LISTENING');
        }
      }
    );
  }

  /**
   * Stops streaming microphone audio
   */
  public stopAudioStream(): void {
    this.recorder.stop();
    if (this.status === 'LISTENING') {
      this.setStatus('CONNECTED');
    }
  }

  /**
   * Sends a user text prompt to the session
   */
  public sendTextPrompt(text: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.setStatus('THINKING');
    this.session.recordTurn('user', text);
    this.emit('userTranscript', text, true);

    const clientContent = {
      clientContent: {
        turns: [
          {
            role: 'user',
            parts: [{ text }],
          },
        ],
        turnComplete: true,
      },
    };

    this.ws.send(JSON.stringify(clientContent));
  }

  /**
   * Injects current EarthMind application context as a dynamic grounding update
   */
  public updateContextGrounding(): void {
    if (!this.appContext || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const ctx = buildEarthMindContext(this.appContext);
    const summary = serializeEarthMindContext(ctx);

    const updateMsg = {
      clientContent: {
        turns: [
          {
            role: 'user',
            parts: [
              {
                text: `[SYSTEM CONTEXT UPDATE - USER NAVIGATED]\nCurrent state: ${summary}`,
              },
            ],
          },
        ],
        turnComplete: true,
      },
    };

    this.ws.send(JSON.stringify(updateMsg));
  }

  /**
   * Immediately halts model speech (Barge-in / Stop command)
   */
  public stopSpeaking(): void {
    this.player.flush();
    if (this.status === 'SPEAKING') {
      this.setStatus('LISTENING');
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public isSpeaking(): boolean {
    return this.player.getIsPlaying();
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.lastPingTime = Date.now();
        // Keep-alive or metric check
      }
    }, 15000);
  }

  private stopHeartbeat(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private handleConnectionFailure(reason: string): void {
    this.setStatus('ERROR');
    this.emit('error', new GeminiLiveError(`Gemini Live connection failed: ${reason}`, 'CONNECTION_TIMEOUT'));
  }

  private handleDisconnect(): void {
    this.setStatus('DISCONNECTED');
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 5000);
      console.log(`[GeminiLiveClient] Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms...`);
      setTimeout(() => {
        if (!this.isIntentionalClose && this.status === 'DISCONNECTED') {
          this.connect();
        }
      }, delay);
    }
  }

  public disconnect(): void {
    this.isIntentionalClose = true;
    this.stopHeartbeat();
    this.stopAudioStream();
    this.player.destroy();
    if (this.ws) {
      try {
        this.ws.close();
      } catch (_) {}
      this.ws = null;
    }
    this.session.end();
    this.setStatus('DISCONNECTED');
  }
}
