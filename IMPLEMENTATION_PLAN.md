# 📋 Tikeo - Plan d'Implémentation Complet

## 🚀 Stratégie d'Implémentation

### Phase 1: Core Authentication (Pages Essentielles)
1. `/forgot-password` - Mot de passe oublié
2. `/reset-password` - Réinitialisation mot de passe
3. Backend: Auth - Password Reset

### Phase 2: User Features (Fonctionnalités Utilisateur)
4. `/favorites` - Événements favoris
5. `/search` - Recherche avancée
6. `/organizers/[id]` - Profil organisateur

### Phase 3: Dashboard Organizer Complet
7. `/dashboard/events/[id]/analytics` - Analytics
8. `/dashboard/events/[id]/attendees` - Participants
9. `/dashboard/promotions` - Codes promo
10. `/dashboard/team` - Gestion équipe

### Phase 4: Pages Informatives Complètes
11. `/blog` - Blog
12. `/help` - Centre d'aide
13. `/pricing` - Tarifs
14. `/affiliate` - Programme affiliation

---

## 📁 Structure des Fichiers à Créer

### Backend (NestJS)
```
services/api-gateway/src/auth/
├── auth.controller.ts (ajouter forgot/reset)
├── auth.service.ts (ajouter reset logic)
├── dto/
│   ├── forgot-password.dto.ts
│   └── reset-password.dto.ts
└── strategies/

services/api-gateway/src/users/
├── users.module.ts
├── users.service.ts
├── users.controller.ts
└── dto/

services/api-gateway/src/favorites/
├── favorites.module.ts
├── favorites.service.ts
├── favorites.controller.ts
└── dto/

services/api-gateway/src/search/
├── search.module.ts
├── search.service.ts
├── search.controller.ts
└── elasticsearch.service.ts

services/api-gateway/src/organizers/
├── organizers.module.ts
├── organizers.service.ts
├── organizers.controller.ts
└── dto/

services/api-gateway/src/promotions/
├── promotions.module.ts
├── promotions.service.ts
├── promotions.controller.ts
└── dto/

services/api-gateway/src/blog/
├── blog.module.ts
├── blog.service.ts
├── blog.controller.ts
└── dto/
```

### Frontend (Next.js)
```
apps/web/app/
├── (auth)/
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
├── favorites/page.tsx
├── search/page.tsx
├── organizers/[id]/page.tsx
├── help/page.tsx
├── blog/page.tsx
├── blog/[slug]/page.tsx
├── pricing/page.tsx
├── affiliate/page.tsx
└── dashboard/
    ├── analytics/page.tsx
    ├── promotions/page.tsx
    ├── team/page.tsx
    └── events/[id]/
        ├── analytics/page.tsx
        ├── attendees/page.tsx
        └── promotions/page.tsx

apps/web/app/components/
├── SearchBar.tsx
├── FiltersSidebar.tsx
├── EventMap.tsx
├── EventGallery.tsx
├── CountdownTimer.tsx
├── SocialShare.tsx
├── NotificationDropdown.tsx
├── UserAvatarMenu.tsx
├── NewsletterForm.tsx
└── TestimonialsSlider.tsx

apps/web/app/context/
├── AuthContext.tsx
├── FavoritesContext.tsx
├── SearchContext.tsx
└── NotificationsContext.tsx
```

### UI Components (À ajouter)
```
packages/ui/src/components/
├── Modal.tsx
├── Dropdown.tsx
├── Select.tsx
├── Checkbox.tsx
├── Radio.tsx
├── Toggle.tsx
├── Slider.tsx
├── DatePicker.tsx
├── TimePicker.tsx
├── DateRangePicker.tsx
├── Avatar.tsx
├── Badge.tsx
├── Chip.tsx
├── Tooltip.tsx
├── Popover.tsx
├── Skeleton.tsx
├── Spinner.tsx
├── Toast.tsx
├── Alert.tsx
├── Tabs.tsx
├── Accordion.tsx
├── Carousel.tsx
├── Pagination.tsx
├── Rating.tsx
├── Progress.tsx
├── Timeline.tsx
├── Table.tsx
└── EmptyState.tsx
```

---

## 🎯 Ordre de Priorité

### Semaine 1: Authentication
1. forgot-password page + backend
2. reset-password page + backend
3. Améliorer login/register

### Semaine 2: User Features
4. Favorites page + backend
5. Search page + Elasticsearch
6. Organizer profile page

### Semaine 3: Dashboard
7. Dashboard analytics
8. Team management
9. Promotions/Codes promo

### Semaine 4: Content Pages
10. Blog
11. Help center
12. Pricing page

---

**Dernière mise à jour :** 2024

