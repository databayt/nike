import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import type { Locale } from "@/components/internationalization/config";
import { buildFooterNav, menDict } from "./men-data";

interface FooterNavProps {
  dictionary: Dictionary;
  lang: Locale;
}

/**
 * The four-column SEO link block (Men's Shoes / Clothing / Gear / Featured)
 * that sits between the page content and the global site footer.
 */
export default function FooterNav({ dictionary, lang }: FooterNavProps) {
  const columns = buildFooterNav(lang);
  const t = menDict(dictionary);
  const titles = t.footerNav ?? {};

  return (
    <section
      aria-label={t.a11y?.footerNav || "Men's categories"}
      className="mt-14 border-t border-light-300 px-4 py-10 sm:px-6 lg:px-10"
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        {columns.map((column) => (
          <div key={column.titleKey}>
            <h3 className="mb-3 text-caption font-medium text-dark-900">
              {titles[column.titleKey] || column.titleKey}
            </h3>
            <ul className="space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-caption text-dark-700 transition-colors hover:text-dark-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
