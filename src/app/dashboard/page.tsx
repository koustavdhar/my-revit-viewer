import Link from "next/link";
import { projects } from "@/features/projects";
import LogoutButton from "@/components/logout-button";

function getStatusBadgeClass(status: string) {
  if (status === "Active") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  }
  if (status === "Review") {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  }
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
}

export default function DashboardPage() {
  return (
    <main className="app-shell flex flex-1 py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="panel h-fit p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </h2>
          <nav className="space-y-1.5 text-sm">
            <Link href="/dashboard" className="block rounded-lg bg-slate-100 px-3 py-2.5 font-medium text-slate-900">
              Projects
            </Link>
            <Link href="/" className="block rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Landing Page
            </Link>
            <Link href="/login" className="block rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Login
            </Link>
          </nav>
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            BIM control panel for active project monitoring.
          </div>
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              User
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Koustav Dhar</p>
            <p className="text-xs text-slate-500">Prototype Account</p>
            <div className="mt-3">
              <LogoutButton />
            </div>
          </div>
        </aside>

        <section>
          <header className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Project Control Panel
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {projects.length} sample projects (mock data from{" "}
                <code className="rounded bg-slate-100 px-1 text-xs">mock-projects.ts</code>)
              </p>
            </div>
            <Link href="/login" className="btn-secondary hidden sm:inline-flex">
              Change Account
            </Link>
          </header>

          <div className="panel-muted mb-5 flex items-center justify-between p-3">
            <p className="text-sm text-slate-600">Layout: Card view + compact list view</p>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-slate-900 ring-1 ring-slate-200">
                Cards
              </span>
              <span className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-500">
                List
              </span>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <article key={project.id} className="panel p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {project.projectName}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">{project.clientName}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {project.discipline} · {project.modelSource}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(project.status)}`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="line-clamp-2 text-sm text-slate-600">{project.description}</p>
                <p className="mt-3 text-sm text-slate-700">
                  Last updated: <span className="font-medium">{project.lastUpdated}</span>
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/viewer/${project.id}`} className="btn-primary">
                    Open Viewer
                  </Link>
                  <Link href={`/projects/${project.id}`} className="btn-secondary">
                    Project Detail
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <section className="panel mt-6 overflow-hidden">
            <div className="border-b border-slate-200 px-5 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Compact Project List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Project</th>
                    <th className="px-5 py-3 font-medium">Discipline</th>
                    <th className="px-5 py-3 font-medium">Model source</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Last updated</th>
                    <th className="px-5 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={`${project.id}-row`} className="border-t border-slate-200">
                      <td className="px-5 py-3">
                        <p className="font-medium text-slate-900">{project.projectName}</p>
                        <p className="text-xs text-slate-500">{project.clientName}</p>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{project.discipline}</td>
                      <td className="px-5 py-3 text-slate-600">{project.modelSource}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(project.status)}`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{project.lastUpdated}</td>
                      <td className="px-5 py-3">
                        <Link href={`/viewer/${project.id}`} className="btn-secondary !py-1.5">
                          Open Viewer
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
