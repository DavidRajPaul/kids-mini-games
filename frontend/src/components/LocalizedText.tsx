import React from "react";
import { Text, type StyleProp, type TextStyle } from "react-native";
import { useGameSpeech } from "@/src/audio/useGameSpeech";

/** Casual Tamil text replaces English instructional copy; it is not stacked below it. */
export function LocalizedText({ english, tamil, style }: {
  english: string;
  tamil: string;
  style?: StyleProp<TextStyle>;
}) {
  const { language } = useGameSpeech();
  return <Text style={style}>{language === "ta" ? tamil : english}</Text>;
}
