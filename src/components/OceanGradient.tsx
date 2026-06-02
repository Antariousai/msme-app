import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from '../theme';
import { useTheme } from '../theme/ThemeContext';

interface OceanGradientProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Soft background wash instead of hero gradient */
  soft?: boolean;
}

export const OceanGradient = ({ children, style, soft = false }: OceanGradientProps) => {
  const { isDark } = useTheme();
  const gradientColors = soft
    ? (isDark ? Gradients.softDark : Gradients.soft)
    : Gradients.hero;

  return (
    <LinearGradient
      colors={[...gradientColors] as [string, string, ...string[]]}
      locations={soft ? undefined : [...Gradients.heroLocations]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};
