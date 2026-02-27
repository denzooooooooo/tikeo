# 🚀 Guide de Déploiement Production — Tike'o

## Architecture
```
GitHub (code source)
    ├── Push → main
    │       ├── Vercel (auto) → Frontend Next.js
    │       └── GitHub Actions → SSH → VPS Hetzner → Backend NestJS
    │
    └── Services externes:
            ├── Supabase → PostgreSQL (DB)
            ├── Upstash  → Redis (cache)
            └── Vercel   → Frontend (CDN mondial)
```

---

## 📋 ÉTAPE 1 — Créer le repo GitHub

```bash
# Sur votre Mac, dans le dossier du projet
cd /Users/angedjedjed/Desktop/tikeo

# Initialiser git
git init
git add .
git commit -m "feat: initial commit — Tike'o production setup"

# Créer le repo sur GitHub (via GitHub CLI ou manuellement)
# Option A: GitHub CLI
gh repo create tikeo --public --push --source=.

# Option B: Manuellement
# 1. Aller sur https://github.com/new
# 2. Nom: tikeo
# 3. Copier les commandes affichées et les exécuter
```

---

## 📋 ÉTAPE 2 — Configurer Supabase (Base de données)

1. Aller sur **https://supabase.com** → "New Project"
2. Nom du projet: `tikeo`
3. Mot de passe DB: générer un mot de passe fort (le noter !)
4. Région: **West EU (Ireland)** (proche de Hetzner EU)
5. Cliquer "Create new project"

**Récupérer l'URL de connexion:**
- Dashboard → Settings → Database → Connection string → URI
- Format: `postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres`

---

## 📋 ÉTAPE 3 — Configurer Upstash Redis

1. Aller sur **https://console.upstash.com** → "Create Database"
2. Nom: `tikeo-redis`
3. Type: **Regional** → EU-West-1
4. Cliquer "Create"

**Récupérer l'URL Redis:**
- Dashboard → votre DB → "Connect" → Redis URL
- Format: `rediss://default:[PASSWORD]@[ENDPOINT].upstash.io:6380`

---

## 📋 ÉTAPE 4 — Commander le VPS Hetzner

1. Aller sur **https://www.hetzner.com/cloud**
2. "Add Server":
   - **Location**: Nuremberg (EU)
   - **Image**: Ubuntu 22.04
   - **Type**: CX21 (2 vCPU, 4GB RAM) — ~4€/mois
   - **SSH Key**: Ajouter votre clé publique SSH
3. Cliquer "Create & Buy now"
4. **Noter l'IP du VPS** (ex: `65.21.xxx.xxx`)

**Générer une clé SSH si vous n'en avez pas:**
```bash
ssh-keygen -t ed25519 -C "tikeo-vps"
cat ~/.ssh/id_ed25519.pub  # Copier cette clé dans Hetzner
```

---

## 📋 ÉTAPE 5 — Déployer le Backend sur le VPS

### 5.1 Se connecter au VPS
```bash
ssh root@VOTRE_IP_VPS
```

### 5.2 Lancer le script de déploiement automatique
```bash
# Télécharger et exécuter le script
curl -fsSL https://raw.githubusercontent.com/VOTRE_USERNAME/tikeo/main/infrastructure/scripts/deploy-vps.sh | bash
```

**OU manuellement:**
```bash
# Installer Docker
curl -fsSL https://get.docker.com | sh

# Cloner le repo
git clone https://github.com/VOTRE_USERNAME/tikeo.git /opt/tikeo
cd /opt/tikeo

# Configurer les variables d'environnement
cp services/api-gateway/.env.example services/api-gateway/.env
nano services/api-gateway/.env
```

### 5.3 Remplir le fichier `.env` avec vos vraies valeurs
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres:MOT_DE_PASSE@db.REF.supabase.co:5432/postgres
REDIS_URL=rediss://default:MOT_DE_PASSE@ENDPOINT.upstash.io:6380
JWT_SECRET=VOTRE_SECRET_TRES_LONG_64_CHARS_MINIMUM
FRONTEND_URL=https://tikeo.vercel.app
```

### 5.4 Démarrer les containers
```bash
cd /opt/tikeo
docker-compose -f docker-compose.vps.yml up -d

# Vérifier que tout tourne
docker-compose -f docker-compose.vps.yml ps
docker-compose -f docker-compose.vps.yml logs -f api-gateway
```

### 5.5 Migrer la base de données
```bash
docker-compose -f docker-compose.vps.yml exec api-gateway \
  sh -c "cd /app && npx prisma migrate deploy --schema=services/api-gateway/prisma/schema.prisma"
