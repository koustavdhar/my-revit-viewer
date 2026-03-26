"use client";

import { VIEWER_BACKEND } from "@/components/viewer/config";
import { ViewerProvider } from "@/components/viewer/provider";
import { useDummyViewerProvider } from "@/components/viewer/use-dummy-viewer-provider";

export function useViewerProvider(): ViewerProvider {
  // Keep this hook simple for now: always return dummy provider.
  // Later you can switch behavior by VIEWER_BACKEND.
  const dummyProvider = useDummyViewerProvider();

  if (VIEWER_BACKEND === "speckle") {
    // TODO (future): return useSpeckleViewerProvider() once real integration starts.
    return dummyProvider;
  }

  if (VIEWER_BACKEND === "aps") {
    // TODO (future): return useApsViewerProvider() once real integration starts.
    return dummyProvider;
  }

  return dummyProvider;
}
