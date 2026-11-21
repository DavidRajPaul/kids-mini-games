import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LearningGame, type Level } from "@/src/components/LearningGame";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

type Scene = { emoji: string; label: string };
type Story = { title: string; scenes: Scene[] };
const STORIES: Story[] = [
  { title: "Grow a flower", scenes: [
    { emoji: "🌱", label: "Plant a seed" }, { emoji: "💧", label: "Give it water" },
    { emoji: "🌷", label: "Flower grows" }, { emoji: "🦋", label: "Butterfly visits" }] },
  { title: "Make breakfast", scenes: [
    { emoji: "🥣", label: "Get a bowl" }, { emoji: "🥛", label: "Pour some milk" },
    { emoji: "🥄", label: "Mix it up" }, { emoji: "😋", label: "Enjoy breakfast" }] },
  { title: "A rainy day", scenes: [
    { emoji: "☁️", label: "Clouds arrive" }, { emoji: "🌧️", label: "Rain falls" },
    { emoji: "☂️", label: "Open umbrella" }, { emoji: "🌈", label: "Rainbow appears" }] },
  { title: "Build a sandcastle", scenes: [
    { emoji: "🏖️", label: "Go to the beach" }, { emoji: "🪣", label: "Fill the bucket" },
    { emoji: "🏰", label: "Build a castle" }, { emoji: "📸", label: "Take a picture" }] },
  { title: "Care for a puppy", scenes: [
    { emoji: "🐶", label: "Meet puppy" }, { emoji: "🥣", label: "Give some food" },
    { emoji: "🦴", label: "Play together" }, { emoji: "💤", label: "Puppy rests" }] },
  { title: "Ride a bus", scenes: [
    { emoji: "🎒", label: "Pack your bag" }, { emoji: "🚏", label: "Wait at the stop" },
    { emoji: "🚌", label: "Ride the bus" }, { emoji: "🏡", label: "Arrive home" }] },
];
function shuffled(length: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Avoid starting in the correct order.
  if (arr.every((value, index) => value === index)) arr.reverse();
  return arr;
}
function StoryRound({ level, round, done, locked }: { level: Level; round: number; done: (correct: boolean) => void; locked: boolean }) {
  const story = STORIES[(level - 1) * 2 + round % 2];
  const count = level === 1 ? 3 : 4;
  const scenes = story.scenes.slice(0, count);
  const order = useMemo(() => shuffled(count), [level, round]);
  const [chosen, setChosen] = useState<number[]>([]);
  const [hint, setHint] = useState("");
  const choose = (index: number) => {
    if (locked || chosen.includes(index)) return;
    const nextStep = chosen.length;
    if (index !== nextStep) {
      setHint("Try another picture. What happened first?");
      done(false);
      return;
    }
    const next = [...chosen, index];
    setChosen(next);
    setHint(next.length === count ? "You told the whole story!" : "Nice! What happens next?");
    if (next.length === count) done(true);
  };
  return (
    <View style={styles.container} testID="story-board">
      <Text style={styles.title}>{story.title}</Text>
      <Text style={styles.helper}>Tap the pictures in story order. Start with 1.</Text>
      <View style={styles.ordered}>
        {scenes.map((_, step) => {
          const chosenStep = chosen[step];
          return <View key={step} style={styles.orderedCard} testID={`story-slot-${step}`}>
            <Text style={styles.slotNumber}>{step + 1}</Text>
            <Text style={styles.slotEmoji}>{chosenStep === undefined ? "❔" : scenes[chosenStep].emoji}</Text>
          </View>;
        })}
      </View>
      <View style={styles.choices}>
        {order.map(index => (
          <Pressable key={index} testID={`story-choice-${index}`} accessibilityRole="button"
            accessibilityLabel={scenes[index].label} accessibilityState={{ disabled: locked || chosen.includes(index) }}
            disabled={locked || chosen.includes(index)} style={[styles.choice, chosen.includes(index) && styles.chosen]} onPress={() => choose(index)}>
            <Text style={styles.emoji}>{scenes[index].emoji}</Text>
            <Text style={styles.choiceLabel} numberOfLines={2}>{scenes[index].label}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.hint} accessibilityLiveRegion="polite">{hint || "Which picture comes first?"}</Text>
    </View>
  );
}
export default function LittleStoryBuilder() {
  return (
    <LearningGame id="little-story-builder" title="Little Story Builder" rounds={4} instruction={() => "Let's put a story in order!"}>
      {({ level, round, done, locked }) => <StoryRound key={`${level}-${round}`} level={level} round={round} done={done} locked={locked} />}
    </LearningGame>
  );
}
const styles = StyleSheet.create({
 container: { alignItems: "center", gap: spacing.md },
 title: { ...typography.title, color: colors.onSurface, textAlign: "center" },
 helper: { ...typography.bodySm, color: colors.onSurfaceMuted, textAlign: "center" },
 ordered: { flexDirection: "row", justifyContent: "center", gap: 6 },
 orderedCard: { width: 70, minHeight: 100, alignItems: "center", justifyContent: "center", borderRadius: radius.md, borderWidth: 2, borderColor: colors.borderStrong, backgroundColor: colors.surfaceCard },
 slotNumber: { ...typography.caption, color: colors.onSurfaceMuted },
 slotEmoji: { fontSize: 34 },
 choices: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: spacing.sm },
 choice: { width: 132, minHeight: 116, justifyContent: "center", alignItems: "center", gap: spacing.xs, padding: spacing.sm, borderRadius: radius.lg, backgroundColor: colors.softBlueTint },
 chosen: { opacity: 0.35 },
 emoji: { fontSize: 42 },
 choiceLabel: { ...typography.caption, color: colors.onSurface, textAlign: "center" },
 hint: { ...typography.bodySm, textAlign: "center", minHeight: 28, color: colors.onSurfaceMuted },
});
