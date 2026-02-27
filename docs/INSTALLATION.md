# 📦 Guide d'Installation Tikeo

Ce guide vous accompagne dans l'installation et la configuration complète de la plateforme Tikeo.

## 📋 Prérequis

### Logiciels Requis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Docker** >= 24.0.0
- **Docker Compose** >= 2.20.0
- **PostgreSQL** >= 15.0 (ou via Docker)
- **Redis** >= 7.0 (ou via Docker)
- **Git**

### Comptes Tiers Requis

1. **Stripe** - Pour les paiements
   - Créer un compte sur [stripe.com](https://stripe.com)
   - Récupérer les clés API (test et production)

2. **OpenAI** - Pour les fonctionnalités IA
   - Créer un compte sur [platform.openai.com](https://platform.openai.com)
   - Générer une clé API

3. **Auth0 ou Firebase** - Pour l'authentification
   - Créer un projet
   - Configurer les applications web et mobile

4. **Resend ou SendGrid** - Pour les emails
   - Créer un compte
   - Obtenir une clé API

5. **AWS S3** - Pour le stockage de fichiers
   - Créer un bucket S3
   - Configurer les credentials IAM

## 🚀 Installation Rapide (Développement Local)

### 1. Cloner le Repository

```bash
git clone https://github.com/votre-org/tikeo.git
cd tikeo
```

### 2. Installer les Dépendances

```bash
npm install
```

Cette commande installera toutes les dépendances pour tous les packages et applications du monorepo.

### 3. Configurer les Variables d'Environnement

#### API Gateway

```bash
cd services/api-gateway
cp .env.example .env
```

Éditer le fichier `.env` et remplir les valeurs :

```env
# Database
DATABASE_URL="postgresql://tikeo:tikeo_dev_password@localhost:5432/tikeo?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="votre-secret-jwt-super-securise"
JWT_EXPIRES_IN="7d"

# Stripe
STRIPE_SECRET_KEY="sk_test_votre_cle_stripe"
STRIPE_WEBHOOK_SECRET="whsec_votre_webhook_secret"

# OpenAI
OPENAI_API_KEY="sk-votre-cle-openai"

# Email
RESEND_API_KEY="re_votre_cle_resend"

# AWS S3
AWS_ACCESS_KEY_ID="votre-access-key"
AWS_SECRET_ACCESS_KEY="votre-secret-key"
AWS_REGION="eu-west-1"
AWS_S3_BUCKET="tikeo-dev"
```

#### Application Web

```bash
cd apps/web
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api/v1"
NEXT_PUBLIC_WEB_URL="http://localhost:3001"
```

### 4. Démarrer les Services avec Docker

```bash
# Retourner à la racine du projet
cd ../..

# Démarrer PostgreSQL, Redis, Elasticsearch
docker-compose up -d postgres redis elasticsearch
```

Vérifier que les services sont démarrés :

```bash
docker-compose ps
```

### 5. Initialiser la Base de Données

```bash
cd services/api-gateway

# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma migrate dev --name init

# (Optionnel) Seed la base de données
npx prisma db seed
```

### 6. Démarrer l'Application en Mode Développement

#### Option A : Tout démarrer en une commande

```bash
# À la racine du projet
npm run dev
```

Cette commande démarre :
- ✅ Application Web (Next.js) sur http://localhost:3001
- ✅ API Gateway (NestJS) sur http://localhost:3000
- ✅ Tous les microservices

#### Option B : Démarrer individuellement

```bash
# Terminal 1 - API Gateway
cd services/api-gateway
npm run start:dev

# Terminal 2 - Application Web
cd apps/web
npm run dev

# Terminal 3 - Application Mobile (optionnel)
cd apps/mobile
npm run start
```

### 7. Accéder à l'Application

- **Application Web** : http://localhost:3001
- **API Documentation** : http://localhost:3000/api/docs
- **Prisma Studio** : `npx prisma studio` (dans services/api-gateway)
- **Elasticsearch** : http://localhost:9200
- **Kibana** : http://localhost:5601

## 🏗️ Installation Production

### 1. Build des Applications

```bash
# Build toutes les applications
npm run build

# Ou individuellement
npm run build --filter=web
npm run build --filter=api-gateway
```

### 2. Déploiement avec Docker

```bash
# Build les images Docker
docker-compose -f docker-compose.prod.yml build

# Démarrer en production
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Déploiement sur Kubernetes

```bash
# Créer le namespace
kubectl apply -f infrastructure/kubernetes/namespace.yaml

# Créer les secrets
kubectl create secret generic tikeo-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=redis-url="redis://..." \
  --from-literal=jwt-secret="..." \
  --from-literal=stripe-secret-key="..." \
  --from-literal=openai-api-key="..." \
  -n tikeo

# Déployer les applications
kubectl apply -f infrastructure/kubernetes/

# Vérifier le déploiement
kubectl get pods -n tikeo
kubectl get services -n tikeo
kubectl get ingress -n tikeo
```

## 🧪 Tests

### Lancer les Tests

```bash
# Tous les tests
npm run test

# Tests avec couverture
npm run test:cov

# Tests en mode watch
npm run test:watch
```

### Linter et Formatage

```bash
# Linter
npm run lint

# Formater le code
npm run format
```

## 📱 Application Mobile (React Native Expo)

### Installation

```bash
cd apps/mobile
npm install
```

### Démarrage

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Build Production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## 🔧 Commandes Utiles

### Base de Données

```bash
# Créer une migration
npx prisma migrate dev --name nom_migration

# Appliquer les migrations
npx prisma migrate deploy

# Reset la base de données
npx prisma migrate reset

# Ouvrir Prisma Studio
npx prisma studio
```

### Docker

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart api-gateway

# Arrêter tous les services
docker-compose down

# Supprimer les volumes
docker-compose down -v
```

### Kubernetes

```bash
# Voir les logs d'un pod
kubectl logs -f pod-name -n tikeo

# Redémarrer un déploiement
kubectl rollout restart deployment/api-gateway -n tikeo

# Scaler un déploiement
kubectl scale deployment/api-gateway --replicas=5 -n tikeo
```

## 🐛 Dépannage

### Problème : Les dépendances ne s'installent pas

```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problème : Erreur de connexion à la base de données

1. Vérifier que PostgreSQL est démarré :
   ```bash
   docker-compose ps postgres
   ```

2. Vérifier la connexion :
   ```bash
   psql postgresql://tikeo:tikeo_dev_password@localhost:5432/tikeo
   ```

### Problème : Port déjà utilisé

```bash
# Trouver le processus utilisant le port 3000
lsof -i :3000

# Tuer le processus
kill -9 PID
```

### Problème : Prisma Client non généré

```bash
cd services/api-gateway
npx prisma generate
```

## 📚 Ressources Supplémentaires

- [Documentation API](./API.md)
- [Guide de Contribution](../CONTRIBUTING.md)
- [Architecture](./ARCHITECTURE.md)
- [Guide de Déploiement](./DEPLOYMENT.md)

## 🆘 Support

Pour toute question ou problème :

- 📧 Email : support@tikeo.com
- 💬 Discord : [discord.gg/tikeo](https://discord.gg/tikeo)
- 🐛 Issues : [GitHub Issues](https://github.com/votre-org/tikeo/issues)

---

**Tikeo** - La billetterie réinventée 🎫
