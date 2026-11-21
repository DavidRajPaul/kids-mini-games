import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LearningGame } from "@/src/components/LearningGame";
import { ReadingChoiceBoard } from "@/src/components/ReadingChoiceBoard";
import { LocalizedText } from "@/src/components/LocalizedText";
import { LETTERS, letterFor, pickOptions } from "@/src/data/reading";
import { recordLetterAttempt } from "@/src/storage/readingProgress";
import { type Level } from "@/src/components/LearningGame";
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
      {({ level, round, done, locked }) =>
        <LetterRound key={`${level}-${round}`} level={level} round={round} done={done} locked={locked} />
      }
    </LearningGame>
  );
}

function LetterRound({ level, round, done, locked }: {
  level: Level; round: number; done: (correct: boolean) => void; locked: boolean;
}) {
  const firstTap = useRef(false);
  const target = letterFor(level, round);
  const display = (value: string) => level === 1 ? value.toUpperCase() : value;
  const options = pickOptions(target.letter, LETTERS.map(l => l.letter),
    level === 3 ? 5 : level === 2 ? 4 : 3, round + level * 3).map(display);
  const choose = (correct: boolean) => {
    if (!firstTap.current) {
      firstTap.current = true;
      void recordLetterAttempt(target.letter, correct).catch(() => {});
    }
    done(correct);
  };
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
        onAnswer={choose}
      />
      <LocalizedText style={styles.helper}
        english={level === 1 ? "BIG letters" : level === 2 ? "little letters" : "Match BIG to little"}
        tamil={level === 1 ? "பெரிய லெட்டர்!" : level === 2 ? "சின்ன லெட்டர்!" : "பெரிய letter-க்கு சரியான சின்ன letter-ஐ டச் பண்ணு!"} />
    </View>
  );
}

const styles = StyleSheet.create({
 container: { alignItems: "center", gap: spacing.md },
 feature: { flexDirection: "row", alignItems: "center", gap: spacing.lg, padding: spacing.md, backgroundColor: colors.pastelPurpleTint, borderRadius: radius.xl },
 picture: { fontSize: 52 },
 target: { fontSize: 80, fontWeight: "900", color: colors.onSurface },
 helper: { ...typography.caption, color: colors.onSurfaceMuted },
});
