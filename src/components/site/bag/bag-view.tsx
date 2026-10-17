"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { usd } from "@/lib/checkout";
import { Summary } from "./summary";
import { useBag } from "./use-bag";

/**
 * nike.com/cart at 1440: a 1076px block — 717px Bag column, 24px gap,
 * 335px Summary with a 60px pill Checkout. Stacks below 960px.
 */
export function BagView({ lang }: { lang: string }) {
  const { ready, items, subtotal, shipping } = useBag();
  const update = useCartStore((s) => s.updateQuantity);
  const remove = useCartStore((s) => s.removeItem);

  return (
    <main className="mx-auto flex max-w-[1124px] flex-col gap-10 px-6 pt-10 pb-24 min-[960px]:flex-row min-[960px]:gap-6 min-[960px]:pt-14">
      <section className="min-w-0 flex-1 min-[960px]:max-w-[717px]">
        <h1 className="pb-4 text-2xl font-medium">Bag</h1>
        {!ready ? null : items.length === 0 ? (
          <p className="text-base leading-7">There are no items in your bag.</p>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 border-b border-light-300 py-6">
                <Link href={item.href ?? "#"} className="relative size-[100px] shrink-0 overflow-hidden bg-light-200 min-[960px]:size-[164px]">
                  {item.image && <Image src={item.image} alt={item.name} fill sizes="164px" className="object-cover" />}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0 text-base">
                      <Link href={item.href ?? "#"} className="font-medium hover:underline">{item.name}</Link>
                      {item.subtitle && <p className="text-[#707072]">{item.subtitle}</p>}
                      {item.color && <p className="text-[#707072]">{item.color}</p>}
                      {item.size && (
                        <p className="text-[#707072]">
                          Size <span className="underline">{item.size}</span>
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-end text-base font-medium">
                      {usd(item.price * item.quantity)}
                      {item.compareAt && item.compareAt > item.price && (
                        <p className="font-normal text-[#707072] line-through">{usd(item.compareAt * item.quantity)}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto flex pt-4">
                    <div className="flex h-10 items-center rounded-full border border-light-300">
                      <button
                        type="button"
                        aria-label={item.quantity === 1 ? `Remove ${item.name}` : "Decrease quantity"}
                        onClick={() => (item.quantity === 1 ? remove(item.id) : update(item.id, item.quantity - 1))}
                        className="grid size-10 place-items-center rounded-full hover:bg-light-200"
                      >
                        {item.quantity === 1 ? <TrashIcon /> : <span className="text-xl leading-none">−</span>}
                      </button>
                      <span className="w-6 text-center text-base" aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={item.quantity >= 10}
                        onClick={() => update(item.id, item.quantity + 1)}
                        className="grid size-10 place-items-center rounded-full text-xl leading-none hover:bg-light-200 disabled:text-[#cacacb]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="w-full min-[960px]:w-[335px] min-[960px]:shrink-0">
        <Summary subtotal={ready ? subtotal : 0} shipping={shipping}>
          {ready && items.length > 0 ? (
            <Link href={`/${lang}/checkout`} className="flex h-[60px] items-center justify-center rounded-[30px] bg-dark-900 text-base font-medium text-light-100 hover:bg-[#707072]">
              Checkout
            </Link>
          ) : (
            <span aria-disabled="true" className="flex h-[60px] items-center justify-center rounded-[30px] bg-light-300 text-base font-medium text-[#cacacb]">
              Checkout
            </span>
          )}
        </Summary>
      </aside>
    </main>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.25 7.5v12m-4.5-12v12M5.25 6v13.5c0 1.24 1.01 2.25 2.25 2.25h9c1.24 0 2.25-1.01 2.25-2.25V5.25h2.75m-2.75 0H21m-12-3h5.25c.69 0 1.25.56 1.25 1.25V5.25H7.75V3.5c0-.69.56-1.25 1.25-1.25zM3 5.25h3" />
    </svg>
  );
}
