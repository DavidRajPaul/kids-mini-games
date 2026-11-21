import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSoundEffects } from "@/src/audio/useSoundEffects";
import { GameBackground } from "@/src/components/GameBackground";
import { SpokenInstruction } from "@/src/components/SpokenInstruction";
import { GameTopBar } from "@/src/components/GameTopBar";
import { ProgressIndicator } from "@/src/components/ProgressIndicator";
import { QuestionText } from "@/src/components/QuestionText";
import { SuccessDialog } from "@/src/components/SuccessDialog";
import { Shape, pickShapeRound } from "@/src/data/shapes";
import { bumpTimesPlayed, saveProgress } from "@/src/storage/progress";
import { colors, radius, spacing, typography, shadows, durations } from "@/src/theme/tokens";

/**
 * Game 5: Shape Puzzle.
 * A silhouette (outlined shape) sits at the top. Draggable shape tiles below.
 * The correct shape can be dragged and snapped onto the silhouette.
 * Wrong shapes gently spring back.
 */

type Level = 1 | 2 | 3;
const ROUNDS_PER_LEVEL = 3;
const GAME_ID = "shape-puzzle" as const;

interface DropZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ShapePuzzleScreen() {
  const router = useRouter();
  const playSound = useSoundEffects();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const silhouetteRef = useRef<View>(null);

  // All drop coordinates must be in window space, not local parent layouts.
  const measureDropZone = useCallback(() => {
    silhouetteRef.current?.measureInWindow((x, y, width, height) => {
      if (width > 0 && height > 0) setDropZone({ x, y, width, height });
    });
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(measureDropZone);
    return () => cancelAnimationFrame(frame);
  }, [measureDropZone, windowWidth, windowHeight]);

  const [level, setLevel] = useState<Level>(1);
  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState(() => pickShapeRound(1));
  const [placed, setPlaced] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [levelWrong, setLevelWrong] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dropZone, setDropZone] = useState<DropZone | null>(null);
  const roundKeyRef = useRef(0);

  useEffect(() => {
    bumpTimesPlayed(GAME_ID).catch(() => {});
  }, []);

  const startLevel = useCallback((next: Level) => {
    setLevel(next);
    setRoundIndex(0);
    setLevelWrong(0);
    setPlaced(false);
    setWrongCount(0);
    setRound(pickShapeRound(next));
    setShowSuccess(false);
    roundKeyRef.current += 1;
  }, []);

  const nextRound = () => {
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
      setPlaced(false);
      setWrongCount(0);
      setRound(pickShapeRound(level));
      roundKeyRef.current += 1;
    }
  };

  const handleCorrect = () => {
    if (placed) return;
    setPlaced(true);
    playSound("correct");
    setTimeout(nextRound, 600);
  };

  const handleWrong = () => {
    playSound("wrong");
    setWrongCount((n) => n + 1);
    setLevelWrong((n) => n + 1);
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
            key={`q-${roundKeyRef.current}`}
            entering={FadeIn.duration(durations.fade)}
            exiting={FadeOut.duration(durations.fade)}
            style={styles.questionBlock}
          >
            <Text style={styles.prompt}>Drag the</Text>
            <QuestionText testID="target-label">{round.target.label}</QuestionText>
            <SpokenInstruction english={`Drag the ${round.target.label} into the outline`} tamil="சரியான ஷேப்பை டிராக் பண்ணி உள்ளே வை குட்டி!" />
          </Animated.View>

          <View style={styles.silhouetteWrap}>
            <View
              ref={silhouetteRef}
              onLayout={measureDropZone}
              style={[
                styles.silhouette,
                { borderColor: placed ? round.target.color : colors.borderStrong },
              ]}
              testID="silhouette"
            >
              {placed ? (
                <Animated.View entering={FadeIn.duration(300)}>
                  <MaterialCommunityIcons
                    // @ts-expect-error glyph name from catalog
                    name={round.target.icon}
                    size={140}
                    color={round.target.color}
                  />
                </Animated.View>
              ) : (
                <MaterialCommunityIcons
                  // @ts-expect-error glyph name from catalog
                  name={round.target.outline}
                  size={140}
                  color={colors.borderStrong}
                />
              )}
            </View>
          </View>

          <View style={styles.trayWrap}>
            <View style={styles.tray} testID="shape-tray">
              {round.options.map((shape) => (
                <DraggableShape
                  key={`${roundKeyRef.current}-${shape.id}`}
                  shape={shape}
                  isTarget={shape.id === round.target.id}
                  dropZone={dropZone}
                  disabled={placed}
                  onCorrect={handleCorrect}
                  onWrong={handleWrong}
                />
              ))}
            </View>
            {wrongCount > 0 && !placed ? (
              <Text style={styles.hint}>Try another shape.</Text>
            ) : (
              <Text style={styles.hint}> </Text>
            )}
          </View>
        </View>

        <SuccessDialog
          visible={showSuccess}
          title={level === 3 ? "Puzzle master!" : "Perfect fit!"}
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

/* ------------------------------ Draggable ------------------------------- */

interface DragProps {
  shape: Shape;
  isTarget: boolean;
  dropZone: DropZone | null;
  disabled: boolean;
  onCorrect: () => void;
  onWrong: () => void;
}

function DraggableShape({ shape, isTarget, dropZone, disabled, onCorrect, onWrong }: DragProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handleRelease = (fingerX: number, fingerY: number) => {
    if (!dropZone) {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      return;
    }
    // Pan events provide absolute finger coordinates in window space.
    // measureInWindow gives the target in that same coordinate system.
    // A little tolerance around the silhouette is friendlier to small fingers.
    const tolerance = 18;
    const inside =
      fingerX >= dropZone.x - tolerance &&
      fingerX <= dropZone.x + dropZone.width + tolerance &&
      fingerY >= dropZone.y - tolerance &&
      fingerY <= dropZone.y + dropZone.height + tolerance;

    if (inside) {
      if (isTarget) {
        // The silhouette displays the fitted shape; hide the released tile.
        opacity.value = withTiming(0, { duration: 250 });
        onCorrect();
      } else {
        onWrong();
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    } else {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    }
  };

  const pan = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      scale.value = withTiming(1.08, { duration: 120 });
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      scale.value = withTiming(1, { duration: 120 });
      runOnJS(handleRelease)(e.absoluteX, e.absoluteY);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        testID={`shape-tile-${shape.id}`}
        style={[
          styles.dragTile,
          shadows.softer,
          { backgroundColor: shape.bg },
          animatedStyle,
        ]}
      >
        <MaterialCommunityIcons
          // @ts-expect-error glyph name from catalog
          name={shape.icon}
          size={54}
          color={shape.color}
        />
      </Animated.View>
    </GestureDetector>
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
  silhouetteWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  silhouette: {
    width: 200,
    height: 200,
    borderRadius: radius.xl,
    borderWidth: 3,
    borderStyle: "dashed",
    backgroundColor: colors.surfaceCard,
    alignItems: "center",
    justifyContent: "center",
  },
  trayWrap: {
    gap: spacing.xs,
  },
  tray: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dragTile: {
    width: 76,
    height: 76,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    ...typography.caption,
    color: colors.onSurfaceMuted,
    textAlign: "center",
    minHeight: 18,
  },
});
