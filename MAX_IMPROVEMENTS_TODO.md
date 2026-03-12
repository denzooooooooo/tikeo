# 🚀 TIKEO — TODO COMPLET D’AMÉLIORATIONS (MAXIMUM, SANS LIMITES)

> Objectif: lister **tout** ce qui peut être amélioré (produit, UX, front, back, sécurité, perf, SEO, QA, ops, data, admin, scanner, emails, QR, paiement, conformité).
>  
> Statut global recommandé: traiter d’abord **P0/P1** puis dérouler le reste en lots.

---

## Légende Priorités
- **P0** = critique prod / sécurité / paiement / billetterie
- **P1** = fort impact business / conversion / fiabilité
- **P2** = amélioration importante UX/maintenabilité
- **P3** = optimisation confort / polish

---

## 0) BLOQUANTS ENVIRONNEMENT & QUALITÉ DE BASE

- [ ] **P0** Corriger environnement local cassé (`next` package JSON corrompu).
  - [ ] Supprimer `node_modules` + reinstall propre
  - [ ] Vérifier lockfile cohérent mono-repo
  - [ ] Ajouter script “doctor” pour vérifier dépendances critiques
- [ ] **P1** Ajouter pipeline CI minimum (lint + typecheck + tests smoke)
- [ ] **P1** Ajouter checks PR obligatoires (build web + build api)
- [ ] **P2** Uniformiser versions Node/NPM via `.nvmrc` + engines package.json
- [ ] **P2** Ajouter script de santé repo (`npm run doctor`)

---

## 1) SÉCURITÉ AUTH / SESSION / DONNÉES (CRITIQUE)

- [ ] **P0** Migrer auth token de `localStorage` vers cookies `HttpOnly` + `Secure` + `SameSite`
- [ ] **P0** Mettre en place stratégie CSRF robuste (double-submit/csrf token)
- [ ] **P0** Rotation et expiration stricte refresh/access tokens
- [ ] **P0** Hardening endpoints sensibles (orders/payments/tickets/admin)
- [ ] **P1** Rate limiting global + spécifique login/register/password reset
- [ ] **P1** Protection brute-force + lockout progressif
- [ ] **P1** Ajouter audit logs sécurité (login, admin actions, payout, remboursement)
- [ ] **P1** Validation stricte inputs backend (DTO + sanitization)
- [ ] **P1** Masquage données sensibles dans logs
- [ ] **P1** CSP headers, X-Frame-Options, Referrer-Policy, Permissions-Policy
- [ ] **P1** Vérifier CORS strict par environnement
- [ ] **P1** Signature/anti-rejeu pour QR et tickets
- [ ] **P2** Détection anomalies commandes (fraude simple rules)
- [ ] **P2** 2FA optionnel pour admins/organisateurs

---

## 2) PAIEMENT / CHECKOUT / MONÉTIQUE

- [ ] **P0** Supprimer toute devise hardcodée (`€`) dans checkout
- [ ] **P0** Centraliser **une seule** logique de format prix/devise (frontend + backend)
- [ ] **P0** Exiger `currency` au niveau Event (pas de fallback approximatif pays)
- [ ] **P0** Vérifier total serveur autoritaire (jamais confiance client)
- [ ] **P0** Idempotency keys sur création commande & payment intent
- [ ] **P1** Gérer cas double-clic / refresh pendant paiement
- [ ] **P1** Webhooks Stripe robustes + retries + observabilité
- [ ] **P1** États commande complets (PENDING, PAID, FAILED, EXPIRED, REFUNDED, PARTIAL)
- [ ] **P1** Afficher breakdown détaillé: sous-total, frais service, taxes, réduction
- [ ] **P1** Gestion promo-codes exhaustive:
  - [ ] validité temporelle
  - [ ] quotas
  - [ ] usage par user
  - [ ] cumul/non-cumul
  - [ ] restrictions event/ticketType
- [ ] **P1** Checkout guest solide:
  - [ ] validation email/téléphone
  - [ ] anti-typo email
  - [ ] confirmation email obligatoire
- [ ] **P2** Support multi-moyens paiement (MM, wallet, virement)
- [ ] **P2** Sauvegarde panier/checkout abandonné
- [ ] **P2** Relance checkout abandonné (email/push)

---

## 3) BILLETS / QR / SCANNER (OPÉRATIONNEL ÉVÉNEMENT)

- [ ] **P0** Remplacer dépendance QR externe (`api.qrserver.com`) par génération interne
  - [ ] QR signé backend (payload minimal + signature + expiry)
  - [ ] fallback local render (canvas/SVG)
- [ ] **P0** Vérification scanner online/offline
  - [ ] mode offline cache + sync
  - [ ] prévention double scan concurrence
