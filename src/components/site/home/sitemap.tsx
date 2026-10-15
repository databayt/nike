import Link from "next/link";
import type { Locale } from "@/components/internationalization/config";
import { Picture, RATIO, ratioStyle } from "./primitives";
import { SITEMAP_SWOOSH, buildSitemap } from "./home-data";

/**
 * The block nike.com runs between the homepage and the global footer: a centred
 * swoosh, the Find a Store / Help / Join Us / Sign In row, and a four-column
 * sitemap (Featured · Shoes · Clothing · Kids). Desktop shows each column's
 * first four links in a 928px centred grid; mobile folds the columns into
 * accordions.
 */
export default function Sitemap({ lang }: { lang: Locale }) {
  const columns = buildSitemap(lang);
  const quick = [
    { label: "Find a Store", href: "#" },
    { label: "Help", href: "#" },
    { label: "Join Us", href: `/${lang}/sign-up` },
    { label: "Sign In", href: `/${lang}/sign-in` },
  ];

  return (
    <section aria-label="Site map" className="mt-[84px]">
      <div
        style={ratioStyle(SITEMAP_SWOOSH.mobile.ratio, SITEMAP_SWOOSH.desktop.ratio)}
        className={`mx-6 lg:mx-12 ${RATIO}`}
      >
        <Picture
          mobile={SITEMAP_SWOOSH.mobile}
          desktop={SITEMAP_SWOOSH.desktop}
          alt="Nike"
          className="size-full object-contain"
        />
      </div>

      <nav aria-label="Quick links" className="flex justify-center gap-8 py-[41px]">
        {quick.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="py-1 text-[16px] font-medium leading-7 text-[#111] hover:text-[#707072]"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Desktop grid */}
      <div className="mx-auto hidden max-w-[928px] grid-cols-4 pb-14 lg:grid">
        {columns.map((col) => (
          <div key={col.title} className="px-6">
            <h3 className="text-[20px] font-medium leading-6 text-[#111]">{col.title}</h3>
            <ul className="mt-5 space-y-4">
              {col.links.slice(0, 4).map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[16px] font-medium leading-6 text-[#707072] hover:text-[#111]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mobile accordions */}
      <div className="px-6 lg:hidden">
        {columns.map((col) => (
          <details key={col.title} className="group">
            <summary className="flex h-[52px] cursor-pointer list-none items-center text-[20px] font-medium leading-6 text-[#111] [&::-webkit-details-marker]:hidden">
              {col.title}
            </summary>
            <ul className="space-y-4 pb-5 ps-5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-[16px] font-medium leading-6 text-[#707072]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}
