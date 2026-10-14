import Link from "next/link";
import { type Dictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";

interface FooterProps {
  dictionary: Dictionary;
  lang: Locale;
}

/**
 * nike.com's global footer: a light four-column link grid (Resources / Help /
 * Company / Promotions & Discounts), a country/region selector + copyright on
 * the start side of the legal bar, and the legal links on the end side. Column
 * labels keep Nike's English copy (brand chrome); copyright/legal resolve from
 * the dictionary so they localize. Utility links resolve to `#` — this clone has
 * no marketing pages behind them.
 */
const GlobeIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.3} />
    <path
      stroke="currentColor"
      strokeWidth={1.3}
      d="M3 12h18M12 3c2.5 2.5 3.5 5.8 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.8-3.5-9s1-6.5 3.5-9Z"
    />
  </svg>
);

export default function Footer({ dictionary }: FooterProps) {
  const legal = dictionary.footer.legal;

  const columns = [
    {
      title: "Resources",
      links: ["Gift Cards", "Find a Store", "Become a Member", "Nike Journal", "Send Us Feedback"],
    },
    {
      title: "Help",
      links: ["Get Help", "Order Status", "Shipping & Delivery", "Returns", "Payment Options", "Contact Us"],
    },
    {
      title: "Company",
      links: ["About Nike", "News", "Careers", "Investors", "Sustainability", "Purpose"],
    },
    {
      title: "Promotions & Discounts",
      links: ["Student", "Military", "Teacher", "First Responders & Medical Professionals", "Birthday"],
    },
  ];

  const legalLinks = [
    legal.guides,
    legal.termsOfSale,
    legal.termsOfUse,
    legal.privacyPolicy,
    "Your Privacy Choices",
    "CA Supply Chains Act",
  ];

  return (
    <footer className="bg-light-100 text-dark-900">
      <div className="px-4 pb-8 pt-12 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-caption font-medium uppercase tracking-wide text-dark-700">
                {col.title}
              </h3>
              <ul className="space-y-3.5">
                {col.links.map((label) => (
                  <li key={label}>
                    <Link
                      href="#"
                      className="text-caption text-dark-700 transition-colors hover:text-dark-900"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Country/region selector — pinned to the inline-end on wide screens. */}
          <div className="col-span-2 flex items-start sm:col-span-4 lg:col-span-1 lg:justify-end">
            <button
              type="button"
              className="flex items-center gap-2 text-caption font-medium text-dark-900 transition-colors hover:text-dark-700"
            >
              <GlobeIcon />
              United States
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-10 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-3 border-t border-light-300 pt-6 text-footnote text-dark-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5">
              <GlobeIcon size={14} />
              United States
            </span>
            <span>{dictionary.footer.copyright}</span>
          </div>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalLinks.map((label) => (
              <li key={label}>
                <Link href="#" className="transition-colors hover:text-dark-900">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
