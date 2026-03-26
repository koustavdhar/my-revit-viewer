export type Project = {
  id: string;
  name: string;
  client: string;
  location: string;
  status: "Active" | "Review" | "Archived";
  lastUpdated: string;
  modelCount: number;
};

export const projects: Project[] = [
  {
    id: "p-001",
    name: "Metro Tower East",
    client: "UrbanBuild Group",
    location: "Chicago, USA",
    status: "Active",
    lastUpdated: "2026-03-20",
    modelCount: 4,
  },
  {
    id: "p-002",
    name: "Harbor Medical Center",
    client: "Civic Health Partners",
    location: "Seattle, USA",
    status: "Review",
    lastUpdated: "2026-03-18",
    modelCount: 2,
  },
  {
    id: "p-003",
    name: "Northline Transit Hub",
    client: "City Infrastructure Office",
    location: "Toronto, Canada",
    status: "Active",
    lastUpdated: "2026-03-15",
    modelCount: 3,
  },
  {
    id: "p-004",
    name: "Riverside Convention Center",
    client: "Horizon Development",
    location: "Austin, USA",
    status: "Archived",
    lastUpdated: "2026-03-09",
    modelCount: 5,
  },
];
