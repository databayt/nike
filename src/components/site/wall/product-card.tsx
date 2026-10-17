import Image from "next/image";
import Link from "next/link";

export interface WallCardProps {
  href: string;
  title: string;
  subtitle?: string | null;
  imageSrc: string;
  badge?: string | null;
  price: number | null;
  salePrice?: number | null;
  colorCount?: number;
  priority?: boolean;
}

const usd = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;

/**
 * nike.com product-wall card: square hero on #f5f5f5, then badge (accent),
 * title, grey subtitle, colour count and price — all 16/24, measured off
 * nike.com/w at 1440 (card 364px incl. 8px side padding).
 */
export function WallCard({ href, title, subtitle, imageSrc, badge, price, salePrice, colorCount, priority }: WallCardProps) {
  const onSale = price !== null && salePrice != null && salePrice < price;
  const off = onSale ? Math.round((1 - salePrice! / price!) * 100) : 0;

  return (
    <Link href={href} className="group block pb-6 min-[960px]:px-2 min-[960px]:pb-[87px]" aria-label={title}>
      <div className="relative aspect-square overflow-hidden bg-light-200">
        <Image
          src={imageSrc}
          alt={subtitle ? `${title} ${subtitle}` : title}
          fill
          priority={priority}
          sizes="(min-width: 960px) 348px, 50vw"
          className="object-cover"
        />
      </div>
      <div className="px-2 pt-3 text-[15px] leading-6 min-[960px]:px-0 min-[960px]:text-base">
        {badge && <p className="-mt-[3px] font-medium text-red">{badge}</p>}
        <p className="font-medium text-dark-900">{title}</p>
        {subtitle && <p className="text-[#707072]">{subtitle}</p>}
        {colorCount && colorCount > 1 ? (
          <p className="text-[#707072]">{colorCount} Colors</p>
        ) : null}
        {price !== null && (
          <p className="pt-1 font-medium text-dark-900">
            {onSale ? (
              <>
                <span className="pe-[5px]">{usd(salePrice!)}</span>
                <span className="font-normal text-[#707072] line-through">{usd(price)}</span>
                <span className="block text-green min-[960px]:inline min-[960px]:ps-2">{off}% off</span>
              </>
            ) : (
              usd(price)
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
