# TIKEO - TODO: Intégration API Backend → Frontend

## 🚨 PRIORITÉ CRITIQUE - À FAIRE IMMÉDIATEMENT

### 1. LikeButton - Intégration API
**Fichier:** `packages/ui/src/components/LikeButton.tsx`
- [ ] Connecter le toggle à l'API `/likes` 
- [ ] Gérer l'état isLiked depuis le backend
- [ ] Mettre à jour le compteur likes

### 2. FollowButton - Intégration API
**Fichier:** `packages/ui/src/components/FollowButton.tsx`
- [ ] Connecter le follow/unfollow à l'API `/likes/follow`
- [ ] Gérer l'état isFollowing depuis le backend

### 3. ReviewForm - Intégration API
**Fichier:** `packages/ui/src/components/ReviewForm.tsx`
- [ ] Soumettre les reviews à l'API `/reviews`
- [ ] Afficher les reviews existantes sur la page événement
- [ ] Calculer la note moyenne

### 4. PromoCodeInput - Intégration API
**Fichier:** `packages/ui/src/components/PromoCodeInput.tsx`
- [ ] Valider le code promo via `/promo-codes/validate`
- [ ] Appliquer la réduction au panier

### 5. Page Fil d'Activité
**Fichier:** `apps/web/app/activity/page.tsx`
- [ ] Connecter à l'API `/activity-feed`
- [ ] Afficher les activités des utilisateurs suivis

---

## 📋 AUTRES TÂCHES

### Pages Dashboard Organisateur
- [ ] `/dashboard/events` - Liste des événements avec filtres
- [ ] `/dashboard/events/[id]/analytics` - Statistiques par événement
- [ ] `/dashboard/promo-codes` - Gestion complète des codes promo

### SEO & Meta
- [ ] Meta tags dynamiques pour chaque page événement
- [ ] Schema.org Event JSON-LD
- [ ] Open Graph images

### Performance
- [ ] Implémenter ISR pour les pages événements
- [ ] Optimiser les images avec next/image
- [ ] Ajouter un skeleton loader全局

---

*Créé le ${new Date().toLocaleDateString('fr-FR')}*

