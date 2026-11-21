import React from "react";
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
      instruction={(level, round) => `Which letter starts the word ${letterFor(level, round).word}?`}
      tamilInstruction={(level, round) =>
        `குட்டி, ${letterFor(level, round).tamilWord}ன்னு சொல்லும்போது முதல் English letter என்ன? கண்டுபிடிக்கலாமா?`}
    >
      {({ level, round, done, locked }) => {
        const target = letterFor(level, round);
        const options = pickOptions(
          target.letter.toUpperCase(), LETTERS.map(l => l.letter.toUpperCase()),
          level === 1 ? 3 : level === 2 ? 4 : 5, 10 + level * 4 + round,
        );
        return (
          <View style={styles.container}>
            <View style={styles.feature}>
              <Text style={styles.illustration}>{target.picture}</Text>
              <Text testID="sound-word" style={styles.word}>{target.word.toUpperCase()}</Text>
            </View>
            <Text style={styles.helper}>Look at the first letter sound</Text>
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
});
