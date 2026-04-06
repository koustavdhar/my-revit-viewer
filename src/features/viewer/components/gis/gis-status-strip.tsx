"use client";

import type { GisStatusSummary } from "@/features/viewer/gis/gis-types";
import { Badge } from "@/components/ui";

type GisStatusStripProps = {
  status: GisStatusSummary;
  hasDrawableOnMap: boolean;
};

/**
 * Compact read-only status row for the GIS viewport (AEC-style, no map chrome).
 */
export default function GisStatusStrip({ status, hasDrawableOnMap }: GisStatusStripProps) {
  const {
    loadedGeoJsonLayerCount,
    expectedGeoJsonLayerCount,
    registered3dTilesCount,
    pending3dTilesUrlCount,
    terrainLayerCount,
  } = status;

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-2 py-1 shadow-[var(--shadow-xs)]">
      {status.hasNoManifest ? (
        <Badge variant="warning" size="compact">
          No GIS layer
        </Badge>
      ) : null}

      {!status.hasNoManifest &&
      expectedGeoJsonLayerCount === 0 &&
      registered3dTilesCount === 0 &&
      pending3dTilesUrlCount === 0 &&
      terrainLayerCount === 0 ? (
        <Badge variant="neutral" size="compact">
          No loadable GIS URLs
        </Badge>
      ) : null}

      {!status.hasNoManifest && expectedGeoJsonLayerCount > 0 && loadedGeoJsonLayerCount > 0 ? (
        <Badge variant="success" size="compact">
          GeoJSON loaded ({loadedGeoJsonLayerCount}/{expectedGeoJsonLayerCount})
        </Badge>
      ) : null}

      {!status.hasNoManifest && expectedGeoJsonLayerCount > 0 && loadedGeoJsonLayerCount === 0 && !status.isLoadingLayers ? (
        <Badge variant="warning" size="compact">
          GeoJSON not ready
        </Badge>
      ) : null}

      {registered3dTilesCount > 0 ? (
        <Badge variant="primary" size="compact">
          3D Tiles Scene ({registered3dTilesCount}) — 2D map only
        </Badge>
      ) : null}

      {pending3dTilesUrlCount > 0 ? (
        <Badge variant="warning" size="compact">
          3D Tiles missing URL ({pending3dTilesUrlCount})
        </Badge>
      ) : null}

      {terrainLayerCount > 0 ? (
        <Badge variant="neutral" size="compact">
          Terrain Layer ({terrainLayerCount}) — engine pending
        </Badge>
      ) : null}

      {status.isLoadingLayers ? (
        <Badge variant="primary" size="compact">
          Loading layers…
        </Badge>
      ) : null}

      {status.hasLayerLoadError ? (
        <Badge variant="error" size="compact">
          Layer error ({status.failedLayerCount})
        </Badge>
      ) : null}

      {!status.hasNoManifest && !hasDrawableOnMap && loadedGeoJsonLayerCount > 0 ? (
        <span className="text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
          All GeoJSON layers hidden — enable visibility in the list.
        </span>
      ) : null}
    </div>
  );
}
