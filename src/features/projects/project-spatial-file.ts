import type { ApsModelDerivativeTargetFormat } from "@/features/integrations/aps/aps-config";
import {
  FORMAT_DEFINITIONS,
  type LogicalFileFormat,
  type ViewerSourceFile,
} from "@/features/viewer/formats/logical-formats";
import type { SceneMode } from "@/features/viewer/types";
import { routeViewerFromFiles } from "@/features/viewer/routing/viewer-file-router";

/** High-level bucket for registry UI (matches how teams talk about data). */
export type SpatialFileCategory = "BIM" | "GIS" | "GENERIC";

/**
 * Lifecycle of a file in the upload / conversion pipeline (mock-friendly).
 * - `ready` — can be used by the viewer today (where the format supports it).
 * - `available` — stored and reachable, same as ready for this prototype.
 * - `processing` — conversion or tiling in progress (mock).
 * - `error` — failed ingest or derivative.
 * - `pending_upload` — metadata only, no `source` yet.
 */
export type SpatialFileStatus = "ready" | "available" | "processing" | "error" | "pending_upload";

export type SpatialViewModeHint = Extract<SceneMode, "bim" | "gis" | "combined"> | "none";

/**
 * Per-file APS / Model Derivative metadata (future: populated by your upload + translation API).
 * RVT and DWG rows also show APS messaging in the UI even when this object is omitted.
 */
export type SpatialFileApsMeta = {
  translationTarget: ApsModelDerivativeTargetFormat;
  /** Base64-encoded SVF2 viewer URN after translation succeeds. */
  derivativeUrn?: string;
  translationStatus?: "not_started" | "queued" | "processing" | "succeeded" | "failed";
};

/**
 * One spatial asset attached to a project (future: rows from your upload / conversion API).
 */
export type ProjectSpatialFile = {
  id: string;
  fileName: string;
  format: LogicalFileFormat;
  category: SpatialFileCategory;
  /** HTTPS URL or site-relative path (e.g. `/samples/x.geojson`). */
  source: string;
  status: SpatialFileStatus;
  /** Hint for which viewer layout this file is meant for (per-file; project may still open Combined). */
  viewModeRecommendation: SpatialViewModeHint;
  /** Optional queue / error text for the registry table. */
  statusNote?: string;
  /** Optional APS viewer / Model Derivative fields (see `docs/aps-viewer-integration.md`). */
  aps?: SpatialFileApsMeta;
};

export function formatToSpatialCategory(format: LogicalFileFormat): SpatialFileCategory {
  const fam = FORMAT_DEFINITIONS[format].family;
  if (fam === "bim") return "BIM";
  if (fam === "gis") return "GIS";
  return "GENERIC";
}

/** Default per-format view hint when not overridden in mock/API data. */
export function defaultViewModeHint(format: LogicalFileFormat): SpatialViewModeHint {
  const fam = FORMAT_DEFINITIONS[format].family;
  if (fam === "gis") return "gis";
  if (fam === "bim") return "bim";
  return "bim";
}

export function spatialFilesToViewerSourceFiles(files: ProjectSpatialFile[]): ViewerSourceFile[] {
  return files.map((f) => ({
    id: f.id,
    displayName: f.fileName,
    format: f.format,
    url: f.source.trim() ? f.source.trim() : undefined,
  }));
}

/** First suitable IFC URL for the That Open viewport (explicit project.ifcUrl still wins in toViewerProject). */
export function deriveIfcUrlFromSpatialFiles(files: ProjectSpatialFile[]): string | undefined {
  const ok = (s: SpatialFileStatus) => s === "ready" || s === "available";
  const row = files.find(
    (f) => f.format === "IFC" && ok(f.status) && f.source.trim().length > 0,
  );
  return row?.source.trim();
}

/** First GeoJSON layer URL for legacy `geoJsonUrl` + GIS specs (explicit project.geoJsonUrl still wins). */
export function deriveGeoJsonUrlFromSpatialFiles(files: ProjectSpatialFile[]): string | undefined {
  const ok = (s: SpatialFileStatus) => s === "ready" || s === "available";
  const row = files.find(
    (f) => f.format === "GEOJSON" && f.category === "GIS" && ok(f.status) && f.source.trim().length > 0,
  );
  return row?.source.trim();
}

export function legacySpatialFilesFromSourceFiles(files: ViewerSourceFile[]): ProjectSpatialFile[] {
  return files.map((f) => ({
    id: f.id,
    fileName: f.displayName,
    format: f.format,
    category: formatToSpatialCategory(f.format),
    source: f.url?.trim() ?? "",
    status: f.url?.trim() ? ("ready" as const) : ("pending_upload" as const),
    viewModeRecommendation: defaultViewModeHint(f.format),
  }));
}

/** Accept mock/API project shape without importing mock-projects (avoids cycles). */
export type SpatialFileContainer = {
  spatialFiles?: ProjectSpatialFile[];
  sourceFiles?: ViewerSourceFile[];
};

export function getProjectSpatialFiles(project: SpatialFileContainer): ProjectSpatialFile[] {
  if (project.spatialFiles?.length) return project.spatialFiles;
  return legacySpatialFilesFromSourceFiles(project.sourceFiles ?? []);
}

const okStatus = (s: SpatialFileStatus) => s === "ready" || s === "available";

/** Project has any BIM-classified row (viewer can open BIM mode; placeholders OK for pending uploads). */
export function projectHasBimSlot(files: ProjectSpatialFile[]): boolean {
  return files.some((f) => f.category === "BIM");
}

/** GIS row the map can load today (e.g. GeoJSON with URL). */
export function projectHasDirectGisSlot(files: ProjectSpatialFile[]): boolean {
  return files.some(
    (f) =>
      f.category === "GIS" &&
      okStatus(f.status) &&
      FORMAT_DEFINITIONS[f.format].webViewReady &&
      f.source.trim().length > 0,
  );
}

/** Combined: at least one loadable IFC + one loadable GeoJSON (MVP definition). */
export function projectSupportsCombinedFromRegistry(files: ProjectSpatialFile[]): boolean {
  const hasIfc = files.some((f) => f.format === "IFC" && okStatus(f.status) && f.source.trim().length > 0);
  const hasGeo = files.some(
    (f) => f.format === "GEOJSON" && f.category === "GIS" && okStatus(f.status) && f.source.trim().length > 0,
  );
  return hasIfc && hasGeo;
}

/** Suggested scene mode from spatial registry (same rules as file router on derived sourceFiles). */
export function recommendedSceneModeFromSpatialFiles(files: ProjectSpatialFile[]): SceneMode {
  if (files.length === 0) return "bim";
  return routeViewerFromFiles(spatialFilesToViewerSourceFiles(files)).recommendedSceneMode;
}

export function viewerModeForSpatialFile(file: ProjectSpatialFile): SceneMode {
  if (file.viewModeRecommendation === "gis") return "gis";
  if (file.viewModeRecommendation === "combined") return "combined";
  if (file.viewModeRecommendation === "none") return "bim";
  return "bim";
}

export function buildViewerHref(projectId: string, mode: SceneMode, fileId?: string): string {
  const q = new URLSearchParams();
  q.set("mode", mode);
  if (fileId) q.set("file", fileId);
  return `/viewer/${projectId}?${q.toString()}`;
}
