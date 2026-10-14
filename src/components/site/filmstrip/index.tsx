import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";
import { buildFilmstripCards } from "./filmstrip-data";

interface FilmstripProps {
  dictionary: Dictionary;
  lang: Locale;
}

type FilmstripDict = Record<string, string>;

/**
 * nike.com's second homepage section: three tall portrait cards, each with its
 * title set beneath the image. A native horizontal-scroll strip drives it — the
 * three cards fill the row at ≥960px (Nike's breakpoint) and reveal a swipeable
 * peek below that. Symmetric inline padding keeps it correct in both LTR and RTL.
 */
export default function Filmstrip({ dictionary, lang }: FilmstripProps) {
  const cards = buildFilmstripCards(lang);
  const t = (dictionary as unknown as { filmstrip?: FilmstripDict }).filmstrip ?? {};

  return (
    <section aria-label={t.label || "Featured collections"} className="mt-2 min-[960px]:mt-4">
      <ul className="flex gap-3 overflow-x-auto px-6 min-[960px]:px-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cards.map((card) => {
          const title = t[card.titleKey] || card.id;
          return (
            <li
              key={card.id}
              className="shrink-0 basis-[77vw] min-[768px]:basis-[70vw] min-[960px]:basis-[calc((100%-1.5rem)/3)]"
            >
              <Link
                href={card.href}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
              >
                <div className="aspect-[464/604] w-full overflow-hidden bg-light-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.src}
                    srcSet={card.srcSet}
                    sizes="(min-width: 960px) 30vw, (min-width: 768px) 70vw, 77vw"
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="mt-6 block text-heading-3 text-dark-900 min-[960px]:mt-9">
                  {title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
