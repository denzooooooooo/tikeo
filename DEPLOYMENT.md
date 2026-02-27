# 🚀 Guide de Déploiement - Tikeo

Ce guide couvre le déploiement de la plateforme Tikeo en production.

## 📋 Table des Matières

- [Prérequis](#prérequis)
- [Environnements](#environnements)
- [Déploiement Docker](#déploiement-docker)
- [Déploiement Kubernetes](#déploiement-kubernetes)
- [Configuration DNS](#configuration-dns)
- [SSL/TLS](#ssltls)
- [Variables d'Environnement](#variables-denvironnement)
- [Monitoring](#monitoring)
- [Backup & Recovery](#backup--recovery)
- [Scaling](#scaling)

## 🔧 Prérequis

### Infrastructure Requise

- **Cluster Kubernetes** (GKE, EKS, AKS, ou self-hosted)
- **PostgreSQL** 15+ (RDS, Cloud SQL, ou self-hosted)
- **Redis** 7+ (ElastiCache, MemoryStore, ou self-hosted)
- **Elasticsearch** 8+ (Elastic Cloud ou self-hosted)
- **S3-compatible storage** (AWS S3, MinIO, etc.)
- **Load Balancer** (ALB, NLB, ou Nginx)
- **Domain & DNS** configuré

### Outils Nécessaires

```bash
# Kubernetes CLI
kubectl version

# Docker
docker --version

# Helm (optionnel)
helm version

# Terraform (pour IaC)
terraform --version
```

## 🌍 Environnements

### Development
- URL: `https://dev.tikeo.com`
- Base de données: PostgreSQL dev
- Auto-deploy sur push vers `develop`

### Staging
- URL: `https://staging.tikeo.com`
- Base de données: PostgreSQL staging (copie prod)
- Deploy manuel ou auto sur tag `staging-*`

### Production
- URL: `https://tikeo.com`
- Base de données: PostgreSQL prod (haute disponibilité)
- Deploy manuel uniquement
- Rollback automatique en cas d'erreur

## 🐳 Déploiement Docker

### Build des Images

```bash
# Build toutes les images
docker-compose build

# Build une image spécifique
docker build -f infrastructure/docker/Dockerfile.api-gateway -t tikeo/api-gateway:latest .
docker build -f infrastructure/docker/Dockerfile.web -t tikeo/web:latest .
```

### Push vers Registry

```bash
# Tag les images
docker tag tikeo/api-gateway:latest registry.tikeo.com/api-gateway:v1.0.0
docker tag tikeo/web:latest registry.tikeo.com/web:v1.0.0

# Push vers registry
docker push registry.tikeo.com/api-gateway:v1.0.0
docker push registry.tikeo.com/web:v1.0.0
```

### Docker Compose Production

```bash
# Démarrer en production
docker-compose -f docker-compose.prod.yml up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

## ☸️ Déploiement Kubernetes

### 1. Créer le Namespace

```bash
kubectl apply -f infrastructure/kubernetes/namespace.yaml
```

### 2. Configurer les Secrets

```bash
# Créer les secrets
kubectl create secret generic tikeo-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=jwt-secret="..." \
  --from-literal=stripe-key="..." \
  -n tikeo

# Vérifier
kubectl get secrets -n tikeo
```

### 3. Déployer les Services

```bash
# Déployer l'API Gateway
kubectl apply -f infrastructure/kubernetes/api-gateway-deployment.yaml

# Déployer le Frontend Web
kubectl apply -f infrastructure/kubernetes/web-deployment.yaml

# Déployer l'Ingress
kubectl apply -f infrastructure/kubernetes/ingress.yaml
```

### 4. Vérifier le Déploiement

```bash
# Vérifier les pods
kubectl get pods -n tikeo

# Vérifier les services
kubectl get services -n tikeo

# Vérifier l'ingress
kubectl get ingress -n tikeo

# Logs d'un pod
kubectl logs -f <pod-name> -n tikeo
```

### 5. Scaling

```bash
# Scale manuellement
kubectl scale deployment api-gateway --replicas=5 -n tikeo

# Auto-scaling (HPA déjà configuré)
kubectl get hpa -n tikeo
```

## 🌐 Configuration DNS

### Records DNS Requis

```
# Production
tikeo.com                A      <load-balancer-ip>
www.tikeo.com           CNAME   tikeo.com
api.tikeo.com           CNAME   tikeo.com

# Staging
staging.tikeo.com       A      <staging-lb-ip>
api.staging.tikeo.com   CNAME   staging.tikeo.com

# Development
dev.tikeo.com           A      <dev-lb-ip>
api.dev.tikeo.com       CNAME   dev.tikeo.com
```

## 🔒 SSL/TLS

### Avec Let's Encrypt (Cert-Manager)

```bash
# Installer cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Créer un ClusterIssuer
kubectl apply -f infrastructure/kubernetes/cert-issuer.yaml

# Les certificats seront automatiquement générés via l'Ingress
```

### Vérification SSL

```bash
# Vérifier le certificat
kubectl describe certificate tikeo-tls -n tikeo

# Tester HTTPS
curl -I https://tikeo.com
```

## 🔐 Variables d'Environnement

### Production

Créer un fichier `infrastructure/kubernetes/secrets.yaml` :

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: tikeo-secrets
  namespace: tikeo
type: Opaque
stringData:
  DATABASE_URL: "postgresql://user:pass@host:5432/tikeo"
  REDIS_URL: "redis://host:6379"
  JWT_SECRET: "your-super-secret-key"
  STRIPE_SECRET_KEY: "sk_live_..."
  OPENAI_API_KEY: "sk-..."
  AWS_ACCESS_KEY_ID: "..."
  AWS_SECRET_ACCESS_KEY: "..."
  RESEND_API_KEY: "re_..."
  SENTRY_DSN: "https://..."
```

Appliquer :

```bash
kubectl apply -f infrastructure/kubernetes/secrets.yaml
```

## 📊 Monitoring

### Sentry (Error Tracking)

```bash
# Configurer Sentry DSN dans les secrets
kubectl set env deployment/api-gateway SENTRY_DSN="https://..." -n tikeo
```

### Datadog (APM & Logs)

```bash
# Installer Datadog Agent
helm repo add datadog https://helm.datadoghq.com
helm install datadog-agent datadog/datadog \
  --set datadog.apiKey=<API_KEY> \
  --set datadog.site=datadoghq.com
```

### Prometheus & Grafana

```bash
# Installer Prometheus
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack

# Accéder à Grafana
kubectl port-forward svc/prometheus-grafana 3000:80
```

## 💾 Backup & Recovery

### Base de Données

```bash
# Backup automatique quotidien
# Configurer dans votre provider cloud (RDS, Cloud SQL, etc.)

# Backup manuel
kubectl exec -it <postgres-pod> -- pg_dump -U tikeo tikeo > backup.sql

# Restore
kubectl exec -i <postgres-pod> -- psql -U tikeo tikeo < backup.sql
```

### Fichiers (S3)

```bash
# Les fichiers sur S3 ont versioning activé
# Configurer lifecycle policies pour archivage
```

### Disaster Recovery Plan

1. **RTO (Recovery Time Objective)**: 1 heure
2. **RPO (Recovery Point Objective)**: 15 minutes
3. **Backups**: Quotidiens + snapshots horaires
4. **Multi-region**: Réplication dans 2 régions minimum

## 📈 Scaling

### Horizontal Pod Autoscaling

```yaml
# Déjà configuré dans les deployments
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Database Scaling

```bash
# PostgreSQL: Utiliser read replicas
# Redis: Utiliser Redis Cluster
# Elasticsearch: Ajouter des nodes
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Le pipeline est déjà configuré dans `.github/workflows/ci.yml` :

1. **Lint & Test** sur chaque PR
2. **Build** sur merge vers `main`
3. **Deploy** automatique vers staging
4. **Deploy** manuel vers production (avec approbation)

### Déploiement Manuel

```bash
# Tag une release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Le pipeline GitHub Actions se déclenche automatiquement
```

## 🚨 Rollback

### Kubernetes Rollback

```bash
# Voir l'historique
kubectl rollout history deployment/api-gateway -n tikeo

# Rollback vers version précédente
kubectl rollout undo deployment/api-gateway -n tikeo

# Rollback vers version spécifique
kubectl rollout undo deployment/api-gateway --to-revision=2 -n tikeo
```

## 📋 Checklist Pré-Déploiement

- [ ] Tests passent (unit, integration, e2e)
- [ ] Variables d'environnement configurées
- [ ] Secrets Kubernetes créés
- [ ] Base de données migrée
- [ ] SSL/TLS configuré
- [ ] DNS configuré
- [ ] Monitoring activé
- [ ] Backups configurés
- [ ] Load testing effectué
- [ ] Security audit passé
- [ ] Documentation à jour
- [ ] Équipe notifiée
- [ ] Plan de rollback prêt

## 📞 Support

En cas de problème en production :

1. **Vérifier les logs** : `kubectl logs -f <pod> -n tikeo`
2. **Vérifier les métriques** : Datadog/Grafana
3. **Vérifier Sentry** : Erreurs applicatives
4. **Contacter l'équipe** : ops@tikeo.com
5. **Rollback si nécessaire**

## 🔗 Ressources

- [Documentation Kubernetes](https://kubernetes.io/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/)
- [12 Factor App](https://12factor.net/)

---

**Bon déploiement ! 🚀**
