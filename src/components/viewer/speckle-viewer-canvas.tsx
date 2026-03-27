"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui";

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
  const statusCallbackRef = useRef(onStatusChange);
  const [state, setState] = useState<ViewState>("loading");
  const [fallbackReason, setFallbackReason] = useState<string | null>(null);

  useEffect(() => {
    statusCallbackRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !modelUrl.trim()) {
      setState("fallback");
      setFallbackReason("No model URL configured for this project.");
      statusCallbackRef.current?.("fallback", "No model URL configured for this project.");
      return;
    }

    let cancelled = false;
    setState("loading");
    setFallbackReason(null);
    statusCallbackRef.current?.("loading", null);

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
          statusCallbackRef.current?.("fallback", reason);
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
        statusCallbackRef.current?.("embedded", null);
      } catch (err) {
        console.error("[Speckle viewer]", err);
        if (!cancelled) {
          const reason = getFriendlySpeckleErrorMessage(err, {
            modelUrl,
            hasToken: !!authToken,
          });
          setFallbackReason(reason);
          setState("fallback");
          statusCallbackRef.current?.("fallback", reason);
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
  }, [modelUrl, authToken, refreshKey]);

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
    <div className="relative min-h-[620px] w-full overflow-hidden rounded-md border border-slate-200 bg-slate-950">
      {/* WebGL canvas mounts here — @speckle/viewer LegacyViewer attaches its canvas inside this div. */}
      <div ref={containerRef} className="h-full min-h-[620px] w-full" />

      {state === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-900/40">
          <div className="rounded-md border border-white/10 bg-slate-900/90 px-4 py-3 text-center shadow-lg">
            <p className="label-eyebrow text-white">Loading</p>
            <p className="mt-1 text-sm font-medium text-white">Preparing Speckle model</p>
            <p className="mt-1 max-w-sm text-xs text-slate-300">
              Resolving URL and streaming geometry. This can take a moment on first load.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function getFriendlySpeckleErrorMessage(
  err: unknown,
  context: { modelUrl: string; hasToken: boolean },
) {
  const base = err instanceof Error ? err.message : "Viewer could not load this model.";
  const lower = base.toLowerCase();
  const isSpeckleAppUrl = context.modelUrl.includes("app.speckle.systems/projects/");

  // Common case for private or restricted models from the new Speckle app URL format.
  if (lower.includes("query failed") || lower.includes("could not get object urls")) {
    if (isSpeckleAppUrl && !context.hasToken) {
      return "Speckle could not resolve this model for embedding (Query failed). This is commonly a permissions issue. Add NEXT_PUBLIC_SPECKLE_TOKEN in .env.local (or Vercel env) and try Refresh viewer.";
    }
    return "Speckle could not resolve this model for embedding (Query failed). The link may be private, permission-restricted, or not directly embeddable yet. Use Open in source platform, or provide a token and retry.";
  }

  if (lower.includes("401") || lower.includes("403") || lower.includes("unauthorized")) {
    return "Access denied while loading model. Check your Speckle permissions and token configuration.";
  }

  return base;
}

export function SpeckleAppIframeEmbed({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="flex min-h-[620px] flex-col overflow-hidden rounded-md border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-2.5 py-1.5">
        <p className="text-[11px] font-medium text-slate-600">
          Speckle app embed mode (project/model URL)
        </p>
        <a
          href={modelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium text-slate-700 underline"
        >
          Open in new tab
        </a>
      </div>

      {/* For app.speckle.systems model links, iframe preview is the most stable beginner path. */}
      <iframe
        title="Speckle model preview"
        src={modelUrl}
        className="h-[620px] w-full bg-white"
        loading="lazy"
      />
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
    <div className="flex min-h-[620px] flex-col rounded-md border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="label-eyebrow text-slate-600">Error</p>
        <p className="mt-1 text-base font-medium text-slate-800">Model preview unavailable</p>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          {message ??
            "Embedded viewer is not available for this link. Open the model on Speckle in a new tab, or paste a valid stream/commit URL in mock data."}
        </p>
        {modelUrl.trim() ? (
          <Button
            href={modelUrl}
            variant="primary"
            size="sm"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4"
          >
            Open model in new tab
          </Button>
        ) : (
          <p className="mt-4 text-xs text-slate-500">Add a `modelUrl` in `src/lib/mock-projects.ts`.</p>
        )}
      </div>
      <p className="mt-3 text-center text-[11px] text-slate-400">
        Future: full embed uses @speckle/viewer above; private streams need a token from your backend.
      </p>
    </div>
  );
}
