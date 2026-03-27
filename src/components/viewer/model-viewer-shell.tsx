"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { integrationsConfig, VIEWER_BACKEND } from "@/config/integrations";
import ModelTreePanel from "@/features/viewer/components/panels/model-tree-panel";
import ProjectInfoPanel from "@/features/viewer/components/panels/project-info-panel";
import PropertiesPanel from "@/features/viewer/components/panels/properties-panel";
import SpeckleViewerCanvas, {
  ViewerPreviewFallback,
} from "@/features/viewer/components/canvas/speckle-viewer-canvas";
import { useViewerProvider } from "@/features/viewer/providers/use-viewer-provider";
import ViewerToolbar from "@/features/viewer/components/toolbar/viewer-toolbar";
import { ViewerProject } from "@/features/viewer/types";

type ModelViewerShellProps = {
  project: ViewerProject;
};

/**
 * True when we should attempt @speckle/viewer embed (public stream/commit URLs work best).
 * Other projects use the same preview panel with “open in new tab” only.
 */
function shouldLoadSpeckleEmbed(project: ViewerProject): boolean {
  const url = project.modelUrl?.trim() ?? "";
  if (!url) return false;
  const src = project.modelSource ?? "";
  if (src === "Speckle") return true;
  return url.toLowerCase().includes("speckle");
}

export default function ModelViewerShell({ project }: ModelViewerShellProps) {
  const viewer = useViewerProvider();
  const [refreshTick, setRefreshTick] = useState(0);
  const [integrationState, setIntegrationState] = useState<{
    status: "loading" | "embedded" | "fallback";
    reason: string | null;
  }>({
    status: "loading",
    reason: null,
  });

  const speckleToken = integrationsConfig.speckle.publicToken || undefined;

  const trySpeckle = shouldLoadSpeckleEmbed(project);
  const modelUrl = project.modelUrl?.trim() ?? "";
  const hasModelLink = modelUrl.length > 0;

  const statusBadges = useMemo(() => {
    const connected =
      hasModelLink && (integrationState.status === "embedded" || !trySpeckle);
    return [
      {
        label: connected ? "Connected" : "Disconnected",
        className: connected
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
          : "bg-amber-50 text-amber-700 ring-amber-200",
      },
      {
        label: "Read-only",
        className: "bg-slate-100 text-slate-700 ring-slate-200",
      },
      {
        label: `External source (${VIEWER_BACKEND})`,
        className: "bg-blue-50 text-blue-700 ring-blue-200",
      },
    ];
  }, [hasModelLink, integrationState.status, trySpeckle]);

  return (
    <main className="app-shell flex flex-1 py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr_320px]">
        <ProjectInfoPanel project={project} />

        <section>
          <header className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Model Review Environment
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  Viewer
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {statusBadges.map((badge) => (
                  <span
                    key={badge.label}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Project</p>
                <p className="font-medium text-slate-900">{project.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Discipline</p>
                <p className="font-medium text-slate-900">{project.discipline ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Model source</p>
                <p className="font-medium text-slate-900">{project.modelSource ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Last updated</p>
                <p className="font-medium text-slate-900">{project.lastUpdated}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {hasModelLink ? (
                <a
                  href={modelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Open in source platform
                </a>
              ) : (
                <button type="button" className="btn-secondary opacity-60" disabled>
                  Open in source platform
                </button>
              )}
              <button
                type="button"
                onClick={() => setRefreshTick((v) => v + 1)}
                className="btn-secondary"
              >
                Refresh viewer
              </button>
              <Link href={`/projects/${project.id}`} className="btn-secondary">
                Back to project
              </Link>
            </div>

            {integrationState.status === "fallback" && integrationState.reason ? (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                {integrationState.reason}
              </div>
            ) : null}

            {integrationState.status === "loading" ? (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">
                Preparing model content for viewing...
              </div>
            ) : null}
          </header>

          <div className="panel min-h-[650px] p-4">
            <ViewerToolbar
              tools={viewer.tools}
              activeTool={viewer.activeTool}
              onToolChange={viewer.setActiveTool}
            />

            {/* Speckle: real WebGL viewer via @speckle/viewer when URL + workflow match. */}
            {/* Toolbar actions are still local dummy state until wired to viewer.getExtension / camera APIs. */}
            <div className="mt-3">
              {trySpeckle && modelUrl ? (
                <SpeckleViewerCanvas
                  modelUrl={modelUrl}
                  authToken={speckleToken}
                  refreshKey={refreshTick}
                  onStatusChange={(status, reason) =>
                    setIntegrationState({
                      status,
                      reason: reason ?? null,
                    })
                  }
                />
              ) : (
                <ViewerPreviewFallback
                  modelUrl={modelUrl}
                  message={
                    !modelUrl
                      ? "No model URL is set for this project. Add a `modelUrl` in `src/lib/mock-projects.ts`, or use the Speckle project row."
                      : "This project is not set up for Speckle embed yet. Open the link below or switch `modelSource` to Speckle with a valid stream URL."
                  }
                />
              )}
            </div>

            <p className="mt-3 text-center text-[11px] text-slate-400">
              Active tool (UI only): {viewer.activeTool} — connect to Speckle camera extensions later.
            </p>
          </div>
        </section>

        <div>
          <ModelTreePanel
            elements={viewer.elements}
            selectedElementId={viewer.selectedElement.id}
            onSelectElement={viewer.selectElementById}
          />
          <div className="mt-5">
            <PropertiesPanel selectedElement={viewer.selectedElement} />
          </div>
        </div>
      </div>
    </main>
  );
}
