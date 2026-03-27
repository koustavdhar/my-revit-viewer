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
- Toolbar actions are UI-only (not yet bound to real camera/selection SDK actions)
- Auth is frontend-only demo auth (not production secure)

## What is real right now

- Next.js app structure and routing
- Responsive dashboard/detail/viewer layouts
- Route protection behavior in middleware
- Speckle integration attempt and runtime fallback behavior
- Production build and lint checks

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
