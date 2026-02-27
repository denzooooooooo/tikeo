# 🚀 TODO - Configuration Production Tikeo

## Plan de déploiement
- Frontend → Vercel
- Backend → VPS Hetzner + Docker Compose
- DB → Supabase (PostgreSQL externe)
- Redis → Upstash (externe)

## Étapes

- [x] 1. Créer `vercel.json` (config Vercel monorepo)
- [x] 2. Créer `apps/web/.env.example` (template variables Vercel)
- [x] 3. Créer `services/api-gateway/.env.example` (template variables backend)
- [x] 4. Mettre à jour `docker-compose.vps.yml` (Supabase + Upstash externes)
- [x] 5. Mettre à jour `services/api-gateway/Dockerfile` (multi-stage build)
- [x] 6. Mettre à jour `apps/web/next.config.js` (rewrites production)
- [x] 7. Mettre à jour `.github/workflows/ci.yml` (Vercel + SSH VPS)
- [x] 8. Créer `infrastructure/nginx/nginx.conf` (reverse proxy SSL)
- [x] 9. Créer `infrastructure/scripts/deploy-vps.sh` (script déploiement)
- [x] 10. Créer `DEPLOYMENT_PRODUCTION.md` (guide complet)
- [ ] 11. Initialiser git + créer repo GitHub + push
