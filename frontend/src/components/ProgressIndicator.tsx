import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/src/theme/tokens";

interface Props {
  current: number; // 1-based
  total: number;
  label?: string;
}

/**
 * Calm progress indicator — soft filled pill segments.
 * No numbers screaming, just a gentle visual.
 */
export function ProgressIndicator({ current, total, label }: Props) {
  const clamped = Math.max(0, Math.min(current, total));
  return (
    <View style={styles.wrap} testID="progress-indicator">
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              { backgroundColor: i < clamped ? colors.softGreen : colors.surfaceTinted },
            ]}
          />
        ))}
      </View>
      <Text style={styles.count} testID="progress-count">
        {clamped} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.onSurfaceMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    gap: 6,
  },
  segment: {
    flex: 0,
    width: 28,
    height: 8,
    borderRadius: radius.pill,
  },
  count: {
    ...typography.caption,
    color: colors.onSurfaceMuted,
  },
});
