import type { Locale } from "@/components/internationalization/config";
import type { NavColumn } from "@/components/site/header/nav-data";

/**
 * Content model for the `/[lang]/men` page — a section-by-section clone of
 * nike.com/men. Imagery is served straight from Nike's public CDN (next.config
 * allows any HTTPS host and the components render plain <img>, so no domain
 * config is needed). Leaf links route into this app's `/products` page with a
 * search query so the clone stays clickable.
 *
 * Translatable chrome (section headings, nav, CTA verbs, promo/category labels,
 * footer column titles) is resolved from the `men` dictionary block at render
 * time via the keys below; campaign copy (hero titles/subtitles, editorial
 * eyebrows) keeps Nike's English wording, mirroring how the brand runs its
 * global campaigns.
 */

/* ------------------------------------------------- Dictionary accessor --- */

export interface MenDict {
  nav: Record<string, string>;
  cta: Record<string, string>;
  sections: Record<string, string>;
  promo: Record<string, string>;
  sport: Record<string, string>;
  category: Record<string, string>;
  footerNav: Record<string, string>;
  a11y: Record<string, string>;
}

/** Defensive read of the `men` dictionary block (mirrors hero/header pattern). */
export function menDict(dictionary: unknown): Partial<MenDict> {
  return (dictionary as { men?: Partial<MenDict> })?.men ?? {};
}

const CDN = "https://static.nike.com/a/images/f_auto,cs_srgb";
/** Art-directed CDN crop at a given width. */
const cdn = (id: string, w: number, ext: "jpg" | "png" = "jpg") =>
  `${CDN}/w_${w},c_limit/${id}/image.${ext}`;
/** Width-descriptor srcset so each card downloads a right-sized crop. */
const srcset = (id: string, widths: number[], ext: "jpg" | "png" = "jpg") =>
  widths.map((w) => `${cdn(id, w, ext)} ${w}w`).join(", ");
/** Round category-icon (Featured Footwear / Latest in Clothing rails). */
const icon = (id: string) =>
  `https://static.nike.com/a/images/w_144,c_limit/${id}/image.png`;

const products = (lang: Locale, query?: string) =>
  `/${lang}/products${query ? `?${query}` : ""}`;
/** A leaf link that searches the catalog for `term`. */
const q = (lang: Locale, term: string) =>
  products(lang, `search=${encodeURIComponent(term)}`);

/* ------------------------------------------------------------------ Hero -- */

export interface MenHeroSlide {
  id: string;
  title: string;
  subtitle: string;
  /** Generic verb resolved from the dictionary; `Mercurial` etc. appended. */
  ctaKey: "shop" | "shopAll";
  ctaSuffix?: string;
  /** Video slides on nike.com carry a secondary "Watch" button. */
  watch?: boolean;
  href: string;
  image: string;
  /** Larger landscape source for ≥640px. */
  imageWide: string;
}

export function buildMenHero(lang: Locale): MenHeroSlide[] {
  return [
    {
      id: "creature-comfort",
      title: "CREATURE COMFORT",
      subtitle: "Soft shoes for hard trails. Discover the ACG Zegama Trail.",
      ctaKey: "shop",
      watch: true,
      href: q(lang, "acg trail"),
      image: cdn("9dd26429-f776-401a-b25b-3b9fbdf3d84e", 1280),
      imageWide: cdn("9dd26429-f776-401a-b25b-3b9fbdf3d84e", 1920),
    },
    {
      id: "rip-the-script",
      title: "RIP THE SCRIPT",
      subtitle: "Instinct over everything.",
      ctaKey: "shop",
      watch: true,
      href: q(lang, "soccer"),
      image: cdn("fb89e62a-c202-4781-a310-a69bd407c7ba", 1280),
      imageWide: cdn("fb89e62a-c202-4781-a310-a69bd407c7ba", 1920),
    },
    {
      id: "break-em",
      title: "BREAK ’EM",
      subtitle:
        "Fast sprints with Superfly or quick cuts with Vapor? Choose your fast.",
      ctaKey: "shop",
      ctaSuffix: "Mercurial",
      href: q(lang, "mercurial"),
      image: cdn("33e555ec-657a-4f05-aa4e-f50b16d7bfb8", 1280),
      imageWide: cdn("33e555ec-657a-4f05-aa4e-f50b16d7bfb8", 1920),
    },
    {
      id: "nike-soccer-presents",
      title: "NIKE SOCCER PRESENTS",
      subtitle:
        "As the world’s game takes center stage, gear up in the latest kits from the National Team Collections.",
      ctaKey: "shopAll",
      href: q(lang, "soccer jerseys"),
      image: cdn("06e86250-eae1-436e-bdcb-07a9e93db779", 1280, "png"),
      imageWide: cdn("06e86250-eae1-436e-bdcb-07a9e93db779", 1920, "png"),
    },
  ];
}

