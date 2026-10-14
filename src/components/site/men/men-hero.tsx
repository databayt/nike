"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import type { Locale } from "@/components/internationalization/config";
import { buildMenHero, menDict } from "./men-data";

interface MenHeroProps {
  dictionary: Dictionary;
  lang: Locale;
}

const RING_CIRCUMFERENCE = 2 * Math.PI * 22; // r = 22
const DELAY = 6500;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Play triangle for the secondary "Watch" CTA on video slides. */
function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden className="rtl:-scale-x-100">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/**
 * nike.com/men hero: a full-bleed autoplay carousel with center-anchored
 * campaign copy and a Shop (+ Watch) CTA. Mirrors the homepage hero's seamless
 * forward-loop mechanics — `index` runs 0..n with a trailing clone of the first
 * slide so the wrap is invisible — but is art-directed for the men's landing.
 */
export default function MenHero({ dictionary, lang }: MenHeroProps) {
  const slides = useMemo(() => buildMenHero(lang), [lang]);
  const n = slides.length;
  const t = menDict(dictionary);
  const cta = t.cta ?? {};

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const active = index % n;
  const rafRef = useRef<number | null>(null);

  const items = useMemo(() => [...slides, slides[0]], [slides]);

  useEffect(() => {
    if (paused || reduced || n <= 1) return;
    const timer = setTimeout(() => setIndex((i) => i + 1), DELAY);
    return () => clearTimeout(timer);
  }, [index, paused, reduced, n]);

  const handleTransitionEnd = () => {
    if (index === n) {
      setAnimate(false);
      setIndex(0);
    }
  };

  useEffect(() => {
    if (animate) return;
    rafRef.current = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimate(true)),
    );
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  const goNext = useCallback(() => setIndex((i) => i + 1), []);
  const goPrev = useCallback(() => {
    setIndex((i) => {
      if (i > 0) return i - 1;
      setAnimate(false);
      rafRef.current = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setAnimate(true);
          setIndex(n - 1);
        }),
      );
      return n;
    });
  }, [n]);

  const ctaLabel = (slide: (typeof slides)[number]) => {
    const verb = cta[slide.ctaKey] || (slide.ctaKey === "shopAll" ? "Shop All" : "Shop");
    return slide.ctaSuffix ? `${verb} ${slide.ctaSuffix}` : verb;
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t.a11y?.heroCarousel || "Featured carousel"}
      className="relative w-full overflow-hidden bg-dark-900"
    >
      {/* Slide track (forced LTR so the translate math is direction-agnostic) */}
      <div
        dir="ltr"
        className="flex aspect-[3/4] w-full sm:aspect-[16/9] xl:aspect-[1512/700]"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: animate ? "transform 900ms ease-in-out" : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {items.map((slide, i) => (
          <div
            key={`${slide.id}-${i}`}
            className="relative h-full w-full shrink-0"
            aria-hidden={i !== index}
          >
            <picture>
              <source media="(min-width: 640px)" srcSet={slide.imageWide} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            </picture>

            {/* Legibility scrim — bottom-weighted so the centered copy reads. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-900/70 via-dark-900/15 to-dark-900/10" />

            {/* Whole-slide click target (decorative; CTA below is the real link). */}
            <Link href={slide.href} aria-hidden tabIndex={-1} className="absolute inset-0 z-10" />

            {/* Centered campaign copy. */}
            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-end px-6 pb-24 text-center sm:pb-28 lg:pb-32">
              <h2
                className="uppercase leading-[0.95] text-light-100"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(2.75rem, 1rem + 6.5vw, 6rem)",
                }}
              >
                {slide.title}
              </h2>
              <p className="mt-3 max-w-xl text-body text-light-100 sm:text-lead">
                {slide.subtitle}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Link
                  href={slide.href}
                  tabIndex={i === index ? 0 : -1}
                  className="pointer-events-auto inline-flex items-center rounded-full bg-light-100 px-7 py-3 text-body-medium font-medium text-dark-900 transition-colors hover:bg-light-300"
                >
                  {ctaLabel(slide)}
                </Link>
                {slide.watch && (
                  <button
                    type="button"
                    tabIndex={i === index ? 0 : -1}
                    className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-light-100/70 bg-dark-900/20 px-6 py-3 text-body-medium font-medium text-light-100 backdrop-blur-sm transition-colors hover:bg-dark-900/40"
                  >
                    <PlayGlyph />
                    {cta.watch || "Watch"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div
        role="group"
        aria-label={t.a11y?.pagination || "Carousel pagination"}
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 drop-shadow"
      >
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`${t.a11y?.goToSlide || "Go to slide"} ${i + 1}`}
            aria-current={i === active}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-6 bg-light-100" : "w-2 bg-light-100/50 hover:bg-light-100/80"
            }`}
          />
        ))}
      </div>

      {/* Controls: pause/play + prev/next */}
      <div className="absolute bottom-5 end-4 z-20 flex items-center gap-1 text-light-100 drop-shadow sm:end-8">
        <button
          type="button"
          aria-label={paused ? cta.play || "Play" : cta.pause || "Pause"}
          onClick={() => setPaused((p) => !p)}
          className="relative flex h-12 w-12 items-center justify-center"
        >
          {!reduced && (
            <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth={2} />
              <circle
                key={index}
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                className="hero-progress-ring"
                style={{
                  strokeDasharray: RING_CIRCUMFERENCE,
                  animationDuration: `${DELAY}ms`,
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            </svg>
          )}
          {paused ? (
            <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden>
              <rect x="7" y="5" width="3.2" height="14" rx="1" />
              <rect x="13.8" y="5" width="3.2" height="14" rx="1" />
            </svg>
          )}
        </button>

        <button
          type="button"
          aria-label={t.a11y?.previous || "Previous"}
          onClick={goPrev}
          className="flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-light-100/10"
        >
          <svg viewBox="0 0 24 24" width={24} height={24} fill="none" aria-hidden className="rtl:-scale-x-100">
            <path stroke="currentColor" strokeWidth={1.5} d="M15.525 18.966 8.558 12l6.967-6.967" />
          </svg>
        </button>

        <button
          type="button"
          aria-label={t.a11y?.next || "Next"}
          onClick={goNext}
          className="flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-light-100/10"
        >
          <svg viewBox="0 0 24 24" width={24} height={24} fill="none" aria-hidden className="rtl:-scale-x-100">
            <path stroke="currentColor" strokeWidth={1.5} d="M8.474 18.966 15.44 12 8.474 5.033" />
          </svg>
        </button>
      </div>
    </section>
  );
}
