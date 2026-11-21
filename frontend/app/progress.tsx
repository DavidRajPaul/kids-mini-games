import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useSoundEffects } from "@/src/audio/useSoundEffects";
import { GameBackground } from "@/src/components/GameBackground";
import { GameTopBar } from "@/src/components/GameTopBar";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { GameId, GameProgress, getProgress } from "@/src/storage/progress";
import { colors, radius, spacing, typography, shadows } from "@/src/theme/tokens";
import { storage } from "@/src/utils/storage";
import { clearReadingStats, getReadingStats, type ReadingStats } from "@/src/storage/readingProgress";
import { clearTamilLetterStats, getTamilLetterStats, type TamilLetterStats } from "@/src/storage/tamilProgress";

const ROWS: { id: GameId | "tic-tac-toe"; title: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; tint: string; iconColor: string; }[] = [
  { id: "find-object", title: "Find the Object", icon: "magnify", tint: colors.softBlueTint, iconColor: "#1F6FEB" },
  { id: "count-animals", title: "Count the Animals", icon: "numeric", tint: colors.softGreenTint, iconColor: "#2E8B57" },
  { id: "bigger-smaller", title: "Bigger or Smaller", icon: "unfold-more-horizontal", tint: colors.pastelOrangeTint, iconColor: "#E58E26" },
  { id: "same-different", title: "Same or Different", icon: "compare", tint: colors.pastelYellowTint, iconColor: "#A88A00" },
  { id: "shape-puzzle", title: "Shape Puzzle", icon: "puzzle", tint: colors.pastelPurpleTint, iconColor: "#8E44AD" },
  { id: "tamil-vowels", title: "உயிரெழுத்து வேட்டை", icon: "alphabetical-variant", tint: colors.pastelYellowTint, iconColor: "#9B7500" },
  { id: "tamil-mei", title: "மெய்யெழுத்து மேஜிக்", icon: "alphabetical-variant", tint: colors.pastelPinkTint, iconColor: "#B45A76" },
  { id: "tamil-sounds", title: "தமிழ் ஒலி தோட்டம்", icon: "ear-hearing", tint: colors.softGreenTint, iconColor: "#2E8B57" },
  { id: "tamil-words", title: "தமிழ் சொல் மேஜிக்", icon: "auto-fix", tint: colors.pastelPurpleTint, iconColor: "#8E44AD" },
  { id: "letter-safari", title: "Letter Safari", icon: "alphabetical", tint: colors.pastelPinkTint, iconColor: "#D9534F" },
  { id: "sound-detective", title: "Sound Detective", icon: "ear-hearing", tint: colors.softBlueTint, iconColor: "#1F6FEB" },
  { id: "word-magic", title: "First Word Magic", icon: "auto-fix", tint: colors.pastelYellowTint, iconColor: "#A88A00" },
  { id: "memory-safari", title: "Memory Safari", icon: "cards", tint: colors.softGreenTint, iconColor: "#2E8B57" },
  { id: "traffic-light", title: "Traffic Light Challenge", icon: "traffic-light", tint: colors.pastelOrangeTint, iconColor: "#B45309" },
  { id: "what-comes-next", title: "What Comes Next?", icon: "shape", tint: colors.pastelPurpleTint, iconColor: "#8E44AD" },
  { id: "little-story-builder", title: "Little Story Builder", icon: "book-open-page-variant", tint: colors.pastelOrangeTint, iconColor: "#B45309" },
];

interface Row {
  id: GameId;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  tint: string;
  iconColor: string;
  progress: GameProgress;
}

