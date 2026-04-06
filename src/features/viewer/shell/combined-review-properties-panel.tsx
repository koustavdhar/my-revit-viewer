"use client";

import type { BimElementSelection } from "@/features/viewer/bim/bim-types";
import type { GisFeaturePick } from "@/features/viewer/gis/gis-types";
import BimElementPropertiesPanel from "@/features/viewer/components/bim/bim-element-properties-panel";
import GisFeaturePropertiesPanel from "@/features/viewer/components/gis/gis-feature-properties-panel";
import { Badge, Button } from "@/components/ui";

export type CombinedPropertySource = "bim" | "gis";

type CombinedReviewPropertiesPanelProps = {
  bimSelection: BimElementSelection | null;
  gisSelection: GisFeaturePick | null;
  activeSource: CombinedPropertySource;
  onActiveSourceChange: (source: CombinedPropertySource) => void;
};

export default function CombinedReviewPropertiesPanel({
  bimSelection,
  gisSelection,
  activeSource,
  onActiveSourceChange,
}: CombinedReviewPropertiesPanelProps) {
  const hasBim = Boolean(bimSelection);
  const hasGis = Boolean(gisSelection);
  const hasActivePick =
    (activeSource === "bim" && hasBim) || (activeSource === "gis" && hasGis);

  const inspectingLabel = activeSource === "bim" ? "BIM element" : "GIS feature";

  return (
    <div
      className={[
        "inspector-root flex h-full min-h-0 flex-col",
        hasActivePick
          ? activeSource === "bim"
            ? "border-l-[3px] border-l-[color:var(--primary)] pl-[length:var(--space-2)]"
            : "border-l-[3px] border-l-[color:var(--accent)] pl-[length:var(--space-2)]"
          : "",
      ].join(" ")}
    >
      <div className="inspector-panel-stack shrink-0 border-b border-[color:var(--viewer-chrome-divider)] pb-3">
        <header className="inspector-section gap-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="label-key text-[length:var(--text-2xs)]">Inspector</h2>
              <p className="mt-0.5 text-[length:var(--text-2xs)] leading-snug text-[color:var(--text-muted)]">
                <span className="font-semibold text-[color:var(--text)]">{inspectingLabel}</span>
                <span className="text-[color:var(--text-subtle)]"> · properties</span>
              </p>
            </div>
            <Badge variant={activeSource === "bim" ? "primary" : "success"} size="compact" className="shrink-0">
              {activeSource === "bim" ? "BIM" : "GIS"}
            </Badge>
          </div>
        </header>

        <div
          className="border-l-2 border-[color:color-mix(in_srgb,var(--warning)_55%,var(--border))] bg-[color:var(--warning-50)] px-2 py-1.5"
          role="status"
        >
          <p className="text-[length:var(--text-2xs)] font-semibold text-[color:var(--warning)]">Alignment preview</p>
          <p
            className="mt-0.5 line-clamp-2 text-[length:var(--text-2xs)] leading-snug text-[color:var(--text-muted)]"
            title="BIM and GIS are not georeferenced to each other in this build — compare by eye only until survey / EPSG workflows land."
          >
            Not georeferenced — compare visually only.
          </p>
        </div>

        <section className="inspector-section gap-1.5">
          <h3 className="inspector-section-title">Source</h3>
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Active property source">
            <Button
              type="button"
              size="sm"
              variant={activeSource === "bim" ? "primary" : "secondary"}
              disabled={!hasBim}
              aria-pressed={activeSource === "bim"}
              className="!h-7 !gap-1 !px-2 !text-[length:var(--text-2xs)]"
              onClick={() => onActiveSourceChange("bim")}
            >
              BIM
              {hasBim ? (
                <Badge variant="success" size="compact" className="!border-0">
                  On
                </Badge>
              ) : (
                <Badge variant="neutral" size="compact" className="!border-0">
                  —
                </Badge>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={activeSource === "gis" ? "primary" : "secondary"}
              disabled={!hasGis}
              aria-pressed={activeSource === "gis"}
              className="!h-7 !gap-1 !px-2 !text-[length:var(--text-2xs)]"
              onClick={() => onActiveSourceChange("gis")}
            >
              GIS
              {hasGis ? (
                <Badge variant="success" size="compact" className="!border-0">
                  On
                </Badge>
              ) : (
                <Badge variant="neutral" size="compact" className="!border-0">
                  —
                </Badge>
              )}
            </Button>
          </div>
        </section>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pt-2">
        {activeSource === "bim" ? (
          <BimElementPropertiesPanel selection={bimSelection} embedded />
        ) : (
          <GisFeaturePropertiesPanel selection={gisSelection} embedded />
        )}
      </div>

      <p className="mt-2 shrink-0 border-t border-[color:var(--viewer-chrome-divider)] pt-2 text-[length:var(--text-2xs)] leading-tight text-[color:var(--text-subtle)]">
        Read-only
      </p>
    </div>
  );
}
