"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";
import type { GisLayerPanelRow } from "@/features/viewer/gis/gis-types";
import type { ViewerProject } from "@/features/viewer/types";
import { Badge, Button, EmptyState } from "@/components/ui";
import { FORMAT_DEFINITIONS } from "@/features/viewer/formats/logical-formats";

type LayerFocus = {
  selectionId?: string | null;
  zoomTargetId?: string | null;
};

type GisLayersPanelProps = {
  project: ViewerProject;
  rows: GisLayerPanelRow[];
  onToggleVisible: (id: string, visible: boolean) => void;
  onZoomToLayer: (id: string) => void;
  /**
   * When false (e.g. Combined mode), only the Layers section is shown so the rail stacks with BIM.
   * @default true
   */
  showProjectChrome?: boolean;
  /** Highlight selected map feature layer and/or last fit-to-layer target. */
  layerFocus?: LayerFocus;
  density?: "default" | "compact";
};

type BadgeVariant = ComponentProps<typeof Badge>["variant"];

function formatShortLabel(format: GisLayerPanelRow["format"]): string {
  const id = FORMAT_DEFINITIONS[format].id;
  if (id === "3DTILES") return "3D Tiles";
  return FORMAT_DEFINITIONS[format].label;
}

function rowStatusBadge(row: GisLayerPanelRow): { label: string; variant: BadgeVariant } {
  if (row.loadState === "loading") return { label: "Loading", variant: "neutral" };
  if (row.loadState === "error") return { label: "Error", variant: "error" };
  if (row.loadState === "unsupported") {
    if (row.format === "GEOTIFF") return { label: "Terrain · N/A", variant: "warning" };
    return { label: "Not on map", variant: "warning" };
  }
  if (row.format === "3DTILES") {
    if (!row.tilesetRegistered) return { label: "URL issue", variant: "error" };
    return { label: "Not on 2D map", variant: "warning" };
  }
  if (row.format === "GEOJSON") return { label: "On map", variant: "success" };
  return { label: "Ready", variant: "neutral" };
}

export default function GisLayersPanel({
  project,
  rows,
  onToggleVisible,
  onZoomToLayer,
  showProjectChrome = true,
  layerFocus,
  density = "default",
}: GisLayersPanelProps) {
  const compact = density === "compact";
  const anyLoading = rows.some((r) => r.loadState === "loading");
  const anyError = rows.some((r) => r.loadState === "error");

  return (
    <div className={compact ? "flex min-h-0 flex-col gap-3" : "flex flex-col gap-4"}>
      {showProjectChrome ? (
        <section
          className="border-b border-[color:var(--viewer-chrome-divider)] pb-3"
          aria-labelledby="gis-layers-project-heading"
        >
          <h2 id="gis-layers-project-heading" className="label-key">
            Project
          </h2>
          <p className="mt-1 truncate text-[length:var(--text-sm)] font-semibold text-[color:var(--text)]">
            {project.name}
          </p>
          <p className="mt-0.5 truncate text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
            {project.discipline ?? "—"} · {project.lastUpdated}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <Badge variant="neutral" size="compact">
              Read-only
            </Badge>
            <Link
              href="/dashboard"
              className="text-[length:var(--text-2xs)] font-semibold text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text)]"
            >
              Dashboard
            </Link>
          </div>
          <div className="mt-2">
            <LogoutButton />
          </div>
        </section>
      ) : null}

      <section className="min-h-0 flex-1" aria-labelledby="gis-layers-heading">
        <div className="mb-2">
          <h2 id="gis-layers-heading" className="label-key">
            Layers
          </h2>
          {!compact ? (
            <p className="mt-1 text-[length:var(--text-2xs)] leading-snug text-[color:var(--text-muted)]">
              Toggle visibility and fit the map to GeoJSON. Other formats stay listed for routing.
            </p>
          ) : null}
        </div>

        {anyLoading ? (
          <p
            className="mb-2 flex items-center gap-1.5 text-[length:var(--text-2xs)] font-medium text-[color:var(--text-muted)]"
            role="status"
            aria-live="polite"
          >
            <span className="h-1 w-1 shrink-0 animate-pulse rounded-full bg-[color:var(--primary)]" aria-hidden />
            Loading layers…
          </p>
        ) : null}

        {anyError && !anyLoading ? (
          <p className="mb-2 text-[length:var(--text-2xs)] text-[color:var(--error)]">Some layers failed — see rows.</p>
        ) : null}

        {rows.length === 0 ? (
          <EmptyState
            className="border border-dashed border-[color:var(--viewer-chrome-divider)] px-3 py-6"
            title="No layers"
            message="Add GeoJSON or GIS entries in sourceFiles."
          />
        ) : (
          <ul className="divide-y divide-[color:var(--viewer-chrome-divider)] border-t border-[color:var(--viewer-chrome-divider)]">
            {rows.map((row) => {
              const typeLabel = formatShortLabel(row.format);
              const toggleDisabled =
                row.format === "3DTILES" ? row.loadState !== "ready" : !row.canRenderOnMap;
              const isPick = layerFocus?.selectionId && row.id === layerFocus.selectionId;
              const isZoom = layerFocus?.zoomTargetId && row.id === layerFocus.zoomTargetId;
              const status = rowStatusBadge(row);

              return (
                <li
                  key={row.id}
                  className={[
                    "py-2.5 transition-colors",
                    isPick
                      ? "bg-[color:color-mix(in_srgb,var(--primary-50)_70%,var(--surface))]"
                      : isZoom && !isPick
                        ? "bg-[color:color-mix(in_srgb,var(--accent-50)_45%,var(--surface))]"
                        : "hover:bg-[color:color-mix(in_srgb,var(--surface-muted)_80%,var(--surface))]",
                  ].join(" ")}
                >
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                    <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 shrink-0 rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]"
                        checked={row.visible}
                        disabled={toggleDisabled}
                        onChange={(e) => onToggleVisible(row.id, e.target.checked)}
                        aria-label={`Show ${row.displayName}`}
                      />
                      <span className="min-w-0 truncate text-[length:var(--text-xs)] font-semibold text-[color:var(--text)]">
                        {row.displayName}
                      </span>
                    </label>

                    <div className="flex min-w-0 flex-wrap items-center gap-1 sm:flex-1 sm:justify-end">
                      <Badge variant="neutral" size="compact">
                        {typeLabel}
                      </Badge>
                      <Badge variant={status.variant} size="compact">
                        {status.label}
                      </Badge>
                      {isPick ? (
                        <Badge variant="primary" size="compact">
                          Selected
                        </Badge>
                      ) : null}
                      {isZoom && !isPick ? (
                        <Badge variant="neutral" size="compact">
                          Fit target
                        </Badge>
                      ) : null}
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="!h-7 shrink-0 !px-2 !text-[length:var(--text-2xs)]"
                        disabled={!row.canRenderOnMap}
                        onClick={() => onZoomToLayer(row.id)}
                      >
                        Fit
                      </Button>
                    </div>
                  </div>
                  {row.errorMessage ? (
                    <p className="mt-1.5 border-l-2 border-[color:var(--error)] pl-2 text-[length:var(--text-2xs)] text-[color:var(--error)]">
                      {row.errorMessage}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
