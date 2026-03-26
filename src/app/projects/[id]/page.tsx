import Link from "next/link";
import { projects } from "@/lib/dummy-data";

type ProjectDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);

  if (!project) {
    return (
      <main className="app-shell flex flex-1 flex-col py-10">
        <h1 className="text-2xl font-semibold">Project not found</h1>
        <Link href="/dashboard" className="mt-4 text-sm text-blue-700 underline">
          Return to dashboard
        </Link>
      </main>
    );
  }

  return (
    <main className="app-shell flex flex-1 flex-col py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Project Detail
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          {project.name}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{project.client}</p>
      </header>

      <section className="panel p-7">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Project Overview</h2>
        <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
          <p>
            <span className="font-medium">Project ID:</span> {project.id}
          </p>
          <p>
            <span className="font-medium">Location:</span> {project.location}
          </p>
          <p>
            <span className="font-medium">Status:</span> {project.status}
          </p>
          <p>
            <span className="font-medium">Last Updated:</span> {project.lastUpdated}
          </p>
          <p>
            <span className="font-medium">Revit Models:</span> {project.modelCount}
          </p>
        </div>
      </section>

      <div className="mt-6 flex gap-3">
        <Link href={`/viewer/${project.id}`} className="btn-primary">
          Open Model
        </Link>
        <Link href="/dashboard" className="btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
