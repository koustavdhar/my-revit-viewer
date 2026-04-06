# Integration roadmap (what is real vs placeholder)

Simple checklist of **what works today**, **what is stubbed**, and **sensible next steps** for APS, Cesium / 3D Tiles, and open BIM (IFC).

---

## What is already real (you can use it)

- **Viewer shell** — BIM / GIS / Combined modes, toolbar, URL `?mode=`, file-based default mode.
- **IFC in the browser** — BIM viewport using **That Open** / **web-ifc** (and related tooling). IFC URL resolution from project + manifest.
- **GIS 2D map** — **Leaflet** + OpenStreetMap + **GeoJSON** fetch and draw; layer list, visibility, fit, labels, feature pick → properties.
- **Combined mode** — BIM + GIS in one workspace with a **prototype manual alignment** (not production georeferencing).
- **Project / registry UI** — Spatial files, upload **detection** (no real upload API), APS-related badges for RVT/DWG, 3D Tiles hints in registry and upload table.
- **3D Tiles (partial)** — Tileset URLs can be **registered** in GIS state and shown in the UI; **no Cesium / no tile streaming** yet—the 2D map does not draw them.
- **Format model** — Logical formats, BIM/GIS/generic families, file router, `FORMAT-SUPPORT.md`.

---

## What is placeholder or mock

- **Backend upload / conversion** — No production pipeline; mock projects and client-side detection only.
- **APS Viewer** — Scaffold only: config, types, **`ApsBimViewportPlaceholder`**, TODOs for token, URN, and viewer init. See `docs/aps-viewer-integration.md`.
- **RVT / DWG viewing** — Not loaded natively; UI explains **APS translation → SVF2** path.
- **Cesium / WebGL globe** — Not integrated; 3D Tiles are prepared in **data model + GIS state** only.
- **KML parser** — Rows may appear; not drawn on the Leaflet map like GeoJSON.
- **GeoTIFF / terrain** — Listed as **Terrain Layer**; no COG / hillshade / terrain engine in the map yet.
- **Generic meshes (glTF / OBJ / FBX)** — Formats exist in the model; **no dedicated viewer path** in the shell beyond future plans (often BIM slot conceptually).
- **Speckle** — `modelUrl` and integration notes may exist; treat as **integration-specific**, not fully described here.

---

## Next step: APS (Autodesk Platform Services)

1. Add a **server-only** route that returns a short-lived **OAuth access token** (never expose the client secret in the browser).
2. Implement **upload + Model Derivative** (or connect ACC/BIM 360) and store the **encoded SVF2 URN** on the project or file record.
3. Load **APS Viewer** from Autodesk’s distribution, then branch the **BIM adapter** when `bimEngine === "aps"` (and your feature flag).
4. Map APS selection / properties into the same **BIM properties** shape the right panel expects.

**Starting files:** `src/features/integrations/aps/`, `viewer-adapters.tsx` (`renderBimViewport`).

---

## Next step: Cesium / 3D Tiles

1. Choose where the 3D view lives: **replace** the Leaflet center for GIS-only 3D projects, **split** the center (map + globe), or a **tab** inside GIS mode.
2. Initialize **CesiumJS** (or similar), consume **`tilesetUrl`** from `GisMapLayerPayload` / `useGisViewerState`.
3. Add real tileset load in **`useGisViewerState`** (fetch `tileset.json`, error handling, progress).
4. Align **camera / coordinates** with the BIM manual alignment or future georeferencing.

**Starting files:** `use-gis-viewer-state.ts`, `viewer-adapters.tsx` (`renderGisViewport`), `gis-types.ts`.

---

## Next step: IFC / open BIM

1. **Hardening** — Error states, large models, loading UX, optional worker / CDN tuning for **web-ifc** / fragments.
2. **Properties & selection** — Deeper integration with your Psets, classifications, and filters if the product requires it.
3. **IFC authoring loop** — Document recommended export settings from Revit / other tools into IFC for this viewer.
4. **Coexistence with APS** — Clear rules: when to show IFC (open BIM) vs SVF2 (APS) per project or per file.

**Starting files:** `bim-ifc-viewport`, `resolve-bim-viewport-url.ts`, `viewer-adapters.tsx`.

---

## Related docs

| Doc | Topic |
|-----|--------|
| `VIEWER-ARCHITECTURE.md` | Shell, adapters, BIM / GIS / Combined |
| `FORMAT-SUPPORT.md` | Types, BIM vs GIS, direct view vs conversion |
| `docs/aps-viewer-integration.md` | APS flow (upload → derivative → URN → viewer) |
| `docs/combined-review-mode.md` | Combined workspace behavior |
| `docs/bim-local-testing.md` | Local IFC testing |
