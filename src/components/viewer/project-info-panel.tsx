import Link from "next/link";
import LogoutButton from "@/components/logout-button";
import { ViewerProject } from "@/features/viewer/types";

type ProjectInfoPanelProps = {
  project: ViewerProject;
};

export default function ProjectInfoPanel({ project }: ProjectInfoPanelProps) {
  return (
    <aside className="panel h-fit p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Project Panel
      </h2>
      <div className="space-y-2 text-sm text-slate-700">
        <p>
          <span className="font-medium text-slate-900">Project name:</span> {project.name}
        </p>
        <p>
          <span className="font-medium text-slate-900">Model version:</span> v1.0.3
        </p>
        <p>
          <span className="font-medium text-slate-900">Discipline:</span>{" "}
          {project.discipline ?? "—"}
        </p>
        <p>
          <span className="font-medium text-slate-900">Last updated:</span> {project.lastUpdated}
        </p>
        {project.modelSource ? (
          <p>
            <span className="font-medium text-slate-900">Model source:</span> {project.modelSource}
          </p>
        ) : null}
        {project.modelUrl ? (
          <p className="break-all">
            <span className="font-medium text-slate-900">Model URL:</span>{" "}
            <a
              href={project.modelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline hover:text-blue-900"
            >
              {project.modelUrl}
            </a>
          </p>
        ) : (
          <p className="text-slate-500">
            <span className="font-medium text-slate-900">Model URL:</span> Not set
          </p>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          User
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-900">Koustav Dhar</p>
        <p className="text-xs text-slate-500">Read-only Session</p>
      </div>

      <Link href="/dashboard" className="btn-secondary mt-5 flex">
        Back to Dashboard
      </Link>
      <div className="mt-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
