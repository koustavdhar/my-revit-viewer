import type { ViewerProject } from "@/features/viewer/types";
import { projects } from "@/features/projects/mock-projects";

export { projects };
export type { MockProject } from "@/features/projects/mock-projects";

export function getProjectById(projectId: string) {
  return projects.find((item) => item.id === projectId);
}

export function toViewerProject(project: (typeof projects)[number]): ViewerProject {
  return {
    id: project.id,
    name: project.projectName,
    client: project.clientName,
    location: project.location,
    status: project.status,
    lastUpdated: project.lastUpdated,
    modelUrl: project.modelUrl,
    modelSource: project.modelSource,
    discipline: project.discipline,
  };
}
