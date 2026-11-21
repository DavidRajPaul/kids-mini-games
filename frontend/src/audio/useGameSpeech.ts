import { useCallback, useEffect, useState } from "react";
import * as Speech from "expo-speech";
import { storage } from "@/src/utils/storage";

export type GameLanguage = "en" | "ta";
const KEY = "ezra.voice.language";

/** Device speech; no internet service, analytics or account is contacted by this code.
 * Tamil voice availability depends on the voices installed on the device.
 */
export function useGameSpeech() {
  const [language, updateLanguage] = useState<GameLanguage>("en");
  useEffect(() => {
    let active = true;
    storage.getItem<string | null>(KEY, null).then(value => {
      if (active && (value === "en" || value === "ta")) updateLanguage(value);
    }).catch(() => {});
    return () => { active = false; Speech.stop().catch(() => {}); };
  }, []);
  const setLanguage = useCallback((next: GameLanguage) => {
    updateLanguage(next);
    storage.setItem(KEY, next).catch(() => {});
  }, []);
  const speak = useCallback(async (text: string, override?: GameLanguage) => {
    const lang = override ?? language;
    try {
      await Speech.stop();
      // Avoid reading Tamil with an English-only voice.
      const voices = await Speech.getAvailableVoicesAsync();
      const match = voices.find(v => v.language.toLowerCase().startsWith(lang === "ta" ? "ta" : "en"));
      if (lang === "ta" && !match) return false;
      Speech.speak(text, { language: lang === "ta" ? "ta-IN" : "en-IN", voice: match?.identifier, rate: 0.83, pitch: 1.04 });
      return true;
    } catch {
      return false; // Text remains visible if speech isn't supported.
    }
  }, [language]);
  return { language, setLanguage, speak };
}
