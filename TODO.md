# Railway Deployment Fix — TODO

## Issues Identified
- [ ] Fix 1: `railway.json` — add `startCommand` to use compiled output (root crash fix)
- [ ] Fix 2: `main.ts` — bind to `0.0.0.0` explicitly for Railway network compatibility
- [ ] Fix 3: `Dockerfile` — fix HEALTHCHECK to use dynamic `${PORT:-3001}`

## Progress
- [x] railway.json updated — added `startCommand: "node services/api-gateway/dist/main.js"`
- [x] main.ts updated — `app.listen(port, '0.0.0.0')`
- [x] Dockerfile updated — HEALTHCHECK uses `${PORT:-3001}`
