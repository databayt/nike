import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { WallCard } from "@/components/site/wall/product-card";
import { WallShell } from "@/components/site/wall/wall-shell";
import { parseFilterParams } from "@/lib/utils/query";
import { getAllProducts } from "@/lib/actions/product";
import { getDictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";
import { getWall } from "@/lib/walls";

type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getWall(slug)?.title ?? "Products" };
}

/** nike.com/w/<slug>: one curated wall, same rail, sort and grid as /products. */
export default async function WallPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { lang, slug } = await params;
  const wall = getWall(slug);
  if (!wall) notFound();

  const sp = await searchParams;
  const dictionary = await getDictionary(lang);
  const parsed = parseFilterParams(sp);
  // A wall keeps nike's own order unless the shopper picks a sort.
  const { products, totalCount } = await getAllProducts({
    ...parsed,
    wall: slug,
    sort: sp.sort ? parsed.sort : "newest",
    limit: 60,
  });

  return (
    <WallShell
      title={wall.title}
      count={totalCount}
      sort={<Sort dictionary={dictionary} />}
      filters={<Filters dictionary={dictionary} lang={lang} />}
      hideLabel={dictionary.filters.hideFilters}
      showLabel={dictionary.filters.showFilters}
      filterLabel={dictionary.filters.title}
      applyLabel={dictionary.filters.apply}
    >
      {products.length === 0 ? (
        <p className="px-5 py-16 text-center text-base text-[#707072] min-[960px]:px-0">{dictionary.filters.noProductsFound}</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-1 min-[960px]:grid-cols-3 min-[960px]:gap-x-0">
          {products.map((p, i) => (
            <WallCard
              key={p.id}
              href={`/${lang}/products/${p.id}`}
              title={p.name}
              subtitle={p.subtitle}
              imageSrc={p.imageUrl ?? "/shoes/shoe-1.jpg"}
              badge={p.badge}
              price={p.minPrice}
              salePrice={p.salePrice}
              colorCount={p.colorCount}
              priority={i < 3}
            />
          ))}
        </div>
      )}
    </WallShell>
  );
}
