# 📊 Todo - Espace Administrateur Tikeo
## Version Complète - Gestion Totale de la Platforme

---

## 🔐 1. AUTHENTIFICATION & SÉCURITÉ
- [ ] Connexion admin (email + mot de passe)
- [ ] JWT Token spécifique admin
- [ ] Permissions par rôle (Super Admin, Admin Finance, Admin Modération)
- [ ] Sessions actives (voir qui est connecté)
- [ ] Connexions suspectes (logs)
- [ ] 2FA pour les admins

---

## 👥 2. GESTION DES UTILISATEURS
### Liste & Recherche
- [ ] Liste paginée de tous les utilisateurs
- [ ] Recherche par : email, nom, prénom, ID
- [ ] Filtres : rôle, statut, date inscription, pays
- [ ] Tri : récent, ancien, plus actif
- [ ] Export CSV/Excel

### Profils Utilisateurs
- [ ] Voir profil complet
- [ ] Historique des commandes
- [ ] Événements créés (si organisateur)
- [ ] Billets achetés
- [ ] Commentaires/avis laissés
- [ ] Favoris
- [ ] Sessions de vote

### Actions Admin
- [ ] Modifier rôle utilisateur
- [ ] Suspendre compte temporairement
- [ ] Bannir définitivement
- [ ] Supprimer compte (avec consentement RGPD)
- [ ] Envoyer message direct
- [ ] Reset mot de passe

---

## 🎪 3. GESTION DES ÉVÉNEMENTS
### Liste & Recherche
- [ ] Tous les événements (tous statuts)
- [ ] Filtres : 
  - Statut (Brouillon, En attente, Publié, Terminé, Annulé)
  - Catégorie
  - Date (passé, à venir, cette semaine, ce mois)
  - Organisateur
  - Ville/Pays
- [ ] Recherche par titre, description, organisateur
- [ ] Tri : date, ventes, revenus

### Détails Événement
- [ ] Informations complètes
- [ ] Médias (images, vidéos)
- [ ] Billetterie (types de billets, prix, quantités)
- [ ] Lieu (adresse, map)
- [ ] Organisateur (coordonnées)
- [ ] Billets vendus (nombre, revenus)
- [ ] Participants check-in

---

## 🎫 4. GESTION DES BILLETS
### Inventaire
- [ ] Tous les billets système
- [ ] Filtres : événement, statut, type, date achat
- [ ] Recherche : ID billet, ID commande, email acheteur

### Statuts Billets
- [ ] Valide (non utilisé)
- [ ] Utilisé (scanné)
- [ ] Expiré
- [ ] Annulé
- [ ] Remboursé

### Actions
- [ ] Valider billet manuellement
- [ ] Annuler billet
- [ ] Rembourser billet
- [ ] Envoyer nouveau billet (re-send)
- [ ] Imprimer billet PDF

### Traçabilité
- [ ] Historique des scans (qui, quand, où)
- [ ] QR codes utilisés
- [ ] Tentatives de fraude

---

## 💰 5. 💎 PAIEMENTS & COMMISSIONS (CRUCIAL)

### Vue d'Ensemble (Dashboard Financier)
- [ ] **Total des ventes** (brut) - temps réel
- [ ] **Ma commission** (1% du brut)
- [ ] **Net à payer aux organisateurs** (99%)
- [ ] **Montant déjà payé** aux orgas
- [ ] **Montant en attente** de paiement

### Graphiques & Stats
- [ ] Ventes journalières/semancières/mensuelles
- [ ] Revenus par période
- [ ] Comparaison vs période précédente
- [ ] Top événements par revenus
- [ ] Top organisateurs

### Gestion par Organisateur
- [ ] Liste complète des organisateurs :
  - Nom/Entreprise
  - Email, téléphone
  - Total ventes événements
  - Ma commission (1%)
  - Montant à payer (99%)
  - Déjà payé
  - En attente
  - Statut payout (Configuré / Non configuré / En cours)
- [ ] Détail par événement
- [ ] Voir IBAN/coordonnées bancaires

### Traitement des Paiements
- [ ] Bouton "Payer" pour chaque organisateur
- [ ] Paiement groupé (plusieurs orgas)
- [ ] Générer virement SEPA
- [ ] Envoyer email notification paiement
- [ ] Télécharger bordereau

### Historique Financier
- [ ] Journal complet des transactions
- [ ] Filtres : date, organisateur, statut
- [ ] Détail : Command ID, montant brut, commission, net, date paiement
- [ ] Export CSV accounting

### Calcul Transparent
```
Ventes Totales:     10 000€
- Commission 1%:      - 100€
= Net Organisateurs:  9 900€
```

---

## 🏢 6. GESTION DES ORGANISATEURS
### Liste
- [ ] Tous les organisateurs
- [ ] Filtrer par : statut, events actifs, revenus
- [ ] Recherche : nom, email, entreprise

### Fiche Organisateur
- [ ] Profil complet
- [ ] Événements créés (histogramme)
- [ ] Revenus totaux générés
- [ ] Configuration payout
- [ ] Historique des paiements reçus

