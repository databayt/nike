import { wallHref } from "@/lib/walls";
import type { Locale } from "@/components/internationalization/config";

/**
 * nike.com homepage, section by section (US storefront, captured 2026-10-14).
 *
 * nike.com builds its homepage from a small vocabulary of CMS blocks stacked
 * in a single column — full-bleed / contained banners, a gradient band + brand
 * logo lockup, 3-up image cards, a product rail, a 2-up split, a centered text
 * block and the "Trending" icon grid. This file is that stack as data, so the
 * renderer in `index.tsx` stays a dumb mapper and a campaign swap is a data
 * edit. Every image id, crop, copy line and spacing value was read from the
 * live DOM at 375 and 1440 — see `.clone/nike-us-home/` for the snapshot.
 *
 * Campaign copy stays in Nike's English (as the brand runs it globally); CTA
 * verbs and controls resolve from the `home` dictionary block.
 */

/* ------------------------------------------------------------- CDN --- */

const CDN = "https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb";

export type Ext = "jpg" | "png";

/** An art-directed Nike CDN crop: asset id + its native aspect at render size. */
export interface Img {
  id: string;
  /** Rendered width ÷ height on nike.com — keeps the box stable before load. */
  ratio: number;
  ext?: Ext;
}

/** Width-limited CDN URL for an asset. */
export const cdn = (img: Img, w: number) =>
  `${CDN}/w_${w},c_limit/${img.id}/nike-just-do-it.${img.ext ?? "jpg"}`;

/** Width-descriptor srcset so each slot downloads a right-sized crop. */
export const srcSet = (img: Img, widths: number[]) =>
  widths.map((w) => `${cdn(img, w)} ${w}w`).join(", ");

/* ----------------------------------------------------------- Model --- */

/** Top margin as [mobile, desktop] px — nike's block spacing is per-slot. */
export type Space = readonly [number, number];

export interface Cta {
  label: string;
  href: string;
  /** Renders the play-icon "Watch" button that opens the campaign film. */
  watch?: boolean;
}

/** Adaptive-bitrate campaign film (nike serves HLS only). */
export interface Video {
  hls: string;
  /** Rendered width ÷ height at [mobile, desktop]. */
  ratio: readonly [number, number];
}

export interface BannerSection {
  kind: "banner";
  id: string;
  space: Space;
  href: string;
  alt: string;
  /** Full-bleed (true) or inset to the 24/48px page gutter (false), [mobile, desktop]. */
  bleed: readonly [boolean, boolean];
  image?: { mobile: Img; desktop: Img };
  video?: Video;
  /** Vertical athlete credit pinned to the top-end corner. */
  credit?: string;
  eyebrow?: string;
  title?: string;
  /** `display` = Futura condensed headline; `heading` = 24px Helvetica Display. */
  titleStyle?: "display" | "display-sm" | "heading";
  body?: string;
  ctas: Cta[];
  /** Copy sits centered below the media instead of overlaid (the "Last Word" film). */
  copyBelow?: boolean;
}

export interface Card {
  image: Img;
  href: string;
  label?: string;
  credit?: string;
  alt?: string;
}

export interface CardsSection {
  kind: "cards";
  id: string;
  space: Space;
  /** Card height at [mobile, desktop]; widths are 300 (scroll) and ⅓ of the row. */
  height: readonly [number, number];
  cards: Card[];
}

export interface RailSection {
  kind: "rail";
  id: string;
  space: Space;
  cards: Card[];
}

export interface SplitSection {
  kind: "split";
  id: string;
  space: Space;
  cards: (Card & { cta: string })[];
}

export interface LogoSection {
  kind: "logo";
  id: string;
  space: Space;
  href: string;
  alt: string;
  /** Soft grey→white gradient band nike drops above a campaign's logo lockup. */
  band?: boolean;
  logo: { mobile: Img; desktop: Img };
}

export interface TextSection {
  kind: "text";
  id: string;
  space: Space;
  href: string;
  title: string;
  body: string;
  ctas: Cta[];
}

export interface IconItem {
  id: string;
  label: string;
  href: string;
  /** Position in the 3-column mobile grid (nike re-orders it per breakpoint). */
  mobileOrder: number;
}

export interface IconsSection {
  kind: "icons";
  id: string;
  space: Space;
  items: IconItem[];
}

