import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import { type Locale, isRTL } from "@/components/internationalization/config";
import { buildHomeMarquee, homeDict } from "./home-data";

interface MarqueeProps {
  dictionary: Dictionary;
  lang: Locale;
}

/**
 * The full-bleed "Don't Miss" spotlight band — a single edge-to-edge image with
 * an eyebrow + oversized headline + Shop CTA anchored bottom-start. Mirrors the
 * iconic nike.com homepage marquee; static (no carousel) so it reads as a
 * focused product spotlight between Trending Now and Best Sellers.
 */
export default function Marquee({ dictionary, lang }: MarqueeProps) {
  const slide = buildHomeMarquee(lang);
  const t = homeDict(dictionary);
  const rtl = isRTL(lang);
  const shop = t.cta?.shop || "Shop";

  return (
    <section
      aria-label={t.a11y?.spotlight || slide.title}
      className="relative mt-12 w-full overflow-hidden bg-dark-900"
    >
      <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] xl:aspect-[1512/735]">
        <picture>
          <source media="(min-width: 640px)" srcSet={slide.imageWide} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>

        {/* Bottom-weighted legibility scrim. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-900/65 via-dark-900/15 to-transparent" />

        {/* Whole-band click target (decorative; the CTA below is the real link). */}
        <Link href={slide.href} aria-hidden tabIndex={-1} className="absolute inset-0 z-10" />

        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 lg:p-16">
          <div className={`max-w-2xl ${rtl ? "ml-auto text-right" : "mr-auto text-left"}`}>
            <p className="text-caption font-medium uppercase tracking-wide text-light-100 drop-shadow">
              {slide.eyebrow}
            </p>
            <h2
              className="mt-2 uppercase text-light-100"
              style={{
                fontFamily: "var(--font-jost)",
                fontWeight: 600,
                fontSize: "clamp(2.25rem, 1.1rem + 4.5vw, 4.75rem)",
                lineHeight: 0.9,
              }}
            >
              {slide.title}
            </h2>
            <p className="mt-2 max-w-md text-body font-normal text-light-100 drop-shadow sm:text-lead">
              {slide.subtitle}
            </p>
            <div className="mt-6">
              <Link
                href={slide.href}
                className="pointer-events-auto inline-flex items-center rounded-full bg-light-100 px-7 py-3 text-body-medium font-medium text-dark-900 transition-colors hover:bg-light-300"
              >
                {`${shop} ${slide.ctaSuffix}`}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