- [ ] **P0** Anti-fraude: nonce/rolling token optionnel
- [ ] **P1** Temps de scan < 300ms cible
- [ ] **P1** Journal de scans (qui, quand, device, résultat)
- [ ] **P1** Gestion états ticket précise (VALID/USED/CANCELLED/REFUNDED/VOID)
- [ ] **P1** Réémission ticket si email perdu
- [ ] **P1** Téléchargement PDF billet fiable + print template dédié
- [ ] **P2** Personnalisation design billet (thèmes avancés)
- [ ] **P2** Wallet pass (Apple Wallet / Google Wallet)
- [ ] **P2** Contrôle d’accès par tranches horaires/zones

---

## 4) EMAILS / COMMUNICATIONS

- [ ] **P0** Garantir délivrabilité email (SPF/DKIM/DMARC)
- [ ] **P1** Templates transactionnels complets:
  - [ ] confirmation commande
  - [ ] billet émis
  - [ ] paiement échoué
  - [ ] remboursement
  - [ ] rappel avant événement
- [ ] **P1** Tracking statut envoi/livraison/ouverture/clic
- [ ] **P1** Bouton “renvoyer billet”
- [ ] **P1** Gestion bounce/complaint/unsubscribe
- [ ] **P2** Versioning templates + prévisualisation admin
- [ ] **P2** I18n templates FR/EN + fallback
- [ ] **P2** Personnalisation branding organisateur

---

## 5) SEO / DÉCOUVRABILITÉ / PARTAGE

- [ ] **P0** Vérifier assets SEO manquants (ex. `/og-image.jpg`)
- [ ] **P1** Metadata page-level complète (title/desc/canonical/og/twitter)
- [ ] **P1** Structured data JSON-LD:
  - [ ] Event
  - [ ] Organization
  - [ ] BreadcrumbList
- [ ] **P1** Sitemap dynamique complet (events, organizers, legal)
- [ ] **P1** robots directives par environnement
- [ ] **P1** pages erreurs custom SEO-friendly
- [ ] **P2** OpenGraph image dynamique par événement
- [ ] **P2** SEO local (ville/pays/catégorie landing pages)
- [ ] **P3** Snippets enrichis FAQ/HowTo

---

## 6) PERFORMANCE FRONTEND (CORE WEB VITALS)

- [ ] **P0** Revoir `force-dynamic` et `revalidate=0` sur pages non nécessaires
- [ ] **P1** Segmenter SSR/ISR/CSR intelligemment
- [ ] **P1** Caching stratégique API (server fetch cache, stale-while-revalidate)
- [ ] **P1** Optimisation images (next/image, tailles, placeholders, formats webp/avif)
- [ ] **P1** Réduire JS bundle pages lourdes (split components)
- [ ] **P1** Eliminer re-renders coûteux (memoization sélective)
- [ ] **P2** Skeletons et loading UX uniformisés
- [ ] **P2** Prefetch routing stratégique
- [ ] **P2** Monitoring CWV réel (RUM)
- [ ] **P3** Optimisation animations/gradients sur mobile low-end

---

## 7) ACCESSIBILITÉ (A11Y)

- [ ] **P0** Navigation clavier 100% (menus, modals, forms, scanner views)
- [ ] **P1** `aria-label`, `aria-describedby`, `aria-invalid` partout nécessaire
- [ ] **P1** Focus management (modals, toasts, erreurs)
- [ ] **P1** Contrastes WCAG AA minimum
- [ ] **P1** Textes alternatives images/icônes
- [ ] **P2** Landmarks sémantiques (`main`, `nav`, `aside`, `footer`)
- [ ] **P2** Respect reduced motion
- [ ] **P2** Tests screen reader sur parcours achat & scan

---

## 8) UX / PRODUCT POLISH (GLOBAL)

- [ ] **P1** Harmoniser microcopy FR (accents, cohérence termes)
- [ ] **P1** Uniformiser composants CTA (couleurs/tailles/états)
- [ ] **P1** Messages erreurs explicites + actions de recovery
- [ ] **P1** Empty states utiles + liens vers action suivante
- [ ] **P2** Onboarding utilisateur (nouveau visiteur / acheteur / organisateur)
- [ ] **P2** Progress bars et étapes claires checkout & création event
- [ ] **P2** Confirmation modales pour actions sensibles
- [ ] **P2** Undo actions quand possible
- [ ] **P3** Personnalisation thèmes clair/sombre

---

## 9) PAGES PUBLIQUES (TOUTES)

- [ ] **P1** Home: fiabilité sections (events/countries/categories/organizers/newsletter)
- [ ] **P1** Events listing: tri/filtre/pagination robustes + URL params partageables
- [ ] **P1** Event detail:
  - [ ] sections complètes (description, lieu, tickets, avis, organisateur)
  - [ ] disponibilité en temps réel
  - [ ] CTA cohérents desktop/mobile
