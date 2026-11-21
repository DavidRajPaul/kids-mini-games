/** Structured, intentionally small letter set for non-sequential identification.
 * Introduce letters, then their initial sounds, then regular CVC words.
 * Never imply a child mastered a letter based on one correct tap.
 */
export const LETTERS = [
  { letter: "s", word: "sun", picture: "☀️", tamilWord: "சன்", nameTamil: "எஸ்" },
  { letter: "a", word: "apple", picture: "🍎", tamilWord: "ஆப்பிள்", nameTamil: "ஏ" },
  { letter: "t", word: "tap", picture: "🚰", tamilWord: "டேப்", nameTamil: "டி" },
  { letter: "p", word: "pig", picture: "🐷", tamilWord: "பிக்", nameTamil: "பி" },
  { letter: "i", word: "igloo", picture: "🏠", tamilWord: "இக்லூ", nameTamil: "ஐ" },
  { letter: "n", word: "nest", picture: "🪺", tamilWord: "நெஸ்ட்", nameTamil: "என்" },
  { letter: "m", word: "moon", picture: "🌙", tamilWord: "மூன்", nameTamil: "எம்" },
  { letter: "d", word: "dog", picture: "🐶", tamilWord: "டாக்", nameTamil: "டி" },
  { letter: "o", word: "orange", picture: "🍊", tamilWord: "ஆரஞ்சு", nameTamil: "ஓ" },
  { letter: "c", word: "cat", picture: "🐱", tamilWord: "கேட்", nameTamil: "சி" },
  { letter: "e", word: "egg", picture: "🥚", tamilWord: "எக்", nameTamil: "ஈ" },
  { letter: "r", word: "rat", picture: "🐭", tamilWord: "ரேட்", nameTamil: "ஆர்" },
] as const;

export const CVC_WORDS = [
  { word: "cat", picture: "🐱", tamilWord: "கேட்" },
  { word: "sun", picture: "☀️", tamilWord: "சன்" },
  { word: "pin", picture: "📌", tamilWord: "பின்" },
  { word: "map", picture: "🗺️", tamilWord: "மேப்" },
  { word: "tap", picture: "🚰", tamilWord: "டேப்" },
  { word: "sit", picture: "🪑", tamilWord: "சிட்" },
  { word: "can", picture: "🥫", tamilWord: "கேன்" },
  { word: "pan", picture: "🍳", tamilWord: "பேன்" },
] as const;

export type ReadingLevel = 1 | 2 | 3;

/** Correct option rotates positions. No fixed left/right answer bias. */
export function pickOptions<T>(correct: T, pool: readonly T[], count: number, seed: number): T[] {
  const extras = pool.filter(item => item !== correct);
  const offset = seed % extras.length;
  const rotated = [...extras.slice(offset), ...extras.slice(0, offset)];
  const choices = rotated.slice(0, count - 1);
  choices.splice(seed % count, 0, correct);
  return choices;
}
export const letterFor = (level: ReadingLevel, round: number) =>
  LETTERS[((level - 1) * 4 + round) % LETTERS.length];
export const wordFor = (level: ReadingLevel, round: number) =>
  CVC_WORDS[((level - 1) * 3 + round) % CVC_WORDS.length];
