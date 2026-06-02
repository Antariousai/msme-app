import React, { useEffect } from 'react';
import { Pressable, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { Motion } from '../theme';

const popSpring = { damping: 14, stiffness: 420, mass: 0.65 };

interface PopInProps {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

/** Entrance: pop scale-in */
export const PopIn = ({ children, delay = 0, style }: PopInProps) => (
  <Animated.View
    entering={FadeIn.delay(delay).duration(Motion.duration).springify().damping(14).stiffness(420)}
    style={style}
  >
    {children}
  </Animated.View>
);

interface RipplePressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Subtle bounce on press */
  bounce?: boolean;
}

/** Tap ripple + optional bounce */
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
        if (bounce) scale.value = withSpring(0.97, popSpring);
      }}
      onPressOut={() => {
        ripple.value = withTiming(0, { duration: Motion.rippleOut });
        if (bounce) scale.value = withSpring(1, popSpring);
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

/** Gentle pulse for playful accents */
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

/** Stagger delay helper for lists */
export const popDelay = (index: number) => index * Motion.stagger;
