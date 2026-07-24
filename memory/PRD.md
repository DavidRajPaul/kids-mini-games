# Ezra Brain Games — Product Requirements

## Overview
Ezra Brain Games is a **fully offline** educational app for children aged 4–6, built with Expo + React Native.
No ads, no login, no tracking, no purchases, no notifications. Calm learning only.

## Features
- **Home screen** with 6 game cards, a Progress card, and calm pastel design
- **Game 1 — Find the Object**: 3 levels (4/6/8 objects), 3 rounds each, randomized layouts
- **Game 2 — Count the Animals**: 3 levels (max count 4/6/10), 3 rounds each, 3 number options
- **Game 3 — Bigger or Smaller**: 3 levels (gap 5/3/1), size-scaled illustrations, random "Bigger?"/"Smaller?"
- **Game 4 — Same or Different**: 3 levels, 4 rounds each; L3 uses subtle color shifts on same icon
- **Game 5 — Shape Puzzle**: 3 levels (3/4/5 shapes), true drag-and-drop with snap animation, dashed silhouette drop zone
- **Game 6 — Tic Tac Toe**: 2-player pass-and-play, running score (X, O, Draws), winning line highlighted
- **Progress screen**: totals of stars + plays, per-game rows with level, plays, and stars; Reset Progress

## Design System
- Soft pastels only (Soft Blue, Soft Green, Pastel Orange, Pastel Yellow, Pastel Pink, Pastel Purple)
- 48pt+ touch targets, generous spacing (8pt grid), rounded corners (24pt cards)
- Subtle animations only (150/200/250/300 ms) via react-native-reanimated
- MaterialCommunityIcons throughout — no AI illustrations
- Custom soft sound effects (tap, button, correct, wrong, star, complete) synthesized locally as WAV files

## Storage
- All progress stored locally via `@/src/utils/storage` (AsyncStorage)
- Per game: highestLevel, timesPlayed, starsEarned, completed
- No cloud sync, no analytics

## Architecture
- Modular by game: each game lives in `/app/games/<name>.tsx`
- Reusable components in `/src/components/` (GameCard, GameTopBar, SuccessDialog, ProgressIndicator, PrimaryButton, QuestionText, GameBackground)
- Data catalogs in `/src/data/` (objects, animals, sizes, compare, shapes)
- Audio hook in `/src/audio/useSoundEffects.ts`
- Design tokens in `/src/theme/tokens.ts`

## Integrations
- None. Fully offline. No LLMs, no auth, no backend.
