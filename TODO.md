# TODO - Correction build web + Docker Railway

- [x] 1. Corriger les exports UI partagés
  - [x] Mettre à jour `packages/ui/index.js` pour exporter les icônes utilisées
  - [x] Mettre à jour `packages/ui/index.d.ts` avec les types correspondants

- [ ] 2. Investigation ciblée erreurs `/404` et `/500`
  - [x] Lire `apps/web/app/layout.tsx`
  - [x] Lire `apps/web/app/providers.tsx`
  - [x] Lire `apps/web/app/components/Navbar.tsx`
  - [x] Vérifier les imports `@tikeo/ui` et la surface d’exports
  - [ ] Lire `apps/web/app/test.js`
  - [x] Lire `apps/web/next.config.js`
  - [ ] Neutraliser fichiers parasites potentiels (`app/test.js`, `dashboard/page 2.tsx`) si confirmé
  - [x] Vérifier l’existence de `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx` (manquants)
  - [x] Créer les fichiers d’erreur App Router manquants

- [x] 3. Validation build web
  - [x] Lancer `npm run build --workspace web`
  - [x] Vérifier disparition de l’erreur `Element type is invalid` (largement résolue)
  - [x] Corriger `TypeError: ... useContext` sur `/_error: /404` et `/_error: /500`
  - [x] Relancer build et confirmer succès complet

- [ ] 4. Corriger le build Docker Railway (api-gateway)
  - [ ] Vérifier et corriger le contexte de build / `COPY packages/ ./packages/`
  - [ ] Ajuster `services/api-gateway/Dockerfile` ou config Railway
  - [ ] Validation build Docker ciblé

- [ ] 5. Améliorations billets / scan / emails (QR + identité acheteur partout)
  - [ ] Enrichir backend tickets (buyer details complets + fallback invité)
  - [ ] Afficher identité acheteur complète sur scanner (résultat + historique)
  - [ ] Afficher identité titulaire sur page billets
  - [ ] Afficher identité acheteur côté dashboard commandes organisateur
  - [ ] Enrichir emails billet/PDF avec section vérification manuelle
  - [ ] Valider build web + tests API ciblés `tickets/validate`
