"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { getArrayParam, toggleArrayParam } from "@/lib/utils/query";
import { type Dictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";

interface FiltersProps {
  dictionary: Dictionary;
  lang?: Locale;
}

type GroupKey = "gender" | "color" | "price" | "size";

/** nike.com's colour facets; slugs match the catalog seed ("Grey" → gray). */
const COLORS = [
  { id: "black", label: "Black", hex: "#111111" },
  { id: "blue", label: "Blue", hex: "#1790c8" },
  { id: "brown", label: "Brown", hex: "#825d41" },
  { id: "green", label: "Green", hex: "#7bba3c" },
  { id: "gray", label: "Grey", hex: "#808080" },
  { id: "multi-color", label: "Multi-Color", hex: "conic-gradient(#ffd400,#3fb34f,#1790c8,#8a2be2,#e7352b,#f36b26,#ffd400)" },
  { id: "orange", label: "Orange", hex: "#f36b26" },
  { id: "pink", label: "Pink", hex: "#f0728f" },
  { id: "purple", label: "Purple", hex: "#8d429f" },
  { id: "red", label: "Red", hex: "#e7352b" },
  { id: "white", label: "White", hex: "#ffffff" },
  { id: "yellow", label: "Yellow", hex: "#fed533" },
] as const;

const PRICES = [
  { id: "0-25", label: "$0 - $25" },
  { id: "25-50", label: "$25 - $50" },
  { id: "50-100", label: "$50 - $100" },
  { id: "100-150", label: "$100 - $150" },
  { id: "150-", label: "Over $150" },
] as const;

const SIZES = ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"] as const;

/** nike.com/w filter rail — collapsible groups behind a #e5e5e5 rule, URL-driven. */
export default function Filters({ dictionary }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => `?${searchParams.toString()}`, [searchParams]);
  const selected = (k: GroupKey) => getArrayParam(search, k);
  const toggle = (k: GroupKey, v: string) => router.push(toggleArrayParam(pathname, search, k, v), { scroll: false });

  const GENDERS = [
    { id: "men", label: dictionary.filters.genderMen },
    { id: "women", label: dictionary.filters.genderWomen },
    { id: "unisex", label: dictionary.filters.genderUnisex },
  ];

  return (
    <div className="text-base text-dark-900">
      <Group title={dictionary.filters.gender} count={selected("gender").length}>
        {GENDERS.map((g) => (
          <Check key={g.id} label={g.label} checked={selected("gender").includes(g.id)} onChange={() => toggle("gender", g.id)} />
        ))}
      </Group>

      <Group title={dictionary.filters.color} count={selected("color").length}>
        <div className="grid grid-cols-3 gap-y-3 pt-1">
          {COLORS.map((c) => {
            const on = selected("color").includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle("color", c.id)}
                className="flex flex-col items-center gap-1 text-xs"
              >
                <span
                  className={`relative grid size-7 place-items-center rounded-full ${c.id === "white" ? "border border-light-400" : ""}`}
                  style={{ background: c.hex }}
                >
                  {on && <CheckMark className={c.id === "white" || c.id === "yellow" ? "text-dark-900" : "text-light-100"} />}
                </span>
                {c.label}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title={dictionary.filters.price} count={selected("price").length}>
        {PRICES.map((p) => (
          <Check key={p.id} label={p.label} checked={selected("price").includes(p.id)} onChange={() => toggle("price", p.id)} />
        ))}
      </Group>

      <Group title={dictionary.filters.size} count={selected("size").length}>
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {SIZES.map((s) => {
            const on = selected("size").includes(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => toggle("size", s)}
                className={`h-9 rounded border text-sm ${on ? "border-dark-900" : "border-light-300 hover:border-dark-900"}`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Group>
    </div>
  );
}

function Group({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-t border-light-300 first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex h-12 w-full items-center justify-between text-start font-medium"
      >
        <span>
          {title}
          {count > 0 && <span className="ps-1">({count})</span>}
        </span>
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={open ? "rotate-180" : ""}>
          <path d="M18.966 8.476L12 15.443 5.033 8.476" />
        </svg>
      </button>
      {open && <div className="flex flex-col gap-1.5 pb-6">{children}</div>}
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} onClick={onChange} className="flex items-center gap-1.5 py-0.5 text-start hover:text-[#707072]">
      <span className={`grid size-5 shrink-0 place-items-center rounded border ${checked ? "border-dark-900 bg-dark-900" : "border-[#cacacb]"}`}>
        {checked && <CheckMark className="text-light-100" />}
      </span>
      {label}
    </button>
  );
}

function CheckMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M5.03 11.69l4.753 4.754 9.186-9.188" />
    </svg>
  );
}
