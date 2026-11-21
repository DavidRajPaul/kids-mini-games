import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useSoundEffects } from "@/src/audio/useSoundEffects";
import { GameBackground } from "@/src/components/GameBackground";
import { SpokenInstruction } from "@/src/components/SpokenInstruction";
import { GameTopBar } from "@/src/components/GameTopBar";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { colors, radius, spacing, typography, shadows, durations } from "@/src/theme/tokens";

/**
 * Tic Tac Toe — two-player pass-and-play.
 * X and O take turns tapping empty cells. First to line up three wins.
 * If all cells are filled with no winner it is a draw.
 * Calm feedback only — no jingles, no confetti, no timers.
 */

type Cell = "X" | "O" | null;
type Winner = "X" | "O" | "draw" | null;

const LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function findWinner(board: Cell[]): { winner: Winner; line: number[] | null } {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  if (board.every((c) => c !== null)) return { winner: "draw", line: null };
  return { winner: null, line: null };
}

interface Score { X: number; O: number; draws: number; }

export default function TicTacToeScreen() {
  const router = useRouter();
  const playSound = useSoundEffects();

  const [board, setBoard] = useState<Cell[]>(() => Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [score, setScore] = useState<Score>({ X: 0, O: 0, draws: 0 });

  const { winner, line } = useMemo(() => findWinner(board), [board]);

  const goHome = () => { playSound("button"); router.replace("/"); };
  const goBack = () => { playSound("button"); router.back(); };

  const resetBoard = useCallback(() => {
    setBoard(Array(9).fill(null));
    setTurn("X");
  }, []);

  const handleRestart = () => { playSound("button"); resetBoard(); };

  React.useEffect(() => {
    if (winner === "X" || winner === "O") {
      playSound("complete");
      setScore((s) => ({ ...s, [winner]: s[winner] + 1 }));
    } else if (winner === "draw") {
      playSound("star");
      setScore((s) => ({ ...s, draws: s.draws + 1 }));
    }
    // Intentional: winner changes drive the effect; play sound + bump score once per game end.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  const handleTap = (i: number) => {
    if (winner || board[i]) return;
    playSound("tap");
    const next = [...board];
    next[i] = turn;
    setBoard(next);
    setTurn(turn === "X" ? "O" : "X");
  };

  const banner = winner
    ? winner === "draw"
      ? "It's a draw!"
      : `Player ${winner} wins!`
    : `Player ${turn}'s turn`;

  return (
    <GameBackground>
      <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
        <GameTopBar
          title="Tic Tac Toe"
          onHome={goHome}
          onRestart={handleRestart}
          onBack={goBack}
        />

        <View style={styles.content}>
          <SpokenInstruction english="Take turns. Put three in a row to win!" tamil="மாறி மாறி விளையாடு! ஒரு வரிசையில் மூணு வை!" />
          <View style={styles.scoreRow}>
            <ScorePill label="Player X" color="#1F6FEB" bg={colors.softBlueTint} value={score.X} highlight={turn === "X" && !winner} icon="close-thick" testID="score-x" />
            <ScorePill label="Draws" color="#7F8C8D" bg={colors.surfaceTinted} value={score.draws} highlight={false} icon="minus" testID="score-draw" />
            <ScorePill label="Player O" color="#D9534F" bg={colors.pastelPinkTint} value={score.O} highlight={turn === "O" && !winner} icon="circle-outline" testID="score-o" />
          </View>

          <Animated.Text
            key={banner}
            entering={FadeIn.duration(durations.fade)}
            style={styles.banner}
            testID="ttt-banner"
          >
            {banner}
          </Animated.Text>

          <View style={styles.boardWrap}>
            <View style={styles.board} testID="ttt-board">
              {board.map((cell, i) => (
                <TTTCell
                  key={i}
                  value={cell}
                  highlighted={!!line && line.includes(i)}
                  onPress={() => handleTap(i)}
                  index={i}
                />
              ))}
            </View>
          </View>

          {winner ? (
            <View style={styles.actions}>
              <PrimaryButton
                testID="ttt-play-again"
                label="Play Again"
                variant="primary"
                onPress={handleRestart}
              />
            </View>
          ) : (
            <View style={styles.hintWrap}>
              <MaterialCommunityIcons name="hand-pointing-up" size={20} color={colors.onSurfaceMuted} />
              <Text style={styles.hint}>Tap a square to place your mark</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </GameBackground>
  );
}

/* ---------------------------------- Cell --------------------------------- */

function TTTCell({
  value,
  highlighted,
  onPress,
  index,
}: {
  value: Cell;
  highlighted: boolean;
  onPress: () => void;
  index: number;
}) {
  const scale = useSharedValue(value ? 1 : 1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  React.useEffect(() => {
    if (value) {
      scale.value = 0.6;
      scale.value = withTiming(1, { duration: durations.scale });
    }
  }, [value, scale]);

  return (
    <Pressable
      testID={`ttt-cell-${index}`}
      accessibilityRole="button"
      accessibilityLabel={value ? `Cell ${index} ${value}` : `Cell ${index} empty`}
      onPress={onPress}
      style={[
        styles.cell,
        highlighted && { backgroundColor: colors.pastelYellowTint, borderColor: "#E0A200" },
      ]}
    >
      <Animated.View style={animatedStyle}>
        {value === "X" ? (
          <MaterialCommunityIcons name="close-thick" size={64} color="#1F6FEB" />
        ) : value === "O" ? (
          <MaterialCommunityIcons name="circle-outline" size={64} color="#D9534F" />
        ) : (
          <View />
        )}
      </Animated.View>
    </Pressable>
  );
}

/* -------------------------------- ScorePill ------------------------------ */

function ScorePill({
  label,
  value,
  color,
  bg,
  highlight,
  icon,
  testID,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
  highlight: boolean;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  testID?: string;
}) {
  return (
    <View
      testID={testID}
      style={[
        styles.pill,
        { backgroundColor: bg, borderColor: highlight ? color : "transparent" },
      ]}
    >
      <MaterialCommunityIcons name={icon} size={22} color={color} />
      <View style={{ flex: 1 }}>
        <Text style={styles.pillLabel} numberOfLines={1}>{label}</Text>
        <Text style={[styles.pillValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  scoreRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  pill: {
    flex: 1,
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 2,
  },
  pillLabel: {
    ...typography.caption,
    color: colors.onSurfaceMuted,
  },
  pillValue: {
    ...typography.subtitle,
  },
  banner: {
    ...typography.title,
    color: colors.onSurface,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  boardWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 8,
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.softer,
  },
  cell: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceTinted,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  actions: {
    gap: spacing.sm,
  },
  hintWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  hint: {
    ...typography.caption,
    color: colors.onSurfaceMuted,
  },
});
