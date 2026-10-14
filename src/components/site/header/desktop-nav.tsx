import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import type { Locale } from "@/components/internationalization/config";
import { buildMainNav } from "./nav-data";
import MegaMenu from "./mega-menu";

interface DesktopNavProps {
  dictionary: Dictionary;
  lang: Locale;
}

type HeaderDict = Record<string, string>;

/**
 * Center column of the main header: the primary category nav with hover/focus
 * mega-menus. Rendered server-side; interactivity is CSS-only.
 */
export default function DesktopNav({ dictionary, lang }: DesktopNavProps) {
  const items = buildMainNav(lang);
  const header = (dictionary as unknown as { header?: HeaderDict }).header ?? {};

  return (
    <nav aria-label="Main Navigation" className="hidden h-full lg:block">
      <ul className="flex h-full items-center gap-x-6">
        {items.map((item) => {
          const label = (item.key && header[item.key]) || item.label;
          return (
            <li key={item.label} className="group flex h-full items-center">
              <Link
                href={item.href}
                className="relative flex h-full items-center text-base font-medium text-dark-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-dark-900 after:transition-transform after:duration-200 hover:after:scale-x-100 group-hover:after:scale-x-100"
                aria-haspopup={item.columns ? "menu" : undefined}
              >
                {item.columns ? (
                  label
                ) : (
                  <span className="nav-glitch" data-text={label}>
                    {label}
                  </span>
                )}
              </Link>
              {item.columns && <MegaMenu columns={item.columns} label={`${label} menu`} />}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
