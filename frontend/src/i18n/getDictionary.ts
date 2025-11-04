import { defaultLocale, locales, type Locale } from "./config";

export type Dictionary = Record<string, any>;

export const getDictionary = async (locale: Locale | string): Promise<Dictionary> => {
  const safeLocale = (locales as readonly string[]).includes(String(locale))
    ? (locale as Locale)
    : defaultLocale;
  const mod = await import(`./locales/${safeLocale}.json`);
  return mod.default as Dictionary;
};


