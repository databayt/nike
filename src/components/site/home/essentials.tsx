import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import { type Locale, isRTL } from "@/components/internationalization/config";
import { buildEssentials, homeDict } from "./home-data";

interface EssentialsProps {
  dictionary: Dictionary;
  lang: Locale;
}

/**
 * "The Essentials": Nike's signature footer-adjacent rail of pill-shaped
 * category shortcuts. A wrapping row of bordered pills, centered on a light
 * surface — the homepage's closing section before the global footer.
 */
export default function Essentials({ dictionary, lang }: EssentialsProps) {
  const links = buildEssentials(lang);
  const t = homeDict(dictionary);
  const labels = t.essentials ?? {};
  const rtl = isRTL(lang);

  return (
    <section
      aria-labelledby="essentials"
      className="mt-16 bg-light-200 px-4 py-14 sm:px-6 lg:px-8"
    >
      {/* Big Futura-ND-stand-in heading, centered — mirrors nike.com's "TRENDING"
          pill-rail headline (76px uppercase). Clamped down for the longer label. */}
      <h2
        id="essentials"
        className="mb-8 text-center uppercase text-dark-900"
        style={{
          // Jost (Futura stand-in) for Latin; Rubik for Arabic, which Jost can't render.
          fontFamily: rtl ? "var(--font-rubik), sans-serif" : "var(--font-jost), sans-serif",
          fontWeight: rtl ? 700 : 600,
          fontSize: "clamp(2rem, 1rem + 4vw, 4rem)",
          lineHeight: 0.95,
        }}
      >
        {t.sections?.theEssentials || "The Essentials"}
      </h2>
      <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
        {links.map((link) => (
          <li key={link.labelKey}>
            <Link
              href={link.href}
              className="inline-flex items-center rounded-full border border-light-400 bg-light-100 px-5 py-2 text-body-medium font-medium text-dark-900 transition-colors hover:border-dark-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
            >
              {labels[link.labelKey] || link.labelKey}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
