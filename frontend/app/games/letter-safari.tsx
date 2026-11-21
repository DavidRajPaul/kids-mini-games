import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LearningGame } from "@/src/components/LearningGame";
import { ReadingChoiceBoard } from "@/src/components/ReadingChoiceBoard";
import { LETTERS, letterFor, pickOptions } from "@/src/data/reading";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

export default function LetterSafari() {
  return (
    <LearningGame
      id="letter-safari"
      title="Letter Safari"
      rounds={4}
      instruction={(level, round) => `Can you spot the letter ${letterFor(level, round).letter.toUpperCase()}?`}
      tamilInstruction={(level, round) => `${letterFor(level, round).nameTamil} letter எங்க இருக்கு குட்டி? கண்டுபிடி பார்க்கலாம்!`}
    >
      {({ level, round, done, locked }) => {
        const target = letterFor(level, round);
        const upper = level === 1;
        const display = (value: string) => upper ? value.toUpperCase() : value;
        const options = pickOptions(target.letter,
          LETTERS.map(l => l.letter), level === 3 ? 5 : level === 2 ? 4 : 3, round + level * 3)
          .map(display);
        return (
          <View style={styles.container}>
            <View style={styles.feature}>
              <Text style={styles.picture}>🔤</Text>
              <Text testID="letter-target" style={styles.target}>
                {level === 3 ? target.letter.toUpperCase() : display(target.letter)}
              </Text>
            </View>
            <ReadingChoiceBoard
              choices={options}
              answer={display(target.letter)}
              locked={locked}
              onAnswer={done}
            />
            <Text style={styles.helper}>Level {level}: {level === 1 ? "BIG letters" : level === 2 ? "little letters" : "match BIG to little"}</Text>
          </View>
        );
      }}
    </LearningGame>
  );
}

const styles = StyleSheet.create({
 container: { alignItems: "center", gap: spacing.md },
 feature: { flexDirection: "row", alignItems: "center", gap: spacing.lg, padding: spacing.md, backgroundColor: colors.pastelPurpleTint, borderRadius: radius.xl },
 picture: { fontSize: 52 },
 target: { fontSize: 80, fontWeight: "900", color: colors.onSurface },
 helper: { ...typography.caption, color: colors.onSurfaceMuted },
});
