import Link from "next/link";
import type { NavColumn } from "./nav-data";

interface MegaMenuProps {
  columns: NavColumn[];
  /** Accessible name, e.g. "Men menu". */
  label: string;
}

/**
 * Full-width dropdown panel anchored to the header. Visibility is driven purely
 * by the parent `li.group` via `group-hover` / `group-focus-within`, so it opens
 * on hover (mouse) and on keyboard focus without any client JS.
 */
export default function MegaMenu({ columns, label }: MegaMenuProps) {
  return (
    <div
      role="menu"
      aria-label={label}
      className="invisible absolute inset-x-0 top-full z-40 translate-y-1 bg-light-100 opacity-0 shadow-[0_16px_24px_-12px_rgba(0,0,0,0.12)] transition-[opacity,transform,visibility] duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
    >
      {/* Wraps: Sport carries nine columns, which nike lays out over two rows. */}
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-x-12 gap-y-8 px-6 py-9">
        {columns.map((column) => (
          <div key={column.title} className="min-w-[140px]">
            <Link
              href={column.href}
              role="menuitem"
              className="mb-3 block text-[15px] font-medium text-dark-900 hover:text-dark-700"
            >
              {column.title}
            </Link>
            <ul className="space-y-2.5">
              {column.links.map((link, i) => (
                <li key={`${link.label}-${i}`}>
                  <Link
                    href={link.href}
                    role="menuitem"
                    className="block text-[15px] leading-none text-dark-700 transition-colors hover:text-dark-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