- [ ] **P1** Organizers page: crédibilité (stats, événements, follow, vérification)
- [ ] **P2** Search: pertinence résultats + suggestions
- [ ] **P2** Favorites: feedback instantané et sync server

---

## 10) AUTH PAGES

- [ ] **P0** Login/register/reset robustes (erreurs, latence, lockout)
- [ ] **P1** Validation formulaire unifiée + messages cohérents
- [ ] **P1** Callback OAuth robuste (state mismatch, token failure)
- [ ] **P1** Gestion redirects sécurisée (open redirect prevention)
- [ ] **P2** Password strength meter + politiques mot de passe
- [ ] **P2** MFA enrollment UX

---

## 11) PROFILE / SETTINGS / NOTIFICATIONS / ORDERS / TICKETS

- [ ] **P1** Profile: édition fiable + avatar upload + preview
- [ ] **P1** Settings: préférences email/notif/langue/devise
- [ ] **P1** Notifications: read/unread/bulk actions
- [ ] **P1** Orders:
  - [ ] historique complet
  - [ ] statuts lisibles
  - [ ] facture/receipt
- [ ] **P1** Tickets:
  - [ ] regroupement clair
  - [ ] filtrage performant
  - [ ] modal billet accessible
- [ ] **P2** Export CSV/PDF commandes/billets

---

## 12) DASHBOARD ORGANISATEUR (COMPLET)

- [ ] **P0** RBAC strict organisateur vs admin
- [ ] **P1** Event create/edit:
  - [ ] validations métier complètes
  - [ ] autosave brouillon
  - [ ] preview live page événement
- [ ] **P1** Ticket design:
  - [ ] templates fiables
  - [ ] tests impression/QR lisibilité
- [ ] **P1** Analytics:
  - [ ] conversion funnel
  - [ ] ventes par canal/date/type ticket
- [ ] **P1** Scanner:
  - [ ] robustesse perf et état
  - [ ] logs scan exportables
- [ ] **P1** Promo-codes:
  - [ ] CRUD complet + règles
  - [ ] visualisation usage
- [ ] **P1** Payouts:
  - [ ] statuts + justificatifs + timeline
- [ ] **P2** Collaboration équipe organisateur (multi-users roles)

---

## 13) ADMIN (COMPLET)

- [ ] **P0** Journal d’audit admin immuable
- [ ] **P0** Permissions fines par module/action
- [ ] **P1** Admin users/events/tickets/orders monitoring temps réel
- [ ] **P1** Outils anti-abus (suspension, blocage, justification)
- [ ] **P1** Modération contenu événements
- [ ] **P1** Gestion remboursements & litiges
- [ ] **P1** Notifications massives segmentées
- [ ] **P2** Dashboard SLA incidents/support
- [ ] **P2** Outils réconciliation finance

---

## 14) BACKEND API (NEST) — ROBUSTESSE

- [ ] **P0** Valider tous endpoints critiques avec tests intégration
- [ ] **P0** Transactions DB atomiques (orders+tickets+payments)
- [ ] **P0** Idempotence endpoints sensibles
- [ ] **P1** Schémas DTO stricts + erreurs standardisées
- [ ] **P1** Pagination uniforme sur toutes listes
- [ ] **P1** Tri/filtre sécurisés (no injection)
- [ ] **P1** Timeout/retry policy pour services externes
- [ ] **P1** Circuit breaker sur email/paiement
- [ ] **P2** Versioning API propre (`/v1`, `/v2`)
- [ ] **P2** Documentation OpenAPI exhaustive

---

## 15) DATA / PRISMA / DB

- [ ] **P0** Contraintes DB intégrité (FK, unique, checks)
- [ ] **P0** Indexes sur colonnes requêtées (events, orders, tickets scans)
- [ ] **P1** Soft delete stratégie claire + restore
- [ ] **P1** Migration strategy safe (forward/backward)
- [ ] **P1** Seeds réalistes multi-pays/devises
- [ ] **P2** Archivage historique scans/notifications
- [ ] **P2** Data retention policy RGPD

---

## 16) OBSERVABILITÉ / MONITORING / INCIDENTS

- [ ] **P0** Logs structurés corrélés (traceId/requestId)
- [ ] **P1** Monitoring erreurs front + back (Sentry/équivalent)
- [ ] **P1** Metrics business:
  - [ ] taux conversion checkout
  - [ ] taux échec paiement
  - [ ] scan success/fail
- [ ] **P1** Alerting incidents (paiement, email, API 5xx, latence)
- [ ] **P2** Dashboards Grafana/Datadog
- [ ] **P2** Runbooks incidents + postmortem template

---

## 17) TESTS (THOROUGH)

- [ ] **P0** Tests E2E parcours critique:
  - [ ] homepage → event → checkout → paiement → ticket → scan
