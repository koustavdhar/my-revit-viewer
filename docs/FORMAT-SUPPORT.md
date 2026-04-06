# Format support (logical types)

The app uses **logical formats** (not every possible file extension in the world). Definitions live in code:

`src/features/viewer/formats/logical-formats.ts`

Each format has:

- **Family:** BIM, GIS, or Generic 3D (used for routing and badges).
- **Web view ready:** In principle, a browser can show this **without** a server-side translation step (you may still use heavy JavaScript, e.g. a 3D engine).
- **Needs conversion:** In real projects, this type **usually** goes through upload + translation (or tiling) before viewing.

**Important:** “Web view ready” does **not** mean “already implemented in this app.” It means the format is a reasonable candidate for direct web viewing after you wire the right viewer. See **INTEGRATION-ROADMAP.md** for what this repo actually loads today.

---

## Quick reference table

| Format | Family | Label (UI) | Direct view (typical web) | Usually needs conversion |
|--------|--------|------------|---------------------------|---------------------------|
| **RVT** | BIM | Revit | No | Yes |
| **IFC** | BIM | IFC | Yes | No |
| **DWG** | BIM | AutoCAD DWG | No | Yes |
| **GEOJSON** | GIS | GeoJSON | Yes | No |
| **KML** | GIS | KML | Yes | No |
| **GEOTIFF** | GIS | GeoTIFF | No | Yes |
| **3DTILES** | GIS | 3D Tiles | Yes (with a 3D engine) | No |
| **GLTF** | Generic | glTF / GLB | Yes | No |
| **OBJ** | Generic | Wavefront OBJ | Yes | No |
| **FBX** | Generic | Autodesk FBX | No | Yes |

**Extensions (filename hints):**

- RVT: `.rvt`
- IFC: `.ifc`, `.ifczip`
- DWG: `.dwg`
- GeoJSON: `.geojson`
- KML: `.kml`, `.kmz`
- GeoTIFF: `.tif`, `.tiff`, `.geotiff`
- 3D Tiles: often `tileset.json` (special case in upload detection; not every `.json` is 3D Tiles)
- glTF: `.gltf`, `.glb`
- OBJ: `.obj`
- FBX: `.fbx`

---

## BIM vs GIS vs Generic

- **BIM** — Building / CAD discipline models (Revit, IFC, DWG as sources).
- **GIS** — Geospatial layers (vectors, imagery, 3D tiles).
- **Generic 3D** — Meshes that are not classified as BIM or GIS in this app (glTF, OBJ, FBX). The **BIM** viewport slot is often reused until a dedicated mesh workflow exists.

The **file router** uses families to suggest **BIM**, **GIS**, or **Combined** mode (BIM + GIS together).

---

## APS (RVT / DWG) note

RVT and DWG are **BIM** and usually need **Autodesk Platform Services**: upload → **Model Derivative** → **SVF2** → APS Viewer. The UI may show **Requires APS translation** and **Target output: SVF2** for those types. Details: `docs/aps-viewer-integration.md`.

---

## Upload prototype (project detail)

The spatial upload zone uses extra rules for **workflow labels** (e.g. “Ready to View” vs “Requires Conversion” for *this* prototype). That logic is in:

`src/features/projects/spatial-upload-format-rules.ts`

It aligns with the table above but also encodes product choices (e.g. which formats the MVP viewer opens without a backend).
