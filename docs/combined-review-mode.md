# Combined review mode (BIM + GIS)

## What it is

**Combined** is a single workspace that renders **both** the IFC/BIM viewport and the GIS map at once, with **one** top toolbar, **one** left rail, and **one** properties column. Use it when you want to review building data and geospatial context together (e.g. campus IFC + parcel GeoJSON) without switching scene modes.

## Alignment status (prototype)

This build **does not** align BIM and GIS in real-world coordinates. The banner in the center column states:

- **Prototype alignment** — side-by-side for coordination only.
- **Spatial sync pending** — no shared CRS, no live georeferencing, no camera sync between 3D and map.

## Manual BIM alignment (MVP)

In **Combined** mode, the left rail includes **Manual BIM alignment**: X / Y / Z offset, rotation around the vertical 3D axis, and uniform scale. These values are applied to the **IFC root object** in the Three.js viewer only (not to the map). They are kept in **React state** until refresh or full reload.

Use this to nudge the building visually next to the map until real georeferencing exists.

## Current assumptions

1. **Independent coordinate systems** — IFC is shown in model space; the map uses WGS84 (Leaflet default). No transform is applied between them except the **manual** BIM transform above.
2. **Selection is independent** — Picking on the map does not highlight the same feature in IFC and vice versa.
3. **Active properties source** — The right panel shows **either** BIM element attributes **or** GIS feature attributes. The **active source** follows the last click on the 3D model (BIM) or the map (GIS). If both sides have a selection, use the **BIM** / **GIS** toggles to switch.

## Why true BIM–GIS alignment is a later challenge

Production alignment usually requires some mix of:

- **Georeferencing** the BIM (survey, base point, EPSG code, or embedded geo in IFC).
- **Agreed CRS** between fragments and map tiles.
- **Optional** camera / extent sync, clipping, or draping workflows.

That is intentionally out of scope for this prototype so the UI shell can ship first.

## Related UI code

- `src/features/viewer/shell/viewer-shell.tsx` — scene mode, bindings, combined layout.
- `src/features/viewer/shell/combined-review-left-panel.tsx` — grouped BIM + GIS left rail.
- `src/features/viewer/shell/combined-review-properties-panel.tsx` — unified properties + source toggles.
- `src/features/viewer/shell/combined-alignment-banner.tsx` — prototype disclaimer strip.
