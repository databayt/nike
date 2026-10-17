"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { shippingFor } from "@/lib/checkout";

/** The persisted bag plus its totals; `ready` is false until localStorage hydrates. */
export function useBag() {
  const items = useCartStore((s) => s.items);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = shippingFor(subtotal);
  return { ready, items, subtotal, shipping, total: subtotal + shipping, count: items.reduce((n, i) => n + i.quantity, 0) };
}
