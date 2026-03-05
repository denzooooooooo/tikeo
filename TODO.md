# TODO - Audit et corrections email/notifications (Resend)

- [ ] Lire et auditer les services restants liés aux notifications/emails
  - [x] services/api-gateway/src/events/events.service.ts
  - [x] services/api-gateway/src/promo-codes/promo-codes.service.ts
  - [x] services/api-gateway/src/help/help.service.ts (introuvable côté FS malgré présence dans l’index VSCode)
  - [x] services/api-gateway/src/tickets/tickets.service.ts
- [ ] Identifier les actions métier qui doivent envoyer email + notification
- [ ] Corriger les gardes `userId` null avant création de notifications
- [ ] Ajouter les envois email manquants pour les notifications importantes
- [ ] Harmoniser logs de succès/erreur d’envoi email
- [ ] Vérifier build TypeScript api-gateway
- [ ] Résumer précisément les pages/features couvertes par les emails
