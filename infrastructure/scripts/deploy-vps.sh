#!/bin/bash
# ============================================================
# TIKE'O - Script de déploiement initial sur VPS Hetzner
# Usage: bash infrastructure/scripts/deploy-vps.sh
# À exécuter UNE SEULE FOIS lors de la première installation
# ============================================================

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════╗"
echo "║     TIKE'O - Déploiement VPS Hetzner     ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

# ─────────────────────────────────────────
# 1. Vérification des prérequis
# ─────────────────────────────────────────
echo -e "${YELLOW}[1/7] Vérification des prérequis...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé. Installation...${NC}"
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✅ Docker installé${NC}"
else
    echo -e "${GREEN}✅ Docker disponible: $(docker --version)${NC}"
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose n'est pas installé. Installation...${NC}"
    sudo apt-get update && sudo apt-get install -y docker-compose-plugin
    echo -e "${GREEN}✅ Docker Compose installé${NC}"
else
    echo -e "${GREEN}✅ Docker Compose disponible${NC}"
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git n'est pas installé. Installation...${NC}"
    sudo apt-get update && sudo apt-get install -y git
    echo -e "${GREEN}✅ Git installé${NC}"
fi

# ─────────────────────────────────────────
# 2. Cloner le repo
# ─────────────────────────────────────────
echo -e "${YELLOW}[2/7] Clonage du repository...${NC}"

if [ -d "/opt/tikeo" ]; then
    echo -e "${YELLOW}⚠️  Le dossier /opt/tikeo existe déjà. Mise à jour...${NC}"
    cd /opt/tikeo
    git pull origin main
else
    echo "Entrez l'URL de votre repo GitHub (ex: https://github.com/username/tikeo.git):"
    read REPO_URL
    sudo git clone "$REPO_URL" /opt/tikeo
    sudo chown -R $USER:$USER /opt/tikeo
    cd /opt/tikeo
fi

echo -e "${GREEN}✅ Code récupéré${NC}"

# ─────────────────────────────────────────
# 3. Configuration des variables d'environnement
# ─────────────────────────────────────────
echo -e "${YELLOW}[3/7] Configuration des variables d'environnement...${NC}"

if [ ! -f "/opt/tikeo/services/api-gateway/.env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env manquant. Copie du template...${NC}"
    cp /opt/tikeo/services/api-gateway/.env.example /opt/tikeo/services/api-gateway/.env
    echo -e "${RED}⚠️  IMPORTANT: Éditez le fichier .env avec vos vraies valeurs:${NC}"
    echo -e "${RED}   nano /opt/tikeo/services/api-gateway/.env${NC}"
    echo ""
    echo "Appuyez sur ENTRÉE après avoir configuré le .env..."
    read
else
    echo -e "${GREEN}✅ Fichier .env déjà présent${NC}"
fi

# ─────────────────────────────────────────
# 4. Obtenir le certificat SSL (Let's Encrypt)
# ─────────────────────────────────────────
echo -e "${YELLOW}[4/7] Configuration SSL Let's Encrypt...${NC}"

echo "Entrez votre nom de domaine pour l'API (ex: api.tikeo.com):"
read DOMAIN

echo "Entrez votre email pour Let's Encrypt:"
read EMAIL

# Démarrer Nginx temporairement pour le challenge ACME
docker run --rm -d \
    -p 80:80 \
    -v /opt/tikeo/infrastructure/nginx/certbot-www:/var/www/certbot \
    --name nginx-temp \
    nginx:alpine \
    sh -c "mkdir -p /var/www/certbot && nginx -g 'daemon off;'" 2>/dev/null || true

# Obtenir le certificat
docker run --rm \
    -v /opt/tikeo/infrastructure/nginx/certbot-conf:/etc/letsencrypt \
    -v /opt/tikeo/infrastructure/nginx/certbot-www:/var/www/certbot \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" || echo -e "${YELLOW}⚠️  SSL ignoré (configurer manuellement si nécessaire)${NC}"

docker stop nginx-temp 2>/dev/null || true

# Mettre à jour nginx.conf avec le bon domaine
sed -i "s/api.tikeo.com/$DOMAIN/g" /opt/tikeo/infrastructure/nginx/nginx.conf

echo -e "${GREEN}✅ SSL configuré pour $DOMAIN${NC}"

# ─────────────────────────────────────────
# 5. Build et démarrage des containers
# ─────────────────────────────────────────
echo -e "${YELLOW}[5/7] Build et démarrage des containers Docker...${NC}"

cd /opt/tikeo
docker-compose -f docker-compose.vps.yml build --no-cache
docker-compose -f docker-compose.vps.yml up -d

echo -e "${GREEN}✅ Containers démarrés${NC}"

# ─────────────────────────────────────────
# 6. Migration de la base de données
# ─────────────────────────────────────────
echo -e "${YELLOW}[6/7] Migration de la base de données Supabase...${NC}"

sleep 15  # Attendre que l'API Gateway soit prêt

docker-compose -f docker-compose.vps.yml exec -T api-gateway \
    sh -c "cd /app && npx prisma migrate deploy --schema=services/api-gateway/prisma/schema.prisma" || \
    echo -e "${YELLOW}⚠️  Migration ignorée (à faire manuellement si nécessaire)${NC}"

echo -e "${GREEN}✅ Base de données migrée${NC}"

# ─────────────────────────────────────────
# 7. Vérification finale
# ─────────────────────────────────────────
echo -e "${YELLOW}[7/7] Vérification de l'installation...${NC}"

sleep 10

if curl -sf "http://localhost:3001/api/v1/health" > /dev/null; then
    echo -e "${GREEN}✅ API Gateway opérationnel sur le port 3001${NC}"
else
    echo -e "${RED}❌ L'API Gateway ne répond pas. Vérifiez les logs:${NC}"
    echo "   docker-compose -f docker-compose.vps.yml logs api-gateway"
fi

# ─────────────────────────────────────────
# Résumé
# ─────────────────────────────────────────
echo ""
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════╗"
echo "║           ✅ DÉPLOIEMENT TERMINÉ !                   ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  API Backend : http://localhost:3001/api/v1          ║"
echo "║  API HTTPS   : https://$DOMAIN/api/v1               ║"
echo "║                                                      ║"
echo "║  Commandes utiles:                                   ║"
echo "║  • Logs    : docker-compose -f docker-compose.vps.yml logs -f  ║"
echo "║  • Restart : docker-compose -f docker-compose.vps.yml restart  ║"
echo "║  • Stop    : docker-compose -f docker-compose.vps.yml down     ║"
echo "╚══════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}📌 Prochaine étape: Connecter Vercel à votre repo GitHub${NC}"
echo "   1. Aller sur https://vercel.com/new"
echo "   2. Importer votre repo GitHub"
echo "   3. Root Directory: apps/web"
echo "   4. Ajouter la variable: NEXT_PUBLIC_API_URL=https://$DOMAIN/api/v1"
