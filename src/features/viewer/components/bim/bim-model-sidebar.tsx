"use client";

import type { ViewerProject } from "@/features/viewer/types";
import type { BimElementSelection, BimViewerSidebarState } from "@/features/viewer/bim/bim-types";
import { Badge, Card, Divider, Skeleton } from "@/components/ui";

function TreeRows({
  nodes,
  depth = 0,
}: {
  nodes: BimViewerSidebarState["tree"];
  depth?: number;
}) {
  return (
    <ul
      className={
        depth === 0
          ? "space-y-0.5"
          : "ml-2.5 mt-1 space-y-0.5 border-l border-[color:var(--border-subtle)] pl-2"
      }
    >
      {nodes.map((n) => (
        <li key={n.id}>
          <div className="rounded-[var(--radius-sm)] px-1 py-0.5 text-[length:var(--text-2xs)] text-[color:var(--text)]">
            <span className="font-semibold">{n.label}</span>
            {n.detail ? <span className="text-[color:var(--text-muted)]"> · {n.detail}</span> : null}
          </div>
          {n.children?.length ? <TreeRows nodes={n.children} depth={depth + 1} /> : null}
        </li>
      ))}
    </ul>
  );
}

export default function BimModelSidebar({
  project,
  sidebar,
  selection,
  density = "default",
}: {
  project: ViewerProject;
  sidebar: BimViewerSidebarState;
  /** Current 3D pick — surfaced for coordinated review in combined mode. */
  selection?: BimElementSelection | null;
  density?: "default" | "compact";
}) {
  const compact = density === "compact";
  const pad = compact ? "p-[length:var(--panel-padding-compact)]" : "p-[length:var(--card-padding)]";

  const statusLabel =
    sidebar.phase === "loading"
      ? "Loading…"
      : sidebar.phase === "ready"
        ? "Loaded"
        : sidebar.phase === "error"
          ? "Failed"
          : "Idle";

  const loadSourceLabel =
    sidebar.loadSource === "project-ifc"
      ? "Project IFC URL"
      : sidebar.loadSource === "dev-sample"
        ? "Dev sample file"
        : "None";

  const statusVariant =
    sidebar.phase === "loading"
      ? "neutral"
      : sidebar.phase === "ready"
        ? "success"
        : sidebar.phase === "error"
          ? "error"
          : "neutral";

  return (
    <Card className={["border-[color:var(--border)] shadow-[var(--shadow-xs)]", pad].join(" ")}>
      {!compact ? <p className="label-eyebrow">BIM model</p> : null}
      {!compact ? (
        <p className="mt-1 truncate text-[length:var(--text-xs)] font-bold text-[color:var(--text)]">{project.name}</p>
      ) : null}
      <p
        className={[
          "leading-snug text-[color:var(--text-muted)]",
          compact ? "text-[length:var(--text-2xs)]" : "mt-1 text-[length:var(--text-2xs)]",
        ].join(" ")}
      >
        Viewer: IFC (That Open). APS / SVF2 can plug in later.
      </p>

      {selection ? (
        <div
          className="surface-primary mt-2 rounded-[var(--radius-sm)] border px-2 py-1.5 ring-1 ring-[color:color-mix(in_srgb,var(--primary)_28%,transparent)]"
          aria-current="true"
        >
          <p className="text-[length:var(--text-2xs)] font-bold uppercase tracking-wide text-[color:var(--primary)]">
            Active pick
          </p>
          <p className="mt-0.5 font-mono text-[length:var(--text-2xs)] text-[color:var(--text)]">
            localId <span className="font-bold">{selection.localId}</span>
            <span className="text-[color:var(--text-subtle)]"> · </span>
            model <span className="text-[color:var(--text-muted)]">{selection.modelId}</span>
          </p>
        </div>
      ) : (
        <p className="mt-2 rounded-[var(--radius-sm)] border border-dashed border-[color:var(--border)] bg-[color:var(--surface-muted)] px-2 py-1.5 text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
          No element selected — click the 3D model to inspect.
        </p>
      )}

      <Divider className="my-2" />
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[length:var(--text-2xs)] font-bold uppercase tracking-wide text-[color:var(--text-muted)]">
          Model tree
        </span>
        <Badge variant={statusVariant} size="compact">
          {statusLabel}
        </Badge>
      </div>
      <p className="mt-0.5 text-[length:var(--text-2xs)] leading-snug text-[color:var(--text-subtle)]">
        Placeholder hierarchy until classifiers / APS model browser are wired.
      </p>
      <div className="mt-2 max-h-[min(220px,32vh)] overflow-y-auto rounded-[var(--radius-sm)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] p-1.5">
        {sidebar.phase === "loading" ? (
          <div className="space-y-1.5" aria-busy="true" aria-label="Loading model tree">
            <Skeleton className="h-2.5 w-[88%]" />
            <Skeleton className="h-2.5 w-[72%]" />
            <Skeleton className="h-2.5 ml-3 w-[64%]" />
            <Skeleton className="h-2.5 ml-3 w-[56%]" />
          </div>
        ) : sidebar.phase === "error" ? (
          <p className="text-[length:var(--text-2xs)] leading-snug text-[color:var(--error)]">
            Tree unavailable — fix IFC load error below.
          </p>
        ) : sidebar.tree.length > 0 ? (
          <TreeRows nodes={sidebar.tree} />
        ) : (
          <p className="text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
            No tree yet — load an IFC to populate the root.
          </p>
        )}
      </div>
      <Divider className="my-2" />
      <dl className="grid grid-cols-[minmax(4.5rem,32%)_1fr] gap-x-2 gap-y-2 text-[length:var(--text-2xs)]">
        <dt className="font-bold text-[color:var(--text-muted)]">File name</dt>
        <dd className="break-all font-mono text-[color:var(--text)]">
          {sidebar.displayFileName ?? <span className="font-sans text-[color:var(--text-subtle)]">—</span>}
        </dd>
        <dt className="font-bold text-[color:var(--text-muted)]">Load origin</dt>
        <dd className="text-[color:var(--text)]">{loadSourceLabel}</dd>
        <dt className="font-bold text-[color:var(--text-muted)]">Model source</dt>
        <dd className="break-words text-[color:var(--text)]">{sidebar.modelSource || "—"}</dd>
        <dt className="font-bold text-[color:var(--text-muted)]">File type</dt>
        <dd className="text-[color:var(--text)]">{sidebar.fileType}</dd>
        <dt className="font-bold text-[color:var(--text-muted)]">IFC URL</dt>
        <dd className="break-all font-mono text-[color:var(--text-subtle)]">
          {sidebar.ifcUrl ?? (
            <span className="text-[color:var(--warning)]">None — set IFC URL or sourceFiles</span>
          )}
        </dd>
        <dt className="font-bold text-[color:var(--text-muted)]">Load status</dt>
        <dd className="text-[color:var(--text)]">{statusLabel}</dd>
        {sidebar.error ? (
          <>
            <dt className="font-bold text-[color:var(--error)]">Error</dt>
            <dd className="break-words text-[color:var(--error)]">{sidebar.error}</dd>
          </>
        ) : null}
      </dl>
    </Card>
  );
}
