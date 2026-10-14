import type { Metadata } from "next";
import { getDictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";
import MenPage from "@/components/site/men";

// Per-locale page metadata. Kept inline (not in the shared dictionary JSON,
// which the i18n tooling normalizes) so the localized <title> stays stable.
const META: Record<string, { title: string; description: string }> = {
  en: {
    title: "Men's Shoes, Clothing & Accessories. Nike.com",
    description:
      "Shop Nike men's shoes, clothing and accessories. Find the latest styles built for every sport and every day.",
  },
  ar: {
    title: "أحذية وملابس وإكسسوارات رجالية. Nike.com",
    description:
      "تسوّق أحذية وملابس وإكسسوارات نايكي الرجالية. اكتشف أحدث التصاميم لكل رياضة ولكل يوم.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const meta = META[lang] ?? META.en;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      languages: {
        en: "/en/men",
        ar: "/ar/men",
        "x-default": "/en/men",
      },
    },
  };
}

export default async function Men({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return <MenPage dictionary={dictionary} lang={lang as Locale} />;
}
