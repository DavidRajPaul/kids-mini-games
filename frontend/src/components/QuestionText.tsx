import React from "react";
import { StyleSheet, Text } from "react-native";

import { colors, typography } from "@/src/theme/tokens";

interface Props {
  children: React.ReactNode;
  testID?: string;
}

/**
 * Large, kid-friendly question text.
 */
export function QuestionText({ children, testID }: Props) {
  return (
    <Text testID={testID} style={styles.text} accessibilityRole="header">
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.displayLG,
    color: colors.onSurface,
    textAlign: "center",
  },
});
