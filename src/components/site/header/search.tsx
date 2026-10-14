"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/components/internationalization/config";
import { POPULAR_SEARCH_TERMS } from "./nav-data";
import { SearchIcon, CloseIcon, NikeAIIcon, SearchBarSwoosh } from "./icons";

interface SearchBarProps {
  lang: Locale;
  labels: {
    search: string;
    placeholder: string;
    popular: string;
    cancel: string;
    ask: string;
  };
}

/**
 * Nike-style search: an icon trigger in the action cluster that expands into a
 * full-width tray (input + popular terms + Ask NikeAI). Closes on Escape, on
 * scrim click, or after a submit that routes to the products page.
 */
export default function SearchBar({ lang, labels }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = (term: string) => {
    const q = term.trim();
    if (!q) return;
    setOpen(false);
    setQuery("");
    router.push(`/${lang}/products?search=${encodeURIComponent(q)}`);
  };

  // Command-input behaviour: the term list filters live as you type; an empty
  // query shows the full popular set.
  const trimmed = query.trim().toLowerCase();
  const suggestions = trimmed
    ? POPULAR_SEARCH_TERMS.filter((term) => term.toLowerCase().includes(trimmed))
    : POPULAR_SEARCH_TERMS;

  return (
    <>
      {/* nike's header search is a visible input-styled pill (magnifier + AI
          sparkle + placeholder), not a bare icon. Collapses to an icon on
          smaller screens. Clicking it opens the full search tray below. */}
      <button
        type="button"
        aria-label={labels.search}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center"
      >
        <span className="hidden h-9 w-[180px] items-center gap-2 rounded-full bg-light-200 ps-3.5 text-dark-700 transition-colors group-hover:bg-light-300 lg:flex">
          <SearchIcon size={20} className="shrink-0 text-dark-900" />
          <span className="text-body-medium">{labels.placeholder}</span>
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full text-dark-900 transition-colors group-hover:bg-light-200 lg:hidden">
          <SearchIcon size={24} />
        </span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-dark-900/10"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-x-0 top-full z-50 border-t border-light-300 bg-light-100 shadow-[0_16px_24px_-12px_rgba(0,0,0,0.12)]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(query);
              }}
              className="mx-auto max-w-[1200px] px-4 py-4 lg:px-10"
            >
              <div className="flex items-center gap-4">
                <SearchBarSwoosh className="hidden shrink-0 text-dark-900 sm:block" />
                <div className="flex flex-1 items-center gap-3 rounded-full bg-light-200 px-5 py-3">
                  <SearchIcon size={24} className="shrink-0 text-dark-900" />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={labels.placeholder}
                    aria-label={labels.search}
                    className="w-full bg-transparent text-[1.125rem] text-dark-900 outline-none placeholder:text-dark-700 [&::-webkit-search-cancel-button]:hidden"
                  />
                  {query && (
                    <button
                      type="button"
                      aria-label={labels.cancel}
                      onClick={() => setQuery("")}
                      className="shrink-0 text-dark-700 hover:text-dark-900"
                    >
                      <CloseIcon size={22} />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="shrink-0 px-2 text-body-medium font-medium text-dark-900 transition-colors hover:text-dark-700"
                >
                  {labels.cancel}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full border border-light-300 px-4 py-2 text-[0.875rem] font-medium text-dark-900 transition-colors hover:border-dark-900"
                >
                  <NikeAIIcon size={16} />
                  {labels.ask}
                </button>
              </div>

              {suggestions.length > 0 && (
                <>
                  <p className="mt-5 text-[0.875rem] text-dark-700">{labels.popular}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {suggestions.map((term) => (
                      <Link
                        key={term}
                        href={`/${lang}/products?search=${encodeURIComponent(term)}`}
                        onClick={() => setOpen(false)}
                        className="rounded-full bg-light-200 px-4 py-2 text-[0.875rem] text-dark-900 transition-colors hover:bg-light-300"
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </form>
          </div>
        </>
      )}
    </>
  );
}
