"use client";

import { Button, MoreMenu } from "@/components/ui";

type GisMapToolbarProps = {
  labelsEnabled: boolean;
  onToggleLabels: () => void;
  onFitAllLayers: () => void;
  onResetView: () => void;
  fitDisabled: boolean;
  compact?: boolean;
};

function IconExpand() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path
        d="M3 6.5 8 3l5 3.5M3 9.5 8 13l5-3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTag() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path
        d="M5.5 3.5h5L13 6v5.5a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 11V5a1.5 1.5 0 0 1 1-1.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="6.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function IconNorth() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" aria-hidden>
      <path d="M8 13V4M8 4 5 7M8 4l3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 13h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Map controls — grouped, enterprise styling (aligned with main viewer toolbar).
 */
export default function GisMapToolbar({
  labelsEnabled,
  onToggleLabels,
  onFitAllLayers,
  onResetView,
  fitDisabled,
  compact,
}: GisMapToolbarProps) {
  const btn = [
    "!h-7 !min-h-7 !gap-1 !px-2 !text-[length:var(--text-2xs)] !font-bold",
    compact ? "!text-[length:var(--text-2xs)]" : "",
  ].join(" ");

  return (
    <div
      className={[
        "flex flex-wrap items-center gap-1 rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-1 shadow-[var(--shadow-xs)]",
        compact ? "" : "",
      ].join(" ")}
      role="toolbar"
      aria-label="Map navigation"
    >
      <span className="hidden px-1 text-[length:var(--text-2xs)] font-bold uppercase tracking-wide text-[color:var(--text-subtle)] sm:inline">
        Map
      </span>
      <div className="flex flex-wrap items-center gap-0.5">
        <Button type="button" size="md" variant="secondary" className={btn} onClick={onResetView} title="Reset map view">
          <IconNorth />
          <span>Reset</span>
        </Button>
        <MoreMenu
          label="More"
          className="ml-0.5"
          items={[
            { key: "fit", label: "Fit all visible layers", onClick: onFitAllLayers, disabled: fitDisabled },
            { key: "labels", label: `Labels: ${labelsEnabled ? "on" : "off"}`, onClick: onToggleLabels },
          ]}
        />
      </div>
    </div>
  );
}
