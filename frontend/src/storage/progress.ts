import { storage } from "@/src/utils/storage";

/**
 * Local progress storage. Fully offline, no cloud sync, no analytics.
 */

export type GameId =
  | "find-object"
  | "count-animals"
  | "bigger-smaller"
  | "same-different"
  | "shape-puzzle";

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

export async function getProgress(id: GameId): Promise<GameProgress> {
  const saved = await storage.getItem<GameProgress>(key(id), DEFAULT);
  return saved ?? DEFAULT;
}

export async function saveProgress(
  id: GameId,
  patch: Partial<GameProgress>,
): Promise<GameProgress> {
  const current = await getProgress(id);
  const next: GameProgress = {
    highestLevel: Math.max(current.highestLevel, patch.highestLevel ?? current.highestLevel),
    timesPlayed: (patch.timesPlayed ?? current.timesPlayed),
    starsEarned: Math.max(current.starsEarned, patch.starsEarned ?? current.starsEarned),
    completed: current.completed || patch.completed || false,
  };
  await storage.setItem(key(id), next);
  return next;
}

export async function bumpTimesPlayed(id: GameId): Promise<void> {
  const current = await getProgress(id);
  await storage.setItem(key(id), { ...current, timesPlayed: current.timesPlayed + 1 });
}
