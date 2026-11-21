import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Particle = {
  x: number; y: number; symbol: string; size: number; delay: number;
  duration: number; distance: number;
};

// Fixed particle positions prevent a different layout on every render.
// Nine inexpensive animated text glyphs: no canvas, timers, or image downloads.
const PARTICLES: Particle[] = [
  { x: 5, y: 18, symbol: "✦", size: 24, delay: 0, duration: 2800, distance: 12 },
  { x: 18, y: 72, symbol: "●", size: 11, delay: 240, duration: 3400, distance: 17 },
  { x: 31, y: 5, symbol: "✧", size: 21, delay: 470, duration: 3100, distance: 15 },
  { x: 78, y: 11, symbol: "✦", size: 26, delay: 150, duration: 3700, distance: 10 },
  { x: 94, y: 41, symbol: "●", size: 13, delay: 660, duration: 3200, distance: 13 },
  { x: 85, y: 84, symbol: "✧", size: 22, delay: 850, duration: 3900, distance: 14 },
  { x: 9, y: 92, symbol: "★", size: 16, delay: 340, duration: 3600, distance: 12 },
  { x: 56, y: 4, symbol: "●", size: 9, delay: 510, duration: 3000, distance: 13 },
  { x: 64, y: 87, symbol: "✦", size: 18, delay: 710, duration: 3500, distance: 11 },
];
const COLORS = ["#D48AC7", "#62B5DE", "#FFAD52", "#68B99A", "#B58CE0"];

function FloatingParticle({ item, index, active }: { item: Particle; index: number; active: boolean }) {
  const travel = useSharedValue(0);
  const alpha = useSharedValue(0.48);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      cancelAnimation(travel);
      cancelAnimation(alpha);
      cancelAnimation(rotation);
      travel.value = 0;
      alpha.value = 0;
      rotation.value = 0;
      return;
    }
    travel.value = withDelay(item.delay, withRepeat(
      withSequence(
        withTiming(-item.distance, { duration: item.duration, easing: Easing.inOut(Easing.sin) }),
        withTiming(item.distance / 2, { duration: item.duration, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    ));
    alpha.value = withDelay(item.delay, withRepeat(
      withSequence(
        withTiming(0.84, { duration: item.duration, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.35, { duration: item.duration, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    ));
    rotation.value = withDelay(item.delay, withRepeat(
      withSequence(
        withTiming(12, { duration: item.duration }),
        withTiming(-12, { duration: item.duration }),
      ),
      -1,
      false,
    ));
    return () => {
      cancelAnimation(travel);
      cancelAnimation(alpha);
      cancelAnimation(rotation);
    };
  }, [active, item, travel, alpha, rotation]);

  const motion = useAnimatedStyle(() => ({
    opacity: alpha.value,
    transform: [
      { translateY: travel.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[styles.particle, { left: `${item.x}%` as `${number}%`, top: `${item.y}%` as `${number}%` }, motion]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text style={{ fontSize: item.size, lineHeight: item.size + 7, color: COLORS[index % COLORS.length] }}>
        {item.symbol}
      </Text>
    </Animated.View>
  );
}

/** Decorative only: never catches touches or appears to assistive technology. */
export function SparkleField({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <View testID="home-particles" pointerEvents="none" accessible={false} style={StyleSheet.absoluteFillObject}>
      {PARTICLES.map((item, index) => (
        <FloatingParticle key={index} item={item} index={index} active={active} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: { position: "absolute" },
});
