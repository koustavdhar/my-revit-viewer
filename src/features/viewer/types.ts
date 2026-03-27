export type ViewerProject = {
  id: string;
  name: string;
  client: string;
  location: string;
  status: string;
  lastUpdated: string;
  /** Speckle stream / model page URL from mock data or API (used by viewer integration). */
  modelUrl?: string;
  modelSource?: string;
  discipline?: string;
};

export type ElementItem = {
  id: string;
  category: string;
  family: string;
  type: string;
  level: string;
  material: string;
};

export type TreeGroup = {
  level: string;
  categories: {
    name: string;
    elements: ElementItem[];
  }[];
};
