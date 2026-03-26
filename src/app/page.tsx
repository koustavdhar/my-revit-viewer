import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Browser-based Revit viewing",
      description:
        "Open project models from any modern browser with no local plugin setup.",
    },
    {
      title: "Read-only access",
      description:
        "Model data stays protected with controlled, view-only collaboration.",
    },
    {
      title: "Project dashboard",
      description:
        "Track model status, updates, and project context from one clean workspace.",
    },
    {
      title: "Element property inspection",
      description:
        "Review core element details in a structured side panel during model review.",
    },
  ];

  return (
    <main className="flex flex-1 flex-col">
      <section className="app-shell py-14 md:py-18">
        <div className="grid gap-8 rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8 shadow-sm md:grid-cols-[1.2fr_0.8fr] md:p-12">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              AEC SaaS Platform
            </p>
            <h1 className="section-title max-w-2xl">
              Premium model review experience for Revit projects
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              My Revit Viewer gives teams a clean browser interface to open models,
              review project context, and inspect element data without editing risk.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="btn-primary px-5">
                Start Demo
              </Link>
              <Link href="/dashboard" className="btn-secondary px-5">
                Explore Dashboard
              </Link>
            </div>
          </div>
          <div className="panel p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Version 1 Scope
            </p>
            <ul className="space-y-3 text-sm leading-6 text-slate-700">
              <li>Read-only model viewing</li>
              <li>Project dashboard and detail pages</li>
              <li>No editing, comments, or clash workflows</li>
              <li>No AI assistant in this version</li>
            </ul>
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Designed for controlled BIM visibility across project stakeholders.
            </div>
          </div>
        </div>
      </section>

      <section className="app-shell pb-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Feature Highlights
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Built for practical model review
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="panel p-6">
              <div className="mb-4 h-9 w-9 rounded-lg bg-slate-100 p-2">
                <svg viewBox="0 0 20 20" fill="none" className="h-full w-full text-slate-700">
                  <path
                    d="M4 5.5h12M4 10h12M4 14.5h8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="app-shell py-10">
        <div className="panel p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            How It Works
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">1. Sign In</p>
              <p className="mt-2 text-sm text-slate-600">
                Access your workspace through a secure web login.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">2. Open Project</p>
              <p className="mt-2 text-sm text-slate-600">
                Select a project from the dashboard control panel.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">3. Review Model</p>
              <p className="mt-2 text-sm text-slate-600">
                Inspect geometry and element properties in read-only mode.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="app-shell pb-12">
        <div className="panel flex flex-col items-start justify-between gap-5 p-8 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Ready to preview your BIM workspace?
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Use the demo login and browse projects in a realistic product layout.
            </p>
          </div>
          <Link href="/login" className="btn-primary px-5">
            Open Demo App
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="app-shell flex flex-wrap items-center justify-between gap-3 py-5 text-sm text-slate-500">
          <p>My Revit Viewer</p>
          <p>Read-only BIM review for AEC teams</p>
        </div>
      </footer>
    </main>
  );
}
