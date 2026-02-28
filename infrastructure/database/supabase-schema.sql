-- ============================================================
-- Tikeo Platform - Schema PostgreSQL pour Supabase
-- Copiez et collez ce SQL dans Supabase > SQL Editor > New Query
-- ============================================================

-- Table: users
CREATE TABLE IF NOT EXISTS "users" (
  "id"               TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "email"            TEXT NOT NULL,
  "password"         TEXT NOT NULL,
  "firstName"        TEXT NOT NULL,
  "lastName"         TEXT NOT NULL,
  "avatar"           TEXT,
  "phone"            TEXT,
  "role"             TEXT NOT NULL DEFAULT 'USER',
  "emailVerified"    BOOLEAN NOT NULL DEFAULT FALSE,
  "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT FALSE,
  "loyaltyPoints"    INTEGER NOT NULL DEFAULT 0,
  "provider"         TEXT,
  "providerId"       TEXT,
  "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");

-- Table: organizers
CREATE TABLE IF NOT EXISTS "organizers" (
  "id"               TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"           TEXT NOT NULL,
  "companyName"      TEXT NOT NULL,
  "description"      TEXT,
  "logo"             TEXT,
  "banner"           TEXT,
  "website"          TEXT,
  "facebookUrl"      TEXT,
  "twitterUrl"       TEXT,
  "instagramUrl"     TEXT,
  "linkedinUrl"      TEXT,
  "verified"         BOOLEAN NOT NULL DEFAULT FALSE,
  "rating"           DOUBLE PRECISION NOT NULL DEFAULT 0,
  "ratingCount"      INTEGER NOT NULL DEFAULT 0,
  "totalEvents"      INTEGER NOT NULL DEFAULT 0,
  "totalTicketsSold" INTEGER NOT NULL DEFAULT 0,
  "followersCount"   INTEGER NOT NULL DEFAULT 0,
  "stripeAccountId"  TEXT,
  "stripeConnected"  BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "organizers_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "organizers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "organizers_userId_key" ON "organizers"("userId");

-- Table: events
CREATE TABLE IF NOT EXISTS "events" (
  "id"               TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "title"            TEXT NOT NULL,
  "slug"             TEXT NOT NULL,
  "description"      TEXT NOT NULL,
  "shortDescription" TEXT,
  "coverImage"       TEXT NOT NULL,
  "teaserVideo"      TEXT,
  "videoUrl"         TEXT,
  "category"         TEXT NOT NULL,
  "tags"             TEXT,
  "organizerId"      TEXT NOT NULL,
  "venueName"        TEXT NOT NULL,
  "venueAddress"     TEXT NOT NULL,
  "venueCity"        TEXT NOT NULL,
  "venueCountry"     TEXT NOT NULL,
  "venuePostalCode"  TEXT NOT NULL,
  "venueLatitude"    DOUBLE PRECISION,
  "venueLongitude"   DOUBLE PRECISION,
  "startDate"        TIMESTAMPTZ NOT NULL,
  "endDate"          TIMESTAMPTZ NOT NULL,
  "timezone"         TEXT NOT NULL DEFAULT 'Europe/Paris',
  "capacity"         INTEGER NOT NULL,
  "ticketsSold"      INTEGER NOT NULL DEFAULT 0,
  "ticketsAvailable" INTEGER NOT NULL,
  "status"           TEXT NOT NULL DEFAULT 'DRAFT',
  "visibility"       TEXT NOT NULL DEFAULT 'PUBLIC',
  "currency"         TEXT NOT NULL DEFAULT 'EUR',
  "minPrice"         DOUBLE PRECISION NOT NULL,
  "maxPrice"         DOUBLE PRECISION NOT NULL,
  "dynamicPricing"   BOOLEAN NOT NULL DEFAULT FALSE,
  "isFeatured"       BOOLEAN NOT NULL DEFAULT FALSE,
  "isOnline"         BOOLEAN NOT NULL DEFAULT FALSE,
  "streamingUrl"     TEXT,
  "views"            INTEGER NOT NULL DEFAULT 0,
  "shares"           INTEGER NOT NULL DEFAULT 0,
  "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "publishedAt"      TIMESTAMPTZ,
  CONSTRAINT "events_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "organizers"("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "events_slug_key" ON "events"("slug");
CREATE INDEX IF NOT EXISTS "events_slug_idx" ON "events"("slug");
CREATE INDEX IF NOT EXISTS "events_organizerId_idx" ON "events"("organizerId");
CREATE INDEX IF NOT EXISTS "events_category_idx" ON "events"("category");
CREATE INDEX IF NOT EXISTS "events_status_idx" ON "events"("status");
CREATE INDEX IF NOT EXISTS "events_startDate_idx" ON "events"("startDate");

-- Table: event_images
CREATE TABLE IF NOT EXISTS "event_images" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "eventId"   TEXT NOT NULL,
  "url"       TEXT NOT NULL,
  "alt"       TEXT,
  "order"     INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "event_images_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "event_images_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE
);

-- Table: event_likes
CREATE TABLE IF NOT EXISTS "event_likes" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"    TEXT NOT NULL,
  "eventId"   TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "event_likes_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "event_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "event_likes_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "event_likes_userId_eventId_key" ON "event_likes"("userId", "eventId");
CREATE INDEX IF NOT EXISTS "event_likes_eventId_idx" ON "event_likes"("eventId");

-- Table: user_follows
CREATE TABLE IF NOT EXISTS "user_follows" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "followerId"  TEXT NOT NULL,
  "followingId" TEXT NOT NULL,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "user_follows_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "user_follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "user_follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "user_follows_followerId_followingId_key" ON "user_follows"("followerId", "followingId");
CREATE INDEX IF NOT EXISTS "user_follows_followingId_idx" ON "user_follows"("followingId");

-- Table: organizer_subscriptions
CREATE TABLE IF NOT EXISTS "organizer_subscriptions" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"      TEXT NOT NULL,
  "organizerId" TEXT NOT NULL,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "organizer_subscriptions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "organizer_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "organizer_subscriptions_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "organizers"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "organizer_subscriptions_userId_organizerId_key" ON "organizer_subscriptions"("userId", "organizerId");
CREATE INDEX IF NOT EXISTS "organizer_subscriptions_organizerId_idx" ON "organizer_subscriptions"("organizerId");

-- Table: event_reviews
CREATE TABLE IF NOT EXISTS "event_reviews" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "eventId"   TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "rating"    INTEGER NOT NULL,
  "title"     TEXT,
  "content"   TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "event_reviews_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "event_reviews_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE,
  CONSTRAINT "event_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "event_reviews_userId_eventId_key" ON "event_reviews"("userId", "eventId");
CREATE INDEX IF NOT EXISTS "event_reviews_eventId_idx" ON "event_reviews"("eventId");

-- Table: organizer_reviews
CREATE TABLE IF NOT EXISTS "organizer_reviews" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "organizerId" TEXT NOT NULL,
  "userId"      TEXT NOT NULL,
  "rating"      INTEGER NOT NULL,
  "title"       TEXT,
  "content"     TEXT,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "organizer_reviews_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "organizer_reviews_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "organizers"("id") ON DELETE CASCADE,
  CONSTRAINT "organizer_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "organizer_reviews_userId_organizerId_key" ON "organizer_reviews"("userId", "organizerId");
CREATE INDEX IF NOT EXISTS "organizer_reviews_organizerId_idx" ON "organizer_reviews"("organizerId");

-- Table: written_reviews
CREATE TABLE IF NOT EXISTS "written_reviews" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"    TEXT NOT NULL,
  "eventId"   TEXT,
  "rating"    INTEGER NOT NULL,
  "content"   TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "written_reviews_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "written_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "written_reviews_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL
);

