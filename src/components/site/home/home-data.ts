import type { Locale } from "@/components/internationalization/config";

/**
 * Content model for the homepage's editorial sections — a section-by-section
 * clone of nike.com. Imagery is served straight from Nike's public CDN
 * (next.config allows any HTTPS host and these sections render plain <img>, so
 * no domain config is needed); every asset id below is verified to resolve.
 *
 * Following the same split as `men-data.ts`: translatable chrome (section
 * headings, CTA verbs, pill labels) resolves from the `home` dictionary block at
 * render time, while campaign copy (editorial eyebrows/titles, the spotlight
 * headline) keeps Nike's English wording — mirroring how the brand runs its
 * global campaigns.
 */

/* ------------------------------------------------- Dictionary accessor --- */

export interface HomeDict {
  sections: Record<string, string>;
  cta: Record<string, string>;
  essentials: Record<string, string>;
  chooseTeam: Record<string, string>;
  a11y: Record<string, string>;
}

/** Defensive read of the `home` dictionary block (mirrors the men/hero pattern). */
export function homeDict(dictionary: unknown): Partial<HomeDict> {
  return (dictionary as { home?: Partial<HomeDict> })?.home ?? {};
}

/* --------------------------------------------------------- CDN helpers --- */

const CDN = "https://static.nike.com/a/images/f_auto,cs_srgb";
/** Art-directed CDN crop at a given width. */
const cdn = (id: string, w: number) => `${CDN}/w_${w},c_limit/${id}/image.jpg`;
/** Width-descriptor srcset so each card downloads a right-sized crop. */
const srcset = (id: string, widths: number[]) =>
  widths.map((w) => `${cdn(id, w)} ${w}w`).join(", ");

const products = (lang: Locale, query?: string) =>
  `/${lang}/products${query ? `?${query}` : ""}`;
/** A leaf link that searches the catalog for `term`. */
const q = (lang: Locale, term: string) =>
  products(lang, `search=${encodeURIComponent(term)}`);

/* ----------------------------------------- Trending Now (2-up editorial) -- */

export interface EditorialCard {
  id: string;
  /** Campaign copy — English, mirroring Nike's global campaigns. */
  eyebrow: string;
  title: string;
  href: string;
  src: string;
  srcSet: string;
}

/** "Trending Now" — two large square editorial cards under the filmstrip. */
export function buildHomeTrending(lang: Locale): EditorialCard[] {
  return [
    {
      id: "seek-all-conditions",
      eyebrow: "Nike ACG",
      title: "Seek All Conditions",
      href: q(lang, "acg"),
      src: cdn("3a02a2ff-1b2e-43f2-b975-935a72ab5d9a", 800),
      srcSet: srcset("3a02a2ff-1b2e-43f2-b975-935a72ab5d9a", [600, 800, 1100]),
    },
    {
      id: "ballet-on-clay",
      eyebrow: "French Open",
      title: "Ballet on Clay",
      href: q(lang, "tennis"),
      src: cdn("1ff94e90-7a16-49ca-90de-22aab03bd502", 800),
      srcSet: srcset("1ff94e90-7a16-49ca-90de-22aab03bd502", [600, 800, 1100]),
    },
  ];
}

/* ----------------------------------------- Spotlight (full-bleed marquee) -- */

export interface MarqueeSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Verb resolved from the dictionary; the English suffix is appended after. */
  ctaSuffix: string;
  href: string;
  /** Portrait-friendly source for mobile. */
  image: string;
  /** Landscape source for ≥640px. */
  imageWide: string;
}

/** The full-bleed "Don't Miss" spotlight band between Trending and Best Sellers. */
export function buildHomeMarquee(lang: Locale): MarqueeSlide {
  const asset = "33e555ec-657a-4f05-aa4e-f50b16d7bfb8";
  return {
    id: "mercurial-spotlight",
    eyebrow: "Nike Football",
    title: "ENGINEERED FOR SPEED",
    subtitle:
      "Lightweight Mercurial built for explosive pace and a precise, locked-in touch.",
    ctaSuffix: "Mercurial",
    href: q(lang, "mercurial"),
    image: cdn(asset, 1280),
    imageWide: cdn(asset, 1920),
  };
}

/* ------------------------------------------------ The Essentials (pills) -- */

export interface EssentialLink {
  /** Key into `home.essentials` for the localized label. */
  labelKey: string;
  href: string;
}

/** "The Essentials" pill rail near the footer — Nike's signature SEO shortcut. */
export function buildEssentials(lang: Locale): EssentialLink[] {
  return [
    { labelKey: "mensShoes", href: q(lang, "men shoes") },
    { labelKey: "womensShoes", href: q(lang, "women shoes") },
    { labelKey: "mensClothing", href: q(lang, "men clothing") },
    { labelKey: "womensClothing", href: q(lang, "women clothing") },
    { labelKey: "kidsShoes", href: q(lang, "kids shoes") },
    { labelKey: "airForce1", href: q(lang, "air force 1") },
    { labelKey: "jordan", href: q(lang, "jordan") },
    { labelKey: "running", href: q(lang, "running") },
    { labelKey: "basketball", href: q(lang, "basketball") },
    { labelKey: "sportswear", href: q(lang, "sportswear") },
  ];
}

