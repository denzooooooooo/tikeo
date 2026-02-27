# Déploiement avec Docker sur CyberPanel

## Étapes à suivre dans CyberPanel :

### 1. Préparer le projet sur votre Mac

ZIPpez le projet (excluant node_modules) :
```bash
cd /Users/angedjedjed/Desktop/tikeo
zip -r tikeo.zip . -x "node_modules/*" ".git/*" "*.next/*" "dist/*"
```

### 2. Upload dans CyberPanel

1. Allez dans **Gestionnaire de fichiers racine**
2. Créez un dossier `/opt/tikeo`
3. Uploadez le fichier `docker-compose.vps.yml`

### 3. Lancer les containers avec Docker Compose

Dans **Gestionnaire de Docker** :
1. Cliquez sur **Create Docker Compose**
2. Collez le contenu de `docker-compose.vps.yml`
3. Cliquez sur **Deploy**

### 4. Services créés

Le docker-compose va démarrer :
- **PostgreSQL** sur port 5432 (base de données)
- **Redis** sur port 6379 (cache)
- **API Gateway** sur port 3001 (votre backend)

---

## Configuration du frontend local

Une fois le backend déployé, configurez votre frontend local pour pointer vers le VPS :

Créez un fichier `apps/web/.env.local` :

```env
NEXT_PUBLIC_API_URL=http://72.60.90.8:3001
```

Puis lancez le frontend en local :
```bash
npm run dev --workspace=apps/web
```

---

## Fichiers créés pour le déploiement

1. **docker-compose.vps.yml** - Configuration Docker pour le VPS
2. **services/api-gateway/Dockerfile** - Image Docker pour le backend

Avez-vous accès au **Gestionnaire de Docker** dans CyberPanel ? Pouvez-vous me montrer ce que vous voyez quand vous cliquez dessus ?
