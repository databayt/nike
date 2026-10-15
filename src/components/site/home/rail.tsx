"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

interface RailScrollerProps {
  children: ReactNode;
  prevLabel: string;
  nextLabel: string;
}

const Arrow = ({ dir }: { dir: "prev" | "next" }) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" aria-hidden className="rtl:-scale-x-100">
    <path
      stroke="currentColor"
      strokeWidth={1.5}
      d={dir === "prev" ? "M15.525 18.966L8.558 12l6.967-6.967" : "M8.474 18.966L15.44 12 8.474 5.033"}
    />
  </svg>
);

/**
 * Horizontal product rail with nike's desktop carousel controls — two 48px
 * circles top-end, #E5E5E5 when live, #F5F5F5 + #9E9EA0 glyph when disabled.
 * Each click pages by the visible width. Below 960px the controls hide and the
 * rail is a plain swipe row, as on nike.com.
 */
export default function RailScroller({ children, prevLabel, nextLabel }: RailScrollerProps) {
  const ref = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const x = Math.abs(el.scrollLeft);
    setEdge({ start: x < 4, end: x + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const page = (sign: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl" ? -1 : 1;
    el.scrollBy({ left: sign * rtl * el.clientWidth, behavior: "smooth" });
  };

  const btn = (disabled: boolean) =>
    `flex size-12 items-center justify-center rounded-full transition-colors ${
      disabled ? "bg-[#F5F5F5] text-[#9E9EA0]" : "bg-[#E5E5E5] text-[#111] hover:bg-[#CACACB]"
    }`;

  return (
    <div className="relative">
      <div className="absolute -top-[60px] end-6 hidden gap-3 md:flex lg:end-12">
        <button type="button" aria-label={prevLabel} disabled={edge.start} onClick={() => page(-1)} className={btn(edge.start)}>
          <Arrow dir="prev" />
        </button>
        <button type="button" aria-label={nextLabel} disabled={edge.end} onClick={() => page(1)} className={btn(edge.end)}>
          <Arrow dir="next" />
        </button>
      </div>
      <ul
        ref={ref}
        onScroll={update}
        className="flex snap-x gap-3 overflow-x-auto scroll-px-6 px-6 [scrollbar-width:none] lg:scroll-px-12 lg:px-12"
      >
        {children}
      </ul>
    </div>
  );
}

/** Mobile "See All" for the Trending grid — reveals the icons hidden below 960px. */
export function SeeAll({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div data-open={open} className="group/see">
      {children}
      {!open && (
        <div className="flex justify-center pb-3 pt-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-9 rounded-[30px] border border-[#CACACB] px-4 text-[16px] font-medium leading-6 text-[#111] hover:border-[#111]"
          >
            {label}
          </button>
        </div>
      )}
    </div>
  );
}
