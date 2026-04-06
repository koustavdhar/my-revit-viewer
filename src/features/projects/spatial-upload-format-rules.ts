/**
 * Client-side upload preview: filename → format, BIM/GIS bucket, and simple workflow labels.
 * Single source for “what opens in the viewer today” is FORMAT_DEFINITIONS + MVP set below.
 */

import {
  apsTranslationTargetLabel,
  formatUsesApsModelDerivative,
} from "@/features/integrations/aps";
import {
  FORMAT_DEFINITIONS,
  inferFormatFromFileName,
  type LogicalFileFormat,
} from "@/features/viewer/formats/logical-formats";

export type SpatialUploadCategory = "BIM" | "GIS" | "GENERIC";

export type SpatialUploadWorkflowStatus = "ready_to_view" | "requires_conversion" | "unsupported";

export const SPATIAL_UPLOAD_STATUS_LABELS: Record<SpatialUploadWorkflowStatus, string> = {
  ready_to_view: "Ready to View",
  requires_conversion: "Requires Conversion",
  unsupported: "Unsupported for Now",
};

/** IFC + GeoJSON load in this app without a conversion API. */
export const SPATIAL_UPLOAD_MVP_VIEWER_FORMATS: ReadonlySet<LogicalFileFormat> = new Set([
  "IFC",
  "GEOJSON",
]);

function categoryForFamily(format: LogicalFileFormat): SpatialUploadCategory {
  const fam = FORMAT_DEFINITIONS[format].family;
  if (fam === "bim") return "BIM";
  if (fam === "gis") return "GIS";
  return "GENERIC";
}

function workflowStatusForFormat(format: LogicalFileFormat): SpatialUploadWorkflowStatus {
  const def = FORMAT_DEFINITIONS[format];
  if (SPATIAL_UPLOAD_MVP_VIEWER_FORMATS.has(format)) return "ready_to_view";
  if (!def.webViewReady || def.needsConversion) return "requires_conversion";
  return "requires_conversion";
}

function uploadHintNote(format: LogicalFileFormat): string | undefined {
  if (format === "3DTILES") return "Use a `tileset.json` URL; 3D view needs a future Cesium-style engine.";
  if (format === "RVT" || format === "DWG") {
    return "Typical path: APS upload → Model Derivative → SVF2 → APS Viewer.";
  }
  return undefined;
}

export type SpatialUploadDetection = {
  fileName: string;
  extension: string;
  format: LogicalFileFormat | null;
  formatLabel: string;
  category: SpatialUploadCategory | null;
  categoryDisplay: string;
  technicalDirectlyViewable: boolean;
  technicalNeedsConversion: boolean;
  workflowStatus: SpatialUploadWorkflowStatus;
  workflowStatusLabel: string;
  detailNote?: string;
  apsModelDerivative?: { requiresApsTranslation: true; targetOutput: string };
  gis3dTilesHints?: { webReady: boolean; geospatial3d: true };
};

export function extractFileExtension(fileName: string): string {
  const base = fileName.trim().split(/[/\\]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot <= 0) return "";
  return base.slice(dot).toLowerCase();
}

export function inferLogicalFormatForUpload(fileName: string): LogicalFileFormat | null {
  const fromExtensions = inferFormatFromFileName(fileName);
  if (fromExtensions) return fromExtensions;
  const base = fileName.trim().split(/[/\\]/).pop() ?? "";
  if (/^tileset\.json$/i.test(base)) return "3DTILES";
  return null;
}

export function detectSpatialUploadFromFileName(fileName: string): SpatialUploadDetection {
  const extension = extractFileExtension(fileName);
  const format = inferLogicalFormatForUpload(fileName);

  if (!format) {
    return {
      fileName,
      extension: extension || "—",
      format: null,
      formatLabel: "Unknown",
      category: null,
      categoryDisplay: "—",
      technicalDirectlyViewable: false,
      technicalNeedsConversion: false,
      workflowStatus: "unsupported",
      workflowStatusLabel: SPATIAL_UPLOAD_STATUS_LABELS.unsupported,
      detailNote:
        extension === ""
          ? "No file extension found."
          : "Extension is not in the configured spatial format list.",
    };
  }

  const def = FORMAT_DEFINITIONS[format];
  const category = categoryForFamily(format);
  const workflowStatus = workflowStatusForFormat(format);
  const apsModelDerivative = formatUsesApsModelDerivative(format)
    ? { requiresApsTranslation: true as const, targetOutput: apsTranslationTargetLabel() }
    : undefined;
  const gis3dTilesHints =
    format === "3DTILES" ? { webReady: def.webViewReady, geospatial3d: true as const } : undefined;

  return {
    fileName,
    extension: extension || def.extensions[0] || "—",
    format,
    formatLabel: def.label,
    category,
    categoryDisplay: category === "GENERIC" ? "Generic 3D" : category,
    technicalDirectlyViewable: def.webViewReady,
    technicalNeedsConversion: def.needsConversion,
    workflowStatus,
    workflowStatusLabel: SPATIAL_UPLOAD_STATUS_LABELS[workflowStatus],
    detailNote: uploadHintNote(format),
    apsModelDerivative,
    gis3dTilesHints,
  };
}

export function supportedSpatialUploadExtensionsSummary(): string {
  const exts = new Set<string>();
  for (const id of Object.keys(FORMAT_DEFINITIONS) as LogicalFileFormat[]) {
    for (const e of FORMAT_DEFINITIONS[id].extensions) {
      exts.add(e);
    }
  }
  exts.add("tileset.json");
  return Array.from(exts).sort().join(", ");
}
