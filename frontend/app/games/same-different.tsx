import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useSoundEffects } from "@/src/audio/useSoundEffects";
import { GameBackground } from "@/src/components/GameBackground";
import { GameTopBar } from "@/src/components/GameTopBar";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ProgressIndicator } from "@/src/components/ProgressIndicator";
import { QuestionText } from "@/src/components/QuestionText";
import { SuccessDialog } from "@/src/components/SuccessDialog";
import { CompareItem, pickCompareRound } from "@/src/data/compare";
import { bumpTimesPlayed, saveProgress } from "@/src/storage/progress";
import { colors, radius, spacing, typography, shadows, durations } from "@/src/theme/tokens";

/**
 * Game 4: Same or Different.
 * Two tiles are shown side-by-side. Child chooses "Same" or "Different".
 * L1 tiles are from different categories (very distinct).
 * L3 uses the same icon with a subtle color shift.
 */

type Level = 1 | 2 | 3;
const ROUNDS_PER_LEVEL = 4;
const GAME_ID = "same-different" as const;

interface RoundState {
  left: CompareItem;
  right: CompareItem;
  isSame: boolean;
}

export default function SameDifferentScreen() {
  const router = useRouter();
  const playSound = useSoundEffects();

  const [level, setLevel] = useState<Level>(1);
  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState<RoundState>(() => pickCompareRound(1));
  const [wrong, setWrong] = useState<"same" | "different" | null>(null);
  const [levelWrong, setLevelWrong] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    bumpTimesPlayed(GAME_ID).catch(() => {});
  }, []);

  const startLevel = useCallback((next: Level) => {
    setLevel(next);
    setRoundIndex(0);
    setLevelWrong(0);
    setWrong(null);
    setRound(pickCompareRound(next));
    setShowSuccess(false);
  }, []);

  const handlePick = (pick: "same" | "different") => {
    const correct = round.isSame ? "same" : "different";
    if (pick === correct) {
      playSound("correct");
      setWrong(null);
      setTimeout(() => {
        if (roundIndex + 1 >= ROUNDS_PER_LEVEL) {
          const stars = starsFor(levelWrong);
          saveProgress(GAME_ID, {
            highestLevel: Math.min(3, level + 1),
            starsEarned: stars,
            completed: level === 3,
          }).catch(() => {});
          playSound(level === 3 ? "complete" : "star");
          setShowSuccess(true);
        } else {
          setRoundIndex((i) => i + 1);
          setRound(pickCompareRound(level));
        }
      }, 320);
    } else {
      playSound("wrong");
      setWrong(pick);
      setLevelWrong((n) => n + 1);
    }
  };

  const stars = starsFor(levelWrong);

  return (
    <GameBackground>
      <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
        <GameTopBar
          title={`Level ${level}`}
          onHome={() => { playSound("button"); router.replace("/"); }}
          onRestart={() => { playSound("button"); startLevel(1); }}
          onBack={() => { playSound("button"); router.back(); }}
        />

        <View style={styles.content}>
          <View style={styles.progressWrap}>
            <ProgressIndicator
              current={roundIndex + (showSuccess ? 1 : 0)}
              total={ROUNDS_PER_LEVEL}
              label="Round"
            />
          </View>

          <Animated.View
            key={`q-${level}-${roundIndex}`}
            entering={FadeIn.duration(durations.fade)}
            exiting={FadeOut.duration(durations.fade)}
            style={styles.questionBlock}
          >
            <Text style={styles.prompt}>Are they</Text>
            <QuestionText>Same or Different?</QuestionText>
          </Animated.View>

          <View style={styles.pair} testID="compare-pair">
            <CompareTile item={round.left} testID="compare-left" />
            <View style={styles.vs}>
              <MaterialCommunityIcons name="dots-horizontal" size={30} color={colors.onSurfaceMuted} />
            </View>
            <CompareTile item={round.right} testID="compare-right" />
          </View>

          <View style={styles.actions}>
            <View style={styles.actionWrap}>
              <PrimaryButton
                testID="same-btn"
                label="Same"
                variant={wrong === "same" ? "ghost" : "secondary"}
                onPress={() => handlePick("same")}
              />
            </View>
            <View style={styles.actionWrap}>
              <PrimaryButton
                testID="different-btn"
                label="Different"
                variant={wrong === "different" ? "ghost" : "primary"}
                onPress={() => handlePick("different")}
              />
            </View>
          </View>
        </View>

        <SuccessDialog
          visible={showSuccess}
          title={level === 3 ? "Super observation!" : "Well spotted!"}
          message={level === 3 ? "You finished all levels." : `Ready for level ${level + 1}.`}
          stars={stars}
          onHome={() => { playSound("button"); router.replace("/"); }}
          onRestart={() => { playSound("button"); startLevel(1); }}
          onNext={level === 3 ? undefined : () => { playSound("button"); startLevel((level + 1) as Level); }}
          nextLabel={level === 3 ? undefined : "Next Level"}
        />
      </SafeAreaView>
    </GameBackground>
  );
}

function CompareTile({ item, testID }: { item: CompareItem; testID?: string }) {
  const scale = useSharedValue(0.96);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  React.useEffect(() => {
    scale.value = withSequence(withTiming(1.02, { duration: durations.scale }), withTiming(1, { duration: durations.scale }));
  }, [item.id, item.color, scale]);

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <View testID={testID} style={[styles.tile, shadows.softer, { backgroundColor: item.bg }]}>
        <MaterialCommunityIcons
          // @ts-expect-error glyph name from catalog
          name={item.icon}
          size={90}
          color={item.color}
        />
        <Text style={styles.tileLabel} numberOfLines={1}>{item.label}</Text>
      </View>
    </Animated.View>
  );
}

function starsFor(wrong: number): number {
  if (wrong <= 0) return 3;
  if (wrong <= 2) return 2;
  return 1;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md },
  progressWrap: { alignItems: "center", marginTop: spacing.xs },
  questionBlock: { alignItems: "center", gap: spacing.xs },
  prompt: { ...typography.body, color: colors.onSurfaceMuted, fontWeight: "600" },
  pair: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  vs: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  tile: {
    aspectRatio: 0.9,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    gap: spacing.sm,
  },
  tileLabel: {
    ...typography.subtitle,
    color: colors.onSurface,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionWrap: {
    flex: 1,
  },
});
