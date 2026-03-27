import Link from "next/link";
import { getProjectById } from "@/features/projects";

type ProjectDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { id } = await params;
  const project = getProjectById(id);

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

  const rows: { label: string; value: string; isUrl?: boolean }[] = [
    { label: "Project ID", value: project.id },
    { label: "Project name", value: project.projectName },
    { label: "Client", value: project.clientName },
    { label: "Location", value: project.location },
    { label: "Discipline", value: project.discipline },
    { label: "Model source", value: project.modelSource },
    {
      label: "Model URL",
      value: project.modelUrl || "— (not set yet)",
      isUrl: !!project.modelUrl,
    },
    { label: "Status", value: project.status },
    { label: "Last updated", value: project.lastUpdated },
  ];

  return (
    <main className="app-shell flex flex-1 flex-col py-10">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Project Detail
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          {project.projectName}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{project.clientName}</p>
      </header>

      <section className="panel p-7">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Project information</h2>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="border-b border-slate-100 pb-3 sm:border-0 sm:pb-0">
              <dt className="font-medium text-slate-500">{row.label}</dt>
              <dd className="mt-1 text-slate-900">
                {row.isUrl ? (
                  <a
                    href={row.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-blue-700 underline hover:text-blue-900"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 border-t border-slate-200 pt-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-900">Description</h3>
          <p className="text-sm leading-6 text-slate-700">{project.description}</p>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/viewer/${project.id}`} className="btn-primary">
          Open Viewer
        </Link>
        <Link href="/dashboard" className="btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
