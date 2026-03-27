import ModelViewerShell from "@/features/viewer/components/shell/model-viewer-shell";
import { getProjectById, toViewerProject } from "@/features/projects";
import { Button, PageContainer, SectionHeader } from "@/components/ui";

type ViewerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewerPage({ params }: ViewerPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return (
      <PageContainer className="py-10">
        <div className="w-full">
          <SectionHeader title="Viewer not available" className="mb-4" size="compact" />
          <Button href="/dashboard" variant="secondary">
            Back to Dashboard
          </Button>
        </div>
      </PageContainer>
    );
  }

  return <ModelViewerShell project={toViewerProject(project)} />;
}
