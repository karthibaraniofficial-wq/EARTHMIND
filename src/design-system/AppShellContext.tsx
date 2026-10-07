import React, { createContext, useContext, useState, useEffect } from 'react';

export type ContextPanelMode = 'docked' | 'overlay';
export type DisclosureMode = 'focus' | 'data' | 'expert' | 'exhibition';

export interface AppShellContextValue {
  currentView: string;
  onNavigate: (view: string) => void;
  railExpanded: boolean;
  setRailExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  toggleRail: () => void;
  contextPanelOpen: boolean;
  setContextPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleContextPanel: () => void;
  contextPanelMode: ContextPanelMode;
  setContextPanelMode: (mode: ContextPanelMode) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  layoutDebug: boolean;
  setLayoutDebug: React.Dispatch<React.SetStateAction<boolean>>;
  toggleLayoutDebug: () => void;
  disclosureMode: DisclosureMode;
  setDisclosureMode: (mode: DisclosureMode) => void;
}

const AppShellContext = createContext<AppShellContextValue | null>(null);

export interface AppShellProviderProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const AppShellProvider: React.FC<AppShellProviderProps> = ({
  children,
  currentView,
  onNavigate,
}) => {
  const [railExpanded, setRailExpanded] = useState<boolean>(false);
  // Default to docked open on wide viewports (>= 1280px), closed on narrower
  const [contextPanelOpen, setContextPanelOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1280;
    }
    return false;
  });
  const [contextPanelMode, setContextPanelMode] = useState<ContextPanelMode>('docked');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [layoutDebug, setLayoutDebug] = useState<boolean>(false);
  const [disclosureMode, setDisclosureMode] = useState<DisclosureMode>('data');

  // Keyboard shortcut Ctrl+Shift+L toggles Layout Diagnostics
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setLayoutDebug((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When resizing to mobile/tablet, automatically switch context panel to overlay or close
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280 && contextPanelMode === 'docked' && contextPanelOpen) {
        setContextPanelMode('overlay');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [contextPanelMode, contextPanelOpen]);

  const toggleRail = () => setRailExpanded((prev) => !prev);
  const toggleContextPanel = () => setContextPanelOpen((prev) => !prev);
  const toggleLayoutDebug = () => setLayoutDebug((prev) => !prev);

  const value: AppShellContextValue = {
    currentView,
    onNavigate,
    railExpanded,
    setRailExpanded,
    toggleRail,
    contextPanelOpen,
    setContextPanelOpen,
    toggleContextPanel,
    contextPanelMode,
    setContextPanelMode,
    isMobileNavOpen,
    setIsMobileNavOpen,
    layoutDebug,
    setLayoutDebug,
    toggleLayoutDebug,
    disclosureMode,
    setDisclosureMode,
  };

  return (
    <AppShellContext.Provider value={value}>
      {children}
    </AppShellContext.Provider>
  );
};

export const useAppShell = (): AppShellContextValue => {
  const context = useContext(AppShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within an AppShellProvider');
  }
  return context;
};
