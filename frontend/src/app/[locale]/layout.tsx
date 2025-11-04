import { DictProvider } from "@/i18n/DictContext";
import { getDictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const dict = await getDictionary(params.locale);
  return (
    <DictProvider value={{ locale: params.locale, dict }}>
      {children}
    </DictProvider>
  );
}

export function generateStaticParams() {
  return [{ locale: "uk" }, { locale: "en" }];
}


