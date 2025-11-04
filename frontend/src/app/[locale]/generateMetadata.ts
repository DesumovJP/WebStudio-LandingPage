import { getDictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';

export async function generateMetadata({ params }: { params: { locale: Locale } }) {
  const dict = await getDictionary(params.locale);
  const meta = dict?.meta || {};
  return {
    title: meta.title ?? 'Webbie',
    description: meta.description ?? 'Web & App Development',
  } as any;
}


