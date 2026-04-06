"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Feature, FeatureCollection, GeoJsonObject } from "geojson";
import type { GisFeaturePick, GisMapLayerPayload } from "@/features/viewer/gis/gis-types";
import "leaflet/dist/leaflet.css";
import { EmptyState } from "@/components/ui";

/* Layer stroke/fill — aligned with globals semantic + primary accent */
const PALETTE = [
  { color: "#4f46e5", fill: "#6366f1", fillOpacity: 0.22 },
  { color: "#059669", fill: "#10b981", fillOpacity: 0.2 },
  { color: "#d97706", fill: "#f59e0b", fillOpacity: 0.2 },
  { color: "#0d9488", fill: "#2dd4bf", fillOpacity: 0.2 },
  { color: "#e11d48", fill: "#fb7185", fillOpacity: 0.2 },
];

const DEFAULT_CENTER: L.LatLngTuple = [41.882, -87.615];
const DEFAULT_ZOOM = 13;

function stableFeatureId(feature: Feature, layerId: string, index: number): string {
  const p = feature.properties as Record<string, unknown> | null | undefined;
  if (feature.id !== undefined && feature.id !== null) return String(feature.id);
  if (p?.parcel_id != null) return String(p.parcel_id);
  if (p?.id != null) return String(p.id);
  if (p?.name != null) return `${layerId}-${String(p.name)}`;
  return `${layerId}-f-${index}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pickLabelText(feature: Feature): string {
  const p = feature.properties as Record<string, unknown> | null | undefined;
  if (!p) return "Feature";
  for (const key of ["name", "parcel_id", "id", "title"] as const) {
    const v = p[key];
    if (v != null && String(v).trim() !== "") return String(v);
  }
  return "Feature";
}

type GisMapCanvasProps = {
  layers: GisMapLayerPayload[];
  zoomTargetId: string | null;
  onZoomComplete: () => void;
  onFeatureClick: (pick: GisFeaturePick) => void;
  compact?: boolean;
  labelsEnabled: boolean;
  fitAllTrigger: number;
  resetViewTrigger: number;
  /** Full-screen style overlay before any GeoJSON is ready. */
  showBlockingLoadOverlay: boolean;
  /** Thin progress hint when some layers are ready but others still loading. */
  showPartialLoadBar: boolean;
  /** Tilesets registered in state but not drawable on Leaflet (3D Tiles path). */
  registered3dTilesCount: number;
};

export default function GisMapCanvas({
  layers,
  zoomTargetId,
  onZoomComplete,
  onFeatureClick,
  compact,
  labelsEnabled,
  fitAllTrigger,
  resetViewTrigger,
  showBlockingLoadOverlay,
  showPartialLoadBar,
  registered3dTilesCount,
}: GisMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoGroupRef = useRef<L.LayerGroup | null>(null);
  const labelsGroupRef = useRef<L.LayerGroup | null>(null);
  const didInitialFitRef = useRef(false);
  const onPickRef = useRef(onFeatureClick);

  useEffect(() => {
    onPickRef.current = onFeatureClick;
  }, [onFeatureClick]);

  const drawable = layers.filter((l) => l.visible && l.geojson);
  const hasDrawable = drawable.length > 0;
  const hasAnyGeoJsonData = layers.some((l) => l.geojson);
  /*
   * 3D Tiles payloads carry `tilesetUrl` for a future Cesium (or similar) viewport.
   * Leaflet only iterates `geojson`; tileset URLs are for a future 3D engine (`useGisViewerState`).
   */
  const hasRegistered3dOnly = registered3dTilesCount > 0 && !hasAnyGeoJsonData;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    didInitialFitRef.current = false;
    const map = L.map(el, { zoomControl: true }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const geo = L.layerGroup().addTo(map);
    const labels = L.layerGroup().addTo(map);
    mapRef.current = map;
    geoGroupRef.current = geo;
    labelsGroupRef.current = labels;

    return () => {
      geo.clearLayers();
      labels.clearLayers();
      map.remove();
      mapRef.current = null;
      geoGroupRef.current = null;
      labelsGroupRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const geo = geoGroupRef.current;
    const labels = labelsGroupRef.current;
    if (!map || !geo || !labels) return;

    geo.clearLayers();
    labels.clearLayers();

    for (const layer of layers) {
      if (!layer.visible || !layer.geojson) continue;
      try {
        const style = PALETTE[layer.colorIndex % PALETTE.length];
        const data = layer.geojson;
        const gj = L.geoJSON(data as GeoJsonObject, {
          style: {
            color: style.color,
            weight: 2,
            fillColor: style.fill,
            fillOpacity: style.fillOpacity,
          },
          onEachFeature: (feature, leafletLayer) => {
            let safeIdx = 0;
            if (data.type === "FeatureCollection") {
              const fc = data as FeatureCollection;
              const i = fc.features.findIndex((f) => f === feature);
              safeIdx = i >= 0 ? i : 0;
            }
            leafletLayer.on("click", (e) => {
              L.DomEvent.stopPropagation(e);
              const props = (feature.properties as Record<string, unknown>) ?? {};
              onPickRef.current({
                layerId: layer.id,
                layerName: layer.name,
                featureId: stableFeatureId(feature as Feature, layer.id, safeIdx),
                properties: props,
              });
            });
          },
        });
        geo.addLayer(gj);

        if (labelsEnabled) {
          gj.eachLayer((sub) => {
            const lyr = sub as L.Layer & { feature?: Feature };
            const feat = lyr.feature;
            if (!feat) return;
            const vector = lyr as L.Polyline;
            const b = vector.getBounds?.();
            if (!b || !b.isValid()) return;
            const c = b.getCenter();
            const text = escapeHtml(pickLabelText(feat));
            const icon = L.divIcon({
              className: "gis-map-label-root",
              html: `<span class="gis-map-label-chip">${text}</span>`,
              iconSize: [1, 1],
              iconAnchor: [0, 0],
            });
            L.marker(c, { icon, interactive: false }).addTo(labels);
          });
        }
      } catch (e) {
        console.warn("[GisMapCanvas] Skipped layer (invalid geometry or Leaflet error)", layer.id, layer.name, e);
      }
    }

    const boundsLayers = geo.getLayers() as L.Layer[];
    if (!didInitialFitRef.current && boundsLayers.length > 0) {
      const fg = L.featureGroup(boundsLayers);
      const b = fg.getBounds();
      if (b.isValid()) {
        map.fitBounds(b, { padding: [24, 24], maxZoom: 16 });
        didInitialFitRef.current = true;
      }
    }
  }, [layers, labelsEnabled]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !zoomTargetId) return;

    const target = layers.find((l) => l.id === zoomTargetId && l.geojson);
    if (!target?.geojson) {
      onZoomComplete();
      return;
    }

    const temp = L.geoJSON(target.geojson as GeoJsonObject);
    const b = temp.getBounds();
    if (b.isValid()) {
      map.fitBounds(b, { padding: [32, 32], maxZoom: 17 });
    }
    onZoomComplete();
  }, [zoomTargetId, layers, onZoomComplete]);

  useEffect(() => {
    if (fitAllTrigger === 0) return;
    const map = mapRef.current;
    const geo = geoGroupRef.current;
    if (!map || !geo) return;
    const boundsLayers = geo.getLayers() as L.Layer[];
    if (boundsLayers.length === 0) return;
    const fg = L.featureGroup(boundsLayers);
    const b = fg.getBounds();
    if (b.isValid()) {
      map.fitBounds(b, { padding: [28, 28], maxZoom: 16 });
    }
  }, [fitAllTrigger]);

  useEffect(() => {
    if (resetViewTrigger === 0) return;
    mapRef.current?.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
  }, [resetViewTrigger]);

  const minH = compact ? "min-h-[240px]" : "min-h-[480px] lg:min-h-[560px]";

  return (
    <div className="relative w-full">
      {showPartialLoadBar ? (
        <div
          className="absolute left-0 right-0 top-0 z-[560] h-0.5 overflow-hidden bg-[color:var(--border)]"
          role="progressbar"
          aria-label="Loading additional layers"
        >
          <div className="h-full w-full origin-left animate-pulse bg-[color:var(--primary)] opacity-60" />
        </div>
      ) : null}

      {showBlockingLoadOverlay ? (
        <div
          className="absolute inset-0 z-[600] flex flex-col items-center justify-center gap-2 border-0 bg-[color:color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 text-center backdrop-blur-[1px]"
          role="status"
          aria-live="polite"
        >
          <div
            className="h-6 w-6 animate-spin rounded-full border-2 border-[color:var(--border)] border-t-[color:var(--primary)]"
            aria-hidden
          />
          <p className="text-[length:var(--text-xs)] font-semibold text-[color:var(--text)]">Initializing GIS layers…</p>
          <p className="max-w-xs text-[length:var(--text-xs)] text-[color:var(--text-muted)]">
            Fetching GeoJSON or registering 3D Tilesets. Large files may take a moment.
          </p>
        </div>
      ) : null}

      {!hasDrawable && !showBlockingLoadOverlay ? (
        <div className="absolute inset-0 z-[500] flex items-center justify-center border border-dashed border-[color:var(--border-strong)] bg-[color:color-mix(in_srgb,var(--surface-muted)_96%,transparent)] p-4">
          <EmptyState
            title="Nothing to display on the map"
            message={
              hasRegistered3dOnly
                ? "One or more 3D Tiles scenes are registered with a URL, but this map is 2D-only (Leaflet). Add a Cesium-style viewport to visualize city-scale 3D tilesets."
                : hasAnyGeoJsonData
                  ? "Turn on visibility for at least one loaded GeoJSON layer in the left list, or use Fit to layers after enabling them."
                  : "Add GeoJSON URLs to this project, or fix failed layers. KML / GeoTIFF rows are listed but not drawn yet."
            }
            className="max-w-sm border-0 bg-transparent py-4 shadow-none"
          />
        </div>
      ) : null}

      <div
        ref={containerRef}
        className={`h-full min-h-0 w-full rounded-none border-0 bg-[color:var(--surface-muted)] ${minH}`}
      />
    </div>
  );
}
