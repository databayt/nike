import Link from "next/link";
import type { Locale } from "@/components/internationalization/config";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import HlsVideo from "./hls-video";
import RailScroller, { SeeAll } from "./rail";
import Sitemap from "./sitemap";
import {
  Credit,
  Picture,
  Pill,
  RATIO,
  SPACE,
  ratioStyle,
  spaceStyle,
} from "./primitives";
import {
  GRADIENT_BAND,
  buildHomeSections,
  type BannerSection,
  type CardsSection,
  type HomeSection,
  type IconsSection,
  type LogoSection,
  type RailSection,
  type SplitSection,
  type TextSection,
} from "./home-data";

/** Renders nike.com's homepage block stack from `home-data.ts`. */

/** English campaign copy on /ar: per-line bidi so punctuation stays put; alignment still follows the page. */
const BIDI = "[unicode-bidi:plaintext] rtl:text-right";

const TITLE = {
  display: "font-futura uppercase text-[40px] leading-[36px] lg:text-[76px] lg:leading-[68.4px]",
  "display-sm": "font-futura uppercase text-[40px] leading-[36px] lg:text-[48px] lg:leading-[43.2px]",
  heading: "font-medium text-[24px] leading-[28.8px]",
} as const;

function Banner({ s, first }: { s: BannerSection; first: boolean }) {
  const [bm, bd] = s.bleed;
  const ratio = s.image
    ? ratioStyle(s.image.mobile.ratio, s.image.desktop.ratio)
    : ratioStyle(s.video!.ratio[0], s.video!.ratio[1]);
  const titleCls = TITLE[s.titleStyle ?? "display"];

  const copy = (tone: "light" | "dark", centered: boolean) => (
    <>
      {s.eyebrow && <p className={`mb-2 text-[16px] font-medium leading-6 ${centered ? "" : BIDI}`}>{s.eyebrow}</p>}
      {s.title && <h3 className={`whitespace-pre-line ${titleCls} ${centered ? "" : BIDI}`}>{s.title}</h3>}
      {s.body && <p className={`mt-2 whitespace-pre-line text-[16px] leading-6 ${centered ? "" : BIDI}`}>{s.body}</p>}
      {s.ctas.length > 0 && (
        <div className={`mt-6 flex gap-1.5 ${centered ? "justify-center" : ""}`}>
          {s.ctas.map((c) => (
            <Pill key={c.label} cta={c} tone={tone} />
          ))}
        </div>
      )}
    </>
  );

  return (
    <section
      style={{ ...spaceStyle(s.space), ...ratio }}
      className={`${SPACE} ${bm ? "" : "px-6"} ${bd ? "md:px-0" : "md:px-6 lg:px-12"}`}
    >
      <figure className={`relative overflow-hidden bg-[#111] ${RATIO}`}>
        <Link href={s.href} aria-label={s.alt} className="absolute inset-0">
          {s.image ? (
            <Picture mobile={s.image.mobile} desktop={s.image.desktop} alt={s.alt} priority={first} />
          ) : (
            <HlsVideo src={s.video!.hls} label={s.alt} className="size-full object-cover" />
          )}
        </Link>
        {s.credit && <Credit>{s.credit}</Credit>}
        {!s.copyBelow && (
          <figcaption
            className={`pointer-events-none absolute inset-x-0 bottom-0 p-6 text-white lg:p-12 ${
              bm ? "" : "max-w-[293px]"
            } lg:max-w-[75%]`}
          >
            {copy("light", false)}
          </figcaption>
        )}
      </figure>
      {s.copyBelow && (
        <div className="mx-auto px-[47px] pt-6 text-center text-[#111] lg:max-w-[1080px] lg:px-0 lg:pt-9">
          {copy("dark", true)}
        </div>
      )}
    </section>
  );
}

