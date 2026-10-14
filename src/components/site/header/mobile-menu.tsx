"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import type { Locale } from "@/components/internationalization/config";
import { isRTL } from "@/components/internationalization/config";
import { buildMainNav, buildBrandNav, buildUserNav } from "./nav-data";
import {
  MenuIcon,
  CloseIcon,
  CaretDownIcon,
  JordanIcon,
  ConverseIcon,
} from "./icons";

interface MobileMenuProps {
  dictionary: Dictionary;
  lang: Locale;
}

type HeaderDict = Record<string, string>;

/** Slide-in drawer nav for small screens (the desktop nav is hidden < lg). */
export default function MobileMenu({ dictionary, lang }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const items = buildMainNav(lang);
  const brands = buildBrandNav(lang);
  const userNav = buildUserNav(lang);
  const header = (dictionary as unknown as { header?: HeaderDict }).header ?? {};
  const rtl = isRTL(lang);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={header.menu || "Menu"}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-dark-900 transition-colors hover:bg-light-200"
      >
        <MenuIcon size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-dark-900/40" aria-hidden onClick={close} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={header.menu || "Menu"}
            className={`absolute inset-y-0 ${rtl ? "start-0" : "end-0"} flex w-[85%] max-w-sm flex-col overflow-y-auto bg-light-100 shadow-xl`}
          >
            <div className="flex justify-end p-4">
              <button
                type="button"
                aria-label={header.close || "Close"}
                onClick={close}
                className="flex h-10 w-10 items-center justify-center rounded-full text-dark-900 hover:bg-light-200"
              >
                <CloseIcon size={24} />
              </button>
            </div>

            <nav aria-label="Mobile Navigation" className="flex-1 px-2 pb-6">
              <ul>
                {items.map((item) => {
                  const label = (item.key && header[item.key]) || item.label;
                  const isOpen = expanded === item.label;
                  return (
                    <li key={item.label} className="border-b border-light-200">
                      {item.columns ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setExpanded(isOpen ? null : item.label)}
                            aria-expanded={isOpen}
                            className="flex w-full items-center justify-between px-4 py-4 text-start text-lg font-medium text-dark-900"
                          >
                            {label}
                            <CaretDownIcon
                              size={20}
                              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                          {isOpen && (
                            <div className="space-y-4 px-4 pb-5">
                              {item.columns.map((column) => (
                                <div key={column.title}>
                                  <Link
                                    href={column.href}
                                    onClick={close}
                                    className="block py-1 text-[0.95rem] font-medium text-dark-900"
                                  >
                                    {column.title}
                                  </Link>
                                  <ul className="ps-2">
                                    {column.links.map((link, i) => (
                                      <li key={`${link.label}-${i}`}>
                                        <Link
                                          href={link.href}
                                          onClick={close}
                                          className="block py-1.5 text-[0.95rem] text-dark-700 hover:text-dark-900"
                                        >
                                          {link.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={close}
                          className="block px-4 py-4 text-lg font-medium text-dark-900"
                        >
                          {label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Account links */}
              <ul className="mt-6 space-y-1 px-4">
                {userNav.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="block py-2 text-[0.95rem] text-dark-700 hover:text-dark-900"
                    >
                      {header[item.key] || item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Brand switch */}
              <div className="mt-6 flex items-center gap-5 px-4">
                {brands.map((brand) => (
                  <Link
                    key={brand.label}
                    href={brand.href}
                    aria-label={brand.label}
                    onClick={close}
                    className="text-dark-900 hover:text-dark-700"
                  >
                    {brand.icon === "jordan" ? <JordanIcon size={26} /> : <ConverseIcon size={26} />}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
