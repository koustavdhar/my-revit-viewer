"use client";

import { useCallback, useId, useRef, useState } from "react";
import {
  detectSpatialUploadFromFileName,
  SPATIAL_UPLOAD_STATUS_LABELS,
  supportedSpatialUploadExtensionsSummary,
  type SpatialUploadDetection,
} from "@/features/projects/spatial-upload-format-rules";
import { AlertBanner, Badge, Button, Card, Divider } from "@/components/ui";

type UploadRow = {
  key: string;
  name: string;
  sizeLabel: string;
  detection: SpatialUploadDetection;
};

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function workflowBadgeVariant(
  s: SpatialUploadDetection["workflowStatus"],
): "success" | "warning" | "error" | "neutral" {
  if (s === "ready_to_view") return "success";
  if (s === "requires_conversion") return "warning";
  return "error";
}

function CategoryBadge({ detection }: { detection: SpatialUploadDetection }) {
  if (!detection.category) {
    return (
      <Badge variant="neutral" size="compact">
        —
      </Badge>
    );
  }
  if (detection.category === "BIM")
    return (
      <Badge variant="primary" size="compact">
        BIM
      </Badge>
    );
  if (detection.category === "GIS")
    return (
      <Badge variant="success" size="compact">
        GIS
      </Badge>
    );
  return (
    <Badge variant="neutral" size="compact">
      Generic 3D
    </Badge>
  );
}

