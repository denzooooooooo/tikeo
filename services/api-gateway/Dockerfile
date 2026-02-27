# ============================================================
# TIKE'O - Dockerfile Multi-Stage (Production)
# Stage 1: Builder — installe deps + compile TypeScript
# Stage 2: Runner  — image légère pour la production
# ============================================================

# ---- Stage 1: Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# Outils nécessaires pour les modules natifs (bcrypt, etc.)
RUN apk add --no-cache python3 make g++ openssl

# Copier les fichiers de configuration du monorepo
COPY package.json package-lock.json* turbo.json ./

# Copier les packages partagés
COPY packages/ ./packages/

# Copier le service api-gateway
COPY services/api-gateway/ ./services/api-gateway/

# Installer toutes les dépendances
RUN npm ci --prefer-offline

# Générer le client Prisma
RUN cd services/api-gateway && npx prisma generate

# Builder les packages partagés d'abord
RUN npm run build --workspace=packages/types || true
RUN npm run build --workspace=packages/utils || true

# Builder l'API Gateway
RUN npm run build --workspace=services/api-gateway

# ---- Stage 2: Runner (image de production légère) ----
FROM node:20-alpine AS runner

WORKDIR /app

# Outils runtime nécessaires
RUN apk add --no-cache openssl wget

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copier les fichiers de configuration
COPY package.json package-lock.json* turbo.json ./
COPY packages/ ./packages/
COPY services/api-gateway/package.json ./services/api-gateway/
COPY services/api-gateway/prisma/ ./services/api-gateway/prisma/
COPY services/api-gateway/nest-cli.json ./services/api-gateway/

# Installer uniquement les dépendances de production
RUN npm ci --only=production --prefer-offline && npm cache clean --force

# Copier les fichiers compilés depuis le builder
COPY --from=builder /app/services/api-gateway/dist ./services/api-gateway/dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/services/api-gateway/node_modules/.prisma ./services/api-gateway/node_modules/.prisma 2>/dev/null || true

# Changer le propriétaire des fichiers
RUN chown -R nestjs:nodejs /app

# Utiliser l'utilisateur non-root
USER nestjs

# Exposer le port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/v1/health || exit 1

# Démarrer l'application
CMD ["node", "services/api-gateway/dist/main.js"]
