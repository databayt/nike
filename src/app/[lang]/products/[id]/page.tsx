import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { getProduct, getProductReviews, getRecommendedProducts, type FullProduct } from "@/lib/actions/product";
import { getDictionary, type Dictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";
import { ProductView, type PdpColorway } from "@/components/site/pdp/product-view";
import { WallCard } from "@/components/site/wall/product-card";

/** Catalog SKUs are `NK-<style code>-<size>`; the style code identifies a colourway. */
/** Shoe sizes sort numerically ("6.5", "4Y"); apparel letters fall back to the stored order. */
const sizeKey = (v: FullProduct["variants"][number]) => {
  const n = parseFloat(v.size?.name ?? "");
  return Number.isNaN(n) ? 1000 + (v.size?.sortOrder ?? 0) : n;
};

const styleCode = (sku: string) => sku.match(/^NK-([A-Z0-9]+-[A-Z0-9]+)-/)?.[1] ?? null;

function toColorways({ variants, images }: FullProduct): PdpColorway[] {
  const productImages = images
    .filter((i) => i.variantId === null)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((i) => i.url);

  const groups = new Map<string, FullProduct["variants"]>();
  for (const v of variants) {
    const key = styleCode(v.sku) ?? v.colorId;
    groups.set(key, [...(groups.get(key) ?? []), v]);
  }

  return [...groups.entries()].map(([key, vs]) => {
    const ids = new Set(vs.map((v) => v.id));
    const own = images.filter((i) => i.variantId && ids.has(i.variantId)).map((i) => i.url);
    const sorted = [...vs].sort((a, b) => sizeKey(a) - sizeKey(b));
    return {
      code: styleCode(vs[0].sku) ? key : null,
      color: vs[0].color?.name ?? "",
      images: own.length ? own : productImages,
      price: Number(vs[0].price),
      salePrice: vs[0].salePrice ? Number(vs[0].salePrice) : null,
      sizes: sorted.map((v) => ({ name: v.size?.name ?? "", variantId: v.id, inStock: (v.inStock ?? 0) > 0 })),
    };
  }).filter((c) => c.images.length > 0);
}

function Accordion({ title, meta, children, open }: { title: string; meta?: ReactNode; children: ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-t border-light-300 last:border-b">
      <summary className="flex cursor-pointer list-none items-center justify-between py-6 text-xl font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <span className="flex items-center gap-3">
          {meta}
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-open:rotate-180">
            <path d="M18.966 8.476L12 15.443 5.033 8.476" />
          </svg>
        </span>
      </summary>
      <div className="pb-8 text-base text-dark-900">{children}</div>
    </details>
  );
}

const Stars = ({ value }: { value: number }) => (
  <span className="flex" aria-label={`${value.toFixed(1)} of 5`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <svg key={i} aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill={i <= Math.round(value) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 17l-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />
      </svg>
    ))}
  </span>
);

async function Reviews({ productId, dictionary }: { productId: string; dictionary: Dictionary }) {
  const reviews = await getProductReviews(productId);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  return (
    <Accordion title={`${dictionary.product.reviews} (${reviews.length})`} meta={reviews.length ? <Stars value={avg} /> : null}>
      {reviews.length === 0 ? (
        <p className="text-[#707072]">{dictionary.product.noReviews}</p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((r) => (
            <li key={r.id}>
              <Stars value={r.rating} />
              <p className="pt-1 text-sm text-[#707072]">
                {r.author} · {new Date(r.createdAt).toLocaleDateString()}
              </p>
              {r.content && <p className="pt-2">{r.content}</p>}
            </li>
          ))}
        </ul>
      )}
    </Accordion>
  );
}

async function AlsoLike({ productId, dictionary, lang }: { productId: string; dictionary: Dictionary; lang: Locale }) {
  const recs = await getRecommendedProducts(productId);
  if (!recs.length) return null;
  return (
    <section className="pt-20 pb-16">
      <h2 className="px-6 pb-4 text-2xl font-medium min-[960px]:px-12">{dictionary.product.youMightAlsoLike}</h2>
      <div className="flex snap-x gap-3 overflow-x-auto px-6 [scrollbar-width:none] min-[960px]:px-12">
        {recs.map((p) => (
          <div key={p.id} className="w-[260px] shrink-0 snap-start min-[960px]:w-[440px] [&>a]:px-0 [&>a]:pb-0">
            <WallCard href={`/${lang}/products/${p.id}`} title={p.title} subtitle={p.subtitle} imageSrc={p.imageUrl} price={p.price} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string; lang: Locale }> }) {
  const { id, lang } = await params;
  const dictionary = await getDictionary(lang);
  const data = await getProduct(id);
  const colorways = data ? toColorways(data) : [];

  if (!data || !colorways.length) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-medium">{dictionary.product.productNotFound}</h1>
        <p className="pt-2 text-[#707072]">{dictionary.product.productNotFoundDesc}</p>
        <Link href={`/${lang}/products`} className="mt-8 inline-block rounded-full bg-dark-900 px-6 py-3 font-medium text-light-100">
          {dictionary.product.browseProducts}
        </Link>
      </main>
    );
  }

  const { product, variants } = data;
  const defaultCode = variants.find((v) => v.id === product.defaultVariantId)?.sku;
  const initial = Math.max(0, colorways.findIndex((c) => c.code && defaultCode && styleCode(defaultCode) === c.code));
  const subtitle = product.description && product.description.length < 60 ? product.description : product.gender?.label;

  return (
    <main>
      <ProductView
        name={product.name}
        subtitle={subtitle}
        badge={product.badge}
        colorways={colorways}
        initial={initial}
        labels={{
          selectSize: dictionary.product.selectSize,
          sizeGuide: dictionary.product.sizeGuide,
          addToBag: dictionary.product.addToBag,
          added: dictionary.product.added,
          favorite: dictionary.product.favorite,
          pleaseSelectSize: dictionary.product.pleaseSelectSize,
          shown: dictionary.product.shown,
          style: dictionary.product.style,
        }}
        details={
          <>
            <Accordion title={dictionary.product.shippingReturns}>
              <p>{dictionary.product.shippingReturnsDesc}</p>
            </Accordion>
            <Suspense fallback={<Accordion title={dictionary.product.reviews}><p>{dictionary.common.loading}</p></Accordion>}>
              <Reviews productId={product.id} dictionary={dictionary} />
            </Suspense>
          </>
        }
      />
      <Suspense fallback={null}>
        <AlsoLike productId={product.id} dictionary={dictionary} lang={lang} />
      </Suspense>
    </main>
  );
}
