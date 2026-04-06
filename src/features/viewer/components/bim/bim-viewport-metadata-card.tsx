"use client";

import type { BimLoadPhase, BimLoadSource } from "@/features/viewer/bim/bim-types";
import { BIM_DEV_SAMPLE_RELATIVE_PATH } from "@/features/viewer/bim/resolve-bim-viewport-url";
import { Card } from "@/components/ui";

function sourceLabel(loadSource: BimLoadSource): string {
  switch (loadSource) {
    case "project-ifc":
      return "Project data (ifcUrl or sourceFiles)";
    case "dev-sample":
      return `Dev sample (${BIM_DEV_SAMPLE_RELATIVE_PATH})`;
    case "none":
      return "—";
    default:
      return "—";
  }
}

function statusLabel(phase: BimLoadPhase): string {
  switch (phase) {
    case "idle":
      return "Idle";
    case "loading":
      return "Loading…";
    case "ready":
      return "Loaded";
    case "error":
      return "Failed";
    default:
      return "—";
  }
}

export default function BimViewportMetadataCard({
  displayFileName,
  fileType,
  modelSource,
  loadSource,
  phase,
  error,
  compact,
}: {
  displayFileName: string | null;
  fileType: string;
  modelSource: string;
  loadSource: BimLoadSource;
  phase: BimLoadPhase;
  error: string | null;
  compact?: boolean;
}) {
  const text = compact ? "text-[length:var(--text-2xs)]" : "text-[length:var(--text-xs)]";
  const dt = compact ? "text-[length:var(--text-2xs)]" : "text-[length:var(--text-2xs)]";

  return (
    <Card
      className={[
        "border-[color:var(--border-subtle)] bg-[color:var(--surface)] shadow-[var(--shadow-xs)]",
        compact ? "p-[length:var(--panel-padding-compact)]" : "p-[length:var(--card-padding)]",
      ].join(" ")}
    >
      <p className={["font-bold text-[color:var(--text)]", compact ? "text-[length:var(--text-2xs)]" : "text-[length:var(--text-xs)]"].join(" ")}>
        BIM file metadata
      </p>
      <dl className={`mt-2 grid gap-2 sm:grid-cols-2 ${text}`}>
        <div>
          <dt className={`font-bold uppercase tracking-wide text-[color:var(--text-muted)] ${dt}`}>File name</dt>
          <dd className="mt-0.5 break-all font-mono text-[color:var(--text)]">
            {displayFileName ?? <span className="font-sans text-[color:var(--text-subtle)]">—</span>}
          </dd>
        </div>
        <div>
          <dt className={`font-bold uppercase tracking-wide text-[color:var(--text-muted)] ${dt}`}>File type</dt>
          <dd className="mt-0.5 text-[color:var(--text)]">{fileType}</dd>
        </div>
        <div>
          <dt className={`font-bold uppercase tracking-wide text-[color:var(--text-muted)] ${dt}`}>Source</dt>
          <dd className="mt-0.5 text-[color:var(--text)]">{sourceLabel(loadSource)}</dd>
        </div>
        <div>
          <dt className={`font-bold uppercase tracking-wide text-[color:var(--text-muted)] ${dt}`}>Model source</dt>
          <dd className="mt-0.5 break-words text-[color:var(--text)]">{modelSource || "—"}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className={`font-bold uppercase tracking-wide text-[color:var(--text-muted)] ${dt}`}>Loaded status</dt>
          <dd className="mt-0.5">
            <span
              className={
                phase === "ready"
                  ? "font-semibold text-[color:var(--success)]"
                  : phase === "error"
                    ? "font-semibold text-[color:var(--error)]"
                    : phase === "loading"
                      ? "font-semibold text-[color:var(--primary)]"
                      : "text-[color:var(--text-muted)]"
              }
            >
              {statusLabel(phase)}
            </span>
            {error ? (
              <span className="mt-1 block break-words text-[length:var(--text-2xs)] text-[color:var(--error)]">
                {error}
              </span>
            ) : null}
          </dd>
        </div>
      </dl>
      {loadSource === "dev-sample" ? (
        <p
          className={[
            "mt-3 rounded-[var(--radius-sm)] border border-[color:var(--primary-100)] bg-[color:var(--primary-50)] px-2 py-1.5 text-[color:var(--text)]",
            compact ? "text-[length:var(--text-2xs)] leading-snug" : "text-[length:var(--text-xs)] leading-snug",
          ].join(" ")}
        >
          <span className="font-bold">Replace sample model:</span> overwrite{" "}
          <code className="rounded-[var(--radius-xs)] bg-[color:var(--surface)] px-1 font-mono">public/bim/sample.ifc</code>{" "}
          with your own IFC (same filename) or set{" "}
          <code className="rounded-[var(--radius-xs)] bg-[color:var(--surface)] px-1 font-mono">ifcUrl</code> /{" "}
          <code className="rounded-[var(--radius-xs)] bg-[color:var(--surface)] px-1 font-mono">sourceFiles[].url</code> on the
          project. See <code className="rounded-[var(--radius-xs)] bg-[color:var(--surface)] px-1 font-mono">docs/bim-local-testing.md</code>.
        </p>
      ) : null}
    </Card>
  );
}
