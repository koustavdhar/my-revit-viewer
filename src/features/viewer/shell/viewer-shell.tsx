"use client";

/**
 * Unified BIM + GIS workspace.
 *
 * Data flow: `ViewerProject` (from `toViewerProject` / API) includes `sourceFiles` → `routeViewerFromFiles`
 * suggests a default scene → user can override with the toolbar segment or `?mode=` → this component wires
 * `useGisViewerState` + selection state into `ViewerAdapterContext` → `renderBimViewport` / `renderGisViewport`.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VIEWER_BACKEND } from "@/config/integrations";
import GisFeaturePropertiesPanel from "@/features/viewer/components/gis/gis-feature-properties-panel";
import GisLayersPanel from "@/features/viewer/components/gis/gis-layers-panel";
import BimElementPropertiesPanel from "@/features/viewer/components/bim/bim-element-properties-panel";
import BimModelSidebar from "@/features/viewer/components/bim/bim-model-sidebar";
import ViewerToolbar from "@/features/viewer/components/toolbar/viewer-toolbar";
import type { BimElementSelection, BimViewerSidebarState } from "@/features/viewer/bim/bim-types";
import {
  DEFAULT_BIM_MANUAL_ALIGNMENT,
  type BimManualAlignment,
} from "@/features/viewer/bim/bim-manual-alignment";
import { resolveBimViewportUrl } from "@/features/viewer/bim/resolve-bim-viewport-url";
import type { GisFeaturePick } from "@/features/viewer/gis/gis-types";
import { useGisViewerState } from "@/features/viewer/gis/use-gis-viewer-state";
import {
  renderBimViewport,
  renderGisViewport,
  type BimAdapterBindings,
  type GisAdapterBindings,
  type ViewerAdapterContext,
} from "@/features/viewer/shell/viewer-adapters";
import { useViewerProvider } from "@/features/viewer/providers/use-viewer-provider";
import { defaultSceneModeForProject, routeViewerFromFiles } from "@/features/viewer/routing/viewer-file-router";
import type { SceneMode, ViewerProject } from "@/features/viewer/types";
import CombinedAlignmentBanner from "@/features/viewer/shell/combined-alignment-banner";
import CombinedReviewLeftPanel from "@/features/viewer/shell/combined-review-left-panel";
import CombinedReviewPropertiesPanel, {
  type CombinedPropertySource,
} from "@/features/viewer/shell/combined-review-properties-panel";
import { ViewerViewportErrorBoundary } from "@/features/viewer/shell/viewer-viewport-error-boundary";
import { useViewerFullscreen } from "@/features/viewer/shell/use-viewer-fullscreen";
import { Badge, Button, MoreMenu } from "@/components/ui";

type ShellBadgeVariant = "neutral" | "primary" | "success" | "warning" | "error";

type ShellBadge = { label: string; variant: ShellBadgeVariant };

export type ViewerShellProps = {
  project: ViewerProject;
  /** From `/viewer/[id]?mode=` — overrides file-router default on first paint. */
  initialSceneMode?: SceneMode;
};

const SCENE_MODES: { value: SceneMode; label: string; description?: string }[] = [
  { value: "bim", label: "BIM" },
  { value: "gis", label: "GIS" },
  {
    value: "combined",
    label: "Combined",
    description: "BIM 3D + GIS map in one workspace (alignment is prototype-only until georeferencing ships).",
  },
];

const ESSENTIAL_VIEWER_TOOLS = ["Orbit", "Zoom", "Reset View"] as const;

function resolveInitialSceneMode(project: ViewerProject, fromUrl?: SceneMode): SceneMode {
  if (fromUrl) return fromUrl;
  return defaultSceneModeForProject(project);
}

