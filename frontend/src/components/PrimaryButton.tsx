import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle, StyleProp } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { colors, radius, spacing, typography, shadows, durations } from "@/src/theme/tokens";

type Variant = "primary" | "secondary" | "ghost";

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Chunky, tactile button with a gentle scale-down on press.
 * 48dp minimum height, generous horizontal padding, rounded corners.
 */
export function PrimaryButton({ label, onPress, variant = "primary", disabled, testID, style }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const palette = getPalette(variant);

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPressIn={() => (scale.value = withTiming(0.96, { duration: durations.press }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: durations.press }))}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[
        styles.base,
        { backgroundColor: palette.bg, borderColor: palette.border },
        variant !== "ghost" && shadows.softer,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </AnimatedPressable>
  );
}

function getPalette(v: Variant) {
  if (v === "primary") return { bg: colors.softBlue, text: colors.onSoftBlue, border: colors.softBlue };
  if (v === "secondary") return { bg: colors.softGreen, text: colors.onSoftGreen, border: colors.softGreen };
  return { bg: "transparent", text: colors.onSurface, border: colors.border };
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    ...typography.subtitle,
  },
  disabled: {
    opacity: 0.5,
  },
});
