import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GameBackground } from "@/src/components/GameBackground";
import { GameTopBar } from "@/src/components/GameTopBar";
import { ProgressIndicator } from "@/src/components/ProgressIndicator";
import { SuccessDialog } from "@/src/components/SuccessDialog";
import { useSoundEffects } from "@/src/audio/useSoundEffects";
import { bumpTimesPlayed, saveProgress, GameId } from "@/src/storage/progress";
import { colors, spacing, typography } from "@/src/theme/tokens";

export type Level = 1 | 2 | 3;
type Props = {
  id: GameId;
  title: string;
  instruction: (level: Level, round: number) => string;
  children: (context: { level: Level; round: number; done: (correct: boolean) => void; locked: boolean }) => React.ReactNode;
  rounds?: number;
};

/** Shared level progression. No timed pressure or punitive failure screen. */
export function LearningGame({ id, title, instruction, children, rounds = 4 }: Props) {
  const router = useRouter();
  const sound = useSoundEffects();
  const [level, setLevel] = useState<Level>(1);
  const [round, setRound] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [complete, setComplete] = useState(false);
  const [locked, setLocked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  useEffect(() => {
    bumpTimesPlayed(id).catch(() => {});
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [id]);
  const reset = (next: Level) => {
    if (timer.current) clearTimeout(timer.current);
    inFlight.current = false;
    setLevel(next); setRound(0); setMistakes(0); setLocked(false); setComplete(false);
  };
  const done = (correct: boolean) => {
    if (inFlight.current || complete) return;
    if (!correct) {
      sound("wrong");
      setMistakes(n => n + 1);
      return;
    }
    inFlight.current = true;
    setLocked(true);
    sound("correct");
    timer.current = setTimeout(() => {
      if (round + 1 === rounds) {
        const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
        saveProgress(id, { highestLevel: Math.min(3, level + 1), starsEarned: stars, completed: level === 3 }).catch(() => {});
        sound(level === 3 ? "complete" : "star");
        setComplete(true);
      } else {
        setRound(n => n + 1);
        setLocked(false);
      }
      inFlight.current = false;
    }, 400);
  };
  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
  const home = () => { if (timer.current) clearTimeout(timer.current); router.replace("/"); };
  return (
    <GameBackground>
      <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
        <GameTopBar title={title} onHome={home} onRestart={() => reset(1)} onBack={() => { if (timer.current) clearTimeout(timer.current); router.back(); }} />
        <ScrollView contentContainerStyle={styles.content}>
          <ProgressIndicator current={round + (complete ? 1 : 0)} total={rounds} label={`Level ${level} · Round`} />
          <Text style={styles.prompt}>{instruction(level, round)}</Text>
          {children({ level, round, done, locked })}
        </ScrollView>
        <SuccessDialog visible={complete} title={level === 3 ? "Wonderful work!" : "Well done!"} message={level === 3 ? "You finished all the levels." : `Ready for level ${level + 1}?`} stars={stars} onHome={home} onRestart={() => reset(1)} onNext={level === 3 ? undefined : () => reset((level + 1) as Level)} />
      </SafeAreaView>
    </GameBackground>
  );
}
const styles = StyleSheet.create({
 safe: { flex: 1 },
 content: { flexGrow: 1, justifyContent: "center", padding: spacing.lg, gap: spacing.lg },
 prompt: { ...typography.title, color: colors.onSurface, textAlign: "center" },
});
