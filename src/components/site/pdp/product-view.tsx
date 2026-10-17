"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { useCartStore } from "@/store/cart";

export interface PdpSize {
  name: string;
  variantId: string;
  inStock: boolean;
}

export interface PdpColorway {
  code: string | null;
  color: string;
  images: string[];
  price: number;
  salePrice: number | null;
  sizes: PdpSize[];
}

export interface PdpLabels {
  selectSize: string;
  sizeGuide: string;
  addToBag: string;
  added: string;
  favorite: string;
  pleaseSelectSize: string;
  shown: string;
  style: string;
}

const usd = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;

/**
 * nike.com/t buy box at 1440: a 1016px block — 60px thumb rail, 532×665
 * hero on #f5f5f5, then a 376px column (20px title, 70px colourway tiles,
 * 2-up size grid, 60px pill buttons). Below 960px it stacks, title first.
 */
export function ProductView({
  name,
  subtitle,
  badge,
  colorways,
  initial,
  labels,
  details,
}: {
  name: string;
  subtitle?: string | null;
  badge?: string | null;
  colorways: PdpColorway[];
  initial: number;
  labels: PdpLabels;
  details: ReactNode;
}) {
  const [ci, setCi] = useState(initial);
  const [img, setImg] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const cw = colorways[ci];
  const onSale = cw.salePrice !== null && cw.salePrice < cw.price;
  const price = onSale ? cw.salePrice! : cw.price;
  const hero = cw.images[img] ?? cw.images[0];

  const pickColor = (i: number) => {
    setCi(i);
    setImg(0);
    // Keep the size when the new colourway stocks it, as nike does.
    if (size && !colorways[i].sizes.some((s) => s.name === size && s.inStock)) setSize(null);
  };

  const addToBag = () => {
    const chosen = cw.sizes.find((s) => s.name === size);
    if (!chosen) {
      setError(true);
      return;
    }
    addItem({ id: chosen.variantId, name: `${name} — ${cw.color} / ${chosen.name}`, price, image: cw.images[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const heading = (
    <div>
      {badge && <p className="pb-1 text-base font-medium text-red">{badge}</p>}
      <h1 className="text-xl leading-6 font-medium text-dark-900">{name}</h1>
      {subtitle && <p className="text-base text-[#707072]">{subtitle}</p>}
      <p className="pt-2.5 text-base font-medium text-dark-900">
        {usd(price)}
        {onSale && (
          <>
            <span className="ps-2 font-normal text-[#707072] line-through">{usd(cw.price)}</span>
            <span className="ps-2 text-green">{Math.round((1 - cw.salePrice! / cw.price) * 100)}% off</span>
          </>
        )}
      </p>
    </div>
  );

  return (
    <div className="mx-auto flex max-w-[1016px] flex-col gap-6 pt-6 min-[960px]:flex-row min-[960px]:gap-8 min-[960px]:pt-12">
      <div className="px-6 min-[960px]:hidden">{heading}</div>

      {/* Gallery */}
      <div className="flex shrink-0 gap-4 min-[960px]:sticky min-[960px]:top-6 min-[960px]:h-fit">
        {cw.images.length > 1 && (
          <div className="hidden w-[60px] flex-col gap-2 min-[960px]:flex">
            {cw.images.map((src, i) => (
              <button
                key={src}
                type="button"
                onMouseEnter={() => setImg(i)}
                onClick={() => setImg(i)}
                aria-label={`${name} image ${i + 1}`}
                className={`relative size-[60px] overflow-hidden rounded bg-light-200 ${i === img ? "after:absolute after:inset-0 after:bg-black/20" : ""}`}
              >
                <Image src={src} alt="" fill sizes="60px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-light-200 min-[960px]:w-[532px] min-[960px]:rounded-lg">
          <Image src={hero} alt={`${name} ${cw.color}`} fill priority sizes="(min-width: 960px) 532px, 100vw" className="object-cover" />
        </div>
      </div>

      {/* Buy column */}
      <div className="flex w-full flex-col px-6 min-[960px]:w-[376px] min-[960px]:px-0">
        <div className="hidden min-[960px]:block">{heading}</div>

        {colorways.length > 1 && (
          <div className="flex flex-wrap gap-1 pt-8" role="radiogroup" aria-label="Colorway">
            {colorways.map((c, i) => (
              <button
                key={c.code ?? c.color + i}
                type="button"
                role="radio"
                aria-checked={i === ci}
                aria-label={c.color}
                onClick={() => pickColor(i)}
                className={`relative size-[70px] overflow-hidden rounded border bg-light-200 ${i === ci ? "border-dark-900" : "border-light-100 hover:border-dark-900"}`}
              >
                <Image src={c.images[0]} alt="" fill sizes="70px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="pt-8">
          <div className="flex items-center justify-between pb-3">
            <p className={`text-base font-medium ${error ? "text-red" : "text-dark-900"}`}>{labels.selectSize}</p>
            <span className="text-sm font-medium text-[#707072]">{labels.sizeGuide}</span>
          </div>
          <div
            role="radiogroup"
            aria-label={labels.selectSize}
            className={`grid gap-[9px] rounded ${cw.sizes.length === 1 ? "grid-cols-1" : "grid-cols-2"} ${error ? "outline outline-1 outline-red" : ""}`}
          >
            {cw.sizes.map((s) => (
              <button
                key={s.variantId}
                type="button"
                role="radio"
                aria-checked={size === s.name}
                disabled={!s.inStock}
                onClick={() => {
                  setSize(s.name);
                  setError(false);
                }}
                className={`h-[46px] rounded border text-base ${
                  size === s.name
                    ? "border-dark-900"
                    : "border-light-300 hover:border-dark-900"
                } disabled:cursor-not-allowed disabled:bg-light-200 disabled:text-[#cacacb] disabled:hover:border-light-300`}
              >
                {s.name}
              </button>
            ))}
          </div>
          {error && <p className="pt-3 text-sm text-red">{labels.pleaseSelectSize}</p>}
        </div>

        <div className="flex flex-col gap-3 pt-10">
          <button
            type="button"
            onClick={addToBag}
            className="h-[60px] rounded-[30px] bg-dark-900 text-base font-medium text-light-100 hover:bg-[#707072]"
          >
            {added ? labels.added : labels.addToBag}
          </button>
          <button
            type="button"
            className="flex h-[60px] items-center justify-center gap-2 rounded-[30px] border border-[#cacacb] text-base font-medium text-dark-900 hover:border-dark-900"
          >
            {labels.favorite}
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M16.794 3.75c1.324 0 2.568.516 3.504 1.451a4.96 4.96 0 010 7.008L12 20.508l-8.299-8.299a4.96 4.96 0 010-7.007A4.923 4.923 0 017.205 3.75c1.324 0 2.568.516 3.504 1.451l.76.76.531.531.53-.531.76-.76a4.926 4.926 0 013.504-1.451" />
            </svg>
          </button>
        </div>

        <ul className="list-disc space-y-1 ps-5 pt-10 text-base text-dark-900">
          <li>
            {labels.shown}: {cw.color}
          </li>
          {cw.code && (
            <li>
              {labels.style}: {cw.code}
            </li>
          )}
        </ul>

        <div className="pt-10">{details}</div>
      </div>
    </div>
  );
}
