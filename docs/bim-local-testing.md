# BIM / IFC local testing

The BIM viewport uses **That Open** (`@thatopen/components`) and loads IFC files with `fetch()`. This page explains how to test that path on your machine.

## Where the dev sample file goes

| Path | Purpose |
|------|---------|
| `public/bim/sample.ifc` | Optional **local dev** IFC. Served at **`/bim/sample.ifc`**. |

The repo does **not** commit a real `.ifc` binary (they are large). Add your own file:

1. Copy any `.ifc` you are allowed to use into `public/bim/`.
2. Name it **`sample.ifc`** (exact name) **or** configure the project instead (see below).

Also keep **`public/bim/fragments-worker.mjs`** (Fragments worker) as provided by the project setup.

## How resolution works

`resolveBimViewportUrl()` (see `src/features/viewer/bim/resolve-bim-viewport-url.ts`) picks a URL in this order:

1. **Project IFC** — `project.ifcUrl`, or the first `sourceFiles[]` row with `format: "IFC"` and a `url`.
2. **Development fallback** — if nothing is configured and `NODE_ENV === "development"` and the dev sample is **not** disabled, the viewer loads **`/bim/sample.ifc`** (`BIM_DEV_SAMPLE_RELATIVE_PATH`).
3. **Otherwise** — no URL; the viewport shows an **empty state** (same as production when no IFC is configured).

## Swap or replace the sample

- **Replace the dev file only:** overwrite `public/bim/sample.ifc` with another IFC (keep the filename).
- **Use a specific URL per project:** set `ifcUrl` on the mock project or add an IFC row in `sourceFiles` with `url` (see `src/features/projects/mock-projects.ts`).
- **Match production in dev:** set `NEXT_PUBLIC_BIM_DISABLE_DEV_SAMPLE=1` in `.env.local` so the dev sample path is never used.

## How to test model loading

1. Run `npm run dev` and open a viewer route, e.g. `/viewer/p-001` (or any project in BIM / Combined mode).
2. With **no** project IFC URL, in development the app still tries **`/bim/sample.ifc`**.  
   - If the file is **missing**, you should see a clear **error** state and metadata showing **Failed** plus the fetch error.
3. After adding `public/bim/sample.ifc`, refresh the page (or use **Refresh** in the viewer). You should see **Loading…** then **Loaded** and the 3D view.
4. Use **Open IFC** in the viewer chrome to open the same URL/path in a new tab (sanity-check the file is served).

## UI states (what to expect)

- **Empty:** no IFC URL resolved (production, or dev with dev sample disabled and no project URL).
- **Loading:** WASM / worker / IFC fetch and conversion in progress (spinner overlay on the canvas).
- **Loaded:** model visible; toolbar actions enabled.
- **Failed:** error overlay + message; metadata card shows **Failed** and the error text.

The **BIM file metadata** card (under the toolbar) always shows file name, type, source, model source, and loaded status when a load target exists.

## Related code

- `src/features/viewer/bim/resolve-bim-viewport-url.ts` — dev sample + project URL resolution  
- `src/features/viewer/bim/resolve-ifc-url.ts` — project-only IFC URL  
- `src/features/viewer/components/bim/bim-ifc-viewport.tsx` — viewport, overlays, metadata  
- `public/bim/README.md` — short pointer next to the `public` folder  
