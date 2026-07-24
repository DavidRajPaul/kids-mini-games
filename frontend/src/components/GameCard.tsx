import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { colors, radius, spacing, typography, shadows, durations } from "@/src/theme/tokens";

interface Props {
  title: string;
  subtitle?: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: string; // tile bg tint
  iconColor: string;
  onPress: () => void;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Large tactile card used on the Home screen for each game.
 * Left: coloured icon tile. Center: title + subtitle. Right: gentle chevron.
 */
export function GameCard({ title, subtitle, icon, tint, iconColor, onPress, testID }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      onPressIn={() => (scale.value = withTiming(0.98, { duration: durations.press }))}
      onPressOut={() => (scale.value = withTiming(1, { duration: durations.press }))}
      onPress={onPress}
      style={[styles.card, shadows.soft, animatedStyle]}
    >
      <View style={[styles.iconTile, { backgroundColor: tint }]}>
        <MaterialCommunityIcons name={icon} size={44} color={iconColor} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text> : null}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={30} color={colors.onSurfaceMuted} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconTile: {
    width: 76,
    height: 76,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...typography.subtitle,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.onSurfaceMuted,
    fontWeight: "500",
  },
});
