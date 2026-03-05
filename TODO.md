# TODO - Refonte emails + scanner billets

- [x] Lire les fichiers clés
  - [x] services/api-gateway/src/email/email.service.ts
  - [x] services/api-gateway/src/tickets/tickets.service.ts
  - [x] services/api-gateway/src/tickets/tickets.controller.ts
  - [x] apps/web/app/dashboard/scanner/page.tsx
  - [x] apps/web/app/dashboard/scanner/useScannerLogic.ts

- [ ] Implémentation
  - [ ] Refonte visuelle des templates email
  - [ ] Améliorer le rendu du billet dans email avec design organisateur
  - [ ] Ajouter reply-to/headers utiles dans l’envoi email
  - [ ] Renforcer validation QR backend (garde-fous/messages)
  - [ ] Améliorer scanner UI dark + fiabilité scan

- [ ] Vérifications après implémentation
  - [ ] Build API gateway
  - [ ] Tests API scanner/validate (curl)
  - [ ] Vérification fonctionnelle page scanner
  - [ ] Test envoi email template (endpoint test-email)
