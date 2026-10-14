import type { Locale } from "@/components/internationalization/config";

/**
 * Hero autoplay-carousel slides, modeled on nike.com's homepage hero.
 * Imagery is served from Nike's public CDN (next.config allows any HTTPS host).
 * A slide may be image-only (art-directed landscape/portrait crops) or carry an
 * optional `video` source rendered as an ambient, muted, looping background.
 */
export interface HeroSlide {
  id: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  alt: string;
  image: { landscape: string; portrait: string };
  video?: string;
  /** Autoplay dwell time before advancing, in ms. */
  delay: number;
}

const img = (id: string, w: number, file = "image.jpg") =>
  `https://static.nike.com/a/images/f_auto,cs_srgb/w_${w},c_limit/${id}/${file}`;

export function buildHeroSlides(lang: Locale): HeroSlide[] {
  const products = (q: string) => `/${lang}/products?search=${encodeURIComponent(q)}`;

  return [
    {
      id: "spotlight-brasil",
      title: "HARD TO STOP. HARDER TO COPY.",
      body: "Made for the kind of flair you just can’t fake.",
      cta: "Shop Brasil",
      href: products("brasil"),
      alt: "HARD TO STOP. HARDER TO COPY.",
      image: {
        landscape: img("ea6e33c5-8266-4fdb-a84d-522b910a8797", 1920, "nike-just-do-it.jpg"),
        portrait: img("db3432f7-a228-47d0-b5df-e7d415d97479", 1536, "nike-just-do-it.jpg"),
      },
      delay: 6000,
    },
    {
      id: "soccer-usa",
      title: "NO UNDER, ONLY DOGS.",
      body: "Respect the badge. Fear the bite.",
      cta: "Shop USA",
      href: products("usa"),
      alt: "NO UNDER, ONLY DOGS.",
      image: {
        landscape: img("ba81d8dc-a725-4c1d-83c3-a63e0c5d7e6c", 1920),
        portrait: img("ba81d8dc-a725-4c1d-83c3-a63e0c5d7e6c", 1536),
      },
      delay: 6000,
    },
  ];
}
