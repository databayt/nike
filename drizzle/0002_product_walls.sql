-- nike wall membership per product (nike /w slugs), backfilled by `pnpm db:seed:walls`.
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "walls" text[] NOT NULL DEFAULT '{}';
