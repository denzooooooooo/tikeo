# 🎫 Tikeo - Plateforme de Billetterie Événementielle Nouvelle Génération

> La plateforme de billetterie la plus simple, la plus élégante et la plus intelligente du marché.

## 🚀 Stack Technique

### Frontend
- **Web**: Next.js 14 (React 18, TypeScript, App Router)
- **Mobile**: React Native Expo
- **Design System**: TailwindCSS + shadcn/ui + Framer Motion

### Backend
- **API**: NestJS (Microservices Architecture)
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Search**: Elasticsearch
- **Storage**: AWS S3

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Datadog

### Services Tiers
- **Auth**: Auth0 / Firebase Auth
- **Payments**: Stripe Connect
- **Emails**: Resend / SendGrid
- **Push Notifications**: Firebase Cloud Messaging
- **AI**: OpenAI API

## 📁 Structure du Projet

```
tikeo/
├── apps/
│   ├── web/                 # Application web Next.js
│   ├── mobile/              # Application mobile React Native
│   ├── admin/               # Dashboard organisateurs
│   └── scanner/             # Application de contrôle d'accès
├── packages/
│   ├── ui/                  # Design System partagé
│   ├── config/              # Configurations partagées
│   ├── types/               # Types TypeScript
│   └── utils/               # Utilitaires
├── services/
│   ├── api-gateway/         # API Gateway
│   ├── auth-service/        # Service d'authentification
│   ├── event-service/       # Service événements
│   ├── ticket-service/      # Service billets
│   ├── payment-service/     # Service paiements
│   ├── notification-service/# Service notifications
│   ├── ai-service/          # Service IA
│   └── analytics-service/   # Service analytics
├── infrastructure/
│   ├── docker/              # Dockerfiles
│   ├── kubernetes/          # Manifests K8s
│   └── terraform/           # Infrastructure as Code
└── docs/                    # Documentation

```

## 🎨 Design System

### Palette de Couleurs
- **Background**: `#FFFFFF` (blanc)
- **Background Secondary**: `#F7F8FA`
- **Primary**: `#5B7CFF`
- **Accent Gradient**: `#7B61FF → #5B7CFF`
- **Text Primary**: `#111827`
- **Text Secondary**: `#6B7280`
- **Success**: `#16A34A`
- **Error**: `#DC2626`

### Typographie
- **Font**: Inter / SF Pro Display
- **H1**: 48px bold
- **H2**: 32px semibold
- **Body**: 16px regular

### Principes
- Grid 8-pt system
- Border radius: 14px
- Animations: 150-250ms cubic-bezier(0.4, 0, 0.2, 1)

## 🛠️ Installation

### Prérequis
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation des dépendances

```bash
npm install
```

### Configuration des variables d'environnement

Copier les fichiers `.env.example` et les renommer en `.env.local` dans chaque application.

### Démarrage en développement

```bash
# Démarrer tous les services
npm run dev

# Démarrer uniquement le web
npm run dev --filter=web

# Démarrer uniquement le mobile
npm run dev --filter=mobile

# Démarrer les services backend
docker-compose up -d
```

### Build de production

```bash
npm run build
```

## 🎯 Fonctionnalités Principales

### Pour les Utilisateurs
- ✅ Onboarding rapide (<30s)
- ✅ Découverte intelligente d'événements (IA)
- ✅ Paiement one-tap (Apple Pay / Google Pay)
- ✅ Wallet de billets QR/NFC
- ✅ Transfert et revente de billets
- ✅ Notifications intelligentes
- ✅ Programme de fidélité

### Pour les Organisateurs
- ✅ Dashboard analytics temps réel
- ✅ Création d'événement assistée par IA
- ✅ Tarification dynamique
- ✅ Campagnes marketing automatisées
- ✅ Gestion multi-rôles
- ✅ Exports comptables

### Contrôle d'Accès
- ✅ Scan ultra-rapide offline-first
- ✅ Validation QR/NFC
- ✅ Détection antifraude
- ✅ Statistiques live

## 🤖 Fonctionnalités IA

- Recommandations personnalisées
- Génération de contenu événementiel
- Création automatique de visuels
- Pricing dynamique
- Détection de fraude
- Chatbot support
- Prédictions de ventes

## 📱 Applications

### Web (Next.js)
- SSR/ISR pour SEO optimal
- PWA installable
- Time to Interactive < 1s
- Accessibilité WCAG AA

### Mobile (React Native Expo)
- iOS & Android natif
- Offline-first
- Animations GPU fluides
- Deep linking

## 🔒 Sécurité

- Authentification JWT
- Chiffrement end-to-end des billets
- PCI-DSS compliance
- Rate limiting
- CORS configuré
- Validation des données

## 📊 Monitoring

- Error tracking (Sentry)
- APM (Datadog)
- Logs centralisés
- Métriques temps réel
- Alertes automatiques

## 🚢 Déploiement

### Docker

```bash
docker-compose up -d
```

### Kubernetes

```bash
kubectl apply -f infrastructure/kubernetes/
```

### CI/CD

Les déploiements sont automatiques via GitHub Actions sur chaque push vers `main`.

## 📖 Documentation

La documentation complète est disponible dans le dossier `/docs`.

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez `CONTRIBUTING.md` pour plus d'informations.

## 📄 Licence

MIT License - voir `LICENSE` pour plus de détails.

## 👥 Équipe

Développé avec ❤️ par l'équipe Tikeo.

---

**Tikeo** - La billetterie réinventée.
