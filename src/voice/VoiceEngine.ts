import { VoiceState, VoiceSettingsConfig, ParsedVoiceCommand, VoiceHistoryItem } from './VoiceTypes';
import { BrowserNativeVoiceProvider } from './VoiceProvider';
import { parseVoiceCommand } from './VoiceCommandParser';
import { routeVoiceIntent, RouteResult } from './VoiceIntentRouter';
import { executeVoiceAction, AppActionContext } from './VoiceActionExecutor';
import { addVoiceHistoryItem } from './VoiceHistory';
import { requestMicrophoneAccess } from './VoicePermissions';
import { GeminiLiveClient } from '../lib/gemini/GeminiLiveClient';
import { GeminiLiveConnectionStatus } from '../lib/gemini/GeminiEvents';

export interface VoiceEngineListener {
  onStateChange: (state: VoiceState) => void;
  onLiveTranscript: (text: string, isFinal: boolean) => void;
  onAudioLevel: (level: number) => void; // 0.0 - 1.0
  onLastCommand: (cmd: ParsedVoiceCommand | null) => void;
  onLastResponse: (text: string) => void;
  onRequestConfirmation: (prompt: string, onConfirm: () => void, onCancel: () => void) => void;
  onGeminiStatusChange?: (status: GeminiLiveConnectionStatus) => void;
  onLatencyUpdate?: (ms: number) => void;
}

export class VoiceEngine {
  private state: VoiceState = 'IDLE';
  private provider: BrowserNativeVoiceProvider;
  private geminiClient: GeminiLiveClient;
  private settings: VoiceSettingsConfig;
  private listener: VoiceEngineListener | null = null;
  private appContext: AppActionContext | null = null;

  private currentTranscript: string = '';
  private liveAudioLevel: number = 0;
  private lastCommand: ParsedVoiceCommand | null = null;
  private lastResponse: string = '';

  // AudioContext & Analyser for real audio input meter
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private animFrameId: number | null = null;

  private activeEngineMode: 'gemini_live' | 'local_fallback' = 'gemini_live';

  constructor(settings: VoiceSettingsConfig) {
    this.settings = settings;
    this.provider = new BrowserNativeVoiceProvider();
    this.geminiClient = new GeminiLiveClient({
      voiceConfig: {
        voiceName: settings.geminiVoice || 'Aoede',
      },
    });

    this.setupGeminiListeners();
  }

  private setupGeminiListeners(): void {
    this.geminiClient.on('status', (st) => {
      this.listener?.onGeminiStatusChange?.(st);
      switch (st) {
        case 'CONNECTING':
          if (this.state === 'IDLE') this.setState('REQUESTING_PERMISSION');
          break;
        case 'CONNECTED':
          if (this.state === 'REQUESTING_PERMISSION') this.setState('LISTENING');
          break;
        case 'LISTENING':
          this.setState('LISTENING');
          break;
        case 'THINKING':
          this.setState('UNDERSTANDING');
          break;
        case 'TOOL_CALLING':
          this.setState('EXECUTING');
          break;
        case 'SPEAKING':
          this.setState('SPEAKING');
          break;
        case 'INTERRUPTED':
          this.setState('INTERRUPTED');
          setTimeout(() => {
            if (this.state === 'INTERRUPTED') this.setState('LISTENING');
          }, 300);
          break;
        case 'ERROR':
        case 'DISCONNECTED':
          if (this.activeEngineMode === 'gemini_live' && this.state === 'LISTENING') {
            // Activate local fallback seamlessly
            this.activateLocalFallback();
          }
          break;
      }
    });

    this.geminiClient.on('userTranscript', (text, isFinal) => {
      this.currentTranscript = text;
      this.listener?.onLiveTranscript(text, isFinal);
    });

    this.geminiClient.on('modelTranscript', (text, _isFinal) => {
      this.lastResponse = text;
      this.listener?.onLastResponse(text);
    });

    this.geminiClient.on('turnComplete', () => {
      if (this.state === 'SPEAKING' && !this.geminiClient.isSpeaking()) {
        this.setState('IDLE');
      }
    });

    this.geminiClient.on('interrupted', () => {
      this.setState('INTERRUPTED');
    });

    this.geminiClient.on('latency', (ms) => {
      this.listener?.onLatencyUpdate?.(ms);
    });
  }

  public setListener(listener: VoiceEngineListener): void {
    this.listener = listener;
  }

