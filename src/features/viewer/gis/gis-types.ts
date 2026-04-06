import type { GeoJsonObject } from "geojson";
import type { LogicalFileFormat } from "@/features/viewer/formats/logical-formats";

/**
 * Rough grouping for the layer list (Leaflet today; Cesium later for 3dtiles).
 * GeoJSON = vectors on the 2D map. 3D Tiles = streamed mesh city (needs a 3D engine). Terrain = GeoTIFF path later.
 */
export type GisLayerKind = "geojson" | "3dtiles" | "terrain" | "other_gis";

export const GIS_LAYER_KIND_BADGE: Record<GisLayerKind, string> = {
  geojson: "GeoJSON Layer",
  "3dtiles": "3D Tiles Scene",
  terrain: "Terrain Layer",
  other_gis: "GIS layer",
};

export function gisLayerKindFromFormat(format: LogicalFileFormat): GisLayerKind {
  if (format === "GEOJSON") return "geojson";
  if (format === "3DTILES") return "3dtiles";
  if (format === "GEOTIFF") return "terrain";
  return "other_gis";
}

/** One row in the left-hand GIS layer list. */
export type GisLayerPanelRow = {
  id: string;
  displayName: string;
  format: LogicalFileFormat;
  /** Drives badges: GeoJSON Layer / 3D Tiles Scene / Terrain Layer. */
  layerKind: GisLayerKind;
  visible: boolean;
  /** True when this layer can be drawn on the current Leaflet 2D map (GeoJSON only today). */
  canRenderOnMap: boolean;
  loadState: "loading" | "ready" | "error" | "unsupported";
  errorMessage?: string;
  /** Set when `format === "3DTILES"` and a tileset URL is registered (not rendered on Leaflet yet). */
  tilesetUrl?: string | null;
  /** 3D Tiles: URL is present and passes a light plausibility check. */
  tilesetRegistered?: boolean;
};

/** Payload when the user clicks a vector feature on the map. */
export type GisFeaturePick = {
  layerId: string;
  layerName: string;
  featureId: string;
  properties: Record<string, unknown>;
};

/** Layer slice passed into the Leaflet canvas (and future 3D engine props). */
export type GisMapLayerPayload = {
  id: string;
  name: string;
  visible: boolean;
  colorIndex: number;
  layerKind: GisLayerKind;
  geojson: GeoJsonObject | null;
  /** 3D Tiles root URL — Leaflet ignores; Cesium path will consume. */
  tilesetUrl: string | null;
};

/** Derived GIS load / error state for viewport chrome. */
export type GisStatusSummary = {
  isLoadingLayers: boolean;
  hasNoManifest: boolean;
  hasLayerLoadError: boolean;
  failedLayerCount: number;
  loadedGeoJsonLayerCount: number;
  expectedGeoJsonLayerCount: number;
  /** Tileset URLs recorded for a future 3D engine (not drawn on Leaflet). */
  registered3dTilesCount: number;
  /** 3DTILES rows without a usable URL. */
  pending3dTilesUrlCount: number;
  /** GEOTIFF (terrain) rows in manifest — engine not wired. */
  terrainLayerCount: number;
};
