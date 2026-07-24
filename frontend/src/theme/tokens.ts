/**
 * Design tokens for Ezra Brain Games.
 *
 * Kept intentionally minimal, calm and readable — soft pastels only,
 * generous spacing, chunky radii, subtle shadows.
 */

export const colors = {
  // Surfaces
  surface: "#F7FAFC",
  surfaceCard: "#FFFFFF",
  surfaceTinted: "#EDF2F7",
  onSurface: "#2D3748",
  onSurfaceMuted: "#4A5568",

  // Brand pastels
  softBlue: "#A0C4FF",
  softBlueTint: "#D9E7FF",
  softGreen: "#9FD3C7",
  softGreenTint: "#DFF3EE",
  pastelOrange: "#FFD6A5",
  pastelOrangeTint: "#FFE9CE",
  pastelYellow: "#FDFFB6",
  pastelYellowTint: "#FEFFDE",
  pastelPink: "#FFADAD",
  pastelPinkTint: "#FFD6D6",
  pastelPurple: "#CDB4DB",
  pastelPurpleTint: "#E7DBF0",

  // Semantic (soft)
  success: "#8BD4A6",
  successTint: "#D8F1E1",
  onSuccess: "#113814",
  danger: "#F5A7A7",
  dangerTint: "#FBDADA",
  onDanger: "#4A1111",

  // Text on brand chips
  onSoftBlue: "#0F2A4A",
  onSoftGreen: "#113328",
  onPastelOrange: "#4A2C11",
  onPastelYellow: "#4A3A00",
  onPastelPink: "#4A1111",
  onPastelPurple: "#2D1B3A",

  // Structure
  border: "#E2E8F0",
  borderStrong: "#CBD5E0",
  divider: "#EDF2F7",
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const typography = {
  displayXL: { fontSize: 36, fontWeight: "800" as const, letterSpacing: 0.2 },
  displayLG: { fontSize: 30, fontWeight: "800" as const, letterSpacing: 0.2 },
  title: { fontSize: 24, fontWeight: "700" as const },
  subtitle: { fontSize: 20, fontWeight: "700" as const },
  body: { fontSize: 18, fontWeight: "600" as const },
  bodySm: { fontSize: 16, fontWeight: "600" as const },
  caption: { fontSize: 14, fontWeight: "600" as const },
} as const;

export const shadows = {
  soft: {
    boxShadow: "0px 6px 14px rgba(26, 54, 93, 0.08)",
    elevation: 4,
  },
  softer: {
    boxShadow: "0px 3px 8px rgba(26, 54, 93, 0.06)",
    elevation: 2,
  },
} as const;

export const durations = {
  press: 150,
  fade: 250,
  scale: 200,
  snap: 300,
} as const;
