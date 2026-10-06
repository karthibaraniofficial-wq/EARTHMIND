import React, { createContext, useContext, useState, useEffect } from 'react';
import { TwinConfig, DEFAULT_TWIN_CONFIG } from '../config/twinConfig';

interface TwinConfigContextType {
  config: TwinConfig;
  updateConfig: (updates: Partial<TwinConfig>) => void;
  resetConfig: () => void;
}

const TwinConfigContext = createContext<TwinConfigContextType>({
  config: DEFAULT_TWIN_CONFIG,
  updateConfig: () => {},
  resetConfig: () => {},
});

const STORAGE_KEY = 'earthmind_twin_v3_config';

export const TwinConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<TwinConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_TWIN_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse stored twin config, using defaults:', e);
    }
    return DEFAULT_TWIN_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to persist twin config:', e);
    }
  }, [config]);

  const updateConfig = (updates: Partial<TwinConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_TWIN_CONFIG);
  };

  return (
    <TwinConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </TwinConfigContext.Provider>
  );
};

export const useTwinConfig = () => useContext(TwinConfigContext);
