import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import type { Locale } from "@/components/internationalization/config";
import { buildCategoryTiles, menDict } from "./men-data";

interface ShopByCategoryProps {
  dictionary: Dictionary;
  lang: Locale;
}

/**
 * "Shop By Category" mosaic: a tall Clothing tile on the start side spanning
 * two rows, with stacked Shoes / Accessories tiles on the end side. Each tile
 * carries a white pill label in its bottom-start corner.
 */
export default function ShopByCategory({ dictionary, lang }: ShopByCategoryProps) {
  const tiles = buildCategoryTiles(lang);
  const t = menDict(dictionary);
  const category = t.category ?? {};

  return (
    <section className="px-4 pt-12 sm:px-6 lg:px-10">
      <h2 className="mb-6 text-2xl font-medium text-dark-900">
        {t.sections?.shopByCategory || "Shop By Category"}
      </h2>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:grid-rows-2">
        {tiles.map((tile) => (
          <Link
            key={tile.id}
            href={tile.href}
            className={`group relative block overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2 ${
              tile.tall ? "aspect-[3/4] lg:row-span-2 lg:aspect-auto lg:h-full" : "aspect-[16/10]"
            }`}
          >
            <div className="h-full w-full overflow-hidden bg-light-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tile.src}
                srcSet={tile.srcSet}
                sizes="(min-width:1024px) 49vw, 100vw"
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <span className="absolute bottom-5 start-5 inline-flex items-center rounded-full bg-light-100 px-5 py-2 text-body-medium font-medium text-dark-900 shadow-sm transition-colors group-hover:bg-light-300">
              {category[tile.labelKey] || tile.labelKey}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
