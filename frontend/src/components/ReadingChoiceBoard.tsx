import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from "react-native-reanimated";
import { useGameSpeech } from "@/src/audio/useGameSpeech";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

type Props = {
  choices: readonly string[];
  answer: string;
  locked: boolean;
  onAnswer: (correct: boolean) => void;
  accessibilityPrefix?: string;
};

function Choice({ value, disabled, onPress, prefix }: {
  value: string; disabled: boolean; onPress: () => void; prefix: string;
}) {
  const scale = useSharedValue(1);
  const animation = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[styles.tileWrap, animation]}>
      <Pressable
        testID={`reading-option-${value}`}
        accessibilityRole="button"
        accessibilityLabel={prefix + " " + value}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => {
          scale.value = withSequence(withSpring(1.12), withSpring(1));
          onPress();
        }}
        style={styles.tile}
      >
        <Text style={styles.letter}>{value}</Text>
      </Pressable>
    </Animated.View>
  );
}

/** No tiny touch targets; wrong taps give an encouraging retry instead of ending the game. */
export function ReadingChoiceBoard({ choices, answer, locked, onAnswer, accessibilityPrefix = "Letter" }: Props) {
  const { language } = useGameSpeech();
  const [hint, setHint] = useState("");
  useEffect(() => setHint(""), [answer, choices.join("|")]);
  return (
    <View style={styles.container}>
      <View style={styles.options}>
        {choices.map(choice => (
          <Choice key={choice} value={choice} disabled={locked}
            prefix={accessibilityPrefix}
            onPress={() => {
              const correct = choice === answer;
              setHint(correct
                ? (language === "ta" ? "செம குட்டி! 🌟" : "You got it! 🌟")
                : (language === "ta" ? "பரவாயில்ல குட்டி, இன்னொரு தடவை ட்ரை பண்ணு!" : "Nice try! Have another go."));
              onAnswer(correct);
            }}
          />
        ))}
      </View>
      <Text accessibilityLiveRegion="polite" style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
 container: { alignItems: "center", gap: spacing.md },
 options: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: spacing.md },
 tileWrap: { minWidth: 84 },
 tile: {
   minWidth: 84, minHeight: 92, padding: spacing.sm,
   borderRadius: radius.xl, backgroundColor: colors.pastelYellowTint,
   borderWidth: 2, borderColor: colors.borderStrong,
   justifyContent: "center", alignItems: "center",
 },
 letter: { fontSize: 48, lineHeight: 58, fontWeight: "800", color: colors.onSurface },
 hint: { ...typography.bodySm, color: colors.onSurface, textAlign: "center", minHeight: 38 },
});
