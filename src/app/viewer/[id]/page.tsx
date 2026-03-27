import Link from "next/link";
import ModelViewerShell from "@/features/viewer/components/shell/model-viewer-shell";
import { getProjectById, toViewerProject } from "@/features/projects";

type ViewerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewerPage({ params }: ViewerPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return (
      <main className="app-shell flex flex-1 flex-col py-10">
        <h1 className="text-2xl font-semibold">Viewer not available</h1>
        <Link href="/dashboard" className="mt-4 text-sm text-blue-700 underline">
          Return to dashboard
        </Link>
      </main>
    );
  }

  return <ModelViewerShell project={toViewerProject(project)} />;
}
