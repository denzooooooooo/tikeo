# TODO - Ticket design links + email parity

- [x] Lire les fichiers clés
  - [x] apps/web/app/dashboard/events/create/page.tsx
  - [x] apps/web/app/dashboard/events/[id]/edit/page.tsx
  - [x] apps/web/app/dashboard/events/[id]/ticket-design/page.tsx
  - [x] services/api-gateway/src/email/email.service.ts
  - [x] apps/web/app/dashboard/scanner/useScannerLogic.ts

- [ ] Implémentation
  - [x] Supprimer formulaire inline design sur create event (garder uniquement logique lien/studio)
  - [x] Supprimer formulaire inline design sur edit event (garder uniquement lien studio)
  - [ ] Aligner sendTicketEmail sur le rendu preview du studio design
  - [ ] Mettre texte email: "Cher client, voici votre billet pour l’événement ..."
  - [ ] S’assurer que le QR valide est bien inséré et visible dans le mail
  - [ ] Finaliser fallback scanner si BarcodeDetector non supporté (mode manuel)

- [ ] Vérifications après implémentation
  - [ ] Build TypeScript web
  - [ ] Build TypeScript api-gateway
  - [ ] Vérification UI create/edit: lien studio seulement
  - [ ] Vérification rendu email billet + présence QR
