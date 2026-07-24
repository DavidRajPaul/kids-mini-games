# Ezra Brain Games — PRD

## Product Vision
An offline, calming educational app for children ages 4–6 that trains observation, logical thinking, pattern recognition, counting, spatial awareness, problem solving, memory, and fine motor skills. No ads, no login, no purchases, no dopamine loops.

## Platform
- Expo (React Native) SDK 54
- iOS + Android + Web preview
- Offline-only, local storage via AsyncStorage (`@/src/utils/storage`)

## Design
- Soft pastel palette (Soft Blue, Soft Green, Pastel Orange, Pastel Yellow, Pastel Pink, Pastel Purple)
- Chunky rounded cards, 48pt touch targets, large readable typography
- Subtle animations (150ms press, 250ms fade, 200ms scale, 300ms snap)
- Vector icons only (MaterialCommunityIcons)

## Audio
Six locally bundled soft WAV files generated with Python sine synthesis: tap, button, correct, wrong, star, complete. Played via `expo-audio`.

## Screens Implemented (Iteration 1)
1. **Home** — Ezra Brain Games title + 5 game cards (Find the Object, Count the Animals, Bigger or Smaller, Same or Different, Shape Puzzle). 4 of 5 marked "Coming soon".
2. **Game 1 — Find the Object**
   - Level 1: 4 objects, Level 2: 6, Level 3: 8
   - 3 rounds per level, randomized layout
   - Correct tap → gentle chime + advance
   - Wrong tap → gentle down-note + retry (no penalty)
   - Success dialog with 3-star rating (0 wrong = 3★, 1–2 wrong = 2★, 3+ wrong = 1★)
   - Home / Restart / Back top bar
   - Progress persisted per-game (highest level, times played, stars, completed)

## Reusable Components
`PrimaryButton`, `GameCard`, `GameTopBar`, `SuccessDialog`, `ProgressIndicator`, `QuestionText`, `GameBackground`.

## Screens Pending (future iterations)
- Game 2: Count the Animals
- Game 3: Bigger or Smaller
- Game 4: Same or Different
- Game 5: Shape Puzzle (drag-and-drop with react-native-gesture-handler)

## Non-Goals
No auth, no analytics, no notifications, no in-app purchase, no coins/gems/energy, no time pressure, no penalties.
