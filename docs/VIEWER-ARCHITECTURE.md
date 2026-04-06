# Viewer architecture (BIM + GIS)

This document explains how the unified viewer is put together. You do not need to know every file name to follow the ideas.

---

## What is ViewerShell?

**ViewerShell** is the main client component for the viewer page. It owns:

- **Which scene you are in** — BIM, GIS, or Combined (see below).
- **Shared state** — for example BIM selection, GIS layer visibility, and (in Combined) which side of the properties panel is active.
- **Wiring** — it builds a small **context object** and passes it to the right **adapters** so the center of the screen shows the correct viewport(s).

The shell also:

- Picks a **default scene mode** from the project’s file list (see **file router** in `viewer-file-router.ts`), unless the URL overrides it (`/viewer/[id]?mode=bim|gis|combined`).
- Shows the **toolbar**, **left panels** (BIM model list, GIS layers, or a combined stack), and **right panels** (properties).

**Code entry:** `src/features/viewer/shell/viewer-shell.tsx`.

---

## What are adapters?

**Adapters** are plug-in style modules that all follow the same simple contract: “given the project and bindings, render the center viewport.”

There are two adapters today:

| Adapter | Role |
|--------|------|
| **BIM adapter** | Renders the building-model viewport (IFC via That Open in this repo). |
| **GIS adapter** | Renders the map (Leaflet + OpenStreetMap + GeoJSON layers). |

**Why adapters?** They keep the shell thin. Later you can swap the BIM adapter to APS Viewer, or add a Cesium view next to Leaflet, without rewriting the whole page.

**Types + BIM/GIS render functions (adapters):** `src/features/viewer/shell/viewer-adapters.tsx`  
**Scene mode type:** `src/features/viewer/types.ts` (`SceneMode`)

**Bindings:** The shell passes extra objects called **bindings**:

- **BIM bindings** — selection, sidebar sync, manual alignment (for Combined).
- **GIS bindings** — layer rows, map payloads, fit/zoom/labels, status summary.

Adapters only use the bindings they need; the GIS adapter ignores BIM-only fields and vice versa.

---

## BIM mode

- **Purpose:** Focus on the 3D building model.
- **Center:** BIM adapter (IFC viewport).
- **Typical left column:** BIM model / file info.
- **Typical right column:** BIM element properties when you pick something in the model.

Use this when the user mainly cares about the structure, MEP, or discipline model—not the map.

---

## GIS mode

- **Purpose:** Focus on geospatial context (basemap + vector layers).
- **Center:** GIS adapter (2D Leaflet map).
- **Typical left column:** GIS layer list (visibility, fit to layer).
- **Typical right column:** Properties for a clicked map feature (GeoJSON).

**Note:** GeoJSON is drawn on the map. Other GIS types (e.g. 3D Tiles, GeoTIFF) may appear in the list and status badges but are not fully rendered in Leaflet yet—see `INTEGRATION-ROADMAP.md`.

---

## Combined mode

- **Purpose:** See **BIM and GIS together** in one workspace—useful for coordination, site context, and early “digital twin” style reviews.

**Layout (as implemented):**

- **Left:** One column with **BIM** (model sidebar + manual alignment) stacked above **GIS layers**.
- **Center:** On large screens, a **two-column grid**: BIM adapter (**compact**) and GIS adapter (**compact**) side by side; on small screens they stack vertically.
- **Right:** Unified properties that can show either **BIM** or **GIS** source, with badges so you know what you clicked.

**Alignment today:** Manual alignment (translate / rotate / scale on the BIM root) is a **prototype** for demos. Real products usually rely on **georeferencing** or shared coordinates from authoring tools—not hand-tuned sliders.

**Routing:** If the project’s manifest has both BIM-family and GIS-family files, the file router recommends **Combined** as the default scene mode.

---

## How this connects to data

- **`ViewerProject`** (`src/features/viewer/types.ts`) is the shape the viewer reads: URLs, `sourceFiles`, `bimEngine`, etc.
- **`ProjectSpatialFile`** on the project detail page maps to **`sourceFiles`** when entering the viewer (`toViewerProject` in the projects feature).

For deeper format rules, see **FORMAT-SUPPORT.md**. For what is built vs planned, see **INTEGRATION-ROADMAP.md**.
