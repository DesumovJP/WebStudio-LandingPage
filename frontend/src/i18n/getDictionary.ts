import type { Locale } from "./config";

export type Dictionary = Record<string, any>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const mod = await import(`./locales/${locale}.json`);
  return mod.default as Dictionary;
};


