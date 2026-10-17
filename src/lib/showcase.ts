/**
 * ni.databayt.org is a public portfolio showcase of this clone. In any
 * production build, accounts are switched off and orders are not stored, so
 * the public site can never collect a password or personal data. Local dev
 * (`pnpm dev`) keeps everything working.
 */
export const SHOWCASE = process.env.NODE_ENV === "production";