export type HomeSection =
  | BannerSection
  | CardsSection
  | RailSection
  | SplitSection
  | LogoSection
  | TextSection
  | IconsSection;

/* ------------------------------------------------------------ Data --- */

const BAND: { mobile: Img; desktop: Img } = {
  mobile: { id: "e0c4b82b-402e-4b9b-aa47-297e1e48ecc4", ratio: 375 / 132 },
  desktop: { id: "1ba62614-17e1-463d-985e-d21a6ecba398", ratio: 1440 / 210 },
};
export const GRADIENT_BAND = BAND;

const png = (id: string, ratio: number): Img => ({ id, ratio, ext: "png" });
const jpg = (id: string, ratio: number): Img => ({ id, ratio });

/** Campaign terms that have a real nike wall; the rest fall back to search. */
const TERM_WALLS: Record<string, string> = {
  nfl: "nfl-9bklc",
  mlb: "mlb-b0g9x",
  caitlin: "caitlin-clark-b0s81",
  "aja wilson": "aja-wilson-4yj6f",
  nikeskims: "nikeskims-b2asd",
  pegasus: "pegasus-shoes-8nexhzy7ok",
  training: "hybrid-training-8wvhh",
  mercurial: "mercurial-soccer-shoes-1gdj0z4f1bzy7ok",
  phantom: "phantom-soccer-shoes-1gdj0z1msyxzy7ok",
  tiempo: "tiempo-soccer-shoes-1gdj0z20w7kzy7ok",
};