- [ ] **P1** Tests API curl/postman sur happy/error/edge cases
- [ ] **P1** Tests unitaires utils prix/devise/date/statuts
- [ ] **P1** Tests intégration orders/payments/tickets/email
- [ ] **P1** Tests RBAC admin/organizer/user/guest
- [ ] **P2** Tests accessibilité automatisés
- [ ] **P2** Tests perf (Lighthouse + k6/autocannon)
- [ ] **P2** Tests régression visuelle (si browser tooling dispo)
- [ ] **P2** Matrice devices navigateurs

---

## 18) CONFORMITÉ LÉGALE / RGPD / TRUST

- [ ] **P0** Politique cookies conforme + consent mode réel
- [ ] **P1** DPA et registre traitements
- [ ] **P1** Droit à l’oubli/export données utilisateur
- [ ] **P1** CGU/CGV cohérentes avec flux remboursement
- [ ] **P1** Mentions légales complètes et à jour
- [ ] **P2** Gestion preuve consentement horodatée

---

## 19) INTERNATIONALISATION / MULTI-PAYS

- [ ] **P1** i18n FR/EN structurée
- [ ] **P1** Formats date/heure/numérique par locale
- [ ] **P1** Devises unifiées avec source de vérité
- [ ] **P2** Traduction complète emails + pages légales
- [ ] **P2** Support fuseaux horaires organisateur/utilisateur

---

## 20) DESIGN SYSTEM / MAINTENABILITÉ

- [ ] **P1** Extraire composants répétitifs (cards, badges, states, forms)
- [ ] **P1** Supprimer duplication logique (`getAuthToken`, `formatPrice`)
- [ ] **P1** Réduire `any` via types partagés `packages/types`
- [ ] **P2** Convention de nommage stricte + lint rules renforcées
- [ ] **P2** Storybook/Docs UI pour composants clés
- [ ] **P3** Tokens design (couleurs, spacing, radius) unifiés

---

## 21) ROADMAP EXÉCUTION RECOMMANDÉE

### Phase 1 (P0, 1–2 semaines)
- [ ] Sécurité auth cookies HttpOnly
- [ ] Devise/prix unifiés checkout + backend autoritaire
- [ ] QR interne signé + scanner anti-double scan
- [ ] Stabilisation environnement/CI
- [ ] Observabilité incidents critiques

### Phase 2 (P1, 2–4 semaines)
- [ ] Checkout complet + promo + emails robustes
- [ ] Dashboard/admin fiabilisés
- [ ] SEO + metadata + assets manquants
- [ ] Perf structurante SSR/ISR/cache

### Phase 3 (P2/P3, continu)
- [ ] Accessibilité complète
- [ ] Polish UX global
- [ ] Internationalisation avancée
- [ ] Optimisations business analytics

---

## 22) CHECKLIST PAGE PAR PAGE (COUVERTURE MAX)

- [ ] Home (`/`)
- [ ] Events list (`/events`)
- [ ] Event detail (`/events/[id]`)
- [ ] Checkout (`/events/[id]/checkout`)
- [ ] Tickets (`/tickets`)
- [ ] Orders (`/orders`)
- [ ] Search (`/search`)
- [ ] Favorites (`/favorites`)
- [ ] Notifications (`/notifications`)
- [ ] Organizer profile (`/organizers/[id]`)
- [ ] User profile (`/profile`, `/profile/[userId]`)
- [ ] Settings (`/settings`)
- [ ] Auth (`/login`, `/register`, `/forgot-password`, `/auth/callback`)
- [ ] Legal/info (`/about`, `/contact`, `/cookies`, `/cgu`, `/privacy`, `/terms`, `/mentions-legales`)
- [ ] Dashboard organizer (toutes sous-pages)
- [ ] Admin (toutes sous-pages)
- [ ] API routes front (`/api/health`, `/api/newsletter`, `/api/upload`)
- [ ] Error states (`not-found`, `error`, `global-error`)

---

## 23) “DEFINITION OF DONE” QUALITÉ FINALE

- [ ] 0 vulnérabilité critique ouverte
- [ ] 0 incohérence prix/devise sur parcours achat
- [ ] 0 dépendance QR critique externe
- [ ] Taux succès paiement/scanner au-dessus des objectifs
- [ ] CWV dans le vert sur pages stratégiques
- [ ] Couverture tests critique validée
- [ ] Documentation ops + runbooks à jour
- [ ] Admin audit trail complet et vérifiable

---

## 24) NOTES OPÉRATIONNELLES IMMÉDIATES

- [ ] Réparer runtime local pour permettre exécution tests “thorough”
- [ ] Activer environnement de test end-to-end reproductible
- [ ] Geler release si P0 non traités (paiement, sécurité, QR)

---

**Fin du TODO maximal.**  
Ce document sert de backlog maître pour transformer la plateforme au niveau production “enterprise-ready”.
