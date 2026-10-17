"use client";

import { useState, type ReactNode } from "react";

/**
 * nike.com/w layout: a 48px-inset header row (title + count, Hide Filters,
 * Sort By), then a 240px sticky filter rail beside the grid. Hiding the rail
 * hands its width to the grid, as nike does. Below 960px the rail is a sheet.
 */
export function WallShell({
  title,
  count,
  sort,
  filters,
  hideLabel,
  showLabel,
  filterLabel,
  applyLabel,
  children,
}: {
  title: string;
  count: number;
  sort: ReactNode;
  filters: ReactNode;
  hideLabel: string;
  showLabel: string;
  filterLabel: string;
  applyLabel: string;
  children: ReactNode;
}) {
  const [hidden, setHidden] = useState(false);
  const [sheet, setSheet] = useState(false);

  return (
    <main className="pb-16">
      <header className="sticky top-0 z-20 bg-light-100 px-5 pt-4 pb-3 min-[960px]:px-12 min-[960px]:pt-1 min-[960px]:pb-[15px]">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium leading-tight text-dark-900 min-[960px]:text-2xl">
            {title}
            <span className="ps-1.5">({count})</span>
          </h1>
          <div className="hidden items-center min-[960px]:flex">
            <button
              type="button"
              onClick={() => setHidden((h) => !h)}
              aria-expanded={!hidden}
              aria-controls="wall-filters"
              className="flex items-center gap-2 pe-6 text-base text-dark-900"
            >
              {hidden ? showLabel : hideLabel}
              <FilterIcon />
            </button>
            {sort}
          </div>
        </div>
        <div className="mt-4 flex justify-end border-t border-light-300 pt-3 min-[960px]:hidden">
          <button
            type="button"
            onClick={() => setSheet(true)}
            className="flex items-center gap-2 rounded-full border border-light-400 px-4 py-1.5 text-base text-dark-900"
          >
            {filterLabel}
            <FilterIcon />
          </button>
        </div>
      </header>

      <div className="flex">
        <aside
          id="wall-filters"
          className={`hidden shrink-0 min-[960px]:block ${hidden ? "min-[960px]:hidden" : "w-60"}`}
        >
          <div className="sticky top-[60px] max-h-[calc(100vh-60px)] overflow-y-auto ps-12 pb-4 [scrollbar-width:thin]">
            {filters}
          </div>
        </aside>
        <div className="min-w-0 flex-1 min-[960px]:ps-[60px] min-[960px]:pe-12">
          {children}
        </div>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-50 flex flex-col bg-light-100 min-[960px]:hidden" role="dialog" aria-modal="true" aria-label={filterLabel}>
          <div className="flex items-center justify-between px-6 py-5">
            <p className="text-2xl font-medium">{filterLabel}</p>
            <button type="button" onClick={() => setSheet(false)} aria-label="Close" className="grid size-9 place-items-center rounded-full bg-light-200">
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18.973 5.027L5.028 18.972m0-13.945l13.944 13.945" /></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6">{filters}</div>
          <div className="border-t border-light-300 p-6">
            <button type="button" onClick={() => setSheet(false)} className="w-full rounded-full bg-dark-900 py-4 text-base font-medium text-light-100">
              {applyLabel}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function FilterIcon() {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 8.25H10m-5.25 0H3M21 15.75h-5.25m-5.25 0H3" />
      <circle cx="7.5" cy="8.25" r="2.25" />
      <circle cx="13.5" cy="15.75" r="2.25" />
    </svg>
  );
}
