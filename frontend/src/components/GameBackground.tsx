import React, { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "@/src/theme/tokens";

/**
 * Full-height calm background shared by every screen.
 */
export function GameBackground({ children }: PropsWithChildren) {
  return <View style={styles.wrap}>{children}</View>;
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});
