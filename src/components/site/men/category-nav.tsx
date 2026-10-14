import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import type { Locale } from "@/components/internationalization/config";
import MegaMenu from "@/components/site/header/mega-menu";
import { buildCategoryNav, menDict } from "./men-data";

interface CategoryNavProps {
  dictionary: Dictionary;
  lang: Locale;
}

/**
 * nike.com/men's secondary category bar: the gender title pinned to the start,
 * a centered "Shop All / Shoes / Clothing / Accessories" nav, and CSS-only
 * hover/focus mega-menus (reusing the header's MegaMenu). `relative` so the
 * dropdown panels anchor full-width to this bar.
 */
export default function CategoryNav({ dictionary, lang }: CategoryNavProps) {
  const items = buildCategoryNav(lang);
  const t = menDict(dictionary);
  const nav = t.nav ?? {};

  return (
    <nav
      aria-label={nav.men || "Men"}
      className="relative z-30 hidden border-b border-light-300 bg-light-100 lg:block"
    >
      <div className="flex h-14 items-center px-4 lg:px-10">
        <h1 className="text-lead font-medium text-dark-900">{nav.men || "Men"}</h1>

        <ul className="absolute inset-x-0 mx-auto flex w-fit items-center justify-center gap-x-8">
          {items.map((item) => {
            const label = nav[item.key] || item.key;
            return (
              <li key={item.key} className="group flex h-14 items-center">
                <Link
                  href={item.href}
                  aria-haspopup={item.columns ? "menu" : undefined}
                  className="relative flex h-full items-center text-body-medium font-medium text-dark-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-dark-900 after:transition-transform after:duration-200 hover:after:scale-x-100 group-hover:after:scale-x-100"
                >
                  {label}
                </Link>
                {item.columns && <MegaMenu columns={item.columns} label={`${label} menu`} />}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
