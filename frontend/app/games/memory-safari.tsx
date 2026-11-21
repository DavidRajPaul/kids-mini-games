import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LearningGame, Level } from "@/src/components/LearningGame";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

const ANIMALS = ["🐶", "🐱", "🐼", "🐰", "🐸", "🦁", "🐨", "🐵", "🦊"];
function shuffle<T>(values: T[]): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
type Card = { id: number; animal: string };
function Cards({ level, round, done, locked }: { level: Level; round: number; done: (correct: boolean) => void; locked: boolean }) {
  const cards = useMemo<Card[]>(() => {
    const count = level === 1 ? 3 : level === 2 ? 4 : 6;
    return shuffle(shuffle(ANIMALS).slice(0, count).flatMap((animal, i) =>
      [{ id: i * 2, animal }, { id: i * 2 + 1, animal }]));
  }, [level, round]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => { setOpen([]); setMatched([]); setBusy(false); }, [cards]);
  useEffect(() => {
    if (open.length !== 2) return;
    if (cards[open[0]].animal === cards[open[1]].animal) {
      const animal = cards[open[0]].animal;
      const next = [...matched, animal];
      setMatched(next);
      setOpen([]);
      if (next.length === cards.length / 2) done(true);
    } else {
      setBusy(true);
      const timer = setTimeout(() => { setOpen([]); setBusy(false); }, 850);
      return () => clearTimeout(timer);
    }
  }, [open, cards]);
  return (
    <View style={styles.grid} testID="memory-grid">
      {cards.map((card, index) => {
        const visible = open.includes(index) || matched.includes(card.animal);
        return <Pressable key={card.id} testID={`memory-card-${index}`} accessibilityRole="button"
          accessibilityLabel={visible ? card.animal : "Hidden animal"}
          disabled={busy || locked || visible} onPress={() => setOpen(prev => [...prev, index])}
          style={[styles.card, { backgroundColor: visible ? colors.softGreenTint : colors.softBlueTint, opacity: matched.includes(card.animal) ? 0.65 : 1 }]}>
          <Text style={styles.icon}>{visible ? card.animal : "?"}</Text>
        </Pressable>;
      })}
    </View>
  );
}
export default function MemorySafari() {
  return <LearningGame id="memory-safari" title="Memory Safari" instruction={() => "Find the matching animals!"}>
    {({ level, round, done, locked }) => <Cards key={`${level}-${round}`} level={level} round={round} done={done} locked={locked} />}
  </LearningGame>;
}
const styles = StyleSheet.create({
 grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: spacing.sm, alignSelf: "center", maxWidth: 480 },
 card: { width: 88, height: 88, borderRadius: radius.lg, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: colors.borderStrong },
 icon: { fontSize: 42, color: colors.onSurface, fontWeight: "800" },
});
