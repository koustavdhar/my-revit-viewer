# QA Checklist - My Revit Viewer

Use this checklist after each deployment.

Project URL: `https://<your-vercel-url>`
Test date: `_____________`
Tester: `_____________`
Environment: `Production / Preview`

## 1) Landing page

- [ ] Open `/` and confirm page loads without errors.
- [ ] Verify top navigation links are visible and clickable.
- [ ] Verify hero section, feature highlights, how-it-works, CTA, and footer are present.
- [ ] Confirm layout spacing and typography look consistent.

## 2) Login flow

- [ ] Open `/login`.
- [ ] Enter sample email and password.
- [ ] Click **Sign In (Demo)**.
- [ ] Confirm redirect to `/dashboard`.
- [ ] Click **Logout** from a protected page and confirm redirect to `/login`.

## 3) Dashboard

- [ ] Open `/dashboard` after login.
- [ ] Verify project cards render from mock data.
- [ ] Confirm each card shows name, status, updated date, and action buttons.
- [ ] Confirm compact list table is visible and readable.
- [ ] Confirm sidebar profile and logout are visible.

## 4) Project detail page

- [ ] Open `/projects/p-001`.
- [ ] Verify all project fields render (id, name, client, location, discipline, source, URL, status, updated, description).
- [ ] Confirm **Open Viewer** button navigates correctly.
- [ ] Confirm **Back to Dashboard** works.

## 5) Viewer page

- [ ] Open `/viewer/p-001`.
- [ ] Confirm viewer shell layout appears: left panel, header/actions, viewer center, right panel.
- [ ] Confirm toolbar buttons are visible and can be clicked.
- [ ] Confirm status badges are visible (`Connected/Disconnected`, `Read-only`, `External source`).
- [ ] Confirm model tree selection updates the right properties panel.

## 6) Model link behavior

- [ ] On `/viewer/p-001`, verify **Open in source platform** opens Speckle in new tab.
- [ ] If model embed succeeds, verify viewer area renders model canvas.
- [ ] If embed fails, verify fallback panel appears with clear message and open-link action.

## 7) Empty states

- [ ] Open `/viewer` directly and confirm **No project selected** empty state appears.
- [ ] Open a project with empty `modelUrl` and confirm missing-link message appears.
- [ ] Confirm action buttons in empty states are usable.

## 8) Error states

- [ ] Temporarily set an invalid Speckle URL in mock data and open `/viewer/p-001`.
- [ ] Confirm error/fallback state appears (no crash).
- [ ] Confirm user can still click **Open in source platform**.
- [ ] Confirm app remains responsive after clicking **Refresh viewer**.

## 9) Mobile responsiveness

- [ ] Test in browser responsive mode at ~390px width (mobile).
- [ ] Confirm navigation remains usable.
- [ ] Confirm dashboard cards stack correctly.
- [ ] Confirm viewer panels stack without overlap/cutoff.
- [ ] Confirm buttons remain tappable and text remains readable.

## Security and deployment sanity checks

- [ ] Confirm no secrets are committed to repo (`.env.local` should not be tracked).
- [ ] Confirm `.env.example` exists with placeholders only.
- [ ] Confirm `npm run lint` and `npm run build` pass before release.

## Result

- [ ] PASS
- [ ] PASS WITH NOTES
- [ ] FAIL

Notes:

`___________________________________________________________________`
`___________________________________________________________________`
