import type { Metadata } from 'next';
import { locales, defaultLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { DictProvider } from '@/i18n/DictContext';
import { env } from '@/config/env';
import { getProjects } from '@/utils/getProjects';

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
  const iconUrl = 'https://res.cloudinary.com/deirtcyfx/image/upload/v1762338789/pawukpng_42af27088a.png';
  
  const logoUrl = 'https://res.cloudinary.com/deirtcyfx/image/upload/v1762338789/pawukpng_42af27088a.png';
  
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
  
  // Fetch projects from Strapi
  const strapiProjects = await getProjects();
  
  // Merge Strapi projects with dict (Strapi projects take priority)
  const mergedDict = {
    ...dict,
    projects: strapiProjects.length > 0 ? strapiProjects : dict.projects,
  };

  return (
    <DictProvider value={{ locale, dict: mergedDict }}>{children}</DictProvider>
  );
}


