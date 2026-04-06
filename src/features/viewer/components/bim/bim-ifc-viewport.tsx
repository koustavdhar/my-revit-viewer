"use client";

import { useEffect, useRef, useState } from "react";
import * as OBC from "@thatopen/components";
import * as THREE from "three";
import type { ViewerProject } from "@/features/viewer/types";
import type { BimElementSelection, BimLoadPhase, BimViewerSidebarState } from "@/features/viewer/bim/bim-types";
import type { BimManualAlignment } from "@/features/viewer/bim/bim-manual-alignment";
import { applyBimManualAlignment } from "@/features/viewer/bim/bim-manual-alignment";
import type { BimViewportLoadTarget } from "@/features/viewer/bim/resolve-bim-viewport-url";
import { BIM_DEV_SAMPLE_RELATIVE_PATH } from "@/features/viewer/bim/resolve-bim-viewport-url";
import { flattenItemData } from "@/features/viewer/components/bim/flatten-item-data";
import BimViewportMetadataCard from "@/features/viewer/components/bim/bim-viewport-metadata-card";
import { Button, EmptyState } from "@/components/ui";

/** Keep in sync with the app `web-ifc` dependency (see package.json). */
const WEB_IFC_VERSION = "0.0.77";

const FRAGMENTS_WORKER_PATH = "/bim/fragments-worker.mjs";

function ifcFileLabel(url: string) {
  try {
    const u = new URL(url, "http://local.placeholder");
    return decodeURIComponent(u.pathname.split("/").pop() || url);
  } catch {
    return url.split("/").pop() || url;
  }
}

type EngineHandle = {
  world: OBC.SimpleWorld<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBC.SimpleRenderer>;
  fragments: OBC.FragmentsManager;
  hider: OBC.Hider;
  components: OBC.Components;
};

