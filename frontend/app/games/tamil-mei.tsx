import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LearningGame, type Level } from "@/src/components/LearningGame";
import { TamilChoices } from "@/src/components/TamilChoices";
import { MEI_GROUPS, tamilChoices } from "@/src/data/tamilReading";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

function Round({ level, round, locked, done }: { level: Level; round: number; locked: boolean; done: (correct: boolean) => void }) {
  const group = MEI_GROUPS[level - 1];
  const target = group.letters[round];
  const [showHint, setShowHint] = useState(false);
  const options = tamilChoices(target, group.letters, level === 1 ? 3 : 4, level * 7 + round);
  return (
    <View style={styles.container}>
      <Text style={styles.group}>{group.name}</Text>
      <View style={styles.hero}><Text style={styles.question}>{showHint ? target : "🔮"}</Text></View>
      <Pressable testID="mei-hint" accessibilityRole="button" accessibilityLabel="Show a Tamil consonant hint"
        onPress={() => setShowHint(v => !v)} style={styles.hint}>
        <Text style={styles.hintText}>{showHint ? "🙈 ஹின்ட் மறை" : "💡 ஹின்ட் காட்டவா?"}</Text>
      </Pressable>
      <TamilChoices roundKey={`${level}-${round}`} answer={target} options={options} locked={locked} onAnswer={done}/>
      <Text style={styles.note}>மெய்யெழுத்துகள் · {level} / 3</Text>
    </View>
  );
}
export default function TamilConsonants() {
  return (
    <LearningGame id="tamil-mei" title="மெய்யெழுத்து மேஜிக்" rounds={6} forceLanguage="ta"
      instruction={() => "Listen and match the Tamil consonant."}
      tamilInstruction={(level, round) => `குட்டி, ${MEI_GROUPS[level - 1].letters[round]} எழுத்தை கண்டுபிடிக்கலாமா?`}
      displayInstruction={() => "🔊 கேட்டு சரியான மெய்யெழுத்தை டச் பண்ணு!"}>
      {({ level, round, done, locked }) =>
        <Round key={`${level}-${round}`} level={level} round={round} locked={locked} done={done}/>
      }
    </LearningGame>
  );
}
const styles = StyleSheet.create({
 container: { alignItems: "center", gap: spacing.md },
 group: { ...typography.subtitle, color: colors.onSurface },
 hero: { minWidth: 135, minHeight: 125, borderRadius: radius.xl, backgroundColor: colors.pastelPinkTint, justifyContent: "center", alignItems: "center" },
 question: { fontSize: 76, color: colors.onSurface, fontWeight: "700" },
 hint: { minHeight: 48, borderRadius: radius.pill, backgroundColor: colors.softBlueTint, paddingHorizontal: spacing.md, justifyContent: "center" },
 hintText: { ...typography.bodySm, color: colors.onSurface },
 note: { ...typography.caption, color: colors.onSurfaceMuted },
});
