import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LearningGame, type Level } from "@/src/components/LearningGame";
import { TamilChoices } from "@/src/components/TamilChoices";
import { JOININGS, SINGLE_WORDS, SHORT_WORDS, tamilChoices } from "@/src/data/tamilReading";
import { useGameSpeech } from "@/src/audio/useGameSpeech";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

function Round({ level, round, done, locked }: {
  level: Level; round: number; done: (correct: boolean) => void; locked: boolean;
}) {
  const { speak } = useGameSpeech();
  const entry = level === 1 ? JOININGS[round] : level === 2 ? SINGLE_WORDS[round] : SHORT_WORDS[round];
  const answer = level === 1 ? JOININGS[round].result : entry.glyph;
  const pool = level === 1 ? JOININGS.map(item => item.result)
    : level === 2 ? SINGLE_WORDS.map(item => item.glyph)
    : SHORT_WORDS.map(item => item.glyph);
  const options = tamilChoices(answer, pool, level === 1 ? 3 : 4, level * 3 + round);
  const example = level === 1 ? JOININGS[round].result : entry.word;
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>{entry.emoji}</Text>
        {level === 1 ? (
          <Text style={styles.equation} testID="tamil-join-question">
            {JOININGS[round].first} + {JOININGS[round].vowel} = ❔
          </Text>
        ) : (
          <Text style={styles.question}>இந்த படம் எந்த வார்த்தை?</Text>
        )}
      </View>
      <Pressable testID="tamil-read-aloud" accessibilityRole="button" accessibilityLabel="Hear the Tamil sound or word"
        onPress={() => { void speak(example, "ta"); }} style={styles.sound}>
        <Text style={styles.soundText}>🔊 {level === 1 ? "சத்தத்தைக் கேளு" : "வார்த்தையைக் கேளு"}</Text>
      </Pressable>
      <TamilChoices roundKey={`${level}-${round}`} options={options} answer={answer} locked={locked} onAnswer={done}/>
      <Text style={styles.note}>{level === 1 ? "மெய் + உயிர் = உயிர்மெய்" : level === 2 ? "ஒரு எழுத்துச் சொல்" : "சின்ன தமிழ் வார்த்தை"}</Text>
    </View>
  );
}

export default function TamilWordMagic() {
  return (
    <LearningGame id="tamil-words" title="தமிழ் சொல் மேஜிக்" forceLanguage="ta" rounds={4}
      instruction={() => "Join the letters or find the written word."}
      tamilInstruction={level => level === 1
        ? "இரண்டு எழுத்தையும் சேர்த்தா எந்த உயிர்மெய் எழுத்து வரும்? கண்டுபிடி குட்டி!"
        : "படத்தைப் பாரு! சின்ன தமிழ் வார்த்தையைப் படிக்கலாமா? வேண்டும்னா கேட்டு பாரு!"}
      displayInstruction={level => level === 1 ? "🪄 எழுத்துகளைச் சேர்த்து கண்டுபிடி!" : "📖 படத்தைப் பார்த்து சரியான சொல்லை டச் பண்ணு!"}>
      {({ level, round, done, locked }) => (
        <Round key={`${level}-${round}`} level={level} round={round} done={done} locked={locked}/>
      )}
    </LearningGame>
  );
}
const styles = StyleSheet.create({
 container: { alignItems: "center", gap: spacing.md },
 card: { minWidth: 235, minHeight: 163, alignItems: "center", justifyContent: "center", backgroundColor: colors.pastelPurpleTint, borderRadius: radius.xl, padding: spacing.md, gap: spacing.sm },
 emoji: { fontSize: 65 }, equation: { fontSize: 35, fontWeight: "800", color: colors.onSurface },
 question: { ...typography.body, color: colors.onSurface, textAlign: "center" },
 sound: { minHeight: 54, borderRadius: radius.pill, paddingHorizontal: spacing.lg, backgroundColor: colors.softBlueTint, alignItems: "center", justifyContent: "center" },
 soundText: { ...typography.bodySm, color: colors.onSurface },
 note: { ...typography.caption, color: colors.onSurfaceMuted },
});
