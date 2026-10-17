import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { WallCard } from "@/components/site/wall/product-card";
import { WallShell } from "@/components/site/wall/wall-shell";
import { parseFilterParams } from "@/lib/utils/query";
import { getAllProducts } from "@/lib/actions/product";
import { getDictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

/** nike names a wall after what it holds: "Men's Shoes", "Pegasus", "New & Featured". */
function wallTitle(sp: SearchParams, fallback: string) {
  const search = first(sp.search);
  if (search) return titleCase(search);
  const genders = [sp.gender].flat().filter(Boolean) as string[];
  if (genders.length === 1) return `${titleCase(genders[0])}'s Products`;
  return fallback;
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<SearchParams>;
}) {
  const { lang } = await params;
  const sp = await searchParams;
  const dictionary = await getDictionary(lang);

  const parsed = parseFilterParams(sp);
  const { products, totalCount } = await getAllProducts({ ...parsed, limit: Math.max(parsed.limit, 48) });

  return (
    <WallShell
      title={wallTitle(sp, dictionary.common.new)}
      count={totalCount}
      sort={<Sort dictionary={dictionary} />}
      filters={<Filters dictionary={dictionary} lang={lang} />}
      hideLabel={dictionary.filters.hideFilters}
      showLabel={dictionary.filters.showFilters}
      filterLabel={dictionary.filters.title}
      applyLabel={dictionary.filters.apply}
    >
      {products.length === 0 ? (
        <p className="px-5 py-16 text-center text-base text-[#707072] min-[960px]:px-0">
          {dictionary.filters.noProductsFound}
        </p>
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
