"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { placeOrder } from "@/lib/actions/checkout";
import { usd } from "@/lib/checkout";
import { useCartStore } from "@/store/cart";
import { Summary } from "./summary";
import { useBag } from "./use-bag";

const FIELDS = [
  { name: "firstName", label: "First Name", auto: "given-name", half: true },
  { name: "lastName", label: "Last Name", auto: "family-name", half: true },
  { name: "line1", label: "Address Line 1", auto: "address-line1" },
  { name: "line2", label: "Address Line 2 (optional)", auto: "address-line2", optional: true },
  { name: "city", label: "City", auto: "address-level2", half: true },
  { name: "state", label: "State / Region", auto: "address-level1", half: true },
  { name: "postalCode", label: "Postal Code", auto: "postal-code", half: true },
  { name: "country", label: "Country", auto: "country-name", half: true },
  { name: "email", label: "Email", auto: "email", type: "email" },
  { name: "phone", label: "Phone Number", auto: "tel", type: "tel" },
] as const;

/**
 * nike-style checkout: Delivery form on the left, the same Summary column
 * on the right. Payment is a labelled demo step — this store never asks
 * for or handles card details.
 */
export function CheckoutView({ lang }: { lang: string }) {
  const router = useRouter();
  const { ready, items, subtotal, shipping } = useBag();
  const clear = useCartStore((s) => s.clearCart);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (ready && items.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-base">Your bag is empty.</p>
        <Link href={`/${lang}/products`} className="mt-6 inline-block rounded-full bg-dark-900 px-6 py-3 font-medium text-light-100">
          Shop
        </Link>
      </main>
    );
  }

  const submit = (form: FormData) => {
    setError(null);
    const delivery = Object.fromEntries(FIELDS.map((f) => [f.name, String(form.get(f.name) ?? "")]));
    start(async () => {
      const res = await placeOrder({
        lines: items.map((i) => ({ variantId: i.id, quantity: i.quantity })),
        delivery: delivery as Parameters<typeof placeOrder>[0]["delivery"],
      });
      if (!res.ok) return setError(res.error);
      clear();
      router.push(`/${lang}/checkout/confirmation/${res.orderId}`);
    });
  };

  return (
    <main className="mx-auto flex max-w-[1124px] flex-col gap-10 px-6 pt-10 pb-24 min-[960px]:flex-row min-[960px]:gap-16 min-[960px]:pt-14">
      <form action={submit} className="min-w-0 flex-1 min-[960px]:max-w-[540px]">
        <h1 className="pb-6 text-2xl font-medium">Delivery</h1>
        <div className="grid grid-cols-2 gap-4">
          {FIELDS.map((f) => (
            <label key={f.name} className={`relative block ${"half" in f && f.half ? "col-span-1" : "col-span-2"}`}>
              <input
                name={f.name}
                type={"type" in f ? f.type : "text"}
                autoComplete={f.auto}
                required={!("optional" in f)}
                placeholder=" "
                className="peer h-14 w-full rounded-lg border border-[#cacacb] px-4 pt-4 text-base outline-none focus:border-dark-900"
              />
              <span className="pointer-events-none absolute start-4 top-1.5 text-xs text-[#707072] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1.5 peer-focus:text-xs">
                {f.label}
              </span>
            </label>
          ))}
        </div>

        <h2 className="pt-12 pb-4 text-2xl font-medium">Payment</h2>
        <div className="rounded-lg bg-light-200 p-5 text-base">
          <p className="font-medium">Demo store — no payment is taken.</p>
          <p className="pt-1 text-[#707072]">
            This site is a portfolio clone and is not affiliated with Nike. Placing an order records it for the demo only; nothing is charged or shipped.
          </p>
        </div>

        {error && <p className="pt-4 text-sm text-red" role="alert">{error}</p>}

        <button
          type="submit"
          disabled={pending || !ready}
          className="mt-8 h-[60px] w-full rounded-[30px] bg-dark-900 text-base font-medium text-light-100 hover:bg-[#707072] disabled:bg-light-300 disabled:text-[#cacacb]"
        >
          {pending ? "Placing Order…" : "Place Order"}
        </button>
      </form>

      <aside className="w-full min-[960px]:w-[335px] min-[960px]:shrink-0">
        <Summary title="Order Summary" subtotal={ready ? subtotal : 0} shipping={shipping}>
          <ul className="flex flex-col gap-4">
            {items.map((i) => (
              <li key={i.id} className="flex gap-4 text-sm">
                <div className="relative size-[88px] shrink-0 overflow-hidden bg-light-200">
                  {i.image && <Image src={i.image} alt={i.name} fill sizes="88px" className="object-cover" />}
                </div>
                <div className="text-[#707072]">
                  <p className="font-medium text-dark-900">{i.name}</p>
                  {i.size && <p>Size {i.size}</p>}
                  {i.color && <p>{i.color}</p>}
                  <p>Qty {i.quantity} @ {usd(i.price)}</p>
                </div>
              </li>
            ))}
          </ul>
        </Summary>
      </aside>
    </main>
  );
}
