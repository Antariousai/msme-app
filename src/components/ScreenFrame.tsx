import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { OceanGradient } from './OceanGradient';
import { useTheme } from '../theme/ThemeContext';

interface ScreenFrameProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Soft diagonal screen background — theme-aware */
export const ScreenFrame = ({ children, style }: ScreenFrameProps) => {
  const { colors } = useTheme();
  return (
    <OceanGradient soft style={[{ flex: 1, backgroundColor: colors.bg }, style]}>
      {children}
    </OceanGradient>
  );
};

/** Hook for dynamic screen container style */
export const useScreenContainer = () => {
  const { colors } = useTheme();
  return { flex: 1 as const, backgroundColor: colors.bg };
};
