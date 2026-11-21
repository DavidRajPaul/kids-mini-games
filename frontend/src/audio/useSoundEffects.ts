import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { useCallback, useEffect, useMemo } from "react";

/**
 * Preloaded sound sources. Bundled as require()s so they work fully offline.
 */
const SOURCES = {
  tap: require("../../assets/sounds/tap.wav"),
  button: require("../../assets/sounds/button.wav"),
  correct: require("../../assets/sounds/correct.wav"),
  wrong: require("../../assets/sounds/wrong.wav"),
  star: require("../../assets/sounds/star.wav"),
  complete: require("../../assets/sounds/complete.wav"),
  magic: require("../../assets/sounds/magic.wav"),
  sparkle: require("../../assets/sounds/sparkle.wav"),
} as const;

export type SoundName = keyof typeof SOURCES;

/**
 * Hook that returns a `play(name)` function backed by expo-audio players.
 * Each sound has a dedicated player so overlapping plays work cleanly.
 */
export function useSoundEffects() {
  const tap = useAudioPlayer(SOURCES.tap);
  const button = useAudioPlayer(SOURCES.button);
  const correct = useAudioPlayer(SOURCES.correct);
  const wrong = useAudioPlayer(SOURCES.wrong);
  const star = useAudioPlayer(SOURCES.star);
  const complete = useAudioPlayer(SOURCES.complete);
  const magic = useAudioPlayer(SOURCES.magic);
  const sparkle = useAudioPlayer(SOURCES.sparkle);

  const players = useMemo(
    () => ({ tap, button, correct, wrong, star, complete, magic, sparkle }),
    [tap, button, correct, wrong, star, complete, magic, sparkle],
  );

  useEffect(() => {
    // Configure audio to be gentle and respect silent mode.
    setAudioModeAsync({
      playsInSilentMode: false,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
    }).catch(() => {});
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      const p = players[name];
      if (!p) return;
      try {
        p.seekTo(0);
        p.play();
      } catch {
        // Silent — audio is a nice-to-have, never blocks gameplay.
      }
    },
    [players],
  );

  return play;
}
