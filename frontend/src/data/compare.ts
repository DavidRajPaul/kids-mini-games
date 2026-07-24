import { colors } from "@/src/theme/tokens";

/**
 * Data catalog for Game 4 (Same or Different).
 * Each entry is a MaterialCommunityIcons glyph plus a color; two tiles are compared.
 */

export interface CompareItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
}

export const COMPARE_ITEMS: CompareItem[] = [
  { id: "dog", label: "Dog", icon: "dog", color: "#8B5A2B", bg: colors.pastelOrangeTint },
  { id: "cat", label: "Cat", icon: "cat", color: "#7F8C8D", bg: colors.surfaceTinted },
  { id: "fish", label: "Fish", icon: "fish", color: "#3498DB", bg: colors.softBlueTint },
  { id: "bird", label: "Bird", icon: "bird", color: "#E67E22", bg: colors.pastelOrangeTint },
  { id: "duck", label: "Duck", icon: "duck", color: "#E0A200", bg: colors.pastelYellowTint },
  { id: "circle", label: "Circle", icon: "circle", color: "#1F6FEB", bg: colors.softBlueTint },
  { id: "square", label: "Square", icon: "square", color: "#2E8B57", bg: colors.softGreenTint },
  { id: "triangle", label: "Triangle", icon: "triangle", color: "#E58E26", bg: colors.pastelOrangeTint },
  { id: "star", label: "Star", icon: "star", color: "#E0A200", bg: colors.pastelYellowTint },
  { id: "heart", label: "Heart", icon: "heart", color: "#D9534F", bg: colors.pastelPinkTint },
  { id: "apple", label: "Apple", icon: "food-apple", color: "#D9534F", bg: colors.pastelPinkTint },
  { id: "banana", label: "Banana", icon: "fruit-pineapple", color: "#E0A200", bg: colors.pastelYellowTint },
];

/**
 * Return two tiles.
 *  50% same tile, 50% different tile.
 *  L1: different tiles come from different categories (very distinct).
 *  L2: mixed.
 *  L3: subtle — different tile is the SAME icon with a different color tint.
 */
export function pickCompareRound(level: 1 | 2 | 3) {
  const isSame = Math.random() < 0.5;
  const left = COMPARE_ITEMS[Math.floor(Math.random() * COMPARE_ITEMS.length)];
  if (isSame) {
    return { left, right: left, isSame: true };
  }
  if (level === 3) {
    // Subtle: same icon, gently different color.
    const altColor = shiftColor(left.color);
    const right: CompareItem = { ...left, id: `${left.id}-alt`, color: altColor };
    return { left, right, isSame: false };
  }
  let right = COMPARE_ITEMS[Math.floor(Math.random() * COMPARE_ITEMS.length)];
  let guard = 0;
  while (right.id === left.id && guard < 30) {
    right = COMPARE_ITEMS[Math.floor(Math.random() * COMPARE_ITEMS.length)];
    guard += 1;
  }
  return { left, right, isSame: false };
}

function shiftColor(hex: string): string {
  // Nudge each channel by ~30 to make a visible-but-subtle difference.
  const h = hex.replace("#", "");
  const r = clamp(parseInt(h.slice(0, 2), 16) + 40);
  const g = clamp(parseInt(h.slice(2, 4), 16) - 25);
  const b = clamp(parseInt(h.slice(4, 6), 16) + 30);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(255, n));
}
