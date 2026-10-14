import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import type { Locale } from "@/components/internationalization/config";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { buildBrandNav, buildUserNav } from "./nav-data";
import { JordanIcon, ConverseIcon, CaretDownIcon } from "./icons";

interface TopBarProps {
  dictionary: Dictionary;
  lang: Locale;
}

type HeaderDict = Record<string, string>;

const Separator = () => <span aria-hidden className="h-3.5 w-px bg-light-300" />;

/**
 * The slim utility bar above the main header (desktop only, like nike.com):
 * brand switch on the start side, account/help links on the end side.
 */
export default function TopBar({ dictionary, lang }: TopBarProps) {
  const brands = buildBrandNav(lang);
  const userNav = buildUserNav(lang);
  const header = (dictionary as unknown as { header?: HeaderDict }).header ?? {};

  return (
    <div className="hidden bg-light-200 lg:block">
      <div className="flex h-9 items-center justify-between px-4 lg:px-12">
        {/* Brand navigation */}
        <nav aria-label="Brand Navigation">
          <ul className="flex items-center gap-x-1">
            {brands.map((brand) => (
              <li key={brand.label}>
                <Link
                  href={brand.href}
                  aria-label={brand.label}
                  className="flex h-7 w-7 items-center justify-center text-dark-900 transition-colors hover:text-dark-700"
                >
                  {brand.icon === "jordan" ? (
                    <JordanIcon size={22} />
                  ) : (
                    <ConverseIcon size={22} />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User navigation */}
        <nav aria-label="User Navigation">
          <ul className="flex items-center gap-x-3 text-[0.75rem] font-medium text-dark-900">
            {userNav.map((item) => {
              const label = header[item.key] || item.label;
              return (
                <li key={item.key} className="flex items-center gap-x-3">
                  {item.links ? (
                    <div className="group relative flex items-center gap-x-0.5">
                      <Link href={item.href} className="hover:text-dark-700">
                        {label}
                      </Link>
                      <button
                        type="button"
                        aria-label={`${label} menu`}
                        aria-haspopup="menu"
                        className="flex items-center"
                      >
                        <CaretDownIcon size={16} className="transition-transform group-hover:rotate-180" />
                      </button>
                      {/* Help dropdown */}
                      <div
                        role="menu"
                        aria-label={label}
                        className="invisible absolute end-0 top-full z-50 w-56 translate-y-1 bg-light-100 py-2 opacity-0 shadow-[0_16px_24px_-12px_rgba(0,0,0,0.15)] transition-[opacity,transform,visibility] duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                      >
                        <p className="px-4 pb-1 text-[0.875rem] font-medium text-dark-700">{label}</p>
                        <ul>
                          {item.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                role="menuitem"
                                className="block px-4 py-1.5 text-[0.875rem] text-dark-900 hover:bg-light-200"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link href={item.href} className="hover:text-dark-700">
                      {label}
                    </Link>
                  )}
                  <Separator />
                </li>
              );
            })}
            <li>
              <LanguageSwitcher currentLocale={lang} />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
