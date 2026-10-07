import React from 'react';
import { useAppShell } from './AppShellContext';

export interface WorkspaceProps {
  children: React.ReactNode;
  sideRail?: React.ReactNode;
  contextPanel?: React.ReactNode;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  children,
  sideRail,
  contextPanel,
}) => {
  const { currentView, contextPanelOpen, contextPanelMode } = useAppShell();
  const isLanding = currentView === 'landing';

  return (
    <div className="earthmind-workspace">
      {/* Region 1: Side Rail Column */}
      {!isLanding && sideRail && (
        <div className="earthmind-side-rail-region hidden md:block">
          {sideRail}
        </div>
      )}

      {/* Region 2: Main Viewport Column */}
      <main className="earthmind-main-viewport custom-scrollbar">
        {children}
      </main>

      {/* Region 3: Context Panel Column (Only when docked on desktop) */}
      {!isLanding && contextPanel && contextPanelOpen && contextPanelMode === 'docked' && (
        <div className="earthmind-context-panel-region hidden lg:block">
          {contextPanel}
        </div>
      )}

      {/* Overlay Context Panel for smaller screens or overlay mode */}
      {!isLanding && contextPanel && contextPanelOpen && contextPanelMode === 'overlay' && (
        <>
          {contextPanel}
        </>
      )}
    </div>
  );
};
