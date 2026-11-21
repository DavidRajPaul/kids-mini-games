/** Tamil script is an abugida: vowels (உயிர்), consonants (மெய்), and CV units (உயிர்மெய்).
 * Content intentionally progresses through only a few characters at a time.
 */
export const UYIR = [
  { glyph: "அ", example: "அம்மா", emoji: "👩" },
  { glyph: "ஆ", example: "ஆடு", emoji: "🐐" },
  { glyph: "இ", example: "இலை", emoji: "🍃" },
  { glyph: "ஈ", example: "ஈ", emoji: "🪰" },
  { glyph: "உ", example: "உடை", emoji: "👕" },
  { glyph: "ஊ", example: "ஊஞ்சல்", emoji: "🎠" },
  { glyph: "எ", example: "எலி", emoji: "🐭" },
  { glyph: "ஏ", example: "ஏணி", emoji: "🪜" },
  { glyph: "ஐ", example: "ஐந்து", emoji: "✋" },
  { glyph: "ஒ", example: "ஒட்டகம்", emoji: "🐪" },
  { glyph: "ஓ", example: "ஓநாய்", emoji: "🐺" },
  { glyph: "ஔ", example: "ஔவையார்", emoji: "👵" },
] as const;

/** 18 மெய்யெழுத்துகள் grouped by traditional வல்லினம் / மெல்லினம் / இடையினம். */
export const MEI_GROUPS = [
  { name: "வல்லினம்", letters: ["க்", "ச்", "ட்", "த்", "ப்", "ற்"] },
  { name: "மெல்லினம்", letters: ["ங்", "ஞ்", "ண்", "ந்", "ம்", "ன்"] },
  { name: "இடையினம்", letters: ["ய்", "ர்", "ல்", "வ்", "ழ்", "ள்"] },
] as const;

export const JOININGS = [
  { first: "க்", vowel: "அ", result: "க", emoji: "🐄", word: "கன்று" },
  { first: "ப்", vowel: "ஆ", result: "பா", emoji: "🥛", word: "பால்" },
  { first: "ம்", vowel: "ஆ", result: "மா", emoji: "🥭", word: "மாம்பழம்" },
  { first: "ப்", vowel: "ஊ", result: "பூ", emoji: "🌸", word: "பூ" },
] as const;

export const SINGLE_WORDS = [
  { glyph: "பூ", emoji: "🌸", word: "பூ" },
  { glyph: "வா", emoji: "👋", word: "வா" },
  { glyph: "மா", emoji: "🥭", word: "மாம்பழம்" },
  { glyph: "போ", emoji: "🚶", word: "போ" },
] as const;

export const SHORT_WORDS = [
  { glyph: "ஆடு", emoji: "🐐", word: "ஆடு" },
  { glyph: "எலி", emoji: "🐭", word: "எலி" },
  { glyph: "இலை", emoji: "🍃", word: "இலை" },
  { glyph: "ஆமை", emoji: "🐢", word: "ஆமை" },
] as const;

/** Consistent non-fixed correct-answer position, avoiding accidental left-button habits. */
export function tamilChoices<T>(answer: T, pool: readonly T[], total: number, seed: number): T[] {
  const others = pool.filter(item => item !== answer);
  const shift = seed % others.length;
  const candidates = [...others.slice(shift), ...others.slice(0, shift)].slice(0, total - 1);
  candidates.splice(seed % total, 0, answer);
  return candidates;
}
