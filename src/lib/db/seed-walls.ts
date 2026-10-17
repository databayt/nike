/**
 * Backfills products.walls from the catalog snapshot (keyed by nike style
 * code) so /w/<slug> can list a wall in nike's own order. Additive,
 * idempotent: re-running rewrites the same arrays.
 *
 *   pnpm db:seed:walls
 */
import { readFileSync } from "fs";
import { join } from "path";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

interface Snapshot {
  products: { walls: string[]; colorways: { code: string }[] }[];
}

async function main() {
  const snap: Snapshot = JSON.parse(readFileSync(join(process.cwd(), "src/lib/db/data/nike-catalog.json"), "utf8"));
  await db.execute(sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "walls" text[] NOT NULL DEFAULT '{}'`);

  const rows = snap.products
    .filter((p) => p.colorways[0])
    .map((p) => ({ code: p.colorways[0].code, walls: [...new Set(p.walls)] }));

  // One statement: unnest the (code, walls) pairs and join on style code.
  const values = sql.join(
    rows.map((r) => sql`(${r.code}, ${`{${r.walls.join(",")}}`}::text[])`),
    sql`, `,
  );
  const res = await db.execute(sql`
    UPDATE products p SET walls = v.walls
    FROM (VALUES ${values}) AS v(code, walls)
    WHERE p.style_code = v.code
  `);
  console.log("[seed:walls] updated", (res as { rowCount?: number }).rowCount ?? "?", "of", rows.length);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("[seed:walls:error]", e);
    process.exit(1);
  });
