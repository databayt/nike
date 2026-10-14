# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack
pnpm dev

# Build production version
pnpm build

# Production server
pnpm start

# Linting
pnpm lint
```

### Database Operations
```bash
pnpm db:generate   # Generate new migration files
pnpm db:migrate    # Apply migrations to database
pnpm db:push       # Push schema directly to database (development)
pnpm db:studio     # Open Drizzle Studio (database GUI)
pnpm db:seed       # Seed database with sample data
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 16 with App Router, Turbopack, and proxy.ts
- **Database**: PostgreSQL via Neon with Drizzle ORM
- **Authentication**: Better Auth with email/password support
- **State Management**: Zustand for client-side state
- **Styling**: Tailwind CSS v4
- **Type Safety**: TypeScript with Zod validation
- **Package Manager**: pnpm

### Environment Setup
Requires `.env.local` (not `.env`) with:
- `DATABASE_URL`: PostgreSQL connection string (Neon)
- `BETTER_AUTH_SECRET`: Authentication secret key
- `BETTER_AUTH_URL`: Application base URL

Use `vercel link` then `vercel env pull` to get environment variables from Vercel.

### Internationalization Architecture

The app uses Next.js 16's `proxy.ts` pattern (replaces middleware.ts) for locale routing:

```
src/proxy.ts                                    # Main proxy entry point
src/components/internationalization/
├── proxy.ts                                    # Locale detection & redirect logic
├── config.ts                                   # Locale config (en, ar) with RTL support
├── dictionaries.ts                             # Dictionary loading
├── en.json / ar.json                          # Translation files
└── use-locale.ts                              # Client-side locale hook
```

**Route Structure**: All pages under `src/app/[lang]/` receive locale as a dynamic param.

**Locale Detection Flow**:
1. Check `NEXT_LOCALE` cookie for user preference
2. Parse `Accept-Language` header via negotiator
3. Redirect to localized URL (e.g., `/` → `/en`)

### Database Schema

Uses UUID primary keys throughout. Key tables:

**Auth**: `users`, `sessions`, `accounts`, `verifications` (Better Auth managed)
**Commerce**: `products`, `product_variants`, `product_images`, `carts`, `cart_items`, `orders`, `order_items`
**Taxonomy**: `brands`, `categories`, `genders`, `colors`, `sizes`
**Guest**: `guests` (cart persistence before auth)

Schema files in `src/lib/db/schema/` exported via index.ts.

### Key Directories

```
src/
├── app/[lang]/          # Localized pages (route groups: (root), (auth))
├── lib/
│   ├── db/schema/       # Drizzle schema files
│   ├── actions/         # Server actions for data fetching
│   ├── auth/            # Better Auth config and actions
│   └── utils/query.ts   # Product filter parsing (NormalizedProductFilters)
├── components/          # UI components with barrel exports (index.ts)
└── proxy.ts             # Next.js 16 proxy (locale routing)
```

### Data Flow Patterns

**Product Filtering** (`src/lib/utils/query.ts`):
- URL params → `NormalizedProductFilters` → SQL joins in `getAllProducts()`
- Supports: search, gender, size, color, brand, category, price ranges

**Auth Flow**:
- Better Auth with UUID-based sessions
- Guest sessions migrate to user accounts on login
- Config in `src/lib/auth/index.ts` with Drizzle adapter

## Important Notes

- All IDs are UUIDs (not auto-incrementing integers)
- Product images in `static/uploads/shoes/` with UUID-prefixed filenames
- Schema changes: run `pnpm db:generate` then `pnpm db:push`
- Drizzle config expects schema at `src/lib/db/schema/index.ts`
- Port: Runs on `localhost:3002` (bypassing the rule of 3000 because we are cloning Nike and running on 3000/3001 is not preferred here)
- Layout params use `string` type (Next.js 16 stricter typing) then cast to `Locale`