function Gis3dTilesBadges({ detection }: { detection: SpatialUploadDetection }) {
  const h = detection.gis3dTilesHints;
  if (!h) {
    return (
      <span className="text-[length:var(--text-2xs)] text-[color:var(--text-subtle)]" title="Hints apply to 3D Tiles filenames">
        —
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      {h.webReady ? (
        <Badge variant="success" size="compact" className="w-fit">
          Web ready
        </Badge>
      ) : null}
      <Badge variant="primary" size="compact" className="w-fit">
        Geospatial 3D
      </Badge>
    </div>
  );
}

function ApsPipelineBadges({ detection }: { detection: SpatialUploadDetection }) {
  if (!detection.apsModelDerivative) {
    return (
      <span className="text-[length:var(--text-2xs)] text-[color:var(--text-subtle)]" title="APS Model Derivative applies to RVT and DWG">
        —
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <Badge variant="warning" size="compact" className="w-fit">
        Requires APS translation
      </Badge>
      <Badge variant="neutral" size="compact" className="w-fit">
        Target output: {detection.apsModelDerivative.targetOutput}
      </Badge>
    </div>
  );
}

function DirectViewBadge({ detection }: { detection: SpatialUploadDetection }) {
  if (!detection.format) {
    return (
      <Badge variant="neutral" size="compact">
        —
      </Badge>
    );
  }
  return detection.technicalDirectlyViewable ? (
    <Badge variant="success" size="compact">
      Direct view
    </Badge>
  ) : (
    <Badge variant="warning" size="compact">
      Needs conversion
    </Badge>
  );
}

export default function ProjectSpatialUploadZone() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rows, setRows] = useState<UploadRow[]>([]);

  const ingestFiles = useCallback((list: FileList | File[] | null) => {
    if (!list || (list as FileList).length === 0) return;
    const files = Array.from(list as File[]);
    const next: UploadRow[] = files.map((file) => ({
      key: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      sizeLabel: formatBytes(file.size),
      detection: detectSpatialUploadFromFileName(file.name),
    }));
    setRows((prev) => [...next, ...prev]);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ingestFiles(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    ingestFiles(e.dataTransfer.files);
  };

  return (
    <Card className="border-[color:var(--border-subtle)] p-[length:var(--card-padding)]">
      <h2 className="label-eyebrow">Upload (prototype)</h2>
      <p className="mt-1 max-w-3xl text-[length:var(--text-xs)] leading-snug text-[color:var(--text-muted)]">
        Client-side format detection only — no upload or storage. Simulates future ingest.
      </p>
      <Divider className="my-2" />
      <AlertBanner
        tone="info"
        title="Browser-only"
        message="Files stay on this machine until a backend ingest API exists."
        className="mb-2"
      />

      <label htmlFor={inputId} className="block cursor-pointer">
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
          }}
          onDrop={onDrop}
          className={[
            "rounded-[var(--radius-md)] border border-dashed px-4 py-6 text-center transition-colors",
            isDragging
              ? "border-[color:var(--primary)] bg-[color:var(--primary-50)]"
              : "border-[color:var(--border-strong)] bg-[color:var(--surface-muted)] hover:border-[color:var(--primary-100)]",
          ].join(" ")}
        >
          <p className="text-[length:var(--text-xs)] font-bold text-[color:var(--text)]">
            Drop files or click to browse
          </p>
          <p className="mt-1 text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
            {supportedSpatialUploadExtensionsSummary()}
          </p>
          <p className="mt-1 text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
            3D Tiles: <code className="rounded bg-[color:var(--surface)] px-1 font-mono">tileset.json</code>
          </p>
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="sr-only"
          multiple
          onChange={onInputChange}
        />
      </label>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
          Choose files
        </Button>
        {rows.length > 0 ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => setRows([])}>
            Clear list
          </Button>
        ) : null}
      </div>

      {rows.length > 0 ? (
        <>
          <Divider className="my-2" />
          <h3 className="label-key mb-1.5">Detection results</h3>
          <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[var(--shadow-xs)]">
            <table className="w-full min-w-[720px] border-collapse text-left text-[length:var(--text-xs)]">
              <thead>
                <tr className="border-b border-[color:var(--border)] bg-[color:var(--surface-muted)] text-[length:var(--text-2xs)] font-bold uppercase tracking-wide text-[color:var(--text-muted)]">
                  <th className="px-2 py-1.5">File</th>
                  <th className="px-2 py-1.5">Ext</th>
                  <th className="px-2 py-1.5">Type</th>
                  <th className="px-2 py-1.5">Class</th>
                  <th className="px-2 py-1.5">View</th>
                  <th className="px-2 py-1.5">3D Tiles</th>
                  <th className="px-2 py-1.5">APS</th>
                  <th className="px-2 py-1.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.key}
                    className="border-b border-[color:var(--border-subtle)] last:border-0 hover:bg-[color:var(--surface-muted)]"
                  >
                    <td className="px-2 py-1.5">
                      <div className="max-w-[200px] truncate font-semibold text-[color:var(--text)]" title={row.name}>
                        {row.name}
                      </div>
                      <div className="font-mono text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
                        {row.sizeLabel}
                      </div>
                      {row.detection.detailNote ? (
                        <div className="mt-0.5 text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
                          {row.detection.detailNote}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-2 py-1.5 font-mono text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
                      {row.detection.extension}
                    </td>
                    <td className="px-2 py-1.5 text-[color:var(--text)]">{row.detection.formatLabel}</td>
                    <td className="px-2 py-1.5">
                      <CategoryBadge detection={row.detection} />
                    </td>
                    <td className="px-2 py-1.5">
                      <DirectViewBadge detection={row.detection} />
                    </td>
                    <td className="px-2 py-1.5">
                      <Gis3dTilesBadges detection={row.detection} />
                    </td>
                    <td className="px-2 py-1.5">
                      <ApsPipelineBadges detection={row.detection} />
                    </td>
                    <td className="px-2 py-1.5">
                      <Badge variant={workflowBadgeVariant(row.detection.workflowStatus)} size="compact">
                        {row.detection.workflowStatusLabel}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[length:var(--text-2xs)] leading-snug text-[color:var(--text-muted)]">
            Status meanings: <strong>{SPATIAL_UPLOAD_STATUS_LABELS.ready_to_view}</strong> — open in this app’s
            viewer today; <strong>{SPATIAL_UPLOAD_STATUS_LABELS.requires_conversion}</strong> — known format,
            expect a future upload/conversion step or viewer wiring;{" "}
            <strong>{SPATIAL_UPLOAD_STATUS_LABELS.unsupported}</strong> — extension not configured.
          </p>
        </>
      ) : null}
    </Card>
  );
}
