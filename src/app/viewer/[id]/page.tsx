import { getProjectById, toViewerProject } from "@/features/projects";
import ViewerShell from "@/features/viewer/shell/viewer-shell";
import { parseSceneModeParam } from "@/features/viewer/routing/viewer-file-router";
import { Button, PageContainer, SectionHeader } from "@/components/ui";

type ViewerPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
};

export default async function ViewerPage({ params, searchParams }: ViewerPageProps) {
  const { id } = await params;
  const { mode: modeParam } = await searchParams;
  const project = getProjectById(id);

  if (!project) {
    return (
      <PageContainer>
        <SectionHeader
          eyebrow="Viewer"
          title="Project not available"
          description="The requested project ID is not in the mock portfolio."
          className="border-b border-[color:var(--border-subtle)] pb-[length:var(--space-3)]"
          size="compact"
        />
        <Button href="/dashboard" variant="secondary" size="md">
          Back to dashboard
        </Button>
      </PageContainer>
    );
  }

  const modeFromQuery = parseSceneModeParam(modeParam);
  const viewerProject = toViewerProject(project);

  return (
    <ViewerShell
      key={`${id}-${modeFromQuery ?? "auto"}`}
      project={viewerProject}
      initialSceneMode={modeFromQuery}
    />
  );
}
