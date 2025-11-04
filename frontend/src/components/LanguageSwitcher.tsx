'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/config';

export default function LanguageSwitcher() {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const parts = pathname.split('/');
  const currentLocale = locales.includes(parts[1] as any) ? parts[1] : undefined;
  const restPath = currentLocale ? parts.slice(2).join('/') : parts.slice(1).join('/');

  const handleLanguageChange = (locale: string) => {
    const href = `/${locale}/${restPath}`.replace(/\/$/, '') || `/${locale}`;
    router.push(href);
    router.refresh();
  };

  return (
    <div className="lang-switch">
      {locales.map((locale, idx) => (
        <span key={locale}>
          <button
            className={`lang-btn ${currentLocale === locale ? 'active' : ''}`}
            onClick={() => handleLanguageChange(locale)}
            aria-pressed={currentLocale === locale}
          >
            {locale === 'uk' ? 'Укр' : 'Eng'}
          </button>
          {idx < locales.length - 1 ? <span className="lang-sep">/</span> : null}
        </span>
      ))}
    </div>
  );
}


