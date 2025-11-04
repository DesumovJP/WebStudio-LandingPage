import { locales, defaultLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { DictProvider } from '@/i18n/DictContext';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const incoming = params?.locale as string | undefined;
  const locale = (locales as readonly string[]).includes(String(incoming))
    ? (incoming as Locale)
    : defaultLocale;
  const dict = await getDictionary(locale);
  return <DictProvider value={{ locale, dict }}>{children}</DictProvider>;
}


