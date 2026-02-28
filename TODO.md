# TODO - Fix Like & Follow dans NearbyEventsSection

## Étapes

- [x] Analyser les fichiers : supabase-schema.sql, likes.service.ts, likes.controller.ts, LikeButton.tsx, FollowButton.tsx, NearbyEventsSection.tsx, page.tsx, events.service.ts
- [x] Modifier `apps/web/app/page.tsx` — ajouter `organizerId` et `likesCount` dans le mapping `getNearbyEvents()`
- [x] Modifier `apps/web/app/components/NearbyEventsSection.tsx` — connecter les boutons Like et Follow à l'API réelle
- [x] Corriger l'erreur TypeScript sur `organizerName` (type `never`)

## Problèmes identifiés
1. `handleLike` dans NearbyEventsSection = local state seulement, pas d'appel API
2. `handleFollow` dans NearbyEventsSection = local state seulement, pas d'appel API
3. `organizerId` manquant dans le mapping de page.tsx (nécessaire pour le follow)
4. `likesCount` non transmis (remplacé par Math.random())
