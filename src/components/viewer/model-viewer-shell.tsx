"use client";

import Link from "next/link";
import ModelTreePanel from "@/components/viewer/model-tree-panel";
import ProjectInfoPanel from "@/components/viewer/project-info-panel";
import PropertiesPanel from "@/components/viewer/properties-panel";
import { useViewerProvider } from "@/components/viewer/use-viewer-provider";
import ViewerToolbar from "@/components/viewer/viewer-toolbar";
import { ViewerProject } from "@/components/viewer/types";

type ModelViewerShellProps = {
  project: ViewerProject;
};

export default function ModelViewerShell({ project }: ModelViewerShellProps) {
  const viewer = useViewerProvider();

  return (
    <main className="app-shell flex flex-1 py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[280px_1fr_320px]">
        <ProjectInfoPanel project={project} />

        <section>
          <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Model Review Environment
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Viewer
              </h1>
              <p className="text-sm text-slate-600">
                {project.name} ({project.id})
              </p>
            </div>
            <Link href={`/projects/${project.id}`} className="btn-secondary">
              Project Detail
            </Link>
          </header>

          <div className="panel min-h-[650px] p-4">
            <ViewerToolbar
              tools={viewer.tools}
              activeTool={viewer.activeTool}
              onToolChange={viewer.setActiveTool}
            />

            {/* Placeholder for future SDK integration mount point (Speckle or APS). */}
            {/* Future step: initialize SDK viewer in this container and sync provider state/actions. */}
            <div
              id="model-viewer-container"
              className="flex h-full min-h-[580px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50"
            >
              <div className="text-center">
                <p className="text-lg font-medium text-slate-700">
                  3D Model Viewer Will Load Here
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Active tool: {viewer.activeTool} (dummy interaction)
                </p>
              </div>
            </div>
          </div>
        </section>

        <div>
          <ModelTreePanel
            elements={viewer.elements}
            selectedElementId={viewer.selectedElement.id}
            onSelectElement={viewer.selectElementById}
          />
          <div className="mt-5">
            <PropertiesPanel selectedElement={viewer.selectedElement} />
          </div>
        </div>
      </div>
    </main>
  );
}
