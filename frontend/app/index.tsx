import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { GameBackground } from "@/src/components/GameBackground";
import { GameCard } from "@/src/components/GameCard";
import { useSoundEffects } from "@/src/audio/useSoundEffects";
import { colors, spacing, typography, radius, shadows } from "@/src/theme/tokens";

interface GameEntry {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: string;
  iconColor: string;
  route: string;
}

const GAMES: GameEntry[] = [
  {
    id: "find-object",
    title: "Find the Object",
    subtitle: "Spot the right item",
    icon: "magnify",
    tint: colors.softBlueTint,
    iconColor: "#1F6FEB",
    route: "/games/find-object",
  },
  {
    id: "count-animals",
    title: "Count the Animals",
    subtitle: "Count and pick the number",
    icon: "numeric",
    tint: colors.softGreenTint,
    iconColor: "#2E8B57",
    route: "/games/count-animals",
  },
  {
    id: "bigger-smaller",
    title: "Bigger or Smaller",
    subtitle: "Compare two things",
    icon: "unfold-more-horizontal",
    tint: colors.pastelOrangeTint,
    iconColor: "#E58E26",
    route: "/games/bigger-smaller",
  },
  {
    id: "same-different",
    title: "Same or Different",
    subtitle: "Look closely and choose",
    icon: "compare",
    tint: colors.pastelYellowTint,
    iconColor: "#A88A00",
    route: "/games/same-different",
  },
  {
    id: "shape-puzzle",
    title: "Shape Puzzle",
    subtitle: "Drag shapes into place",
    icon: "puzzle",
    tint: colors.pastelPurpleTint,
    iconColor: "#8E44AD",
    route: "/games/shape-puzzle",
  },
  {
    id: "memory-safari", title: "Memory Safari", subtitle: "Find matching animals", icon: "cards", tint: colors.softGreenTint, iconColor: "#2E8B57", route: "/games/memory-safari",
  },
  {
    id: "traffic-light", title: "Traffic Light Challenge", subtitle: "Practice stop and go", icon: "traffic-light", tint: colors.pastelOrangeTint, iconColor: "#B45309", route: "/games/traffic-light",
  },
  {
    id: "what-comes-next", title: "What Comes Next?", subtitle: "Complete the pattern", icon: "shape", tint: colors.pastelPurpleTint, iconColor: "#8E44AD", route: "/games/what-comes-next",
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    subtitle: "Play together with a friend",
    icon: "close-thick",
    tint: colors.pastelPinkTint,
    iconColor: "#D9534F",
    route: "/games/tic-tac-toe",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const playSound = useSoundEffects();

  const openGame = (entry: GameEntry) => {
    playSound("button");
    router.push(entry.route as never);
  };

  const openProgress = () => {
    playSound("button");
    router.push("/progress" as never);
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

          <Animated.View entering={FadeInDown.delay(60).duration(280)}>
            <View style={styles.progressCard} testID="progress-card">
              <View style={[styles.progressTile, { backgroundColor: colors.pastelYellowTint }]}>
                <MaterialCommunityIcons name="star" size={30} color="#E0A200" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.progressTitle}>Your Progress</Text>
                <Text style={styles.progressSubtitle}>See stars you earned</Text>
              </View>
              <Text
                testID="progress-open-button"
                onPress={openProgress}
                style={styles.progressCta}
              >
                Open ›
              </Text>
            </View>
          </Animated.View>

          <View style={styles.list}>
            {GAMES.map((g, idx) => (
              <Animated.View
                key={g.id}
                entering={FadeInDown.delay(120 + idx * 60).duration(280)}
              >
                <GameCard
                  testID={`game-card-${g.id}`}
                  title={g.title}
                  subtitle={g.subtitle}
                  icon={g.icon}
                  tint={g.tint}
                  iconColor={g.iconColor}
                  onPress={() => openGame(g)}
                />
              </Animated.View>
            ))}
          </View>

          <View style={styles.footer}>
            <MaterialCommunityIcons name="shield-check" size={18} color={colors.onSurfaceMuted} />
            <Text style={styles.footerText}>Offline · No ads · No login</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GameBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
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
  progressCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.softer,
  },
  progressTile: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTitle: {
    ...typography.subtitle,
    color: colors.onSurface,
  },
  progressSubtitle: {
    ...typography.caption,
    color: colors.onSurfaceMuted,
  },
  progressCta: {
    ...typography.subtitle,
    color: "#1F6FEB",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  list: {
    gap: spacing.md,
    marginTop: spacing.xs,
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
