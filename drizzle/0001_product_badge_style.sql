-- nike catalog snapshot: card badge + style code (additive, nullable).
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "badge" text;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "style_code" text;
