 # 🎯 TIKEO - PLAN DE TRANSFORMATION COMPLET
## Phase 1: Nettoyage et Structure (Pages à SUPPRIMER)
### Pages à supprimer définitivement:
- `/apps/web/app/careers/page.tsx` - Carrières
- `/apps/web/app/blog/page.tsx` - Blog  
- `/apps/web/app/press/page.tsx` - Presse
- `/apps/web/app/resources/page.tsx` - Ressources
- `/apps/web/app/affiliate/page.tsx` - Affiliation

### Pages à CONSERVER (Essentielles):
- ✅ `/` - Accueil (AVEC CARROUSEL HERO)
- ✅ `/events` - Liste événements
- ✅ `/events/[id]` - Détail événement
- ✅ `/events/categories` - Catégories
- ✅ `/organizers/[id]` - Profil organisateur
- ✅ `/votes` - Votes & Concours
- ✅ `/votes/[id]` - Détail vote
- ✅ `/votes/create` - Créer vote
- ✅ `/dashboard` - Dashboard utilisateur
- ✅ `/dashboard/events/create` - Créer événement
- ✅ `/dashboard/events/[id]/edit` - Modifier événement
- ✅ `/dashboard/events/[id]/analytics` - Analytics
- ✅ `/dashboard/orders` - Commandes
- ✅ `/dashboard/promo-codes` - Codes promo
- ✅ `/dashboard/settings` - Paramètres
- ✅ `/profile` - Profil utilisateur
- ✅ `/orders` - Mes commandes
- ✅ `/tickets` - Mes billets
- ✅ `/favorites` - Favoris
- ✅ `/search` - Recherche
- ✅ `/notifications` - Notifications
- ✅ `/activity` - Activité
- ✅ `/login` - Connexion
- ✅ `/register` - Inscription AVEC PAYS
- ✅ `/forgot-password` - Mot de passe oublié
- ✅ `/reset-password` - Réinitialisation
- ✅ `/about` - À propos
- ✅ `/contact` - Contact
- ✅ `/help` - Aide
- ✅ `/pricing` - Tarifs
- ✅ `/privacy` - Confidentialité
- ✅ `/terms` - CGU/Conditions
- ✅ `/cookies` - Cookies
- ✅ `/legal` - Mentions légales
- ✅ `/cgu` - CGU
- ✅ `/checkout` - Paiement

---

## Phase 2: DESIGN SYSTEM - Glassmorphism Bleu Ciel
### 2.1 Couleurs & Palette
```
COULEURS PRIMAIRES:
- Primary Blue: #5B7CFF (Bleu ciel principal)
- Primary Purple: #7B61FF (Violet)
- Sky Blue Light: #A8D4FF (Bleu ciel clair)
- Sky Blue Dark: #4A90D9 (Bleu ciel foncé)
- Gradient: linear-gradient(135deg, #5B7CFF 0%, #7B61FF 50%, #A8D4FF 100%)

COULEURS NEUTRES:
- Blanc: #FFFFFF
- Blanc cassé: #F8FAFC
- Gris très clair: #F1F5F9
- Gris clair: #E2E8F0
- Gris moyen: #94A3B8
- Noir: #0F172A
- Noir soft: #1E293B

COULEURS ACCENTS:
- Noir accent: #0A0A0A (sections noir)

VERIFICATIONS:
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
```

### 2.2 Glassmorphism -Classes utilitaires
```css
/* Glassmorphism Classes à créer */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-blue {
  background: linear-gradient(135deg, rgba(91, 124, 255, 0.2) 0%, rgba(123, 97, 255, 0.2) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(168, 212, 255, 0.3);
}

.glass-button {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(91, 124, 255, 0.15);
}

.glass-nav {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(168, 212, 255, 0.2);
}

.glass-footer {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(91, 124, 255, 0.1);
}

.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(91, 124, 255, 0.08);
}

.glass-input {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(168, 212, 255, 0.3);
}

.glass-input:focus {
  border-color: rgba(91, 124, 255, 0.6);
  box-shadow: 0 0 0 4px rgba(91, 124, 255, 0.1);
}
```

