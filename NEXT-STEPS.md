# Next Steps (Beginner Guide)

This file explains how to move from this prototype to real integrations.

## 1) Move from prototype to proper Speckle integration

Simple plan:

1. Keep your project list in a real backend database (instead of local mock file).
2. Store real Speckle project/model links in that backend.
3. Add backend endpoints for secure token handling (do not rely on public tokens for production).
4. Use those backend endpoints from the frontend viewer page.
5. Replace dummy model-tree/property data with data coming from the actual Speckle model.
6. Connect toolbar actions (orbit/pan/zoom/reset) to real viewer APIs.

Result: your app still has the same UI, but data and viewer behavior become real and secure.

## 2) Move from this prototype to Autodesk APS Viewer + Model Derivative later

Simple plan:

1. Create an APS app in Autodesk Developer Portal.
2. Build backend endpoints for:
   - APS token generation
   - model upload/URN management
   - model derivative status checks
3. Add APS Viewer in the same viewer container area.
4. Map APS selection data into your right-side property panel.
5. Map APS model tree data to your left-side tree panel.
6. Keep the same page layout and replace data source/provider layer.

Result: same app UX, different engine under the hood.

## 3) Backend pieces needed in future

At minimum, you will need:

- **Auth backend**
  - real login/session/JWT
  - user roles and permissions
- **Project API**
  - list projects
  - get project detail
  - store model source + model URLs/URNs
- **Integration API**
  - Speckle secure token exchange (or managed access)
  - APS OAuth/token + derivative jobs
- **Persistence**
  - database for users, projects, access rules, integration metadata
- **Security**
  - server-side secret management
  - audit logs for access to models

## Practical order to build

1. Backend auth + project database
2. Speckle secure integration (first real viewer path)
3. Replace mock tree/properties with real model data
4. Add APS path as second provider
5. Production hardening (monitoring, logs, permissions, tests)
