"use client";

import { useState, type ReactNode } from "react";
import type { BimElementSelection } from "@/features/viewer/bim/bim-types";
import type { BimManualAlignment } from "@/features/viewer/bim/bim-manual-alignment";
import type { BimViewerSidebarState } from "@/features/viewer/bim/bim-types";
import BimManualAlignmentPanel from "@/features/viewer/components/bim/bim-manual-alignment-panel";
import type { GisLayerPanelRow } from "@/features/viewer/gis/gis-types";
import type { ViewerProject } from "@/features/viewer/types";
import BimModelSidebar from "@/features/viewer/components/bim/bim-model-sidebar";
import GisLayersPanel from "@/features/viewer/components/gis/gis-layers-panel";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={["h-3.5 w-3.5 shrink-0 text-[color:var(--text-subtle)] transition-transform", open ? "rotate-180" : ""].join(
        " ",
      )}
      fill="none"
      aria-hidden
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RailSection({
  title,
  description,
  defaultOpen = true,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `rail-section-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <section
      className="overflow-hidden rounded-[var(--radius-md)] border border-[color:var(--viewer-panel-border)] bg-[color:color-mix(in_srgb,var(--surface)_90%,var(--background))] shadow-none"
      aria-label={title}
    >
      <button
        type="button"
        id={`${panelId}-trigger`}
        aria-expanded={open}
        aria-controls={`${panelId}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="interactive-tree-header flex w-full cursor-pointer items-start gap-2 px-2 py-1.5 text-left transition hover:bg-[color:var(--surface-muted)] active:scale-[0.998]"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[length:var(--text-2xs)] font-bold uppercase tracking-wide text-[color:var(--text-muted)]">
            {title}
          </span>
          {description ? (
            <span className="mt-0.5 block text-[length:var(--text-2xs)] leading-snug text-[color:var(--text-subtle)]">
              {description}
            </span>
          ) : null}
        </span>
        <Chevron open={open} />
      </button>
      {open ? (
        <div
          id={`${panelId}-panel`}
          role="region"
          aria-labelledby={`${panelId}-trigger`}
          className="border-t border-[color:var(--viewer-chrome-divider)] p-2 pt-2"
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}

type CombinedReviewLeftPanelProps = {
  project: ViewerProject;
  bimSidebar: BimViewerSidebarState;
  bimSelection: BimElementSelection | null;
  manualAlignment: BimManualAlignment;
  onManualAlignmentChange: (patch: Partial<BimManualAlignment>) => void;
  onManualAlignmentReset: () => void;
  gisRows: GisLayerPanelRow[];
  onToggleVisible: (id: string, visible: boolean) => void;
  onZoomToLayer: (id: string) => void;
  /** Map feature pick — highlights matching layer card. */
  selectedGisLayerId?: string | null;
  /** Last “fit layer” target — secondary highlight. */
  zoomTargetLayerId?: string | null;
};

/**
 * Single left rail for Combined mode: BIM models block, then GIS layers (no duplicate project chrome on GIS card).
 */
export default function CombinedReviewLeftPanel({
  project,
  bimSidebar,
  bimSelection,
  manualAlignment,
  onManualAlignmentChange,
  onManualAlignmentReset,
  gisRows,
  onToggleVisible,
  onZoomToLayer,
  selectedGisLayerId,
  zoomTargetLayerId,
}: CombinedReviewLeftPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <RailSection
        title="BIM"
        description="Model source, load state, and structure browser."
        defaultOpen
      >
        <BimModelSidebar project={project} sidebar={bimSidebar} selection={bimSelection} density="compact" />
      </RailSection>

      <RailSection
        title="Alignment"
        description="Manual nudge for coordinated review — not survey-grade."
        defaultOpen={false}
      >
        <BimManualAlignmentPanel
          value={manualAlignment}
          onChange={onManualAlignmentChange}
          onReset={onManualAlignmentReset}
          density="compact"
        />
      </RailSection>

      <RailSection title="GIS" description="Layer visibility and map fit." defaultOpen>
        <GisLayersPanel
          project={project}
          rows={gisRows}
          onToggleVisible={onToggleVisible}
          onZoomToLayer={onZoomToLayer}
          showProjectChrome={false}
          layerFocus={{ selectionId: selectedGisLayerId ?? null, zoomTargetId: zoomTargetLayerId ?? null }}
          density="compact"
        />
      </RailSection>
    </div>
  );
}
