'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n/config';

const localeLabels: Record<string, { flag: string; name: string; short: string }> = {
  uk: { 
    flag: 'https://res.cloudinary.com/deirtcyfx/image/upload/v1762882605/free_icon_flag_14009737_67a888d850.png', 
    name: 'Українська', 
    short: 'Укр' 
  },
  en: { 
    flag: 'https://res.cloudinary.com/deirtcyfx/image/upload/v1762882605/free_icon_world_16397183_ee1d90f13b.png', 
    name: 'English', 
    short: 'Eng' 
  },
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

  const getLabel = (locale: string) => {
    return localeLabels[locale] || { flag: '', name: locale, short: locale };
  };

  return (
    <div className="lang-switch">
      {locales.map((locale, idx) => {
        const label = getLabel(locale);
        return (
          <span key={locale}>
            <button
              className={`lang-btn ${currentLocale === locale ? 'active' : ''}`}
              onClick={() => handleLanguageChange(locale)}
              aria-pressed={currentLocale === locale}
              aria-label={label.name}
              title={label.name}
            >
              <img 
                src={label.flag} 
                alt={label.name} 
                className="lang-flag" 
                loading="lazy"
                decoding="async"
              />
              <span className="lang-text">{label.short}</span>
            </button>
            {idx < locales.length - 1 ? <span className="lang-sep">/</span> : null}
          </span>
        );
      })}
    </div>
  );
}


