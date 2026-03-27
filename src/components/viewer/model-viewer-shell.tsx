"use client";

import { useCallback, useMemo, useState } from "react";
import { integrationsConfig, VIEWER_BACKEND } from "@/config/integrations";
import ProjectInfoPanel from "@/features/viewer/components/panels/project-info-panel";
import PropertiesPanel from "@/features/viewer/components/panels/properties-panel";
import SpeckleViewerCanvas, {
  SpeckleAppIframeEmbed,
  ViewerPreviewFallback,
} from "@/features/viewer/components/canvas/speckle-viewer-canvas";
import { useViewerProvider } from "@/features/viewer/providers/use-viewer-provider";
import ViewerToolbar from "@/features/viewer/components/toolbar/viewer-toolbar";
import { ViewerProject } from "@/features/viewer/types";
import { AlertBanner, Badge, Button, Card, EmptyState, PageContainer, Skeleton } from "@/components/ui";

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
  const isSpeckleAppProjectModelUrl =
    modelUrl.includes("app.speckle.systems/projects/") &&
    modelUrl.includes("/models/");
  const sourceHost = useMemo(() => {
    if (!hasModelLink) return "Not configured";
    try {
      return new URL(modelUrl).host;
    } catch {
      return "Invalid URL";
    }
  }, [hasModelLink, modelUrl]);

  const uiIntegrationState = useMemo(() => {
    if (!hasModelLink) {
      return {
        status: "fallback" as const,
        reason: "No model link configured for this project.",
      };
    }
    if (isSpeckleAppProjectModelUrl) {
      return {
        status: "embedded" as const,
        reason: null,
      };
    }
    return integrationState;
  }, [hasModelLink, isSpeckleAppProjectModelUrl, integrationState]);

  const statusBadges = useMemo(() => {
    const connected =
      hasModelLink &&
      (uiIntegrationState.status === "embedded" || !trySpeckle || isSpeckleAppProjectModelUrl);
    return [
      {
        label: connected ? "Connected" : "Disconnected",
      },
      {
        label: "Read-only",
      },
      {
        label: `External source (${VIEWER_BACKEND})`,
      },
    ];
  }, [hasModelLink, uiIntegrationState.status, trySpeckle, isSpeckleAppProjectModelUrl]);

  const handleStatusChange = useCallback(
    (status: "loading" | "embedded" | "fallback", reason?: string | null) => {
      const nextReason = reason ?? null;
      setIntegrationState((prev) => {
        if (prev.status === status && prev.reason === nextReason) {
          return prev;
        }
        return { status, reason: nextReason };
      });
    },
    [],
  );

  return (
    <PageContainer className="py-3">
      <div className="grid h-[calc(100vh-88px)] w-full gap-3 lg:grid-cols-[280px_1fr_320px]">
        <ProjectInfoPanel
          project={project}
          elements={viewer.elements}
          selectedElementId={viewer.selectedElement.id}
          onSelectElement={viewer.selectElementById}
        />

        <section className="min-w-0">
          <Card className="h-full p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{project.name}</p>
                <p className="truncate text-xs text-slate-500">
                  {project.discipline ?? "Discipline N/A"} · {project.modelSource ?? "Source N/A"} · {project.lastUpdated}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {statusBadges.map((badge) => (
                  <Badge
                    key={badge.label}
                    variant={
                      badge.label.includes("Connected")
                        ? "success"
                        : badge.label.includes("Disconnected")
                          ? "warning"
                          : badge.label.includes("Read-only")
                            ? "neutral"
                            : "primary"
                    }
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mb-2 flex flex-wrap gap-2 border-y border-slate-200 py-2">
              {hasModelLink ? (
                <Button
                  href={modelUrl}
                  variant="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                >
                  Open source
                </Button>
              ) : (
                <Button type="button" variant="secondary" size="sm" className="opacity-60" disabled>
                  Open source
                </Button>
              )}
              <Button
                type="button"
                onClick={() => setRefreshTick((v) => v + 1)}
                size="sm"
              >
                Refresh
              </Button>
              <Button href={`/projects/${project.id}`} variant="secondary" size="sm">
                Project
              </Button>
            </div>

            {uiIntegrationState.status === "loading" ? (
              <AlertBanner
                message="Loading model content..."
                tone="info"
                className="mb-2 text-xs"
              />
            ) : null}
            {uiIntegrationState.status === "fallback" && uiIntegrationState.reason ? (
              <AlertBanner
                title="Viewer fallback"
                message={uiIntegrationState.reason}
                tone="warning"
                className="mb-2 text-xs"
              />
            ) : null}
            <ViewerToolbar
              tools={viewer.tools}
              activeTool={viewer.activeTool}
              onToolChange={viewer.setActiveTool}
            />
            <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-600">
              <span className="font-medium text-slate-800">Connection:</span>{" "}
              {isSpeckleAppProjectModelUrl
                ? "Speckle app embed mode"
                : trySpeckle
                  ? "Speckle SDK mode"
                  : "Preview mode"}{" "}
              | <span className="font-medium text-slate-800">Host:</span> {sourceHost} |{" "}
              <span className="font-medium text-slate-800">Token:</span>{" "}
              {speckleToken ? "Configured" : "Missing"}
            </div>

            {/* Speckle: real WebGL viewer via @speckle/viewer when URL + workflow match. */}
            {/* Toolbar actions are still local dummy state until wired to viewer.getExtension / camera APIs. */}
            <div className="mt-2">
              {!modelUrl ? (
                <EmptyState
                  title="No model configured"
                  message="Add a model URL in project data to start BIM review."
                  className="min-h-[620px]"
                />
              ) : isSpeckleAppProjectModelUrl ? (
                <SpeckleAppIframeEmbed modelUrl={modelUrl} />
              ) : trySpeckle ? (
                <SpeckleViewerCanvas
                  modelUrl={modelUrl}
                  authToken={speckleToken}
                  refreshKey={refreshTick}
                  onStatusChange={handleStatusChange}
                />
              ) : (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <ViewerPreviewFallback
                    modelUrl={modelUrl}
                    message="Model link is available but not embeddable in current mode. Open in source platform."
                  />
                </div>
              )}
            </div>

            <p className="mt-2 text-center text-[11px] text-slate-400">
              Active tool (UI only): {viewer.activeTool} — connect to Speckle camera extensions later.
            </p>
          </Card>
        </section>

        <aside className="space-y-3">
          <PropertiesPanel selectedElement={viewer.selectedElement} />
        </aside>
      </div>
    </PageContainer>
  );
}
