import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { JourneyStrip } from "@/components/JourneyStrip";
import { ThreadPanel } from "@/components/ThreadPanel";
import { FragmentRow, ReceiptDetail } from "@/components/receipt-bits";
import {
  chapters,
  formatDate,
  moments,
  receiptsInChapter,
  stats,
  TYPE_META,
  type Receipt,
} from "@/lib/receipts";

export const Route = createFileRoute("/chapter/$slug")({
  loader: ({ params }) => {
    const chapter = chapters.find((c) => c.slug === params.slug);
    if (!chapter) throw notFound();
    return { slug: chapter.slug };
  },
  head: ({ loaderData }) => {
    const chapter = chapters.find((c) => c.slug === loaderData?.slug);
    if (!chapter) {
      return { meta: [{ title: "Chapter not found" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${chapter.title} — Receipts of a Life` },
        { name: "description", content: chapter.headline },
        { property: "og:title", content: `${chapter.title} — Receipts of a Life` },
        { property: "og:description", content: chapter.headline },
      ],
    };
  },
  component: ChapterPage,
  notFoundComponent: ChapterMissing,
});

function ChapterMissing() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl">That chapter isn&apos;t in the archive</h1>
      <Link to="/" className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink">
        Back to the start
      </Link>
    </div>
  );
}

const ACCENT_TEXT: Record<string, string> = {
  accent: "text-accent",
  gold: "text-gold",
  mint: "text-mint",
  rose: "text-rose",
  violet: "text-violet",
};

function ChapterPage() {
  const { slug } = Route.useLoaderData();
  const chapter = chapters.find((c) => c.slug === slug)!;
  const items = receiptsInChapter(chapter);
  const [anchor, setAnchor] = useState<Receipt | null>(null);

  const typeCounts = items.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] ?? 0) + 1;
    return acc;
  }, {});
  const chapterMoments = moments.filter(
    (m) => Number(m.day.slice(0, 4)) >= chapter.years[0] && Number(m.day.slice(0, 4)) <= chapter.years[1],
  );
  const picked = new Map<string, (typeof items)[number]>();
  for (const r of [
    ...items.filter((r) => r.note).slice(0, 3),
    ...items.filter((r) => r.type === "note").slice(0, 2),
    ...items.filter((r) => r.place).slice(0, 2),
  ])
    picked.set(r.id, r);
  // pad with one fragment per kind, then spread through the chapter, so no chapter looks empty
  for (const t of Object.keys(typeCounts)) {
    const r = items.find((x) => x.type === t && !picked.has(x.id));
    if (r && picked.size < 6) picked.set(r.id, r);
  }
  const step = Math.max(1, Math.floor(items.length / 6));
  for (let i = 0; picked.size < 6 && i < items.length; i += step) {
    const r = items[i];
    if (r) picked.set(r.id, r);
  }
  const highlights = [...picked.values()]
    .sort((a, b) => a.ts.localeCompare(b.ts))
    .slice(0, 6);
  const prev = chapters[chapter.index - 1];
  const next = chapters[chapter.index + 1];
  const topArtist = stats.topArtistByYear[String(chapter.years[1])] ?? stats.topArtistByYear[String(chapter.years[0])];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-32 top-0 size-[460px] rounded-full bg-violet/20 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="fragment-in rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl md:p-10">
              <p className={`text-xs uppercase tracking-[0.3em] ${ACCENT_TEXT[chapter.accent]}`}>
                Chapter {chapter.index + 1} ·{" "}
                {chapter.years[0] === chapter.years[1] ? chapter.years[0] : `${chapter.years[0]}–${chapter.years[1]}`}
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">{chapter.title}</h1>
              <p className="mt-2 font-display text-lg italic text-muted">{chapter.kicker}</p>
              <p className="mt-6 text-sm leading-relaxed text-cloud/90 md:text-base">{chapter.headline}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{chapter.narration}</p>
              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
                <div>
                  <dd className="font-display text-2xl">{items.length.toLocaleString()}</dd>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted">Fragments</dt>
                </div>
                <div>
                  <dd className="font-display text-2xl">{Object.keys(typeCounts).length}</dd>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted">Kinds of record</dt>
                </div>
                <div>
                  <dd className="truncate font-display text-2xl">{topArtist}</dd>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted">Signature artist</dt>
                </div>
                <div>
                  <dd className="font-display text-2xl">{chapterMoments.length}</dd>
                  <dt className="text-[10px] uppercase tracking-[0.2em] text-muted">Dense days</dt>
                </div>
              </dl>
            </div>
          </div>
          <div className="lg:col-span-5">
            {anchor ? (
              <div className="flex flex-col gap-4">
                <ReceiptDetail receipt={anchor} />
                <ThreadPanel anchor={anchor} onSelect={setAnchor} limit={5} />
              </div>
            ) : (
              <div className="glow-panel h-full rounded-3xl border border-white/10 p-6 backdrop-blur-xl">
                <p className="eyebrow">What this chapter is made of</p>
                <div className="mt-5 flex flex-col gap-2.5">
                  {Object.entries(typeCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([t, n]) => {
                      const meta = TYPE_META[t as Receipt["type"]];
                      const share = Math.round((n / items.length) * 100);
                      return (
                        <div key={t}>
                          <div className="flex justify-between text-[11px]">
                            <span className={meta.text}>
                              {meta.glyph} {meta.label}
                            </span>
                            <span className="text-muted">
                              {n} · {share}%
                            </span>
                          </div>
                          <div className="mt-1 h-1 rounded-full bg-white/10">
                            <div className={`h-full rounded-full ${meta.bg.replace("/15", "/70")}`} style={{ width: `${share}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
                <p className="mt-5 text-[11px] leading-relaxed text-muted">
                  Pick any fragment below and this panel becomes its thread — every other record that shares its day,
                  its place or its habit.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          <JourneyStrip activeSlug={chapter.slug} />
        </section>

        <section className="mt-8">
          <p className="eyebrow">The fragments that carry this chapter</p>
          <h2 className="mt-1 font-display text-2xl tracking-tight">Start anywhere. Follow the thread.</h2>
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            {highlights.map((r) => (
              <FragmentRow key={r.id} receipt={r} active={anchor?.id === r.id} onSelect={setAnchor} />
            ))}
          </div>
        </section>

        {chapterMoments.length ? (
          <section className="mt-8">
            <p className="eyebrow">Dense days inside this chapter</p>
            <h2 className="mt-1 font-display text-2xl tracking-tight">
              When four kinds of record land on one date
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
              {chapterMoments.slice(0, 4).map((m) => (
                <div key={m.day} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg">{formatDate(`${m.day}T12:00:00`)}</p>
                    <span className="text-[11px] text-muted">{m.items.length} fragments</span>
                  </div>
                  {m.headline ? <p className="mt-1 text-xs text-muted">{m.headline}</p> : null}
                  <div className="mt-3 flex flex-col gap-2">
                    {m.items.slice(0, 4).map((r) => (
                      <FragmentRow key={r.id} receipt={r} active={anchor?.id === r.id} onSelect={setAnchor} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          {prev ? (
            <Link
              to="/chapter/$slug"
              params={{ slug: prev.slug }}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-cloud transition hover:bg-white/10"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to="/chapter/$slug"
              params={{ slug: next.slug }}
              className="rounded-full bg-accent px-4 py-2.5 text-xs font-semibold text-ink transition hover:brightness-110"
            >
              {next.title} →
            </Link>
          ) : (
            <Link
              to="/patterns"
              className="rounded-full bg-accent px-4 py-2.5 text-xs font-semibold text-ink transition hover:brightness-110"
            >
              What it all means →
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