/* --------------------------------------------------- Promo (3-up overlay) -- */

export interface PromoCard {
  id: string;
  /** Key into `men.promo` for the overlaid title. */
  titleKey: string;
  href: string;
  src: string;
  srcSet: string;
}

export function buildPromoCards(lang: Locale): PromoCard[] {
  const cards = [
    { id: "new-arrivals", titleKey: "newArrivals", term: "new", asset: "c29f61ae-0c0a-44fb-aee4-ed4d8c0285d7" },
    { id: "best-sellers", titleKey: "bestSellers", term: "best sellers", asset: "24aaae59-8ce0-4a10-bb70-f5e21fe5e0e5" },
    { id: "latest-drops", titleKey: "latestDrops", term: "latest", asset: "080f6eaa-65da-46fc-aa28-9b8f8c58e0fe" },
  ];
  return cards.map(({ id, titleKey, term, asset }) => ({
    id,
    titleKey,
    href: q(lang, term),
    src: cdn(asset, 600),
    srcSet: srcset(asset, [400, 600, 900]),
  }));
}

/* ----------------------------------------- Editorial duo (Trending / etc) -- */

export interface EditorialCard {
  id: string;
  eyebrow: string;
  title: string;
  href: string;
  src: string;
  srcSet: string;
}

/** "Trending Now" — two large square editorial cards. */
export function buildTrendingCards(lang: Locale): EditorialCard[] {
  return [
    {
      id: "seek-all-conditions",
      eyebrow: "All Conditions Gear",
      title: "Seek All Conditions",
      href: q(lang, "acg"),
      src: cdn("3a02a2ff-1b2e-43f2-b975-935a72ab5d9a", 800),
      srcSet: srcset("3a02a2ff-1b2e-43f2-b975-935a72ab5d9a", [600, 800, 1100]),
    },
    {
      id: "support-your-training",
      eyebrow: "Free Metcon 7",
      title: "Support Your Training",
      href: q(lang, "training"),
      src: cdn("40224225-c995-4bb4-bd90-05566df359f8", 800),
      srcSet: srcset("40224225-c995-4bb4-bd90-05566df359f8", [600, 800, 1100]),
    },
  ];
}

/** Second editorial duo — French Open / Summer Essentials. */
export function buildEditorialCards(lang: Locale): EditorialCard[] {
  return [
    {
      id: "ballet-on-clay",
      eyebrow: "French Open",
      title: "Ballet on Clay",
      href: q(lang, "tennis"),
      src: cdn("1ff94e90-7a16-49ca-90de-22aab03bd502", 800),
      srcSet: srcset("1ff94e90-7a16-49ca-90de-22aab03bd502", [600, 800, 1100]),
    },
    {
      id: "summer-essentials",
      eyebrow: "Nike Sportswear",
      title: "Summer Essentials",
      href: q(lang, "summer essentials"),
      src: cdn("43f2f80f-a6b0-4e3a-a81a-bd8a833f038e", 800),
      srcSet: srcset("43f2f80f-a6b0-4e3a-a81a-bd8a833f038e", [600, 800, 1100]),
    },
  ];
}

/* --------------------------------------------------------- Icon rails ----- */

export interface IconLink {
  label: string;
  href: string;
  icon: string;
}

/** "Featured Footwear" round-icon rail. */
export function buildFootwearIcons(lang: Locale): IconLink[] {
  return [
    { label: "All Shoes", href: q(lang, "shoes"), icon: icon("9d3d3004-0a52-42c1-a9a5-c03f00adabe7") },
    { label: "Basketball", href: q(lang, "basketball"), icon: icon("89b12da5-3183-4103-8ae9-143178cec855") },
    { label: "Jordan", href: q(lang, "jordan"), icon: icon("dd078040-f313-42a1-95ad-f85d00770d02") },
    { label: "Lifestyle", href: q(lang, "lifestyle"), icon: icon("7c9aab4b-cc65-4eb5-ad87-7f7b6a41e23e") },
    { label: "Running", href: q(lang, "running"), icon: icon("f17264ea-e555-48b2-bdf5-7af060f97346") },
    { label: "Soccer", href: q(lang, "soccer"), icon: icon("038656db-3f50-4cdc-972c-1e73a66f1567") },
    { label: "ACG", href: q(lang, "acg"), icon: icon("0794a551-5d89-44f1-bbdf-0cacc8d897b6") },
    { label: "Custom Shoes", href: q(lang, "custom"), icon: icon("ee12b017-b488-40a8-a510-ffbaa1c97a00") },
  ];
}

