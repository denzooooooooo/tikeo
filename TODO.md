# TODO - Ticket email/PDF design parity + buyer identity

- [x] 1. Analyse des sources de design billet
  - [x] Vérifier propagation de `ticketDesign*` depuis `orders.service.ts`
  - [x] Vérifier consommation dans `email.service.ts` (HTML + PDF)

- [ ] 2. Améliorer PDF billet (template-aware)
  - [ ] Implémenter rendu par template (`CLASSIC`, `MODERN`, `MINIMAL`) avec fallback
  - [ ] Appliquer couleurs/texte/background issus du design vendeur
  - [ ] Conserver QR optionnel (`showQr`)
  - [ ] Ajouter infos acheteur obligatoires avec fallback “Non renseigné”
  - [ ] Ajouter bloc “Vérification manuelle” (commande + billet + QR texte)

- [ ] 3. Améliorer email billet (HTML)
  - [ ] Ajouter bloc “Informations acheteur” robuste (fallbacks)
  - [ ] Ajouter bloc “Détails commande”
  - [ ] Ajouter bloc “Contrôle à l’entrée” clair
  - [ ] Respecter le design vendeur (titre/couleurs/background)

- [ ] 4. Validation
  - [ ] Build ciblé backend (`api-gateway`)
  - [ ] Vérifier absence d’erreurs TS/Lint bloquantes
