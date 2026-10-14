'use client';

import Link from 'next/link';
import { useSwitchLocaleHref } from '@/components/internationalization/use-locale';
import { type Locale, localeConfig } from '@/components/internationalization/config';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const getSwitchLocaleHref = useSwitchLocaleHref();
  const pathname = usePathname();

  // Don't show switcher on auth pages
  if (pathname.includes('/sign-in') || pathname.includes('/sign-up')) {
    return null;
  }

  // Toggle between en and ar — shown as a text link (e.g. "العربية" / "English")
  const targetLocale: Locale = currentLocale === 'en' ? 'ar' : 'en';

  return (
    <Link
      href={getSwitchLocaleHref(targetLocale)}
      className="transition-colors hover:text-dark-700"
      aria-label={`Switch to ${localeConfig[targetLocale].name}`}
    >
      {localeConfig[targetLocale].nativeName}
    </Link>
  );
}