import type { Metadata } from "next";
import { getDictionary } from "@/components/internationalization/dictionaries";
import { type Locale, localeConfig } from "@/components/internationalization/config";
import { Footer, LocaleProvider } from "@/components";
import Header from "@/components/site/header";
import "../globals.css";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    other: {
      'accept-language': lang,
    },
    alternates: {
      languages: {
        'en': '/en',
        'ar': '/ar',
        'x-default': '/en',
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const dictionary = await getDictionary(lang);

  return (
    <LocaleProvider>
      {/* Skip link for accessibility - WCAG 2.4.1 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-dark-900 focus:px-4 focus:py-2 focus:text-light-100 focus:top-0 focus:start-0"
      >
        {dictionary.common.skipToContent}
      </a>
      <Header dictionary={dictionary} lang={lang} />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer dictionary={dictionary} lang={lang} />
    </LocaleProvider>
  );
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return Object.keys(localeConfig).map((lang) => ({ lang }));
}