-- Table: promo_codes
CREATE TABLE IF NOT EXISTS "promo_codes" (
  "id"               TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "code"             TEXT NOT NULL,
  "description"      TEXT,
  "discountType"     TEXT NOT NULL,
  "discountValue"    DOUBLE PRECISION NOT NULL,
  "minPurchase"      DOUBLE PRECISION,
  "maxUses"          INTEGER,
  "usedCount"        INTEGER NOT NULL DEFAULT 0,
  "validFrom"        TIMESTAMPTZ NOT NULL,
  "validUntil"       TIMESTAMPTZ NOT NULL,
  "isActive"         BOOLEAN NOT NULL DEFAULT TRUE,
  "applicableEvents" TEXT,
  "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "promo_codes_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "promo_codes_code_key" ON "promo_codes"("code");
CREATE INDEX IF NOT EXISTS "promo_codes_code_idx" ON "promo_codes"("code");

-- Table: ticket_types
CREATE TABLE IF NOT EXISTS "ticket_types" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "eventId"     TEXT NOT NULL,
  "name"        TEXT NOT NULL,
  "description" TEXT,
  "price"       DOUBLE PRECISION NOT NULL,
  "quantity"    INTEGER NOT NULL,
  "sold"        INTEGER NOT NULL DEFAULT 0,
  "available"   INTEGER NOT NULL,
  "salesStart"  TIMESTAMPTZ NOT NULL,
  "salesEnd"    TIMESTAMPTZ NOT NULL,
  "minPerOrder" INTEGER NOT NULL DEFAULT 1,
  "maxPerOrder" INTEGER NOT NULL DEFAULT 10,
  "isActive"    BOOLEAN NOT NULL DEFAULT TRUE,
  "benefits"    TEXT,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "ticket_types_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ticket_types_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "ticket_types_eventId_idx" ON "ticket_types"("eventId");

-- Table: orders
CREATE TABLE IF NOT EXISTS "orders" (
  "id"              TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"          TEXT NOT NULL,
  "eventId"         TEXT NOT NULL,
  "subtotal"        DOUBLE PRECISION NOT NULL,
  "fees"            DOUBLE PRECISION NOT NULL,
  "taxes"           DOUBLE PRECISION NOT NULL,
  "discount"        DOUBLE PRECISION NOT NULL DEFAULT 0,
  "promoCodeUsed"   TEXT,
  "total"           DOUBLE PRECISION NOT NULL,
  "currency"        TEXT NOT NULL DEFAULT 'EUR',
  "status"          TEXT NOT NULL DEFAULT 'PENDING',
  "paymentMethod"   TEXT NOT NULL,
  "paymentIntentId" TEXT,
  "billingAddress"  TEXT,
  "billingName"     TEXT,
  "invoiceUrl"      TEXT,
  "invoiceNumber"   TEXT,
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "orders_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id"),
  CONSTRAINT "orders_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id")
);
CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");
CREATE INDEX IF NOT EXISTS "orders_eventId_idx" ON "orders"("eventId");
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");