export default function BimIfcViewport({
  project,
  loadTarget,
  refreshTick,
  compact,
  selection,
  onSelectionChange,
  onViewerSync,
  manualAlignment,
}: {
  project: ViewerProject;
  loadTarget: BimViewportLoadTarget;
  refreshTick: number;
  compact?: boolean;
  selection: BimElementSelection | null;
  onSelectionChange: (s: BimElementSelection | null) => void;
  onViewerSync: (s: BimViewerSidebarState) => void;
  /** Applied to the loaded IFC root object (whole-model transform). */
  manualAlignment: BimManualAlignment;
}) {
  const { effectiveUrl, loadSource, displayFileName } = loadTarget;
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<EngineHandle | null>(null);
  const bimModelRootRef = useRef<THREE.Object3D | null>(null);
  const alignmentRef = useRef(manualAlignment);
  alignmentRef.current = manualAlignment;
  const syncRef = useRef(onViewerSync);
  const pickRef = useRef(onSelectionChange);
  syncRef.current = onViewerSync;
  pickRef.current = onSelectionChange;

  const [uiPhase, setUiPhase] = useState<BimLoadPhase>(() => (effectiveUrl ? "idle" : "idle"));
  const [uiError, setUiError] = useState<string | null>(null);

  const sidebarBase = (): BimViewerSidebarState => ({
    phase: "idle",
    error: null,
    tree: [],
    modelSource: project.modelSource ?? "—",
    fileType: "IFC",
    ifcUrl: effectiveUrl,
    loadSource,
    displayFileName,
  });

  /** No model configured (production without IFC, or dev with dev sample disabled). */
  useEffect(() => {
    if (effectiveUrl) return;
    pickRef.current(null);
    setUiPhase("idle");
    setUiError(null);
    syncRef.current({
      ...sidebarBase(),
      phase: "idle",
      error: null,
    });
  }, [effectiveUrl, loadSource, displayFileName, project.modelSource, project.id]);

  useEffect(() => {
    if (!effectiveUrl) return;

    const container = containerRef.current;
    if (!container) return;

    const components = new OBC.Components();
    let alive = true;
    let world: OBC.SimpleWorld<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBC.SimpleRenderer> | null =
      null;
    let onCamUpdate: (() => void) | null = null;
    let removePointer: (() => void) | null = null;
    let toreDown = false;

    const push = (patch: Partial<BimViewerSidebarState>) => {
      if (patch.phase) setUiPhase(patch.phase);
      if (patch.error !== undefined) setUiError(patch.error);
      syncRef.current({
        ...sidebarBase(),
        ...patch,
        ifcUrl: effectiveUrl,
        loadSource,
        displayFileName,
      });
    };

    const disposeAll = () => {
      if (toreDown) return;
      toreDown = true;
      bimModelRootRef.current = null;
      try {
        removePointer?.();
      } catch {
        /* ignore */
      }
      removePointer = null;

      if (world && onCamUpdate) {
        try {
          world.camera.controls.removeEventListener("update", onCamUpdate);
        } catch {
          /* ignore */
        }
      }
      onCamUpdate = null;
      world = null;

      try {
        components.dispose();
      } catch {
        /* ignore */
      }
      engineRef.current = null;
    };

    const run = async () => {
      push({ phase: "loading", error: null, tree: [] });

      const worlds = components.get(OBC.Worlds);
      world = worlds.create<OBC.SimpleScene, OBC.OrthoPerspectiveCamera, OBC.SimpleRenderer>();

      world.scene = new OBC.SimpleScene(components);
      world.scene.setup();
      world.scene.three.background = null;

      world.renderer = new OBC.SimpleRenderer(components, container);
      world.camera = new OBC.OrthoPerspectiveCamera(components);
      await world.camera.controls.setLookAt(10, 10, 10, 0, 0, 0);

      if (!alive) return;

      components.init();
      components.get(OBC.Grids).create(world);

      const fragments = components.get(OBC.FragmentsManager);
      const workerUrl = new URL(FRAGMENTS_WORKER_PATH, window.location.origin).href;
      fragments.init(workerUrl);

      onCamUpdate = () => {
        fragments.core.update();
      };
      world.camera.controls.addEventListener("update", onCamUpdate!);

      fragments.list.onItemSet.add(({ value: model }) => {
        model.useCamera(world!.camera.three);
        world!.scene.three.add(model.object);
        bimModelRootRef.current = model.object;
        applyBimManualAlignment(model.object, alignmentRef.current);
        void fragments.core.update(true);
      });

      fragments.core.models.materials.list.onItemSet.add(({ value: material }) => {
        if (!("isLodMaterial" in material && material.isLodMaterial)) {
          material.polygonOffset = true;
          material.polygonOffsetUnits = 1;
          material.polygonOffsetFactor = Math.random();
        }
      });

      const ifcLoader = components.get(OBC.IfcLoader);
      await ifcLoader.setup({
        autoSetWasm: false,
        wasm: {
          path: `https://unpkg.com/web-ifc@${WEB_IFC_VERSION}/`,
          absolute: true,
        },
      });

      if (!alive) return;

      const res = await fetch(effectiveUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch IFC (${res.status} ${res.statusText})`);
      }
      const buffer = new Uint8Array(await res.arrayBuffer());
      const modelName = project.name.replace(/\s+/g, "_").slice(0, 64) || "model";
      await ifcLoader.load(buffer, true, modelName, {
        processData: {
          progressCallback: () => undefined,
        },
      });

      if (!alive) return;

      const hider = components.get(OBC.Hider);
      engineRef.current = { world, fragments, hider, components };

      await world.camera.fitToItems();
      world.camera.controls.saveState();

      const treeDetail = displayFileName ?? ifcFileLabel(effectiveUrl);

      push({
        phase: "ready",
        error: null,
        tree: [
          {
            id: "scene-root",
            label: project.name,
            children: [
              {
                id: "ifc-model",
                label: "IFC model",
                detail: treeDetail,
              },
            ],
          },
        ],
      });

      if (!alive) return;

      const canvas = world.renderer!.three.domElement;
      const mouse = new THREE.Vector2();

      const onPointerDown = async (ev: PointerEvent) => {
        if (ev.button !== 0) return;
        const r = canvas.getBoundingClientRect();
        mouse.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
        mouse.y = -((ev.clientY - r.top) / r.height) * 2 + 1;

        const hit = await fragments.raycast({
          camera: world!.camera.three,
          mouse,
          dom: canvas,
        });
        if (!hit) {
          pickRef.current(null);
          return;
        }

        const modelId = hit.fragments.modelId;
        const pickMap: OBC.ModelIdMap = { [modelId]: new Set([hit.localId]) };
        const dataMap = await fragments.getData(pickMap);
        const row = dataMap[modelId]?.[0];
        const properties = row ? flattenItemData(row) : {};

        pickRef.current({
          modelId,
          localId: hit.localId,
          properties,
        });
      };

      canvas.addEventListener("pointerdown", onPointerDown);
      removePointer = () => canvas.removeEventListener("pointerdown", onPointerDown);
    };

    void run().catch((err: unknown) => {
      if (!alive) return;
      const message = err instanceof Error ? err.message : String(err);
      console.error("[BimIfcViewport] IFC load failed", { effectiveUrl, message, err });
      push({ phase: "error", error: message, tree: [] });
      pickRef.current(null);
      disposeAll();
    });

    return () => {
      alive = false;
      disposeAll();
    };
  }, [effectiveUrl, loadSource, displayFileName, project.id, project.name, project.modelSource, refreshTick]);

  useEffect(() => {
    const root = bimModelRootRef.current;
    if (!root || uiPhase !== "ready") return;
    applyBimManualAlignment(root, manualAlignment);
    void engineRef.current?.fragments.core.update(true);
  }, [manualAlignment, uiPhase]);

  const runFit = () => {
    const h = engineRef.current;
    if (!h) return;
    void (async () => {
      await h.world.camera.fitToItems();
      await h.fragments.core.update(true);
    })();
  };

  const runIsolate = () => {
    const h = engineRef.current;
    if (!h || !selection) return;
    void (async () => {
      const isolateMap: OBC.ModelIdMap = { [selection.modelId]: new Set([selection.localId]) };
      await h.hider.isolate(isolateMap);
      await h.fragments.core.update(true);
    })();
  };

  const runReset = () => {
    const h = engineRef.current;
    if (!h) return;
    void (async () => {
      await h.hider.set(true);
      h.world.camera.controls.reset(true);
      await h.world.camera.fitToItems();
      await h.fragments.core.update(true);
      pickRef.current(null);
    })();
  };

  /** Ref is assigned before `phase: ready` is pushed; gating on phase is enough for button state. */
  const engineReady = uiPhase === "ready";
  const minCol = compact ? "min-h-[240px]" : "min-h-[400px]";
  const canvasMin = compact ? 200 : 360;

  if (!effectiveUrl) {
    return (
      <div className={["flex min-h-0 flex-1 flex-col gap-3", minCol].join(" ")}>
        <BimViewportMetadataCard
          displayFileName={displayFileName}
          fileType="IFC"
          modelSource={project.modelSource ?? "—"}
          loadSource={loadSource}
          phase="idle"
          error={null}
          compact={compact}
        />
        <EmptyState
          className="flex-1"
          title="No BIM model available"
          message={
            process.env.NODE_ENV === "development"
              ? "No IFC URL is configured and the dev sample path is off (see NEXT_PUBLIC_BIM_DISABLE_DEV_SAMPLE in .env.example). Add ifcUrl or an IFC sourceFiles[].url, or re-enable the dev sample and place a file at public/bim/sample.ifc. See docs/bim-local-testing.md."
              : "Add ifcUrl on the project or an IFC entry in sourceFiles with a url. See docs/bim-local-testing.md for how to test locally."
          }
        />
      </div>
    );
  }

  return (
    <div className={["flex h-full min-h-0 flex-1 flex-col gap-2", minCol].join(" ")}>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={runFit} disabled={!engineReady}>
          Fit view
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={runIsolate}
          disabled={!engineReady || !selection}
        >
          Isolate selected
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={runReset} disabled={!engineReady}>
          Reset
        </Button>
      </div>

      <BimViewportMetadataCard
        displayFileName={displayFileName}
        fileType="IFC"
        modelSource={project.modelSource ?? "—"}
        loadSource={loadSource}
        phase={uiPhase}
        error={uiError}
        compact={compact}
      />

      {/*
        APS Viewer (SVF2) swap-in: mount Autodesk's viewer in this container instead of That Open.
        You will load derivatives via your backend (token + URN), then replace the toolbar actions
        with viewer.fitToView / isolate / showAll equivalents.
      */}
      <div
        className="relative min-h-0 w-full flex-1 overflow-hidden rounded-none border-x-0 border-b-0 border-t border-[color:var(--viewer-chrome-divider)] bg-[color:color-mix(in_srgb,var(--surface-muted)_65%,var(--border-subtle))]"
        style={{ minHeight: canvasMin }}
      >
        <div ref={containerRef} className="absolute inset-0 z-0" />

        {uiPhase === "loading" ? (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] px-4 text-center backdrop-blur-[1px]"
            role="status"
            aria-live="polite"
          >
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--border)] border-t-[color:var(--primary)]" />
            <p className="text-[length:var(--text-sm)] font-semibold text-[color:var(--text)]">Loading BIM model…</p>
            <p className="max-w-sm text-[length:var(--text-xs)] text-[color:var(--text-muted)]">
              Initializing the IFC viewer (WASM + fragments worker) and fetching{" "}
              <span className="font-mono text-[length:var(--text-2xs)]">{displayFileName ?? effectiveUrl}</span>.
            </p>
          </div>
        ) : null}

        {uiPhase === "error" ? (
          <div
            className="absolute inset-0 z-10 flex flex-col justify-center gap-2 overflow-y-auto bg-[color:color-mix(in_srgb,var(--error-50)_96%,var(--surface))] p-4 text-left"
            role="alert"
          >
            <p className="text-[length:var(--text-sm)] font-bold text-[color:var(--error)]">Could not load the BIM model</p>
            <p className="text-[length:var(--text-xs)] leading-relaxed text-[color:color-mix(in_srgb,var(--error)_85%,var(--text))]">
              {loadSource === "dev-sample" ? (
                <>
                  Expected file at <code className="rounded bg-white/80 px-1">{BIM_DEV_SAMPLE_RELATIVE_PATH}</code>{" "}
                  (copy an IFC into <code className="rounded bg-white/80 px-1">public/bim/sample.ifc</code>). HTTP
                  errors usually mean the file is missing or the dev server cannot serve it.
                </>
              ) : (
                <>Check that the IFC URL is reachable (CORS) and still valid.</>
              )}
            </p>
            {uiError ? (
              <pre className="mt-1 max-h-32 overflow-auto rounded-[var(--radius-sm)] border border-[color:color-mix(in_srgb,var(--error)_25%,var(--border))] bg-[color:var(--surface)] p-2 font-mono text-[length:var(--text-2xs)] text-[color:var(--error)] whitespace-pre-wrap">
                {uiError}
              </pre>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
