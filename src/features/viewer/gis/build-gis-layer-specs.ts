import {
  FORMAT_DEFINITIONS,
  type LogicalFileFormat,
} from "@/features/viewer/formats/logical-formats";
import { gisLayerKindFromFormat, type GisLayerKind } from "@/features/viewer/gis/gis-types";
import type { ViewerProject } from "@/features/viewer/types";

export type GisLayerSpec = {
  id: string;
  displayName: string;
  format: LogicalFileFormat;
  url: string | null;
  layerKind: GisLayerKind;
};

/**
 * Build an ordered list of GIS-related assets for this project.
 * De-duplicates by URL so the same GeoJSON is not loaded twice.
 */
export function buildGisLayerSpecs(project: ViewerProject): GisLayerSpec[] {
  const result: GisLayerSpec[] = [];
  const usedUrls = new Set<string>();

  const push = (spec: GisLayerSpec) => {
    if (spec.url && usedUrls.has(spec.url)) return;
    if (spec.url) usedUrls.add(spec.url);
    result.push(spec);
  };

  const primary = project.geoJsonUrl?.trim();
  if (primary) {
    push({
      id: "geo-primary",
      displayName: "Primary GeoJSON (project.geoJsonUrl)",
      format: "GEOJSON",
      url: primary,
      layerKind: gisLayerKindFromFormat("GEOJSON"),
    });
  }

  for (const f of project.sourceFiles ?? []) {
    if (FORMAT_DEFINITIONS[f.format].family !== "gis") continue;
    push({
      id: f.id,
      displayName: f.displayName,
      format: f.format,
      url: f.url?.trim() ?? null,
      layerKind: gisLayerKindFromFormat(f.format),
    });
  }

  return result;
}
