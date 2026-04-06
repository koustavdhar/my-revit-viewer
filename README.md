# My Revit Viewer (Prototype)

A beginner-friendly, read-only AEC web app prototype built with Next.js.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` (or the port shown in terminal).

## Current prototype status

- Professional frontend pages are in place (landing, login, dashboard, project detail, viewer, integration setup).
- Read-only viewer workspace UI is implemented (left info panel, toolbar, model area, model tree, properties panel).
- Simple prototype auth is implemented (cookie + route protection via middleware).
- Project data is local mock data for safe prototyping.
- Speckle embed path is partially real:
  - tries `@speckle/viewer` for compatible Speckle model URLs
  - includes robust fallback panel with "Open in source platform"

## What is mock right now

- Project list and project metadata (`src/features/projects/mock-projects.ts`)
- Viewer model tree and property inspection data (`src/components/viewer/dummy-data.ts`)
- Top viewer toolbar actions remain UI-only (BIM fit/isolate/reset are wired to the IFC viewport)
- Auth is frontend-only demo auth (not production secure)

## What is real right now

- Next.js app structure and routing
- Responsive dashboard/detail/viewer layouts
- Route protection behavior in middleware
- Speckle integration attempt and runtime fallback behavior
- **BIM IFC viewport** (That Open + `web-ifc`): load, pick, properties, fit / isolate / reset — see **`docs/bim-local-testing.md`** for local sample file location and testing
- Production build and lint checks

### BIM / IFC quick test

- **Dev sample path:** add your own `public/bim/sample.ifc` (not committed). In `npm run dev`, projects **without** an IFC URL still try to load `/bim/sample.ifc` so you can test without editing mock data.
- **Project-driven URL:** set `ifcUrl` or an IFC `sourceFiles[].url` (see `mock-projects.ts`).
- **Docs:** **`docs/bim-local-testing.md`** — swap sample, env flag `NEXT_PUBLIC_BIM_DISABLE_DEV_SAMPLE`, empty/loading/error states.
- **Combined mode:** BIM + GIS in one workspace (see **`docs/combined-review-mode.md`**) — shared toolbar and panels; alignment is **prototype-only** until georeferencing is implemented.

## Folder structure (scaling-focused)

- `src/features/projects/` project domain data + helpers
- `src/features/viewer/` viewer-facing structure (components/providers/data/types entry points)
- `src/config/` integration/backend configuration
- `src/app/` pages and routes
- `src/components/` shared and legacy-compatible component locations

## Environment setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Only fill values you need (for example `NEXT_PUBLIC_SPECKLE_TOKEN` for private stream testing).

## What needs to be added next for production

- Real backend authentication/session management
- Secure token exchange endpoints (Speckle and/or APS)
- Real data store (projects/users/permissions) instead of local mock file
- Production logging, monitoring, and error reporting
- Role-based access control and API authorization
- Viewer tools wired to real SDK camera/selection APIs

See `NEXT-STEPS.md` for simple beginner guidance on Speckle and APS roadmap.
