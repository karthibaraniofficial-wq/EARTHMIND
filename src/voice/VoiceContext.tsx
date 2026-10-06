import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { VoiceState, VoiceSettingsConfig, ParsedVoiceCommand } from './VoiceTypes';
import { loadVoiceSettings, saveVoiceSettings } from './VoiceSettings';
import { VoiceEngine } from './VoiceEngine';
import { AppActionContext } from './VoiceActionExecutor';

interface VoiceContextValue {
  state: VoiceState;
  isListening: boolean;
  isSpeaking: boolean;
  liveTranscript: string;
  isFinalTranscript: boolean;
  audioLevel: number;
  lastCommand: ParsedVoiceCommand | null;
  lastResponse: string;
  settings: VoiceSettingsConfig;
  updateSettings: (patch: Partial<VoiceSettingsConfig>) => void;
  startListening: () => Promise<boolean>;
  stopListening: () => void;
  toggleListening: () => void;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  processTextInputCommand: (text: string) => Promise<void>;
  confirmation: {
    isOpen: boolean;
    prompt: string;
    confirm: () => void;
    cancel: () => void;
  };
  isVoicePanelOpen: boolean;
  setIsVoicePanelOpen: (open: boolean) => void;
  toggleVoicePanel: () => void;
  isVoiceSettingsOpen: boolean;
  setIsVoiceSettingsOpen: (open: boolean) => void;
  toggleVoiceSettings: () => void;
  isTestConsoleOpen: boolean;
  setIsTestConsoleOpen: (open: boolean) => void;
  toggleTestConsole: () => void;
  isPermissionModalOpen: boolean;
  setIsPermissionModalOpen: (open: boolean) => void;
  setAppContext: (ctx: AppActionContext) => void;
  geminiStatus: import('../lib/gemini/GeminiEvents').GeminiLiveConnectionStatus;
  geminiLatency: number;
  activeEngineMode: 'gemini_live' | 'local_fallback';
}