### 2.3 Tailwind Config - Mise à jour
```
FICHIER: packages/ui/tailwind.config.ts

1. Ajouter couleurs glass:
   - glass-50: rgba(255, 255, 255, 0.05)
   - glass-100: rgba(255, 255, 255, 0.1)
   - glass-200: rgba(255, 255, 255, 0.2)
   - glass-300: rgba(255, 255, 255, 0.3)
   - glass-400: rgba(255, 255, 255, 0.4)
   
2. Ajouter animations:
   - float: Animation flottement
   - pulse-glow: Pulse lumineux
   - shimmer-glass: Effet shimmer glass
   - slide-up-float: Slide up avec float

3. Ajouter blur sizes:
   - glass: blur(20px)
   - glass-sm: blur(10px)
   - glass-lg: blur(40px)
```

---

## Phase 3: ACCUEIL - Hero Carrousel Événements
### 3.1 Structure Hero Carrousel
```
COMPOSANT: HeroCarousel.tsx

CARACTERISTIQUES:
- Carrousel automatique (5 secondes)
- Navigation dots en bas
- Navigation flèches latérales
- Effet glassmorphism sur les cartes
- TEASER VIDEO après 1 seconde (si disponible)
- Affichage: 3 événements visibles sur desktop, 1 sur mobile
- Transition: slide avec effet 3D

CONTENU PAR SLIDE:
- Image de fond événement (coverImage)
- Titre événement
- Date et heure
- Lieu (Ville, Pays)
- Catégorie avec badge glass
- Prix "à partir de"
- Bouton "Voir l'événement" glass

SI TEASER VIDEO:
- Auto-play après 1 seconde
- Position: overlay en bas à droite
- Size: 300x170px (16:9)
- Contrôles: muets par défaut
- Bouton pour plein écran
- Fermer pour revenir à l'image
```

### 3.2 Sections Accueil
```
1. HERO CARROUSEL (100vh)
   - Carrousel événements vedettes
   - Teaser vidéo (si dispo)
   - Barre de recherche glass
   - Catégories rapides

2. ÉVÉNEMENTS PROCHES (Géolocalisés)
   - Titre: "Près de chez vous"
   - 6 cartes événements
   - Carte "Voir plus" glass
   - SI géoloc inactive: afficher par défaut pays utilisateur

3. ÉVÉNEMENTS POPULAIRES
   - Titre: "Les événements du moment"
   - Filtres: Ce week-end, Ce mois, Gratuit
   - 9 cartes événements
   - Pagination

4. CATÉGORIES EN Images
   - 8 catégories avec images de fond
   - Effet glass au hover
   - Compteur d'événements

5. ÉVÉNEMENTS PAR PAYS
   - Section par pays (si multi-pays)
   - Drapeau + Nom pays
   - 3 événements par pays

6. CONCOURS & VOTES
   - Titre: "Participez aux votes"
   - 3 concours actifs
   - Progress bar temps restant

7. STATISTIQUES
   - Nombres animés
   - Glass cards
   - Icônes avec glow

8. ORGANISATEURS EN VEDETTE
   - 6 organisateurs
   - Photo + Nom + Note

9. NEWSLETTER
   - Section glass bleu
   - Input email glass
   - Bouton glass

10. FOOTER
    - Style glass dark
    - Multi-colonnes
    - Réseaux sociaux
    - Legal links
```

---

