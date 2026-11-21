import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LearningGame } from "@/src/components/LearningGame";
import { ReadingChoiceBoard } from "@/src/components/ReadingChoiceBoard";
import { LETTERS, pickOptions, wordFor } from "@/src/data/reading";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

export default function WordMagic() {
  return (
    <LearningGame
      id="word-magic"
      title="First Word Magic"
      rounds={3}
      instruction={() => "Pick the missing first letter."}
      tamilInstruction={() => "செம! இப்போ ஒரு சின்ன English word பில்ட் பண்ணலாம்! முதல் letter எது?"}
    >
      {({ level, round, done, locked }) => {
        const target = wordFor(level, round);
        const answer = target.word[0].toUpperCase();
        const options = pickOptions(answer, LETTERS.map(l => l.letter.toUpperCase()),
          level === 1 ? 3 : level === 2 ? 4 : 5, level * 7 + round);
        return (
          <View style={styles.container}>
            <View style={styles.card}>
              <Text style={styles.picture}>{target.picture}</Text>
              <View style={styles.wordRow}>
                <Text style={styles.blank}>?</Text>
                <Text style={styles.word}>{target.word.slice(1).toUpperCase()}</Text>
              </View>
              <Text style={styles.caption}>Say each sound, then try the word together!</Text>
            </View>
            <ReadingChoiceBoard
              choices={options}
              answer={answer}
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
 card: { width: "100%", backgroundColor: colors.softGreenTint, borderRadius: radius.xl, padding: spacing.lg, alignItems: "center", gap: spacing.sm },
 picture: { fontSize: 74 },
 wordRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
 blank: { fontSize: 58, fontWeight: "800", color: "#8E44AD" },
 word: { fontSize: 58, fontWeight: "800", color: colors.onSurface, letterSpacing: 3 },
 caption: { ...typography.caption, color: colors.onSurfaceMuted, textAlign: "center" },
});
