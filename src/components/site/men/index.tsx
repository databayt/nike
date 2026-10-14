import type { Dictionary } from "@/components/internationalization/dictionaries";
import type { Locale } from "@/components/internationalization/config";
import {
  buildClothingIcons,
  buildEditorialCards,
  buildFootwearIcons,
  buildTrendingCards,
  menDict,
} from "./men-data";
import CategoryNav from "./category-nav";
import MenHero from "./men-hero";
import PromoCards from "./promo-cards";
import EditorialDuo from "./editorial-duo";
import IconRail from "./icon-rail";
import ShopBySport from "./shop-by-sport";
import ShopByCategory from "./shop-by-category";
import FooterNav from "./footer-nav";

interface MenPageProps {
  dictionary: Dictionary;
  lang: Locale;
}

/**
 * Section-by-section clone of nike.com/men. The global header and footer come
 * from the locale layout; this assembles everything between them in source
 * order: category bar → hero → promo strip → trending → featured footwear →
 * editorial duo → latest in clothing → shop by sport → shop by category →
 * footer SEO nav.
 */
export default function MenPage({ dictionary, lang }: MenPageProps) {
  const t = menDict(dictionary);
  const sections = t.sections ?? {};

  return (
    <>
      <CategoryNav dictionary={dictionary} lang={lang} />
      <MenHero dictionary={dictionary} lang={lang} />
      <PromoCards dictionary={dictionary} lang={lang} />
      <EditorialDuo
        dictionary={dictionary}
        lang={lang}
        heading={sections.trendingNow || "Trending Now"}
        cards={buildTrendingCards(lang)}
      />
      <IconRail
        heading={sections.featuredFootwear || "Featured Footwear"}
        items={buildFootwearIcons(lang)}
      />
      <EditorialDuo dictionary={dictionary} lang={lang} cards={buildEditorialCards(lang)} />
      <IconRail
        heading={sections.latestInClothing || "Latest in Clothing"}
        items={buildClothingIcons(lang)}
      />
      <ShopBySport dictionary={dictionary} lang={lang} />
      <ShopByCategory dictionary={dictionary} lang={lang} />
      <FooterNav dictionary={dictionary} lang={lang} />
    </>
  );
}