/** "Latest in Clothing" round-icon rail. */
export function buildClothingIcons(lang: Locale): IconLink[] {
  return [
    { label: "All Clothing", href: q(lang, "clothing"), icon: icon("6ac8e770-faf6-4cb7-bdee-88831514cfa5") },
    { label: "Hoodies & Sweatshirts", href: q(lang, "hoodies"), icon: icon("32f81668-f255-45ff-8c28-da6a4a11bade") },
    { label: "Jackets & Vests", href: q(lang, "jackets"), icon: icon("7975a172-7036-46a9-857c-8985a1e36dcb") },
    { label: "ACG", href: q(lang, "acg clothing"), icon: icon("5aa267b2-409b-421d-bc5f-e0f035a1b074") },
    { label: "Pants", href: q(lang, "pants"), icon: icon("4935136a-59df-4502-9e4f-887b5f5ce58b") },
    { label: "Shorts", href: q(lang, "shorts"), icon: icon("007b0190-f6d7-4af3-8353-3d993c2f6559") },
    { label: "Tops & Graphic Tees", href: q(lang, "tops"), icon: icon("ba9f9c2c-9a7b-417c-a302-a83966a880ca") },
    { label: "Tall Sizes", href: q(lang, "tall"), icon: icon("b918a7f2-0893-4a32-9969-874f0cd23a38") },
  ];
}

/* -------------------------------------------------------- Shop by Sport --- */

export interface SportCard {
  id: string;
  /** Key into `men.sport` for the localized sport name (pill: "Shop {name}"). */
  nameKey: string;
  href: string;
  src: string;
  srcSet: string;
}

export function buildSportCards(lang: Locale): SportCard[] {
  const cards = [
    { id: "soccer", nameKey: "soccer", term: "soccer", asset: "a12f1a07-7747-4c86-8c3f-75896f86cb93" },
    { id: "basketball", nameKey: "basketball", term: "basketball", asset: "7e92fb82-7d26-4211-ba75-b7aeb7bf8024" },
    { id: "running", nameKey: "running", term: "running", asset: "ff18a690-35a6-44de-a7af-0e25f2437691" },
    { id: "baseball", nameKey: "baseball", term: "baseball", asset: "aaa50d17-5de7-4cda-ae21-23c6fe3abe13" },
    { id: "golf", nameKey: "golf", term: "golf", asset: "b7adb43d-f6ce-441c-9d90-9ffb64b6db98" },
    { id: "swim", nameKey: "swim", term: "swim", asset: "9092bf9a-0748-4257-88b9-eaa36ddab1ef" },
    { id: "training", nameKey: "training", term: "training", asset: "e7e9b5d6-6a9a-476e-8e4f-c4181b521891" },
  ];
  return cards.map(({ id, nameKey, term, asset }) => ({
    id,
    nameKey,
    href: q(lang, term),
    src: cdn(asset, 600),
    srcSet: srcset(asset, [400, 600, 800]),
  }));
}

/* ----------------------------------------------------- Shop by Category --- */

export interface CategoryTile {
  id: string;
  /** Key into `men.category` for the pill label. */
  labelKey: string;
  href: string;
  src: string;
  srcSet: string;
  /** Tall tile spans both rows of the right-hand stack. */
  tall?: boolean;
}

export function buildCategoryTiles(lang: Locale): CategoryTile[] {
  return [
    {
      id: "clothing",
      labelKey: "clothing",
      href: q(lang, "clothing"),
      src: cdn("474b9b2e-fc86-432e-92af-6b93c39767dc", 800),
      srcSet: srcset("474b9b2e-fc86-432e-92af-6b93c39767dc", [600, 800, 1100]),
      tall: true,
    },
    {
      id: "shoes",
      labelKey: "shoes",
      href: q(lang, "shoes"),
      src: cdn("e6703c70-a23d-4876-b6eb-36696ef88d4f", 800),
      srcSet: srcset("e6703c70-a23d-4876-b6eb-36696ef88d4f", [600, 800, 1100]),
    },
    {
      id: "accessories",
      labelKey: "accessories",
      href: q(lang, "accessories"),
      src: cdn("6095e4a8-7c9b-4393-9b27-f3fc2b57e11f", 800),
      srcSet: srcset("6095e4a8-7c9b-4393-9b27-f3fc2b57e11f", [600, 800, 1100]),
    },
  ];
}