const VoiceContext = createContext<VoiceContextValue | null>(null);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<VoiceSettingsConfig>(() => loadVoiceSettings());
  const [state, setState] = useState<VoiceState>('IDLE');
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [isFinalTranscript, setIsFinalTranscript] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [lastCommand, setLastCommand] = useState<ParsedVoiceCommand | null>(null);
  const [lastResponse, setLastResponse] = useState<string>('');

  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    prompt: string;
    onConfirm: () => void;
    onCancel: () => void;
  }>({
    isOpen: false,
    prompt: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const [isVoicePanelOpen, setIsVoicePanelOpen] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);
  const [isTestConsoleOpen, setIsTestConsoleOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<import('../lib/gemini/GeminiEvents').GeminiLiveConnectionStatus>('DISCONNECTED');
  const [geminiLatency, setGeminiLatency] = useState<number>(0);
  const [activeEngineMode, setActiveEngineMode] = useState<'gemini_live' | 'local_fallback'>('gemini_live');

  const engineRef = useRef<VoiceEngine | null>(null);

  if (!engineRef.current) {
    engineRef.current = new VoiceEngine(settings);
  }

  // Register Engine Listener
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.setListener({
      onStateChange: (newState) => {
        setState(newState);
      },
      onLiveTranscript: (text, isFinal) => {
        setLiveTranscript(text);
        setIsFinalTranscript(isFinal);
      },
      onAudioLevel: (lvl) => {
        setAudioLevel(lvl);
      },
      onLastCommand: (cmd) => {
        setLastCommand(cmd);
      },
      onLastResponse: (res) => {
        setLastResponse(res);
      },
      onRequestConfirmation: (prompt, onConfirm, onCancel) => {
        setConfirmation({
          isOpen: true,
          prompt,
          onConfirm: () => {
            setConfirmation((prev) => ({ ...prev, isOpen: false }));
            onConfirm();
          },
          onCancel: () => {
            setConfirmation((prev) => ({ ...prev, isOpen: false }));
            onCancel();
          },
        });
      },
      onGeminiStatusChange: (st) => {
        setGeminiStatus(st);
        if (engineRef.current) {
          setActiveEngineMode(engineRef.current.getActiveEngineMode());
        }
      },
      onLatencyUpdate: (ms) => {
        setGeminiLatency(ms);
      },
    });
  }, []);

  // Update engine when settings change
  const handleUpdateSettings = (patch: Partial<VoiceSettingsConfig>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...patch };
      saveVoiceSettings(updated);
      engineRef.current?.updateSettings(updated);
      return updated;
    });
  };

  const setAppContext = (ctx: AppActionContext) => {
    engineRef.current?.setAppContext(ctx);
  };

  const startListening = async (): Promise<boolean> => {
    if (!engineRef.current) return false;
    return await engineRef.current.startListening();
  };

  const stopListening = () => {
    engineRef.current?.stopListening();
  };

  const toggleListening = () => {
    if (state === 'LISTENING') {
      stopListening();
    } else {
      startListening();
    }
  };

  const speak = async (text: string) => {
    await engineRef.current?.speak(text);
  };

  const stopSpeaking = () => {
    engineRef.current?.stopSpeaking();
  };

  const processTextInputCommand = async (text: string) => {
    await engineRef.current?.processTranscript(text);
  };

  // Keyboard shortcut listeners (Ctrl+Shift+V for Voice, Space for PTT when safe, Esc to cancel)
  useEffect(() => {
    const isTextInputActive = () => {
      const active = document.activeElement;
      if (!active) return false;
      const tag = active.tagName.toLowerCase();
      return (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        (active as HTMLElement).isContentEditable
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Toggle voice with Ctrl+Shift+V or Cmd+Shift+V
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        toggleListening();
        return;
      }

      // 2. Escape: stop listening or stop speaking
      if (e.key === 'Escape') {
        if (state === 'LISTENING') {
          stopListening();
        } else if (state === 'SPEAKING') {
          stopSpeaking();
        }
        return;
      }

      // 3. Push to talk via Space (only if enabled, and NOT while inside form inputs)
      if (
        settings.mode === 'push_to_talk' &&
        e.code === 'Space' &&
        !e.repeat &&
        !isTextInputActive()
      ) {
        e.preventDefault();
        if (state !== 'LISTENING') {
          startListening();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        settings.mode === 'push_to_talk' &&
        e.code === 'Space' &&
        !isTextInputActive()
      ) {
        if (state === 'LISTENING') {
          stopListening();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state, settings.mode]);

  const value: VoiceContextValue = useMemo(
    () => ({
      state,
      isListening: state === 'LISTENING',
      isSpeaking: state === 'SPEAKING',
      liveTranscript,
      isFinalTranscript,
      audioLevel,
      lastCommand,
      lastResponse,
      settings,
      updateSettings: handleUpdateSettings,
      startListening,
      stopListening,
      toggleListening,
      speak,
      stopSpeaking,
      processTextInputCommand,
      confirmation: {
        isOpen: confirmation.isOpen,
        prompt: confirmation.prompt,
        confirm: confirmation.onConfirm,
        cancel: confirmation.onCancel,
      },
      isVoicePanelOpen,
      setIsVoicePanelOpen,
      toggleVoicePanel: () => setIsVoicePanelOpen((prev) => !prev),
      isVoiceSettingsOpen,
      setIsVoiceSettingsOpen,
      toggleVoiceSettings: () => setIsVoiceSettingsOpen((prev) => !prev),
      isTestConsoleOpen,
      setIsTestConsoleOpen,
      toggleTestConsole: () => setIsTestConsoleOpen((prev) => !prev),
      isPermissionModalOpen,
      setIsPermissionModalOpen,
      setAppContext,
      geminiStatus,
      geminiLatency,
      activeEngineMode,
    }),
    [
      state,
      liveTranscript,
      isFinalTranscript,
      audioLevel,
      lastCommand,
      lastResponse,
      settings,
      confirmation,
      isVoicePanelOpen,
      isVoiceSettingsOpen,
      isTestConsoleOpen,
      isPermissionModalOpen,
      geminiStatus,
      geminiLatency,
      activeEngineMode,
    ]
  );

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};

export const useVoice = (): VoiceContextValue => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
