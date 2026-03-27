"use client";

import { useEffect, useRef, useState } from "react";

type SpeckleViewerCanvasProps = {
  /** Full Speckle web URL (stream, commit, or object page). Resolved to API resource URLs via @speckle/viewer UrlHelper. */
  modelUrl: string;
  /**
   * Optional token for private streams. Set in `.env.local` as NEXT_PUBLIC_SPECKLE_TOKEN for local tests only.
   * Production: prefer a server-side token exchange; do not expose secrets in the client long-term.
   */
  authToken?: string | null;
  refreshKey?: number;
  onStatusChange?: (status: ViewState, reason?: string | null) => void;
};

type ViewState = "loading" | "embedded" | "fallback";

/**
 * Real embedded viewer path using @speckle/viewer (LegacyViewer + UrlHelper.getResourceUrls).
 * If resolution/load fails (bad URL, auth, CORS, or network), we fall back to the preview panel.
 */
export default function SpeckleViewerCanvas({
  modelUrl,
  authToken,
  refreshKey = 0,
  onStatusChange,
}: SpeckleViewerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  /** Holds LegacyViewer instance for resize; set after dynamic import. */
  const viewerRef = useRef<{ resize: () => void; dispose: () => void } | null>(null);
  const [state, setState] = useState<ViewState>("loading");
  const [fallbackReason, setFallbackReason] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !modelUrl.trim()) {
      setState("fallback");
      setFallbackReason("No model URL configured for this project.");
      onStatusChange?.("fallback", "No model URL configured for this project.");
      return;
    }

    let cancelled = false;
    setState("loading");
    setFallbackReason(null);
    onStatusChange?.("loading", null);

    async function loadSpeckleViewer() {
      const mountEl = containerRef.current;
      if (!mountEl) return;

      try {
        // Dynamic import keeps initial bundle smaller and avoids SSR touching WebGL.
        const { LegacyViewer, UrlHelper, DefaultViewerParams } = await import("@speckle/viewer");

        const viewer = new LegacyViewer(mountEl, DefaultViewerParams);

        await viewer.init();
        viewerRef.current = viewer;

        // Resolves a browser/stream URL into one or more REST resource URLs the loader understands.
        const resourceUrls = await UrlHelper.getResourceUrls(modelUrl, authToken ?? undefined);

        if (cancelled) {
          viewer.dispose();
          return;
        }

        if (!resourceUrls.length) {
          const reason =
            "Could not resolve a loadable resource from this URL. Use a valid Speckle stream or commit link.";
          setFallbackReason(reason);
          setState("fallback");
          onStatusChange?.("fallback", reason);
          viewer.dispose();
          viewerRef.current = null;
          return;
        }

        // Loads the root object; token required for private streams.
        await viewer.loadObjectAsync(resourceUrls[0], authToken ?? undefined, true, true);

        if (cancelled) {
          viewer.dispose();
          viewerRef.current = null;
          return;
        }

        viewer.resize();
        setState("embedded");
        onStatusChange?.("embedded", null);
      } catch (err) {
        console.error("[Speckle viewer]", err);
        if (!cancelled) {
          const reason =
            err instanceof Error ? err.message : "Viewer could not load this model.";
          setFallbackReason(reason);
          setState("fallback");
          onStatusChange?.("fallback", reason);
        }
        try {
          viewerRef.current?.dispose();
        } finally {
          viewerRef.current = null;
        }
      }
    }

    loadSpeckleViewer();

    return () => {
      cancelled = true;
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
  }, [modelUrl, authToken, refreshKey, onStatusChange]);

  useEffect(() => {
    function onResize() {
      if (state === "embedded") {
        viewerRef.current?.resize();
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [state]);

  if (state === "fallback") {
    return (
      <ViewerPreviewFallback modelUrl={modelUrl} message={fallbackReason} />
    );
  }

  return (
    <div className="relative min-h-[580px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
      {/* WebGL canvas mounts here — @speckle/viewer LegacyViewer attaches its canvas inside this div. */}
      <div ref={containerRef} className="h-full min-h-[580px] w-full" />

      {state === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/40">
          <div className="rounded-lg border border-white/10 bg-slate-900/90 px-5 py-4 text-center shadow-lg">
            <p className="text-sm font-medium text-white">Loading Speckle model…</p>
            <p className="mt-1 max-w-sm text-xs text-slate-300">
              Resolving URL and streaming geometry. This can take a moment on first load.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function ViewerPreviewFallback({
  modelUrl,
  message,
}: {
  modelUrl: string;
  message: string | null;
}) {
  return (
    <div className="flex min-h-[580px] flex-col rounded-xl border border-dashed border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100/80 p-6">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-lg font-medium text-slate-800">Model preview</p>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          {message ??
            "Embedded viewer is not available for this link. Open the model on Speckle in a new tab, or paste a valid stream/commit URL in mock data."}
        </p>
        {modelUrl.trim() ? (
          <a
            href={modelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6"
          >
            Open model in new tab
          </a>
        ) : (
          <p className="mt-4 text-xs text-slate-500">Add a `modelUrl` in `src/lib/mock-projects.ts`.</p>
        )}
      </div>
      <p className="mt-4 text-center text-[11px] text-slate-400">
        Future: full embed uses @speckle/viewer above; private streams need a token from your backend.
      </p>
    </div>
  );
}