/* ------------------------------------------ Sticky secondary category nav -- */

export interface CategoryNavItem {
  /** Key into `men.nav` for the label. */
  key: string;
  href: string;
  columns?: NavColumn[];
}

const navCol = (title: string, href: string, labels: Array<[string, string]>): NavColumn => ({
  title,
  href,
  links: labels.map(([label, h]) => ({ label, href: h })),
});

export function buildCategoryNav(lang: Locale): CategoryNavItem[] {
  return [
    { key: "shopAll", href: products(lang, "gender=men") },
    {
      key: "shoes",
      href: q(lang, "shoes"),
      columns: [
        navCol("Featured", q(lang, "shoes"), [
          ["All Shoes", q(lang, "shoes")],
          ["New Releases", q(lang, "new")],
          ["Best Sellers", q(lang, "best sellers")],
          ["Custom Shoes", q(lang, "custom")],
        ]),
        navCol("Shop by Sport", q(lang, "shoes"), [
          ["Basketball", q(lang, "basketball")],
          ["Running", q(lang, "running")],
          ["Soccer", q(lang, "soccer")],
          ["Training & Gym", q(lang, "training")],
          ["Golf", q(lang, "golf")],
        ]),
        navCol("Shop by Brand", q(lang, "shoes"), [
          ["Jordan", q(lang, "jordan")],
          ["Lifestyle", q(lang, "lifestyle")],
          ["ACG", q(lang, "acg")],
          ["Sandals & Slides", q(lang, "sandals")],
        ]),
      ],
    },
    {
      key: "clothing",
      href: q(lang, "clothing"),
      columns: [
        navCol("Featured", q(lang, "clothing"), [
          ["All Clothing", q(lang, "clothing")],
          ["New Releases", q(lang, "new")],
          ["Best Sellers", q(lang, "best sellers")],
        ]),
        navCol("Tops", q(lang, "tops"), [
          ["Tops & Graphic Tees", q(lang, "tops")],
          ["Hoodies & Sweatshirts", q(lang, "hoodies")],
          ["Jackets & Vests", q(lang, "jackets")],
        ]),
        navCol("Bottoms", q(lang, "pants"), [
          ["Pants", q(lang, "pants")],
          ["Shorts", q(lang, "shorts")],
          ["Swim", q(lang, "swim")],
        ]),
      ],
    },
    {
      key: "accessories",
      href: q(lang, "accessories"),
      columns: [
        navCol("Accessories", q(lang, "accessories"), [
          ["All Accessories", q(lang, "accessories")],
          ["Bags & Backpacks", q(lang, "bags")],
          ["Hats & Headwear", q(lang, "hats")],
          ["Socks", q(lang, "socks")],
          ["Sunglasses", q(lang, "sunglasses")],
        ]),
      ],
    },
  ];
}

/* --------------------------------------------------- Footer SEO mega-nav -- */

export interface FooterNavColumn {
  /** Key into `men.footerNav` for the column title. */
  titleKey: string;
  links: IconLink[] | { label: string; href: string }[];
}

export function buildFooterNav(lang: Locale): FooterNavColumn[] {
  return [
    {
      titleKey: "mensShoes",
      links: [
        { label: "Running", href: q(lang, "running") },
        { label: "Basketball", href: q(lang, "basketball") },
        { label: "Golf", href: q(lang, "golf") },
        { label: "Tennis Shoes", href: q(lang, "tennis") },
      ],
    },
    {
      titleKey: "mensClothing",
      links: [
        { label: "Tops & T-Shirts", href: q(lang, "tops") },
        { label: "Jackets", href: q(lang, "jackets") },
        { label: "Hoodies", href: q(lang, "hoodies") },
        { label: "Pants", href: q(lang, "pants") },
      ],
    },
    {
      titleKey: "mensGear",
      links: [
        { label: "All Men's Gear", href: q(lang, "accessories") },
        { label: "Socks", href: q(lang, "socks") },
        { label: "Bags & Backpacks", href: q(lang, "bags") },
        { label: "Balls", href: q(lang, "balls") },
      ],
    },
    {
      titleKey: "featured",
      links: [
        { label: "New Releases", href: q(lang, "new") },
        { label: "Sale", href: q(lang, "sale") },
        { label: "NFL", href: q(lang, "nfl") },
        { label: "Men's Essentials", href: q(lang, "essentials") },
      ],
    },
  ];
}
