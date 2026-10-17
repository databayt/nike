import type { MetadataRoute } from "next";

/** Portfolio showcase — keep it out of search results. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
