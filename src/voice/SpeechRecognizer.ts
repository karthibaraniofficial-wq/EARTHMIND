import { RecognitionLanguage } from './VoiceTypes';

// Extend window definition for webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechRecognizerCallbacks {
  onStart?: () => void;
  onInterim?: (transcript: string) => void;
  onFinal?: (transcript: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onWakeWord?: () => void;
}

export class SpeechRecognizer {
  private recognition: any = null;
  private isListening: boolean = false;
  private continuous: boolean = false;
  private language: RecognitionLanguage = 'en-US';
  private callbacks: SpeechRecognizerCallbacks = {};
  private wakeWordEnabled: boolean = false;
  private wakePhrase: string = 'hey earthmind';
  private shouldAutoRestart: boolean = false;

  constructor() {
    this.initRecognition();
  }

  private initRecognition(): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      return false;
    }

    try {
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = false; // We manage restarts cleanly
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const text = item[0]?.transcript || '';
          if (item.isFinal) {
            finalTranscript += text;
          } else {
            interimTranscript += text;
          }
        }

        const currentText = (finalTranscript || interimTranscript).trim().toLowerCase();

        // Check wake word if enabled
        if (this.wakeWordEnabled && currentText.includes(this.wakePhrase)) {
          this.callbacks.onWakeWord?.();
        }

        if (interimTranscript) {
          this.callbacks.onInterim?.(interimTranscript);
        }

        if (finalTranscript) {
          this.callbacks.onFinal?.(finalTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        const error = event.error || 'speech_recognition_error';
        // 'no-speech' is routine in ambient listening; ignore if auto-restarting
        if (error !== 'no-speech') {
          this.callbacks.onError?.(error);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.callbacks.onEnd?.();

        if (this.shouldAutoRestart && this.continuous) {
          setTimeout(() => {
            if (this.shouldAutoRestart) {
              this.startListeningInternal();
            }
          }, 300);
        }
      };

      return true;
    } catch (e) {
      console.warn('[EARTHMIND VOICE] SpeechRecognition init failed', e);
      return false;
    }
  }

  public isSupported(): boolean {
    return !!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));
  }

  public setLanguage(lang: RecognitionLanguage) {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public setWakeWord(enabled: boolean, phrase: string = 'hey earthmind') {
    this.wakeWordEnabled = enabled;
    this.wakePhrase = phrase.toLowerCase().trim();
  }

  public start(callbacks: SpeechRecognizerCallbacks, options?: { continuous?: boolean; language?: RecognitionLanguage }): boolean {
    this.callbacks = callbacks;
    this.continuous = options?.continuous ?? false;
    this.shouldAutoRestart = this.continuous;
    if (options?.language) {
      this.setLanguage(options.language);
    }
    return this.startListeningInternal();
  }

  private startListeningInternal(): boolean {
    if (!this.recognition) {
      const initialized = this.initRecognition();
      if (!initialized) {
        this.callbacks.onError?.('Speech recognition not supported in this browser.');
        return false;
      }
    }

    try {
      this.recognition.lang = this.language;
      this.recognition.start();
      return true;
    } catch (err: any) {
      // If already started, ignore InvalidStateError
      if (err.name !== 'InvalidStateError') {
        this.callbacks.onError?.(err?.message || 'Failed to start microphone');
      }
      return false;
    }
  }

  public stop(): void {
    this.shouldAutoRestart = false;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Safe catch
      }
    }
    this.isListening = false;
  }

  public abort(): void {
    this.shouldAutoRestart = false;
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // Safe catch
      }
    }
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}
