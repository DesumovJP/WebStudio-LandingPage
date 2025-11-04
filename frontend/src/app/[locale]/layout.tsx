import { DictProvider } from "@/i18n/DictContext";
import { getDictionary } from "@/i18n/getDictionary";
import { defaultLocale, isSupportedLocale, type Locale } from "@/i18n/config";
import type { Metadata } from "next";
import Providers from "../providers";
import "../globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = isSupportedLocale(params.locale) ? params.locale : defaultLocale;
  const dict = await getDictionary(locale);
  return {
    title: `${dict.brand} — Web & App Development`,
    description: params.locale === "uk"
      ? "Webbie: дизайн і розробка веб‑сайтів та додатків під ключ. Next.js + Strapi."
      : "Webbie: design and development of websites and apps. Next.js + Strapi.",
    openGraph: {
      title: `${dict.brand} — Web & App Development`,
      description: params.locale === "uk"
        ? "Webbie: дизайн і розробка веб‑сайтів та додатків під ключ. Next.js + Strapi."
        : "Webbie: design and development of websites and apps. Next.js + Strapi.",
      locale,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale: Locale = isSupportedLocale(params.locale) ? params.locale : defaultLocale;
  const dict = await getDictionary(locale);
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <DictProvider value={{ locale, dict }}>
            {children}
          </DictProvider>
        </Providers>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: "uk" }, { locale: "en" }];
}


