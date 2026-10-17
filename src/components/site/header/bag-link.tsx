"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useCartStore } from "@/store/cart";

/** Header bag icon with nike's item count tucked inside the bag (shown once the persisted bag hydrates). */
export function BagLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const shown = ready ? count : 0;

  return (
    <Link
      href={href}
      aria-label={`${label} Items: ${shown}`}
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-dark-900 transition-colors hover:bg-light-200"
    >
      {children}
      {shown > 0 && (
        <span className="absolute top-[19px] text-[9px] leading-none font-medium">{shown > 9 ? "9+" : shown}</span>
      )}
    </Link>
  );
}