function Cards({ s }: { s: CardsSection }) {
  const captioned = s.cards.some((c) => c.label);
  return (
    <section
      style={spaceStyle(s.space)}
      className={`${SPACE} pb-[30px] pt-[26px] ${captioned ? "" : "md:py-0"}`}
    >
      <ul
        className={`flex snap-x gap-3 overflow-x-auto scroll-px-6 px-6 [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-12 ${
          captioned ? "" : "md:grid md:grid-cols-3 md:overflow-visible"
        }`}
      >
        {s.cards.map((c, i) => (
          <li key={i} className={`w-[80vw] shrink-0 snap-start lg:w-auto ${captioned ? "md:w-[70vw]" : "md:w-auto"}`}>
            <Link href={c.href} aria-label={c.label ?? c.alt} className="block">
              <div
                className={`relative overflow-hidden bg-[#f5f5f5] ${captioned ? "" : "md:aspect-auto! md:h-[540px]"}`}
                style={{ aspectRatio: c.image.ratio }}
              >
                <Picture mobile={c.image} alt={c.alt ?? c.label ?? ""} sizes="(min-width: 960px) 33vw, 300px" />
                {c.credit && <Credit>{c.credit}</Credit>}
              </div>
              {c.label && (
                <p className="mt-4 text-[20px] font-medium leading-6 text-[#111]">{c.label}</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Rail({ s, t }: { s: RailSection; t: HomeDict }) {
  return (
    <section style={spaceStyle(s.space)} className={`${SPACE} pb-[30px] pt-[26px] md:pt-[62px]`}>
      <RailScroller prevLabel={t.a11y.previous} nextLabel={t.a11y.next}>
        {s.cards.map((c, i) => (
          <li key={i} className="size-[80vw] shrink-0 snap-start md:size-[70vw] lg:size-[440px]">
            <Link href={c.href} aria-label={c.alt} className="block size-full bg-[#f5f5f5]">
              <Picture mobile={c.image} alt={c.alt ?? ""} sizes="(min-width: 960px) 440px, 80vw" />
            </Link>
          </li>
        ))}
      </RailScroller>
    </section>
  );
}

function Split({ s }: { s: SplitSection }) {
  return (
    <section style={spaceStyle(s.space)} className={`${SPACE} grid gap-2 px-6 md:grid-cols-2 md:gap-3 lg:px-12`}>
      {s.cards.map((c) => (
        <div key={c.cta} className="relative overflow-hidden" style={{ aspectRatio: c.image.ratio }}>
          <Link href={c.href} aria-label={c.cta} className="absolute inset-0">
            <Picture mobile={c.image} alt={c.cta} sizes="(min-width: 960px) 50vw, 100vw" />
          </Link>
          <div className="pointer-events-none absolute bottom-6 start-6 lg:bottom-12 lg:start-12">
            <Pill cta={{ label: c.cta, href: c.href }} tone="light" />
          </div>
        </div>
      ))}
    </section>
  );
}

function Logo({ s }: { s: LogoSection }) {
  return (
    <section style={spaceStyle(s.space)} className={SPACE}>
      {s.band && (
        <div style={ratioStyle(GRADIENT_BAND.mobile.ratio, GRADIENT_BAND.desktop.ratio)} className={RATIO}>
          <Picture mobile={GRADIENT_BAND.mobile} desktop={GRADIENT_BAND.desktop} alt="" />
        </div>
      )}
      <Link
        href={s.href}
        aria-label={s.alt}
        style={ratioStyle(s.logo.mobile.ratio, s.logo.desktop.ratio)}
        className={`mx-6 block lg:mx-12 ${RATIO}`}
      >
        <Picture mobile={s.logo.mobile} desktop={s.logo.desktop} alt={s.alt} className="size-full object-contain" />
      </Link>
    </section>
  );
}

function Text({ s }: { s: TextSection }) {
  return (
    <section style={spaceStyle(s.space)} className={`${SPACE} px-[18px] text-center text-[#111] lg:px-12`}>
      <div className="mx-auto md:max-w-[476px] lg:max-w-[672px]">
        <h2 className={TITLE.display}>
          <Link href={s.href}>{s.title}</Link>
        </h2>
        <p className="mt-2 text-[16px] leading-6 [unicode-bidi:plaintext]">{s.body}</p>
        {s.ctas.length > 0 && (
          <div className="mt-6 flex justify-center gap-1.5">
            {s.ctas.map((c) => (
              <Pill key={c.label} cta={c} tone="dark" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Icons({ s, t }: { s: IconsSection; t: HomeDict }) {
  return (
    <section style={spaceStyle(s.space)} className={`${SPACE} pt-9`}>
      <SeeAll label={t.cta.seeAll}>
      <ul className="mx-auto grid w-[290px] grid-cols-3 gap-x-[37px] lg:w-[856px] lg:grid-cols-8 lg:gap-x-10">
        {s.items.map((it) => (
          <li
            key={it.id}
            style={{ order: it.mobileOrder }}
            className={`h-40 lg:order-none! ${it.mobileOrder > 5 ? "hidden group-data-[open=true]/see:block lg:block" : ""}`}
          >
            <Link href={it.href} className="flex flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element -- CDN product icon */}
              <img
                src={`https://static.nike.com/a/images/w_144,c_limit/${it.id}/image.png`}
                alt=""
                width={72}
                height={72}
                loading="lazy"
                className="size-[72px]"
              />
              <span className="mt-2 w-[88px] text-[12px] font-medium leading-[14px] text-[#111]">{it.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      </SeeAll>
    </section>
  );
}

interface HomeDict {
  cta: { seeAll: string };
  a11y: { previous: string; next: string };
}

export default function HomeSections({ lang, dictionary }: { lang: Locale; dictionary: Dictionary }) {
  const sections: HomeSection[] = buildHomeSections(lang);
  const t = dictionary.home as HomeDict;
  return (
    <>
      {sections.map((s, i) => {
        switch (s.kind) {
          case "banner":
            return <Banner key={s.id} s={s} first={i === 0} />;
          case "cards":
            return <Cards key={s.id} s={s} />;
          case "rail":
            return <Rail key={s.id} s={s} t={t} />;
          case "split":
            return <Split key={s.id} s={s} />;
          case "logo":
            return <Logo key={s.id} s={s} />;
          case "text":
            return <Text key={s.id} s={s} />;
          case "icons":
            return <Icons key={s.id} s={s} t={t} />;
        }
      })}
      <Sitemap lang={lang} />
    </>
  );
}

