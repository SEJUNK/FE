import { TYPE_META, formatDate, formatTime, isNight, type Receipt } from "@/lib/receipts";

export function TypeChip({ type, className = "" }: { type: Receipt["type"]; className?: string }) {
  const m = TYPE_META[type];
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${m.bg} ${m.text} ${className}`}
    >
      {m.label}
    </span>
  );
}

export function TypeGlyph({ type, className = "" }: { type: Receipt["type"]; className?: string }) {
  const m = TYPE_META[type];
  return (
    <span className={`grid size-8 shrink-0 place-items-center rounded-lg text-sm ${m.bg} ${m.text} ${className}`}>
      {m.glyph}
    </span>
  );
}

export function FragmentRow({
  receipt,
  active = false,
  reason,
  onSelect,
}: {
  receipt: Receipt;
  active?: boolean;
  reason?: string | undefined;
  onSelect?: ((r: Receipt) => void) | undefined;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(receipt)}
      className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
        active
          ? `border-accent/40 bg-accent/10 ${TYPE_META[receipt.type].ring} ring-1`
          : "border-white/10 bg-white/[0.06] hover:bg-white/[0.1]"
      }`}
    >
      <TypeGlyph type={receipt.type} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{receipt.title}</p>
        <p className="truncate text-[11px] text-muted">
          {receipt.subtitle ? `${receipt.subtitle} · ` : ""}
          {formatDate(receipt.ts)}
          {isNight(receipt.ts) ? ` · ${formatTime(receipt.ts)}` : ""}
        </p>
      </div>
      {receipt.amount ? (
        <span className="shrink-0 text-[11px] text-gold">₹{Math.round(receipt.amount).toLocaleString()}</span>
      ) : null}
      {reason ? <span className="hidden shrink-0 text-[10px] text-accent sm:block">{reason}</span> : null}
    </button>
  );
}

export function ReceiptDetail({ receipt }: { receipt: Receipt }) {
  const metaEntries = Object.entries(receipt.meta).filter(([, v]) => v !== null && v !== "" && v !== undefined);
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2">
        <TypeChip type={receipt.type} />
        <span className="text-[11px] text-muted">
          {formatDate(receipt.ts)} · {formatTime(receipt.ts)}
        </span>
      </div>
      <p className="mt-4 font-display text-xl leading-snug">{receipt.title}</p>
      {receipt.subtitle ? <p className="mt-1 text-sm text-muted">{receipt.subtitle}</p> : null}
      {receipt.detail ? <p className="mt-3 text-xs leading-relaxed text-muted">{receipt.detail}</p> : null}
      {receipt.note ? (
        <p className="mt-3 rounded-xl border border-white/10 bg-ink2/60 p-3 font-display text-sm italic leading-snug text-cloud/90">
          {receipt.note}
        </p>
      ) : null}
      {metaEntries.length ? (
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          {metaEntries.slice(0, 8).map(([k, v]) => (
            <div key={k} className="flex justify-between gap-2 border-b border-white/5 pb-1">
              <dt className="text-muted capitalize">{k.replace(/([A-Z])/g, " $1")}</dt>
              <dd className="truncate text-cloud/90">
                {typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {receipt.tags.slice(0, 6).map((t) => (
          <span key={t} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-muted">
            {t}
          </span>
        ))}
      </div>
      <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted">
        {receipt.derived ? "Inferred from " : "Source · "}
        {receipt.source}
      </p>
    </div>
  );
}
