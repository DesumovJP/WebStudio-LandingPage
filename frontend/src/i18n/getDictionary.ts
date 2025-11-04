import type { Locale } from "./config";
import uk from "./locales/uk.json";
import en from "./locales/en.json";

const DICTS = {
  uk,
  en,
} as const;

export type Dictionary = typeof uk;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return DICTS[locale] as Dictionary;
}


