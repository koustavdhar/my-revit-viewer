import type { ReactNode } from "react";
import {
  buildViewerHref,
  getProjectById,
  getProjectSpatialFiles,
  recommendedSceneModeFromSpatialFiles,
} from "@/features/projects";
import ProjectSpatialRegistry from "@/features/projects/project-spatial-registry";
import {
  AlertBanner,
  Badge,
  Button,
  Card,
  EmptyState,
  MoreMenu,
  PageContainer,
} from "@/components/ui";

type ProjectDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return (
      <PageContainer className="py-[length:var(--shell-content-pad-y)]">
        <div className="w-full max-w-md">
          <EmptyState
            title="Project not found"
            message="The requested project does not exist or was removed."
            action={
              <Button href="/dashboard" variant="secondary">
                Dashboard
              </Button>
            }
          />
        </div>
      </PageContainer>
    );
  }

  const spatialFiles = getProjectSpatialFiles(project);
  const recommendedMode = recommendedSceneModeFromSpatialFiles(spatialFiles);
  const primaryViewerHref = buildViewerHref(project.id, recommendedMode);

  const modelLinkReady = !!project.modelUrl;
  const connectionStatus = modelLinkReady ? "Connected" : "Pending";
  const sourceLabel = project.modelSource || "Speckle";

  const metadataRows: { label: string; value: string | ReactNode }[] = [
    { label: "Client", value: project.clientName },
    { label: "Location", value: project.location },
    { label: "Discipline", value: project.discipline },
    {
      label: "Status",
      value: (
        <Badge
          size="compact"
          variant={
            project.status === "Active"
              ? "success"
              : project.status === "Review"
                ? "warning"
                : "neutral"
          }
        >
          {project.status}
        </Badge>
      ),
    },
    {
      label: "Registry files",
      value: (
        <span className="font-mono text-[length:var(--text-xs)] font-bold tabular-nums text-[color:var(--text)]">
          {spatialFiles.length}
        </span>
      ),
    },
  ];

  return (
    <PageContainer>
      <header className="flex flex-wrap items-center justify-between gap-[length:var(--layout-inline-gap)] border-b border-[color:var(--border-subtle)] pb-[length:var(--space-3)]">
        <div className="min-w-0 flex-1">
          <p className="label-key">Project detail</p>
          <h1 className="mt-1 text-heading-md">{project.projectName}</h1>
          <p className="mt-1 text-[length:var(--text-xs)] leading-relaxed text-[color:var(--text-muted)]">
            <span className="font-medium text-[color:var(--text-subtle)]">{project.clientName}</span>
            <span className="text-[color:var(--border-strong)]"> · </span>
            {project.location}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-[length:var(--layout-inline-gap)]">
          <Button href={primaryViewerHref} variant="primary" size="md">
            Open viewer
          </Button>
          <MoreMenu
            items={[
              { key: "viewer-bim", label: "Open in BIM mode", href: buildViewerHref(project.id, "bim") },
              { key: "viewer-gis", label: "Open in GIS mode", href: buildViewerHref(project.id, "gis") },
              { key: "viewer-combined", label: "Open in Combined mode", href: buildViewerHref(project.id, "combined") },
            ]}
          />
        </div>
      </header>

      <div className="grid gap-[length:var(--layout-grid-gap)] lg:grid-cols-2">
        <Card className="border-[color:var(--border-subtle)] p-[length:var(--card-padding)]">
          <div className="inspector-panel-stack">
            <section className="inspector-section">
              <h2 className="label-eyebrow">Project record</h2>
              {!modelLinkReady ? (
                <AlertBanner
                  title="Connection pending"
                  message="No model URL linked. Configure a model URL before embedding the viewer."
                  tone="warning"
                />
              ) : null}
            </section>
            <section className="inspector-section">
              <h3 className="inspector-section-title">Core fields</h3>
              <dl className="inspector-dl">
                {metadataRows.map((row) => (
                  <div key={row.label} className="metadata-dl-row first:pt-0">
                    <dt className="inspector-field-label !normal-case !tracking-wide">{row.label}</dt>
                    <dd className="text-[length:var(--text-xs)] font-medium leading-snug text-[color:var(--text)]">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="inspector-section">
              <h3 className="inspector-section-title">Description</h3>
              <p className="text-[length:var(--text-xs)] leading-relaxed text-[color:var(--text-muted)]">{project.description}</p>
            </section>
          </div>
        </Card>

        <Card className="border-[color:var(--border-subtle)] p-[length:var(--card-padding)]">
          <div className="inspector-panel-stack">
            <section className="inspector-section">
              <h2 className="label-eyebrow">Model connection</h2>
            </section>
            <section className="inspector-section">
              <h3 className="inspector-section-title">Source &amp; link</h3>
              <dl className="inspector-dl">
                <div className="metadata-dl-row first:pt-0">
                  <dt className="inspector-field-label !normal-case !tracking-wide">Source</dt>
                  <dd className="text-[length:var(--text-xs)] font-medium text-[color:var(--text)]">{sourceLabel}</dd>
                </div>
                <div className="metadata-dl-row items-start">
                  <dt className="inspector-field-label !normal-case !tracking-wide">Link</dt>
                  <dd className="text-[length:var(--text-xs)] font-medium text-[color:var(--text)]">
                    {modelLinkReady && project.modelUrl ? (
                      <a
                        href={project.modelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all font-mono text-[length:var(--text-2xs)] text-[color:var(--primary)] underline-offset-2 hover:underline"
                      >
                        Open model URL
                      </a>
                    ) : (
                      <span className="text-[color:var(--text-muted)]">Not linked</span>
                    )}
                  </dd>
                </div>
              </dl>
            </section>
            <section className="inspector-section">
              <h3 className="inspector-section-title">Status</h3>
              <dl className="inspector-dl inspector-dl-muted">
                <div className="metadata-dl-row first:pt-0">
                  <dt className="inspector-field-label !normal-case !tracking-wide">Updated</dt>
                  <dd className="font-mono text-[length:var(--text-2xs)] font-medium tabular-nums text-[color:var(--text)]">
                    {project.lastUpdated}
                  </dd>
                </div>
                <div className="metadata-dl-row items-center">
                  <dt className="inspector-field-label !normal-case !tracking-wide">Connection</dt>
                  <dd>
                    <Badge size="compact" variant={modelLinkReady ? "success" : "warning"}>
                      {connectionStatus}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </Card>
      </div>

      <ProjectSpatialRegistry projectId={project.id} files={spatialFiles} />

      <div className="flex border-t border-[color:var(--border-subtle)] pt-[length:var(--space-3)]">
        <Button href="/dashboard" variant="ghost" size="md">
          ← Dashboard
        </Button>
      </div>
    </PageContainer>
  );
}
