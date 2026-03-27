import { ElementItem } from "@/features/viewer/types";
import { Card, Divider } from "@/components/ui";

type PropertiesPanelProps = {
  selectedElement: ElementItem;
};

export default function PropertiesPanel({ selectedElement }: PropertiesPanelProps) {
  return (
    <Card className="h-full p-3">
      <h2 className="label-eyebrow">Element Properties</h2>
      <p className="mt-1 text-xs text-slate-500">Structured placeholder data</p>

      <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2">
        <p className="truncate text-sm font-semibold text-slate-900">{selectedElement.category}</p>
        <p className="truncate text-xs text-slate-500">{selectedElement.id}</p>
      </div>

      <Divider className="my-2" />
      <p className="label-key mb-1">Identity</p>
      <dl className="space-y-1.5 text-xs">
        <div className="grid grid-cols-[90px_1fr] gap-2">
          <dt className="text-slate-500">Element ID</dt>
          <dd className="font-medium text-slate-900">{selectedElement.id}</dd>
        </div>
        <div className="grid grid-cols-[90px_1fr] gap-2">
          <dt className="text-slate-500">Category</dt>
          <dd className="font-medium text-slate-900">{selectedElement.category}</dd>
        </div>
      </dl>

      <Divider className="my-2" />
      <p className="label-key mb-1">Classification</p>
      <dl className="space-y-1.5 text-xs">
        <div className="grid grid-cols-[90px_1fr] gap-2">
          <dt className="text-slate-500">Family</dt>
          <dd className="font-medium text-slate-900">{selectedElement.family}</dd>
        </div>
        <div className="grid grid-cols-[90px_1fr] gap-2">
          <dt className="text-slate-500">Type</dt>
          <dd className="font-medium text-slate-900">{selectedElement.type}</dd>
        </div>
      </dl>

      <Divider className="my-2" />
      <p className="label-key mb-1">Placement</p>
      <dl className="space-y-1.5 text-xs">
        <div className="grid grid-cols-[90px_1fr] gap-2">
          <dt className="text-slate-500">Level</dt>
          <dd className="font-medium text-slate-900">{selectedElement.level}</dd>
        </div>
        <div className="grid grid-cols-[90px_1fr] gap-2">
          <dt className="text-slate-500">Material</dt>
          <dd className="font-medium text-slate-900">{selectedElement.material}</dd>
        </div>
      </dl>

      <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">
        Read-only mode: editing is disabled in v1.
      </div>
    </Card>
  );
}
