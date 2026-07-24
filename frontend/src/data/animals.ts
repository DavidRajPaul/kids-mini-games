import { colors } from "@/src/theme/tokens";

/**
 * Animal catalog for Game 2 (Count the Animals).
 * All items are @expo/vector-icons MaterialCommunityIcons glyphs.
 */

export interface Animal {
  id: string;
  singular: string;
  plural: string;
  icon: string;
  color: string;
  bg: string;
}

export const ANIMALS: Animal[] = [
  { id: "elephant", singular: "elephant", plural: "elephants", icon: "elephant", color: "#6E7B8B", bg: colors.surfaceTinted },
  { id: "dog", singular: "dog", plural: "dogs", icon: "dog", color: "#8B5A2B", bg: colors.pastelOrangeTint },
  { id: "cat", singular: "cat", plural: "cats", icon: "cat", color: "#7F8C8D", bg: colors.surfaceTinted },
  { id: "fish", singular: "fish", plural: "fish", icon: "fish", color: "#3498DB", bg: colors.softBlueTint },
  { id: "bird", singular: "bird", plural: "birds", icon: "bird", color: "#E67E22", bg: colors.pastelOrangeTint },
  { id: "cow", singular: "cow", plural: "cows", icon: "cow", color: "#5D4037", bg: colors.pastelPinkTint },
  { id: "duck", singular: "duck", plural: "ducks", icon: "duck", color: "#E0A200", bg: colors.pastelYellowTint },
  { id: "butterfly", singular: "butterfly", plural: "butterflies", icon: "butterfly", color: "#8E44AD", bg: colors.pastelPurpleTint },
];

/**
 * Build a round for level.
 *  L1 -> count 2..4, options span 3 close numbers
 *  L2 -> count 3..6
 *  L3 -> count 5..10
 */
export function pickCountRound(level: 1 | 2 | 3) {
  const [lo, hi] = level === 1 ? [2, 4] : level === 2 ? [3, 6] : [5, 10];
  const count = randInt(lo, hi);
  const animal = ANIMALS[randInt(0, ANIMALS.length - 1)];
  const options = distinctOptions(count, lo, hi);
  return { animal, count, options };
}

function randInt(lo: number, hi: number) {
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function distinctOptions(correct: number, lo: number, hi: number): number[] {
  const set = new Set<number>([correct]);
  while (set.size < 3) {
    const candidate = randInt(Math.max(1, lo - 1), hi + 1);
    if (candidate !== correct) set.add(candidate);
  }
  const arr = Array.from(set);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
