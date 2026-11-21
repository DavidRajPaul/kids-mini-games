import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useGameSpeech } from "@/src/audio/useGameSpeech";
import { colors, radius } from "@/src/theme/tokens";

/** Visible replay control with automatically spoken device-language instructions. */
export function SpokenInstruction({ english, tamil }: { english: string; tamil: string }) {
  const { language, ready, speak } = useGameSpeech();
  const prompt = language === "ta" ? tamil : english;
  useEffect(() => { if (ready) void speak(prompt); }, [ready, prompt, speak]);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Repeat spoken instructions"
      testID="repeat-instruction" onPress={() => { void speak(prompt); }} style={styles.button}>
      <Text style={styles.text}>🔊 {language === "ta" ? tamil : english}</Text>
      <Text style={styles.repeat}>{language === "ta" ? "மறுபடியும் கேளு" : "Hear again"}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
 button: { minHeight: 48, paddingHorizontal: 16, paddingVertical: 8, alignItems: "center", justifyContent: "center", borderRadius: radius.pill, backgroundColor: colors.softBlueTint },
 text: { fontSize: 15, fontWeight: "700", color: colors.onSurface, textAlign: "center" },
 repeat: { fontSize: 12, color: colors.onSurfaceMuted, textAlign: "center" },
});
