import { VoiceCapabilities } from './VoiceTypes';

export function detectVoiceCapabilities(): VoiceCapabilities {
  const hasRecognition = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const hasSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const hasWebAudio = typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window);

  return {
    speechRecognition: !!hasRecognition,
    speechSynthesis: !!hasSynthesis,
    webAudio: !!hasWebAudio,
    streaming: !!hasRecognition,
    interruption: !!hasSynthesis,
    wakeWordAvailable: !!hasRecognition,
  };
}
