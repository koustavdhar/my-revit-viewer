import type { ViewerProject } from "@/features/viewer/types";
import {
  deriveGeoJsonUrlFromSpatialFiles,
  deriveIfcUrlFromSpatialFiles,
  getProjectSpatialFiles,
  spatialFilesToViewerSourceFiles,
} from "@/features/projects/project-spatial-file";
import { myProjects, projects, sampleProjects } from "@/features/projects/mock-projects";

export { projects };
export { myProjects, sampleProjects };
export type { MockProject } from "@/features/projects/mock-projects";
export type { ProjectSpatialFile, SpatialFileApsMeta } from "@/features/projects/project-spatial-file";
export {
  buildViewerHref,
  getProjectSpatialFiles,
  legacySpatialFilesFromSourceFiles,
  recommendedSceneModeFromSpatialFiles,
  spatialFilesToViewerSourceFiles,
} from "@/features/projects/project-spatial-file";
export {
  detectSpatialUploadFromFileName,
  extractFileExtension,
  inferLogicalFormatForUpload,
  SPATIAL_UPLOAD_MVP_VIEWER_FORMATS,
  SPATIAL_UPLOAD_STATUS_LABELS,
  supportedSpatialUploadExtensionsSummary,
} from "@/features/projects/spatial-upload-format-rules";
export type {
  SpatialUploadCategory,
  SpatialUploadDetection,
  SpatialUploadWorkflowStatus,
} from "@/features/projects/spatial-upload-format-rules";

export function getProjectById(projectId: string) {
  return projects.find((item) => item.id === projectId);
}

export function toViewerProject(project: (typeof projects)[number]): ViewerProject {
  const spatial = getProjectSpatialFiles(project);
  const sourceFiles = spatialFilesToViewerSourceFiles(spatial);

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
    contentKind: project.contentKind ?? "bim",
    geoJsonUrl: project.geoJsonUrl ?? deriveGeoJsonUrlFromSpatialFiles(spatial),
    ifcUrl: project.ifcUrl ?? deriveIfcUrlFromSpatialFiles(spatial),
    bimEngine: project.bimEngine,
    sourceFiles,
  };
}

export function getMyProjects() {
  return myProjects;
}

export function getSampleProjects() {
  return sampleProjects;
}