-- Table: tickets
CREATE TABLE IF NOT EXISTS "tickets" (
  "id"           TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "eventId"      TEXT NOT NULL,
  "userId"       TEXT NOT NULL,
  "ticketTypeId" TEXT NOT NULL,
  "orderId"      TEXT NOT NULL,
  "qrCode"       TEXT NOT NULL,
  "nfcCode"      TEXT,
  "status"       TEXT NOT NULL DEFAULT 'VALID',
  "price"        DOUBLE PRECISION NOT NULL,
  "fees"         DOUBLE PRECISION NOT NULL,
  "total"        DOUBLE PRECISION NOT NULL,
  "purchaseDate" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "scannedAt"    TIMESTAMPTZ,
  "scannedBy"    TEXT,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "tickets_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "tickets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id"),
  CONSTRAINT "tickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id"),
  CONSTRAINT "tickets_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "ticket_types"("id"),
  CONSTRAINT "tickets_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "tickets_qrCode_key" ON "tickets"("qrCode");
CREATE UNIQUE INDEX IF NOT EXISTS "tickets_nfcCode_key" ON "tickets"("nfcCode");
CREATE INDEX IF NOT EXISTS "tickets_eventId_idx" ON "tickets"("eventId");
CREATE INDEX IF NOT EXISTS "tickets_userId_idx" ON "tickets"("userId");
CREATE INDEX IF NOT EXISTS "tickets_orderId_idx" ON "tickets"("orderId");
CREATE INDEX IF NOT EXISTS "tickets_qrCode_idx" ON "tickets"("qrCode");

