import Link from "next/link";
import LogoutButton from "@/components/logout-button";
import ModelTreePanel from "@/features/viewer/components/panels/model-tree-panel";
import { ElementItem, ViewerProject } from "@/features/viewer/types";
import { Badge, Card, Divider } from "@/components/ui";

type ProjectInfoPanelProps = {
  project: ViewerProject;
  elements: ElementItem[];
  selectedElementId: string;
  onSelectElement: (id: string) => void;
};

export default function ProjectInfoPanel({
  project,
  elements,
  selectedElementId,
  onSelectElement,
}: ProjectInfoPanelProps) {
  return (
    <aside className="space-y-3">
      <Card className="p-3">
        <p className="label-eyebrow">Project Info</p>
        <p className="mt-2 text-sm font-semibold text-slate-900">{project.name}</p>
        <div className="mt-2 grid grid-cols-[88px_1fr] gap-y-1.5 text-xs">
          <p className="label-key">Version</p>
          <p className="font-medium text-slate-800">v1.0.3</p>
          <p className="label-key">Discipline</p>
          <p className="font-medium text-slate-800">{project.discipline ?? "—"}</p>
          <p className="label-key">Updated</p>
          <p className="font-medium text-slate-800">{project.lastUpdated}</p>
          <p className="label-key">Source</p>
          <p className="font-medium text-slate-800">{project.modelSource ?? "—"}</p>
        </div>
        <Divider className="my-2" />
        <div className="flex items-center justify-between">
          <Badge variant="neutral">Read-only</Badge>
          <Link href="/dashboard" className="text-xs font-medium text-slate-600 hover:text-slate-900">
            Dashboard
          </Link>
        </div>
        <div className="mt-2">
          <LogoutButton />
        </div>
      </Card>

      <ModelTreePanel
        elements={elements}
        selectedElementId={selectedElementId}
        onSelectElement={onSelectElement}
      />
    </aside>
  );
}
