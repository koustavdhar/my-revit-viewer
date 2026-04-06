import type { SceneMode, ViewerProject } from "@/features/viewer/types";

/** `?mode=` on `/viewer/[id]` — single parser so the route and shell stay aligned. */
export function parseSceneModeParam(value: string | undefined): SceneMode | undefined {
  if (value === "bim" || value === "gis" || value === "combined") return value;
  return undefined;
}
import {
  FORMAT_DEFINITIONS,
  type FormatFamily,
  type LogicalFileFormat,
  type ViewerSourceFile,
} from "@/features/viewer/formats/logical-formats";

export type ViewerRoutePlan = {
  /** Unique logical formats from all attached files. */
  detectedFormats: LogicalFileFormat[];
  /** Human-readable list for the UI (e.g. "IFC, GEOJSON"). */
  detectedFormatsLabel: string;
  hasBimFamily: boolean;
  hasGisFamily: boolean;
  hasGenericFamily: boolean;
  /** Suggested initial scene layout for the shell. */
  recommendedSceneMode: SceneMode;
  /** True if any attached format is flagged web-viewable without translation. */
  anyWebViewReady: boolean;
  /** True if any attached format usually needs a conversion / tiling pipeline. */
  anyNeedsConversion: boolean;
};

function uniqueFormats(files: ViewerSourceFile[]): LogicalFileFormat[] {
  const set = new Set<LogicalFileFormat>();
  for (const f of files) {
    set.add(f.format);
  }
  return Array.from(set);
}

function familiesPresent(files: ViewerSourceFile[]): Set<FormatFamily> {
  const s = new Set<FormatFamily>();
  for (const f of files) {
    s.add(FORMAT_DEFINITIONS[f.format].family);
  }
  return s;
}

/**
 * Decide which adapter layout fits the attached files.
 * - BIM + GIS → Combined
 * - GIS only → GIS
 * - BIM only, generic only, or BIM+generic → BIM (mesh uses the BIM viewport slot until a dedicated mesh adapter exists)
 */
export function routeViewerFromFiles(files: ViewerSourceFile[]): ViewerRoutePlan {
  if (files.length === 0) {
    return {
      detectedFormats: [],
      detectedFormatsLabel: "No files",
      hasBimFamily: false,
      hasGisFamily: false,
      hasGenericFamily: false,
      recommendedSceneMode: "bim",
      anyWebViewReady: false,
      anyNeedsConversion: false,
    };
  }

  const detectedFormats = uniqueFormats(files);
  const families = familiesPresent(files);
  const hasBimFamily = families.has("bim");
  const hasGisFamily = families.has("gis");
  const hasGenericFamily = families.has("generic");

  let recommendedSceneMode: SceneMode = "bim";
  if (hasBimFamily && hasGisFamily) {
    recommendedSceneMode = "combined";
  } else if (hasGisFamily && !hasBimFamily) {
    recommendedSceneMode = "gis";
  } else {
    recommendedSceneMode = "bim";
  }

  let anyWebViewReady = false;
  let anyNeedsConversion = false;
  for (const id of detectedFormats) {
    const def = FORMAT_DEFINITIONS[id];
    if (def.webViewReady) anyWebViewReady = true;
    if (def.needsConversion) anyNeedsConversion = true;
  }

  const detectedFormatsLabel = detectedFormats.map((id) => FORMAT_DEFINITIONS[id].label).join(", ");

  return {
    detectedFormats,
    detectedFormatsLabel,
    hasBimFamily,
    hasGisFamily,
    hasGenericFamily,
    recommendedSceneMode,
    anyWebViewReady,
    anyNeedsConversion,
  };
}

/** Default scene mode from `project.sourceFiles` + `contentKind` (single place; ViewerShell uses this on load). */
export function defaultSceneModeForProject(project: Pick<ViewerProject, "sourceFiles" | "contentKind">): SceneMode {
  const files = project.sourceFiles ?? [];
  if (files.length > 0) return routeViewerFromFiles(files).recommendedSceneMode;
  return project.contentKind === "gis" ? "gis" : "bim";
}