/* ------------------------------------------ Choose Your Team (crest grid) -- */

export interface TeamCrest {
  id: string;
  /** Localised display name (Nike shows Arabic federation/club names in RTL). */
  name: string;
  href: string;
  /** Crest PNG from Nike's CDN, requested at 144px for a crisp 72px @2x render. */
  crest: string;
}

/** Crest asset on Nike's CDN — PNG with transparency, unlike the .jpg cards. */
const crestUrl = (id: string) =>
  `https://static.nike.com/a/images/w_144,c_limit/${id}/image.png`;

/**
 * "Choose Your Team" — the football federation/club crest grid that sits below
 * Trending Now on nike.com's homepage. Eight crests per row at ≥640px (four on
 * mobile); the first 16 show, "See All" reveals the remaining clubs. Names are
 * localised; each crest links into the catalog for that team's kit.
 */
export function buildChooseYourTeam(lang: Locale): TeamCrest[] {
  const ar = lang === "ar";
  const teams: Array<{ id: string; en: string; ar: string; asset: string; term: string }> = [
    { id: "france",      en: "France",              ar: "فرنسا",            asset: "330c2dd6-14ca-4620-b513-af1c73ac8d5f", term: "france" },
    { id: "england",     en: "England",             ar: "إنجلترا",          asset: "f2478e69-4885-403d-ac4b-85356ab21792", term: "england" },
    { id: "netherlands", en: "Netherlands",         ar: "هولندا",           asset: "4877d74e-5ae0-4e8b-ad41-8d07ed6b5b05", term: "netherlands" },
    { id: "brazil",      en: "Brazil",              ar: "البرازيل",         asset: "d9b5684b-6665-4211-b9f1-1296f567cc75", term: "brazil" },
    { id: "norway",      en: "Norway",              ar: "النرويج",          asset: "1c98faa8-d813-49b0-9a7c-6fc5d5c2171f", term: "norway" },
    { id: "nigeria",     en: "Nigeria",             ar: "نيجيريا",          asset: "2dd927bc-10ef-464f-a1fe-3329141910ff", term: "nigeria" },
    { id: "croatia",     en: "Croatia",             ar: "كرواتيا",          asset: "236ddbe3-f332-4e37-abc6-a4ae547c9fe3", term: "croatia" },
    { id: "canada",      en: "Canada",              ar: "كندا",             asset: "13ef6067-3e1a-4352-a029-58bc34af892e", term: "canada" },
    { id: "usa",         en: "USA",                 ar: "الولايات المتحدة", asset: "2fc9219b-2d9c-458e-8536-cfbc0cd35806", term: "usa" },
    { id: "australia",   en: "Australia",           ar: "أستراليا",         asset: "34458127-34e4-40f2-827e-f1dfdd6583ab", term: "australia" },
    { id: "uruguay",     en: "Uruguay",             ar: "الأوروغواي",       asset: "cf11725d-e394-449c-8924-874485bfccf7", term: "uruguay" },
    { id: "poland",      en: "Poland",              ar: "بولندا",           asset: "4568cb17-1bec-48db-94d6-79724ac914ee", term: "poland" },
    { id: "turkiye",     en: "Türkiye",             ar: "تركيا",            asset: "dd0eec65-8b5f-4b35-aade-26a64568a5d1", term: "turkiye" },
    { id: "korea",       en: "Korea",               ar: "كوريا",            asset: "bb5710f6-fa74-468c-99f1-11bee41e5ef4", term: "korea" },
    { id: "barcelona",   en: "F.C. Barcelona",      ar: "برشلونة",          asset: "d9629c78-226d-4c61-8389-3af4a8fe1f5c", term: "barcelona" },
    { id: "psg",         en: "Paris Saint-Germain", ar: "باريس سان جيرمان", asset: "df60c2f6-02bc-4aff-a13a-932f96e46119", term: "paris saint-germain" },
    { id: "chelsea",     en: "Chelsea F.C.",        ar: "تشيلسي",           asset: "744558a0-7e51-4e4f-9c6f-5e8e5327a6b6", term: "chelsea" },
    { id: "inter",       en: "Inter",               ar: "إنتر ميلان",       asset: "9395e515-0b77-400b-b7fb-acb3189bd332", term: "inter milan" },
    { id: "tottenham",   en: "Tottenham Hotspur",   ar: "توتنهام",          asset: "9dfce757-1c13-4f4a-80e7-5d244a04c9f0", term: "tottenham" },
    { id: "atletico",    en: "Atlético Madrid",     ar: "أتلتيكو مدريد",     asset: "3196dc4a-180c-44f7-bf8e-ae7063cede21", term: "atletico madrid" },
  ];

  return teams.map(({ id, en, ar: arName, asset, term }) => ({
    id,
    name: ar ? arName : en,
    href: q(lang, term),
    crest: crestUrl(asset),
  }));
}
