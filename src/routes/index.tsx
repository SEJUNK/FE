import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { JourneyStrip } from "@/components/JourneyStrip";
import { ThreadPanel } from "@/components/ThreadPanel";
import { FragmentRow, TypeChip, TypeGlyph } from "@/components/receipt-bits";
import {
  chapters,
  formatDate,
  formatTime,
  moments,
  patterns,
  receipts,
  stats,
  TYPE_META,
  TYPE_ORDER,
  type Receipt,
} from "@/lib/receipts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Receipts of a Life — a story hidden in 5,500 digital fragments" },
      {
        name: "description",
        content:
          "Eleven years of songs, purchases, places and notes, read together as one story: chapters, hidden threads and patterns discovered inside the raw data.",
      },
      { property: "og:title", content: "Receipts of a Life" },
      {
        property: "og:description",
        content: "Eleven years of songs, purchases, places and notes, read together as one story.",
      },
    ],
  }),
  component: Overture,
});

const ACCENT_TEXT: Record<string, string> = {
  accent: "text-accent",
  gold: "text-gold",
  mint: "text-mint",
  rose: "text-rose",
  violet: "text-violet",
};

function Overture() {
  const featuredMoment = useMemo(() => {
    const rich = moments.slice().sort((a, b) => b.types.length - a.types.length);
    return rich[0];
  }, []);
  const [anchor, setAnchor] = useState<Receipt>(
    () => featuredMoment?.items.find((r) => r.type === "music") ?? featuredMoment?.items[0] ?? receipts[0]!,
  );

  const totalPlaces = new Set(receipts.filter((r) => r.place).map((r) => r.place)).size;
  const spend = Math.round(
    receipts.filter((r) => r.amount && r.amount > 0).reduce((a, r) => a + (r.amount ?? 0), 0),
  );

  const featuredNote = receipts.find((r) => r.type === "note" && r.title.length > 40);
  const featuredPlace = receipts.find((r) => r.type === "place" && r.place);
  const featuredMusic = receipts.find(
    (r) => r.type === "music" && (r.meta["plays"] as number) > 20 && r.note,
  );

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-40 top-[-10%] size-[520px] rounded-full bg-accent/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] top-1/3 size-[460px] rounded-full bg-violet/20 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[-15%] left-1/4 size-[500px] rounded-full bg-gold/15 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-16 md:px-10">
        {/* Hero */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="fragment-in rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl md:p-10">
              <p className="text-xs uppercase tracking-[0.3em] text-accent">
                {receipts.length.toLocaleString()} fragments · 2013 → 2024
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
                Eleven years of small things,
                <br />
                <span className="italic text-muted">read as one life.</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted md:text-base">
                {stats.musicPlaysTotal.toLocaleString()} songs, {stats.typeCounts["purchase"]} purchase slips,{" "}
                {totalPlaces} places and a stack of private notes. Alone they are noise. Put a night-time song beside a
                train ticket and a scribbled receipt note and they become{" "}
                <span className="text-cloud">a chapter of someone&apos;s life</span>.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/chapter/$slug"
                  params={{ slug: chapters[0]!.slug }}
                  className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink transition hover:brightness-110"
                >
                  Open the story
                </Link>
                <Link
                  to="/explore"
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-cloud backdrop-blur-md transition hover:bg-white/10"
                >
                  Explore receipts
                </Link>
              </div>
              <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
                {[
                  { k: "Listening hours", v: stats.musicHoursTotal.toLocaleString() },
                  { k: "Spent, logged", v: `₹${spend.toLocaleString()}` },
                  { k: "Places", v: String(totalPlaces) },
                  { k: "Hidden threads", v: String(moments.length) },
                ].map((s) => (
                  <div key={s.k}>
                    <dd className="font-display text-2xl">{s.v}</dd>
                    <dt className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted">{s.k}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="lg:col-span-5">
            <ThreadPanel anchor={anchor} onSelect={setAnchor} />
          </div>
        </section>

        {/* Journey */}
        <section className="mt-8">
          <JourneyStrip />
        </section>

        {/* Chapters */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="eyebrow">Six chapters</p>
              <h2 className="mt-1 font-display text-2xl tracking-tight">Who was this person, and when?</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {chapters.map((c) => (
              <Link
                key={c.slug}
                to="/chapter/$slug"
                params={{ slug: c.slug }}
                className="group rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl transition hover:bg-white/[0.1]"
              >
                <p className={`text-[10px] uppercase tracking-[0.25em] ${ACCENT_TEXT[c.accent]}`}>
                  Chapter {c.index + 1} ·{" "}
                  {c.years[0] === c.years[1] ? c.years[0] : `${c.years[0]}–${c.years[1]}`}
                </p>
                <p className="mt-2 font-display text-xl leading-snug">{c.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted">{c.headline}</p>
                <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-muted">{c.signature}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Types */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="eyebrow">Explore by fragment</p>
              <h2 className="mt-1 font-display text-2xl tracking-tight">What kind of life was this?</h2>
            </div>
            <Link
              to="/explore"
              className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-cloud backdrop-blur-md transition hover:bg-white/10 md:block"
            >
              Filter all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {TYPE_ORDER.map((t) => (
              <Link
                key={t}
                to="/explore"
                search={{ type: t, q: "", night: false, chapter: "" }}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl transition hover:bg-white/[0.1]"
              >
                <TypeGlyph type={t} className="size-9" />
                <p className="mt-3 text-sm font-semibold">{TYPE_META[t].label}</p>
                <p className="text-xs text-muted">{(stats.typeCounts[t] ?? 0).toLocaleString()} fragments</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured fragments */}
        <section className="mt-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[featuredMusic, featuredPlace, featuredNote].filter(Boolean).map((r, i) => {
              const rec = r as Receipt;
              return (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => {
                    setAnchor(rec);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`rounded-3xl border p-5 text-left backdrop-blur-xl transition hover:bg-white/[0.1] ${
                    i === 1 ? "border-accent/20 bg-accent/[0.06] ring-1 ring-accent/20" : "border-white/10 bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <TypeChip type={rec.type} />
                    <span className="text-[11px] text-muted">
                      {formatDate(rec.ts)} · {formatTime(rec.ts)}
                    </span>
                  </div>
                  <div className="mt-4 flex aspect-[16/9] flex-col justify-center rounded-xl border border-white/10 bg-ink2/60 p-4">
                    <p className="font-display text-base italic leading-snug text-cloud/90">
                      {rec.note ?? rec.detail ?? rec.title}
                    </p>
                  </div>
                  <p className="mt-4 font-display text-lg leading-snug">{rec.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {rec.subtitle}
                    {rec.place ? ` · ${rec.place}` : ""} · pull this thread
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Patterns teaser */}
        <section className="mt-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl md:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">What the data keeps repeating</p>
                <h2 className="mt-1 font-display text-2xl tracking-tight">Six patterns nobody noticed</h2>
              </div>
              <Link
                to="/patterns"
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-cloud transition hover:bg-white/10"
              >
                See all patterns
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {patterns.slice(0, 3).map((p) => (
                <div key={p.id} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <p className={`font-display text-3xl ${ACCENT_TEXT[p.accent]}`}>{p.value}</p>
                  <p className="mt-1 text-sm font-semibold">{p.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Moments */}
        <section className="mt-8">
          <div className="mb-4">
            <p className="eyebrow">Days where everything happened at once</p>
            <h2 className="mt-1 font-display text-2xl tracking-tight">
              {moments.length} days carry four or more kinds of record
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {moments.slice(0, 6).map((m) => (
              <div key={m.day} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg">{formatDate(`${m.day}T12:00:00`)}</p>
                  <span className="text-[11px] text-muted">{m.types.length} kinds · {m.items.length} fragments</span>
                </div>
                {m.headline ? <p className="mt-1 text-xs text-muted">{m.headline}</p> : null}
                <div className="mt-3 flex flex-col gap-2">
                  {m.items.slice(0, 4).map((r) => (
                    <FragmentRow key={r.id} receipt={r} onSelect={(rec) => {
                      setAnchor(rec);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
