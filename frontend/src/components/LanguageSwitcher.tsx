'use client';

import { usePathname } from 'next/navigation';
import { locales } from '@/i18n/config';

const localeLabels: Record<string, { flag: string; name: string; short: string }> = {
  uk: { flag: '🇺🇦', name: 'Українська', short: 'Укр' },
  en: { flag: '🇬🇧', name: 'English', short: 'Eng' },
};

export default function LanguageSwitcher() {
  const pathname = usePathname() || '/';
  const parts = pathname.split('/');
  const currentLocale = locales.includes(parts[1] as any) ? parts[1] : undefined;
  const restPath = currentLocale ? parts.slice(2).join('/') : parts.slice(1).join('/');

  const handleLanguageChange = (locale: string) => {
    const href = `/${locale}/${restPath}`.replace(/\/$/, '') || `/${locale}`;
    window.location.href = href;
  };

  return (
    <div className="lang-switch">
      {locales.map((locale, idx) => {
        const label = localeLabels[locale] || { flag: '', name: locale, short: locale };
        return (
          <span key={locale}>
            <button
              className={`lang-btn ${currentLocale === locale ? 'active' : ''}`}
              onClick={() => handleLanguageChange(locale)}
              aria-pressed={currentLocale === locale}
              aria-label={label.name}
              title={label.name}
            >
              <span className="lang-flag">{label.flag}</span>
              <span className="lang-text">{label.short}</span>
            </button>
            {idx < locales.length - 1 ? <span className="lang-sep">/</span> : null}
          </span>
        );
      })}
    </div>
  );
}


