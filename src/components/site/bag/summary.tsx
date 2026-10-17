import type { ReactNode } from "react";
import { FREE_SHIPPING_FROM, usd } from "@/lib/checkout";

/** nike's Summary column: 16/28 rows, a ruled Total, then the action slot. */
export function Summary({
  subtotal,
  shipping,
  title = "Summary",
  children,
}: {
  subtotal: number;
  shipping: number;
  title?: string;
  children?: ReactNode;
}) {
  const toFree = FREE_SHIPPING_FROM - subtotal;
  return (
    <div className="flex flex-col">
      <h2 className="pb-6 text-2xl font-medium">{title}</h2>
      <dl className="flex flex-col gap-2 text-base leading-7">
        <Row label="Subtotal" value={subtotal ? usd(subtotal) : "—"} />
        <Row label="Estimated Shipping & Handling" value={subtotal ? (shipping ? usd(shipping) : "Free") : "—"} />
        <Row label="Estimated Tax" value="—" />
      </dl>
      <div className="mt-4 flex justify-between border-y border-light-300 py-4 text-base font-medium">
        <span>Total</span>
        <span>{subtotal ? usd(subtotal + shipping) : "—"}</span>
      </div>
      {subtotal > 0 && toFree > 0 && (
        <div className="pt-4 text-sm">
          <p>
            <b>Add {usd(toFree)} more</b> for free shipping.
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-light-300">
            <div className="h-full rounded-full bg-green" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100)}%` }} />
          </div>
        </div>
      )}
      {children && <div className="pt-8">{children}</div>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