### Outils
- [ ] Envoyer email groupé aux orgas
- [ ] Créer événement pour un orgas
- [ ] Gérer commission personnalisée (si besoin)

---

## 📦 7. CODES PROMOS & COUPONS
### Gestion
- [ ] Liste tous les codes
- [ ] Créer nouveau code
- [ ] Modifier code existant
- [ ] Dupliquer code
- [ ] Supprimer/désactiver

### Configuration Code
- [ ] Code promo (texte)
- [ ] Type : % ou montant fixe
- [ ] Valeur
- [ ] Limite d'utilisation (global + par user)
- [ ] Date début/fin
- [ ] Événements applicables (tous ou selection)
- [ ] Types de billets applicables

### Stats
- [ ] Nombre d'utilisations
- [ ] Réduction totale offerte
- [ ] Code le plus utilisé

---

## 📊 8. STATISTIQUES & ANALYTICS

### KPIs Principaux
- [ ] Utilisateurs totaux / actifs
- [ ] Événements totaux / actifs
- [ ] Billets vendus
- [ ] Chiffre d'affaires
- [ ] Panier moyen

### Graphiques
- [ ] Ventes dans le temps (line chart)
- [ ] Répartition par catégorie (pie)
- [ ] Top événements
- [ ] Top organisateurs
- [ ] Géographie (ventes par pays/ville)

### Rapports
- [ ] Générer rapport PDF
- [ ] Export données brutes
- [ ] Rapports automatisés (email quotidien/hebdo)

---

## 📝 9. CONTENUS & BLOG

### Articles Blog
- [ ] Liste articles
- [ ] Créer/modifier/supprimer
- [ ] Catégories
- [ ] Tags
- [ ] Statut : brouillon/publié

### Médiathèque
- [ ] Images uploadées
- [ ] Vidéos
- [ ] Documents
- [ ] Organisation par dossiers

---

## 🔔 10. NOTIFICATIONS & EMAILS

### Notifications Système
- [ ] Envoyer notification push (tous users)
- [ ] Envoyer email groupé
- [ ] Notifications par rôle
- [ ] Planifier envoi différé

### Templates
- [ ] Modifier emails transactionnels
- [ ] Modifier notifications push
- [ ] Tests d'envoi

---

## ⚙️ 11. PARAMÈTRES SYSTÈME

### Général
- [ ] Nom de la plateforme
- [ ] Logo, favicon
- [ ] Couleurs thème
- [ ] Langue par défaut

### Commission
- [ ] Taux de commission (1%)
- [ ] Frais de plateforme (optionnel)
- [ ] Minimum payout

### Paiements
- [ ] Stripe configuration
- [ ] Mode test/production
- [ ] Webhooks

### Email
- [ ] SMTP configuration
- [ ] Sender email
- [ ] Templates emails

### Sécurité
- [ ] Politique mot de passe
- [ ] Sessions timeout
- [ ] IPs whitelist

---

## 📋 12. LOGS & AUDIT

### Journal des Actions
- [ ] Qui a fait quoi
- [ ] Quand
- [ ] Détail avant/après
- [ ] IP source

### Accès
- [ ] Logs connexion admin
- [ ] Logs erreurs
- [ ] Performance API

---

## 🔧 13. MAINTENANCE

### Système
- [ ] Mode maintenance (on/off)
- [ ] Page temporaire
- [ ] Clear cache
- [ ] Backup base données

### Mises à jour
- [ ] Version actuelle
- [ ] Dernière mise à jour
- [ ] Notes de version

---

## 📱 14. API & DÉVELOPPEURS

### Gestion API
- [ ] Clés API existantes
- [ ] Générer nouvelle clé
- [ ] Limiter accès par IP
- [ ] Logs usage API

### Webhooks
- [ ] Liste webhooks
- [ ] Ajouter webhook
- [ ] Tester webhook

---

## 🌍 15. MULTILINGUE & i18n

### Langues
- [ ] Langues actives
- [ ] Traductions existantes
- [ ] Ajouter nouvelle langue
- [ ] Traduire interface admin

---

## 📈 16. FONCTIONNALITÉS AVANCÉES

### AI / Automation
- [ ] Suggestions d'événements
- [ ] Détection fraude automatique
- [ ] Alertes anomalies ventes

### Partenariats
- [ ] Gestion affiliés
- [ ] Codes par partenaire
- [ ] Commissions affiliés

### Concours
- [ ] Défis/Concours
- [ ] Votes
- [ ] Classements

---

## 🎯 RÉSUMÉ CRUCIAL - PAIEMENTS

En tant qu'admin Tikeo, tu dois voir :

| Métrique | Description |
|----------|-------------|
| Ventes Brutes | Total euros collectées |
| Ma Commission | 1% des ventes |
| À Payer Organisateurs | 99% des ventes |
| Payé | Déjà versé aux orgas |
| En Attente | Non encore payé |

**Actions possibles :**
- [ ] Voir détail par organisateur
- [ ] Calculer montant exact (brut - commission)
- [ ] Initier paiement
- [ ] Confirmer paiement effectué
- [ ] Historique complet
- [ ] Export comptable

