# 🌳 Structure Complète du Projet Tikeo

```
tikeo/
│
├── 📄 Configuration Racine
│   ├── package.json                    # Configuration workspace npm
│   ├── package-lock.json               # Lock file dépendances
│   ├── turbo.json                      # Configuration Turborepo
│   ├── tsconfig.json                   # Configuration TypeScript base
│   ├── .eslintrc.json                  # Configuration ESLint
│   ├── .prettierrc                     # Configuration Prettier
│   ├── .gitignore                      # Fichiers ignorés par Git
│   └── docker-compose.yml              # Services développement local
│
├── 📚 Documentation
│   ├── README.md                       # Documentation principale
│   ├── PROJECT_SUMMARY.md              # Résumé du projet
│   ├── TODO.md                         # Roadmap et tâches
│   ├── CONTRIBUTING.md                 # Guide de contribution
│   ├── DEPLOYMENT.md                   # Guide de déploiement
│   ├── LICENSE                         # Licence MIT
│   ├── STRUCTURE.md                    # Ce fichier
│   └── docs/
│       ├── INSTALLATION.md             # Guide d'installation
│       ├── QUICKSTART.md               # Démarrage rapide
│       └── ARCHITECTURE.md             # Documentation architecture
│
├── 📦 Packages Partagés
│   ├── packages/ui/                    # Design System
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts          # Config TailwindCSS
│   │   ├── postcss.config.js
│   │   └── src/
│   │       ├── index.ts                # Export principal
│   │       ├── styles/
│   │       │   └── globals.css         # Styles globaux
│   │       ├── lib/
│   │       │   └── utils.ts            # Utilitaires (cn, etc.)
│   │       └── components/
│   │           ├── Button.tsx          # Composant Button
│   │           ├── Card.tsx            # Composant Card
│   │           ├── EventCard.tsx       # Composant EventCard
│   │           └── Input.tsx           # Composant Input
│   │
│   ├── packages/types/                 # Types TypeScript
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── index.ts                # Types partagés
│   │
│   └── packages/utils/                 # Utilitaires
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts                # Export principal
│           ├── validators.ts           # Validateurs
│           ├── formatters.ts           # Formateurs
│           ├── constants.ts            # Constantes
│           └── api.ts                  # Client API
│
├── 🌐 Applications Frontend
│   └── apps/web/                       # Application Next.js 14
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.js              # Configuration Next.js
│       ├── tailwind.config.ts          # Config TailwindCSS
│       ├── postcss.config.js
│       ├── .env.example                # Variables d'environnement
│       └── app/                        # App Router Next.js 14
│           ├── layout.tsx              # Layout principal
│           ├── page.tsx                # Page d'accueil
│           ├── globals.css             # Styles globaux
│           ├── providers.tsx           # Providers React
│           └── api/
│               └── health/
│                   └── route.ts        # Health check endpoint
│
├── 🔧 Services Backend
│   └── services/api-gateway/           # API Gateway NestJS
│       ├── package.json
│       ├── tsconfig.json
│       ├── nest-cli.json               # Configuration NestJS CLI
│       ├── .env.example                # Variables d'environnement
│       ├── prisma/
│       │   └── schema.prisma           # Schéma base de données
│       └── src/
│           ├── main.ts                 # Point d'entrée
│           ├── app.module.ts           # Module racine
│           │
│           ├── auth/                   # Module Authentification
│           │   ├── auth.module.ts
│           │   ├── auth.controller.ts
│           │   ├── auth.service.ts
│           │   ├── dto/
│           │   │   └── index.ts        # DTOs (Register, Login, etc.)
│           │   └── strategies/
│           │       └── jwt.strategy.ts # Stratégie JWT
│           │
│           ├── events/                 # Module Événements
│           │   ├── events.module.ts
│           │   ├── events.controller.ts
│           │   └── events.service.ts
│           │
│           ├── tickets/                # Module Billets
│           │   ├── tickets.module.ts
│           │   ├── tickets.controller.ts
│           │   └── tickets.service.ts
│           │
│           ├── orders/                 # Module Commandes
│           │   ├── orders.module.ts
│           │   ├── orders.controller.ts
│           │   └── orders.service.ts
│           │
│           ├── prisma/                 # Service Prisma
│           │   ├── prisma.module.ts
│           │   └── prisma.service.ts
│           │
│           └── redis/                  # Service Redis
│               ├── redis.module.ts
│               └── redis.service.ts
│
├── 🏗️ Infrastructure
│   ├── infrastructure/docker/          # Dockerfiles
│   │   ├── Dockerfile.api-gateway      # Docker API Gateway
│   │   ├── Dockerfile.web              # Docker Next.js
│   │   └── init-db.sql                 # Init PostgreSQL
│   │
│   └── infrastructure/kubernetes/      # Kubernetes Manifests
│       ├── namespace.yaml              # Namespace tikeo
│       ├── api-gateway-deployment.yaml # Deployment API
│       ├── web-deployment.yaml         # Deployment Web
│       └── ingress.yaml                # Ingress NGINX
│
└── 🔄 CI/CD
    └── .github/workflows/
        └── ci.yml                      # Pipeline GitHub Actions

```

