import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
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
import { GameObject, pickRound } from "@/src/data/objects";
import { bumpTimesPlayed, saveProgress } from "@/src/storage/progress";
import { colors, radius, spacing, typography, shadows, durations } from "@/src/theme/tokens";

/**
 * Game 1: Find the Object.
 *
 * Rules:
 *  - Level 1 shows 4 objects, level 2 shows 6, level 3 shows 8.
 *  - Each level has 3 rounds. A round is a fresh randomized layout.
 *  - Correct tap plays a soft chime and advances to the next round.
 *  - Wrong tap plays a gentle down-note and lets the child try again.
 *  - Completing all 3 rounds unlocks the next level and earns stars.
 */

type Level = 1 | 2 | 3;
const ROUNDS_PER_LEVEL = 3;
const GAME_ID = "find-object" as const;

interface RoundState {
  target: GameObject;
  options: GameObject[];
  attempts: number; // wrong taps in this round
}

export default function FindObjectScreen() {
  const router = useRouter();
  const playSound = useSoundEffects();
  const { width } = useWindowDimensions();

  const [level, setLevel] = useState<Level>(1);
  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState<RoundState>(() => makeRound(1));
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [levelWrong, setLevelWrong] = useState(0); // total wrong across level
  const [showSuccess, setShowSuccess] = useState(false);

  // Bump play count once per mount.
  useEffect(() => {
    bumpTimesPlayed(GAME_ID).catch(() => {});
  }, []);

  const startLevel = useCallback((nextLevel: Level) => {
    setLevel(nextLevel);
    setRoundIndex(0);
    setLevelWrong(0);
    setWrongIds([]);
    setRound(makeRound(nextLevel));
    setShowSuccess(false);
  }, []);

  const restart = useCallback(() => {
    playSound("button");
    startLevel(1);
  }, [playSound, startLevel]);

  const goHome = useCallback(() => {
    playSound("button");
    setShowSuccess(false);
    router.replace("/");
  }, [playSound, router]);

  const handleWrong = (id: string) => {
    playSound("wrong");
    setWrongIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setLevelWrong((n) => n + 1);
    setRound((r) => ({ ...r, attempts: r.attempts + 1 }));
  };

  const handleCorrect = () => {
    playSound("correct");
    // Small delay so the child sees the correct tile pulse before next round.
    setTimeout(() => {
      if (roundIndex + 1 >= ROUNDS_PER_LEVEL) {
        // Level complete
        const stars = computeStars(levelWrong);
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
        setRound(makeRound(level));
      }
    }, 320);
  };

  const columns = useMemo(() => {
    // level 1 -> 2 cols, level 2 -> 3 cols, level 3 -> 4 cols on wide, else 3.
    if (level === 1) return 2;
    if (level === 2) return 3;
    return width >= 520 ? 4 : 3;
  }, [level, width]);

  const stars = computeStars(levelWrong);

  return (
    <GameBackground>
      <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
        <GameTopBar
          title={`Level ${level}`}
          onHome={goHome}
          onRestart={restart}
          onBack={() => {
            playSound("button");
            router.back();
          }}
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
            <Text style={styles.prompt}>Find the</Text>
            <QuestionText testID="target-label">
              {round.target.label}
            </QuestionText>
          </Animated.View>

          <ScrollView
            style={styles.gridScroll}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid} testID="objects-grid">
              {round.options.map((obj) => (
                <ObjectTile
                  key={`${level}-${roundIndex}-${obj.id}`}
                  object={obj}
                  isTarget={obj.id === round.target.id}
                  wrong={wrongIds.includes(obj.id)}
                  columns={columns}
                  onCorrect={handleCorrect}
                  onWrong={() => handleWrong(obj.id)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <SuccessDialog
          visible={showSuccess}
          title={level === 3 ? "You did it!" : "Great work!"}
          message={
            level === 3
              ? "You finished all levels."
              : `You are ready for level ${level + 1}.`
          }
          stars={stars}
          onHome={goHome}
          onRestart={() => {
            playSound("button");
            startLevel(1);
          }}
          onNext={
            level === 3
              ? undefined
              : () => {
                  playSound("button");
                  startLevel((level + 1) as Level);
                }
          }
          nextLabel={level === 3 ? undefined : "Next Level"}
        />
      </SafeAreaView>
    </GameBackground>
  );
}

/* --------------------------------- helpers -------------------------------- */

function makeRound(level: Level): RoundState {
  const { target, options } = pickRound(level);
  return { target, options, attempts: 0 };
}

/**
 * Star scoring based on total wrong taps within a level.
 * 0 wrong -> 3 stars, 1-2 wrong -> 2 stars, 3+ wrong -> 1 star.
 */
export function computeStars(wrong: number): number {
  if (wrong <= 0) return 3;
  if (wrong <= 2) return 2;
  return 1;
}

/* --------------------------------- tile ---------------------------------- */

interface TileProps {
  object: GameObject;
  isTarget: boolean;
  wrong: boolean;
  columns: number;
  onCorrect: () => void;
  onWrong: () => void;
}

function ObjectTile({ object, isTarget, wrong, columns, onCorrect, onWrong }: TileProps) {
  const scale = useSharedValue(1);
  const [locked, setLocked] = useState(false);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onPress = () => {
    if (locked) return;
    if (isTarget) {
      setLocked(true);
      scale.value = withSequence(
        withTiming(1.08, { duration: durations.scale }),
        withTiming(1, { duration: durations.scale }),
      );
      onCorrect();
    } else {
      // Gentle shake-free feedback: brief dim + return to normal.
      scale.value = withSequence(
        withTiming(0.94, { duration: 120 }),
        withTiming(1, { duration: 160 }),
      );
      onWrong();
    }
  };

  const widthPct = (100 / columns) - 3;

  return (
    <Animated.View
      style={[
        { width: `${widthPct}%` as `${number}%` },
        animatedStyle,
      ]}
    >
      <Pressable
        testID={`object-tile-${object.id}`}
        accessibilityRole="button"
        accessibilityLabel={object.label}
        onPress={onPress}
        style={[
          styles.tile,
          shadows.softer,
          {
            backgroundColor: object.bg,
            borderColor: wrong ? colors.dangerTint : "transparent",
          },
        ]}
      >
        <MaterialCommunityIcons
          // @ts-expect-error runtime-checked glyph name from catalog
          name={object.icon}
          size={54}
          color={object.color}
        />
        <Text style={styles.tileLabel} numberOfLines={1} adjustsFontSizeToFit>
          {object.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/* --------------------------------- styles -------------------------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  progressWrap: {
    alignItems: "center",
    marginTop: spacing.xs,
  },
  questionBlock: {
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  prompt: {
    ...typography.body,
    color: colors.onSurfaceMuted,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.md,
  },
  gridScroll: {
    flex: 1,
  },
  gridContent: {
    paddingBottom: spacing.lg,
    flexGrow: 1,
    justifyContent: "center",
  },
  tile: {
    aspectRatio: 1,
    borderRadius: radius.lg,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
    gap: 6,
    minHeight: 96,
  },
  tileLabel: {
    ...typography.caption,
    color: colors.onSurface,
    textAlign: "center",
  },
});
