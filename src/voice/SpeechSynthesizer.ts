export interface SpeechSynthesizerOptions {
  rate?: number; // 0.5 - 2.0
  pitch?: number; // 0.5 - 1.5
  volume?: number; // 0.0 - 1.0
  voiceName?: string;
  lang?: string;
  onStart?: () => void;
  onWord?: (charIndex: number, text: string) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export class SpeechSynthesizer {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private queue: { text: string; options: SpeechSynthesizerOptions }[] = [];
  private isSpeaking: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.voices = this.synth.getVoices();
    }
    return this.voices;
  }

  public isSupported(): boolean {
    return !!(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }

  public speak(text: string, options: SpeechSynthesizerOptions = {}): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth || !text.trim()) {
        resolve();
        return;
      }

      // Interrupt any current speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.5, Math.min(2.0, options.rate ?? 1.0));
      utterance.pitch = Math.max(0.5, Math.min(1.5, options.pitch ?? 1.0));
      utterance.volume = Math.max(0.0, Math.min(1.0, options.volume ?? 0.85));

      // Select voice: preference for clear natural English/target language voices
      const targetLang = options.lang || 'en-US';
      const selectedVoice = this.pickBestVoice(targetLang, options.voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.activeUtterance = utterance;
        options.onStart?.();
      };

      utterance.onboundary = (event) => {
        options.onWord?.(event.charIndex, text);
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.activeUtterance = null;
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        this.isSpeaking = false;
        this.activeUtterance = null;
        options.onError?.(e);
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  private pickBestVoice(langPrefix: string, preferredName?: string): SpeechSynthesisVoice | null {
    const list = this.getVoices();
    if (list.length === 0) return null;

    if (preferredName) {
      const match = list.find((v) => v.name === preferredName);
      if (match) return match;
    }

    // Try finding Google or Natural voices first
    const langMatches = list.filter((v) => v.lang.startsWith(langPrefix.slice(0, 2)));
    if (langMatches.length === 0) return list[0];

    const premiumMatch = langMatches.find(
      (v) => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Rishi')
    );
    return premiumMatch || langMatches[0];
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.activeUtterance = null;
    this.queue = [];
  }

  public pause(): void {
    if (this.synth && this.isSpeaking) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}