## Phase 4: GÉOLOCALISATION - Système complet
### 4.1 Hook Géolocalisation
```
FICHIER: hooks/useGeolocation.ts

FONCTIONNALITES:
- Détection automatique position
- Demande permission navigateur
- Fallback: IP-based geolocation via API
- Stockage: localStorage + cookie
- Mise à jour: si changement detected

DONNÉES RETOURNÉES:
- country: string (FR, US, BE, etc.)
- countryName: string (France, United States, etc.)
- region: string (Île-de-France, etc.)
- city: string
- latitude: number
- longitude: number
- currency: string (EUR, USD, etc.)
- timezone: string

API FALLBACK:
- ipapi.co (gratuit)
- ou ip-api.com
```

### 4.2 Context Géolocalisation
```
FICHIER: context/GeolocationContext.tsx

FONCTIONS:
- Provider qui wrap l'app
- State: location, loading, error
- Fonctions: updateLocation, setManualCountry
- Storage cookies: 30 jours
```

### 4.3 Composant CountrySelector
```
COMPOSANT: components/CountrySelector.tsx

CARACTÉRISTIQUES:
- Liste 50+ pays avec drapeaux
- Search/filter pays
- Recent countries (les 5 derniers)
- Popular countries (top 10)
- Persistance choix utilisateur
```

### 4.4 Intégration Events
```
FILTRAGE PAR DÉFAUT:
- /events: automatically filter by user country
- Query params: ?country=FR&region=IDF
- Option "Tous les pays" disponible
- Saved filter in cookie

AFFICHAGE:
- Drapeau pays à côté de la ville
- "Événements à Paris, France"
- Changement facile via dropdown
```

---

## Phase 5: INSCRIPTION - Avec Pays
### 5.1 Mise à jour Formulaire Inscription
```
COMPOSANT: register/page.tsx

AJOUTS:
1. Country Selector (après email)
   - Dropdown avec drapeaux
   - Search pays
   - Required field
   
2. Consentements renforcés:
   - □ Recevoir notifications événements pays
   - □ Newsletter personnalisée
   - □ SMS reminders (opt-in)

3. Benefits régionaux affichés:
   - "Découvrez les événements en [Pays]"
   - "Soyez notifié des événements près de chez vous"
```

### 5.2 Backend - Mise à jour User
```
SCHEMA PRISMA:
model User {
  country      String    @default("FR")
  region       String?
  city         String?
  currency     String    @default("EUR")
  timezone     String?
  preferences  Json?     // Events preferences by country
}

API:
- POST /auth/register: accept country param
- GET /users/me: return location data
- PUT /users/me/location: update location
```

---

## Phase 6: CRÉATION ÉVÉNEMENT - Pays automatique
### 6.1 Formulaire Création Événement
```
COMPOSANT: dashboard/events/create/page.tsx

AJOUTS:
1. Country auto-filled depuis:
   - GeolocationContext
   - Profil utilisateur
   - Sinon: France par défaut
   
2. Modification possible:
   - Dropdown pays
   - Si changement: confirmation
   - Reset ville/region si nécessaire

3. Lieu avec Maps:
   - Adresse auto-complète
   - Carte interactive glass
   - Marqueur draggable
```

---

## Phase 7: ÉVÉNEMENTS - Page liste enrichie
### 7.1 Filtres Avancés
```
FILTRES À AJOUTER:
- [x] Catégories (déjà existant)
- [x] Ville (déjà existant)
- [x] Date (DATE RANGE PICKER)
- [x] Prix (PRICE RANGE SLIDER)
- [x] Pays (nouveau)
- [x] Région (nouveau)
- [ ]rayonn distance (km)
- [ ]rayonn Organisateur vérifié
- [ ]rayonn Événements gratuits
- [ ]rayonn Près de moi (géoloc)

COMPOSANTS:
- DateRangePicker: sélection date début/fin
- PriceRangeSlider: min/max prix
- CountryFilter: dropdown pays
- DistanceFilter: slider km
- VerifiedFilter: toggle
- FreeEventsFilter: toggle
```

