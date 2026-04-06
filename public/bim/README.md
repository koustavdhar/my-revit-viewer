# `public/bim/`

Files here are served from the site root under **`/bim/`**.

| File | Notes |
|------|--------|
| `fragments-worker.mjs` | **Required** — That Open Fragments worker (do not remove). |
| `sample.ifc` | **Optional** — Local dev IFC. Not committed; add your own. Loaded in **`npm run dev`** when the project has no IFC URL (unless disabled via env — see `docs/bim-local-testing.md`). |

**Replace the sample model:** overwrite `sample.ifc` with your test IFC (same filename) or set `ifcUrl` / `sourceFiles[].url` on the project instead.

Full testing instructions: **`docs/bim-local-testing.md`**.
