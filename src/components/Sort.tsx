"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { setParam } from "@/lib/utils/query";
import { type Dictionary } from "@/components/internationalization/dictionaries";

interface SortProps {
  dictionary: Dictionary;
}

/** nike.com/w "Sort By" — a text button opening a right-aligned option list. */
export default function Sort({ dictionary }: SortProps) {
  const OPTIONS = [
    { label: dictionary.sort.featured, value: "featured" },
    { label: dictionary.sort.newest, value: "newest" },
    { label: dictionary.sort.priceHighToLow, value: "price_desc" },
    { label: dictionary.sort.priceLowToHigh, value: "price_asc" },
  ] as const;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => `?${searchParams.toString()}`, [searchParams]);
  const selected = searchParams.get("sort") ?? "featured";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const choose = (value: string) => {
    setOpen(false);
    const withSort = setParam(pathname, search, "sort", value);
    router.push(setParam(pathname, new URL(withSort, "http://x").search, "page", "1"), { scroll: false });
  };

  const current = OPTIONS.find((o) => o.value === selected);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 px-1.5 text-base text-dark-900"
      >
        {dictionary.sort.title}
        {selected !== "featured" && current && <span className="text-[#707072]">: {current.label}</span>}
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={open ? "rotate-180" : ""}>
          <path d="M18.966 8.476L12 15.443 5.033 8.476" />
        </svg>
      </button>
      {open && (
        <ul role="listbox" className="absolute end-0 top-9 z-30 w-48 rounded-b-3xl bg-light-100 pt-2 pb-6 text-end">
          {OPTIONS.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === selected}
                onClick={() => choose(o.value)}
                className="w-full px-6 py-0.5 text-end text-base hover:text-[#707072]"
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
