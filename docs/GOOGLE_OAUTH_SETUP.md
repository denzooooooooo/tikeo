# Configuration Google OAuth - Tikeo

## ⚠️ Problème 404 détecté

Si vous voyez une erreur 404 en cliquant sur "Continuer avec Google", voici les causes possibles et les solutions:

### Cause 1: API Gateway non démarré
L'API Gateway doit être en cours d'exécution pour que l'authentification fonctionne.

**Solution:**
```bash
cd services/api-gateway
npm run start:dev
```

### Cause 2: Variable d'environnement manquante
L'application web a besoin de l'URL de l'API.

**Solution - Créer le fichier `apps/web/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Cause 3: Configuration Google Cloud Console
Vérifiez que les URIs de redirection sont corrects.

## Étape 1: Variables d'environnement (DÉJÀ CONFIGURÉES)

Les variables d'environnement sont déjà configurées dans `services/api-gateway/.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
```

## Étape 2: Base de données (DÉJÀ CONFIGURÉ)

Le schéma Prisma a été mis à jour avec les champs `provider` et `providerId` dans le modèle User.

## Étape 3: Configurer Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. Allez dans **API et services** > **Identifiants**
4. Cliquez sur votre ID client OAuth 2.0
5. Ajoutez les URIs de redirection autorisés:
   - `http://localhost:3001/auth/google/callback`
   - `https://votre-domaine.com/auth/google/callback` (pour la production)

## URLs d'authentification

- Connexion Google: `http://localhost:3001/auth/google`
- Callback: `http://localhost:3001/auth/google/callback`

## Résolution de problèmes

### Erreur "redirect_uri_mismatch"
- Vérifiez que l'URI de redirection dans Google Cloud Console correspond exactement à `GOOGLE_CALLBACK_URL`

### Erreur "invalid_client"
- Vérifiez que le CLIENT_ID et CLIENT_SECRET sont corrects

### Pour la production
- Ajoutez votre domaine de production aux URIs autorisés
- Utilisez HTTPS
