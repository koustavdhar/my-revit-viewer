import Link from "next/link";

export default function ViewerEmptyPage() {
  return (
    <main className="app-shell flex flex-1 flex-col py-10">
      <section className="panel mx-auto w-full max-w-3xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Viewer
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          No project selected
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
          Choose a project first, then open its viewer. This keeps the workspace
          focused on one model at a time in read-only mode.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
          <Link href="/projects/p-001" className="btn-secondary">
            Open Example Project
          </Link>
        </div>
      </section>
    </main>
  );
}
