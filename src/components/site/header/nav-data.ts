import type { Locale } from "@/components/internationalization/config";

/**
 * Nike commerce-header-v2 navigation model.
 *
 * The structure mirrors nike.com 1:1 (top bar + mega-menu columns); leaf links
 * are routed into this app's `/products` page with sensible filters so the clone
 * stays clickable. Top-level + top-bar labels carry an i18n `key` resolved from
 * the dictionary; mega-menu leaves keep Nike's English copy.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavColumn {
  title: string;
  href: string;
  links: NavLink[];
}

export interface NavItem {
  /** Dictionary key under `header` for the visible label, when translatable. */
  key?: string;
  label: string;
  href: string;
  columns?: NavColumn[];
}

const products = (lang: Locale, query?: string) =>
  `/${lang}/products${query ? `?${query}` : ""}`;

/** Build a column whose links all resolve to the same destination. */
const col = (title: string, href: string, labels: string[]): NavColumn => ({
  title,
  href,
  links: labels.map((label) => ({ label, href })),
});

export function buildMainNav(lang: Locale): NavItem[] {
  const men = products(lang, "gender=men");
  const women = products(lang, "gender=women");
  const kids = products(lang, "gender=unisex");
  const jordan = products(lang, "search=jordan");
  const skims = products(lang);
  const sale = products(lang);

  return [
    {
      key: "men",
      label: "Men",
      href: men,
      columns: [
        col("Limited Time", men, ["Extra 20% Off Select Styles"]),
        col("New & Featured", men, [
          "New Arrivals",
          "Best Sellers",
          "Latest Drops",
          "Father's Day Shop",
          "SNKRS Launch Calendar",
        ]),
        col("Shoes", men, [
          "All Shoes",
          "Basketball",
          "Father's Day Shoes",
          "Jordan",
          "Lifestyle",
          "Running",
          "Sandals & Slides",
          "Soccer",
          "Training & Gym",
          "Custom Shoes",
        ]),
        col("Clothing", men, [
          "All Clothing",
          "Father's Day Clothing",
          "Jackets & Vests",
          "Pants",
          "Shorts",
          "Sweats & Sweatshirts",
          "Swim",
          "Tops & Graphic Tees",
        ]),
        col("Accessories", men, [
          "All Accessories",
          "Bags & Backpacks",
          "Hats & Headwear",
          "Socks",
          "Sunglasses",
        ]),
        col("Shop By Sport", men, [
          "All Conditions Gear",
          "Baseball",
          "Basketball",
          "Fan Gear",
          "Football",
          "Golf",
          "Locker Room",
          "Running",
          "Skateboarding",
          "Soccer",
          "Tennis",
          "Training",
        ]),
      ],
    },
    {
      key: "women",
      label: "Women",
      href: women,
      columns: [
        col("Limited Time", women, ["Extra 20% Off Select Styles"]),
        col("New & Featured", women, [
          "New Arrivals",
          "Best Sellers",
          "Father's Day Shop",
          "SNKRS Launch Calendar",
        ]),
        col("Shop by Color", women, [
          "Crimson",
          "Dark Neutrals",
          "Light Magenta",
          "Orange Pulse",
          "Steam Green",
          "University Blue",
          "Warm Neutrals",
        ]),
        col("Shoes", women, [
          "All Shoes",
          "Basketball",
          "Jordan",
          "Lifestyle",
          "Running",
          "Sandals & Slides",
          "Soccer",
          "Training & Gym",
          "Custom Shoes",
        ]),
        col("Clothing", women, [
          "All Clothing",
          "Bras",
          "Leggings",
          "Matching Sets",
          "Jackets & Vests",
          "Pants",
          "Shorts",
          "Skirts & Dresses",
          "Sweats & Sweatshirts",
          "Swim",
          "Tops & Graphic Tees",
        ]),
        col("Shop By Sport", women, [
          "All Conditions Gear",
          "Basketball",
          "Cheer",
          "Fan Gear",
          "Golf",
          "Locker Room",
          "Running",
          "Soccer",
          "Softball",
          "Tennis",
          "Training",
          "Volleyball",
        ]),
      ],
    },
    {
      key: "kids",
      label: "Kids",
      href: kids,
      columns: [
        col("Limited Time", kids, ["Extra 20% Off Select Styles"]),
        col("New & Featured", kids, [
          "New Arrivals",
          "Best Sellers",
          "Father's Day Shop",
          "Nike x LEGO® Collection",
          "Teens",
        ]),
        col("All Shoes", kids, [
          "Big Kids (7-15 yrs)",
          "Little Kids (3-7 yrs)",
          "Baby & Toddler (0-3 yrs)",
          "Basketball",
          "Jordan",
          "Lifestyle",
          "Running",
          "Sandals & Slides",
          "Soccer",
        ]),
        col("All Clothing", kids, [
          "Big Kids (7-15 yrs)",
          "Little Kids (3-7 yrs)",
          "Baby & Toddler (0-3 yrs)",
          "Bras & Tights",
          "Jackets & Vests",
          "Pants",
          "Shorts",
          "Skirts & Dresses",
          "Sweats & Sweatshirts",
          "Swim",
          "Tops & Graphic Tees",
        ]),
        col("Accessories", kids, [
          "All Accessories",
          "Bags & Backpacks",
          "Hats & Headwear",
          "Socks",
        ]),
        col("Shop By Sport", kids, [
          "Basketball",
          "Gymnastics",
          "Fan Gear",
          "Football",
          "Running",
          "Soccer",
        ]),
      ],
    },
    {
      key: "jordan",
      label: "Jordan",
      href: jordan,
      columns: [
        col("Limited Time", jordan, ["Extra 20% Off Select Styles"]),
        col("New & Featured", jordan, [
          "New Arrivals",
          "Best Sellers",
          "Heat Check",
          "Father's Day Shop",
          "Jordan x Brasil Futebol",
        ]),
        col("Men", jordan, ["Shop All", "Shoes", "AJ1", "Clothing", "Accessories"]),
        col("Women", jordan, ["Shop All", "Shoes", "AJ1", "Clothing", "Accessories"]),
        col("Kids", jordan, ["Shop All", "Shoes", "AJ1", "Clothing", "Accessories"]),
        col("Sport", jordan, ["Basketball", "Golf", "Cleats"]),
      ],
    },
    {
      key: "nikeskims",
      label: "NikeSKIMS",
      href: skims,
      columns: [
        col("All Shoes", skims, ["NikeSKIMS Rift"]),
        col("All Clothing", skims, [
          "Bras",
          "Jackets",
          "Leggings",
          "Shorts",
          "Tops and Tanks",
          "Accessories",
        ]),
        col("Shop by Color", skims, [
          "Dark Sepia",
          "Ditsy Floral",
          "Ivory",
          "Obsidian",
          "Phoenix",
        ]),
        col("Shop by Material", skims, [
          "Shine",
          "Matte",
          "Airy",
          "Seamless",
          "Stretch Knit",
          "Studio Stretch",
        ]),
        col("NikeSKIMS Guides", skims, [
          "NikeSKIMS Lookbook",
          "NikeSKIMS Bra Guide",
          "NikeSKIMS Fabric Guide",
        ]),
      ],
    },
    {
      key: "sale",
      label: "Sale",
      href: sale,
      columns: [
        col("Limited Time", sale, ["Extra 20% Off Select Styles"]),
        col("Men", men, ["Shoes", "Clothing", "Accessories", "Shop All"]),
        col("Women", women, ["Shoes", "Clothing", "Accessories", "Shop All"]),
        col("Kids", kids, ["Shoes", "Clothing", "Accessories", "Shop All"]),
        col("Jordan", jordan, ["Shoes", "Clothing", "Accessories", "Shop All"]),
      ],
    },
    {
      key: "soccer",
      label: "Nike Soccer",
      href: products(lang, "search=soccer"),
    },
  ];
}

