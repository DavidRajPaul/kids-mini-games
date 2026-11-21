import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import * as Speech from "expo-speech";
import { storage } from "@/src/utils/storage";

export type GameLanguage = "en" | "ta";
const STORAGE_KEY = "ezra.voice.language";

type VoiceContextValue = {
  language: GameLanguage;
  ready: boolean;
  voiceNotice: string | null;
  setLanguage: (language: GameLanguage) => void;
  speak: (text: string, languageOverride?: GameLanguage) => Promise<boolean>;
  stop: () => void;
};

const VoiceContext = createContext<VoiceContextValue | null>(null);

/** One language setting and one speech queue for the whole app.
 * Individual screen hooks previously loaded 'en' independently, so a screen could
 * read English before the persisted Tamil preference arrived.
 */
export function GameVoiceProvider({ children }: { children: React.ReactNode }) {
  const [language, updateLanguage] = useState<GameLanguage>("en");
  const [ready, setReady] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const sequence = useRef(0);

  useEffect(() => {
    let active = true;
    storage.getItem<string | null>(STORAGE_KEY, null)
      .then(value => {
        if (active && (value === "ta" || value === "en")) updateLanguage(value);
      })
      .catch(() => {})
      .finally(() => { if (active) setReady(true); });
    return () => {
      active = false;
      sequence.current++;
      void Speech.stop().catch(() => {});
    };
  }, []);

  const setLanguage = useCallback((next: GameLanguage) => {
    sequence.current++;
    void Speech.stop().catch(() => {});
    updateLanguage(next);
    setVoiceNotice(null);
    void storage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const stop = useCallback(() => {
    sequence.current++;
    void Speech.stop().catch(() => {});
  }, []);

  const speak = useCallback(async (text: string, override?: GameLanguage) => {
    const selected = override ?? language;
    const request = ++sequence.current;
    try {
      await Speech.stop();
      const voices = await Speech.getAvailableVoicesAsync();
      if (request !== sequence.current) return false;
      const compatible = voices.filter(voice =>
        voice.language.toLowerCase().startsWith(selected === "ta" ? "ta" : "en")
      );
      // Never silently substitute English speech for selected Tamil.
      // Android may require downloading a Tamil system voice once.
      if (selected === "ta" && compatible.length === 0) {
        setVoiceNotice("தமிழ் voice phone-ல install பண்ணணும். Settings-ல Tamil TTS voice add பண்ணுங்க.");
        return false;
      }
      compatible.sort((a, b) => {
        const score = (v: typeof compatible[number]) =>
          (String(v.quality ?? "").toLowerCase().includes("enhanced") ? 10 : 0) +
          (v.language.toLowerCase() === (selected === "ta" ? "ta-in" : "en-in") ? 5 : 0);
        return score(b) - score(a);
      });
      const voice = compatible[0];
      setVoiceNotice(null);
      Speech.speak(text, {
        language: selected === "ta" ? "ta-IN" : (voice?.language ?? "en-IN"),
        ...(voice ? { voice: voice.identifier } : {}),
        rate: 0.94,
        pitch: 1.02,
      });
      return true;
    } catch {
      if (request === sequence.current) {
        setVoiceNotice(selected === "ta"
          ? "தமிழ் voice இப்போ work ஆகல. Phone voice settings check பண்ணுங்க."
          : "Voice unavailable. You can still play by reading the screen.");
      }
      return false;
    }
  }, [language]);

  return React.createElement(VoiceContext.Provider, { value: { language, ready, voiceNotice, setLanguage, speak, stop } }, children);
}

export function useGameSpeech(): VoiceContextValue {
  const context = useContext(VoiceContext);
  if (!context) throw new Error("useGameSpeech requires GameVoiceProvider");
  return context;
}
