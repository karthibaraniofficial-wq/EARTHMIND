import { VoiceCapabilities, VoiceProvider } from './VoiceTypes';
import { SpeechRecognizer } from './SpeechRecognizer';
import { SpeechSynthesizer } from './SpeechSynthesizer';
import { detectVoiceCapabilities } from './VoiceCapabilities';

export class BrowserNativeVoiceProvider implements VoiceProvider {
  public id = 'browser_native';
  public name = 'Browser Native Web Speech Provider';
  public capabilities: VoiceCapabilities;

  private recognizer: SpeechRecognizer;
  private synthesizer: SpeechSynthesizer;

  constructor() {
    this.capabilities = detectVoiceCapabilities();
    this.recognizer = new SpeechRecognizer();
    this.synthesizer = new SpeechSynthesizer();
  }

  public getRecognizer(): SpeechRecognizer {
    return this.recognizer;
  }

  public getSynthesizer(): SpeechSynthesizer {
    return this.synthesizer;
  }

  public async startListening(options: {
    language: string;
    continuous: boolean;
    onInterim?: (text: string) => void;
    onFinal?: (text: string) => void;
    onError?: (error: string) => void;
  }): Promise<void> {
    this.recognizer.start(
      {
        onInterim: options.onInterim,
        onFinal: options.onFinal,
        onError: options.onError,
      },
      {
        language: options.language as any,
        continuous: options.continuous,
      }
    );
  }

  public async stopListening(): Promise<void> {
    this.recognizer.stop();
  }

  public async speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      volume?: number;
      voiceName?: string;
      lang?: string;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): Promise<void> {
    await this.synthesizer.speak(text, {
      rate: options?.rate,
      pitch: options?.pitch,
      volume: options?.volume,
      voiceName: options?.voiceName,
      lang: options?.lang,
      onStart: options?.onStart,
      onEnd: options?.onEnd,
      onError: options?.onError,
    });
  }

  public stopSpeaking(): void {
    this.synthesizer.stop();
  }

  public pauseSpeaking(): void {
    this.synthesizer.pause();
  }

  public resumeSpeaking(): void {
    this.synthesizer.resume();
  }
}
