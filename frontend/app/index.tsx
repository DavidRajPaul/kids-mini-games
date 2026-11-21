import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { AccessibilityInfo, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { useSoundEffects } from "@/src/audio/useSoundEffects";
import { useGameSpeech, type GameLanguage } from "@/src/audio/useGameSpeech";
import { GameBackground } from "@/src/components/GameBackground";
import { SparkleField } from "@/src/components/SparkleField";
import { colors, radius, shadows, spacing, typography } from "@/src/theme/tokens";

type GameEntry = {
  id: string; title: string; subtitle: string; emoji: string;
  tint: string; route: string;
};
const GAMES: GameEntry[] = [
  { id: "letter-safari", title: "Letter Safari", subtitle: "Spot the ABCs", emoji: "🔤", tint: colors.pastelPinkTint, route: "/games/letter-safari" },
  { id: "sound-detective", title: "Sound Detective", subtitle: "Hear it, find it", emoji: "👂", tint: colors.softBlueTint, route: "/games/sound-detective" },
  { id: "word-magic", title: "First Word Magic", subtitle: "Build a tiny word", emoji: "🪄", tint: colors.pastelYellowTint, route: "/games/word-magic" },
  { id: "shape-puzzle", title: "Shape Puzzle", subtitle: "Fit the shapes", emoji: "🔷", tint: colors.pastelPurpleTint, route: "/games/shape-puzzle" },
  { id: "memory-safari", title: "Memory Safari", subtitle: "Find the pairs", emoji: "🦁", tint: colors.pastelPinkTint, route: "/games/memory-safari" },
  { id: "count-animals", title: "Count Animals", subtitle: "One, two, three!", emoji: "🐘", tint: colors.softGreenTint, route: "/games/count-animals" },
  { id: "traffic-light", title: "Traffic Lights", subtitle: "Stop and go!", emoji: "🚦", tint: colors.softGreenTint, route: "/games/traffic-light" },
  { id: "what-comes-next", title: "What's Next?", subtitle: "Find the pattern", emoji: "🌟", tint: colors.softBlueTint, route: "/games/what-comes-next" },
  { id: "little-story-builder", title: "Story Builder", subtitle: "Picture stories", emoji: "📖", tint: colors.pastelOrangeTint, route: "/games/little-story-builder" },
  { id: "tic-tac-toe", title: "Tic Tac Toe", subtitle: "Play together", emoji: "⭕", tint: colors.pastelPurpleTint, route: "/games/tic-tac-toe" },
];

function GameTile({ game, index, onPress, animated }: { game: GameEntry; index: number; onPress: () => void; animated: boolean }) {
  const scale = useSharedValue(1);
  const motion = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View entering={animated ? FadeInDown.delay(Math.min(index * 55, 420)).duration(370).springify() : undefined} style={[styles.tileWrap, motion]}>
      <Pressable
        testID={`game-card-${game.id}`} accessibilityRole="button"
        accessibilityLabel={game.title + ". " + game.subtitle}
        onPressIn={() => { if (animated) scale.value = withSpring(0.95); }}
        onPressOut={() => { if (animated) scale.value = withSpring(1); }}
        onPress={onPress}
        style={[styles.tile, { backgroundColor: game.tint }]}
      >
        <Text style={styles.emoji} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{game.emoji}</Text>
        <Text style={styles.tileTitle} numberOfLines={2} adjustsFontSizeToFit>{game.title}</Text>
        <Text style={styles.tileSubtitle} numberOfLines={2}>{game.subtitle}</Text>
        <View style={styles.playHint}>
          <MaterialCommunityIcons name="play-circle" size={25} color={colors.onSurface} />
          <Text style={styles.playText}>PLAY</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
export default function HomeScreen() {
  const router = useRouter();
  const sound = useSoundEffects();
  const { width } = useWindowDimensions();
  const { language, setLanguage, speak, voiceNotice, ready } = useGameSpeech();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [focused, setFocused] = useState(false);
  useFocusEffect(useCallback(() => {
    setFocused(true);
    return () => setFocused(false);
  }, []));
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => subscription.remove();
  }, []);
  const columns = width >= 780 ? 3 : 2;
  const open = (entry: GameEntry) => { sound("button"); router.push(entry.route as never); };
  const switchLanguage = (next: GameLanguage) => {
    setLanguage(next);
    speak(next === "ta" ? "விளையாடலாம்!" : "Let's play!", next);
  };
  return (
    <GameBackground>
      <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <SparkleField active={focused && !reduceMotion} />
            <Text style={styles.greeting}>👋 {language === "ta" ? "ஹாய் எஸ்ரா குட்டி!" : "Hello, Ezra!"}</Text>
            <Text style={styles.title} testID="app-title">{language === "ta" ? "லெட்டர் மேஜிக்! ✨" : "Letter Magic World! ✨"}</Text>
            <Text style={styles.subtitle}>{language === "ta" ? "பிடிச்ச game-ஐ டச் பண்ணு!" : "Tap a picture to play!"}</Text>
            <View style={styles.languageRow}>
              <Text style={styles.languageLabel}>Voice:</Text>
              {(["en", "ta"] as const).map(lang => (
                <Pressable key={lang} accessibilityRole="button" accessibilityState={{ selected: language === lang }}
                  onPress={() => switchLanguage(lang)} style={[styles.languageChoice, language === lang && styles.languageSelected]}>
                  <Text style={styles.languageText}>{lang === "en" ? "English" : "தமிழ்"}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={styles.grid} testID="game-grid">
            {GAMES.map((game, index) => (
              <View key={game.id} style={{ width: `${100 / columns}%` as `${number}%` }}>
                <GameTile game={game} index={index} animated={!reduceMotion} onPress={() => open(game)} />
              </View>
            ))}
          </View>
          <Pressable testID="progress-open-button" accessibilityRole="button" style={styles.progress}
            onPress={() => { sound("button"); router.push("/progress"); }}>
            <Text style={styles.progressEmoji}>🏆</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.progressTitle}>My Stars</Text>
              <Text style={styles.progressSubtitle}>See what you've learned!</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={28} color={colors.onSurface} />
          </Pressable>
          <Text style={styles.footer}>{language === "ta" ? "🌈 ஜாலியா விளையாடு · Offline · Ads இல்லை" : "🌈 Play at your own pace · Offline · No ads"}</Text>
        </ScrollView>
      </SafeAreaView>
    </GameBackground>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.lg },
  header: { alignItems: "center", gap: spacing.xs, marginTop: spacing.sm, minHeight: 180, justifyContent: "center" },
  greeting: { ...typography.subtitle, color: colors.onSurface },
  title: { ...typography.displayLG, color: colors.onSurface, textAlign: "center" },
  sectionTitle: { ...typography.subtitle, color: colors.onSurface, textAlign: "center" },
  voiceNotice: { ...typography.caption, color: colors.onDanger, backgroundColor: colors.dangerTint, padding: spacing.sm, borderRadius: radius.md, textAlign: "center" },
  subtitle: { ...typography.body, color: colors.onSurfaceMuted, textAlign: "center" },
  languageRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "center", gap: spacing.sm, marginTop: spacing.sm },
  languageLabel: { ...typography.caption, color: colors.onSurfaceMuted },
  languageChoice: { minHeight: 44, justifyContent: "center", paddingHorizontal: spacing.md, borderRadius: radius.pill, backgroundColor: colors.surfaceCard, borderWidth: 2, borderColor: colors.border },
  languageSelected: { borderColor: colors.onSurface, backgroundColor: colors.pastelYellowTint },
  languageText: { ...typography.bodySm, color: colors.onSurface },
  grid: { flexDirection: "row", flexWrap: "wrap", alignItems: "stretch", marginHorizontal: -spacing.xs },
  tileWrap: { flex: 1, padding: spacing.xs },
  tile: { flex: 1, minHeight: 196, padding: spacing.md, borderRadius: radius.xl, alignItems: "center", justifyContent: "center", gap: 5, borderWidth: 2, borderColor: "rgba(255,255,255,0.85)", ...shadows.softer },
  emoji: { fontSize: 57, lineHeight: 69 },
  tileTitle: { ...typography.subtitle, color: colors.onSurface, textAlign: "center", fontSize: 18 },
  tileSubtitle: { ...typography.caption, color: colors.onSurfaceMuted, textAlign: "center" },
  playHint: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: spacing.xs },
  playText: { fontSize: 12, fontWeight: "800", color: colors.onSurface, letterSpacing: 1 },
  progress: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderRadius: radius.xl, backgroundColor: colors.surfaceCard, padding: spacing.md, minHeight: 88, ...shadows.softer },
  progressEmoji: { fontSize: 38 },
  progressTitle: { ...typography.subtitle, color: colors.onSurface },
  progressSubtitle: { ...typography.caption, color: colors.onSurfaceMuted },
  footer: { ...typography.caption, color: colors.onSurfaceMuted, textAlign: "center" },
});
