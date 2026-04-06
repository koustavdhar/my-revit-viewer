import type { ViewerSourceFile } from "@/features/viewer/formats/logical-formats";

/** High-level content mode for the unified viewer shell. */
export type ContentKind = "bim" | "gis";

/** BIM-only, GIS-only, or split workspace (ViewerShell scene dropdown). */
export type SceneMode = "bim" | "gis" | "combined";

/**
 * Which BIM engine will eventually own the center viewport.
 * `undefined` keeps the legacy Speckle / preview routing from `modelUrl` + `modelSource`.
 */
export type BimEngine = "speckle" | "ifc" | "aps";

export type ViewerProject = {
  id: string;
  name: string;
  client: string;
  location: string;
  status: string;
  lastUpdated: string;
  /** Speckle stream / model page URL from mock data or API (used by viewer integration). */
  modelUrl?: string;
  modelSource?: string;
  discipline?: string;
  contentKind: ContentKind;
  /** GIS adapter: URL or site-relative path to GeoJSON (e.g. `/samples/demo.geojson`). */
  geoJsonUrl?: string;
  /** Direct IFC URL for the That Open / web-ifc path (overrides IFC rows in `sourceFiles` when set). */
  ifcUrl?: string;
  bimEngine?: BimEngine;
  /** Mock or API: files attached to this scene for format routing. */
  sourceFiles?: ViewerSourceFile[];
};

export type ElementItem = {
  id: string;
  category: string;
  family: string;
  type: string;
  level: string;
  material: string;
};

export type TreeGroup = {
  level: string;
  categories: {
    name: string;
    elements: ElementItem[];
  }[];
};
