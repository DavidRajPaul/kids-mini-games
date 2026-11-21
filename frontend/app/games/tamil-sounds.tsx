import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LearningGame, type Level } from "@/src/components/LearningGame";
import { TamilChoices } from "@/src/components/TamilChoices";
import { UYIR, tamilChoices } from "@/src/data/tamilReading";
import { useGameSpeech } from "@/src/audio/useGameSpeech";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

function Round({ level, round, locked, done }: {
  level: Level; round: number; locked: boolean; done: (correct: boolean) => void;
}) {
  const target = UYIR[(level - 1) * 4 + round];
  const options = tamilChoices(target.glyph, UYIR.slice((level - 1) * 4, level * 4).map(v => v.glyph),
    level === 1 ? 3 : 4, round + level * 2);
  const { speak } = useGameSpeech();
  return (
    <View style={styles.container}>
      <View style={styles.pictureCard} testID="tamil-picture">
        <Text style={styles.picture}>{target.emoji}</Text>
      </View>
      <Pressable testID="tamil-hear-word" accessibilityRole="button" accessibilityLabel="Hear the Tamil example word"
        onPress={() => { void speak(target.example, "ta"); }} style={styles.soundButton}>
        <Text style={styles.soundLabel}>🔊 வார்த்தையைக் கேளு!</Text>
      </Pressable>
      <Text style={styles.helper}>இந்த வார்த்தை எந்த உயிரெழுத்துல ஆரம்பிக்குது?</Text>
      <TamilChoices roundKey={`${level}-${round}`} answer={target.glyph} options={options}
        locked={locked} onAnswer={done}/>
    </View>
  );
}

export default function TamilSoundGarden() {
  return (
    <LearningGame id="tamil-sounds" title="தமிழ் ஒலி தோட்டம்" forceLanguage="ta" rounds={4}
      instruction={() => "Hear the Tamil word, then find its first letter."}
      tamilInstruction={() => "படத்தைப் பாரு குட்டி! ஸ்பீக்கரை டச் பண்ணி வார்த்தையைக் கேளு. முதல் உயிரெழுத்து எதுன்னு கண்டுபிடி!"}
      displayInstruction={() => "🎧 சொல்லைக் கேட்டு முதல் உயிரெழுத்தைத் தேர்ந்தெடு!"}>
      {({ level, round, done, locked }) => (
        <Round key={`${level}-${round}`} level={level} round={round} done={done} locked={locked}/>
      )}
    </LearningGame>
  );
}
const styles = StyleSheet.create({
 container: { alignItems: "center", gap: spacing.md },
 pictureCard: { minHeight: 136, minWidth: 160, borderRadius: radius.xl, backgroundColor: colors.softGreenTint, alignItems: "center", justifyContent: "center", padding: spacing.md },
 picture: { fontSize: 78 },
 soundButton: { minHeight: 58, borderRadius: radius.pill, paddingHorizontal: spacing.lg, backgroundColor: colors.pastelPinkTint, alignItems: "center", justifyContent: "center" },
 soundLabel: { ...typography.body, color: colors.onSurface },
 helper: { ...typography.bodySm, color: colors.onSurfaceMuted, textAlign: "center" },
});
