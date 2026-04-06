"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { GeoJsonObject } from "geojson";
import { buildGisLayerSpecs, type GisLayerSpec } from "@/features/viewer/gis/build-gis-layer-specs";
import type { GisLayerPanelRow, GisMapLayerPayload, GisStatusSummary } from "@/features/viewer/gis/gis-types";
import type { ViewerProject } from "@/features/viewer/types";

/** Light check for tileset URLs (Cesium will validate for real). */
function isPlausibleTilesetUrl(url: string): boolean {
  const u = url.trim().toLowerCase();
  if (!u) return false;
  if (!(u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/"))) return false;
  return u.includes("tileset") || u.endsWith(".json");
}

type InternalLayer = {
  spec: GisLayerSpec;
  visible: boolean;
  status: "loading" | "ready" | "error" | "unsupported";
  data: GeoJsonObject | null;
  tilesetUrl: string | null;
  tilesetRegistered: boolean;
  errorMessage?: string;
};

function canLoadGeojson(spec: GisLayerSpec): boolean {
  return spec.format === "GEOJSON" && !!spec.url?.trim();
}

function canRegister3dTiles(spec: GisLayerSpec): boolean {
  return spec.format === "3DTILES" && !!spec.url?.trim();
}

export function useGisViewerState(project: ViewerProject, refreshTick: number) {
  const specs = useMemo(() => buildGisLayerSpecs(project), [project]);
  const [byId, setById] = useState<Record<string, InternalLayer>>({});
  const [zoomTargetId, setZoomTargetId] = useState<string | null>(null);

  useEffect(() => {
    setZoomTargetId(null);
  }, [refreshTick]);

  useEffect(() => {
    const initial: Record<string, InternalLayer> = {};
    for (const spec of specs) {
      if (canLoadGeojson(spec)) {
        initial[spec.id] = {
          spec,
          visible: true,
          status: "loading",
          data: null,
          tilesetUrl: null,
          tilesetRegistered: false,
        };
      } else if (canRegister3dTiles(spec)) {
        const url = spec.url!.trim();
        initial[spec.id] = {
          spec,
          visible: true,
          status: "ready",
          data: null,
          tilesetUrl: url,
          tilesetRegistered: isPlausibleTilesetUrl(url),
        };
      } else {
        initial[spec.id] = {
          spec,
          visible: false,
          status: "unsupported",
          data: null,
          tilesetUrl: null,
          tilesetRegistered: false,
        };
      }
    }
    setById(initial);

    let cancelled = false;

    async function loadGeoJson(spec: GisLayerSpec) {
      if (!canLoadGeojson(spec) || !spec.url) return;
      try {
        const res = await fetch(spec.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as GeoJsonObject;
        if (cancelled) return;
        setById((prev) => ({
          ...prev,
          [spec.id]: {
            ...prev[spec.id],
            status: "ready",
            data,
            errorMessage: undefined,
          },
        }));
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "Failed to load";
        console.warn("[useGisViewerState] GeoJSON load failed", spec.url, e);
        setById((prev) => ({
          ...prev,
          [spec.id]: {
            ...prev[spec.id],
            status: "error",
            data: null,
            visible: false,
            errorMessage: msg,
          },
        }));
      }
    }

    for (const spec of specs) {
      if (canLoadGeojson(spec)) void loadGeoJson(spec);
    }

    return () => {
      cancelled = true;
    };
  }, [specs, project.id, refreshTick]);

  const setLayerVisible = useCallback((id: string, visible: boolean) => {
    setById((prev) => {
      const row = prev[id];
      if (!row) return prev;
      if (row.spec.format === "3DTILES" && row.status === "ready") {
        return { ...prev, [id]: { ...row, visible } };
      }
      if (row.status === "ready" && row.data) {
        return { ...prev, [id]: { ...row, visible } };
      }
      return prev;
    });
  }, []);

  const requestZoomToLayer = useCallback((id: string) => {
    setById((prev) => {
      const row = prev[id];
      if (row?.status === "ready" && row.data) {
        return { ...prev, [id]: { ...row, visible: true } };
      }
      if (row?.spec.format === "3DTILES" && row.status === "ready") {
        return { ...prev, [id]: { ...row, visible: true } };
      }
      return prev;
    });
    setZoomTargetId(id);
  }, []);

  const clearZoomTarget = useCallback(() => {
    setZoomTargetId(null);
  }, []);

  const panelRows: GisLayerPanelRow[] = useMemo(() => {
    return specs.map((spec) => {
      const row = byId[spec.id];
      if (!row) {
        return {
          id: spec.id,
          displayName: spec.displayName,
          format: spec.format,
          layerKind: spec.layerKind,
          visible: false,
          canRenderOnMap: false,
          loadState: "loading" as const,
          tilesetUrl: null,
          tilesetRegistered: false,
        };
      }
      const canRenderOnMap = row.status === "ready" && !!row.data && spec.format === "GEOJSON";
      return {
        id: spec.id,
        displayName: spec.displayName,
        format: spec.format,
        layerKind: spec.layerKind,
        visible: row.visible,
        canRenderOnMap,
        loadState: row.status,
        errorMessage: row.errorMessage,
        tilesetUrl: row.tilesetUrl,
        tilesetRegistered: row.tilesetRegistered,
      };
    });
  }, [specs, byId]);

  const mapLayers: GisMapLayerPayload[] = useMemo(() => {
    return specs.map((spec, colorIndex) => {
      const row = byId[spec.id];
      const geoReady = row?.status === "ready" && row.data && spec.format === "GEOJSON";
      return {
        id: spec.id,
        name: spec.displayName,
        visible: !!row?.visible && !!geoReady,
        colorIndex,
        layerKind: spec.layerKind,
        geojson: geoReady ? row!.data! : null,
        tilesetUrl: row?.status === "ready" && spec.format === "3DTILES" ? row.tilesetUrl : null,
      };
    });
  }, [specs, byId]);

  const statusSummary: GisStatusSummary = useMemo(() => {
    const expectedGeoJsonLayerCount = specs.filter((s) => canLoadGeojson(s)).length;
    const isLoadingLayers = panelRows.some((r) => r.loadState === "loading");
    const failed = panelRows.filter((r) => r.loadState === "error");
    const loadedGeoJsonLayerCount = panelRows.filter(
      (r) => r.format === "GEOJSON" && r.loadState === "ready",
    ).length;
    const registered3dTilesCount = panelRows.filter(
      (r) => r.format === "3DTILES" && r.loadState === "ready" && r.tilesetRegistered,
    ).length;
    const pending3dTilesUrlCount = panelRows.filter(
      (r) => r.format === "3DTILES" && r.loadState === "unsupported",
    ).length;
    const terrainLayerCount = panelRows.filter((r) => r.format === "GEOTIFF").length;

    return {
      isLoadingLayers,
      hasNoManifest: specs.length === 0,
      hasLayerLoadError: failed.length > 0,
      failedLayerCount: failed.length,
      loadedGeoJsonLayerCount,
      expectedGeoJsonLayerCount,
      registered3dTilesCount,
      pending3dTilesUrlCount,
      terrainLayerCount,
    };
  }, [specs, panelRows]);

  return {
    panelRows,
    mapLayers,
    statusSummary,
    setLayerVisible,
    requestZoomToLayer,
    zoomTargetId,
    clearZoomTarget,
    hasAnyGisSpec: specs.length > 0,
  };
}
