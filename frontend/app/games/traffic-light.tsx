import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LearningGame, Level } from "@/src/components/LearningGame";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

function TrafficRound({ level, round, done, locked }: { level: Level; round: number; done: (correct: boolean) => void; locked: boolean }) {
  const [feedback, setFeedback] = useState("");
  // Red/green response is a choice rather than a speed/reaction-time test.
  const signal = useMemo(() => (level === 1 ? (round % 2 ? "red" : "green") :
    ["red", "green", "green", "red"][round % 4]) as "red" | "green", [level, round]);
  const reversed = level === 3;
  const move = (signal === "green") !== reversed;
  const choose = (pickedMove: boolean) => {
    if (locked) return;
    const correct = pickedMove === move;
    setFeedback(correct ? "Great listening!" : "Try the other action.");
    done(correct);
  };
  return <View style={styles.center}>
    <Text style={styles.rule}>{reversed ? "Silly rule! RED means GO. GREEN means STOP." : "GREEN means GO. RED means STOP."}</Text>
    <View testID="traffic-signal" style={[styles.light, { backgroundColor: signal === "green" ? "#2E8B57" : "#C0392B" }]}>
      <Text style={styles.signal}>{signal === "green" ? "🟢" : "🔴"}</Text>
    </View>
    <Text style={styles.feedback}>{feedback}</Text>
    <View style={styles.actions}>
      <Pressable testID="traffic-go" accessibilityRole="button" disabled={locked} style={[styles.button, { backgroundColor: colors.softGreenTint }]} onPress={() => choose(true)}>
        <Text style={styles.action}>🐰 GO!</Text>
      </Pressable>
      <Pressable testID="traffic-stop" accessibilityRole="button" disabled={locked} style={[styles.button, { backgroundColor: colors.pastelPinkTint }]} onPress={() => choose(false)}>
        <Text style={styles.action}>✋ STOP!</Text>
      </Pressable>
    </View>
  </View>;
}
export default function TrafficLight() {
 return <LearningGame id="traffic-light" title="Traffic Light Challenge" instruction={(level) => level === 3 ? "Follow the silly opposite rule!" : "Look at the light. What should bunny do?"}>
  {({ level, round, done, locked }) => <TrafficRound key={`${level}-${round}`} level={level} round={round} done={done} locked={locked} />}
 </LearningGame>;
}
const styles = StyleSheet.create({
 center: { alignItems: "center", gap: spacing.lg },
 rule: { ...typography.body, textAlign: "center", color: colors.onSurface },
 light: { width: 128, height: 128, borderRadius: 64, justifyContent: "center", alignItems: "center" },
 signal: { fontSize: 66 },
 actions: { flexDirection: "row", gap: spacing.md, justifyContent: "center" },
 button: { minHeight: 88, minWidth: 130, padding: spacing.md, borderRadius: radius.lg, justifyContent: "center", alignItems: "center" },
 action: { ...typography.subtitle, color: colors.onSurface },
 feedback: { ...typography.bodySm, color: colors.onSurfaceMuted, minHeight: 24 },
});