function initialBimSidebar(project: ViewerProject): BimViewerSidebarState {
  const t = resolveBimViewportUrl(project);
  return {
    phase: "idle",
    error: null,
    tree: [],
    modelSource: project.modelSource ?? "—",
    fileType: "IFC",
    ifcUrl: t.effectiveUrl,
    loadSource: t.loadSource,
    displayFileName: t.displayFileName,
  };
}

function buildFileRoutingBadges(plan: ReturnType<typeof routeViewerFromFiles>): ShellBadge[] {
  const out: ShellBadge[] = [];
  if (plan.detectedFormats.length === 0) {
    out.push({ label: "No file manifest", variant: "warning" });
    return out;
  }
  if (plan.hasBimFamily) out.push({ label: "BIM Source", variant: "primary" });
  if (plan.hasGisFamily) out.push({ label: "GIS Source", variant: "primary" });
  if (plan.anyWebViewReady) out.push({ label: "Web ready", variant: "success" });
  if (plan.anyNeedsConversion) out.push({ label: "Needs conversion", variant: "warning" });
  return out;
}

export default function ViewerShell({ project, initialSceneMode: sceneModeFromUrl }: ViewerShellProps) {
  const viewer = useViewerProvider();
  const [sceneMode, setSceneMode] = useState<SceneMode>(() => resolveInitialSceneMode(project, sceneModeFromUrl));
  const [refreshTick, setRefreshTick] = useState(0);
  const [selectedGisFeature, setSelectedGisFeature] = useState<GisFeaturePick | null>(null);
  const [gisLabelsEnabled, setGisLabelsEnabled] = useState(false);
  const [gisFitAllToken, setGisFitAllToken] = useState(0);
  const [gisResetViewToken, setGisResetViewToken] = useState(0);
  const [bimSelection, setBimSelection] = useState<BimElementSelection | null>(null);
  const [bimSidebar, setBimSidebar] = useState<BimViewerSidebarState>(() => initialBimSidebar(project));
  const [activePropertySource, setActivePropertySource] = useState<CombinedPropertySource>("bim");
  const [bimManualAlignment, setBimManualAlignment] = useState<BimManualAlignment>(() => ({
    ...DEFAULT_BIM_MANUAL_ALIGNMENT,
  }));
  /** Tracks last mode so we only run cleanup on real transitions (not every render). */
  const prevSceneModeRef = useRef<SceneMode | null>(null);
  const bimSelectionRef = useRef(bimSelection);
  const gisSelectionRef = useRef(selectedGisFeature);
  bimSelectionRef.current = bimSelection;
  gisSelectionRef.current = selectedGisFeature;

  const patchBimManualAlignment = useCallback((patch: Partial<BimManualAlignment>) => {
    setBimManualAlignment((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetBimManualAlignment = useCallback(() => {
    setBimManualAlignment({ ...DEFAULT_BIM_MANUAL_ALIGNMENT });
  }, []);

  const gisState = useGisViewerState(project, refreshTick);

  const modelUrl = project.modelUrl?.trim() ?? "";
  const geoUrl = project.geoJsonUrl?.trim() ?? "";
  const hasModelLink = modelUrl.length > 0;
  const hasGeoLink = geoUrl.length > 0;
  const ifcUrlResolved = useMemo(() => resolveBimViewportUrl(project).effectiveUrl, [project]);
  const hasIfcLink = Boolean(ifcUrlResolved);

  const essentialTools = useMemo<string[]>(() => {
    const available = new Set(viewer.tools);
    return ESSENTIAL_VIEWER_TOOLS.filter((t) => available.has(t)) as string[];
  }, [viewer.tools]);

  useEffect(() => {
    if (essentialTools.length === 0) return;
    if (!essentialTools.includes(viewer.activeTool)) {
      viewer.setActiveTool(essentialTools[0]);
    }
  }, [essentialTools, viewer]);

  const viewerWorkspaceRef = useRef<HTMLDivElement>(null);
  const { active: fullscreenActive, toggle: toggleFullscreen } = useViewerFullscreen(viewerWorkspaceRef);

  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const [a11yStatus, setA11yStatus] = useState("");
  const prevSceneForA11y = useRef<SceneMode | null>(null);
  const prevFsForA11y = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevSceneForA11y.current === null) {
      prevSceneForA11y.current = sceneMode;
      return;
    }
    if (prevSceneForA11y.current === sceneMode) return;
    prevSceneForA11y.current = sceneMode;
    const label = SCENE_MODES.find((m) => m.value === sceneMode)?.label ?? sceneMode;
    setA11yStatus(`Scene mode: ${label}`);
  }, [sceneMode]);

  useEffect(() => {
    if (prevFsForA11y.current === null) {
      prevFsForA11y.current = fullscreenActive;
      return;
    }
    if (prevFsForA11y.current === fullscreenActive) return;
    prevFsForA11y.current = fullscreenActive;
    setA11yStatus(fullscreenActive ? "Full screen on" : "Full screen off");
  }, [fullscreenActive]);

  useEffect(() => {
    if (!a11yStatus) return;
    const id = window.setTimeout(() => setA11yStatus(""), 1400);
    return () => window.clearTimeout(id);
  }, [a11yStatus]);

  const doRefresh = useCallback(() => {
    setSelectedGisFeature(null);
    setGisLabelsEnabled(false);
    setGisFitAllToken(0);
    setGisResetViewToken(0);
    setBimSelection(null);
    setBimSidebar(initialBimSidebar(project));
    setActivePropertySource("bim");
    resetBimManualAlignment();
    setRefreshTick((v) => v + 1);
    setA11yStatus("Workspace refreshed");
  }, [project, resetBimManualAlignment]);

  const toggleFocusMode = useCallback(() => {
    const anyOpen = leftPanelOpen || rightPanelOpen;
    if (anyOpen) {
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
    } else {
      setLeftPanelOpen(true);
      setRightPanelOpen(true);
    }
  }, [leftPanelOpen, rightPanelOpen]);

  const routePlan = useMemo(
    () => routeViewerFromFiles(project.sourceFiles ?? []),
    [project.sourceFiles],
  );

  const handleBimSelection = useCallback(
    (next: BimElementSelection | null) => {
      setBimSelection(next);
      if (sceneMode === "combined" && next) setActivePropertySource("bim");
    },
    [sceneMode],
  );

  const handleMapFeatureClick = useCallback(
    (pick: GisFeaturePick) => {
      setSelectedGisFeature(pick);
      if (sceneMode === "combined") setActivePropertySource("gis");
    },
    [sceneMode],
  );

  /** Mode switches: clear GIS zoom target, drop selections for engines that are not on screen, fix combined tab. */
  useEffect(() => {
    const prev = prevSceneModeRef.current;
    prevSceneModeRef.current = sceneMode;
    if (prev === null) return;
    if (prev === sceneMode) return;

    gisState.clearZoomTarget();

    if (sceneMode === "bim") {
      setSelectedGisFeature(null);
      setActivePropertySource("bim");
    } else if (sceneMode === "gis") {
      setBimSelection(null);
    } else if (sceneMode === "combined") {
      const b = bimSelectionRef.current;
      const g = gisSelectionRef.current;
      if (b) setActivePropertySource("bim");
      else if (g) setActivePropertySource("gis");
      else setActivePropertySource("bim");
    }
  }, [sceneMode, gisState.clearZoomTarget]);

  /** Combined only: if the active tab has no selection but the other engine does, follow the data. */
  useEffect(() => {
    if (sceneMode !== "combined") return;
    setActivePropertySource((src) => {
      if (src === "bim" && !bimSelection && selectedGisFeature) return "gis";
      if (src === "gis" && !selectedGisFeature && bimSelection) return "bim";
      return src;
    });
  }, [sceneMode, bimSelection, selectedGisFeature]);

  const gisBindings = useMemo<GisAdapterBindings | undefined>(() => {
    if (sceneMode !== "gis" && sceneMode !== "combined") return undefined;
    return {
      mapRenderKey: `${project.id}-${refreshTick}-${sceneMode}`,
      panelRows: gisState.panelRows,
      mapLayers: gisState.mapLayers,
      statusSummary: gisState.statusSummary,
      setLayerVisible: gisState.setLayerVisible,
      requestZoomToLayer: gisState.requestZoomToLayer,
      zoomTargetId: gisState.zoomTargetId,
      clearZoomTarget: gisState.clearZoomTarget,
      onMapFeatureClick: handleMapFeatureClick,
      labelsEnabled: gisLabelsEnabled,
      setLabelsEnabled: setGisLabelsEnabled,
      fitAllToken: gisFitAllToken,
      requestFitAllLayers: () => setGisFitAllToken((t) => t + 1),
      resetViewToken: gisResetViewToken,
      requestResetMapView: () => setGisResetViewToken((t) => t + 1),
    };
  }, [
    sceneMode,
    project.id,
    refreshTick,
    gisState.panelRows,
    gisState.mapLayers,
    gisState.statusSummary,
    gisState.setLayerVisible,
    gisState.requestZoomToLayer,
    gisState.zoomTargetId,
    gisState.clearZoomTarget,
    handleMapFeatureClick,
    gisLabelsEnabled,
    gisFitAllToken,
    gisResetViewToken,
  ]);

  const bimBindings = useMemo<BimAdapterBindings | undefined>(() => {
    if (sceneMode !== "bim" && sceneMode !== "combined") return undefined;
    return {
      selection: bimSelection,
      setSelection: handleBimSelection,
      onSidebarSync: setBimSidebar,
      manualAlignment: bimManualAlignment,
      setManualAlignment: patchBimManualAlignment,
      resetManualAlignment: resetBimManualAlignment,
    };
  }, [
    sceneMode,
    bimSelection,
    handleBimSelection,
    bimManualAlignment,
    patchBimManualAlignment,
    resetBimManualAlignment,
  ]);

  const adapterContext = useMemo<ViewerAdapterContext>(
    () => ({ project, refreshTick, readOnly: true, gis: gisBindings, bim: bimBindings }),
    [project, refreshTick, gisBindings, bimBindings],
  );

  const headerBadges = useMemo((): ShellBadge[] => {
    const fromFiles = buildFileRoutingBadges(routePlan);
    const tail: ShellBadge[] = [{ label: "Read-only", variant: "neutral" }];

    if (sceneMode === "combined") {
      tail.push({ label: "Combined workspace", variant: "primary" });
      tail.push({ label: "Preview alignment", variant: "warning" });
      tail.push({ label: "Spatial sync pending", variant: "neutral" });
      tail.push({
        label: hasGeoLink ? "GIS · layers" : "GIS · no URL",
        variant: hasGeoLink ? "success" : "warning",
      });
      tail.push({
        label: hasIfcLink ? "BIM · IFC" : "BIM · no IFC",
        variant: hasIfcLink ? "success" : "warning",
      });
    } else if (sceneMode === "gis") {
      tail.push({
        label: hasGeoLink ? "Layer URL set" : "No layer URL",
        variant: hasGeoLink ? "success" : "warning",
      });
    } else {
      const apsPlaceholder = project.bimEngine === "aps";
      const ifcReady = hasIfcLink;
      const legacyModel = hasModelLink;
      const connected = ifcReady || legacyModel;
      tail.push({
        label: apsPlaceholder
          ? "APS placeholder"
          : ifcReady
            ? "IFC · That Open"
            : legacyModel
              ? "Model URL set"
              : "No model / IFC URL",
        variant: apsPlaceholder || !connected ? "warning" : "success",
      });
      tail.push({ label: `BIM · ${VIEWER_BACKEND}`, variant: "primary" });
    }

    return [...fromFiles, ...tail];
  }, [routePlan, sceneMode, hasGeoLink, hasModelLink, hasIfcLink, project.bimEngine]);

  const sceneModeDescription = SCENE_MODES.find((m) => m.value === sceneMode)?.description;

  const manifestSummary = useMemo(() => {
    if (routePlan.detectedFormats.length === 0) {
      return "No spatial files listed on the project manifest.";
    }
    const base = `${routePlan.detectedFormatsLabel} (${routePlan.detectedFormats.join(", ")})`;
    if ((project.sourceFiles?.length ?? 0) > 0 && sceneMode !== routePlan.recommendedSceneMode) {
      return `${base} · Suggested scene: ${routePlan.recommendedSceneMode}`;
    }
    return base;
  }, [routePlan, project.sourceFiles?.length, sceneMode]);

  const centerViewport = useMemo(() => {
    if (sceneMode === "bim") {
      return (
        <ViewerViewportErrorBoundary label="BIM (IFC)" key="viewport-bim-single">
          {renderBimViewport(adapterContext, "default")}
        </ViewerViewportErrorBoundary>
      );
    }
    if (sceneMode === "gis") {
      return (
        <ViewerViewportErrorBoundary label="GIS (map)" key="viewport-gis-single">
          {renderGisViewport(adapterContext, "default")}
        </ViewerViewportErrorBoundary>
      );
    }
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <CombinedAlignmentBanner compact />
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 border-t border-[color:var(--viewer-chrome-divider)] lg:min-h-[min(52vh,62dvh)] lg:grid-cols-2">
          <div className="min-h-0 min-w-0 border-b border-[color:var(--viewer-chrome-divider)] lg:border-b-0 lg:border-r">
            <ViewerViewportErrorBoundary label="BIM (IFC)" key="viewport-bim-combined">
              {renderBimViewport(adapterContext, "compact")}
            </ViewerViewportErrorBoundary>
          </div>
          <div className="min-h-0 min-w-0">
            <ViewerViewportErrorBoundary label="GIS (map)" key="viewport-gis-combined">
              {renderGisViewport(adapterContext, "compact")}
            </ViewerViewportErrorBoundary>
          </div>
        </div>
      </div>
    );
  }, [sceneMode, adapterContext]);

  const leftRailLabel = sceneMode === "gis" ? "Layers" : sceneMode === "bim" ? "Model" : "Sources";
  const rightRailLabel = "Inspector";

  const moreMenuItems = useMemo(
    () => [
      ...(sceneModeDescription
        ? [{ key: "scene-desc", label: sceneModeDescription, disabled: true as const }]
        : []),
      { key: "refresh", label: "Refresh viewer state", onClick: doRefresh },
      {
        key: "focus",
        label: leftPanelOpen || rightPanelOpen ? "Hide side panels" : "Show side panels",
        onClick: toggleFocusMode,
      },
      {
        key: "open-project",
        label: "Open project detail",
        href: `/projects/${project.id}`,
      },
      {
        key: "open-model",
        label: "Open model source",
        href: hasModelLink ? modelUrl : undefined,
        disabled: !hasModelLink,
      },
      {
        key: "open-ifc",
        label: "Open IFC",
        href: hasIfcLink && ifcUrlResolved ? ifcUrlResolved : undefined,
        disabled: !hasIfcLink,
      },
      {
        key: "open-geojson",
        label: "Open GeoJSON",
        href: hasGeoLink ? geoUrl : undefined,
        disabled: !hasGeoLink,
      },
      ...headerBadges.map((b) => ({
        key: `badge-${b.label}`,
        label: b.label,
        disabled: true as const,
      })),
    ],
    [
      sceneModeDescription,
      doRefresh,
      toggleFocusMode,
      leftPanelOpen,
      rightPanelOpen,
      project.id,
      hasModelLink,
      modelUrl,
      hasIfcLink,
      ifcUrlResolved,
      hasGeoLink,
      geoUrl,
      headerBadges,
    ],
  );

  return (
    <div
      ref={viewerWorkspaceRef}
      className={[
        "viewer-workspace-root flex min-h-0 w-full flex-1 flex-col gap-0 overflow-hidden bg-[color:var(--background)]",
        fullscreenActive ? "rounded-none border-0 p-0 shadow-none" : "",
      ].join(" ")}
    >
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {a11yStatus}
      </div>
      {/* Workspace chrome: identity + scene; tools on a dedicated ribbon */}
      <div className="viewer-top-chrome shrink-0 rounded-none border-b border-x-0 border-t-0">
        <div className="flex min-h-[2.5rem] flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2">
          <div className="flex shrink-0 items-center gap-2">
            <Button
              href={`/projects/${project.id}`}
              variant="ghost"
              size="sm"
              className="!h-8 !min-h-8 shrink-0 !px-1.5"
              aria-label="Back to project detail"
            >
              ←
            </Button>
            <div className="h-5 w-px shrink-0 bg-[color:var(--viewer-chrome-divider)]" aria-hidden />
            <div
              className="viewer-scene-segment inline-flex h-8 shrink-0 items-stretch overflow-hidden rounded-[var(--radius-xs)] border border-[color:var(--viewer-panel-border)] bg-[color:color-mix(in_srgb,var(--surface-muted)_50%,var(--background))] p-px shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.45)]"
              role="tablist"
              aria-label="Scene mode"
            >
              {SCENE_MODES.map((m, i) => {
                const active = sceneMode === m.value;
                return (
                  <button
                    key={m.value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    title={m.description ?? `${m.label} workspace`}
                    className={[
                      "min-w-[3.25rem] px-2.5 text-[length:var(--text-2xs)] font-bold uppercase tracking-[0.06em] transition-[color,background-color,box-shadow]",
                      i > 0 ? "border-l border-[color:var(--viewer-chrome-divider)]" : "",
                      active
                        ? "viewer-scene-segment-active bg-[color:var(--primary)] text-white shadow-[inset_0_-2px_0_0_color-mix(in_srgb,var(--primary-700)_85%,black)]"
                        : "text-[color:var(--text-muted)] hover:bg-[color:color-mix(in_srgb,var(--surface)_55%,var(--primary-50))] hover:text-[color:var(--text)]",
                    ].join(" ")}
                    onClick={() => setSceneMode(m.value)}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 flex-1 basis-[min(100%,12rem)]" title={manifestSummary}>
            <h1 className="truncate text-[length:var(--text-base)] font-bold leading-tight tracking-tight text-[color:var(--text)] sm:text-[length:var(--text-md)]">
              {project.name}
            </h1>
            <p className="mt-0.5 truncate text-[length:var(--text-2xs)] leading-snug text-[color:var(--text-muted)]">
              {project.discipline ?? "—"} · {project.modelSource ?? "—"} · {project.lastUpdated}
              {routePlan.detectedFormats.length > 0 ? (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-mono text-[color:var(--text-subtle)]">{routePlan.detectedFormats.join(", ")}</span>
                </>
              ) : null}
              {(project.sourceFiles?.length ?? 0) > 0 && sceneMode !== routePlan.recommendedSceneMode ? (
                <span className="text-[color:var(--warning)]">
                  {" "}
                  → <span className="font-semibold">{routePlan.recommendedSceneMode}</span>
                </span>
              ) : null}
            </p>
          </div>

          <div className="flex min-w-0 flex-wrap items-center justify-end gap-x-2 gap-y-1 sm:ml-auto">
            <div className="hidden max-w-[min(100%,14rem)] flex-wrap justify-end gap-px sm:flex lg:max-w-[20rem]">
              {headerBadges.slice(0, 4).map((badge) => (
                <Badge key={badge.label} variant={badge.variant} size="compact">
                  {badge.label}
                </Badge>
              ))}
              {headerBadges.length > 4 ? (
                <Badge variant="neutral" size="compact">
                  +{headerBadges.length - 4}
                </Badge>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-1 border-[color:var(--viewer-chrome-divider)] sm:border-l sm:pl-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="!h-8 !min-h-8 !px-2.5 !text-[length:var(--text-2xs)]"
                onClick={toggleFullscreen}
                aria-pressed={fullscreenActive}
                title={fullscreenActive ? "Exit full screen" : "Full screen viewer"}
              >
                {fullscreenActive ? "Exit" : "Full"}
              </Button>
              <MoreMenu
                className="[&_summary]:!h-8 [&_summary]:!min-h-8 [&_summary]:!px-2.5 [&_summary]:!text-[length:var(--text-2xs)]"
                items={moreMenuItems}
              />
            </div>
          </div>
        </div>
        <div className="viewer-toolbar-ribbon flex min-h-[2.25rem] items-center border-t border-[color:var(--viewer-chrome-divider)] px-2 py-0.5">
          <ViewerToolbar
            compact
            tools={essentialTools}
            activeTool={
              essentialTools.includes(viewer.activeTool) ? viewer.activeTool : essentialTools[0] ?? "Orbit"
            }
            onToolChange={(tool) => {
              if (essentialTools.includes(tool)) viewer.setActiveTool(tool);
            }}
          />
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-[length:var(--space-3)] overflow-hidden lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-stretch">
        {/* Left dock */}
        <aside
          className={[
            "viewer-side-panel flex min-h-0 min-w-0 flex-col overflow-hidden rounded-none border",
            leftPanelOpen
              ? "w-[min(100%,var(--viewer-rail-left))] p-[length:var(--viewer-panel-inset)]"
              : "viewer-panel-collapsed w-[var(--viewer-rail-ribbon)] p-0",
          ].join(" ")}
        >
          <div className="flex shrink-0 items-center justify-between gap-0.5 border-b border-[color:var(--viewer-chrome-divider)] px-0.5 py-px">
            {leftPanelOpen ? (
              <span className="truncate px-0.5 text-[length:var(--text-2xs)] font-semibold uppercase tracking-wide text-[color:var(--text-subtle)]">
                {leftRailLabel}
              </span>
            ) : (
              <span className="sr-only">{leftRailLabel}</span>
            )}
            <button
              type="button"
              className="ui-focus-ring shrink-0 cursor-pointer rounded-[var(--radius-sm)] px-0.5 py-px text-[length:var(--text-2xs)] font-bold text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--surface)] hover:text-[color:var(--text)] active:scale-95"
              onClick={() => setLeftPanelOpen((v) => !v)}
              aria-expanded={leftPanelOpen}
              title={leftPanelOpen ? "Collapse panel" : "Expand panel"}
            >
              {leftPanelOpen ? "‹" : "›"}
            </button>
          </div>
          {leftPanelOpen ? (
            <div className="min-h-0 flex-1 overflow-y-auto">
              {sceneMode === "combined" ? (
                <CombinedReviewLeftPanel
                  project={project}
                  bimSidebar={bimSidebar}
                  bimSelection={bimSelection}
                  manualAlignment={bimManualAlignment}
                  onManualAlignmentChange={patchBimManualAlignment}
                  onManualAlignmentReset={resetBimManualAlignment}
                  gisRows={gisState.panelRows}
                  onToggleVisible={gisState.setLayerVisible}
                  onZoomToLayer={gisState.requestZoomToLayer}
                  selectedGisLayerId={selectedGisFeature?.layerId ?? null}
                  zoomTargetLayerId={gisState.zoomTargetId}
                />
              ) : null}
              {sceneMode === "gis" ? (
                <GisLayersPanel
                  project={project}
                  rows={gisState.panelRows}
                  onToggleVisible={gisState.setLayerVisible}
                  onZoomToLayer={gisState.requestZoomToLayer}
                  showProjectChrome={false}
                  density="compact"
                  layerFocus={{
                    selectionId: selectedGisFeature?.layerId ?? null,
                    zoomTargetId: gisState.zoomTargetId,
                  }}
                />
              ) : null}
              {sceneMode === "bim" ? (
                <BimModelSidebar project={project} sidebar={bimSidebar} selection={bimSelection} />
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              className="flex min-h-[3rem] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 px-0.5 py-1 text-[length:var(--text-2xs)] font-bold uppercase tracking-wide text-[color:var(--text-subtle)] transition-colors hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--text)] active:scale-[0.98]"
              onClick={() => setLeftPanelOpen(true)}
              title={`Open ${leftRailLabel}`}
            >
              <span className="[writing-mode:vertical-rl] rotate-180">{leftRailLabel}</span>
            </button>
          )}
        </aside>

        {/* Center viewport — stage only; no card wrapper */}
        <section className="viewer-viewport-stage h-full min-h-0">
          <div className="viewer-viewport-canvas-host flex min-h-0 flex-1 flex-col overflow-hidden">
            {centerViewport}
          </div>
        </section>

        {/* Right dock */}
        <aside
          className={[
            "viewer-side-panel flex min-h-0 min-w-0 flex-col overflow-hidden rounded-none border",
            rightPanelOpen
              ? "w-[min(100%,var(--viewer-rail-right))] p-[length:var(--viewer-panel-inset)]"
              : "viewer-panel-collapsed w-[var(--viewer-rail-ribbon)] p-0",
          ].join(" ")}
        >
          <div className="flex shrink-0 items-center justify-between gap-0.5 border-b border-[color:var(--viewer-chrome-divider)] px-0.5 py-px">
            <button
              type="button"
              className="ui-focus-ring shrink-0 cursor-pointer rounded-[var(--radius-sm)] px-0.5 py-px text-[length:var(--text-2xs)] font-bold text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--surface)] hover:text-[color:var(--text)] active:scale-95"
              onClick={() => setRightPanelOpen((v) => !v)}
              aria-expanded={rightPanelOpen}
              title={rightPanelOpen ? "Collapse panel" : "Expand panel"}
            >
              {rightPanelOpen ? "›" : "‹"}
            </button>
            {rightPanelOpen ? (
              <span className="truncate px-0.5 text-[length:var(--text-2xs)] font-semibold uppercase tracking-wide text-[color:var(--text-subtle)]">
                {rightRailLabel}
              </span>
            ) : (
              <span className="sr-only">{rightRailLabel}</span>
            )}
          </div>
          {rightPanelOpen ? (
            <div className="min-h-0 flex-1 overflow-y-auto">
              {sceneMode === "combined" ? (
                <div className="flex min-h-0 flex-1 flex-col">
                  <CombinedReviewPropertiesPanel
                    bimSelection={bimSelection}
                    gisSelection={selectedGisFeature}
                    activeSource={activePropertySource}
                    onActiveSourceChange={setActivePropertySource}
                  />
                </div>
              ) : null}
              {sceneMode === "gis" ? (
                <div className="flex min-h-0 flex-1 flex-col">
                  <GisFeaturePropertiesPanel selection={selectedGisFeature} />
                </div>
              ) : null}
              {sceneMode === "bim" ? (
                <div className="flex min-h-0 flex-1 flex-col">
                  <BimElementPropertiesPanel selection={bimSelection} />
                </div>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              className="flex min-h-[3rem] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 px-0.5 py-1 text-[length:var(--text-2xs)] font-bold uppercase tracking-wide text-[color:var(--text-subtle)] transition-colors hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--text)] active:scale-[0.98]"
              onClick={() => setRightPanelOpen(true)}
              title={`Open ${rightRailLabel}`}
            >
              <span className="[writing-mode:vertical-rl] rotate-180">{rightRailLabel}</span>
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
