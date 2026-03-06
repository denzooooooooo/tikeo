# Admin Improvements TODO

## Phase 1: Supprimer Utilisateurs & Événements (Backend) ✅
- [x] 1. Ajouter endpoint DELETE /admin/users/:id dans admin.controller.ts
- [x] 2. Ajouter méthode deleteUser dans admin.service.ts
- [x] 3. Ajouter endpoint DELETE /admin/events/:id dans admin.controller.ts
- [x] 4. Ajouter méthode deleteEvent dans admin.service.ts

## Phase 2: Page Admin Utilisateurs (Frontend) ✅
- [x] 5. Ajouter bouton supprimer avec modal de confirmation
- [x] 6. Appeler l'API de suppression

## Phase 3: Page Admin Événements (Frontend) ✅
- [x] 7. Ajouter bouton supprimer avec modal de confirmation
- [x] 8. Ajouter actions pour changer le statut (PUBLISH, CANCEL, POSTPONE)
- [x] 9. Appeler les APIs correspondantes

## Phase 4: Page Billets Admin ✅
- [x] 10. Ajouter filtre par événement (dropdown)
- [x] 11. Ajouter recherche par QR code
- [x] 12. Ajouter export des billets (CSV)
- [x] 13. Ajouter statistiques (total, valides, utilisés)

## Phase 5: Page Billets Utilisateur (/tickets) ✅
- [x] 14. Ajouter filtre par événement
- [x] 15. Grouper les billets par événement (sections dépliables)
- [x] 16. Améliorer l'affichage avec cartes dépliables par événement

---

## Notes:
- Les emails de payout sont déjà implémentés!
  - "Action requise: configurez vos informations de paiement" → /dashboard/settings
  - "Paiement reçu!" avec montant, méthode, référence, date et solde restant

