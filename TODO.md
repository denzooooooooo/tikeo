# TODO - Finalisation mails billets + pages tickets/commandes

- [x] 1. Analyse et plan validés avec l'utilisateur
  - [x] Identifier les causes: QR texte inutile dans mail, infos acheteur incomplètes, UX tickets/commandes

- [ ] 2. Backend email (`services/api-gateway/src/email/email.service.ts`)
  - [ ] Retirer l'affichage du QR texte dans le mail billet
  - [ ] Forcer affichage infos acheteur avec fallback "Non renseigné"
  - [ ] Renforcer logs d'échec pour envoi billets/confirmation commande
  - [ ] Vérifier cohérence from/reply-to

- [ ] 3. Web tickets (`apps/web/app/tickets/page.tsx`)
  - [ ] Lire `orderId` depuis query string
  - [ ] Filtrer automatiquement les billets de la commande ciblée
  - [ ] Améliorer affichage infos acheteur (nom/email/téléphone) dans modal + liste

- [ ] 4. Web commandes (`apps/web/app/orders/page.tsx`)
  - [ ] Étendre le type `Order` avec infos acheteur
  - [ ] Afficher infos acheteur dans le reçu/modal

- [ ] 5. Validation
  - [ ] Build web ciblé
  - [ ] Vérification fonctionnelle tickets/commandes
  - [ ] Vérification backend email (logs/send result)
