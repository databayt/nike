import Link from "next/link";
import { type IconLink } from "./men-data";

interface IconRailProps {
  heading: string;
  items: IconLink[];
}

/**
 * A centered heading above a row of round category icons (image in a soft grey
 * disc + label beneath). Drives both "Featured Footwear" and "Latest in
 * Clothing". Centers on desktop; becomes a swipeable strip on narrow screens.
 */
export default function IconRail({ heading, items }: IconRailProps) {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-10">
      <h2 className="mb-8 text-center text-xl font-bold uppercase tracking-tight text-dark-900 sm:text-2xl">
        {heading}
      </h2>
      <ul className="flex justify-start gap-4 overflow-x-auto pb-1 sm:justify-center sm:gap-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <li key={item.label} className="shrink-0">
            <Link
              href={item.href}
              className="group flex w-[84px] flex-col items-center gap-2 text-center focus:outline-none"
            >
              <span className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-full bg-light-200 transition-colors group-hover:bg-light-300 group-focus-visible:ring-2 group-focus-visible:ring-dark-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.icon}
                  alt=""
                  width={72}
                  height={72}
                  loading="lazy"
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              </span>
              <span className="text-caption font-medium leading-tight text-dark-900">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
