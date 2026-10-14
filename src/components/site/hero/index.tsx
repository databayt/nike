"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import { type Locale, isRTL } from "@/components/internationalization/config";
import { buildHeroSlides } from "./hero-data";

interface HeroProps {
  dictionary: Dictionary;
  lang: Locale;
}

type HeroDict = Record<string, string>;

const RING_CIRCUMFERENCE = 2 * Math.PI * 22; // r = 22

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

export default function Hero({ dictionary, lang }: HeroProps) {
  const slides = useMemo(() => buildHeroSlides(lang), [lang]);
  const n = slides.length;
  const rtl = isRTL(lang);
  const t = (dictionary as unknown as { hero?: HeroDict }).hero ?? {};

  // `index` runs 0..n, where n is a clone of the first slide used for a
  // seamless forward loop. `active` collapses the clone back to a real index.
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const active = index % n;
  const rafRef = useRef<number | null>(null);

  const items = useMemo(() => [...slides, slides[0]], [slides]);

  // Autoplay
  useEffect(() => {
    if (paused || reduced || n <= 1) return;
    const timer = setTimeout(() => setIndex((i) => i + 1), slides[active]?.delay ?? 6000);
    return () => clearTimeout(timer);
  }, [index, paused, reduced, active, n, slides]);

  // After the clone slides in, jump back to the real first slide without animating.
  const handleTransitionEnd = () => {
    if (index === n) {
      setAnimate(false);
      setIndex(0);
    }
  };

  // Re-enable the transition on the next frame after an instant jump.
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
      // Wrap from the first slide: jump to the clone, then animate to the last.
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
  const goTo = useCallback((i: number) => setIndex(i), []);

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t.carousel || "Featured carousel"}
      className="relative w-full overflow-hidden bg-light-200"
    >
      {/* Slide track (forced LTR so the translate math is direction-agnostic) */}
      <div
        dir="ltr"
        className="flex aspect-[4/5] w-full sm:aspect-[16/9] xl:aspect-[1512/735]"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: animate ? "transform 1000ms ease-in-out" : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {items.map((slide, i) => (
          <div
            key={`${slide.id}-${i}`}
            className="relative h-full w-full shrink-0"
            aria-hidden={i !== index}
          >
            {slide.video ? (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={slide.image.landscape}
              >
                <source src={slide.video} type="video/mp4" />
              </video>
            ) : (
              <picture>
                <source media="(min-width: 640px)" srcSet={slide.image.landscape} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image.portrait}
                  alt={slide.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                />
              </picture>
            )}

            {/* Legibility scrim — kept light; the art-directed imagery carries
                its own contrast. pointer-events off so the card link gets clicks. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-900/60 via-dark-900/15 to-transparent" />

            {/* Whole-slide click target, mirroring Nike's card-link. Decorative
                for assistive tech: keyboard/screen-reader users get the CTA below. */}
            <Link href={slide.href} aria-hidden tabIndex={-1} className="absolute inset-0 z-10" />

            {/* Overlay copy. Text stays LTR (English campaign copy renders with
                correct punctuation) but is right-aligned/positioned for RTL.
                pointer-events-none lets clicks fall through to the card link;
                the CTA re-enables them. */}
            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 lg:p-16">
              <div className={`max-w-2xl ${rtl ? "ml-auto text-right" : "mr-auto text-left"}`}>
                {/* nike "appearance-display2": Futura ND stand-in (Jost), 76px,
                    uppercase, normal tracking, line-height 0.9 — matches nike.com. */}
                <h2
                  className="uppercase text-light-100"
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontWeight: 600,
                    fontSize: "clamp(2.25rem, 1.1rem + 4.5vw, 4.75rem)",
                    lineHeight: 0.9,
                  }}
                >
                  {slide.title}
                </h2>
                {/* nike "appearance-body1": regular weight, tight top margin */}
                <p className="mt-2 max-w-md text-body font-normal text-light-100 sm:text-xl">
                  {slide.body}
                </p>
                <div className="mt-6">
                  <Link
                    href={slide.href}
                    tabIndex={i === index ? 0 : -1}
                    className="pointer-events-auto inline-flex items-center rounded-full bg-light-100 px-7 py-3 text-body-medium font-medium text-dark-900 transition-colors hover:bg-light-300"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination dots — nike uses uniform small (~6px) white circles, the
          active one at full opacity and the rest at 50%. */}
      <div
        role="group"
        aria-label={t.pagination || "Carousel pagination"}
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 drop-shadow"
      >
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`${t.goToSlide || "Go to slide"} ${i + 1}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={`h-[5px] w-[5px] rounded-full bg-light-100 transition-opacity ${
              i === active ? "opacity-100" : "opacity-50 hover:opacity-80"
            }`}
          />
        ))}
      </div>

      {/* Controls — nike layout: a ghost play/pause (white icon + autoplay
          progress ring) followed by two 36px solid-white circular arrows with
          dark glyphs, in a tight cluster pinned bottom-end. */}
      <div className="absolute bottom-6 end-6 z-20 flex items-center gap-4">
        <button
          type="button"
          aria-label={paused ? t.play || "Play" : t.pause || "Pause"}
          onClick={() => setPaused((p) => !p)}
          className="relative flex h-9 w-9 items-center justify-center text-light-100 drop-shadow"
        >
          {!reduced && (
            <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeOpacity={0.3} strokeWidth={4} />
              <circle
                key={index}
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="currentColor"
                strokeWidth={4}
                strokeLinecap="round"
                className="hero-progress-ring"
                style={{
                  strokeDasharray: RING_CIRCUMFERENCE,
                  animationDuration: `${slides[active]?.delay ?? 6000}ms`,
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            </svg>
          )}
          {paused ? (
            <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden>
              <rect x="7" y="5" width="3.2" height="14" rx="1" />
              <rect x="13.8" y="5" width="3.2" height="14" rx="1" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={t.previous || "Previous"}
            onClick={goPrev}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-light-100 text-dark-900 transition-colors hover:bg-light-300"
          >
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" aria-hidden className="rtl:-scale-x-100">
              <path stroke="currentColor" strokeWidth={1.5} d="M15.525 18.966 8.558 12l6.967-6.967" />
            </svg>
          </button>

          <button
            type="button"
            aria-label={t.next || "Next"}
            onClick={goNext}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-light-100 text-dark-900 transition-colors hover:bg-light-300"
          >
            <svg viewBox="0 0 24 24" width={20} height={20} fill="none" aria-hidden className="rtl:-scale-x-100">
              <path stroke="currentColor" strokeWidth={1.5} d="M8.474 18.966 15.44 12 8.474 5.033" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
