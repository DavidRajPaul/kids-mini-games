import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
import { ProgressIndicator } from "@/src/components/ProgressIndicator";
import { QuestionText } from "@/src/components/QuestionText";
import { SuccessDialog } from "@/src/components/SuccessDialog";
import { SizeItem, pickSizeRound } from "@/src/data/sizes";
import { bumpTimesPlayed, saveProgress } from "@/src/storage/progress";
import { colors, radius, spacing, typography, shadows, durations } from "@/src/theme/tokens";

/**
 * Game 3: Bigger or Smaller.
 * Shows two items side-by-side. Randomly asks "Which is Bigger?" or "Which is Smaller?".
 * The visual scale of each icon is proportional to its real-world size rank.
 */

type Level = 1 | 2 | 3;
const ROUNDS_PER_LEVEL = 3;
const GAME_ID = "bigger-smaller" as const;

interface RoundState {
  pair: [SizeItem, SizeItem];
  askBigger: boolean;
  correctId: string;
}

export default function BiggerSmallerScreen() {
  const router = useRouter();
  const playSound = useSoundEffects();

  const [level, setLevel] = useState<Level>(1);
  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState<RoundState>(() => pickSizeRound(1));
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [levelWrong, setLevelWrong] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    bumpTimesPlayed(GAME_ID).catch(() => {});
  }, []);

  const startLevel = useCallback((next: Level) => {
    setLevel(next);
    setRoundIndex(0);
    setLevelWrong(0);
    setWrongIds([]);
    setRound(pickSizeRound(next));
    setShowSuccess(false);
  }, []);

  const handlePick = (id: string) => {
    if (id === round.correctId) {
      playSound("correct");
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
          setWrongIds([]);
          setRound(pickSizeRound(level));
        }
      }, 320);
    } else {
      playSound("wrong");
      setWrongIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      setLevelWrong((n) => n + 1);
    }
  };

  const stars = starsFor(levelWrong);

  return (
    <GameBackground>
      <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
        <GameTopBar
          title={`Level ${level}`}
          onHome={() => { playSound("button"); setShowSuccess(false); router.replace("/"); }}
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
            <Text style={styles.prompt}>Which one is</Text>
            <QuestionText testID="target-label">{round.askBigger ? "Bigger?" : "Smaller?"}</QuestionText>
          </Animated.View>

          <View style={styles.pair} testID="size-pair">
            {round.pair.map((item) => (
              <SizeTile
                key={item.id}
                item={item}
                wrong={wrongIds.includes(item.id)}
                onPress={() => handlePick(item.id)}
              />
            ))}
          </View>
        </View>

        <SuccessDialog
          visible={showSuccess}
          title={level === 3 ? "Nicely done!" : "Great choice!"}
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

function SizeTile({ item, wrong, onPress }: { item: SizeItem; wrong: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // Icon size scales with real-world size (60..150).
  const iconSize = 60 + Math.round((item.size / 10) * 90);

  return (
    <Animated.View style={[styles.tileWrap, animatedStyle]}>
      <Pressable
        testID={`size-tile-${item.id}`}
        accessibilityRole="button"
        accessibilityLabel={item.label}
        onPress={() => {
          scale.value = withSequence(withTiming(0.96, { duration: 120 }), withTiming(1, { duration: 160 }));
          onPress();
        }}
        style={[
          styles.tile,
          shadows.softer,
          {
            backgroundColor: item.bg,
            borderColor: wrong ? colors.dangerTint : "transparent",
          },
        ]}
      >
        <MaterialCommunityIcons
          // @ts-expect-error glyph name from catalog
          name={item.icon}
          size={iconSize}
          color={item.color}
        />
        <Text style={styles.label}>{item.label}</Text>
      </Pressable>
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
  questionBlock: { alignItems: "center", gap: spacing.xs, marginTop: spacing.xs },
  prompt: { ...typography.body, color: colors.onSurfaceMuted, fontWeight: "600" },
  pair: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  tileWrap: {
    flex: 1,
  },
  tile: {
    aspectRatio: 0.85,
    borderRadius: radius.lg,
    borderWidth: 3,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  label: {
    ...typography.subtitle,
    color: colors.onSurface,
  },
});
