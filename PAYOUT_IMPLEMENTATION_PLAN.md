# Payout Implementation Plan

## Current State Analysis

### What's Already Working:
1. **Customer Payments** - Stripe payment integration works
2. **Order Confirmation Emails** - Customers receive emails after purchase
3. **Ticket Emails** - Customers receive their tickets via email
4. **Admin Dashboard UI** - Shows organizers with revenue/commission data

### What's Missing:
1. **Stripe Connect Integration** - Currently mock only
2. **Payout Processing** - No real payout functionality
3. **Organizer Payout Emails** - No notification when paid
4. **Bank/Mobile Money Configuration UI** - Not fully implemented

---

## Implementation Plan

### Phase 1: Backend - Stripe Connect Integration

#### 1.1 Update Stripe Connect Service
- **File**: `services/api-gateway/src/payments/stripe-connect.service.ts`
- **Changes**:
  - Integrate real Stripe SDK for Connect accounts
  - Implement account creation with Stripe
  - Add onboarding link generation
  - Add payout creation functionality
  - Add payout status tracking

#### 1.2 Add Payout API Endpoints
- **File**: `services/api-gateway/src/payments/payments.controller.ts`
- **New Endpoints**:
  - `POST /admin/organizers/:id/payout` - Process a payout
  - `GET /admin/organizers/:id/payout-history` - Get payout history

#### 1.3 Add Payout Service Methods
- **File**: `services/api-gateway/src/payments/payments.service.ts`
- **New Methods**:
  - `createPayout()` - Create and process a payout
  - `getPayoutHistory()` - Get payout history for organizer

### Phase 2: Email Notifications

#### 2.1 Payout Notification Emails
- **File**: `services/api-gateway/src/email/email.service.ts`
- **New Methods**:
  - `sendPayoutNotificationEmail()` - Notify organizer of payout
  - Include amount, date, method in email

### Phase 3: Frontend Updates

#### 3.1 Update Admin Payouts Page
- **File**: `apps/web/app/admin/payouts/page.tsx`
- **Changes**:
  - Add "Process Payout" button
  - Add payout modal with amount and method selection
  - Show real data from API
  - Add payout history section

---

## API Endpoints to Implement

### Admin Payout Endpoints

```typescript
// Process a payout to organizer
POST /api/v1/admin/organizers/:id/payout
Body: {
  amount: number;      // Amount to payout (must be <= pendingPayout)
  method: 'BANK_TRANSFER' | 'MOBILE_MONEY';
  note?: string;        // Optional note
}

// Get payout history for organizer
GET /api/v1/admin/organizers/:id/payouts

// Get all payout requests
GET /api/v1/admin/payouts
```

### Stripe Connect Endpoints (for organizers)

```typescript
// Create Stripe Connect account
POST /api/v1/organizers/connect/create-account

// Get onboarding link
GET /api/v1/organizers/connect/onboarding-link

// Check connection status
GET /api/v1/organizers/connect/status
```

---

## Files to Modify

### Backend:
1. `services/api-gateway/src/payments/stripe-connect.service.ts`
2. `services/api-gateway/src/payments/payments.service.ts`
3. `services/api-gateway/src/payments/payments.controller.ts`
4. `services/api-gateway/src/email/email.service.ts`
5. `services/api-gateway/src/admin/admin.controller.ts`
6. `services/api-gateway/src/admin/admin.service.ts`

### Frontend:
1. `apps/web/app/admin/payouts/page.tsx`

---

## Database Schema (if needed)

```prisma
model Payout {
  id              String   @id @default(cuid())
  organizerId    String
  amount         Float
  commission     Float
  netAmount      Float
  currency       String   @default("XOF")
  method         String   // BANK_TRANSFER, MOBILE_MONEY
  status         String   // PENDING, PROCESSING, COMPLETED, FAILED
  stripePayoutId String?
  processedAt    DateTime?
  createdAt      DateTime @default(now())
  
  organizer      Organizer @relation(fields: [organizerId], references: [id])
}
```

---

## Testing

1. **Connect Stripe Account**: Create organizer with Stripe Connect
2. **Make a Sale**: Purchase tickets for organizer's event
3. **Process Payout**: Use admin to send payout
4. **Verify Email**: Check organizer receives payout notification
5. **Verify Bank**: Check Stripe dashboard for payout

---

## Current Workaround (Demo Mode)

For now, you can simulate payouts by:
1. Recording payouts manually in database
2. Sending manual emails to organizers
3. Processing via Stripe dashboard directly

