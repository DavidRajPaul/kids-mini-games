import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LearningGame, type Level } from "@/src/components/LearningGame";
import { TamilChoices } from "@/src/components/TamilChoices";
import { UYIR, tamilChoices } from "@/src/data/tamilReading";
import { recordTamilLetter } from "@/src/storage/tamilProgress";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

function Round({ level, round, locked, done }: { level: Level; round: number; locked: boolean; done: (correct: boolean) => void }) {
  const target = UYIR[(level - 1) * 4 + round];
  const pool = UYIR.slice((level - 1) * 4, level * 4).map(item => item.glyph);
  const options = tamilChoices(target.glyph, pool, level === 1 ? 3 : 4, round * 3 + level);
  const attempted = useRef(false);
  const hinted = useRef(false);
  const [hint, setHint] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.emoji}>🔮</Text>
        <Text style={styles.question}>{hint ? target.glyph : "❔"}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Show letter hint" testID="tamil-show-hint"
        onPress={() => { hinted.current = true; setHint(value => !value); }} style={styles.hint}>
        <Text style={styles.hintText}>{hint ? "🙈 ஹின்ட் மறை" : "💡 எழுத்தைக் காட்டவா?"}</Text>
      </Pressable>
      <TamilChoices roundKey={`${level}-${round}`} answer={target.glyph} options={options} locked={locked}
        onAnswer={correct => {
          if (!attempted.current) {
            attempted.current = true;
            void recordTamilLetter(target.glyph, correct && !hinted.current).catch(() => {});
          }
          done(correct);
        }} />
      <Text style={styles.note}>உயிரெழுத்து · {level} / 3</Text>
    </View>
  );
}

export default function TamilVowelSafari() {
  return (
    <LearningGame id="tamil-vowels" title="உயிரெழுத்து வேட்டை" forceLanguage="ta" rounds={4}
      instruction={() => "Tap the letter that you hear."}
      tamilInstruction={(level, round) => `குட்டி, ${UYIR[(level - 1) * 4 + round].glyph} எழுத்தை கண்டுபிடி பார்க்கலாம்!`}
      displayInstruction={() => "🔊 எழுத்தைக் கேட்டு, சரியானதை டச் பண்ணு!"}>
      {({ level, round, done, locked }) => (
        <Round key={`${level}-${round}`} level={level} round={round} done={done} locked={locked}/>
      )}
    </LearningGame>
  );
}

const styles = StyleSheet.create({
 container: { alignItems: "center", gap: spacing.md },
 hero: { backgroundColor: colors.pastelPurpleTint, borderRadius: radius.xl, minWidth: 158, minHeight: 140, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.md, padding: spacing.md },
 emoji: { fontSize: 48 }, question: { fontSize: 80, color: colors.onSurface, fontWeight: "800" },
 hint: { minHeight: 48, backgroundColor: colors.softBlueTint, borderRadius: radius.pill, paddingHorizontal: spacing.md, justifyContent: "center" },
 hintText: { ...typography.bodySm, color: colors.onSurface },
 note: { ...typography.caption, color: colors.onSurfaceMuted },
});
