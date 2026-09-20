import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useState } from "react";
import { FragmentRow, ReceiptDetail } from "@/components/receipt-bits";
import { ThreadPanel } from "@/components/ThreadPanel";
import {
  chapters,
  searchReceipts,
  TYPE_META,
  TYPE_ORDER,
  type Receipt,
  type ReceiptType,
} from "@/lib/receipts";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  type: fallback(z.string(), "").default(""),
  chapter: fallback(z.string(), "").default(""),
  night: fallback(z.boolean(), false).default(false),
});

export const Route = createFileRoute("/explore")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Explore the archive — Receipts of a Life" },
      {
        name: "description",
        content:
          "Search and filter 5,500 life fragments by kind, chapter and hour of night, then follow the threads between them.",
      },
      { property: "og:title", content: "Explore the archive — Receipts of a Life" },
      {
        property: "og:description",
        content: "Search, filter and follow the threads between thousands of digital-life fragments.",
      },
    ],
  }),
  component: Explore,
});

function Explore() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [page, setPage] = useState(1);

  const types = search["type"] ? [search["type"] as ReceiptType] : [];
  const results = useMemo(
    () => searchReceipts(search["q"], types, search["chapter"] || null, search["night"]),
    [search["q"], search["type"], search["chapter"], search["night"]],
  );
  const [selected, setSelected] = useState<Receipt | null>(null);
  const anchor = selected ?? results[0] ?? null;

  const update = (patch: Partial<typeof search>) => {
    setPage(1);
    void navigate({ to: ".", search: (prev) => ({ ...prev, ...patch }) });
  };

  const visible = results.slice(0, page * 40);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute right-[-10%] top-0 size-[420px] rounded-full bg-accent/15 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <header className="mt-8">
          <p className="eyebrow">The archive, unsorted</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">
            {results.length.toLocaleString()} fragments match
          </h1>
        </header>

        {/* controls */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              value={search["q"]}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Search songs, places, notes, merchants…"
              className="w-full rounded-full border border-white/10 bg-ink2/60 px-4 py-2.5 text-sm text-cloud outline-none placeholder:text-muted focus:border-accent/40"
            />
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => update({ night: !search["night"] })}
                className={`rounded-full px-4 py-2 text-xs transition ${
                  search["night"] ? "bg-accent text-ink" : "border border-white/15 bg-white/5 text-cloud hover:bg-white/10"
                }`}
              >
                After midnight
              </button>
              <select
                value={search["chapter"]}
                onChange={(e) => update({ chapter: e.target.value })}
                className="rounded-full border border-white/15 bg-ink2/80 px-4 py-2 text-xs text-cloud outline-none"
              >
                <option value="">All chapters</option>
                {chapters.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => update({ type: "" })}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                !search["type"] ? "bg-cloud text-ink" : "border border-white/15 bg-white/5 text-muted hover:bg-white/10"
              }`}
            >
              Everything
            </button>
            {TYPE_ORDER.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => update({ type: search["type"] === t ? "" : t })}
                className={`rounded-full px-3 py-1.5 text-xs transition ${
                  search["type"] === t
                    ? `${TYPE_META[t].bg} ${TYPE_META[t].text} ring-1 ${TYPE_META[t].ring}`
                    : "border border-white/15 bg-white/5 text-muted hover:bg-white/10"
                }`}
              >
                {TYPE_META[t].glyph} {TYPE_META[t].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* list */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-2">
              {visible.map((r) => (
                <FragmentRow key={r.id} receipt={r} active={anchor?.id === r.id} onSelect={setSelected} />
              ))}
            </div>
            {visible.length < results.length ? (
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="mt-4 w-full rounded-full border border-white/15 bg-white/5 py-2.5 text-xs text-cloud transition hover:bg-white/10"
              >
                Show more ({(results.length - visible.length).toLocaleString()} left)
              </button>
            ) : null}
            {!results.length ? (
              <p className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-center text-sm text-muted">
                Nothing in the archive matches that. Try a broader word — “milk”, “train”, “night”, a city.
              </p>
            ) : null}
          </div>

          {/* detail + thread */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 self-start">
            {anchor ? (
              <div className="flex flex-col gap-4">
                <ReceiptDetail receipt={anchor} />
                <ThreadPanel anchor={anchor} onSelect={setSelected} />
                <Link
                  to="/chapter/$slug"
                  params={{
                    slug:
                      chapters.find((c) => {
                        const y = Number(anchor.ts.slice(0, 4));
                        return y >= c.years[0] && y <= c.years[1];
                      })?.slug ?? chapters[0]!.slug,
                  }}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-center text-xs text-cloud transition hover:bg-white/10"
                >
                  Read the chapter this belongs to
                </Link>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
