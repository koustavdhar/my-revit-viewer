/** Flat tree row for the BIM sidebar (IFC / future APS). */
export type BimTreeNode = {
  id: string;
  label: string;
  /** Optional subtitle (e.g. IFC class). */
  detail?: string;
  children?: BimTreeNode[];
};

/** One picked element from the That Open Fragments / IFC pipeline. */
export type BimElementSelection = {
  modelId: string;
  localId: number;
  /** Flattened attributes for the properties panel. */
  properties: Record<string, string>;
};

export type BimLoadPhase = "idle" | "loading" | "ready" | "error";

/** Where the viewport URL came from (project manifest vs local dev file). */
export type BimLoadSource = "project-ifc" | "dev-sample" | "none";

/** Left-panel snapshot driven by the IFC viewport (and later by APS). */
export type BimViewerSidebarState = {
  phase: BimLoadPhase;
  error: string | null;
  tree: BimTreeNode[];
  modelSource: string;
  fileType: string;
  /** Resolved URL/path used for `fetch` (null when nothing to load). */
  ifcUrl: string | null;
  loadSource: BimLoadSource;
  displayFileName: string | null;
};