export interface BrandLink {
  label: string;
  href: string;
  icon: "jordan" | "converse";
}

export function buildBrandNav(lang: Locale): BrandLink[] {
  return [
    { label: "Jordan", href: products(lang, "search=jordan"), icon: "jordan" },
    { label: "Converse", href: products(lang, "search=converse"), icon: "converse" },
  ];
}

export interface UserNavItem {
  key: string;
  label: string;
  href: string;
  links?: NavLink[];
}

export function buildUserNav(lang: Locale): UserNavItem[] {
  return [
    { key: "findAStore", label: "Find a Store", href: "#" },
    {
      key: "help",
      label: "Help",
      href: "#",
      links: [
        { label: "Order Status", href: "#" },
        { label: "Shipping & Delivery", href: "#" },
        { label: "Returns", href: "#" },
        { label: "Order Cancellation", href: "#" },
        { label: "Size Charts", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "Membership", href: "#" },
        { label: "Promotions & Discounts", href: "#" },
        { label: "Product Advice", href: "#" },
        { label: "Send Us Feedback", href: "#" },
      ],
    },
    { key: "joinUs", label: "Join Us", href: `/${lang}/sign-up` },
    { key: "signIn", label: "Sign In", href: `/${lang}/sign-in` },
  ];
}

export const POPULAR_SEARCH_TERMS = [
  "mercurial",
  "soccer jerseys",
  "air max",
  "jordan",
  "nike mind",
  "basketball shoes",
  "soccer cleats",
  "jordan 4",
] as const;
