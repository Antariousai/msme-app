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
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';
import { Motion } from '../theme';

const pressSpring = { damping: 15, stiffness: 320, mass: 0.7 };

/** Press interaction styles — mirror the studio's :hover/:active transforms */
export type PressEffect = 'scale' | 'lift' | 'tool' | 'slideX' | 'none';

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
  /** @deprecated use `effect` */
  bounce?: boolean;
  /** Interaction style on press. Defaults to `scale`. */
  effect?: PressEffect;
  /** Show the expanding ripple overlay on press. */
  ripple?: boolean;
  rippleRadius?: number;
}

export const RipplePressable = ({
  children, onPress, disabled, style,
  bounce, effect, ripple: showRipple = true, rippleRadius = 20,
}: RipplePressableProps) => {
  const { colors } = useTheme();
  const fx: PressEffect = effect ?? (bounce === false ? 'none' : 'scale');
  const p = useSharedValue(0);
  const ripple = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => {
    const v = p.value;
    switch (fx) {
      case 'lift':
        return { transform: [{ translateY: -3 * v }, { scale: 1 - 0.04 * v }] };
      case 'tool':
        return { transform: [{ translateY: -4 * v }, { rotateZ: `${-1.5 * v}deg` }, { scale: 1 - 0.02 * v }] };
      case 'slideX':
        return { transform: [{ translateX: 4 * v }] };
      case 'none':
        return {};
      case 'scale':
      default:
        return { transform: [{ scale: 1 - 0.015 * v }] };
    }
  });

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
        if (showRipple) ripple.value = withTiming(1, { duration: Motion.rippleIn });
        if (fx !== 'none') p.value = withSpring(1, pressSpring);
      }}
      onPressOut={() => {
        if (showRipple) ripple.value = withTiming(0, { duration: Motion.rippleOut });
        if (fx !== 'none') p.value = withSpring(0, pressSpring);
      }}
    >
      <Animated.View style={[style, animStyle]}>
        {showRipple && (
          <Animated.View
            pointerEvents="none"
            style={[{
              ...StyleSheet.absoluteFillObject,
              borderRadius: rippleRadius,
              backgroundColor: colors.ripple,
            }, rippleStyle]}
          />
        )}
        {children}
      </Animated.View>
    </Pressable>
  );
};

interface SpinProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Seconds per full rotation */
  duration?: number;
}

/** Continuous rotation — mirrors `.hero .sparkle` spin */
export const Spin = ({ children, style, duration = 6 }: SpinProps) => {
  const rot = useSharedValue(0);
  useEffect(() => {
    rot.value = withRepeat(
      withTiming(360, { duration: duration * 1000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [duration, rot]);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rot.value}deg` }],
  }));
  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
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

/** One-shot bounce — mirrors studio nav `.item.on .ico` bounce */
interface BounceProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  active?: boolean;
}

export const Bounce = ({ children, style, active = true }: BounceProps) => {
  const ty = useSharedValue(0);
  useEffect(() => {
    if (!active) { ty.value = 0; return; }
    ty.value = withSequence(
      withTiming(-6, { duration: 240, easing: Easing.out(Easing.ease) }),
      withSpring(0, { damping: 12, stiffness: 220 }),
    );
  }, [active, ty]);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
  }));
  return <Animated.View style={[style, animStyle]}>{children}</Animated.View>;
};

export const slideDelay = (index: number) => index * Motion.stagger;
export const popDelay = slideDelay;
