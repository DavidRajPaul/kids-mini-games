import { storage } from "@/src/utils/storage";

/**
 * Local progress storage. Fully offline, no cloud sync, no analytics.
 *
 * Stored as a JSON string under `ezra.progress.<gameId>` to keep the
 * underlying storage helper's primitive-only contract clean.
 */

export type GameId =
  | "find-object"
  | "count-animals"
  | "bigger-smaller"
  | "same-different"
  | "shape-puzzle"
  | "memory-safari"
  | "traffic-light"
  | "what-comes-next"
  | "little-story-builder"
  | "letter-safari"
  | "sound-detective"
  | "word-magic"
  | "tamil-vowels"
  | "tamil-sounds"
  | "tamil-words";

export interface GameProgress {
  highestLevel: number; // 1..3
  timesPlayed: number;
  starsEarned: number;
  completed: boolean;
}

const DEFAULT: GameProgress = {
  highestLevel: 1,
  timesPlayed: 0,
  starsEarned: 0,
  completed: false,
};

const key = (id: GameId) => `ezra.progress.${id}`;

function parse(raw: string | null): GameProgress {
  if (!raw) return DEFAULT;
  try {
    const value = JSON.parse(raw) as Partial<GameProgress>;
    return {
      highestLevel: value.highestLevel ?? DEFAULT.highestLevel,
      timesPlayed: value.timesPlayed ?? DEFAULT.timesPlayed,
      starsEarned: value.starsEarned ?? DEFAULT.starsEarned,
      completed: value.completed ?? DEFAULT.completed,
    };
  } catch {
    return DEFAULT;
  }
}

export async function getProgress(id: GameId): Promise<GameProgress> {
  const raw = await storage.getItem<string | null>(key(id), null);
  return parse(raw);
}

export async function saveProgress(
  id: GameId,
  patch: Partial<GameProgress>,
): Promise<GameProgress> {
  const current = await getProgress(id);
  const next: GameProgress = {
    highestLevel: Math.max(current.highestLevel, patch.highestLevel ?? current.highestLevel),
    timesPlayed: patch.timesPlayed ?? current.timesPlayed,
    starsEarned: Math.max(current.starsEarned, patch.starsEarned ?? current.starsEarned),
    completed: current.completed || patch.completed || false,
  };
  await storage.setItem(key(id), JSON.stringify(next));
  return next;
}

export async function bumpTimesPlayed(id: GameId): Promise<void> {
  const current = await getProgress(id);
  await storage.setItem(
    key(id),
    JSON.stringify({ ...current, timesPlayed: current.timesPlayed + 1 }),
  );
}
