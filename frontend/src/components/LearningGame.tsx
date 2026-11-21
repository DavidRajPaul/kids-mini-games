import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GameBackground } from "@/src/components/GameBackground";
import { GameTopBar } from "@/src/components/GameTopBar";
import { ProgressIndicator } from "@/src/components/ProgressIndicator";
import { SuccessDialog } from "@/src/components/SuccessDialog";
import { useSoundEffects } from "@/src/audio/useSoundEffects";
import { bumpTimesPlayed, saveProgress, GameId } from "@/src/storage/progress";
import { colors, spacing, typography } from "@/src/theme/tokens";
import { useGameSpeech } from "@/src/audio/useGameSpeech";
import { MagicBurst } from "@/src/components/MagicBurst";

export type Level = 1 | 2 | 3;

const tamilPrompts: Partial<Record<GameId, (level: Level) => string>> = {
  "memory-safari": () => "ஒரே மாதிரி இருக்கும் விலங்குகளை கண்டுபிடி!",
  "traffic-light": (level) => level === 3 ? "இப்போ விதி தலைகீழ்! சிகப்பு போ! பச்சை நில்!" : "விளக்கை பார்த்து போகலாமா நிற்கலாமா சொல்லு!",
  "what-comes-next": () => "அடுத்து என்ன வரும்னு கண்டுபிடி!",
  "little-story-builder": () => "கதையை சரியான வரிசையில் சொல்லு!",
};
type Props = {
  id: GameId;
  title: string;
  instruction: (level: Level, round: number) => string;
  tamilInstruction?: (level: Level, round: number) => string;
  children: (context: { level: Level; round: number; done: (correct: boolean) => void; locked: boolean }) => React.ReactNode;
  rounds?: number;
};

/** Shared level progression. No timed pressure or punitive failure screen. */
export function LearningGame({ id, title, instruction, tamilInstruction, children, rounds = 4 }: Props) {
  const router = useRouter();
  const sound = useSoundEffects();
  const { language, ready, speak, stop } = useGameSpeech();
  const [level, setLevel] = useState<Level>(1);
  const [round, setRound] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [complete, setComplete] = useState(false);
  const [locked, setLocked] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const spokenPrompt = language === "ta"
    ? (tamilInstruction?.(level, round) ?? tamilPrompts[id]?.(level) ?? instruction(level, round))
    : instruction(level, round);
  useEffect(() => { if (ready && !complete) void speak(spokenPrompt); }, [ready, complete, spokenPrompt, speak]);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => subscription.remove();
  }, []);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef(false);
  useEffect(() => {
    bumpTimesPlayed(id).catch(() => {});
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [id]);
  const reset = (next: Level) => {
    if (timer.current) clearTimeout(timer.current);
    inFlight.current = false;
    stop();
    setLevel(next); setRound(0); setMistakes(0); setLocked(false); setCelebrating(false); setComplete(false);
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
    setCelebrating(true);
    sound("magic");
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
      setCelebrating(false);
      inFlight.current = false;
    }, 720);
  };
  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
  const home = () => { if (timer.current) clearTimeout(timer.current); stop(); router.replace("/"); };
  return (
    <GameBackground>
      <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
        <GameTopBar title={title} onHome={home} onRestart={() => reset(1)} onBack={() => { if (timer.current) clearTimeout(timer.current); stop(); router.back(); }} />
        <ScrollView contentContainerStyle={styles.content}>
          <ProgressIndicator current={round + (complete ? 1 : 0)} total={rounds} label={`Level ${level} · Round`} />
          <View style={styles.promptRow}>
            <Text style={styles.prompt}>{spokenPrompt}</Text>
            <Pressable testID="repeat-instruction" accessibilityRole="button" accessibilityLabel="Repeat spoken instruction" onPress={() => { void speak(spokenPrompt); }} style={styles.speakButton}>
              <Text style={styles.speakIcon}>🔊</Text>
            </Pressable>
          </View>
          {children({ level, round, done, locked })}
        </ScrollView>
        <MagicBurst visible={celebrating} reduceMotion={reduceMotion} />
        <SuccessDialog visible={complete} title={language === "ta" ? "செம குட்டி! 🌟" : (level === 3 ? "Wonderful work!" : "Well done!")} message={language === "ta" ? (level === 3 ? "எல்லா லெவலும் முடிச்சிட்டே!" : "அடுத்த லெவலுக்கு ரெடியா?") : (level === 3 ? "You finished all the levels." : `Ready for level ${level + 1}?`)} stars={stars} onHome={home} onRestart={() => reset(1)} onNext={level === 3 ? undefined : () => reset((level + 1) as Level)} />
      </SafeAreaView>
    </GameBackground>
  );
}
const styles = StyleSheet.create({
 safe: { flex: 1 },
 content: { flexGrow: 1, justifyContent: "center", padding: spacing.lg, gap: spacing.lg },
 promptRow: { flexDirection: "row", gap: spacing.sm, alignItems: "center", justifyContent: "center" },
 prompt: { ...typography.title, color: colors.onSurface, textAlign: "center", flexShrink: 1 },
 speakButton: { width: 54, height: 54, alignItems: "center", justifyContent: "center" },
 speakIcon: { fontSize: 29 },
});