export default function ProgressScreen() {
  const router = useRouter();
  const playSound = useSoundEffects();
  const [rows, setRows] = useState<Row[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [totalPlayed, setTotalPlayed] = useState(0);
  const [readingStats, setReadingStats] = useState<ReadingStats>({});
  const [tamilStats, setTamilStats] = useState<TamilLetterStats>({});

  const load = useCallback(async () => {
    const filled: Row[] = [];
    let stars = 0;
    let played = 0;
    for (const r of ROWS) {
      if (r.id === "tic-tac-toe") continue;
      const progress = await getProgress(r.id as GameId);
      filled.push({ ...r, id: r.id as GameId, progress });
      stars += progress.starsEarned;
      played += progress.timesPlayed;
    }
    setRows(filled);
    setTotalStars(stars);
    setTotalPlayed(played);
    setReadingStats(await getReadingStats());
    setTamilStats(await getTamilLetterStats());
  }, []);

  useEffect(() => { load(); }, [load]);

  const clearAll = async () => {
    playSound("button");
    for (const r of ROWS) {
      if (r.id === "tic-tac-toe") continue;
      await storage.removeItem(`ezra.progress.${r.id}`);
    }
    await clearReadingStats();
    await clearTamilLetterStats();
    await load();
  };

  return (
    <GameBackground>
      <SafeAreaView style={styles.safe} edges={["top", "bottom", "left", "right"]}>
        <GameTopBar
          title="Your Progress"
          onHome={() => { playSound("button"); router.replace("/"); }}
          onRestart={clearAll}
          onBack={() => { playSound("button"); router.back(); }}
        />
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(280)} style={styles.summary}>
            <View style={[styles.summaryTile, { backgroundColor: colors.pastelYellowTint }]}>
              <MaterialCommunityIcons name="star" size={32} color="#E0A200" />
              <Text style={styles.summaryValue} testID="total-stars">{totalStars}</Text>
              <Text style={styles.summaryLabel}>Stars</Text>
            </View>
            <View style={[styles.summaryTile, { backgroundColor: colors.softBlueTint }]}>
              <MaterialCommunityIcons name="gamepad-variant" size={32} color="#1F6FEB" />
              <Text style={styles.summaryValue} testID="total-plays">{totalPlayed}</Text>
              <Text style={styles.summaryLabel}>Plays</Text>
            </View>
          </Animated.View>

          <View style={styles.readingCard} testID="tamil-recognition-progress">
            <Text style={styles.readingTitle}>🌸 தமிழ் உயிரெழுத்து பயிற்சி</Text>
            <Text style={styles.readingNote}>முதல் முயற்சி சரியா இருந்ததா? இது practice மட்டும், தேர்வு கிடையாது.</Text>
            <View style={styles.letterGrid}>
              {Object.entries(tamilStats).map(([letter, stats]) => (
                <View key={letter} style={styles.letterChip}>
                  <Text style={styles.letterTitle}>{letter}</Text>
                  <Text style={styles.letterScore}>{stats.firstTry}/{stats.tried}</Text>
                </View>
              ))}
            </View>
            {Object.keys(tamilStats).length === 0 ? <Text style={styles.rowMeta}>உயிரெழுத்து வேட்டை விளையாடிப் பாருங்க!</Text> : null}
          </View>
          <View style={styles.readingCard} testID="letter-recognition-progress">
            <Text style={styles.readingTitle}>🔤 Letter Practice</Text>
            <Text style={styles.readingNote}>First-try matches, not a reading test. Try the same letters again on different days.</Text>
            <View style={styles.letterGrid}>
              {Object.entries(readingStats).sort(([a],[b]) => a.localeCompare(b)).map(([letter, stats]) => (
                <View key={letter} style={styles.letterChip}>
                  <Text style={styles.letterTitle}>{letter.toUpperCase()}</Text>
                  <Text style={styles.letterScore}>{stats.firstTry}/{stats.attempts}</Text>
                </View>
              ))}
            </View>
            {Object.keys(readingStats).length === 0 ? <Text style={styles.rowMeta}>Play Letter Safari to see letter practice here.</Text> : null}
          </View>
          <View style={styles.list}>
            {rows.map((r, idx) => (
              <Animated.View
                key={r.id}
                entering={FadeInDown.delay(60 + idx * 40).duration(260)}
                style={[styles.row, shadows.softer]}
                testID={`progress-row-${r.id}`}
              >
                <View style={[styles.iconTile, { backgroundColor: r.tint }]}>
                  <MaterialCommunityIcons name={r.icon} size={30} color={r.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{r.title}</Text>
                  <Text style={styles.rowMeta}>
                    Level {r.progress.highestLevel} · Played {r.progress.timesPlayed}
                  </Text>
                </View>
                <View style={styles.stars}>
                  {[0, 1, 2].map((i) => (
                    <MaterialCommunityIcons
                      key={i}
                      name={i < r.progress.starsEarned ? "star" : "star-outline"}
                      size={20}
                      color={i < r.progress.starsEarned ? "#E0A200" : colors.borderStrong}
                    />
                  ))}
                </View>
              </Animated.View>
            ))}
          </View>

          <View style={styles.actionsWrap}>
            <PrimaryButton
              testID="progress-clear-button"
              label="Reset Progress"
              variant="ghost"
              onPress={clearAll}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GameBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  summary: {
    flexDirection: "row",
    gap: spacing.md,
  },
  summaryTile: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: "center",
    gap: 4,
  },
  summaryValue: {
    ...typography.displayLG,
    color: colors.onSurface,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.onSurfaceMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  list: { gap: spacing.sm, marginTop: spacing.xs },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconTile: {
    width: 52, height: 52, borderRadius: radius.md,
    alignItems: "center", justifyContent: "center",
  },
  rowTitle: { ...typography.subtitle, color: colors.onSurface },
  rowMeta: { ...typography.caption, color: colors.onSurfaceMuted },
  stars: { flexDirection: "row", gap: 2 },
  actionsWrap: { marginTop: spacing.md },
  readingCard: { borderRadius: radius.lg, backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.border, padding: spacing.md, gap: spacing.sm },
  readingTitle: { ...typography.subtitle, color: colors.onSurface },
  readingNote: { ...typography.caption, color: colors.onSurfaceMuted },
  letterGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  letterChip: { minWidth: 62, alignItems: "center", borderRadius: radius.md, backgroundColor: colors.pastelYellowTint, padding: spacing.sm },
  letterTitle: { ...typography.subtitle, color: colors.onSurface },
  letterScore: { ...typography.caption, color: colors.onSurfaceMuted },
});
