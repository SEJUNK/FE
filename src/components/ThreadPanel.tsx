import { findConnections, type Receipt } from "@/lib/receipts";
import { FragmentRow } from "@/components/receipt-bits";

export function ThreadPanel({
  anchor,
  onSelect,
  limit = 6,
}: {
  anchor: Receipt;
  onSelect?: (r: Receipt) => void;
  limit?: number;
}) {
  const links = findConnections(anchor, limit);
  const kinds = new Set(links.map((l) => l.receipt.type));

  return (
    <div className="glow-panel relative rounded-3xl border border-white/10 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2">
        <p className="eyebrow">A discovered thread</p>
        <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold">
          {links.length} links
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <FragmentRow receipt={anchor} active />
        {links.map((l, i) => (
          <div key={l.receipt.id} className="flex flex-col gap-2.5">
            <div className="mx-auto h-3 w-px bg-gradient-to-b from-accent/60 to-violet/60" />
            <FragmentRow
              receipt={l.receipt}
              reason={l.reason}
              onSelect={onSelect}
            />
            {i === links.length - 1 ? null : null}
          </div>
        ))}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-muted">
        {links.length
          ? `These ${links.length} fragments span ${kinds.size} different kinds of record, yet they belong to the same stretch of life. Follow any of them to keep pulling the thread.`
          : "Nothing else in the archive touches this fragment — a genuinely isolated moment."}
      </p>
    </div>
  );
}
