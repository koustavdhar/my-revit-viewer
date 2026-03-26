"use client";

import { sampleElements, viewerTools } from "@/components/viewer/dummy-data";
import { ViewerProvider } from "@/components/viewer/provider";

export function useApsViewerProvider(): ViewerProvider {
  // TODO (future): replace dummy values with real APS Viewer state.
  // Suggested steps:
  // 1) Get APS access token from backend endpoint.
  // 2) Initialize APS Viewer in `model-viewer-container`.
  // 3) Load model by URN and subscribe to selection events.
  // 4) Map APS properties and selection to selectedElement.
  // 5) Connect toolbar buttons to APS viewer actions.

  return {
    tools: viewerTools,
    activeTool: viewerTools[0],
    elements: sampleElements,
    selectedElement: sampleElements[0],
    setActiveTool: () => {
      // TODO (future): apply tool changes in APS Viewer.
    },
    selectElementById: () => {
      // TODO (future): select/isolate element in APS Viewer.
    },
  };
}
