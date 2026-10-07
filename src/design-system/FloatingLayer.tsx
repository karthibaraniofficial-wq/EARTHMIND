import React from 'react';
import { VoiceDock } from './VoiceDock';
import { EarthMindCopilot } from '../components/navigation/EarthMindCopilot';

export interface FloatingLayerProps {
  children?: React.ReactNode;
}

export const FloatingLayer: React.FC<FloatingLayerProps> = ({ children }) => {
  return (
    <div
      data-region="floating-layer"
      className="pointer-events-none fixed inset-0 z-[50] overflow-hidden"
    >
      {/* Voice Dock docked cleanly at bottom-right safe-zone */}
      <VoiceDock />

      {/* Additional application-level floating elements */}
      {children}
    </div>
  );
};