export function buildHomeSections(lang: Locale): HomeSection[] {
  const q = (term: string) =>
    TERM_WALLS[term] ? wallHref(lang, TERM_WALLS[term]) : `/${lang}/products?search=${encodeURIComponent(term)}`;
  const men = `/${lang}/men`;
  const women = `/${lang}/products?gender=women`;

  return [
    {
      kind: "banner",
      id: "fully-invested",
      space: [8, 16],
      href: q("nfl"),
      alt: "FULLY INVESTED",
      bleed: [true, true],
      image: {
        mobile: jpg("f16dbd6d-5487-4e71-85cf-4743b4003247", 375 / 562),
        desktop: jpg("9122c246-4980-46bd-b9c5-c9fc4ba643be", 1440 / 700),
      },
      credit: "Jayden Reed, Wide Receiver",
      title: "FULLY INVESTED",
      titleStyle: "display",
      body: "Owned by the people, driven by Packers pride. Suit up and gild your win.",
      ctas: [{ label: "Shop NFL", href: q("nfl") }],
    },
    {
      kind: "cards",
      id: "nfl-cards",
      space: [0, 16],
      height: [402, 590],
      cards: [
        { image: jpg("9ab79089-2948-4c5d-9df0-9667af16407a", 440 / 590), label: "Shop Men’s", href: men },
        { image: jpg("f4a094b7-5713-4563-bc09-3c1ea30c493e", 440 / 590), label: "Shop Women’s", href: women },
        { image: jpg("dc7d35b0-e676-4d12-92c4-35b133f73a4f", 440 / 590), label: "Shop Lifestyle", href: q("lifestyle") },
      ],
    },
    {
      kind: "logo",
      id: "caitlin-logo",
      space: [8, 0],
      href: q("caitlin"),
      alt: "Caitlin Clark",
      band: true,
      logo: {
        mobile: png("8c02388c-1010-4583-8d65-9ee0af74dda6", 327 / 65),
        desktop: png("74e4a026-e2ba-4aa6-a647-b49e353700be", 1344 / 115),
      },
    },
    {
      kind: "banner",
      id: "caitlin-1",
      space: [7, 16],
      href: q("caitlin"),
      alt: "CAITLIN 1 'MIDNIGHT FEVER'",
      bleed: [true, true],
      image: {
        mobile: jpg("8ac6e688-5430-441f-b219-d79c1d854270", 375 / 562),
        desktop: jpg("f6330446-a176-4551-abab-e48490645bc9", 1440 / 700),
      },
      title: "CAITLIN 1\n‘MIDNIGHT FEVER’",
      titleStyle: "display",
      body: "It's no slip. all go in the Caitlin 1.",
      ctas: [{ label: "Shop", href: q("caitlin") }],
    },
    {
      kind: "rail",
      id: "caitlin-rail",
      space: [8, 48],
      cards: [
        "b1692842-0bf7-46d1-9bb4-554a6082fa9f",
        "d0adb9c0-44c7-49a6-9120-8d1653a9ba2b",
        "dc69ca01-e656-4497-87d7-fd833526091d",
        "d6a867e1-3222-48a5-8fbf-4ba9233081cc",
        "521b0445-f563-4687-92fa-6f69a99895e4",
        "481a5624-74a1-4b8a-ac47-e09d85662695",
      ].map((id) => ({ image: jpg(id, 1), href: q("caitlin"), alt: "Caitlin Clark collection" })),
    },
    {
      kind: "logo",
      id: "training-logo",
      space: [84, 120],
      href: q("training"),
      alt: "Nike Training",
      logo: {
        mobile: png("83488957-ff11-4399-817c-c0d92292e763", 327 / 33),
        desktop: png("55e9e668-fda2-4f2c-b734-01e6e6f09122", 1356 / 47),
      },
    },
    {
      kind: "banner",
      id: "hybrid-rn",
      space: [48, 48],
      href: q("training"),
      alt: "Train Everything, Nike Hybrid RN",
      bleed: [true, false],
      image: {
        mobile: jpg("0382a10a-888e-455e-a45c-4e0e2594d1f6", 375 / 521),
        desktop: jpg("21a1e26a-93e0-4609-aa3b-fa72259ce075", 1344 / 700),
      },
      eyebrow: "Nike Hybrid RN",
      title: "Train Everything",
      titleStyle: "heading",
      ctas: [{ label: "Explore Hybrid", href: q("training") }],
    },
    {
      kind: "split",
      id: "hybrid-split",
      space: [48, 16],
      cards: [
        { image: jpg("745ba2c6-88b5-49d7-a712-e7ee7c0e03e2", 666 / 903), cta: "Shop Men's", href: men },
        { image: jpg("e69ac655-b05b-4142-b161-bb8885cb56dc", 666 / 903), cta: "Shop Women's", href: women },
      ],
    },
    {
      kind: "logo",
      id: "mlb-logo",
      space: [84, 120],
      href: q("mlb"),
      alt: "Nike MLB",
      logo: {
        mobile: png("206b821f-2dce-4755-b887-923051db5160", 327 / 38),
        desktop: png("2a484b18-736d-4243-b4b0-5c2144388583", 1344 / 61),
      },
    },
    {
      kind: "banner",
      id: "crown-the-season",
      space: [48, 47],
      href: q("mlb"),
      alt: "CROWN THE SEASON",
      bleed: [false, false],
      image: {
        mobile: jpg("d137460d-7ab2-4a49-97c5-9e9e071cf5cf", 327 / 447),
        desktop: jpg("ebd94668-e853-4480-bf3b-0e32161e110c", 1344 / 700),
      },
      credit: "Brice Turang, Second Baseman",
      title: "CROWN THE\nSEASON",
      titleStyle: "display",
      body: "Coast to coast, the pursuit of October glory begins now.",
      ctas: [{ label: "Shop MLB", href: q("mlb") }],
    },
    {
      kind: "cards",
      id: "mlb-cards",
      space: [8, 16],
      height: [402, 590],
      cards: [
        { image: jpg("a3b43e02-0ee4-4d82-befe-fa06c22afacc", 440 / 590), label: "Shop Jerseys", href: q("jersey") },
        {
          image: jpg("0d3973d7-f9c6-4022-b7c1-04e5194d9aac", 440 / 590),
          label: "Shop Lifestyle",
          href: q("lifestyle"),
          credit: "Christian Yelich, Left Fielder",
        },
        {
          image: jpg("8ccce774-889f-4c14-af25-d3b0b59743b8", 440 / 590),
          label: "Shop Baseball",
          href: q("baseball"),
          credit: "Christian Yelich, Left Fielder",
        },
      ],
    },
    {
      kind: "logo",
      id: "aja-logo",
      space: [8, 0],
      href: q("aja wilson"),
      alt: "A'ja Wilson",
      band: true,
      logo: {
        mobile: png("04868dc4-02c4-471c-8bb6-7c4b3328e420", 327 / 34),
        desktop: png("c3d07d13-75cc-4303-ad3c-ea5d22dfcfea", 1344 / 63),
      },
    },
    {
      kind: "banner",
      id: "last-word",
      space: [8, 16],
      href: q("aja wilson"),
      alt: "Last Word",
      bleed: [true, true],
      video: {
        hls: "https://api.nike.com/content/asset_video_manifest/v1/8d407abf-d96c-4aae-bbd6-2a5503b83307",
        ratio: [375 / 667, 16 / 9],
      },
      title: "LAST WORD",
      titleStyle: "display",
      body: "Five MVPs later, A’ja Wilson is still giving everybody something to talk about.\nCongratulations on No. 5.",
      ctas: [
        { label: "Shop", href: q("aja wilson") },
        { label: "Watch", href: q("aja wilson"), watch: true },
      ],
      copyBelow: true,
    },
    {
      kind: "logo",
      id: "skims-logo",
      space: [0, 0],
      href: q("nikeskims"),
      alt: "NikeSKIMS",
      band: true,
      logo: {
        mobile: jpg("7a06f806-e477-421a-9d00-341be00af545", 327 / 76),
        desktop: jpg("02d50248-94f6-4a80-afb9-6914e9c78be0", 1344 / 117),
      },
    },
    {
      kind: "cards",
      id: "skims-cards",
      space: [0, 16],
      height: [391, 540],
      cards: [
        {
          image: jpg("a32192d4-bb2f-4042-8d7f-f208d7b73658", 440 / 540),
          href: q("nikeskims"),
          credit: "Anna Cockrell, Olympic Medalist, Track & Field",
        },
        { image: jpg("8f502087-7040-4bda-8899-21fbffe8d0d9", 440 / 540), href: q("nikeskims") },
        {
          image: jpg("2d30edcf-e176-4461-a94f-d61effdaaa66", 440 / 540),
          href: q("nikeskims"),
          credit: "Jutta Leerdam, 3x Olympic Medalist, Speed Skating",
        },
      ],
    },
    {
      kind: "text",
      id: "body-obsessed",
      space: [8, 48],
      href: q("nikeskims"),
      title: "BODY OBSESSED",
      body: "Unapologetically feminine. Undeniably strong. Never compromise between performance and style in a collection designed to flatter as well as it functions.",
      ctas: [{ label: "Shop NikeSKIMS", href: q("nikeskims") }],
    },
    {
      kind: "logo",
      id: "pegasus-logo",
      space: [8, 0],
      href: q("pegasus"),
      alt: "Run Pegasus",
      band: true,
      logo: {
        mobile: png("8ad6e459-9510-4ee5-ab72-097a290903b4", 327 / 38),
        desktop: png("c4d95d1a-d852-4a76-940f-07ae2adf8ef0", 1344 / 61),
      },
    },
    {
      kind: "banner",
      id: "every-day-speed",
      space: [48, 48],
      href: q("pegasus"),
      alt: "EVERY. DAY. SPEED.",
      bleed: [false, false],
      video: {
        hls: "https://api.nike.com/content/asset_video_manifest/v1/fbe650df-0a23-47aa-b265-49da72b592fa",
        ratio: [327 / 490, 1344 / 653],
      },
      title: "EVERY. DAY. SPEED.",
      titleStyle: "display-sm",
      body: "You can’t be fast on Sunday if you don’t train fast on Tuesday. Pegasus Plus 2 is available now.",
      ctas: [
        { label: "Shop", href: q("pegasus") },
        { label: "Watch", href: q("pegasus"), watch: true },
      ],
    },
    {
      kind: "text",
      id: "bright-lights",
      space: [84, 120],
      href: q("soccer"),
      title: "BRIGHT LIGHTS PACK",
      body: "Speed, Precision, Touch",
      ctas: [{ label: "Shop", href: q("soccer") }],
    },
    {
      kind: "cards",
      id: "bright-lights-cards",
      space: [8, 48],
      height: [391, 573],
      cards: [
        { image: jpg("0a36da71-2cd3-46fd-b22c-a221102f56a8", 440 / 573), label: "Mercurial", href: q("mercurial") },
        { image: jpg("b4b127d5-f69f-461c-b2f3-1172f83720ec", 440 / 573), label: "Phantom", href: q("phantom") },
        { image: jpg("56b99017-426a-49e7-a0b9-981fc5f59c6e", 440 / 573), label: "Tiempo", href: q("tiempo") },
      ],
    },
    {
      kind: "text",
      id: "trending",
      space: [83, 120],
      href: q(""),
      title: "TRENDING",
      body: "Classic silhouettes and cutting-edge innovation to build your game from the ground up.",
      ctas: [],
    },
    {
      kind: "icons",
      id: "trending-icons",
      space: [8, 1],
      items: (
        [
          ["6d5d5d6a-bb79-4e8b-b851-88de8ad4e5ef", "Air Jordan 1", "air jordan 1", 0],
          ["3ebaa465-a1a9-422c-a05d-f5f04420e4a7", "Air Max", "air max", 4],
          ["e2f13889-9463-4259-949a-0e38c0d6e270", "Graphic Tees", "t-shirt", 3],
          ["0411a9f3-9026-4550-aaaf-fc9d26e19484", "Dunk", "dunk", 1],
          ["6e26ae86-988e-4079-a7ec-3635358c3f8a", "Air Force 1", "air force 1", 2],
          ["067ab57d-1513-4c4e-83f3-ab118e727ac4", "24.7 Collection", "24.7", 7],
          ["2f2d3ff4-71c0-4ef7-9fb5-c5a0415bb290", "Vomero 5", "vomero", 8],
          ["19e8626b-698a-4b62-b35d-5db87adf5feb", "Sweats & Sweatshirts", "sweatshirt", 9],
          ["934b0c26-4518-402d-8854-16251760e689", "ACG", "acg", 10],
          ["cd14ec0c-fb89-4324-b284-94b1c7210691", "Pegasus", "pegasus", 11],
          ["f5c4f40e-83a4-4e9d-b046-e8d84b837709", "Vomero Plus", "vomero", 12],
          ["45501f6c-2a10-40ab-a917-0e146b393d98", "Metcon", "metcon", 13],
          ["b6a1bc56-8e8d-4325-a4c5-d3e7a857b58e", "Fan Gear", "jersey", 14],
          ["30d92425-1e5e-49bc-9e36-8a1e22d0a5cb", "Jordan Retro", "jordan", 5],
          ["7970107f-98ab-4ebe-8714-d63eb1dba1cd", "Ja 4", "ja", 6],
          ["4401ceeb-729a-43d9-9e86-0a0e69110468", "Air Jordan 41", "air jordan", 15],
        ] as const
      ).map(([id, label, term, mobileOrder]) => ({ id, label, href: q(term), mobileOrder })),
    },
  ];
}

