import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Pressable, ViewStyle, StyleProp, StyleSheet, View,
  Animated as RNAnimated,
} from 'react-native';
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

interface RippleCircle {
  id: number;
  x: number;
  y: number;
  anim: RNAnimated.Value;
}

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
  /** Show the expanding ripple. Default true. */
  ripple?: boolean;
  /** Override ripple circle color. Defaults to theme `colors.ripple`. */
  rippleColor?: string;
  /** @deprecated — no longer used (radius comes from diameter calculation) */
  rippleRadius?: number;
}

export const RipplePressable = ({
  children, onPress, disabled, style,
  bounce, effect, ripple: showRipple = true, rippleColor, rippleRadius: _r,
}: RipplePressableProps) => {
  const { colors } = useTheme();
  const circleColor = rippleColor ?? colors.ripple;
  const fx: PressEffect = effect ?? (bounce === false ? 'none' : 'scale');
  const p = useSharedValue(0);

  // ── press-effect transform (Reanimated) ──
  const animStyle = useAnimatedStyle(() => {
    const v = p.value;
    switch (fx) {
      case 'lift':    return { transform: [{ translateY: -3 * v }, { scale: 1 - 0.04 * v }] };
      case 'tool':    return { transform: [{ translateY: -4 * v }, { rotateZ: `${-1.5 * v}deg` }, { scale: 1 - 0.02 * v }] };
      case 'slideX':  return { transform: [{ translateX: 4 * v }] };
      case 'none':    return {};
      default:        return { transform: [{ scale: 1 - 0.015 * v }] };
    }
  });

  // ── proper expanding-circle ripple (RN Animated) ──
  const [ripples, setRipples] = useState<RippleCircle[]>([]);
  const rippleId = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0 });

  const spawnRipple = useCallback((x: number, y: number) => {
    const id = ++rippleId.current;
    const anim = new RNAnimated.Value(0);
    setRipples((prev) => [...prev, { id, x, y, anim }]);
    RNAnimated.timing(anim, {
      toValue: 1,
      duration: 600,
      easing: (t) => t, // linear — mirrors @keyframes rip
      useNativeDriver: true,
    }).start(() => setRipples((prev) => prev.filter((r) => r.id !== id)));
  }, []);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={(e) => {
        if (disabled) return;
        if (showRipple) spawnRipple(e.nativeEvent.locationX, e.nativeEvent.locationY);
        if (fx !== 'none') p.value = withSpring(1, pressSpring);
      }}
      onPressOut={() => {
        if (fx !== 'none') p.value = withSpring(0, pressSpring);
      }}
    >
      <Animated.View style={[style, animStyle, { overflow: 'hidden' }]}>
        {/* ripple circles rendered beneath children */}
        <View
          pointerEvents="none"
          style={StyleSheet.absoluteFillObject}
          onLayout={(e) => {
            sizeRef.current = {
              width: e.nativeEvent.layout.width,
              height: e.nativeEvent.layout.height,
            };
          }}
        >
          {showRipple && ripples.map((r) => {
            const diameter = Math.max(sizeRef.current.width, sizeRef.current.height) * 2.6;
            return (
              <RNAnimated.View
                key={r.id}
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  width: diameter,
                  height: diameter,
                  borderRadius: diameter / 2,
                  backgroundColor: circleColor,
                  left: r.x - diameter / 2,
                  top: r.y - diameter / 2,
                  transform: [{
                    scale: r.anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  }],
                  opacity: r.anim.interpolate({
                    inputRange: [0, 0.25, 1],
                    outputRange: [1, 0.55, 0],
                  }),
                }}
              />
            );
          })}
        </View>
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
    // reverse=false — sequence already returns to 1, so no double-bump
    scale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: Motion.pulseDuration }),
        withTiming(1, { duration: Motion.pulseDuration }),
      ),
      -1,
      false,
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
