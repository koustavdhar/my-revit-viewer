"use client";

/**
 * BIM + GIS viewports for ViewerShell.
 *
 * Data flow (read top-down):
 *   API/mock project → `ViewerProject` + `sourceFiles[]` → `toViewerProject()` on the way in
 *   → ViewerShell builds `ViewerAdapterContext` (project + `bim` / `gis` bindings)
 *   → `renderBimViewport` / `renderGisViewport` mount the real engines (IFC / Leaflet).
 */

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import type { BimManualAlignment } from "@/features/viewer/bim/bim-manual-alignment";
import BimIfcViewport from "@/features/viewer/components/bim/bim-ifc-viewport";
import GisMapToolbar from "@/features/viewer/components/gis/gis-map-toolbar";
import GisStatusStrip from "@/features/viewer/components/gis/gis-status-strip";
import type {
  GisFeaturePick,
  GisLayerPanelRow,
  GisMapLayerPayload,
  GisStatusSummary,
} from "@/features/viewer/gis/gis-types";
import { resolveBimViewportUrl } from "@/features/viewer/bim/resolve-bim-viewport-url";
import type { BimElementSelection, BimViewerSidebarState } from "@/features/viewer/bim/bim-types";
import type { ViewerProject } from "@/features/viewer/types";
import { AlertBanner, Skeleton } from "@/components/ui";

const GisMapCanvas = dynamic(() => import("@/features/viewer/components/gis/gis-map-canvas"), {
  ssr: false,
  loading: () => <Skeleton className="min-h-[480px] w-full rounded-none border-0 bg-[color:var(--surface-muted)]" />,
});

export type GisAdapterBindings = {
  mapRenderKey: string;
  panelRows: GisLayerPanelRow[];
  mapLayers: GisMapLayerPayload[];
  statusSummary: GisStatusSummary;
  setLayerVisible: (id: string, visible: boolean) => void;
  requestZoomToLayer: (id: string) => void;
  zoomTargetId: string | null;
  clearZoomTarget: () => void;
  onMapFeatureClick: (pick: GisFeaturePick) => void;
  labelsEnabled: boolean;
  setLabelsEnabled: (value: boolean) => void;
  fitAllToken: number;
  requestFitAllLayers: () => void;
  resetViewToken: number;
  requestResetMapView: () => void;
};

export type BimAdapterBindings = {
  selection: BimElementSelection | null;
  setSelection: (value: BimElementSelection | null) => void;
  onSidebarSync: (state: BimViewerSidebarState) => void;
  manualAlignment: BimManualAlignment;
  setManualAlignment: (patch: Partial<BimManualAlignment>) => void;
  resetManualAlignment: () => void;
};

export type ViewerAdapterContext = {
  project: ViewerProject;
  refreshTick: number;
  readOnly: true;
  gis?: GisAdapterBindings;
  bim?: BimAdapterBindings;
};

export type ViewerAdapterLayout = "default" | "compact";

export function renderBimViewport(ctx: ViewerAdapterContext, layout: ViewerAdapterLayout): ReactNode {
  const compact = layout === "compact";
  const bim = ctx.bim;
  if (!bim) {
    return (
      <p className="text-[length:var(--text-xs)] font-medium text-[color:var(--warning)]">
        BIM bindings missing — ViewerShell should pass `ctx.bim` when the BIM viewport is shown.
      </p>
    );
  }

  const loadTarget = resolveBimViewportUrl(ctx.project);
  const viewport = (
    <BimIfcViewport
      project={ctx.project}
      loadTarget={loadTarget}
      refreshTick={ctx.refreshTick}
      compact={compact}
      selection={bim.selection}
      onSelectionChange={bim.setSelection}
      onViewerSync={bim.onSidebarSync}
      manualAlignment={bim.manualAlignment}
    />
  );

  if (!compact) return viewport;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <p className="sr-only">BIM · IFC</p>
      <div className="min-h-0 min-w-0 flex-1">{viewport}</div>
    </div>
  );
}

export function renderGisViewport(ctx: ViewerAdapterContext, layout: ViewerAdapterLayout): ReactNode {
  const compact = layout === "compact";

  if (!ctx.gis) {
    return (
      <AlertBanner
        tone="warning"
        title="GIS not wired"
        message="ViewerShell should pass `ctx.gis` when Scene mode is GIS or Combined."
        className="text-xs"
      />
    );
  }

  const g = ctx.gis;
  const hasDrawableOnMap = g.mapLayers.some((l) => l.visible && l.geojson);
  const hasAnyGeoJsonData = g.mapLayers.some((l) => l.geojson);
  const showBlockingLoadOverlay = g.statusSummary.isLoadingLayers && !hasAnyGeoJsonData;
  const showPartialLoadBar = g.statusSummary.isLoadingLayers && hasAnyGeoJsonData;
  const registered3dTilesCount = g.statusSummary.registered3dTilesCount;

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col gap-1.5">
      <p className="sr-only">Map · OpenStreetMap basemap</p>

      <GisStatusStrip status={g.statusSummary} hasDrawableOnMap={hasDrawableOnMap} />

      {g.statusSummary.hasLayerLoadError ? (
        <AlertBanner
          tone="error"
          title="Layer load failed"
          message={`One or more GeoJSON URLs could not be loaded. Check the left panel (${g.statusSummary.failedLayerCount} failed).`}
          className="text-xs"
        />
      ) : null}

      {registered3dTilesCount > 0 ? (
        <AlertBanner
          tone="info"
          title="3D Tiles scene(s) on file"
          message={`${registered3dTilesCount} tileset URL(s) are registered; this map is 2D-only until a 3D engine is added.`}
          className="text-xs"
        />
      ) : null}

      <GisMapToolbar
        compact={compact}
        labelsEnabled={g.labelsEnabled}
        onToggleLabels={() => g.setLabelsEnabled(!g.labelsEnabled)}
        onFitAllLayers={g.requestFitAllLayers}
        onResetView={g.requestResetMapView}
        fitDisabled={!hasDrawableOnMap}
      />

      <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
        <GisMapCanvas
          key={g.mapRenderKey}
          layers={g.mapLayers}
          zoomTargetId={g.zoomTargetId}
          onZoomComplete={g.clearZoomTarget}
          onFeatureClick={g.onMapFeatureClick}
          compact={compact}
          labelsEnabled={g.labelsEnabled}
          fitAllTrigger={g.fitAllToken}
          resetViewTrigger={g.resetViewToken}
          showBlockingLoadOverlay={showBlockingLoadOverlay}
          showPartialLoadBar={showPartialLoadBar}
          registered3dTilesCount={registered3dTilesCount}
        />
      </div>
    </div>
  );
}
