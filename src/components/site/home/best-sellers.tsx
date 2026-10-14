import Link from "next/link";
import { Card } from "@/components";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";
import { homeDict } from "./home-data";

/** The product shape the homepage passes down from `getAllProducts`. */
export interface BestSellerProduct {
  id: string;
  name: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  minPrice?: number | null;
}

interface BestSellersProps {
  dictionary: Dictionary;
  lang: Locale;
  products: BestSellerProduct[];
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" aria-hidden className="rtl:-scale-x-100">
      <path stroke="currentColor" strokeWidth={1.5} d="M8.474 18.966 15.44 12 8.474 5.033" />
    </svg>
  );
}

/**
 * "Best Sellers": a horizontal product rail fed by the real catalog, mirroring
 * nike.com's homepage product carousel — a native `overflow-x-auto` strip
 * (server component, no JS) that shows ~4 cards with a swipeable peek of the
 * next. Symmetric inline padding keeps the peek correct in both LTR and RTL.
 */
export default function BestSellers({ dictionary, lang, products }: BestSellersProps) {
  const t = homeDict(dictionary);
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="best-sellers" className="pt-12 sm:pt-16">
      <div className="mb-6 flex items-end justify-between px-6 min-[960px]:px-12">
        <h2 id="best-sellers" className="text-2xl font-medium text-dark-900">
          {t.sections?.bestSellers || "Best Sellers"}
        </h2>
        <Link
          href={`/${lang}/products`}
          className="inline-flex items-center gap-1 text-body-medium font-medium text-dark-900 transition-colors hover:text-dark-700"
        >
          {t.cta?.shopAll || "Shop All"}
          <Chevron />
        </Link>
      </div>
      <ul className="flex gap-4 overflow-x-auto px-6 min-[960px]:px-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <li
            key={p.id}
            className="shrink-0 basis-[68%] min-[480px]:basis-[44%] min-[768px]:basis-[31%] min-[960px]:basis-[calc((100%-3rem)/4)]"
          >
            <Card
              title={p.name}
              subtitle={p.subtitle ?? undefined}
              imageSrc={p.imageUrl ?? "/shoes/shoe-1.jpg"}
              price={p.minPrice ?? undefined}
              href={`/${lang}/products/${p.id}`}
              dictionary={dictionary}
              lang={lang}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
