import type { Locale } from "@/components/internationalization/config";

/**
 * Second homepage section on nike.com — a "filmstrip" carousel of tall portrait
 * cards. Three cards fit the row at ≥960px (Nike's `grid-aligned-3`); below that
 * it becomes a horizontally scrollable strip that reveals a peek of the next
 * card. Imagery is served from Nike's public CDN (next.config allows any HTTPS
 * host), art-directed to a 464:604 portrait crop.
 */
export interface FilmstripCard {
  id: string;
  /** Key into the `filmstrip` dictionary block for the card title. */
  titleKey: string;
  href: string;
  /** Fallback image src (a mid-range width). */
  src: string;
  /** Width-descriptor srcset so each card loads a right-sized crop. */
  srcSet: string;
}

const CDN = "https://static.nike.com/a/images/f_auto,cs_srgb";
const img = (id: string, w: number) => `${CDN}/w_${w},c_limit/${id}/nike-just-do-it.jpg`;
const srcSet = (id: string) =>
  [400, 600, 928, 1200].map((w) => `${img(id, w)} ${w}w`).join(", ");

export function buildFilmstripCards(lang: Locale): FilmstripCard[] {
  const browse = (q: string) => `/${lang}/products?search=${encodeURIComponent(q)}`;

  const cards: Array<{ id: string; titleKey: string; query: string; asset: string }> = [
    { id: "soccer-lifestyle", titleKey: "soccerLifestyle", query: "soccer", asset: "0b6da4ce-de53-4cdc-98dc-033fef88cab9" },
    { id: "cleats",           titleKey: "cleats",          query: "cleats", asset: "abbd16af-e831-47ea-86dc-54ec50d94d1f" },
    { id: "rep-team",         titleKey: "repTeam",         query: "team",   asset: "b2f563df-bd17-4e84-880c-f8e13ea56ff4" },
  ];

  return cards.map(({ id, titleKey, query, asset }) => ({
    id,
    titleKey,
    href: browse(query),
    src: img(asset, 600),
    srcSet: srcSet(asset),
  }));
}
