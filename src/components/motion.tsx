import React, { useEffect } from 'react';
import { Pressable, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  FadeInRight,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { Motion } from '../theme';

const pressSpring = { damping: 16, stiffness: 360, mass: 0.7 };

interface SlideInProps {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

/** Entrance: slide-in from right */
export const SlideIn = ({ children, delay = 0, style }: SlideInProps) => (
  <Animated.View
    entering={FadeInRight.delay(delay).duration(Motion.duration).springify().damping(18).stiffness(280)}
    style={style}
  >
    {children}
  </Animated.View>
);

/** @deprecated use SlideIn */
export const PopIn = SlideIn;

interface RipplePressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  bounce?: boolean;
}

export const RipplePressable = ({
  children, onPress, disabled, style, bounce = true,
}: RipplePressableProps) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const ripple = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    opacity: ripple.value * 0.35,
    transform: [{ scale: 0.85 + ripple.value * 0.35 }],
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        if (disabled) return;
        ripple.value = withTiming(1, { duration: Motion.rippleIn });
        if (bounce) scale.value = withSpring(0.97, pressSpring);
      }}
      onPressOut={() => {
        ripple.value = withTiming(0, { duration: Motion.rippleOut });
        if (bounce) scale.value = withSpring(1, pressSpring);
      }}
    >
      <Animated.View style={[style, animStyle]}>
        <Animated.View
          pointerEvents="none"
          style={[{
            ...StyleSheet.absoluteFillObject,
            borderRadius: 20,
            backgroundColor: colors.ripple,
          }, rippleStyle]}
        />
        {children}
      </Animated.View>
    </Pressable>
  );
};

interface PulseProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  active?: boolean;
}

export const Pulse = ({ children, style, active = true }: PulseProps) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!active) {
      scale.value = 1;
      return;
    }
    scale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: Motion.pulseDuration }),
        withTiming(1, { duration: Motion.pulseDuration }),
      ),
      -1,
      true,
    );
  }, [active, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
};

export const slideDelay = (index: number) => index * Motion.stagger;
export const popDelay = slideDelay;
