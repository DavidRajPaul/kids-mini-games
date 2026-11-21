import React from "react";
import { Pressable } from "react-native";
import { useGameSpeech } from "@/src/audio/useGameSpeech";
import { StyleSheet, Text, View } from "react-native";
import { LearningGame } from "@/src/components/LearningGame";
import { ReadingChoiceBoard } from "@/src/components/ReadingChoiceBoard";
import { LETTERS, letterFor, pickOptions } from "@/src/data/reading";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

export default function SoundDetective() {
  return (
    <LearningGame
      id="sound-detective"
      title="Sound Detective"
      rounds={4}
      instruction={() => "Listen to the word. Which letter sound comes first?"}
      tamilInstruction={() => "குட்டி, word-ஐ கேளு! முதல்ல எந்த English letter sound வருது? கண்டுபிடி பார்க்கலாம்!"}
    >
      {({ level, round, done, locked }) => {
        const target = letterFor(level, round);
        const SpeakWord = () => { const { speak } = useGameSpeech(); return <Pressable accessibilityRole="button" accessibilityLabel="Hear the example word" testID="hear-word" onPress={() => { void speak(target.word, "en"); }} style={styles.speak}><Text style={styles.speakText}>🔊 Hear word</Text></Pressable>; };
        const options = pickOptions(
          target.letter.toUpperCase(), LETTERS.map(l => l.letter.toUpperCase()),
          level === 1 ? 3 : level === 2 ? 4 : 5, 10 + level * 4 + round,
        );
        return (
          <View style={styles.container}>
            <View style={styles.feature}>
              <Text style={styles.illustration}>{target.picture}</Text>
              <SpeakWord />
            </View>
            <Text style={styles.helper}>Listen first, then choose a letter.</Text>
            <ReadingChoiceBoard
              choices={options}
              answer={target.letter.toUpperCase()}
              locked={locked}
              onAnswer={done}
            />
          </View>
        );
      }}
    </LearningGame>
  );
}

const styles = StyleSheet.create({
 container: { alignItems: "center", gap: spacing.md },
 feature: { backgroundColor: colors.softBlueTint, padding: spacing.lg, borderRadius: radius.xl, alignItems: "center", minWidth: 180 },
 illustration: { fontSize: 76 },
 word: { fontSize: 39, fontWeight: "800", color: colors.onSurface, letterSpacing: 3 },
 helper: { ...typography.bodySm, color: colors.onSurfaceMuted, textAlign: "center" },
 speak: { backgroundColor: colors.pastelYellowTint, borderRadius: radius.pill, padding: spacing.md, minHeight: 50 },
 speakText: { ...typography.bodySm, color: colors.onSurface },
});
