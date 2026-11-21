import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from "react-native-reanimated";
import { colors, radius, spacing, typography } from "@/src/theme/tokens";

type Props = {
  answer: string;
  options: readonly string[];
  locked: boolean;
  onAnswer: (correct: boolean) => void;
  roundKey: string;
};

function Tile({ glyph, disabled, onPress }: { glyph: string; disabled: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);
  const motion = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={motion}>
      <Pressable
        testID={`tamil-option-${glyph}`}
        accessibilityRole="button"
        accessibilityLabel={glyph}
        disabled={disabled}
        onPress={() => {
          scale.value = withSequence(withSpring(1.12), withSpring(1));
          onPress();
        }}
        style={styles.tile}
      >
        <Text style={styles.glyph} adjustsFontSizeToFit numberOfLines={1}>{glyph}</Text>
      </Pressable>
    </Animated.View>
  );
}

/** Big grapheme choices and no timed/punitive failure. */
export function TamilChoices({ answer, options, locked, onAnswer, roundKey }: Props) {
  const [feedback, setFeedback] = useState("");
  useEffect(() => setFeedback(""), [roundKey]);
  return (
    <View style={styles.container} testID="tamil-options">
      <View style={styles.choices}>
        {options.map(glyph => (
          <Tile key={glyph} glyph={glyph} disabled={locked} onPress={() => {
            const correct = glyph === answer;
            setFeedback(correct ? "செம குட்டி! சூப்பர்! ✨" : "பரவாயில்ல! இன்னொரு தடவை ட்ரை பண்ணு.");
            onAnswer(correct);
          }} />
        ))}
      </View>
      <Text style={styles.feedback} accessibilityLiveRegion="polite">{feedback}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
 container: { alignItems: "center", gap: spacing.md },
 choices: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: spacing.sm },
 tile: { width: 96, minHeight: 100, padding: spacing.xs, backgroundColor: colors.pastelYellowTint, borderColor: colors.borderStrong, borderWidth: 2, borderRadius: radius.xl, justifyContent: "center", alignItems: "center" },
 glyph: { fontSize: 44, fontWeight: "800", color: colors.onSurface, textAlign: "center" },
 feedback: { ...typography.bodySm, minHeight: 28, textAlign: "center", color: colors.onSurfaceMuted },
});
