import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { GlassModal } from '../glass/GlassModal';
import { GlassButton } from '../glass/GlassButton';
import { useVoice } from '../../voice/VoiceContext';

export const VoiceConfirmationModal: React.FC = () => {
  const { confirmation } = useVoice();

  if (!confirmation.isOpen) return null;

  return (
    <GlassModal
      isOpen={confirmation.isOpen}
      onClose={confirmation.cancel}
      title="Voice Command Confirmation"
      subtitle="Safety check for sensitive or uncertain operation"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-earth-coral/10 border border-earth-coral/30">
          <AlertTriangle className="w-5 h-5 text-earth-coral flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-200 leading-relaxed font-mono">
            {confirmation.prompt}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={confirmation.cancel}
            leftIcon={<X className="w-3.5 h-3.5" />}
          >
            Cancel
          </GlassButton>

          <GlassButton
            variant="danger"
            size="sm"
            onClick={confirmation.confirm}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Confirm
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
