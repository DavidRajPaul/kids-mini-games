import React from "react";
import { Pressable } from "react-native";
import { useGameSpeech } from "@/src/audio/useGameSpeech";
import { StyleSheet, Text, View } from "react-native";
import { LearningGame } from "@/src/components/LearningGame";
import { ReadingChoiceBoard } from "@/src/components/ReadingChoiceBoard";
import { LocalizedText } from "@/src/components/LocalizedText";
import { LETTERS, letterFor, pickOptions } from "@/src/data/reading";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

export default function SoundDetective() {
  return (
    <LearningGame
      id="sound-detective"
      title="Sound Detective"
      rounds={4}
      instruction={() => "Tap the speaker, then find the first sound."}
      tamilInstruction={() => "ஸ்பீக்கரை டச் பண்ணி வேர்டைக் கேளு! முதல் சவுண்ட் எந்த லெட்டர்னு கண்டுபிடி குட்டி!"}
    >
      {({ level, round, done, locked }) => {
        const target = letterFor(level, round);
        const SpeakWord = () => { const { speak, language } = useGameSpeech(); return <Pressable accessibilityRole="button" accessibilityLabel="Hear the example word" testID="hear-word" onPress={() => { void speak(target.word, "en"); }} style={styles.speak}><Text style={styles.speakText}>{language === "ta" ? "🔊 word-ஐ கேளு" : "🔊 Hear word"}</Text></Pressable>; };
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
            <LocalizedText english="Listen first, then choose a letter." tamil="முதல்ல கேளு, அப்புறம் letter-ஐ டச் பண்ணு!" style={styles.helper} />
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
