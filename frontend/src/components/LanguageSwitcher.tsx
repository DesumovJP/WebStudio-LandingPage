'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n/config';

export default function LanguageSwitcher() {
  const pathname = usePathname() || '/';
  const parts = pathname.split('/');
  const currentLocale = locales.includes(parts[1] as any) ? parts[1] : undefined;
  const restPath = currentLocale ? parts.slice(2).join('/') : parts.slice(1).join('/');

  return (
    <div className="lang-switch">
      {locales.map((locale, idx) => (
        <span key={locale}>
          <Link className={`lang-btn ${currentLocale === locale ? 'active' : ''}`} href={`/${locale}/${restPath}`.replace(/\/$/, '') || `/${locale}`}>
            {locale === 'uk' ? 'Укр' : 'Eng'}
          </Link>
          {idx < locales.length - 1 ? <span className="lang-sep">/</span> : null}
        </span>
      ))}
    </div>
  );
}


