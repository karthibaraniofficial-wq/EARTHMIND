import React from 'react';
import { AppShellProvider, useAppShell } from './AppShellContext';
import { LayoutDebugOverlay } from './LayoutDebugOverlay';

interface AppShellInnerProps {
  topBar?: React.ReactNode;
  children: React.ReactNode;
  statusBar?: React.ReactNode;
  floatingLayer?: React.ReactNode;
}

const AppShellInner: React.FC<AppShellInnerProps> = ({
  topBar,
  children,
  statusBar,
  floatingLayer,
}) => {
  const { currentView, railExpanded, contextPanelOpen, contextPanelMode, layoutDebug } = useAppShell();
  const isLanding = currentView === 'landing';

  // Dynamic CSS variables injected on shell container
  const shellStyle: React.CSSProperties = {
    '--rail-width': isLanding ? '0px' : railExpanded ? '260px' : '64px',
    '--context-width': isLanding || !contextPanelOpen || contextPanelMode === 'overlay' ? '0px' : 'clamp(340px, 26vw, 420px)',
    '--topbar-height': '56px',
    '--statusbar-height': '36px',
  } as React.CSSProperties;

  return (
    <div
      className="earthmind-app-shell aurora-bg font-sans selection:bg-earth-aqua/30 selection:text-white"
      style={shellStyle}
    >
      {/* 1. Top Bar Region */}
      {topBar}

      {/* 2. Primary Workspace (Grid of Rail, Viewport, Context Panel) */}
      {children}

      {/* 3. Status Bar Footer */}
      {statusBar}

      {/* 4. Centralized Floating Layer */}
      {floatingLayer}

      {/* 5. Development Layout Diagnostics Overlay */}
      {layoutDebug && <LayoutDebugOverlay />}
    </div>
  );
};

export interface AppShellProps {
  currentView: string;
  onNavigate: (view: string) => void;
  topBar?: React.ReactNode;
  children: React.ReactNode;
  statusBar?: React.ReactNode;
  floatingLayer?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentView,
  onNavigate,
  topBar,
  children,
  statusBar,
  floatingLayer,
}) => {
  return (
    <AppShellProvider currentView={currentView} onNavigate={onNavigate}>
      <AppShellInner topBar={topBar} statusBar={statusBar} floatingLayer={floatingLayer}>
        {children}
      </AppShellInner>
    </AppShellProvider>
  );
};
