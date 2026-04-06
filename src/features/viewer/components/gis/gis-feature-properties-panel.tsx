"use client";

import type { GisFeaturePick } from "@/features/viewer/gis/gis-types";
import { groupFeatureProperties, isGisPropertyHighlighted } from "@/features/viewer/gis/group-feature-properties";
import { Badge, EmptyState } from "@/components/ui";

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

type GisFeaturePropertiesPanelProps = {
  selection: GisFeaturePick | null;
  embedded?: boolean;
};

export default function GisFeaturePropertiesPanel({ selection, embedded }: GisFeaturePropertiesPanelProps) {
  const groups = selection ? groupFeatureProperties(selection.properties) : [];
  const scrollClass = embedded
    ? "min-h-0"
    : "mt-2 max-h-[min(420px,52vh)] min-h-0 overflow-y-auto pr-0.5";

  const body = (
    <div className={selection || !embedded ? "inspector-panel-stack" : ""}>
      {!embedded ? (
        <header className="inspector-section gap-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="label-key text-[length:var(--text-2xs)]">GIS feature</h2>
              <p className="mt-0.5 text-[length:var(--text-2xs)] leading-snug text-[color:var(--text-muted)]">
                Select a feature on the map.
              </p>
            </div>
            <Badge variant="success" size="compact" className="shrink-0">
              GeoJSON
            </Badge>
          </div>
        </header>
      ) : null}

      {!selection ? (
        <EmptyState
          className="border-0 bg-transparent px-0 py-6 shadow-none"
          title="No GIS selection"
          message="Click a vector feature on the map."
        />
      ) : (
        <>
          <section className="inspector-section">
            <h3 className="inspector-section-title">Reference</h3>
            <dl className="inspector-dl inspector-dl-muted">
              <div className="inspector-attr-row inspector-attr-row--key">
                <dt className="inspector-field-label">Layer</dt>
                <dd className="truncate text-[length:var(--text-xs)] font-bold text-[color:var(--text)]">{selection.layerName}</dd>
              </div>
              <div className="inspector-attr-row inspector-attr-row--key">
                <dt className="inspector-field-label">Feature ID</dt>
                <dd className="break-all font-mono text-[length:var(--text-2xs)] font-medium text-[color:var(--text)]">
                  {selection.featureId}
                </dd>
              </div>
            </dl>
          </section>

          <div className={scrollClass}>
            {groups.length === 0 ? (
              <EmptyState
                className="border-0 bg-transparent px-0 py-4 shadow-none"
                title="No properties"
                message="No attributes on this feature."
              />
            ) : (
              <div className="inspector-panel-stack">
                {groups.map((group) => (
                  <section key={group.id} className="inspector-section">
                    <h3 className="inspector-section-title">{group.title}</h3>
                    <dl className="inspector-dl text-[length:var(--text-xs)]">
                      {group.entries.map(([key, value]) => (
                        <div
                          key={key}
                          className={[
                            "inspector-attr-row",
                            isGisPropertyHighlighted(key) ? "inspector-attr-row--key" : "",
                          ].join(" ")}
                        >
                          <dt className="inspector-field-label break-words">{key}</dt>
                          <dd className="break-words font-medium leading-snug text-[color:var(--text)]">{formatValue(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))}
              </div>
            )}
          </div>
        </>
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
        selection ? "border-l-[3px] border-l-[color:var(--accent)] pl-[length:var(--space-2)]" : "",
      ].join(" ")}
    >
      <div className="min-h-0 flex-1">{body}</div>
      <p className="mt-3 border-t border-[color:var(--viewer-chrome-divider)] pt-2 text-[length:var(--text-2xs)] leading-tight text-[color:var(--text-subtle)]">
        Read-only
      </p>
    </div>
  );
}
