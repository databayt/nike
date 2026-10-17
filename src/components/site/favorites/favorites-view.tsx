"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WallCard } from "@/components/site/wall/product-card";
import { useFavoritesStore } from "@/store/favorites";

/** nike-style Favorites: heading + count, then the wall card grid with a heart to remove each. */
export function FavoritesView({ lang }: { lang: string }) {
  const items = useFavoritesStore((s) => s.items);
  const remove = useFavoritesStore((s) => s.remove);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <main className="px-5 pt-6 pb-24 min-[960px]:px-12 min-[960px]:pt-10">
      <h1 className="pb-8 text-2xl font-medium">
        Favorites{ready && items.length > 0 && <span className="ps-1.5">({items.length})</span>}
      </h1>
      {!ready ? null : items.length === 0 ? (
        <div className="py-10">
          <p className="text-base">Items added to your Favorites will be saved here.</p>
          <Link href={`/${lang}/w/new-3n82y`} className="mt-6 inline-block rounded-full bg-dark-900 px-6 py-3 text-base font-medium text-light-100">
            Shop New Arrivals
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-1 min-[960px]:-mx-2 min-[960px]:grid-cols-3 min-[960px]:gap-x-0">
          {items.map((f) => (
            <div key={f.productId} className="relative">
              <WallCard href={f.href} title={f.name} subtitle={f.subtitle} imageSrc={f.image} price={f.price} salePrice={f.salePrice} />
              <button
                type="button"
                onClick={() => remove(f.productId)}
                aria-label={`Remove ${f.name} from Favorites`}
                className="absolute end-4 top-4 grid size-9 place-items-center rounded-full bg-light-100 min-[960px]:end-6"
              >
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
                  <path d="M16.794 3.75c1.324 0 2.568.516 3.504 1.451a4.96 4.96 0 010 7.008L12 20.508l-8.299-8.299a4.96 4.96 0 010-7.007A4.923 4.923 0 017.205 3.75c1.324 0 2.568.516 3.504 1.451l.76.76.531.531.53-.531.76-.76a4.926 4.926 0 013.504-1.451" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
