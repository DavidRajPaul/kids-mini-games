import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
import { SpokenInstruction } from "@/src/components/SpokenInstruction";
import { GameTopBar } from "@/src/components/GameTopBar";
import { ProgressIndicator } from "@/src/components/ProgressIndicator";
import { QuestionText } from "@/src/components/QuestionText";
import { SuccessDialog } from "@/src/components/SuccessDialog";
import { Animal, pickCountRound } from "@/src/data/animals";
import { bumpTimesPlayed, saveProgress } from "@/src/storage/progress";
import { colors, radius, spacing, typography, shadows, durations } from "@/src/theme/tokens";

/**
 * Game 2: Count the Animals.
 * Show N of the same animal in a wrapping grid. Pick the correct count.
 * L1 max count 4, L2 max 6, L3 max 10. 3 rounds per level.
 */

type Level = 1 | 2 | 3;
const ROUNDS_PER_LEVEL = 3;
const GAME_ID = "count-animals" as const;

interface RoundState {
  animal: Animal;
  count: number;
  options: number[];
}

export default function CountAnimalsScreen() {
  const router = useRouter();
  const playSound = useSoundEffects();

  const [level, setLevel] = useState<Level>(1);
  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState<RoundState>(() => pickCountRound(1));
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [levelWrong, setLevelWrong] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    bumpTimesPlayed(GAME_ID).catch(() => {});
  }, []);

  const startLevel = useCallback((next: Level) => {
    setLevel(next);
    setRoundIndex(0);
    setLevelWrong(0);
    setWrongPicks([]);
    setRound(pickCountRound(next));
    setShowSuccess(false);
  }, []);

  const restart = () => { playSound("button"); startLevel(1); };
  const goHome = () => { playSound("button"); setShowSuccess(false); router.replace("/"); };

  const handlePick = (n: number) => {
    if (n === round.count) {
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
          setWrongPicks([]);
          setRound(pickCountRound(level));
        }
      }, 320);
    } else {
      playSound("wrong");
      setWrongPicks((prev) => (prev.includes(n) ? prev : [...prev, n]));
      setLevelWrong((n2) => n2 + 1);
    }
  };

  const tiles = useMemo(() => Array.from({ length: round.count }), [round]);
  const stars = starsFor(levelWrong);

  return (
    <GameBackground>
      <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
        <GameTopBar
          title={`Level ${level}`}
          onHome={goHome}
          onRestart={restart}
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
            <Text style={styles.prompt}>How many</Text>
            <QuestionText testID="target-label">{round.animal.plural}?</QuestionText>
            <SpokenInstruction english={`How many ${round.animal.plural}?`} tamil="குட்டி, எத்தனை அனிமல்ஸ் இருக்குன்னு கவுன்ட் பண்ணி சொல்லு!" />
          </Animated.View>

          <ScrollView contentContainerStyle={styles.animalsScroll} showsVerticalScrollIndicator={false}>
            <View style={[styles.animalsGrid, { backgroundColor: round.animal.bg }]} testID="animals-grid">
              {tiles.map((_, i) => (
                <MaterialCommunityIcons
                  key={i}
                  // @ts-expect-error runtime-checked glyph name
                  name={round.animal.icon}
                  size={54}
                  color={round.animal.color}
                  style={styles.animalIcon}
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.options} testID="count-options">
            {round.options.map((n) => (
              <NumberButton
                key={n}
                value={n}
                dimmed={wrongPicks.includes(n)}
                onPress={() => handlePick(n)}
              />
            ))}
          </View>
        </View>

        <SuccessDialog
          visible={showSuccess}
          title={level === 3 ? "You did it!" : "Great counting!"}
          message={level === 3 ? "You finished all levels." : `Ready for level ${level + 1}.`}
          stars={stars}
          onHome={goHome}
          onRestart={() => { playSound("button"); startLevel(1); }}
          onNext={level === 3 ? undefined : () => { playSound("button"); startLevel((level + 1) as Level); }}
          nextLabel={level === 3 ? undefined : "Next Level"}
        />
      </SafeAreaView>
    </GameBackground>
  );
}

function NumberButton({ value, dimmed, onPress }: { value: number; dimmed: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      <Pressable
        testID={`count-option-${value}`}
        accessibilityRole="button"
        accessibilityLabel={String(value)}
        onPress={() => {
          scale.value = withSequence(withTiming(0.94, { duration: 120 }), withTiming(1, { duration: 160 }));
          onPress();
        }}
        style={[
          styles.numBtn,
          shadows.softer,
          { backgroundColor: dimmed ? colors.dangerTint : colors.softBlueTint },
        ]}
      >
        <Text style={styles.numText}>{value}</Text>
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
  animalsScroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: spacing.md,
  },
  animalsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: spacing.md,
    minHeight: 180,
  },
  animalIcon: {
    margin: 6,
  },
  options: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  numBtn: {
    height: 72,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  numText: {
    ...typography.displayLG,
    color: colors.onSoftBlue,
  },
});
