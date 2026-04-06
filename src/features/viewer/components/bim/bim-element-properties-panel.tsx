"use client";

import type { ReactNode } from "react";
import type { BimElementSelection } from "@/features/viewer/bim/bim-types";
import { isBimPropertyHighlighted, orderBimPropertyEntries } from "@/features/viewer/bim/bim-inspector-order";
import { Badge, EmptyState } from "@/components/ui";

function KvRow({
  label,
  value,
  mono,
  emphasize,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  emphasize?: boolean;
}) {
  return (
    <div className={["inspector-attr-row", emphasize ? "inspector-attr-row--key" : ""].join(" ")}>
      <dt className="inspector-field-label break-words">{label}</dt>
      <dd
        className={[
          "break-words text-[length:var(--text-xs)] font-medium leading-snug text-[color:var(--text)]",
          mono ? "font-mono text-[length:var(--text-2xs)]" : "",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}

export default function BimElementPropertiesPanel({
  selection,
  embedded,
}: {
  selection: BimElementSelection | null;
  embedded?: boolean;
}) {
  const entries = selection ? orderBimPropertyEntries(Object.entries(selection.properties)) : [];
  const firstNonHighlightIdx = entries.findIndex(([k]) => !isBimPropertyHighlighted(k));
  const scrollRegionClass = embedded
    ? "min-h-0"
    : "mt-2 max-h-[min(420px,52vh)] min-h-0 overflow-y-auto pr-0.5";

  const body = (
    <div className={selection || !embedded ? "inspector-panel-stack" : ""}>
      {!embedded ? (
        <header className="inspector-section gap-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="label-key text-[length:var(--text-2xs)]">BIM selection</h2>
              <p className="mt-0.5 text-[length:var(--text-2xs)] leading-snug text-[color:var(--text-muted)]">
                Pick an element in the 3D view.
              </p>
            </div>
            <Badge variant="primary" size="compact" className="shrink-0">
              IFC
            </Badge>
          </div>
        </header>
      ) : null}

      {selection ? (
        <>
          <section className="inspector-section">
            <h3 className="inspector-section-title">Reference</h3>
            <dl className="inspector-dl inspector-dl-muted">
              <KvRow label="Model" value={selection.modelId} mono emphasize />
              <KvRow label="Element ID" value={<span className="font-bold tabular-nums">{selection.localId}</span>} mono emphasize />
            </dl>
          </section>

          <section className="inspector-section">
            <h3 className="inspector-section-title">IFC properties</h3>
            {entries.length === 0 ? (
              <EmptyState
                className="border-0 bg-transparent px-0 py-4 shadow-none"
                title="No attributes"
                message="No IFC properties for this pick."
              />
            ) : (
              <div className={scrollRegionClass}>
                <dl className="inspector-dl text-[length:var(--text-xs)]">
                  {entries.map(([k, v], idx) => (
                    <div key={k}>
                      {firstNonHighlightIdx === idx && firstNonHighlightIdx > 0 ? (
                        <hr className="inspector-dl-gap" aria-hidden />
                      ) : null}
                      <KvRow label={k} value={v} emphasize={isBimPropertyHighlighted(k)} />
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </section>
        </>
      ) : (
        <EmptyState
          className="border-0 bg-transparent px-0 py-6 shadow-none"
          title="No BIM selection"
          message="Click the 3D model to inspect properties."
        />
      )}
    </div>
  );

  if (embedded) {
    return <div className="min-h-0">{body}</div>;
  }

  return (
    <div
      className={[
        "inspector-root flex h-full min-h-0 flex-col",
        selection ? "border-l-[3px] border-l-[color:var(--primary)] pl-[length:var(--space-2)]" : "",
      ].join(" ")}
    >
      <div className="min-h-0 flex-1">{body}</div>
      <p className="mt-3 border-t border-[color:var(--viewer-chrome-divider)] pt-2 text-[length:var(--text-2xs)] leading-tight text-[color:var(--text-subtle)]">
        Read-only
      </p>
    </div>
  );
}
