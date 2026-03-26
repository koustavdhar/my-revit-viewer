type ViewerToolbarProps = {
  tools: string[];
  activeTool: string;
  onToolChange: (tool: string) => void;
};

export default function ViewerToolbar({
  tools,
  activeTool,
  onToolChange,
}: ViewerToolbarProps) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
      {tools.map((tool) => (
        <button
          key={tool}
          type="button"
          onClick={() => onToolChange(tool)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            activeTool === tool
              ? "bg-slate-900 text-white"
              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          {tool}
        </button>
      ))}
    </div>
  );
}