## 📊 Statistiques

### Fichiers Créés
- **Total** : ~80+ fichiers
- **TypeScript/TSX** : ~40 fichiers
- **Configuration** : ~20 fichiers
- **Documentation** : ~10 fichiers
- **Infrastructure** : ~10 fichiers

### Lignes de Code
- **Backend (NestJS)** : ~1500 lignes
- **Frontend (Next.js)** : ~800 lignes
- **Design System** : ~600 lignes
- **Configuration** : ~500 lignes
- **Documentation** : ~2000 lignes
- **Total** : ~5400+ lignes

### Packages npm
- **Total installé** : 1037 packages
- **Direct dependencies** : ~50
- **Dev dependencies** : ~20

## 🎯 Modules Implémentés

### ✅ Complétés
1. **Infrastructure** : Monorepo, Docker, K8s, CI/CD
2. **Design System** : TailwindCSS, composants de base
3. **Backend Core** : NestJS, Prisma, Redis
4. **Auth Module** : JWT, stratégies
5. **Events Module** : CRUD, cache, recherche
6. **Tickets Module** : Validation, QR codes
7. **Orders Module** : Gestion commandes
8. **Frontend Core** : Next.js 14, App Router

### 🚧 En Cours
- Finalisation authentification
- Intégration services tiers
- Tests unitaires

### 📋 À Développer
- Application mobile (React Native)
- Dashboard organisateur
- App scanner
- Services microservices additionnels
- Fonctionnalités IA
- Tests E2E

## 🔗 Dépendances Principales

### Frontend
```json
{
  "next": "^14.0.4",
  "react": "^18.2.0",
  "tailwindcss": "^3.3.6",
  "framer-motion": "^10.16.16",
  "@radix-ui/react-*": "latest"
}
```

### Backend
```json
{
  "@nestjs/core": "^10.3.0",
  "@nestjs/common": "^10.3.0",
  "@prisma/client": "^5.8.0",
  "redis": "^4.6.12",
  "passport-jwt": "^4.0.1",
  "stripe": "^14.10.0"
}
```

### DevOps
```json
{
  "turbo": "^1.11.0",
  "typescript": "^5.3.2",
  "eslint": "^8.54.0",
  "prettier": "^3.1.0"
}
```

## 📁 Conventions de Nommage

### Fichiers
- **Composants React** : `PascalCase.tsx` (ex: `EventCard.tsx`)
- **Services** : `kebab-case.service.ts` (ex: `events.service.ts`)
- **Modules** : `kebab-case.module.ts` (ex: `auth.module.ts`)
- **Types** : `kebab-case.ts` (ex: `user-types.ts`)
- **Config** : `kebab-case.config.ts` (ex: `tailwind.config.ts`)

### Dossiers
- **Modules** : `kebab-case` (ex: `auth/`, `events/`)
- **Composants** : `PascalCase` ou `kebab-case` selon contexte
- **Utilitaires** : `kebab-case` (ex: `lib/`, `utils/`)

## 🎨 Architecture des Composants

```
Component Hierarchy:
├── Layout (apps/web/app/layout.tsx)
│   ├── Navbar
│   ├── Main Content
│   │   ├── Page (apps/web/app/page.tsx)
│   │   │   ├── Hero Section
│   │   │   ├── Search Bar
│   │   │   ├── Featured Events
│   │   │   │   └── EventCard (packages/ui)
│   │   │   ├── Categories
│   │   │   │   └── Card (packages/ui)
│   │   │   └── Stats Section
│   │   └── Other Pages...
│   └── Footer
```

## 🔄 Flux de Données

```
User Request
    ↓
Next.js Frontend (Port 3001)
    ↓
API Gateway (Port 3000)
    ↓
┌─────────────┬──────────────┬──────────────┐
│   Prisma    │    Redis     │ Elasticsearch│
│ (PostgreSQL)│   (Cache)    │   (Search)   │
└─────────────┴──────────────┴──────────────┘
```

## 🚀 Commandes Utiles

```bash
# Développement
npm run dev                 # Démarrer tout
npm run dev --filter=web    # Démarrer web uniquement
npm run dev --filter=api-gateway  # Démarrer API uniquement

# Build
npm run build               # Build tout
npm run build --filter=web  # Build web uniquement

# Tests
npm run test                # Lancer tests
npm run lint                # Linter
npm run format              # Formater code

# Database
cd services/api-gateway
npx prisma studio           # Interface DB
npx prisma migrate dev      # Migrations
npx prisma generate         # Générer client

# Docker
docker-compose up -d        # Démarrer services
docker-compose down         # Arrêter services
docker-compose logs -f      # Voir logs
```

## 📈 Prochaines Étapes

1. **Finaliser Auth** : Intégration Auth0/Firebase
2. **Implémenter Paiements** : Stripe Connect
3. **Développer Mobile** : React Native Expo
4. **Ajouter IA** : OpenAI intégration
5. **Tests** : Unit, Integration, E2E
6. **Déploiement** : Production sur K8s

---

**Structure mise à jour** : 2024
**Version** : 1.0.0
**Status** : 🚧 En développement actif
