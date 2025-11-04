export const locales = ["uk", "en"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = "uk";

export function isSupportedLocale(input: string): input is Locale {
  return (locales as readonly string[]).includes(input);
}


