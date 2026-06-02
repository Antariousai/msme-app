import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorPalette, lightPalette, darkPalette } from './palettes';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'antarious:theme:mode';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ColorPalette;
  isDark: boolean;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  colors: lightPalette,
  isDark: false,
  toggleMode: () => {},
  setMode: () => {},
});

/** Mutable Colors ref — synced on theme change for legacy imports */
export const Colors: ColorPalette = { ...lightPalette };

function syncColors(palette: ColorPalette) {
  (Object.keys(palette) as (keyof ColorPalette)[]).forEach((key) => {
    Colors[key] = palette[key];
  });
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const colors = mode === 'dark' ? darkPalette : lightPalette;

  useEffect(() => {
    syncColors(colors);
  }, [colors]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'dark' || stored === 'light') setModeState(stored);
    });
  }, []);

  const setMode = async (next: ThemeMode) => {
    setModeState(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  };

  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ mode, colors, isDark: mode === 'dark', toggleMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
