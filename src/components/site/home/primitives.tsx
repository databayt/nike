import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { cdn, srcSet, type Cta, type Img, type Space } from "./home-data";

/**
 * Shared building blocks for the homepage sections — the exact pill buttons,
 * art-directed <picture>, slot spacing and athlete credit nike reuses across
 * every block. Desktop starts at 960px (`lg`, redefined in globals.css) to
 * match nike's own grid breakpoint.
 */

/** Per-slot top margin, mobile → desktop. */
export function spaceStyle([mobile, desktop]: Space): CSSProperties {
  return { "--mt": `${mobile}px`, "--mt-lg": `${desktop}px` } as CSSProperties;
}
export const SPACE = "mt-(--mt) lg:mt-(--mt-lg)";

/** Aspect-ratio vars for a box whose crop changes at the desktop breakpoint. */
export function ratioStyle(mobile: number, desktop: number): CSSProperties {
  return { "--ar": mobile, "--ar-lg": desktop } as CSSProperties;
}
export const RATIO = "aspect-(--ar) lg:aspect-(--ar-lg)";

/** Art-directed image: mobile crop below 960px, desktop crop above. */
export function Picture({
  mobile,
  desktop,
  alt,
  sizes = "100vw",
  className = "size-full object-cover",
  priority = false,
}: {
  mobile: Img;
  desktop?: Img;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  const widths = [375, 640, 750, 960, 1280, 1440, 1920, 2560];
  return (
    <picture>
      {desktop && (
        <source media="(min-width: 960px)" srcSet={srcSet(desktop, widths)} sizes={sizes} />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element -- art-directed CDN crops */}
      <img
        src={cdn(mobile, 750)}
        srcSet={srcSet(mobile, widths)}
        sizes={sizes}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden fill="currentColor">
    <path d="M7 4.5v15l12-7.5-12-7.5z" />
  </svg>
);

/** nike's `nds-btn` pill — 36px tall, 6px/16px padding, 30px radius. */
export function Pill({
  cta,
  tone,
  watchLabel,
}: {
  cta: Cta;
  tone: "light" | "dark";
  watchLabel?: string;
}) {
  const cls = [
    "pointer-events-auto inline-flex h-9 items-center gap-1 rounded-[30px] px-4 py-1.5 font-medium text-[16px] leading-6 transition-colors",
    tone === "light"
      ? "bg-white text-[#111] hover:bg-[#CACACB]"
      : "bg-[#111] text-white hover:bg-[#707072]",
  ].join(" ");

  if (cta.watch) {
    return (
      <Link href={cta.href} className={cls} aria-label={watchLabel ?? cta.label}>
        {watchLabel ?? cta.label}
        <PlayIcon />
      </Link>
    );
  }
  return (
    <Link href={cta.href} className={cls}>
      {cta.label}
    </Link>
  );
}

/** Vertical athlete credit, top-end corner (12/18 medium, white). */
export function Credit({ children }: { children: ReactNode }) {
  return (
    <p className="pointer-events-none absolute end-4 top-6 z-10 max-h-[310px] text-[12px] font-medium leading-[18px] text-white [writing-mode:vertical-rl]">
      {children}
    </p>
  );
}
