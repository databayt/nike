import Link from "next/link";
import { type Dictionary } from "@/components/internationalization/dictionaries";
import { type Locale } from "@/components/internationalization/config";

interface FooterProps {
  dictionary: Dictionary;
  lang: Locale;
}

/**
 * nike.com's global footer (2026-10): four link columns — Resources / Help /
 * Company / Promotions & Discounts — with the country picker pinned to the end,
 * then the legal bar. Desktop is a 271px column grid; below 960px the columns
 * collapse into accordions with Resources open, as on nike.com. Every value is
 * the computed style read off the live page (14/21 medium, #111 titles, #707072
 * links). Column copy keeps Nike's English brand chrome; copyright + legal
 * resolve from the dictionary.
 */

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width={16} height={16} fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.5} />
    <path
      stroke="currentColor"
      strokeWidth={1.5}
      d="M3 12h18M12 3c2.5 2.5 3.5 5.8 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.8-3.5-9s1-6.5 3.5-9Z"
    />
  </svg>
);

const Chevron = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" aria-hidden className={className}>
    <path stroke="currentColor" strokeWidth={1.5} d="M18.966 8.476L12 15.443 5.033 8.476" />
  </svg>
);

const PRIVACY_CHOICES_ICON =
  "https://static.nike.com/a/images/w_960,c_limit/3732c58b-d0ad-4c3c-898c-c4b90193312b/image.png";

const COLUMNS = [
  {
    title: "Resources",
    links: ["Gift Cards", "Corporate Sales", "Find a Store", "Membership", "Product News", "Magazine", "Site Feedback"],
  },
  {
    title: "Help",
    links: [
      "Get Help",
      "Order Status",
      "Shipping and Delivery",
      "Returns",
      "Order Cancellation",
      "Payment Options",
      "Gift Card Balance",
      "Contact Us",
    ],
  },
  {
    title: "Company",
    links: ["About Nike", "News", "Careers", "Investors", "Purpose", "Sustainability", "Accessibility"],
  },
  {
    title: "Promotions & Discounts",
    links: ["Student", "Military", "Teacher", "First Responders & Medical Professionals", "Birthday"],
  },
];

const TITLE = "text-[14px] font-medium leading-[21px] text-[#111]";
const LINK = "text-[14px] font-medium leading-[21px] text-[#707072] transition-colors hover:text-[#111]";

export default function Footer({ dictionary }: FooterProps) {
  const legal = dictionary.footer.legal;

  const country = (
    <span className={`flex items-center gap-2 ${LINK}`}>
      <GlobeIcon />
      United States
    </span>
  );

  return (
    <footer className="bg-white px-6 pb-12 pt-6 lg:px-12 lg:pt-12">
      <div className="lg:border-t lg:border-[#E5E5E5] lg:pt-[60px]">
        {/* Desktop: column grid + country on the end. */}
        <div className="hidden lg:grid lg:grid-cols-[repeat(4,271px)_1fr]">
          {COLUMNS.map((col) => (
            <div key={col.title} className="pe-6">
              <h3 className={TITLE}>{col.title}</h3>
              <ul className="mt-9 space-y-3">
                {col.links.map((label) => (
                  <li key={label}>
                    <Link href="#" className={LINK}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex justify-end">{country}</div>
        </div>

        {/* Mobile: accordions, Resources open. */}
        <div className="lg:hidden">
          {COLUMNS.map((col, i) => (
            <details key={col.title} open={i === 0} className="group border-b border-[#E5E5E5]">
              <summary className="flex cursor-pointer list-none items-center justify-between py-6 [&::-webkit-details-marker]:hidden">
                <h3 className={TITLE}>{col.title}</h3>
                <Chevron className="transition-transform group-open:rotate-180" />
              </summary>
              <ul className="pb-6">
                {col.links.map((label) => (
                  <li key={label}>
                    <Link href="#" className={`block py-1.5 ${LINK}`}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
          <div className="border-b border-[#E5E5E5] py-6">{country}</div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="mt-6 flex flex-col gap-2.5 lg:mt-[74px] lg:flex-row lg:flex-wrap lg:items-center lg:gap-6">
        <span className={LINK}>{dictionary.footer.copyright}</span>
        <button type="button" className={`flex items-center ${LINK}`}>
          {legal.guides}
          <Chevron className="ms-1 size-4" />
        </button>
        {[legal.termsOfSale, legal.termsOfUse, "Nike Privacy Policy"].map((label) => (
          <Link key={label} href="#" className={LINK}>
            {label}
          </Link>
        ))}
        <Link href="#" className={`flex items-center ${LINK}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- nike's CCPA opt-out glyph */}
          <img src={PRIVACY_CHOICES_ICON} alt="" width={28} height={22} className="h-[22px] w-7" />
          Your Privacy Choices
        </Link>
        <Link href="#" className={LINK}>
          CA Supply Chains Act
        </Link>
      </div>
    </footer>
  );
}
