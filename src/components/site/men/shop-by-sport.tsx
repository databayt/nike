"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import { type Locale, isRTL } from "@/components/internationalization/config";
import { buildSportCards, menDict } from "./men-data";

interface ShopBySportProps {
  dictionary: Dictionary;
  lang: Locale;
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" aria-hidden className="rtl:-scale-x-100">
      <path stroke="currentColor" strokeWidth={1.5} d="M8.474 18.966 15.44 12 8.474 5.033" />
    </svg>
  );
}

/**
 * "Shop by Sport": a heading with prev/next arrows over a horizontally
 * scrollable rail of tall sport cards, each with a "Shop {sport}" pill. Arrow
 * scrolling is RTL-aware so "next" always advances toward the inline-end.
 */
export default function ShopBySport({ dictionary, lang }: ShopBySportProps) {
  const cards = buildSportCards(lang);
  const t = menDict(dictionary);
  const rtl = isRTL(lang);
  const railRef = useRef<HTMLUListElement>(null);

  const shop = t.cta?.shop || "Shop";
  const sport = t.sport ?? {};

  const go = (toEnd: boolean) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.clientWidth + 12 : el.clientWidth * 0.8;
    const visualDir = (toEnd ? 1 : -1) * (rtl ? -1 : 1);
    el.scrollBy({ left: visualDir * step, behavior: "smooth" });
  };

  return (
    <section className="px-4 pt-12 sm:px-6 lg:px-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-medium text-dark-900">
          {t.sections?.shopBySport || "Shop by Sport"}
        </h2>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            aria-label={t.a11y?.previous || "Previous"}
            onClick={() => go(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-light-200 text-dark-900 transition-colors hover:bg-light-300"
          >
            <span className="rotate-180">
              <Chevron />
            </span>
          </button>
          <button
            type="button"
            aria-label={t.a11y?.next || "Next"}
            onClick={() => go(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-light-200 text-dark-900 transition-colors hover:bg-light-300"
          >
            <Chevron />
          </button>
        </div>
      </div>

      <ul
        ref={railRef}
        className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <li
            key={card.id}
            className="shrink-0 basis-[70%] min-[640px]:basis-[46%] min-[960px]:basis-[calc((100%_-_1.5rem)/3)]"
          >
            <Link
              href={card.href}
              className="group relative block overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
            >
              <div className="aspect-[4/5] w-full overflow-hidden bg-light-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.src}
                  srcSet={card.srcSet}
                  sizes="(min-width:960px) 24vw, (min-width:640px) 42vw, 70vw"
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <span className="absolute bottom-4 start-4 inline-flex items-center rounded-full bg-light-100 px-4 py-2 text-caption font-medium text-dark-900 shadow-sm transition-colors group-hover:bg-light-300">
                {`${shop} ${sport[card.nameKey] || card.id}`}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
