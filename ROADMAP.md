# My Revit Viewer - Roadmap

## What is already built

- Modern Next.js frontend with landing, login, dashboard, project detail, and viewer pages.
- Dummy authentication flow (prototype only):
  - Login sets a cookie.
  - Protected pages redirect to login if not authenticated.
  - Logout clears the cookie.
- Viewer page refactored into reusable components:
  - `ModelViewerShell`
  - `ViewerToolbar`
  - `ProjectInfoPanel`
  - `ModelTreePanel`
  - `PropertiesPanel`
- Viewer provider abstraction added:
  - `ViewerProvider` contract
  - `useDummyViewerProvider` prototype implementation
  - Ready to swap to `SpeckleProvider` or `APSProvider` later
- Placeholder provider hooks scaffolded:
  - `useSpeckleViewerProvider` (TODO-only scaffold)
  - `useApsViewerProvider` (TODO-only scaffold)
- Backend selection config added:
  - `VIEWER_BACKEND` in `src/components/viewer/config.ts`
  - Single switching hook: `useViewerProvider`
- Dummy BIM-like interactions:
  - Toolbar tool selection.
  - Model tree search and hierarchy.
  - Keyboard navigation in tree.
  - Selected element updates property panel.

## What remains to connect a real viewer

- Add a real 3D viewer SDK inside the `model-viewer-container` in `ModelViewerShell`.
- Replace dummy element list with real model elements from the SDK.
- Sync SDK selection events to `PropertiesPanel`.
- Connect toolbar buttons to real SDK camera/actions.
- Replace hardcoded project/model metadata with backend data.

## What would be needed for Speckle integration

- Create a Speckle account and project/stream setup.
- Add Speckle SDK/package to this project.
- Authenticate users with Speckle token flow (secure server-side handling).
- Load model objects from Speckle stream into viewer container.
- Map Speckle object selection data to:
  - model tree
  - properties panel
- Add environment variables for Speckle URLs/tokens in a secure way.

## What would be needed for APS (Autodesk Platform Services) integration

- Create APS app credentials in Autodesk Developer portal.
- Add APS Viewer package and APS auth flow.
- Build backend endpoint(s) for:
  - token generation
  - model URN management
- Load APS Viewer in `model-viewer-container`.
- Wire APS viewer events to:
  - element selection
  - property panel updates
  - isolate/section/reset actions in toolbar
- Add environment variables for APS client ID/secret and keep secrets server-side.

## Recommended next implementation order

1. Pick one platform first (Speckle or APS).
2. Implement secure authentication/token flow for that platform.
3. Mount real viewer in `ModelViewerShell`.
4. Replace dummy model tree/properties with live SDK data.
5. Keep current UI structure and swap data sources gradually.
