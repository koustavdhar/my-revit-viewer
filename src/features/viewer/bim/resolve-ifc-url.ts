import type { ViewerProject } from "@/features/viewer/types";

/**
 * Resolve the IFC file URL for the viewer: explicit `ifcUrl` wins, else first `sourceFiles`
 * row with format IFC and a `url` (same pattern as GeoJSON).
 */
export function resolveIfcUrl(project: ViewerProject): string | null {
  const direct = project.ifcUrl?.trim();
  if (direct) return direct;

  for (const f of project.sourceFiles ?? []) {
    if (f.format === "IFC" && f.url?.trim()) {
      return f.url.trim();
    }
  }
  return null;
}
