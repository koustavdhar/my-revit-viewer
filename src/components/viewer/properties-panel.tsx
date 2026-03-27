import { ElementItem } from "@/features/viewer/types";

type PropertiesPanelProps = {
  selectedElement: ElementItem;
};

export default function PropertiesPanel({ selectedElement }: PropertiesPanelProps) {
  return (
    <aside className="panel h-fit p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Selected Element Properties
      </h2>
      <p className="mb-3 text-[11px] text-slate-500">Placeholder data (mock element properties)</p>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900">{selectedElement.category}</p>
        <p className="text-xs text-slate-500">{selectedElement.id}</p>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        <li>
          <span className="font-medium text-slate-900">Element ID:</span> {selectedElement.id}
        </li>
        <li>
          <span className="font-medium text-slate-900">Category:</span> {selectedElement.category}
        </li>
        <li>
          <span className="font-medium text-slate-900">Family:</span> {selectedElement.family}
        </li>
        <li>
          <span className="font-medium text-slate-900">Type:</span> {selectedElement.type}
        </li>
        <li>
          <span className="font-medium text-slate-900">Level:</span> {selectedElement.level}
        </li>
        <li>
          <span className="font-medium text-slate-900">Material:</span> {selectedElement.material}
        </li>
      </ul>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
        Read-only mode enabled. Property editing is disabled in V1.
      </div>
    </aside>
  );
}