```

### 5.6 Configurer le DNS (si vous avez un domaine)
Dans votre registrar DNS, ajouter:
```
api.tikeo.com  A  VOTRE_IP_VPS
```

### 5.7 Obtenir le certificat SSL
```bash
# Sur le VPS
docker run --rm \
  -v /opt/tikeo/infrastructure/nginx/certbot-conf:/etc/letsencrypt \
  -v /opt/tikeo/infrastructure/nginx/certbot-www:/var/www/certbot \
  certbot/certbot certonly \
  --standalone \
  --email votre@email.com \
  --agree-tos \
  -d api.tikeo.com
```

---

## 📋 ÉTAPE 6 — Déployer le Frontend sur Vercel

### 6.1 Connecter Vercel à GitHub
1. Aller sur **https://vercel.com/new**
2. "Import Git Repository" → Sélectionner votre repo `tikeo`
3. Configuration:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && npm run build --workspace=apps/web`
   - **Output Directory**: `.next`

### 6.2 Ajouter les variables d'environnement sur Vercel
Dans Vercel → Settings → Environment Variables:

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://api.tikeo.com/api/v1` (ou `http://VOTRE_IP_VPS:3001/api/v1` sans domaine) |
| `NEXT_PUBLIC_APP_NAME` | `Tike'o` |
| `NEXT_PUBLIC_APP_URL` | `https://tikeo.vercel.app` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |

### 6.3 Déployer
Cliquer "Deploy" → Vercel build et déploie automatiquement.

**URL de votre site**: `https://tikeo.vercel.app`

---

## 📋 ÉTAPE 7 — Configurer le CI/CD (GitHub Actions)

Ajouter ces secrets dans GitHub → Settings → Secrets → Actions:

| Secret | Valeur |
|--------|--------|
| `VPS_HOST` | IP de votre VPS Hetzner (ex: `65.21.xxx.xxx`) |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | Contenu de `~/.ssh/id_ed25519` (clé privée) |
| `VPS_PORT` | `22` |

**Tester le CI/CD:**
```bash
git add .
git commit -m "test: CI/CD deployment"
git push origin main
# → GitHub Actions se déclenche automatiquement
# → Backend redéployé sur le VPS
# → Frontend redéployé sur Vercel
```

---

## 🔧 Commandes Utiles

### Sur le VPS
```bash
# Voir les logs en temps réel
docker-compose -f /opt/tikeo/docker-compose.vps.yml logs -f

# Redémarrer le backend
docker-compose -f /opt/tikeo/docker-compose.vps.yml restart api-gateway

# Mettre à jour manuellement
cd /opt/tikeo && git pull && docker-compose -f docker-compose.vps.yml up -d --build

# Vérifier la santé de l'API
curl http://localhost:3001/api/v1/health

# Accéder au container
docker exec -it tikeo-api-gateway sh
```

### Prisma (migrations)
```bash
# Depuis votre Mac (en local)
cd services/api-gateway
DATABASE_URL="postgresql://..." npx prisma migrate deploy
DATABASE_URL="postgresql://..." npx prisma studio  # Interface graphique DB
```

---

## 🔒 Sécurité — Checklist

- [ ] JWT_SECRET de 64+ caractères aléatoires
- [ ] Mot de passe Supabase fort
- [ ] Firewall VPS: ouvrir seulement ports 22, 80, 443
- [ ] SSH: désactiver l'authentification par mot de passe
- [ ] Variables d'env jamais committées dans git
- [ ] CORS configuré pour pointer uniquement vers tikeo.vercel.app

**Configurer le firewall sur le VPS:**
```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw deny 3001/tcp   # Bloquer l'accès direct à l'API (passer par Nginx)
ufw enable
```

---

## 💰 Coût Total Mensuel

| Service | Coût |
|---------|------|
| Vercel (Frontend) | Gratuit |
| Hetzner CX21 (Backend) | ~4€/mois |
| Supabase (DB) | Gratuit (500MB) |
| Upstash Redis | Gratuit (10k req/jour) |
| **TOTAL** | **~4€/mois** |

---

## 🆘 Dépannage

### L'API ne répond pas
```bash
docker-compose -f docker-compose.vps.yml logs api-gateway
docker-compose -f docker-compose.vps.yml ps
```

### Erreur de connexion DB
```bash
# Tester la connexion Supabase depuis le VPS
docker exec -it tikeo-api-gateway sh
node -e "const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.\$connect().then(() => console.log('OK')).catch(console.error)"
```

### Vercel ne build pas
- Vérifier que `Root Directory` est bien `apps/web`
- Vérifier les variables d'environnement dans Vercel Dashboard
- Consulter les logs de build dans Vercel

### CORS errors
- Vérifier que `FRONTEND_URL` dans `.env` correspond exactement à l'URL Vercel
- Vérifier la config CORS dans `services/api-gateway/src/main.ts`
