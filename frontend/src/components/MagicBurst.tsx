import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp, FadeOut } from "react-native-reanimated";

/** Small, one-shot celebration. No flashing or endless animation loops. */
const STARS = [
  { x: 4, y: 42, glyph: "✦", color: "#E9A826" },
  { x: 17, y: 7, glyph: "✧", color: "#9F71C6" },
  { x: 33, y: 64, glyph: "★", color: "#4E9EBF" },
  { x: 52, y: 3, glyph: "✦", color: "#E7986F" },
  { x: 70, y: 60, glyph: "✧", color: "#65B893" },
  { x: 88, y: 22, glyph: "★", color: "#DA8DB8" },
];
export function MagicBurst({ visible, reduceMotion }: { visible: boolean; reduceMotion: boolean }) {
  if (!visible || reduceMotion) return null;
  return (
    <View testID="magic-reward" pointerEvents="none" accessible={false} style={styles.overlay}>
      {STARS.map((star, index) => (
        <Animated.View key={index} entering={FadeInUp.delay(index * 32).duration(350)} exiting={FadeOut.duration(180)}
          style={[styles.star, { left: `${star.x}%` as `${number}%`, top: `${star.y}%` as `${number}%` }]}
          accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Text style={{ fontSize: 35, color: star.color }}>{star.glyph}</Text>
        </Animated.View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
 overlay: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
 star: { position: "absolute" },
});
