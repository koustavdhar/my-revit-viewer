# APS Viewer integration (future)

This app can show **Revit (RVT)** and **AutoCAD (DWG)** files in the spatial registry and upload preview, but it does **not** load those formats directly in the browser. The usual **Autodesk Platform Services (APS)** path is:

1. Upload the source file to **Object Storage Service (OSS)** (or connect ACC/BIM 360).
2. Run **Model Derivative** to translate the model to **SVF2** (viewing format for **APS Viewer**).
3. Store the **encoded derivative URN** on your project or file record.
4. Open **APS Viewer** in the page with a **short-lived access token** and that URN.

This document is a beginner-friendly map of that flow. The codebase only includes a **scaffold** — no production APS auth or translation yet.

---

## Where the scaffold lives

| Location | Purpose |
|----------|---------|
| `src/features/integrations/aps/aps-config.ts` | Feature flag (`APS_VIEWER_FRONTEND_ENABLED`), SVF2 constant |
| `src/features/integrations/aps/aps-types.ts` | Placeholder TypeScript types (token, URNs, job status) |
| `src/features/integrations/aps/aps-config.ts` | Flags, SVF2 constant, `formatUsesApsModelDerivative()` |
| `src/features/integrations/aps/aps-bim-viewer-adapter.placeholder.tsx` | **TODO blocks** for token, URN, and viewer init |
| `src/features/viewer/shell/viewer-adapters.tsx` | `renderBimViewport` — IFC today; branch here for APS later |

---

## End-to-end flow (what you will build later)

### 1. Upload the source file

- Your **backend** receives the file (multipart upload or signed URL to OSS).
- APS stores the object and returns identifiers you keep in your database (bucket key, object URN, etc.).

### 2. Translate with Model Derivative

- Your backend registers a **translation job** targeting **SVF2** (or the viewer format you choose in APS docs).
- Poll or use webhooks until the job status is **success**.
- Retrieve the **encoded URN** of the translated manifest (what the viewer passes to `loadDocument`).

### 3. Store the URN

- Persist the derivative URN next to the project or spatial file row.
- In this app, the mock shape is `ProjectSpatialFile.aps` (`derivativeUrn`, `translationTarget: "SVF2"`, `translationStatus`).
- **Never** treat the URN as a secret; the **access token** is what must stay short-lived and server-issued.

### 4. Open in APS Viewer

- Your **server** returns an OAuth **access token** (2-legged for app-only, or 3-legged if the user’s Autodesk account owns the files).
- The **browser** loads APS Viewer, calls `Autodesk.Viewing.Initializer` with `accessToken`, then loads the document with the **encoded derivative URN**.

See the large **TODO** comment blocks in `aps-bim-viewer-adapter.placeholder.tsx` for the exact integration checkpoints.

---

## UI behavior today (no backend)

- **RVT** and **DWG** rows show:
  - **Requires APS translation**
  - **Target output: SVF2**
- The upload prototype table includes an **APS (SVF2 path)** column with the same hints.
- Mock project **“Riverside Office (APS mock — model ready)”** (`p-aps-001`) includes a row with `aps.translationStatus: "succeeded"` so you can see the extra **SVF2 derivative ready (mock)** badge.

---

## Security notes (important)

- Put **APS_CLIENT_ID** and **APS_CLIENT_SECRET** in **server-only** environment variables.
- Expose only a **token endpoint** (or session) to the frontend — not the secret.
- Rotate and cache tokens; APS tokens expire quickly.

---

## Related reading

- [Autodesk Platform Services](https://aps.autodesk.com/) — apps, credentials, and API reference.
- APS **Model Derivative** and **Viewer** tutorials (official docs) for `loadDocument`, URNs, and viewer lifecycle.

When you implement the viewer, flip **`APS_VIEWER_FRONTEND_ENABLED`** in `aps-config.ts` and branch the BIM adapter to mount your real viewport component instead of the IFC-only path.
