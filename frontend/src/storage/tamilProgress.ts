import { storage } from "@/src/utils/storage";
const KEY = "ezra.tamil.vowels.first-try";
export type TamilLetterStats = Record<string, { tried: number; firstTry: number }>;
export async function getTamilLetterStats(): Promise<TamilLetterStats> {
  try {
    const raw = await storage.getItem<string | null>(KEY, null);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as TamilLetterStats;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  } catch {}
  return {};
}
/** Each round records a single unaided first tap, including an incorrect selection. */
export async function recordTamilLetter(letter: string, unaidedCorrect: boolean): Promise<void> {
  const data = await getTamilLetterStats();
  const prev = data[letter] ?? { tried: 0, firstTry: 0 };
  data[letter] = { tried: prev.tried + 1, firstTry: prev.firstTry + Number(unaidedCorrect) };
  await storage.setItem(KEY, JSON.stringify(data));
}
export async function clearTamilLetterStats(): Promise<void> { await storage.removeItem(KEY); }