  public setAppContext(ctx: AppActionContext): void {
    this.appContext = ctx;
    this.geminiClient.setAppContext(ctx);
  }

  public updateSettings(settings: VoiceSettingsConfig): void {
    this.settings = settings;
    this.provider.getRecognizer().setLanguage(settings.language);
    this.provider.getRecognizer().setWakeWord(settings.wakeWordEnabled, settings.wakePhrase);
  }

  public getGeminiClient(): GeminiLiveClient {
    return this.geminiClient;
  }

  public getActiveEngineMode(): 'gemini_live' | 'local_fallback' {
    return this.activeEngineMode;
  }

  public getState(): VoiceState {
    return this.state;
  }

  private setState(newState: VoiceState): void {
    this.state = newState;
    this.listener?.onStateChange(newState);
  }

  /**
   * Start listening session
   */
  public async startListening(): Promise<boolean> {
    if (!this.settings.enabled) {
      this.setState('DISABLED');
      return false;
    }

    // If currently speaking, immediately interrupt
    this.stopSpeaking();

    this.setState('REQUESTING_PERMISSION');

    // Acquire microphone access & start audio meter
    const micRes = await requestMicrophoneAccess(this.settings.selectedAudioDeviceId);
    if (!micRes.granted) {
      this.setState('ERROR');
      return false;
    }

    this.mediaStream = micRes.stream || null;
    this.startAudioMeter(this.mediaStream);

    this.setState('LISTENING');
    this.currentTranscript = '';
    this.listener?.onLiveTranscript('', false);

    // Primary choice: Gemini Live API
    if (this.settings.primaryEngine !== 'local_fallback') {
      try {
        const connected = await this.geminiClient.connect();
        if (connected && this.mediaStream) {
          this.activeEngineMode = 'gemini_live';
          await this.geminiClient.startAudioStream(this.mediaStream, (lvl) => {
            this.liveAudioLevel = lvl;
            this.listener?.onAudioLevel(lvl);
          });
          return true;
        }
      } catch (err) {
        console.warn('[EARTHMIND VOICE] Gemini Live connection failed, using local fallback:', err);
      }
    }

    // Deterministic Local Fallback Mode
    this.activateLocalFallback();
    return true;
  }

  /**
   * Activates deterministic local browser speech recognition fallback
   */
  private activateLocalFallback(): void {
    this.activeEngineMode = 'local_fallback';
    const recognizer = this.provider.getRecognizer();
    recognizer.setLanguage(this.settings.language);
    recognizer.setWakeWord(this.settings.wakeWordEnabled, this.settings.wakePhrase);

    recognizer.start(
      {
        onStart: () => {
          this.setState('LISTENING');
        },
        onInterim: (text) => {
          this.currentTranscript = text;
          this.listener?.onLiveTranscript(text, false);
        },
        onFinal: (text) => {
          this.currentTranscript = text;
          this.listener?.onLiveTranscript(text, true);
          this.processTranscript(text);
        },
        onError: (err) => {
          console.warn('[EARTHMIND VOICE] Local recognizer error:', err);
          this.stopAudioMeter();
          this.setState('ERROR');
        },
        onEnd: () => {
          if (this.state === 'LISTENING') {
            this.stopAudioMeter();
            this.setState('IDLE');
          }
        },
        onWakeWord: () => {
          this.speak('EarthMind listening.');
        },
      },
      {
        continuous: this.settings.continuousListening,
        language: this.settings.language,
      }
    );
  }

  /**
   * Stop listening session
   */
  public stopListening(): void {
    this.stopAudioMeter();
    if (this.activeEngineMode === 'gemini_live') {
      this.geminiClient.stopAudioStream();
    }
    this.provider.stopListening();
    if (this.state === 'LISTENING' || this.state === 'REQUESTING_PERMISSION') {
      this.setState('IDLE');
    }
  }

