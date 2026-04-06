import type { ReactNode } from "react";
import type { ProjectSpatialFile } from "@/features/projects/project-spatial-file";
import {
  buildViewerHref,
  projectHasBimSlot,
  projectHasDirectGisSlot,
  projectSupportsCombinedFromRegistry,
  viewerModeForSpatialFile,
} from "@/features/projects/project-spatial-file";
import { apsTranslationTargetLabel, formatUsesApsModelDerivative } from "@/features/integrations/aps";
import { FORMAT_DEFINITIONS } from "@/features/viewer/formats/logical-formats";
import { Badge, Button, Card, Divider, MoreMenu } from "@/components/ui";

function StatusBadge({ status }: { status: ProjectSpatialFile["status"] }) {
  const variant =
    status === "ready" || status === "available"
      ? "success"
      : status === "processing"
        ? "primary"
        : status === "error"
          ? "error"
          : "warning";
  return (
    <Badge variant={variant} size="compact">
      {status.replace("_", " ")}
    </Badge>
  );
}

function CategoryBadge({ category }: { category: ProjectSpatialFile["category"] }) {
  if (category === "BIM") return <Badge variant="primary" size="compact">BIM</Badge>;
  if (category === "GIS") return <Badge variant="success" size="compact">GIS</Badge>;
  return <Badge variant="neutral" size="compact">Generic</Badge>;
}

type ProjectSpatialRegistryProps = {
  projectId: string;
  files: ProjectSpatialFile[];
};

export default function ProjectSpatialRegistry({ projectId, files }: ProjectSpatialRegistryProps) {
  const canBim = projectHasBimSlot(files);
  const canGis = projectHasDirectGisSlot(files);
  const canCombined = projectSupportsCombinedFromRegistry(files);

  return (
    <Card className="border-[color:var(--border-subtle)] p-[length:var(--card-padding)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="label-eyebrow">File registry</h2>
          <p className="mt-1 max-w-3xl text-[length:var(--text-xs)] leading-snug text-[color:var(--text-muted)]">
            One row per asset. Status reflects processing / viewer readiness. Open in viewer picks the scene mode for
            that file.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <MoreMenu
            label="Open"
            items={[
              { key: "open-bim", label: "Viewer · BIM mode", href: buildViewerHref(projectId, "bim"), disabled: !canBim },
              { key: "open-gis", label: "Viewer · GIS mode", href: buildViewerHref(projectId, "gis"), disabled: !canGis },
              {
                key: "open-combined",
                label: "Viewer · Combined mode",
                href: buildViewerHref(projectId, "combined"),
                disabled: !canCombined,
              },
            ]}
          />
        </div>
      </div>
      <Divider className="my-2" />
      <p className="mb-2 text-[length:var(--text-2xs)] text-[color:var(--text-subtle)]">
        Combined needs IFC + GeoJSON URLs in this MVP.
      </p>

      {files.length === 0 ? (
        <p className="text-[length:var(--text-xs)] text-[color:var(--text-muted)]">No spatial files registered.</p>
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[var(--shadow-xs)]">
          <table className="w-full min-w-[640px] border-collapse text-left text-[length:var(--text-xs)]">
            <thead>
              <tr className="border-b border-[color:var(--border)] bg-[color:var(--surface-muted)] text-[length:var(--text-2xs)] font-bold tracking-wide text-[color:var(--text-muted)]">
                <th className="px-2 py-2 text-left">File</th>
                <th className="px-2 py-2 text-left">Type</th>
                <th className="px-2 py-2 text-left">Category</th>
                <th className="px-2 py-2 text-left">Source</th>
                <th className="px-2 py-2 text-left">Status</th>
                <th className="px-2 py-2 text-left">Hint</th>
                <th className="px-2 py-2 text-left">Capabilities</th>
                <th className="px-2 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => {
                const def = FORMAT_DEFINITIONS[file.format];
                const mode = viewerModeForSpatialFile(file);
                const caps: ReactNode[] = [];
                if (def.webViewReady && file.format !== "3DTILES") {
                  caps.push(
                    <Badge key="dv" variant="success" size="compact">
                      Direct view
                    </Badge>,
                  );
                }
                if (def.needsConversion) {
                  caps.push(
                    <Badge key="nc" variant="warning" size="compact">
                      Conversion
                    </Badge>,
                  );
                }
                if (formatUsesApsModelDerivative(file.format)) {
                  caps.push(
                    <Badge key="aps-req" variant="warning" size="compact">
                      APS translation
                    </Badge>,
                  );
                  caps.push(
                    <Badge key="aps-out" variant="neutral" size="compact">
                      {apsTranslationTargetLabel()}
                    </Badge>,
                  );
                }
                if (file.aps?.translationStatus === "succeeded") {
                  caps.push(
                    <Badge key="aps-done" variant="success" size="compact">
                      SVF2 ready
                    </Badge>,
                  );
                }
                if (file.format === "3DTILES") {
                  caps.push(
                    <Badge key="tiles-web" variant="success" size="compact">
                      Web ready
                    </Badge>,
                  );
                  caps.push(
                    <Badge key="tiles-3d" variant="primary" size="compact">
                      Geo 3D
                    </Badge>,
                  );
                }
                if (caps.length === 0) {
                  caps.push(
                    <span key="na" className="text-[length:var(--text-2xs)] text-[color:var(--text-subtle)]">
                      —
                    </span>,
                  );
                }

                return (
                  <tr
                    key={file.id}
                    className="border-b border-[color:var(--border-subtle)] last:border-0 hover:bg-[color:var(--surface-muted)]"
                  >
                    <td className="align-top px-2 py-2 font-semibold text-[color:var(--text)]">{file.fileName}</td>
                    <td className="align-top px-2 py-2 text-[color:var(--text-muted)]">{def.label}</td>
                    <td className="align-top px-2 py-2">
                      <CategoryBadge category={file.category} />
                    </td>
                    <td className="max-w-[180px] align-top px-2 py-2">
                      {file.source ? (
                        <span
                          className="break-all font-mono text-[length:var(--text-2xs)] text-[color:var(--text-muted)]"
                          title={file.source}
                        >
                          {file.source.length > 40 ? `${file.source.slice(0, 40)}…` : file.source}
                        </span>
                      ) : (
                        <span className="text-[color:var(--text-subtle)]">—</span>
                      )}
                    </td>
                    <td className="align-top px-2 py-2">
                      <div className="flex flex-col gap-0.5">
                        <StatusBadge status={file.status} />
                        {file.statusNote ? (
                          <span className="text-[length:var(--text-2xs)] text-[color:var(--text-muted)]">
                            {file.statusNote}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="align-top px-2 py-2">
                      <Badge variant="neutral" size="compact">
                        {file.viewModeRecommendation}
                      </Badge>
                    </td>
                    <td className="align-top px-2 py-2">
                      <div className="flex flex-wrap gap-0.5">{caps}</div>
                    </td>
                    <td className="align-top px-2 py-2 text-right">
                      <Button href={buildViewerHref(projectId, mode, file.id)} variant="primary" size="sm">
                        Viewer
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
