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
  const search = (term: string) => products(lang, `search=${encodeURIComponent(term)}`);
  const jordan = search("jordan");
  const skims = search("nikeskims");
  const sport = products(lang);

  // Column titles + leaves mirror nike.com's desktop menus as of 2026-10-14.
  return [
    {
      key: "men",
      label: "Men",
      href: `/${lang}/men`,
      columns: [
        col("New & Featured", men, ["New Arrivals", "Best Sellers", "Latest Drops", "Hybrid RN", "Nike Sportswear", "SNKRS Launch Calendar", "Shop All Sale"]),
        col("Shoes", men, ["All Shoes", "Basketball", "Jordan", "Running", "Sportswear", "Training & Gym", "Custom Shoes"]),
        col("Clothing", men, ["All Clothing", "Fleece", "Hoodies & Sweatshirts", "Jackets & Vests", "Pants", "Shorts", "Tops & Graphic Tees"]),
        col("Accessories", men, ["All Accessories", "Bags & Backpacks", "Hats & Headwear", "Socks", "Sunglasses"]),
      ],
    },
    {
      key: "women",
      label: "Women",
      href: women,
      columns: [
        col("New & Featured", women, ["New Arrivals", "Best Sellers", "Hybrid RN", "Nike Sportswear", "SNKRS Launch Calendar", "Shop All Sale"]),
        col("Shoes", women, ["All Shoes", "Basketball", "Jordan", "Running", "Sportswear", "Training & Gym", "Custom Shoes"]),
        col("Clothing", women, ["All Clothing", "Bras", "Fleece", "Hoodies & Sweatshirts", "Jackets & Vests", "Leggings", "Matching Sets", "Pants", "Shorts", "Tops & Graphics Tees"]),
        col("Accessories", women, ["All Accessories", "Bags & Backpacks", "Hats & Headwear", "Socks", "Sunglasses"]),
        col("Shop by Color", women, ["Dark Neutrals", "Purple Pulse", "Spruce Greens", "Very Berry", "Warm Neutrals"]),
      ],
    },
    {
      key: "kids",
      label: "Kids",
      href: kids,
      columns: [
        col("New & Featured", kids, ["New Arrivals", "Best Sellers", "Nike Sportswear", "Nike x LEGO®", "Teens Collection", "Shop All Sale"]),
        col("Shoes", kids, ["All Shoes", "Big Kids (7-12 yrs)", "Little Kids (3-7 yrs)", "Baby & Toddler (0-3 yrs)", "Basketball", "Jordan", "Running", "Sportswear"]),
        col("Clothing", kids, ["All Clothing", "Big Kids (7-12 yrs)", "Little Kids (3-7 yrs)", "Baby & Toddler (0-3 yrs)", "Bras & Tights", "Fleece", "Hoodies & Sweatshirts", "Jackets & Vests", "Pants", "Shorts", "Tops & Graphics Tees"]),
        col("Accessories", kids, ["All Accessories", "Bags & Backpacks", "Hats & Headwear", "Socks"]),
        col("Shop By Sport", kids, ["Basketball", "Gymnastics", "Fan Gear", "Football", "Running", "Soccer"]),
      ],
    },
    {
      key: "jordan",
      label: "Jordan",
      href: jordan,
      columns: [
        col("New & Featured", jordan, ["New Arrivals", "Best Sellers", "Heat Check", "Jordan Brand x Space Jam", "Shop All Sale"]),
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
        col("All Clothing", skims, ["Bras", "Jackets", "Leggings", "Shorts", "Tops and Tanks", "Accessories"]),
        col("Shop by Color", skims, ["Carob Brown", "Citrine", "Ivory", "Obsidian"]),
        col("Shop by Material", skims, ["Airy", "Matte", "Performance Cotton Blend", "Satin Shine", "Seamless", "Stretch Knit 2.0", "Stretch Nylon", "Studio Stretch", "Weightless"]),
        col("NikeSKIMS Guides", skims, ["NikeSKIMS Lookbook", "NikeSKIMS Bra Guide", "NikeSKIMS Fabric Guide"]),
      ],
    },
    {
      key: "sport",
      label: "Sport",
      href: sport,
      columns: [
        col("Basketball", search("basketball"), ["Shoes", "Apparel", "Equipment", "Kobe", "Jordan"]),
        col("Court", search("tennis"), ["Tennis", "Pickleball", "Shoes", "Apparel", "Equipment"]),
        col("Soccer", search("soccer"), ["Cleats", "Indoor Footwear", "Apparel", "Equipment"]),
        col("Training", search("training"), ["Prime", "Train", "Hybrid", "Strength", "Studio", "Recover"]),
        col("Running", search("running"), ["Road", "Race", "Trail", "Track & Field", "Apparel", "Running Shoe Finder"]),
        col("Golf", search("golf"), ["Shoes", "Apparel", "Equipment"]),
        col("More Sports", sport, ["Baseball", "Cheer", "Football", "Gymnastics", "Lacrosse", "Skateboarding", "Softball", "Sportswear", "Swimming", "Volleyball", "Wrestling"]),
        col("Locker Room", search("jersey"), ["NBA Gear", "NFL Gear", "MLB Gear", "WNBA Gear", "NCAA Gear", "NWSL Gear", "Soccer Club Gear", "Federations Gear"]),
        col("All Conditions Gear", search("acg"), ["Trail Run", "Hike", "Explore"]),
      ],
    },
    { key: "sportswear", label: "Sportswear", href: search("sportswear") },
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
