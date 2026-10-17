import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import type { Locale } from "@/components/internationalization/config";
import TopBar from "./top-bar";
import DesktopNav from "./desktop-nav";
import SearchBar from "./search";
import MobileMenu from "./mobile-menu";
import { SwooshLogo, HeartIcon, BagIcon } from "./icons";
import { BagLink } from "./bag-link";

interface HeaderProps {
  dictionary: Dictionary;
  lang: Locale;
}

type HeaderDict = Record<string, string>;

/**
 * nike.com commerce-header-v2 clone: slim brand/utility top bar, then the main
 * header with the swoosh, mega-menu category nav, and the search/favorites/bag
 * action cluster. `relative` so the mega-menus and search tray anchor full-width
 * to the header; `sticky` so it pins to the top on scroll.
 */
export default function Header({ dictionary, lang }: HeaderProps) {
  const header = (dictionary as unknown as { header?: HeaderDict }).header ?? {};

  return (
    <header className="sticky top-0 z-50 bg-light-100">
      <TopBar dictionary={dictionary} lang={lang} />

      <div className="relative flex h-[60px] items-center justify-between px-4 lg:px-12">
        {/* Swoosh */}
        <div className="flex items-center">
          <Link
            href={`/${lang}`}
            aria-label={header.nikeHome || "Nike Home Page"}
            className="flex items-center text-dark-900"
          >
            <SwooshLogo width={58} />
          </Link>
        </div>

        {/* Category nav (desktop) */}
        <DesktopNav dictionary={dictionary} lang={lang} />

        {/* Actions */}
        <div className="flex items-center gap-x-0.5">
          <SearchBar
            lang={lang}
            labels={{
              search: header.search || "Search",
              placeholder: header.searchPlaceholder || "Search",
              popular: header.popularSearch || "Popular Search Terms",
              cancel: dictionary.common.cancel || "Cancel",
              ask: header.askNikeAI || "Ask NikeAI",
            }}
          />

          <Link
            href={`/${lang}/favorites`}
            aria-label={header.favorites || "Favorites"}
            className="flex h-11 w-11 items-center justify-center rounded-full text-dark-900 transition-colors hover:bg-light-200"
          >
            <HeartIcon size={24} />
          </Link>

          <BagLink href={`/${lang}/cart`} label={header.bag || "Bag"}>
            <BagIcon size={24} />
          </BagLink>

          <MobileMenu dictionary={dictionary} lang={lang} />
        </div>
      </div>
    </header>
  );
}
