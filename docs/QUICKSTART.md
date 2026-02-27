# 🚀 Guide de Démarrage Rapide - Tikeo

Ce guide vous permettra de démarrer rapidement avec la plateforme Tikeo en développement local.

## Prérequis

Assurez-vous d'avoir installé :
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** et **Docker Compose**
- **Git**

## Installation en 5 Minutes

### 1. Cloner le Projet

```bash
git clone <repository-url>
cd tikeo
```

### 2. Installer les Dépendances

```bash
npm install
```

Cette commande installera toutes les dépendances pour tous les packages et applications du monorepo.

### 3. Configurer les Variables d'Environnement

#### Backend (API Gateway)

```bash
cd services/api-gateway
cp .env.example .env
```

Éditez le fichier `.env` avec vos configurations locales (les valeurs par défaut fonctionnent pour le développement local).

#### Frontend (Web App)

```bash
cd apps/web
cp .env.example .env.local
```

### 4. Démarrer les Services Infrastructure

```bash
# Retour à la racine du projet
cd ../..

# Démarrer PostgreSQL, Redis, Elasticsearch, etc.
docker-compose up -d
```

Vérifiez que tous les services sont démarrés :

```bash
docker-compose ps
```

### 5. Initialiser la Base de Données

```bash
cd services/api-gateway

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate dev --name init

# (Optionnel) Seed la base de données avec des données de test
npx prisma db seed
```

### 6. Démarrer l'Application

#### Option A : Démarrer Tout en Même Temps

```bash
# À la racine du projet
npm run dev
```

Cette commande démarre :
- ✅ Frontend Web (Next.js) sur http://localhost:3001
- ✅ API Gateway (NestJS) sur http://localhost:3000
- ✅ Tous les autres services configurés

#### Option B : Démarrer Individuellement

**Backend uniquement :**
```bash
npm run dev --filter=api-gateway
```

**Frontend uniquement :**
```bash
npm run dev --filter=web
```

## Accès aux Services

Une fois tout démarré, vous pouvez accéder à :

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend Web** | http://localhost:3001 | Application web principale |
| **API Gateway** | http://localhost:3000 | API REST principale |
| **API Documentation** | http://localhost:3000/api | Documentation Swagger |
| **PostgreSQL** | localhost:5432 | Base de données |
| **Redis** | localhost:6379 | Cache et sessions |
| **Elasticsearch** | http://localhost:9200 | Moteur de recherche |
| **Kibana** | http://localhost:5601 | Interface Elasticsearch |
| **MinIO Console** | http://localhost:9001 | Stockage S3 local |
| **Prisma Studio** | http://localhost:5555 | Interface base de données |

## Commandes Utiles

### Développement

```bash
# Démarrer en mode développement
npm run dev

# Linter
npm run lint

# Formater le code
npm run format

# Type checking
npm run type-check
```

### Base de Données

```bash
# Ouvrir Prisma Studio
cd services/api-gateway
npx prisma studio

# Créer une nouvelle migration
npx prisma migrate dev --name <nom_migration>

# Réinitialiser la base de données
npx prisma migrate reset
```

### Docker

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire les images
docker-compose build --no-cache
```

### Build Production

```bash
# Build tous les packages
npm run build

# Build un package spécifique
npm run build --filter=web
```

## Structure du Projet

```
tikeo/
├── apps/
│   └── web/              # Application Next.js
├── packages/
│   ├── ui/               # Design System
│   ├── types/            # Types TypeScript partagés
│   └── utils/            # Utilitaires partagés
├── services/
│   └── api-gateway/      # API NestJS
├── infrastructure/
│   ├── docker/           # Dockerfiles
│   └── kubernetes/       # Manifests K8s
└── docs/                 # Documentation
```

## Premiers Pas

### 1. Créer un Compte Utilisateur

Utilisez l'API ou l'interface web pour créer un compte :

**Via API :**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Explorer l'API

Visitez http://localhost:3000/api pour voir la documentation Swagger interactive.

### 3. Tester les Fonctionnalités

- **Découvrir les événements** : http://localhost:3001
- **Créer un événement** : Connectez-vous en tant qu'organisateur
- **Acheter un billet** : Parcourez les événements disponibles

## Résolution des Problèmes

### Port déjà utilisé

Si un port est déjà utilisé, modifiez-le dans les fichiers de configuration :
- `apps/web/package.json` pour le frontend
- `services/api-gateway/src/main.ts` pour le backend

### Erreur de connexion à la base de données

Vérifiez que PostgreSQL est démarré :
```bash
docker-compose ps postgres
```

Vérifiez la connexion :
```bash
docker-compose logs postgres
```

### Erreur Prisma

Régénérez le client Prisma :
```bash
cd services/api-gateway
npx prisma generate
```

### Problèmes de dépendances

Nettoyez et réinstallez :
```bash
npm run clean
rm -rf node_modules
npm install
```

## Prochaines Étapes

1. 📖 Lisez la [Documentation Complète](./INSTALLATION.md)
2. 🏗️ Consultez l'[Architecture](./ARCHITECTURE.md)
3. 🎨 Explorez le [Design System](../packages/ui/README.md)
4. 🔧 Configurez les [Services Tiers](./SERVICES.md)

## Support

Pour toute question ou problème :
- 📧 Email : support@tikeo.com
- 💬 Discord : [Rejoindre la communauté](#)
- 🐛 Issues : [GitHub Issues](#)

---

**Bon développement avec Tikeo ! 🎫**
