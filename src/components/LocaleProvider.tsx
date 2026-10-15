'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { type Locale, localeConfig } from '@/components/internationalization/config';

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale = (params?.lang as Locale) || 'en';
  const config = localeConfig[locale];

  useEffect(() => {
    // Update html attributes after hydration
    const html = document.documentElement;
    html.lang = locale;
    html.dir = config.dir;

    // Update body class to use correct font
    const body = document.body;
    const isRTL = config.dir === 'rtl';

    // Remove existing font classes
    body.classList.remove('font-inter', 'font-rubik');

    // RTL switches to Rubik; LTR keeps the stylesheet's nike stack
    // (Helvetica first, Inter as the fallback).
    if (isRTL) {
      body.classList.add('font-rubik');
    }
  }, [locale, config.dir]);

  return <>{children}</>;
}