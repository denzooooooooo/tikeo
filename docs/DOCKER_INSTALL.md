# 🐳 Installation de Docker sur macOS

## Méthode 1 : Docker Desktop (Recommandé)

### Installation via Homebrew

```bash
# Installer Homebrew si ce n'est pas déjà fait
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer Docker Desktop
brew install --cask docker

# Lancer Docker Desktop
open /Applications/Docker.app
```

### Installation manuelle

1. Téléchargez Docker Desktop depuis : https://www.docker.com/products/docker-desktop/
2. Ouvrez le fichier `.dmg` téléchargé
3. Glissez Docker dans le dossier Applications
4. Lancez Docker depuis Applications

### Vérification

```bash
# Vérifier l'installation
docker --version
docker-compose --version

# Tester Docker
docker run hello-world
```

## Méthode 2 : Colima (Alternative légère)

```bash
# Installer Colima
brew install colima docker docker-compose

# Démarrer Colima
colima start

# Vérifier
docker --version
```

## Démarrage du projet Tikeo

Une fois Docker installé :

```bash
# Démarrer les services
docker-compose up -d

# Vérifier les services
docker-compose ps

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

## Services disponibles

- **PostgreSQL** : localhost:5432
- **Redis** : localhost:6379
- **Elasticsearch** : localhost:9200
- **Kibana** : localhost:5601
- **MinIO** : localhost:9000 (console: localhost:9001)

## Troubleshooting

### Docker Desktop ne démarre pas

```bash
# Réinitialiser Docker
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/.docker
```

### Problèmes de permissions

```bash
# Ajouter votre utilisateur au groupe docker
sudo dscl . -append /Groups/_developer GroupMembership $(whoami)
```

### Ports déjà utilisés

Modifiez les ports dans `docker-compose.yml` si nécessaire.