/* ------------------------------------------------- Sitemap (pre-footer) --- */

/** The swoosh + quick links + 4-column sitemap nike runs above the global footer. */
export const SITEMAP_SWOOSH: { mobile: Img; desktop: Img } = {
  mobile: png("82524845-2637-4b3c-a7cb-67a416108197", 327 / 24),
  desktop: png("f8aaccc0-9f42-4956-9b6b-3112596a9d01", 1344 / 28),
};

export interface SitemapColumn {
  title: string;
  links: { label: string; href: string }[];
}

export function buildSitemap(lang: Locale): SitemapColumn[] {
  const q = (term: string) => `/${lang}/products?search=${encodeURIComponent(term)}`;
  const col = (title: string, labels: string[]): SitemapColumn => ({
    title,
    links: labels.map((label) => ({ label, href: q(label.replace(/ Shoes$/, "")) })),
  });

  return [
    col("Featured", ["Air Force 1", "Jordan 1", "Air Max 90", "Air Max 95", "Vomero", "Metcon", "Pegasus", "Rejuven8"]),
    col("Shoes", [
      "All Shoes",
      "Jordan Shoes",
      "Running Shoes",
      "Basketball Shoes",
      "Tennis Shoes",
      "Training Shoes",
      "Custom Shoes",
      "Sale Shoes",
      "Soccer Cleats",
    ]),
    col("Clothing", [
      "All Clothing",
      "Tops & T-Shirts",
      "Shorts",
      "Hoodies & Pullovers",
      "Joggers & Sweatpants",
      "Sports Bras",
      "Pants & Tights",
      "Socks",
      "Yoga",
      "NikeLab",
      "Plus Size",
      "Big & Tall",
      "Sale Clothing",
    ]),
    col("Kids", [
      "Infant & Toddler Shoes",
      "Kids Shoes",
      "Kids Basketball Shoes",
      "Kids Running Shoes",
      "Kids Jordan Shoes",
      "Kids Clothing",
      "Kids Backpacks",
      "Kids Socks",
      "Kids Sale",
    ]),
  ];
}
