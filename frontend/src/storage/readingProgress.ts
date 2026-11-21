import { storage } from "@/src/utils/storage";

const KEY = "ezra.reading.letter-stats";

export interface LetterStats {
  attempts: number;
  firstTry: number;
}
export type ReadingStats = Record<string, LetterStats>;

export async function getReadingStats(): Promise<ReadingStats> {
  try {
    const raw = await storage.getItem<string | null>(KEY, null);
    if (!raw) return {};
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};
    const result: ReadingStats = {};
    for (const [letter, value] of Object.entries(data)) {
      if (letter.length !== 1 || !/^[a-z]$/i.test(letter)) continue;
      if (!value || typeof value !== "object") continue;
      const v = value as Partial<LetterStats>;
      if (typeof v.attempts !== "number" || typeof v.firstTry !== "number") continue;
      result[letter.toLowerCase()] = { attempts: Math.max(0, v.attempts), firstTry: Math.max(0, v.firstTry) };
    }
    return result;
  } catch {
    return {};
  }
}

/** One first-tap observation per letter round. Avoids treating retry taps as mastery. */
export async function recordLetterAttempt(letter: string, firstTryCorrect: boolean): Promise<void> {
  const current = await getReadingStats();
  const key = letter.toLowerCase();
  if (!/^[a-z]$/.test(key)) return;
  const previous = current[key] ?? { attempts: 0, firstTry: 0 };
  current[key] = {
    attempts: previous.attempts + 1,
    firstTry: previous.firstTry + (firstTryCorrect ? 1 : 0),
  };
  await storage.setItem(KEY, JSON.stringify(current));
}

export async function clearReadingStats(): Promise<void> {
  await storage.removeItem(KEY);
}
