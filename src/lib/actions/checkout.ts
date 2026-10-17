"use server";

import { inArray } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { addresses, orderItems, orders, productVariants } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/actions";
import { shippingFor } from "@/lib/checkout";

const orderSchema = z.object({
  lines: z
    .array(z.object({ variantId: z.string().uuid(), quantity: z.number().int().min(1).max(10) }))
    .min(1),
  delivery: z.object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    line1: z.string().trim().min(1),
    line2: z.string().trim().optional(),
    city: z.string().trim().min(1),
    state: z.string().trim().min(1),
    postalCode: z.string().trim().min(3),
    country: z.string().trim().min(2),
    email: z.string().trim().email(),
    phone: z.string().trim().min(7),
  }),
});

export type PlaceOrderInput = z.infer<typeof orderSchema>;
export type PlaceOrderResult = { ok: true; orderId: string } | { ok: false; error: string };

/**
 * Demo checkout: reprices every line from the database (never the client's
 * numbers), records a `pending` order and takes no payment. Signed-in
 * shoppers get the address saved to their account; guest addresses are
 * validated but not stored.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check the highlighted fields." };
  const { lines, delivery } = parsed.data;

  const variants = await db
    .select({ id: productVariants.id, price: productVariants.price, salePrice: productVariants.salePrice, inStock: productVariants.inStock })
    .from(productVariants)
    .where(inArray(productVariants.id, lines.map((l) => l.variantId)));
  const byId = new Map(variants.map((v) => [v.id, v]));

  const priced = [];
  for (const l of lines) {
    const v = byId.get(l.variantId);
    if (!v || v.inStock < 1) return { ok: false, error: "An item in your bag is no longer available." };
    priced.push({ ...l, unit: Number(v.salePrice ?? v.price) });
  }
  const subtotal = priced.reduce((s, l) => s + l.unit * l.quantity, 0);
  const total = subtotal + shippingFor(subtotal);

  const user = await getCurrentUser();
  let shippingAddressId: string | null = null;
  if (user) {
    const [addr] = await db
      .insert(addresses)
      .values({
        userId: user.id,
        type: "shipping",
        line1: delivery.line1,
        line2: delivery.line2 || null,
        city: delivery.city,
        state: delivery.state,
        country: delivery.country,
        postalCode: delivery.postalCode,
      })
      .returning({ id: addresses.id });
    shippingAddressId = addr.id;
  }

  const [order] = await db
    .insert(orders)
    .values({ userId: user?.id ?? null, totalAmount: total.toFixed(2), shippingAddressId })
    .returning({ id: orders.id });
  await db.insert(orderItems).values(
    priced.map((l) => ({
      orderId: order.id,
      productVariantId: l.variantId,
      quantity: l.quantity,
      priceAtPurchase: l.unit.toFixed(2),
    })),
  );

  return { ok: true, orderId: order.id };
}
