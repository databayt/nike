/**
 * Loads the nike.com catalog snapshot (`data/nike-catalog.json`, captured from
 * nike's US product walls) into the store — real names, subtitles, colorways,
 * prices, sale prices, badges and CDN images, so every nike-mirrored link on
 * the site lands on a real product wall.
 *
 * Additive and idempotent: products are keyed by nike style code and skipped
 * when already present; every variant SKU carries the `NK-` prefix so the
 * snapshot can be found (or removed) in one query. The original placeholder
 * products are unpublished, never deleted.
 *
 *   pnpm db:seed:nike
 */
import { readFileSync } from "fs";
import { join } from "path";
import { and, eq, inArray, not, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  brands,
  categories,
  colors,
  genders,
  productImages,
  productVariants,
  products,
  sizes,
} from "@/lib/db/schema";

interface Colorway {
  code: string;
  color: string | null;
  hex: string | null;
  desc: string | null;
  price: number;
  initial: number;
  img: string;
}

interface SnapshotProduct {
  key: string;
  title: string;
  sub: string;
  type: "FOOTWEAR" | "APPAREL" | "EQUIPMENT" | string;
  badge: string | null;
  gender: "men" | "women" | "kids" | "unisex";
  walls: string[];
  colorways: Colorway[];
}

interface Snapshot {
  imagePrefix: string;
  products: SnapshotProduct[];
}

const log = (...a: unknown[]) => console.log("[seed:nike]", ...a);

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");

/** Size runs per product type — nike's US runs, trimmed to keep the variant count sane. */
const SIZE_RUNS = {
  shoes: ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13"],
  kidsShoes: ["3.5Y", "4Y", "4.5Y", "5Y", "5.5Y", "6Y", "6.5Y", "7Y"],
  apparel: ["XS", "S", "M", "L", "XL", "XXL"],
  equipment: ["One Size"],
} as const;

const SIZE_ORDER: Record<string, number> = Object.fromEntries(
  [
    ...SIZE_RUNS.kidsShoes,
    ...SIZE_RUNS.shoes,
    ...SIZE_RUNS.apparel,
    ...SIZE_RUNS.equipment,
  ].map((s, i) => [s, i + 1]),
);

/** Deterministic pseudo-stock so re-runs and reviews see the same shelf. */
function stockFor(sku: string) {
  let h = 0;
  for (const ch of sku) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const n = Math.abs(h) % 100;
  return n < 12 ? 0 : (n % 20) + 1;
}

async function ensure<T extends { id: string }>(
  rows: T[],
  key: (r: T) => string,
  wanted: { key: string; insert: () => Promise<T[]> }[],
) {
  const map = new Map(rows.map((r) => [key(r), r.id]));
  for (const w of wanted) {
    if (!map.has(w.key)) {
      const [row] = await w.insert();
      map.set(w.key, row.id);
      log("added", w.key);
    }
  }
  return map;
}

/** Neon over HTTP: retry transient network failures a few times before giving up. */
async function retry<T>(fn: () => Promise<T>, tries = 4): Promise<T> {
  for (let n = 1; ; n++) {
    try {
      return await fn();
    } catch (e) {
      if (n >= tries || !String((e as Error)?.message ?? e).match(/fetch failed|ECONNRESET|ETIMEDOUT|socket/i)) throw e;
      await new Promise((r) => setTimeout(r, 1000 * n));
    }
  }
}