-- Table: order_items
CREATE TABLE IF NOT EXISTS "order_items" (
  "id"           TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "orderId"      TEXT NOT NULL,
  "ticketTypeId" TEXT NOT NULL,
  "quantity"     INTEGER NOT NULL,
  "price"        DOUBLE PRECISION NOT NULL,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "order_items_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE,
  CONSTRAINT "order_items_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "ticket_types"("id")
);
CREATE INDEX IF NOT EXISTS "order_items_orderId_idx" ON "order_items"("orderId");

-- Table: notifications
CREATE TABLE IF NOT EXISTS "notifications" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"    TEXT NOT NULL,
  "type"      TEXT NOT NULL,
  "title"     TEXT NOT NULL,
  "message"   TEXT NOT NULL,
  "data"      TEXT,
  "read"      BOOLEAN NOT NULL DEFAULT FALSE,
  "readAt"    TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "notifications_userId_idx" ON "notifications"("userId");
CREATE INDEX IF NOT EXISTS "notifications_read_idx" ON "notifications"("read");

-- Table: activities
CREATE TABLE IF NOT EXISTS "activities" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"    TEXT NOT NULL,
  "type"      TEXT NOT NULL,
  "data"      TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "activities_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "activities_userId_idx" ON "activities"("userId");
CREATE INDEX IF NOT EXISTS "activities_createdAt_idx" ON "activities"("createdAt");

