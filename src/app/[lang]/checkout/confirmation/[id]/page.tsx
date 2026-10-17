import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orderItems, orders } from "@/lib/db/schema";

export const metadata: Metadata = { title: "Order Placed", robots: { index: false } };

export default async function ConfirmationPage({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  if (id === "demo") {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-medium">Order flow complete.</h1>
        <p className="pt-3 text-base text-[#707072]">This is a portfolio demo: nothing was stored, charged or shipped.</p>
        <Link href={`/${lang}/products`} className="mt-8 inline-block rounded-full bg-dark-900 px-6 py-3 font-medium text-light-100">
          Continue Shopping
        </Link>
      </main>
    );
  }
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) notFound();
  const lines = await db.select({ q: orderItems.quantity }).from(orderItems).where(eq(orderItems.orderId, id));
  const count = lines.reduce((n, l) => n + l.q, 0);

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-2xl font-medium">Thanks — your order is in.</h1>
      <p className="pt-3 text-base text-[#707072]">
        Order {order.id.slice(0, 8).toUpperCase()} · {count} {count === 1 ? "item" : "items"} · ${Number(order.totalAmount).toFixed(2)}
      </p>
      <p className="pt-2 text-sm text-[#707072]">Demo store: nothing was charged or will ship.</p>
      <Link href={`/${lang}/products`} className="mt-8 inline-block rounded-full bg-dark-900 px-6 py-3 font-medium text-light-100">
        Continue Shopping
      </Link>
    </main>
  );
}
