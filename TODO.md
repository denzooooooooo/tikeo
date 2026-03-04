# Scanner Improvements TODO

## Steps

- [x] 1. Update `tickets.service.ts` — SSE Subject, ownership check, scannedBy, auth
- [x] 2. Update `tickets.controller.ts` — JWT guard on validate, SSE endpoint
- [x] 3. Redesign `scanner/page.tsx` — Camera scan, SSE, JWT, improved UI
- [x] 4. Extract `useScannerLogic.ts` — hook with all logic

---

# Guest Checkout TODO

## Objectif
Permettre à un client d'acheter un billet sans être connecté, tout en collectant ses informations personnelles (prénom, nom, email, téléphone).

## Étapes

- [x] 1. Modifier `schema.prisma` — rendre `Order.userId` et `Ticket.userId` optionnels, ajouter `guestEmail` et `guestPhone` sur `Order`
- [x] 2. Modifier `orders.service.ts` — accepter `userId: null` pour les invités, valider `guestInfo`, stocker les infos invité
- [x] 3. Modifier `orders.controller.ts` — remplacer `JwtAuthGuard` par `OptionalJwtAuthGuard` sur `POST /orders`
- [x] 4. Modifier `payments.controller.ts` — remplacer `JwtAuthGuard` par `OptionalJwtAuthGuard` sur `create-payment-intent` et `confirm-payment`
- [x] 5. Modifier `checkout/page.tsx` — supprimer `<ProtectedRoute>`, ajouter formulaire infos invité, adapter l'appel API
