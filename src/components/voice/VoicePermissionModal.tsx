import React, { useState, useEffect } from 'react';
import { Mic, ShieldCheck, AlertCircle, X, Check } from 'lucide-react';
import { GlassModal } from '../glass/GlassModal';
import { GlassButton } from '../glass/GlassButton';
import { useVoice } from '../../voice/VoiceContext';
import { checkMicrophonePermission, requestMicrophoneAccess } from '../../voice/VoicePermissions';
import { MicrophonePermissionState } from '../../voice/VoiceTypes';

export const VoicePermissionModal: React.FC = () => {
  const { isPermissionModalOpen, setIsPermissionModalOpen, startListening } = useVoice();
  const [permState, setPermState] = useState<MicrophonePermissionState>('prompt');
  const [requestError, setRequestError] = useState<string | null>(null);

  useEffect(() => {
    if (isPermissionModalOpen) {
      checkMicrophonePermission().then((status) => setPermState(status));
    }
  }, [isPermissionModalOpen]);

  if (!isPermissionModalOpen) return null;

  const handleAllowMic = async () => {
    setRequestError(null);
    const res = await requestMicrophoneAccess();
    if (res.granted) {
      setPermState('granted');
      setIsPermissionModalOpen(false);
      // Start listening directly after user explicit grant
      startListening();
    } else {
      setRequestError(res.error || 'Permission was denied by browser.');
      setPermState('denied');
    }
  };

  return (
    <GlassModal
      isOpen={isPermissionModalOpen}
      onClose={() => setIsPermissionModalOpen(false)}
      title="Enable EarthMind Voice"
      subtitle="Hands-free environmental digital twin operation and reasoning"
      maxWidth="md"
    >
      <div className="space-y-5">
        <div className="flex items-start gap-4 p-4 rounded-2xl glass-panel-2 border border-earth-aqua/30">
          <div className="p-3 rounded-xl bg-earth-aqua/20 border border-earth-aqua/40 flex-shrink-0">
            <Mic className="w-6 h-6 text-earth-aqua" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Spoken Interface Control</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Voice access lets you control the EarthMind interface using spoken commands. Explore biomes, adjust simulation levers, scrub through satellite history, and present to judges hands-free.
            </p>
          </div>
        </div>

        {/* Privacy Promise */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center gap-2 font-bold text-earth-emerald">
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy Standard</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Your microphone is only active while listening. Raw audio is never stored or uploaded to external servers without explicit consent. Local speech recognition runs safely inside your browser.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between p-3 rounded-xl glass-panel-1 border border-white/10 text-xs font-mono">
          <span className="text-slate-400">Browser Permission Status:</span>
          <span
            className={`px-2 py-0.5 rounded font-bold uppercase ${
              permState === 'granted'
                ? 'bg-earth-emerald/20 text-earth-emerald'
                : permState === 'denied'
                ? 'bg-earth-coral/20 text-earth-coral'
                : 'bg-earth-sun/20 text-earth-sun'
            }`}
          >
            {permState}
          </span>
        </div>

        {requestError && (
          <div className="p-3 rounded-xl bg-earth-coral/15 border border-earth-coral/30 flex items-start gap-2.5 text-xs text-earth-coral">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Microphone Access Blocked</div>
              <div className="mt-0.5 text-[11px] text-slate-300">
                Please click the microphone icon in your browser URL address bar to grant access, or check your OS sound settings.
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => setIsPermissionModalOpen(false)}
          >
            Not Now
          </GlassButton>

          <GlassButton
            variant="primary"
            size="sm"
            onClick={handleAllowMic}
            leftIcon={<Mic className="w-4 h-4" />}
          >
            Allow Microphone
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
