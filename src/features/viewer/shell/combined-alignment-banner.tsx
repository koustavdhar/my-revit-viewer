"use client";

/**
 * Explains that BIM + GIS are not spatially linked in this prototype build.
 */
export default function CombinedAlignmentBanner({ compact }: { compact?: boolean }) {
  return (
    <div
      className={[
        "shrink-0 rounded-none border-x-0 border-t-0 border-b border-[color:color-mix(in_srgb,var(--warning)_28%,var(--border))] bg-[color:var(--warning-50)] px-2 py-1.5",
        compact ? "py-1" : "",
      ].join(" ")}
      role="status"
    >
      <p className="text-[length:var(--text-2xs)] font-bold tracking-tight text-[color:var(--warning)]">
        Prototype alignment · Spatial sync pending
      </p>
      <p
        className={[
          "mt-0.5 leading-snug text-[color:var(--text-muted)]",
          compact ? "text-[length:var(--text-2xs)]" : "text-[length:var(--text-xs)]",
        ].join(" ")}
      >
        BIM and GIS are shown together for coordinated review, but they are <span className="font-semibold text-[color:var(--text)]">not</span>{" "}
        georeferenced to each other in this build. Treat coordinate systems as independent until survey / EPSG workflows
        land.
      </p>
    </div>
  );
}
