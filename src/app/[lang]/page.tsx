import Hero from "@/components/site/hero";
import Filmstrip from "@/components/site/filmstrip";
import { Trending, Marquee, BestSellers, ChooseYourTeam, Essentials } from "@/components/site/home";
import { getAllProducts } from "@/lib/actions/product";
import { getDictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const { products } = await getAllProducts({
    page: 1,
    limit: 8,
    sort: "newest",
    search: "",
    genderSlugs: [],
    brandSlugs: [],
    categorySlugs: [],
    sizeSlugs: [],
    colorSlugs: [],
    priceRanges: []
  });

  return (
    <>
      <Hero dictionary={dictionary} lang={lang} />
      <Filmstrip dictionary={dictionary} lang={lang} />
      <Marquee dictionary={dictionary} lang={lang} />
      <BestSellers dictionary={dictionary} lang={lang} products={products} />
      <Trending dictionary={dictionary} lang={lang} />
      <ChooseYourTeam dictionary={dictionary} lang={lang} />
      <Essentials dictionary={dictionary} lang={lang} />
    </>
  );
}