async function main() {
  const snap: Snapshot = JSON.parse(
    readFileSync(join(process.cwd(), "src/lib/db/data/nike-catalog.json"), "utf8"),
  );
  const catalog = snap.products.filter((p) => ["FOOTWEAR", "APPAREL", "EQUIPMENT"].includes(p.type));
  log(`snapshot: ${catalog.length} products`);

  // 0. Schema — additive columns (see drizzle/0001_product_badge_style.sql).
  await db.execute(sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "badge" text`);
  await db.execute(sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "style_code" text`);

  // 1. Taxonomy.
  const genderIds = await ensure(await db.select().from(genders), (g) => g.slug, [
    { key: "kids", insert: () => db.insert(genders).values({ label: "Kids", slug: "kids" }).returning() },
  ]);
  const categoryIds = await ensure(
    await db.select().from(categories),
    (c) => c.slug,
    ["clothing", "accessories"].map((slug) => ({
      key: slug,
      insert: () =>
        db
          .insert(categories)
          .values({ name: slug[0].toUpperCase() + slug.slice(1), slug })
          .returning(),
    })),
  );
  const brandIds = await ensure(await db.select().from(brands), (b) => b.slug, [
    { key: "jordan", insert: () => db.insert(brands).values({ name: "Jordan", slug: "jordan" }).returning() },
  ]);

  const allSizes = [...new Set(Object.values(SIZE_RUNS).flat())];
  const sizeIds = await ensure(
    await db.select().from(sizes),
    (s) => s.slug,
    allSizes.map((name) => ({
      key: slugify(name),
      insert: () =>
        db
          .insert(sizes)
          .values({ name, slug: slugify(name), sortOrder: SIZE_ORDER[name] })
          .returning(),
    })),
  );

  const colorHex = new Map<string, string>();
  for (const p of catalog)
    for (const c of p.colorways) if (c.color && !colorHex.has(c.color)) colorHex.set(c.color, `#${c.hex ?? "777777"}`);
  const colorSlug = (label: string) => (label === "Grey" ? "gray" : slugify(label));
  const colorIds = await ensure(
    await db.select().from(colors),
    (c) => c.slug,
    [...colorHex].map(([name, hex]) => ({
      key: colorSlug(name),
      insert: () => db.insert(colors).values({ name, slug: colorSlug(name), hexCode: hex }).returning(),
    })),
  );

  // 2. Placeholders out of the wall (unpublished, not deleted).
  const nikeSkus = db
    .select({ id: productVariants.productId })
    .from(productVariants)
    .where(sql`${productVariants.sku} like 'NK-%'`);
  const hidden = await db
    .update(products)
    .set({ isPublished: false })
    .where(and(eq(products.isPublished, true), not(inArray(products.id, nikeSkus))))
    .returning({ id: products.id });
  if (hidden.length) log(`unpublished ${hidden.length} placeholder products`);

  // 3. Products — skip style codes already fully loaded; clear half-written ones.
  const loaded = await db
    .select({ id: products.id, code: products.styleCode, variants: sql<number>`count(${productVariants.id})` })
    .from(products)
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .where(sql`${products.styleCode} is not null`)
    .groupBy(products.id, products.styleCode);
  const partial = loaded.filter((r) => Number(r.variants) === 0).map((r) => r.id);
  if (partial.length) {
    await db.delete(products).where(inArray(products.id, partial));
    log(`cleared ${partial.length} half-written products`);
  }
  const existing = new Set(loaded.filter((r) => Number(r.variants) > 0).map((r) => r.code));
  const todo = catalog.filter((p) => !existing.has(p.colorways[0].code));
  log(`${todo.length} new, ${catalog.length - todo.length} already present`);

  const base = Date.now();
  let done = 0;
  for (const [i, p] of todo.entries()) {
    const isKids = p.gender === "kids";
    const category =
      p.type === "FOOTWEAR" ? "shoes" : p.type === "APPAREL" ? "clothing" : "accessories";
    const run =
      p.type === "FOOTWEAR"
        ? isKids
          ? SIZE_RUNS.kidsShoes
          : SIZE_RUNS.shoes
        : p.type === "APPAREL"
          ? SIZE_RUNS.apparel
          : SIZE_RUNS.equipment;
    const isJordan = /\bjordan\b/i.test(p.title) || p.walls.includes("jordan-37eef");

    const [row] = await retry(() => db
      .insert(products)
      .values({
        name: p.title,
        description: p.sub,
        categoryId: categoryIds.get(category) ?? null,
        genderId: genderIds.get(p.gender) ?? null,
        brandId: brandIds.get(isJordan ? "jordan" : "nike") ?? null,
        isPublished: true,
        badge: p.badge,
        styleCode: p.colorways[0].code,
        // Preserve nike's wall order under the default "newest" sort.
        createdAt: new Date(base - i * 1000),
        updatedAt: new Date(base - i * 1000),
      })
      .returning({ id: products.id }));

    const variants = p.colorways.flatMap((c) =>
      run.map((size) => {
        const sku = `NK-${c.code}-${slugify(size)}`;
        return {
          productId: row.id,
          sku,
          price: String(c.initial),
          salePrice: c.price < c.initial ? String(c.price) : null,
          colorId: colorIds.get(colorSlug(c.color ?? "Black"))!,
          sizeId: sizeIds.get(slugify(size))!,
          inStock: stockFor(sku),
        };
      }),
    );
    const inserted = await retry(() => db
      .insert(productVariants)
      .values(variants)
      .onConflictDoNothing({ target: productVariants.sku })
      .returning({ id: productVariants.id, sku: productVariants.sku }));
    const bySku = new Map(inserted.map((v) => [v.sku, v.id]));

    const url = (img: string) => (img.startsWith("http") ? img : snap.imagePrefix + img);
    const images = [
      // Product-level hero (what the wall shows).
      { productId: row.id, variantId: null, url: url(p.colorways[0].img), sortOrder: 0, isPrimary: true },
      // One shot per colorway, tied to that colorway's first size.
      ...p.colorways.map((c, ci) => ({
        productId: row.id,
        variantId: bySku.get(`NK-${c.code}-${slugify(run[0])}`) ?? null,
        url: url(c.img),
        sortOrder: ci + 1,
        isPrimary: false,
      })),
    ].filter((im) => im.url);
    await retry(() => db.insert(productImages).values(images));

    const defaultVariant = bySku.get(`NK-${p.colorways[0].code}-${slugify(run[Math.floor(run.length / 2)])}`);
    if (defaultVariant)
      await retry(() => db.update(products).set({ defaultVariantId: defaultVariant }).where(eq(products.id, row.id)));

    if (++done % 25 === 0) log(`${done}/${todo.length}`);
  }

  log(`done — ${done} products loaded`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("[seed:nike:error]", e);
    process.exit(1);
  });
