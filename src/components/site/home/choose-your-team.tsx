"use client";

import { useState } from "react";
import Link from "next/link";
import type { Dictionary } from "@/components/internationalization/dictionaries";
import { type Locale, isRTL } from "@/components/internationalization/config";
import { buildChooseYourTeam, homeDict } from "./home-data";

interface ChooseYourTeamProps {
  dictionary: Dictionary;
  lang: Locale;
}

/** Crests shown before "See All" reveals the rest (two desktop rows of eight). */
const VISIBLE = 16;

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" aria-hidden>
      <path stroke="currentColor" strokeWidth={1.5} d="M5.25 9 12 15.75 18.75 9" />
    </svg>
  );
}

/**
 * "Choose Your Team": nike.com's football federation/club crest grid, slotted
 * below Trending Now. A centered flow grid — four crests per row on mobile,
 * eight from 640px — capped at a 896px content width to mirror Nike's measure.
 * The first 16 crests render; "See All" expands the remaining clubs in place.
 * Heading uses the Jost/Rubik Futura-ND stand-in (matching The Essentials).
 */
export default function ChooseYourTeam({ dictionary, lang }: ChooseYourTeamProps) {
  const teams = buildChooseYourTeam(lang);
  const t = homeDict(dictionary);
  const rtl = isRTL(lang);
  const ct = t.chooseTeam ?? {};
  const [expanded, setExpanded] = useState(false);

  const shown = expanded ? teams : teams.slice(0, VISIBLE);
  const canExpand = teams.length > VISIBLE;

  return (
    <section
      aria-labelledby="choose-your-team"
      className="px-6 py-12 sm:py-16 min-[960px]:px-12"
    >
      <p className="text-center text-body-medium font-medium text-dark-900">
        {ct.eyebrow || "Federations & Clubs"}
      </p>
      <h2
        id="choose-your-team"
        className="mt-2 text-center uppercase text-dark-900"
        style={{
          // Jost (Futura ND stand-in) for Latin; Rubik for Arabic, which Jost
          // can't render. Nike ships display2 at 76px → 40px; lh 0.9.
          fontFamily: rtl ? "var(--font-rubik), sans-serif" : "var(--font-jost), sans-serif",
          fontWeight: rtl ? 700 : 600,
          fontSize: "clamp(2.5rem, 1rem + 5vw, 4.75rem)",
          lineHeight: 0.9,
        }}
      >
        {t.sections?.chooseYourTeam || "Choose Your Team"}
      </h2>

      <ul className="mx-auto mt-8 grid max-w-[896px] grid-cols-4 gap-y-3 min-[640px]:grid-cols-8 min-[640px]:gap-y-2">
        {shown.map((team) => (
          <li key={team.id}>
            <Link
              href={team.href}
              className="flex flex-col items-center rounded-sm py-1 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={team.crest}
                alt=""
                loading="lazy"
                className="mx-auto aspect-square w-full max-w-[72px] object-contain"
              />
              <span className="mt-1 block max-w-[86px] break-words text-[12px] leading-[18px] text-dark-900">
                {team.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {canExpand && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="choose-your-team"
            className="inline-flex items-center gap-1 rounded-full border border-light-400 px-4 py-2 text-body-medium font-medium text-dark-900 transition-colors hover:border-dark-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2"
          >
            {expanded ? ct.seeLess || "See Less" : ct.seeAll || "See All"}
            <span className={expanded ? "rotate-180" : ""}>
              <Chevron />
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
