"use client";

import { sampleElements, viewerTools } from "@/components/viewer/dummy-data";
import { ViewerProvider } from "@/components/viewer/provider";

export function useSpeckleViewerProvider(): ViewerProvider {
  // TODO (future): replace dummy values with real Speckle SDK state.
  // Suggested steps:
  // 1) Initialize Speckle viewer in `model-viewer-container`.
  // 2) Fetch model/object data from Speckle stream.
  // 3) Map Speckle object selection to selectedElement.
  // 4) Wire toolbar actions to Speckle camera controls.

  return {
    tools: viewerTools,
    activeTool: viewerTools[0],
    elements: sampleElements,
    selectedElement: sampleElements[0],
    setActiveTool: () => {
      // TODO (future): apply tool changes in Speckle viewer.
    },
    selectElementById: () => {
      // TODO (future): select/highlight element in Speckle viewer.
    },
  };
}
