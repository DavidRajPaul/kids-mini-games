import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { GameBackground } from "@/src/components/GameBackground";
import { GameCard } from "@/src/components/GameCard";
import { useSoundEffects } from "@/src/audio/useSoundEffects";
import { colors, spacing, typography } from "@/src/theme/tokens";

interface GameEntry {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: string;
  iconColor: string;
  route: string;
  ready: boolean;
}

const GAMES: GameEntry[] = [
  {
    id: "find-object",
    title: "Find the Object",
    subtitle: "Spot the right item to sharpen observation",
    icon: "magnify",
    tint: colors.softBlueTint,
    iconColor: "#1F6FEB",
    route: "/games/find-object",
    ready: true,
  },
  {
    id: "count-animals",
    title: "Count the Animals",
    subtitle: "Count carefully and pick the right number",
    icon: "numeric",
    tint: colors.softGreenTint,
    iconColor: "#2E8B57",
    route: "/games/count-animals",
    ready: false,
  },
  {
    id: "bigger-smaller",
    title: "Bigger or Smaller",
    subtitle: "Compare and choose the bigger one",
    icon: "unfold-more-horizontal",
    tint: colors.pastelOrangeTint,
    iconColor: "#E58E26",
    route: "/games/bigger-smaller",
    ready: false,
  },
  {
    id: "same-different",
    title: "Same or Different",
    subtitle: "Look closely and tell them apart",
    icon: "compare",
    tint: colors.pastelYellowTint,
    iconColor: "#A88A00",
    route: "/games/same-different",
    ready: false,
  },
  {
    id: "shape-puzzle",
    title: "Shape Puzzle",
    subtitle: "Drag shapes to their matching spot",
    icon: "puzzle",
    tint: colors.pastelPurpleTint,
    iconColor: "#8E44AD",
    route: "/games/shape-puzzle",
    ready: false,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const playSound = useSoundEffects();

  const handleOpen = (entry: GameEntry) => {
    playSound("button");
    if (entry.ready) {
      router.push(entry.route as never);
    }
  };

  return (
    <GameBackground>
      <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
            <View style={styles.headerBadge}>
              <MaterialCommunityIcons name="brain" size={30} color="#8E44AD" />
            </View>
            <Text style={styles.title} testID="app-title">Ezra Brain Games</Text>
            <Text style={styles.subtitle}>Calm learning games for curious minds</Text>
          </Animated.View>

          <View style={styles.list}>
            {GAMES.map((g, idx) => (
              <Animated.View
                key={g.id}
                entering={FadeInDown.delay(80 + idx * 60).duration(280)}
              >
                <GameCard
                  testID={`game-card-${g.id}`}
                  title={g.title}
                  subtitle={g.ready ? g.subtitle : "Coming soon"}
                  icon={g.icon}
                  tint={g.tint}
                  iconColor={g.ready ? g.iconColor : colors.borderStrong}
                  onPress={() => handleOpen(g)}
                />
              </Animated.View>
            ))}
          </View>

          <View style={styles.footer}>
            <MaterialCommunityIcons name="shield-check" size={18} color={colors.onSurfaceMuted} />
            <Text style={styles.footerText}>
              Offline · No ads · No login
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GameBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  headerBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.pastelPurpleTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.displayXL,
    color: colors.onSurface,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    fontWeight: "500",
    color: colors.onSurfaceMuted,
    textAlign: "center",
  },
  list: {
    gap: spacing.md,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  footerText: {
    ...typography.caption,
    color: colors.onSurfaceMuted,
  },
});
