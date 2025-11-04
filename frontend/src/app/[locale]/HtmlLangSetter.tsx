'use client';

import { useEffect } from 'react';
import type { Locale } from '@/i18n/config';

export default function HtmlLangSetter({ locale }: { locale: Locale }) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}

