import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import Providers from '../providers';
import { locales, defaultLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { DictProvider } from '@/i18n/DictContext';
import { env } from '@/config/env';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

async function getValidatedLocale(params: Promise<{ locale: string }> | { locale: string }): Promise<Locale> {
  const resolvedParams = params instanceof Promise ? await params : params;
  const incoming = resolvedParams?.locale;
  return locales.includes(incoming as Locale) ? (incoming as Locale) : defaultLocale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}): Promise<Metadata> {
  const resolvedParams = params instanceof Promise ? await params : params;
  const locale = await getValidatedLocale(resolvedParams);
  const dict = await getDictionary(locale);
  const meta = dict?.meta || {};
  
  const siteUrl = env.SITE_URL;
  const iconUrl = env.API_URL ? `${env.API_URL}/uploads/pawukpng_89b3bd786e.png` : '/favicon.ico';
  
  return {
    title: meta.title ?? 'Webbie — Web & App Development',
    description: meta.description ?? 'Webbie: дизайн і розробка веб‑сайтів та додатків під ключ.',
    icons: {
      icon: [
        { url: iconUrl, sizes: 'any' },
      ],
      apple: [
        { url: iconUrl, sizes: '180x180' },
      ],
    },
    openGraph: {
      title: meta.title ?? 'Webbie — Web & App Development',
      description: meta.description ?? 'Webbie: дизайн і розробка веб‑сайтів та додатків під ключ.',
      type: 'website',
      url: siteUrl,
      siteName: 'Webbie',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const locale = await getValidatedLocale(resolvedParams);
  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <DictProvider value={{ locale, dict }}>{children}</DictProvider>
        </Providers>
      </body>
    </html>
  );
}


