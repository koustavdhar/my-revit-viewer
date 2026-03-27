import { ElementItem } from "@/features/viewer/types";

export type ViewerProviderState = {
  tools: string[];
  activeTool: string;
  elements: ElementItem[];
  selectedElement: ElementItem;
};

export type ViewerProviderActions = {
  setActiveTool: (tool: string) => void;
  selectElementById: (id: string) => void;
};

export type ViewerProvider = ViewerProviderState & ViewerProviderActions;
