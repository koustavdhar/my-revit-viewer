"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";

type ViewerToolbarProps = {
  tools: string[];
  activeTool: string;
  onToolChange: (tool: string) => void;
  /** Icon-first controls for dense BIM/GIS chrome */
  compact?: boolean;
};

type ToolGroupId = "navigate" | "review" | "view";

const GROUP_ORDER: ToolGroupId[] = ["navigate", "review", "view"];

const GROUP_ARIA: Record<ToolGroupId, string> = {
  navigate: "Navigation",
  review: "Analysis",
  view: "View",
};

type ToolDef = {
  group: ToolGroupId;
  title: string;
  icon: ReactNode;
};

function IconOrbit() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path
        d="M8 2.5a5.5 5.5 0 1 1-4.9 3"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path d="M2.5 5.5 2 2l3.5.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPan() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path
        d="M8 2.5v11M5.5 5 8 2.5 10.5 5M5.5 11 8 13.5 10.5 11"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconZoom() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.35" />
      <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}

function IconSection() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path d="M2.5 8h11" stroke="currentColor" strokeWidth="1.35" strokeDasharray="2 2" />
      <rect x="3.5" y="3.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}

function IconIsolate() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path
        d="M3 5h10M5 8h6M7 11h2"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path d="M12.5 3.5 14 2M12.5 3.5 14 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconReset() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path
        d="M4 6.5A4.5 4.5 0 0 1 12.2 5M12 9.5A4.5 4.5 0 0 1 3.8 11"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path d="M12.5 2.5V5h-2.5M3.5 13.5V11H6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TOOL_DEF: Record<string, ToolDef> = {
  Orbit: { group: "navigate", title: "Orbit — rotate camera around target (when engine is wired)", icon: <IconOrbit /> },
  Pan: { group: "navigate", title: "Pan — drag view (when engine is wired)", icon: <IconPan /> },
  Zoom: { group: "navigate", title: "Zoom — magnify view (when engine is wired)", icon: <IconZoom /> },
  Section: { group: "review", title: "Section — clipping plane (when engine is wired)", icon: <IconSection /> },
  Isolate: { group: "review", title: "Isolate — hide unrelated elements (when engine is wired)", icon: <IconIsolate /> },
  "Reset View": { group: "view", title: "Reset view — home camera (when engine is wired)", icon: <IconReset /> },
};

export default function ViewerToolbar({ tools, activeTool, onToolChange, compact = true }: ViewerToolbarProps) {
  const grouped = useMemo(() => {
    const buckets = new Map<ToolGroupId, string[]>();
    for (const g of GROUP_ORDER) buckets.set(g, []);
    for (const id of tools) {
      const def = TOOL_DEF[id];
      const group = def?.group ?? "navigate";
      buckets.get(group)!.push(id);
    }
    return GROUP_ORDER.map((g) => ({ id: g, tools: buckets.get(g)! })).filter((s) => s.tools.length > 0);
  }, [tools]);

  return (
    <div
      className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:flex-nowrap"
      role="toolbar"
      aria-label="Viewer tools"
    >
      <div className="inline-flex h-8 min-w-0 max-w-full items-stretch overflow-hidden rounded-[var(--radius-xs)] border border-[color:var(--viewer-panel-border)] bg-[color:color-mix(in_srgb,var(--surface-muted)_52%,var(--background))]">
        {grouped.map((section, si) => (
          <div key={section.id} className="flex min-w-0 items-stretch">
            {si > 0 ? (
              <div
                className="w-px shrink-0 self-stretch bg-[color:var(--viewer-chrome-divider)]"
                aria-hidden
                role="presentation"
              />
            ) : null}
            <div
              role="group"
              aria-label={GROUP_ARIA[section.id]}
              className="flex items-stretch gap-0 px-0.5 py-0.5"
            >
              {section.tools.map((tool) => {
                const def = TOOL_DEF[tool];
                const isActive = activeTool === tool;
                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => onToolChange(tool)}
                    title={def?.title ?? tool}
                    aria-label={def?.title ?? tool}
                    aria-pressed={isActive}
                    aria-current={isActive ? "true" : undefined}
                    className={[
                      "relative inline-flex min-h-0 min-w-[1.75rem] shrink-0 cursor-pointer items-center justify-center px-1.5 transition-[color,background-color,box-shadow]",
                      compact ? "min-h-7 min-w-7" : "gap-1 px-2 text-[length:var(--text-2xs)] font-semibold tracking-tight",
                      "rounded-[calc(var(--radius-xs)-1px)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-0",
                      isActive
                        ? "z-[1] bg-[color:var(--primary-700)] text-white shadow-[inset_0_-2px_0_0_color-mix(in_srgb,white_35%,var(--primary))]"
                        : "text-[color:var(--text-muted)] hover:bg-[color:color-mix(in_srgb,var(--surface)_70%,var(--primary-50))] hover:text-[color:var(--text)] active:bg-[color:color-mix(in_srgb,var(--surface-muted)_80%,var(--primary-50))]",
                    ].join(" ")}
                  >
                    {def?.icon ?? null}
                    {compact ? (
                      <span className="sr-only">{tool}</span>
                    ) : (
                      <span className="max-w-[5rem] truncate">{tool}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
