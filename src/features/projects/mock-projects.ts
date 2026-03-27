/**
 * Local mock project data for the prototype UI.
 * Replace or fetch from an API later—edit this file to change what you see in the app.
 */

export type MockProject = {
  id: string;
  projectName: string;
  clientName: string;
  location: string;
  discipline: string;
  modelSource: string;
  modelUrl: string;
  status: "Active" | "Review" | "Archived";
  lastUpdated: string;
  description: string;
};

export const projects: MockProject[] = [
  {
    id: "p-001",
    projectName: "Metro Tower East",
    clientName: "UrbanBuild Group",
    location: "Chicago, USA",
    discipline: "Architecture",
    modelSource: "Speckle",
    modelUrl:
      "https://app.speckle.systems/projects/213299ab7d/models/6673443f96",
    status: "Active",
    lastUpdated: "2026-03-22",
    description:
      "High-rise core and shell—linked to Speckle (app.speckle.systems). Open the viewer page to load the embedded model, or use Integration Setup notes to store related links.",
  },
  {
    id: "p-002",
    projectName: "Harbor Medical Center",
    clientName: "Civic Health Partners",
    location: "Seattle, USA",
    discipline: "MEP",
    modelSource: "Local file (Revit)",
    modelUrl: "",
    status: "Review",
    lastUpdated: "2026-03-18",
    description:
      "Campus expansion study model. Model URL not connected yet—placeholder for a file-based or future hosted workflow.",
  },
  {
    id: "p-003",
    projectName: "Northline Transit Hub",
    clientName: "City Infrastructure Office",
    location: "Toronto, Canada",
    discipline: "Structure",
    modelSource: "Autodesk APS (future)",
    modelUrl: "",
    status: "Active",
    lastUpdated: "2026-03-15",
    description:
      "Transit hall and platform coordination. Reserved for a future APS Viewer integration path.",
  },
];
