export type ViewerProject = {
  id: string;
  name: string;
  client: string;
  location: string;
  status: string;
  lastUpdated: string;
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
