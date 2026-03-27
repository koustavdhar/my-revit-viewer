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
    <div className="flex flex-wrap items-center gap-1 rounded-md border border-slate-200 bg-slate-50 p-1.5">
      {tools.map((tool) => (
        <button
          key={tool}
          type="button"
          onClick={() => onToolChange(tool)}
          className={`rounded px-2 py-1 text-xs font-medium transition ${
            activeTool === tool
              ? "bg-[color:var(--primary)] text-white"
              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          {tool}
        </button>
      ))}
    </div>
  );
}
