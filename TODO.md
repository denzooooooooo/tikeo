# TODO - Emails acheteur/vendeur (PDF + reporting)

- [x] Installer dépendances PDF backend (`pdfkit`, `@types/pdfkit`)
- [ ] Phase 1
  - [ ] Générer billet PDF dans `EmailService` (design + QR)
  - [ ] Envoyer billet en pièce jointe PDF dans `sendTicketEmail`
  - [ ] Mettre texte email acheteur en FR: "Cher client, voici votre billet..."
  - [ ] Ajouter rappel vendeur si infos payout manquantes (trigger vente)
- [ ] Phase 2
  - [ ] Ajouter email hebdomadaire vendeur (stats ventes, CA brut, commission, net)
  - [ ] Ajouter logique scheduler/cron hebdo jusqu'à fin d'événement
  - [ ] Ajouter rappel dashboard vendeur pour infos payout manquantes
  - [ ] Afficher revenu net clair (après commission) côté dashboard
- [ ] Vérifications
  - [ ] Type-check api-gateway
  - [ ] Type-check web
  - [ ] Tests API critiques (emails/notifications/reporting)