### 7.2 Vue Carte
```
COMPOSANT: EventsMapView.tsx

CARACTÉRISTIQUES:
- Carte interactive (Leaflet/Mapbox)
- Marqueurs événements
- Cluster markers
- Filtre dans la carte
- Click marqueur → popup événement
- Style glass de la popup
```

---

## Phase 8: DETAIL ÉVÉNEMENT - Enrichi
### 8.1 Sections supplémentaires
```
SECTIONS À AJOUTER:
1. TEASER VIDEO (si dispo)
   - Auto-play après 1 seconde
   - Position: sous hero image
   - Size: grand format
   - Controls: play/pause, fullscreen

2. CARTE INTERACTIVE
   - Lieu sur carte glass
   - Itinéraire Google Maps
   - Transports à proximité

3. ÉVÉNEMENTS SIMILAIRES
   - Même catégorie, même ville
   - 4 événements suggérés

4. ORGANISATEUR EN DETAIL
   - Photo + Nom + Description
   - Événements organisés
   - Note moyenne
   - Bouton "Suivre"

5. TIMELINE ÉVÉNEMENT
   - Dates clés
   - Programme détaillé
   - Horaires

6. FAQ
   - Questions fréquentes
   - Accordéon glass

7. PARTAGE SOCIAL
   - Buttons glass
   - Copy link
```

---

## Phase 9: COMPOSANTS - Améliorations Glass
### 9.1 Navbar Glass
```
MISE À JOUR: Navbar.tsx

CHANGEMENTS:
- Background: glass-nav (rgba white 85% + blur)
- Logo: glass button
- Links: hover glass effect
- User menu: glass dropdown
- Search: glass input
- Create button: glass gradient
- Mobile menu: glass overlay
```

### 9.2 Footer Glass
```
MISE À JOUR: Footer.tsx

CHANGEMENTS:
- Background: glass-dark avec dégradé
- Colonnes: glass cards
- Links: hover glass effect
- Newsletter: glass input + button
- Social icons: glass buttons
- Bottom bar: glass separator
```

### 9.3 Buttons Glass
```
COMPOSANT: Button.tsx

VARIANTES GLASS:
1. glass-primary
   - bg: rgba(91, 124, 255, 0.2)
   - border: 1px solid rgba(91, 124, 255, 0.4)
   - hover: bg plus opaque
   
2. glass-white
   - bg: rgba(255, 255, 255, 0.2)
   - border: 1px solid rgba(255, 255, 255, 0.4)
   - hover: bg white 30%
   
3. glass-dark
   - bg: rgba(0, 0, 0, 0.2)
   - border: 1px solid rgba(255, 255, 255, 0.1)
   - hover: bg plus opaque
```

### 9.4 Cards Glass
```
COMPOSANT: Card.tsx

VARIANTES:
1. event-card-glass
   - image avec glass overlay
   - glass badge catégorie
   - glass date badge
   - glass prix

2. organizer-card-glass
   - avatar glass circle
   - glass info

3. contest-card-glass
   - glass progress bar
   - glass countdown
```

### 9.5 Inputs Glass
```
COMPOSANT: Input.tsx

CARACTÉRISTIQUES:
- bg: rgba(255, 255, 255, 0.8)
- border: 2px solid rgba(168, 212, 255, 0.3)
- focus: border blue + glow
- error: border red + glow
- success: border green + glow
```

---

## Phase 10: PAGES - Améliorations
### 10.1 Search Page
```
MISE À JOUR: search/page.tsx

AJOUTS:
- Filtres avancés (cf section 7.1)
- Résultats avec highlight
- Suggestions auto-complètes
- Filtre par pays
- Tri: pertinence, date, prix
```

### 10.2 Profile Page
```
MISE À JOUR: profile/page.tsx

AJOUTS:
- Section pays/région
- Préférences événements
- Événements suivis par pays
- Historique commandes
- Gestion notifications
```

