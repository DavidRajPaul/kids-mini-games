import { colors } from "@/src/theme/tokens";

/**
 * Shape catalog for Game 5 (Shape Puzzle).
 * Each shape has a MaterialCommunityIcons glyph and a soft accent color.
 */

export interface Shape {
  id: string;
  label: string;
  icon: string; // filled variant
  outline: string; // outlined variant for silhouette
  color: string;
  bg: string;
}

export const SHAPES: Shape[] = [
  { id: "circle", label: "Circle", icon: "circle", outline: "circle-outline", color: "#1F6FEB", bg: colors.softBlueTint },
  { id: "square", label: "Square", icon: "square", outline: "square-outline", color: "#2E8B57", bg: colors.softGreenTint },
  { id: "triangle", label: "Triangle", icon: "triangle", outline: "triangle-outline", color: "#E58E26", bg: colors.pastelOrangeTint },
  { id: "rectangle", label: "Rectangle", icon: "rectangle", outline: "rectangle-outline", color: "#8E44AD", bg: colors.pastelPurpleTint },
  { id: "star", label: "Star", icon: "star", outline: "star-outline", color: "#E0A200", bg: colors.pastelYellowTint },
  { id: "heart", label: "Heart", icon: "heart", outline: "heart-outline", color: "#D9534F", bg: colors.pastelPinkTint },
  { id: "hexagon", label: "Hexagon", icon: "hexagon", outline: "hexagon-outline", color: "#16A085", bg: colors.softGreenTint },
];

/**
 * Pick a shape puzzle round.
 *  L1 -> 3 options, L2 -> 4 options, L3 -> 5 options.
 * Ensures unique shapes and a random correct target.
 */
export function pickShapeRound(level: 1 | 2 | 3): { target: Shape; options: Shape[] } {
  const count = level === 1 ? 3 : level === 2 ? 4 : 5;
  const shuffled = [...SHAPES].sort(() => Math.random() - 0.5).slice(0, count);
  const target = shuffled[Math.floor(Math.random() * shuffled.length)];
  return { target, options: shuffled };
}
