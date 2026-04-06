/**
 * Logical file / layer types for routing (not tied to a specific SDK).
 * Extend this list as you add converters and viewers.
 */

export const BIM_FORMATS = ["RVT", "IFC", "DWG"] as const;
export const GIS_FORMATS = ["GEOJSON", "KML", "GEOTIFF", "3DTILES"] as const;
export const GENERIC_3D_FORMATS = ["GLTF", "OBJ", "FBX"] as const;

export const LOGICAL_FILE_FORMATS = [
  ...BIM_FORMATS,
  ...GIS_FORMATS,
  ...GENERIC_3D_FORMATS,
] as const;

export type LogicalFileFormat = (typeof LOGICAL_FILE_FORMATS)[number];

/** High-level bucket for adapter + badge routing. */
export type FormatFamily = "bim" | "gis" | "generic";

export type FormatDefinition = {
  id: LogicalFileFormat;
  family: FormatFamily;
  label: string;
  /**
   * True when a typical web client can display this without a server-side translation step
   * (still may need JS libraries — e.g. Three.js for glTF).
   */
  webViewReady: boolean;
  /**
   * True when production workflows usually run through conversion, tiling, or a proprietary viewer
   * (e.g. Revit → SVF2, GeoTIFF → COG / image service).
   */
  needsConversion: boolean;
  /** Used later for filename-based inference. */
  extensions: string[];
};

export const FORMAT_DEFINITIONS: Record<LogicalFileFormat, FormatDefinition> = {
  RVT: {
    id: "RVT",
    family: "bim",
    label: "Revit",
    webViewReady: false,
    needsConversion: true,
    extensions: [".rvt"],
  },
  IFC: {
    id: "IFC",
    family: "bim",
    label: "IFC",
    webViewReady: true,
    needsConversion: false,
    extensions: [".ifc", ".ifczip"],
  },
  DWG: {
    id: "DWG",
    family: "bim",
    label: "AutoCAD DWG",
    webViewReady: false,
    needsConversion: true,
    extensions: [".dwg"],
  },
  GEOJSON: {
    id: "GEOJSON",
    family: "gis",
    label: "GeoJSON",
    webViewReady: true,
    needsConversion: false,
    extensions: [".geojson"],
  },
  KML: {
    id: "KML",
    family: "gis",
    label: "KML",
    webViewReady: true,
    needsConversion: false,
    extensions: [".kml", ".kmz"],
  },
  GEOTIFF: {
    id: "GEOTIFF",
    family: "gis",
    label: "GeoTIFF",
    webViewReady: false,
    needsConversion: true,
    extensions: [".tif", ".tiff", ".geotiff"],
  },
  "3DTILES": {
    id: "3DTILES",
    family: "gis",
    label: "3D Tiles",
    webViewReady: true,
    needsConversion: false,
    /** Use tileset URL detection later; extension alone is ambiguous. */
    extensions: [],
  },
  GLTF: {
    id: "GLTF",
    family: "generic",
    label: "glTF / GLB",
    webViewReady: true,
    needsConversion: false,
    extensions: [".gltf", ".glb"],
  },
  OBJ: {
    id: "OBJ",
    family: "generic",
    label: "Wavefront OBJ",
    webViewReady: true,
    needsConversion: false,
    extensions: [".obj"],
  },
  FBX: {
    id: "FBX",
    family: "generic",
    label: "Autodesk FBX",
    webViewReady: false,
    needsConversion: true,
    extensions: [".fbx"],
  },
};

export type ViewerSourceFile = {
  id: string;
  displayName: string;
  format: LogicalFileFormat;
  /** Site-relative path (e.g. `/samples/foo.geojson`) or absolute URL for GIS layers. */
  url?: string;
};

export function getFormatFamily(format: LogicalFileFormat): FormatFamily {
  return FORMAT_DEFINITIONS[format].family;
}

export function isLogicalFileFormat(value: string): value is LogicalFileFormat {
  return (LOGICAL_FILE_FORMATS as readonly string[]).includes(value);
}

/** Infer format from a filename; returns null if unknown. Longest extension wins. */
export function inferFormatFromFileName(fileName: string): LogicalFileFormat | null {
  const lower = fileName.trim().toLowerCase();
  const pairs: { ext: string; format: LogicalFileFormat }[] = [];
  for (const id of LOGICAL_FILE_FORMATS) {
    for (const ext of FORMAT_DEFINITIONS[id].extensions) {
      pairs.push({ ext, format: id });
    }
  }
  pairs.sort((a, b) => b.ext.length - a.ext.length);
  for (const { ext, format } of pairs) {
    if (ext && lower.endsWith(ext)) return format;
  }
  return null;
}