### 10.3 Dashboard
```
MISE À JOUR: dashboard/page.tsx

AJOUTS:
- Stats par pays
- Événements par région
- Graphiques analytics
- Quick actions glass
```

---

## Phase 11: DECORATIONS & ANIMATIONS
### 11.1 Images Décoratives
```
SECTIONS À DECORER:
1. Hero: Particules flottantes (SVG)
2. Categories: Images de fond par catégorie
3. Stats: Icônes animées
4. Newsletter: Illustration glass
5. Footer: Formes géométriques

SOURCES IMAGES:
- unsplash.com (nature, events, people)
- Illustration catégories personalisées
- SVG icons glassmorphism
```

### 11.2 Animations
```
ANIMATIONS CSS:
1. Float: translateY oscillant
2. Pulse-glow: box-shadow pulsant
3. Shimmer: Linear gradient animé
4. Gradient-move: background position
5. Blob: Formes有机 mouvements

ANIMATIONS UI:
1. Page transitions: fade + slide
2. Card hover: scale + shadow
3. Button hover: glow effect
4. Scroll reveal: fade-in-up
5. Number count: animated counter
```

### 11.3 Backgrounds
```
STYLES:
1. Gradient mesh: Couleurs primaires
2. Grid pattern: SVG lines
3. Dot pattern: Dots密度
4. Wave separator: SVG waves
5. Glass orbs: Blurred circles
```

---

## Phase 12: PRODUCTION - Optimisations
### 12.1 Performance
```
OPTIMISATIONS:
- [ ] Images: next/image avec blur placeholder
- [ ] Lazy loading composants
- [ ] Code splitting automatique
- [ ] Prefetch pages fréquentées
- [ ] Cache API responses
- [ ] CDN images
```

### 12.2 SEO
```
AMÉLIORATIONS:
- [ ] Meta tags dynamiques par page
- [ ] Schema.org JSON-LD events
- [ ] Sitemap automatique
- [ ] Robots.txt optimisé
- [ ] Canonical URLs
- [ ] Open Graph images
```

### 12.3 Accessibilité
```
AMÉLIORATIONS:
- [ ] ARIA labels
- [ ] Focus indicators glass
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast WCAG AA
```

### 12.4 Sécurité
```
AMÉLIORATIONS:
- [ ] Headers sécurisés
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Input sanitization
- [ ] XSS prevention
```

---

## PLAN D'EXECUTION - ORDRE PRIORITAIRE

### ÉTAPE 1: Foundation (Jours 1-2)
- [ ] Supprimer pages inutiles
- [ ] Mise à jour Tailwind config
- [ ] Créer classes glass CSS
- [ ] Créer GeolocationContext
- [ ] Créer useGeolocation hook

### ÉTAPE 2: Composants Core (Jours 3-5)
- [ ] Button glass
- [ ] Card glass
- [ ] Input glass
- [ ] CountrySelector
- [ ] DateRangePicker
- [ ] PriceRangeSlider

### ÉTAPE 3: Navigation (Jours 6-7)
- [ ] Navbar glass
- [ ] Footer glass
- [ ] Mobile menu glass

### ÉTAPE 4: Pages Principales (Jours 8-12)
- [ ] Homepage avec carrousel hero
- [ ] Events list avec filtres
- [ ] Event detail enrichi
- [ ] Inscription avec pays

### ÉTAPE 5: Fonctionnalités (Jours 13-18)
- [ ] Géolocalisation complète
- [ ] Creation événement avec pays
- [ ] Dashboard enrichi
- [ ] Search avancée

### ÉTAPE 6: Polish (Jours 19-22)
- [ ] Animations
- [ ] Decorations
- [ ] Responsive
- [ ] Tests

### ÉTAPE 7: Production (Jours 23-25)
- [ ] SEO
- [ ] Performance
- [ ] Security
- [ ] Deploy

---

