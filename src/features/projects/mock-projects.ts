/**
 * Local mock project data for the prototype UI.
 * Spatial assets live in `spatialFiles` (future: mirror your upload / conversion API).
 */

import type { ViewerSourceFile } from "@/features/viewer/formats/logical-formats";
import type { ProjectSpatialFile } from "@/features/projects/project-spatial-file";

export type MockProject = {
  id: string;
  projectName: string;
  clientName: string;
  location: string;
  discipline: string;
  modelSource: string;
  modelUrl: string;
  status: "Active" | "Review" | "Archived";
  lastUpdated: string;
  description: string;
  /** When set to `gis`, used if no spatial files exist. */
  contentKind?: "bim" | "gis";
  geoJsonUrl?: string;
  bimEngine?: "speckle" | "ifc" | "aps";
  ifcUrl?: string;
  /**
   * Canonical list of spatial layers/files for this project.
   * Maps cleanly to future API rows: ingest status, derivatives, viewer hints.
   */
  spatialFiles: ProjectSpatialFile[];
  /** @deprecated Prefer `spatialFiles`; still merged in `getProjectSpatialFiles` when present. */
  sourceFiles?: ViewerSourceFile[];
};

/**
 * User-created projects:
 * - kept separate from samples
 * - intended to be hydrated from an API or localStorage later
 */
export const myProjects: MockProject[] = [];

/**
 * Sample projects:
 * Exactly two “known-good” demos for showcasing the viewer surfaces.
 */
export const sampleProjects: MockProject[] = [
  {
    id: "sp-bim-001",
    projectName: "Sample · BIM Review (IFC)",
    clientName: "Demo Account",
    location: "—",
    discipline: "Architecture",
    modelSource: "IFC (That Open sample)",
    modelUrl: "",
    bimEngine: "ifc",
    ifcUrl: "https://thatopen.github.io/engine_components/resources/ifc/school_str.ifc",
    status: "Active",
    lastUpdated: "2026-04-06",
    description:
      "BIM-focused sample project. Demonstrates 3D viewport, selection, and the right-hand properties inspector using a public IFC sample.",
    spatialFiles: [
      {
        id: "sp-bim-001-ifc",
        fileName: "sample_structure.ifc",
        format: "IFC",
        category: "BIM",
        source: "https://thatopen.github.io/engine_components/resources/ifc/school_str.ifc",
        status: "ready",
        viewModeRecommendation: "bim",
      },
    ],
  },
  {
    id: "sp-combined-001",
    projectName: "Sample · Combined BIM + GIS",
    clientName: "Demo Account",
    location: "—",
    discipline: "Infrastructure",
    modelSource: "IFC + GeoJSON",
    modelUrl: "",
    geoJsonUrl: "/samples/campus-parcels.geojson",
    bimEngine: "ifc",
    ifcUrl: "https://thatopen.github.io/engine_components/resources/ifc/school_str.ifc",
    status: "Active",
    lastUpdated: "2026-04-06",
    description:
      "Combined sample workspace. Demonstrates BIM + GIS mode switching, layer list + visibility, map picking, and the unified inspector switching between sources.",
    spatialFiles: [
      {
        id: "sp-combined-001-ifc",
        fileName: "sample_structure.ifc",
        format: "IFC",
        category: "BIM",
        source: "https://thatopen.github.io/engine_components/resources/ifc/school_str.ifc",
        status: "ready",
        viewModeRecommendation: "bim",
      },
      {
        id: "sp-combined-001-geojson",
        fileName: "campus-parcels.geojson",
        format: "GEOJSON",
        category: "GIS",
        source: "/samples/campus-parcels.geojson",
        status: "ready",
        viewModeRecommendation: "gis",
      },
      {
        id: "sp-combined-001-tiles",
        fileName: "Ayutthaya-sample/tileset.json",
        format: "3DTILES",
        category: "GIS",
        source: "https://storage.googleapis.com/ogc-3d-tiles/ayutthaya/tileset.json",
        status: "ready",
        viewModeRecommendation: "gis",
        statusNote: "3D Tiles URL registered (rendering requires future 3D GIS engine).",
      },
    ],
  },
];

/**
 * Convenience: all projects that can be opened by routes.
 * (Dashboards can still render `myProjects` vs `sampleProjects` separately.)
 */
export const projects: MockProject[] = [...myProjects, ...sampleProjects];
