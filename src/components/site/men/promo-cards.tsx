import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import type { Locale } from "@/components/internationalization/config";
import { buildPromoCards, menDict } from "./men-data";

interface PromoCardsProps {
  dictionary: Dictionary;
  lang: Locale;
}

/**
 * The "New & Featured" strip directly under the hero: three wide landscape
 * cards (New Arrivals / Best Sellers / Latest Drops) with the label overlaid
 * bottom-start. Three across at ≥960px; a swipeable peek strip below that.
 */
export default function PromoCards({ dictionary, lang }: PromoCardsProps) {
  const cards = buildPromoCards(lang);
  const t = menDict(dictionary);
  const promo = t.promo ?? {};

  return (
    <section
      aria-label={t.a11y?.promo || "New and featured"}
      className="px-4 pt-3 sm:px-6 lg:px-10 min-[960px]:pt-4"
    >
      <ul className="flex gap-3 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((card) => (
          <li
            key={card.id}
            className="shrink-0 basis-[85%] min-[640px]:basis-[48%] min-[960px]:basis-[calc((100%_-_1.5rem)/3)]"
          >
            <Link
              href={card.href}
              className="group relative block overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
            >
              <div className="aspect-[3/2] w-full overflow-hidden bg-light-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.src}
                  srcSet={card.srcSet}
                  sizes="(min-width:960px) 31vw, (min-width:640px) 48vw, 85vw"
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-900/40 via-transparent to-transparent" />
              <span className="absolute bottom-4 start-4 text-heading-3 font-medium text-light-100 drop-shadow">
                {promo[card.titleKey] || card.titleKey}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