## FICHIERS A CRÉER
```
NOUVEAUX FICHIERS:
- hooks/useGeolocation.ts
- context/GeolocationContext.tsx
- components/CountrySelector.tsx
- components/DateRangePicker.tsx
- components/PriceRangeSlider.tsx
- components/HeroCarousel.tsx
- components/EventsMapView.tsx
- components/GlassButton.tsx
- components/GlassCard.tsx
- components/GlassInput.tsx
- components/TeaserVideo.tsx

FICHIERS À MODIFIER:
- packages/ui/tailwind.config.ts
- packages/ui/src/styles/globals.css
- apps/web/app/components/Navbar.tsx
- apps/web/app/components/Footer.tsx
- apps/web/app/page.tsx
- apps/web/app/events/page.tsx
- apps/web/app/events/[id]/page.tsx
- apps/web/app/(auth)/register/page.tsx
- apps/web/app/layout.tsx
- packages/ui/src/components/Button.tsx
- packages/ui/src/components/Card.tsx
- packages/ui/src/components/Input.tsx

FICHIERS À SUPPRIMER:
- apps/web/app/careers/page.tsx
- apps/web/app/blog/page.tsx
- apps/web/app/press/page.tsx
- apps/web/app/resources/page.tsx
- apps/web/app/affiliate/page.tsx
```

---

## DESIGN SPECIFICATIONS

### Gradients
```css
/* Primary Gradient */
.bg-gradient-primary {
  background: linear-gradient(135deg, #5B7CFF 0%, #7B61FF 50%, #A8D4FF 100%);
}

/* Glass Gradient */
.bg-gradient-glass {
  background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%);
}

/* Dark Glass */
.bg-gradient-glass-dark {
  background: linear-gradient(180deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.98) 100%);
}

/* Hero Mesh */
.bg-mesh-primary {
  background-color: #5B7CFF;
  background-image: 
    radial-gradient(at 40% 20%, hsla(230,100%,85%,1) 0px, transparent 50%),
    radial-gradient(at 80% 0%, hsla(250,100%,90%,1) 0px, transparent 50%),
    radial-gradient(at 0% 50%, hsla(220,100%,80%,1) 0px, transparent 50%),
    radial-gradient(at 80% 50%, hsla(260,100%,85%,1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(240,100%,85%,1) 0px, transparent 50%);
}
```

### Shadows
```css
/* Glass Shadow */
.shadow-glass {
  box-shadow: 0 8px 32px rgba(91, 124, 255, 0.15);
}

/* Glow Shadow */
.shadow-glow {
  box-shadow: 0 0 20px rgba(91, 124, 255, 0.3);
}

/* Float Shadow */
.shadow-float {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

### Typography
```css
/* Display Font */
.font-display {
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
}

/* Sizes */
.text-display-6xl {
  font-size: 3.75rem;
  line-height: 1.1;
  font-weight: 700;
}

/* Gradient Text */
.text-gradient {
  background: linear-gradient(135deg, #5B7CFF 0%, #7B61FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Checklist Validation

### Design
- [ ] Toutes les pages utilisent glassmorphism
- [ ] Couleurs bleues ciel dominantes
- [ ] Blanc maximisé
- [ ] Noir sur certaines sections
- [ ] Animations fluides
- [ ] Responsive mobile/tablet/desktop
- [ ] Images décoratives présentes
- [ ] Cohérence visuelle totale

### Fonctionnalités
- [ ] Géolocalisation fonctionnelle
- [ ] Filtrage par pays/region
- [ ] Inscription avec pays
- [ ] Création événement avec pays
- [ ] Hero carrousel fonctionnel
- [ ] Teaser video auto-play
- [ ] Filtres avancés événements

### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Images optimisées
- [ ] Code splitting actif

### Production
- [ ] Build sans erreurs
- [ ] Tests passent
- [ ] SEO optimisé
- [ ] Accessibilité WCAG
- [ ] Security headers

