import Link from "next/link";
import { projects } from "@/lib/dummy-data";
import ModelViewerShell from "@/components/viewer/model-viewer-shell";

type ViewerPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewerPage({ params }: ViewerPageProps) {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);

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

  return (
    <ModelViewerShell project={project} />
  );
}
