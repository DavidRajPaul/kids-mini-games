import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LearningGame, Level } from "@/src/components/LearningGame";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

const ITEMS = ["🔴", "🔵", "🟡", "🟢", "⭐", "❤️", "🔺"];
function PatternRound({ level, round, done, locked }: { level: Level; round: number; done: (correct: boolean) => void; locked: boolean }) {
  const [hint, setHint] = useState("");
  const data = useMemo(() => {
    const offset = round % 3;
    const a = ITEMS[offset], b = ITEMS[offset + 3], c = ITEMS[offset + 4];
    const base = level === 1 ? [a, b] : level === 2 ? [a, a, b] : [a, b, c];
    const sequence = Array.from({ length: level === 1 ? 4 : level === 2 ? 6 : 6 }, (_, i) => base[i % base.length]);
    const answer = base[sequence.length % base.length];
    const options = [answer, ...ITEMS.filter(item => !base.includes(item)).slice(0, 2)].sort((x, y) => ITEMS.indexOf(x) - ITEMS.indexOf(y));
    return { sequence, answer, options };
  }, [level, round]);
  return <View style={styles.container}>
    <View style={styles.sequence} testID="pattern-sequence">
      {data.sequence.map((item, i) => <Text key={i} style={styles.symbol}>{item}</Text>)}
      <Text style={styles.symbol}>❓</Text>
    </View>
    <Text style={styles.label}>Tap what comes next</Text>
    <View style={styles.choices}>
      {data.options.map(item => <Pressable key={item} testID={`pattern-option-${ITEMS.indexOf(item)}`} disabled={locked}
        accessibilityRole="button" accessibilityLabel={item}
        style={styles.choice} onPress={() => { const correct = item === data.answer; setHint(correct ? "You found it!" : "Look at the pattern again."); done(correct); }}>
        <Text style={styles.symbol}>{item}</Text>
      </Pressable>)}
    </View>
    <Text style={styles.hint}>{hint}</Text>
  </View>;
}
export default function WhatComesNext() {
 return <LearningGame id="what-comes-next" title="What Comes Next?" instruction={() => "Spot the pattern!"}>
  {({ level, round, done, locked }) => <PatternRound key={`${level}-${round}`} level={level} round={round} done={done} locked={locked} />}
 </LearningGame>;
}
const styles = StyleSheet.create({
 container: { alignItems: "center", gap: spacing.lg },
 sequence: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: spacing.sm },
 symbol: { fontSize: 38 },
 label: { ...typography.body, color: colors.onSurface },
 choices: { flexDirection: "row", gap: spacing.md, justifyContent: "center" },
 choice: { width: 88, height: 88, borderRadius: radius.lg, backgroundColor: colors.softBlueTint, alignItems: "center", justifyContent: "center" },
 hint: { ...typography.bodySm, color: colors.onSurfaceMuted, minHeight: 24 },
});
