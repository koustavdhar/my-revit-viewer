"use client";

import { useMemo, useState } from "react";
import { sampleElements, viewerTools } from "@/components/viewer/dummy-data";
import { ViewerProvider } from "@/components/viewer/provider";

export function useDummyViewerProvider(): ViewerProvider {
  const [activeTool, setActiveTool] = useState(viewerTools[0]);
  const [selectedElementId, setSelectedElementId] = useState(sampleElements[0].id);

  const selectedElement = useMemo(
    () => sampleElements.find((item) => item.id === selectedElementId) ?? sampleElements[0],
    [selectedElementId],
  );

  function selectElementById(id: string) {
    setSelectedElementId(id);
  }

  return {
    tools: viewerTools,
    activeTool,
    elements: sampleElements,
    selectedElement,
    setActiveTool,
    selectElementById,
  };
}
