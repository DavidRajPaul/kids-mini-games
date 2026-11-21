import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/src/components/PrimaryButton";
import { useGameSpeech } from "@/src/audio/useGameSpeech";
import { colors, radius, spacing, typography, shadows } from "@/src/theme/tokens";

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  stars: number; // 0..3
  onNext?: () => void;
  onHome: () => void;
  onRestart: () => void;
  nextLabel?: string;
}

/**
 * Calm, centered success dialog. No confetti, no flashing colors.
 * Three-star rating (filled/empty) shown at the top.
 */
export function SuccessDialog({
  visible,
  title,
  message,
  stars,
  onNext,
  onHome,
  onRestart,
  nextLabel = "Next Level",
}: Props) {
  const { language } = useGameSpeech();
  const tamil = language === "ta";
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      accessibilityViewIsModal
    >
      <View style={styles.backdrop}>
        <View style={styles.card} testID="success-dialog">
          <View style={styles.starsRow} testID="success-stars">
            {[0, 1, 2].map((i) => (
              <MaterialCommunityIcons
                key={i}
                name={i < stars ? "star" : "star-outline"}
                size={44}
                color={i < stars ? "#E0A200" : colors.borderStrong}
              />
            ))}
          </View>

          <Text style={styles.title}>{tamil ? "செம குட்டி! சூப்பர்! 🌟" : title}</Text>
          {message ? <Text style={styles.message}>{tamil ? "இன்னும் ஒரு லெவல் விளையாடலாமா?" : message}</Text> : null}

          <View style={styles.actions}>
            {onNext ? (
              <PrimaryButton
                testID="success-next-button"
                label={tamil ? "அடுத்த லெவல்" : nextLabel}
                onPress={onNext}
                variant="primary"
              />
            ) : null}
            <PrimaryButton
              testID="success-restart-button"
              label={tamil ? "மறுபடியும் விளையாடு" : "Play Again"}
              onPress={onRestart}
              variant="secondary"
            />
            <PrimaryButton
              testID="success-home-button"
              label={tamil ? "ஹோம்" : "Home"}
              onPress={onHome}
              variant="ghost"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(26, 54, 93, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    alignItems: "stretch",
    ...shadows.soft,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.displayLG,
    color: colors.onSurface,
    textAlign: "center",
  },
  message: {
    ...typography.body,
    color: colors.onSurfaceMuted,
    textAlign: "center",
    fontWeight: "500",
  },
  actions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
});