-- Table: contests
CREATE TABLE IF NOT EXISTS "contests" (
  "id"             TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "title"          TEXT NOT NULL,
  "slug"           TEXT NOT NULL,
  "description"    TEXT,
  "coverImage"     TEXT,
  "category"       TEXT NOT NULL,
  "status"         TEXT NOT NULL DEFAULT 'DRAFT',
  "organizerId"    TEXT NOT NULL,
  "startDate"      TIMESTAMPTZ NOT NULL,
  "endDate"        TIMESTAMPTZ NOT NULL,
  "maxContestants" INTEGER,
  "votesPerUser"   INTEGER NOT NULL DEFAULT 1,
  "isPublicResults" BOOLEAN NOT NULL DEFAULT TRUE,
  "isFeatured"     BOOLEAN NOT NULL DEFAULT FALSE,
  "prize"          TEXT,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "contests_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "contests_slug_key" ON "contests"("slug");
CREATE INDEX IF NOT EXISTS "contests_slug_idx" ON "contests"("slug");
CREATE INDEX IF NOT EXISTS "contests_status_idx" ON "contests"("status");

-- Table: contestants
CREATE TABLE IF NOT EXISTS "contestants" (
  "id"         TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "contestId"  TEXT NOT NULL,
  "name"       TEXT NOT NULL,
  "bio"        TEXT,
  "imageUrl"   TEXT,
  "order"      INTEGER NOT NULL DEFAULT 0,
  "votesCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "contestants_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "contestants_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "contestants_contestId_idx" ON "contestants"("contestId");

-- Table: contest_votes
CREATE TABLE IF NOT EXISTS "contest_votes" (
  "id"           TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "contestId"    TEXT NOT NULL,
  "contestantId" TEXT NOT NULL,
  "userId"       TEXT NOT NULL,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "contest_votes_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "contest_votes_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE CASCADE,
  CONSTRAINT "contest_votes_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "contestants"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "contest_votes_contestId_userId_contestantId_key" ON "contest_votes"("contestId", "userId", "contestantId");

-- Table: payments
CREATE TABLE IF NOT EXISTS "payments" (
  "id"                    TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "orderId"               TEXT NOT NULL,
  "amount"                DOUBLE PRECISION NOT NULL,
  "currency"              TEXT NOT NULL DEFAULT 'EUR',
  "status"                TEXT NOT NULL DEFAULT 'PENDING',
  "stripePaymentIntentId" TEXT,
  "paidAt"                TIMESTAMPTZ,
  "refundedAt"            TIMESTAMPTZ,
  "createdAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "payments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "payments_orderId_key" ON "payments"("orderId");
CREATE UNIQUE INDEX IF NOT EXISTS "payments_stripePaymentIntentId_key" ON "payments"("stripePaymentIntentId");
CREATE INDEX IF NOT EXISTS "payments_orderId_idx" ON "payments"("orderId");

-- ============================================================
-- Table: event_likes
-- ============================================================
CREATE TABLE IF NOT EXISTS "event_likes" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"    TEXT NOT NULL,
  "eventId"   TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "event_likes_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "event_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "event_likes_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE,
  CONSTRAINT "event_likes_userId_eventId_key" UNIQUE ("userId", "eventId")
);
CREATE INDEX IF NOT EXISTS "event_likes_userId_idx" ON "event_likes"("userId");
CREATE INDEX IF NOT EXISTS "event_likes_eventId_idx" ON "event_likes"("eventId");

-- ============================================================
-- Table: organizer_subscriptions
-- ============================================================
CREATE TABLE IF NOT EXISTS "organizer_subscriptions" (
  "id"           TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "userId"       TEXT NOT NULL,
  "organizerId"  TEXT NOT NULL,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "organizer_subscriptions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "organizer_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "organizer_subscriptions_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "organizers"("id") ON DELETE CASCADE,
  CONSTRAINT "organizer_subscriptions_userId_organizerId_key" UNIQUE ("userId", "organizerId")
);
CREATE INDEX IF NOT EXISTS "organizer_subscriptions_userId_idx" ON "organizer_subscriptions"("userId");
CREATE INDEX IF NOT EXISTS "organizer_subscriptions_organizerId_idx" ON "organizer_subscriptions"("organizerId");

-- ============================================================
-- Table: user_follows
-- ============================================================
CREATE TABLE IF NOT EXISTS "user_follows" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
  "followerId"  TEXT NOT NULL,
  "followingId" TEXT NOT NULL,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "user_follows_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "user_follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "user_follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "user_follows_followerId_followingId_key" UNIQUE ("followerId", "followingId")
);
CREATE INDEX IF NOT EXISTS "user_follows_followerId_idx" ON "user_follows"("followerId");
CREATE INDEX IF NOT EXISTS "user_follows_followingId_idx" ON "user_follows"("followingId");

-- ============================================================
-- Supabase Storage: bucket event-images (public)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- RLS Policy: allow public read on event-images
CREATE POLICY IF NOT EXISTS "Public read event-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');

-- RLS Policy: allow authenticated upload to event-images
CREATE POLICY IF NOT EXISTS "Auth upload event-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'event-images' AND auth.role() = 'authenticated');

-- ============================================================
-- Prisma migrations table (required by Prisma)
-- ============================================================
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id"                  TEXT NOT NULL,
  "checksum"            TEXT NOT NULL,
  "finished_at"         TIMESTAMPTZ,
  "migration_name"      TEXT NOT NULL,
  "logs"                TEXT,
  "rolled_back_at"      TIMESTAMPTZ,
  "started_at"          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

-- ============================================================
-- Trigger pour auto-update updatedAt
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updatedAt
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','organizers','events','event_reviews','organizer_reviews','promo_codes','ticket_types','orders','tickets','contests','contestants','payments']
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%s_updated_at ON "%s";
      CREATE TRIGGER update_%s_updated_at
        BEFORE UPDATE ON "%s"
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END;
$$;

-- ============================================================
-- FIN DU SCRIPT - Toutes les tables Tikeo sont créées !
-- ============================================================
