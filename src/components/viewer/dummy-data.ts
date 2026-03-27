import { ElementItem } from "@/features/viewer/types";

export const viewerTools = [
  "Orbit",
  "Pan",
  "Zoom",
  "Section",
  "Isolate",
  "Reset View",
];

export const sampleElements: ElementItem[] = [
  {
    id: "E-10428",
    category: "Wall",
    family: "Basic Wall",
    type: "Exterior - Brick 300mm",
    level: "Level 02",
    material: "Brick / Concrete",
  },
  {
    id: "E-20911",
    category: "Door",
    family: "Single Flush",
    type: "910 x 2134 mm",
    level: "Level 01",
    material: "Wood / Steel",
  },
  {
    id: "E-31002",
    category: "Structural Column",
    family: "Concrete-Rectangular",
    type: "600 x 600 mm",
    level: "Level 03",
    material: "Reinforced Concrete",
  },
  {
    id: "E-44771",
    category: "Duct",
    family: "Rectangular Duct",
    type: "Supply Air",
    level: "Level 04",
    material: "Galvanized Steel",
  },
];
