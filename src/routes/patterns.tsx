import { createFileRoute, Link } from "@tanstack/react-router";
import { patterns, stats } from "@/lib/receipts";

export const Route = createFileRoute("/patterns")({
  head: () => ({
    meta: [
      { title: "What it all means — Receipts of a Life" },
      {
        name: "description",
        content:
          "Six patterns pulled out of eleven years of songs, purchases and places: the 2 AM habit, loyalty over novelty, and where attention moved.",
      },
      { property: "og:title", content: "What it all means — Receipts of a Life" },
      {
        property: "og:description",
        content: "Six patterns pulled out of eleven years of songs, purchases and places.",
      },
    ],
  }),
  component: Patterns,
});

const ACCENT_TEXT: Record<string, string> = {
  accent: "text-accent",
  gold: "text-gold",
  mint: "text-mint",
  rose: "text-rose",
  violet: "text-violet",
};
const ACCENT_BAR: Record<string, string> = {
  accent: "bg-accent/70",
  gold: "bg-gold/70",
  mint: "bg-mint/70",
  rose: "bg-rose/70",
  violet: "bg-violet/70",
};

function Patterns() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute bottom-0 left-1/4 size-[520px] rounded-full bg-gold/15 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-16 md:px-10">
        <header className="mt-8 max-w-2xl">
          <p className="eyebrow">Raw data → insight</p>
          <h1 className="mt-2 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            The habits the person never wrote down.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            Nothing here is a field in the data. Every number below was found by reading the three archives against each
            other — {stats.musicPlaysTotal.toLocaleString()} plays, a household ledger, and a card trail.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {patterns.map((p) => {
            const max = p.bars ? Math.max(...p.bars.map((b) => b.value)) : 0;
            const min = p.bars ? Math.min(...p.bars.map((b) => b.value)) : 0;
            const floor = min > max * 0.6 ? min * 0.85 : 0;
            return (
              <article key={p.id} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
                <p className="eyebrow">{p.label}</p>
                <p className={`mt-2 font-display text-5xl leading-none ${ACCENT_TEXT[p.accent]}`}>{p.value}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.body}</p>
                {p.bars ? (
                  <div className="mt-5">
                    <div className="flex h-24 items-end gap-1">
                      {p.bars.map((b) => (
                        <div key={b.label} className="group relative flex-1" title={`${b.label} · ${b.value}`}>
                          <div
                            className={`w-full rounded-t-sm ${ACCENT_BAR[p.accent]}`}
                            style={{ height: `${Math.max(4, ((b.value - floor) / (max - floor || 1)) * 96)}px` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-muted">
                      <span className="truncate">{p.bars[0]?.label}</span>
                      <span className="truncate">{p.bars[p.bars.length - 1]?.label}</span>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
            <p className="eyebrow">Played most, all years</p>
            <ul className="mt-4 flex flex-col gap-2">
              {stats.topArtists.slice(0, 8).map((a) => (
                <li key={a.name} className="flex justify-between gap-3 border-b border-white/5 pb-1.5 text-sm">
                  <span className="truncate">{a.name}</span>
                  <span className="shrink-0 text-muted">{a.plays.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
            <p className="eyebrow">Who they were, year by year</p>
            <ul className="mt-4 flex flex-col gap-2">
              {Object.entries(stats.topArtistByYear).map(([year, artist]) => (
                <li key={year} className="flex justify-between gap-3 border-b border-white/5 pb-1.5 text-sm">
                  <span className="text-muted">{year}</span>
                  <span className="truncate">{artist}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
            <p className="eyebrow">Places on repeat</p>
            <ul className="mt-4 flex flex-col gap-2">
              {stats.topCities.slice(0, 8).map((c) => (
                <li key={c.name} className="flex justify-between gap-3 border-b border-white/5 pb-1.5 text-sm">
                  <span className="truncate">{c.name}</span>
                  <span className="shrink-0 text-muted">{c.visits}×</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl md:p-8">
          <p className="eyebrow">Where the story comes from</p>
          <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted">
            {stats.sources.map((s) => (
              <li key={s}>· {s}</li>
            ))}
          </ul>
          <p className="mt-4 max-w-2xl text-xs leading-relaxed text-muted">
            Photos, saved messages and searches don&apos;t exist as their own records in these archives — they are
            inferred from geotagged travel, entertainment bookings and first-listen moments, and every inferred fragment
            says so on its own card.
          </p>
          <Link
            to="/explore"
            className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink transition hover:brightness-110"
          >
            Go dig through the fragments
          </Link>
        </section>
      </div>
    </div>
  );
}
