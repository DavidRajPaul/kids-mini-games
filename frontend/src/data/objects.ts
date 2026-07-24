import { colors } from "@/src/theme/tokens";

/**
 * Object catalog used by Game 1 (Find the Object).
 * Every object is a MaterialCommunityIcons glyph — no external art, fully offline.
 */

export interface GameObject {
  id: string;
  label: string; // Kid-facing name (e.g. "Apple")
  icon: string; // MaterialCommunityIcons name
  color: string; // Icon color
  bg: string; // Background tint for the object tile
}

export const OBJECTS: GameObject[] = [
  { id: "apple", label: "Apple", icon: "food-apple", color: "#D9534F", bg: colors.pastelPinkTint },
  { id: "banana", label: "Banana", icon: "fruit-pineapple", color: "#E0A200", bg: colors.pastelYellowTint },
  { id: "orange", label: "Orange", icon: "fruit-citrus", color: "#E58E26", bg: colors.pastelOrangeTint },
  { id: "cherry", label: "Cherry", icon: "fruit-cherries", color: "#C0392B", bg: colors.pastelPinkTint },
  { id: "grapes", label: "Grapes", icon: "fruit-grapes", color: "#7D3C98", bg: colors.pastelPurpleTint },
  { id: "watermelon", label: "Watermelon", icon: "fruit-watermelon", color: "#2E8B57", bg: colors.softGreenTint },
  { id: "ball", label: "Ball", icon: "soccer", color: "#2C3E50", bg: colors.softBlueTint },
  { id: "car", label: "Car", icon: "car", color: "#2980B9", bg: colors.softBlueTint },
  { id: "bus", label: "Bus", icon: "bus", color: "#E58E26", bg: colors.pastelOrangeTint },
  { id: "train", label: "Train", icon: "train", color: "#8E44AD", bg: colors.pastelPurpleTint },
  { id: "airplane", label: "Airplane", icon: "airplane", color: "#1F6FEB", bg: colors.softBlueTint },
  { id: "boat", label: "Boat", icon: "sail-boat", color: "#16A085", bg: colors.softGreenTint },
  { id: "dog", label: "Dog", icon: "dog", color: "#8B5A2B", bg: colors.pastelOrangeTint },
  { id: "cat", label: "Cat", icon: "cat", color: "#7F8C8D", bg: colors.surfaceTinted },
  { id: "fish", label: "Fish", icon: "fish", color: "#3498DB", bg: colors.softBlueTint },
  { id: "bird", label: "Bird", icon: "bird", color: "#E67E22", bg: colors.pastelOrangeTint },
  { id: "elephant", label: "Elephant", icon: "elephant", color: "#6E7B8B", bg: colors.surfaceTinted },
  { id: "cow", label: "Cow", icon: "cow", color: "#5D4037", bg: colors.pastelPinkTint },
  { id: "duck", label: "Duck", icon: "duck", color: "#E0A200", bg: colors.pastelYellowTint },
  { id: "sun", label: "Sun", icon: "white-balance-sunny", color: "#E0A200", bg: colors.pastelYellowTint },
  { id: "moon", label: "Moon", icon: "moon-waning-crescent", color: "#5B6EAE", bg: colors.softBlueTint },
  { id: "star", label: "Star", icon: "star", color: "#E0A200", bg: colors.pastelYellowTint },
  { id: "cloud", label: "Cloud", icon: "cloud", color: "#7F8C8D", bg: colors.surfaceTinted },
  { id: "flower", label: "Flower", icon: "flower", color: "#D96FA0", bg: colors.pastelPinkTint },
  { id: "tree", label: "Tree", icon: "tree", color: "#2E8B57", bg: colors.softGreenTint },
  { id: "leaf", label: "Leaf", icon: "leaf", color: "#2E8B57", bg: colors.softGreenTint },
  { id: "umbrella", label: "Umbrella", icon: "umbrella", color: "#8E44AD", bg: colors.pastelPurpleTint },
  { id: "cake", label: "Cake", icon: "cake-variant", color: "#D96FA0", bg: colors.pastelPinkTint },
  { id: "gift", label: "Gift", icon: "gift", color: "#C0392B", bg: colors.pastelPinkTint },
  { id: "book", label: "Book", icon: "book-open-variant", color: "#2980B9", bg: colors.softBlueTint },
];

/**
 * Fisher-Yates shuffle — returns a new array, does not mutate the input.
 */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick a fresh round of objects for a given level.
 * Level 1 -> 4 objects, Level 2 -> 6, Level 3 -> 8.
 * Guarantees a unique target and no repeated objects in the same round.
 */
export function pickRound(level: 1 | 2 | 3): { target: GameObject; options: GameObject[] } {
  const count = level === 1 ? 4 : level === 2 ? 6 : 8;
  const options = shuffle(OBJECTS).slice(0, count);
  const target = options[Math.floor(Math.random() * options.length)];
  return { target, options };
}