  /**
   * Process recognized speech transcript (used by local mode or manual text input)
   */
  public async processTranscript(transcript: string): Promise<void> {
    if (!transcript.trim()) {
      this.setState('IDLE');
      return;
    }

    // If Gemini Live is connected, send user prompt directly to Gemini
    if (this.activeEngineMode === 'gemini_live' && this.geminiClient.getStatus() === 'CONNECTED') {
      this.geminiClient.sendTextPrompt(transcript);
      return;
    }

    this.stopAudioMeter();
    this.setState('PROCESSING');

    // 1. Parse Voice Command
    this.setState('UNDERSTANDING');
    const parsed = parseVoiceCommand(transcript, this.settings.language);
    this.lastCommand = parsed;
    this.listener?.onLastCommand(parsed);

    // 2. Route Intent
    const route = routeVoiceIntent(parsed, this.settings);

    // 3. Check for Confirmation requirement
    if (route.requiresConfirmation && this.listener?.onRequestConfirmation) {
      this.listener.onRequestConfirmation(
        route.confirmationMessage || 'Confirm action?',
        () => {
          this.executeAndRespond(parsed, route);
        },
        () => {
          this.recordHistory(parsed, 'CANCELLED', 'Action cancelled by user');
          this.setState('IDLE');
        }
      );
      return;
    }

    if (!route.actionable && parsed.intent === 'UNKNOWN') {
      this.handleUnknownOrAi(parsed, route);
      return;
    }

    // 4. Execute Action
    await this.executeAndRespond(parsed, route);
  }

  private async executeAndRespond(cmd: ParsedVoiceCommand, route: RouteResult): Promise<void> {
    this.setState('EXECUTING');

    let execResult = { success: true, message: 'Executed' };
    if (this.appContext) {
      execResult = executeVoiceAction(cmd, this.appContext);
    }

    this.lastResponse = route.responseText;
    this.listener?.onLastResponse(route.responseText);

    this.recordHistory(cmd, execResult.success ? 'SUCCESS' : 'FAILED', execResult.message);

    // 5. Speak response if enabled
    if (this.settings.autoSpeakResponse && route.responseSpeech) {
      await this.speak(route.responseSpeech);
    } else {
      this.setState('IDLE');
    }
  }

  private async handleUnknownOrAi(cmd: ParsedVoiceCommand, route: RouteResult): Promise<void> {
    this.lastResponse = route.responseText;
    this.listener?.onLastResponse(route.responseText);

    this.recordHistory(cmd, 'FAILED', route.executionNote);

    if (this.settings.autoSpeakResponse && route.responseSpeech) {
      await this.speak(route.responseSpeech);
    } else {
      this.setState('IDLE');
    }
  }

  /**
   * Speak speech output (supports instant interruption)
   */
  public async speak(text: string): Promise<void> {
    if (!text.trim()) {
      this.setState('IDLE');
      return;
    }

    this.setState('SPEAKING');

    await this.provider.speak(text, {
      rate: this.settings.speechRate,
      pitch: this.settings.pitch,
      volume: this.settings.volume,
      voiceName: this.settings.voiceName,
      lang: this.settings.language,
      onEnd: () => {
        if (this.state === 'SPEAKING') {
          this.setState('IDLE');
        }
      },
      onError: () => {
        this.setState('IDLE');
      },
    });
  }

  /**
   * Immediately halts any active speech output across all providers (Barge-in / Stop)
   */
  public stopSpeaking(): void {
    this.geminiClient.stopSpeaking();
    this.provider.stopSpeaking();
    if (this.state === 'SPEAKING') {
      this.setState('IDLE');
    }
  }

  private recordHistory(cmd: ParsedVoiceCommand, status: VoiceHistoryItem['executionResult'], details?: string): void {
    if (!this.settings.storeHistory) return;

    addVoiceHistoryItem({
      userTranscript: cmd.rawText,
      recognizedIntent: cmd.intent,
      confidence: cmd.confidence,
      earthMindResponse: this.lastResponse,
      executionResult: status,
      executionDetails: details,
    });
  }

  /**
   * Web Audio level meter
   */
  private startAudioMeter(stream: MediaStream | null): void {
    if (!stream || typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkLevel = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(1.0, avg / 128);
        this.liveAudioLevel = normalized;
        this.listener?.onAudioLevel(normalized);

        if (this.state === 'LISTENING') {
          this.animFrameId = requestAnimationFrame(checkLevel);
        }
      };

      checkLevel();
    } catch (e) {
      console.warn('[EARTHMIND VOICE] Audio meter init error', e);
    }
  }

  private stopAudioMeter(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
      this.analyser = null;
    }
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((t) => t.stop());
      } catch {}
      this.mediaStream = null;
    }
    this.liveAudioLevel = 0;
    this.listener?.onAudioLevel(0);
  }

  public getAudioLevel(): number {
    return this.liveAudioLevel;
  }
}
