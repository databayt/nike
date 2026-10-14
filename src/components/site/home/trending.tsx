import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import type { Locale } from "@/components/internationalization/config";
import { buildHomeTrending, homeDict } from "./home-data";

interface TrendingProps {
  dictionary: Dictionary;
  lang: Locale;
}

/**
 * "Trending Now": two large editorial cards side by side, each with an eyebrow
 * + title + Shop CTA overlaid bottom-start over a legibility scrim. Full-bleed
 * and sharp-cornered to match nike.com (replaces the old rounded "Trend" band).
 */
export default function Trending({ dictionary, lang }: TrendingProps) {
  const cards = buildHomeTrending(lang);
  const t = homeDict(dictionary);
  const shop = t.cta?.shop || "Shop";

  return (
    <section
      aria-label={t.sections?.trendingNow || "Trending Now"}
      className="px-4 pt-12 sm:px-6 lg:px-10"
    >
      <h2 className="mb-6 text-2xl font-medium text-dark-900">
        {t.sections?.trendingNow || "Trending Now"}
      </h2>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className="group relative block overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-light-200 sm:aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.src}
                srcSet={card.srcSet}
                sizes="(min-width:1024px) 49vw, 100vw"
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-900/55 via-dark-900/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-light-100 sm:p-8">
              <p className="text-caption font-medium drop-shadow">{card.eyebrow}</p>
              <h3 className="mt-1 text-2xl font-medium drop-shadow sm:text-heading-3 lg:text-3xl">
                {card.title}
              </h3>
              <span className="mt-4 inline-flex items-center rounded-full bg-light-100 px-5 py-2 text-body-medium font-medium text-dark-900 transition-colors group-hover:bg-light-300">
                {shop}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
