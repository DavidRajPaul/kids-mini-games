import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing, typography } from "@/src/theme/tokens";

interface Props {
  title?: string;
  onHome: () => void;
  onRestart: () => void;
  onBack?: () => void;
}

/**
 * Consistent top bar used across every game screen.
 * Left: Back (optional). Center: title. Right: Restart + Home.
 * All icon buttons are 48x48pt minimum.
 */
export function GameTopBar({ title, onHome, onRestart, onBack }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {onBack ? (
          <IconButton
            testID="game-back-button"
            name="arrow-left"
            tint={colors.surfaceTinted}
            color={colors.onSurface}
            onPress={onBack}
          />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {title ? (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View />
      )}

      <View style={[styles.side, styles.rightGroup]}>
        <IconButton
          testID="game-restart-button"
          name="refresh"
          tint={colors.pastelOrangeTint}
          color={colors.onPastelOrange}
          onPress={onRestart}
        />
        <IconButton
          testID="game-home-button"
          name="home"
          tint={colors.softBlueTint}
          color={colors.onSoftBlue}
          onPress={onHome}
        />
      </View>
    </View>
  );
}

function IconButton({
  name,
  tint,
  color,
  onPress,
  testID,
}: {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: string;
  color: string;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconBtn,
        { backgroundColor: tint, opacity: pressed ? 0.85 : 1 },
      ]}
      hitSlop={8}
    >
      <MaterialCommunityIcons name={name} size={26} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  side: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 56,
  },
  rightGroup: {
    gap: spacing.sm,
    justifyContent: "flex-end",
  },
  placeholder: {
    width: 48,
    height: 48,
  },
  title: {
    flex: 1,
    textAlign: "center",
    ...typography.subtitle,
    color: colors.onSurface,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
