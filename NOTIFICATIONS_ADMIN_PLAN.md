# Plan: Admin Notifications & Payment Management

## Information Gathered:
- Current admin payouts page: `/apps/web/app/admin/payouts/page.tsx` - has basic payout management but lacks payment history
- Current Navbar: `/apps/web/app/components/Navbar.tsx` - has notification bell icon but no "Notifications" menu item
- Current notifications service: `/services/api-gateway/src/notifications/notifications.service.ts` - has methods for creating notifications but no admin bulk send functionality
- User notifications page: `/apps/web/app/notifications/page.tsx` - already well implemented

## Plan:

### 1. Admin Payment Management Improvements
**File:** `apps/web/app/admin/payouts/page.tsx`
- Add payment history/transactions tab
- Add filters (by date range, status, organizer)
- Add export to CSV functionality
- Add detailed transaction view modal

### 2. Add "Notifications" Menu in Navbar  
**File:** `apps/web/app/components/Navbar.tsx`
- Add "Notifications" dropdown menu in the main nav
- Dropdown will contain: "Mes notifications" and "Envoyer une notification" (for admins)

### 3. Create Admin Notification Management Page
**New File:** `apps/web/app/admin/notifications/page.tsx`
- Page to send predefined notifications to users
- Select user(s) or user groups
- Choose notification template
- Customizable message
- Send via: In-app notification + Email toggle
- View sent notification history

### 4. Backend API for Admin Notification Sending
**Files to modify:**
- `services/api-gateway/src/notifications/notifications.controller.ts` - Add admin endpoints
- `services/api-gateway/src/notifications/notifications.service.ts` - Add bulk send methods
- `services/api-gateway/src/email/email.service.ts` - Ensure email sending works

**Predefined Notification Templates:**
1. 🎫 Billets - "Vos billets sont prêts"
2. 📅 Événement - "Rappel: événement à venir"
3. 💰 Paiement - "Paiement reçu"
4. ❌ Annulation - "Événement annulé"
5. ⭐ Avis - "Partagez votre expérience"
6. 🏷️ Promo - "Offre spéciale"
7. 🔔 Système - "Information importante"
8. 👤 Nouveau follower - "Nouvel abonné"
9. ✨ Recommandation - "Nous vous recommandons"

## Dependent Files to Edit:
1. `apps/web/app/components/Navbar.tsx` - Add Notifications menu
2. `apps/web/app/admin/payouts/page.tsx` - Add payment history features
3. `services/api-gateway/src/notifications/notifications.controller.ts` - Add admin endpoints
4. `services/api-gateway/src/notifications/notifications.service.ts` - Add bulk send + email methods

## New Files to Create:
1. `apps/web/app/admin/notifications/page.tsx` - Admin notification management page
2. `apps/web/app/admin/layout.tsx` - Add "Notifications" to admin nav (already exists, just add link)

## Followup Steps:
- Test the payment history functionality
- Test sending notifications to users
- Verify email notifications are sent correctly
- Test the notifications appear in user notification center

