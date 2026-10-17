/**
 * nike.com/w product walls captured in the catalog snapshot. The slug is
 * nike's own URL slug (its trailing token is nike's facet hash), so links
 * read like nike's: /w/mens-shoes-nik1zy7ok.
 */
export interface Wall {
  slug: string;
  title: string;
}

export const WALLS: Wall[] = [
  { slug: "new-3n82y", title: "New & Featured" },
  { slug: "mens-shoes-nik1zy7ok", title: "Men's Shoes" },
  { slug: "mens-clothing-6ymx6znik1", title: "Men's Clothing" },
  { slug: "womens-shoes-5e1x6zy7ok", title: "Women's Shoes" },
  { slug: "womens-clothing-5e1x6z6ymx6", title: "Women's Clothing" },
  { slug: "kids-shoes-v4dhzy7ok", title: "Kids' Shoes" },
  { slug: "kids-clothing-6ymx6zv4dh", title: "Kids' Clothing" },
  { slug: "jordan-37eef", title: "Jordan" },
  { slug: "air-max-shoes-a6d8hzy7ok", title: "Air Max Shoes" },
  { slug: "air-force-1-shoes-5sj3yzy7ok", title: "Air Force 1 Shoes" },
  { slug: "dunk-shoes-90aohzy7ok", title: "Dunk Shoes" },
  { slug: "running-shoes-37v7jzy7ok", title: "Running Shoes" },
  { slug: "pegasus-shoes-8nexhzy7ok", title: "Pegasus Running Shoes" },
  { slug: "vomero-shoes-7gee1zy7ok", title: "Vomero Running Shoes" },
  { slug: "basketball-shoes-3glsmzy7ok", title: "Basketball Shoes" },
  { slug: "hybrid-training-8wvhh", title: "Hybrid Training" },
  { slug: "metcon-training-gym-shoes-3yxqsz58jtozy7ok", title: "Metcon Training Shoes" },
  { slug: "mercurial-soccer-shoes-1gdj0z4f1bzy7ok", title: "Mercurial Soccer Cleats" },
  { slug: "phantom-soccer-shoes-1gdj0z1msyxzy7ok", title: "Phantom Soccer Cleats" },
  { slug: "tiempo-soccer-shoes-1gdj0z20w7kzy7ok", title: "Tiempo Soccer Cleats" },
  { slug: "acg-9wwbq", title: "ACG" },
  { slug: "nikeskims-b2asd", title: "NikeSKIMS" },
  { slug: "caitlin-clark-b0s81", title: "Caitlin Clark Collection" },
  { slug: "aja-wilson-4yj6f", title: "A'ja Wilson Collection" },
  { slug: "nfl-9bklc", title: "NFL" },
  { slug: "mlb-b0g9x", title: "MLB" },
  { slug: "accessories-equipment-awwpw", title: "Accessories & Equipment" },
  { slug: "sale-3yaep", title: "Sale" },
];

const BY_SLUG = new Map(WALLS.map((w) => [w.slug, w]));

export const getWall = (slug: string) => BY_SLUG.get(slug);

export const wallHref = (lang: string, slug: string) => `/${lang}/w/${slug}`;
