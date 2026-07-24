import { colors } from "@/src/theme/tokens";

/**
 * Size catalog for Game 3 (Bigger or Smaller).
 * Each entry has a real-world size rank (smaller number = smaller).
 * Rounds pick two items with a size gap; larger gap = easier level.
 */

export interface SizeItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  bg: string;
  size: number; // 1 (tiny) .. 10 (huge)
}

export const SIZE_ITEMS: SizeItem[] = [
  { id: "ant", label: "Ant", icon: "ant", color: "#5D4037", bg: colors.pastelPinkTint, size: 1 },
  { id: "bee", label: "Bee", icon: "bee", color: "#E0A200", bg: colors.pastelYellowTint, size: 1 },
  { id: "butterfly", label: "Butterfly", icon: "butterfly", color: "#8E44AD", bg: colors.pastelPurpleTint, size: 2 },
  { id: "mouse", label: "Mouse", icon: "rodent", color: "#7F8C8D", bg: colors.surfaceTinted, size: 2 },
  { id: "flower", label: "Flower", icon: "flower", color: "#D96FA0", bg: colors.pastelPinkTint, size: 3 },
  { id: "duck", label: "Duck", icon: "duck", color: "#E0A200", bg: colors.pastelYellowTint, size: 3 },
  { id: "cat", label: "Cat", icon: "cat", color: "#7F8C8D", bg: colors.surfaceTinted, size: 4 },
  { id: "dog", label: "Dog", icon: "dog", color: "#8B5A2B", bg: colors.pastelOrangeTint, size: 4 },
  { id: "bicycle", label: "Bicycle", icon: "bicycle", color: "#2C3E50", bg: colors.softBlueTint, size: 5 },
  { id: "cow", label: "Cow", icon: "cow", color: "#5D4037", bg: colors.pastelPinkTint, size: 6 },
  { id: "car", label: "Car", icon: "car", color: "#2980B9", bg: colors.softBlueTint, size: 6 },
  { id: "tree", label: "Tree", icon: "tree", color: "#2E8B57", bg: colors.softGreenTint, size: 7 },
  { id: "bus", label: "Bus", icon: "bus", color: "#E58E26", bg: colors.pastelOrangeTint, size: 7 },
  { id: "elephant", label: "Elephant", icon: "elephant", color: "#6E7B8B", bg: colors.surfaceTinted, size: 8 },
  { id: "house", label: "House", icon: "home-variant", color: "#8E44AD", bg: colors.pastelPurpleTint, size: 8 },
  { id: "train", label: "Train", icon: "train", color: "#2C3E50", bg: colors.softBlueTint, size: 9 },
  { id: "airplane", label: "Airplane", icon: "airplane", color: "#1F6FEB", bg: colors.softBlueTint, size: 9 },
  { id: "mountain", label: "Mountain", icon: "image-filter-hdr", color: "#5D6D7E", bg: colors.surfaceTinted, size: 10 },
];

/**
 * Pick a pair of items with a size gap.
 *  L1 gap >= 5 (very obvious)
 *  L2 gap >= 3 (moderate)
 *  L3 gap >= 1 (subtle, but never equal)
 */
export function pickSizeRound(level: 1 | 2 | 3) {
  const gap = level === 1 ? 5 : level === 2 ? 3 : 1;
  for (let attempt = 0; attempt < 50; attempt++) {
    const a = SIZE_ITEMS[Math.floor(Math.random() * SIZE_ITEMS.length)];
    const b = SIZE_ITEMS[Math.floor(Math.random() * SIZE_ITEMS.length)];
    if (a.id === b.id) continue;
    if (Math.abs(a.size - b.size) < gap) continue;
    const askBigger = Math.random() < 0.5;
    const correctId = askBigger
      ? (a.size > b.size ? a.id : b.id)
      : (a.size < b.size ? a.id : b.id);
    const shuffled = Math.random() < 0.5 ? [a, b] : [b, a];
    return { pair: shuffled as [SizeItem, SizeItem], askBigger, correctId };
  }
  // Fallback (shouldn't reach here).
  return { pair: [SIZE_ITEMS[0], SIZE_ITEMS[SIZE_ITEMS.length - 1]] as [SizeItem, SizeItem], askBigger: true, correctId: SIZE_ITEMS[SIZE_ITEMS.length - 1].id };
}
