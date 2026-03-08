# Reviews System Implementation Plan

## Information Gathered

### Current State:
1. **ReviewForm** (`packages/ui/src/components/ReviewForm.tsx`):
   - Uses `comment` field but API expects `title` and `content`
   - Sends POST to `/reviews/events/:eventId` with wrong payload

2. **EventReviews** (`packages/ui/src/components/EventReviews.tsx`):
   - Already exists with demo data fallback
   - Has basic pagination state but no pagination UI
   - NOT exported from `@tikeo/ui` package

3. **Event Page** (`apps/web/app/events/[id]/page.tsx`):
   - Shows static review summary (averageRating, totalReviews)
   - Uses `ReviewForm` component
   - Does NOT display actual reviews list

4. **Backend API**:
   - Expects `{ rating, title?, content? }`
   - Requires user to have a valid ticket for the event

## Plan

### Step 1: Fix ReviewForm Component ✅ DONE
- Changed form to use `title` and `content` instead of `comment`
- Match the API's expected payload

### Step 2: Update EventReviews Component ✅ DONE
- Already existed with proper functionality
- Has pagination state and rating distribution

### Step 3: Export EventReviews from UI package ✅ DONE
- Added export to `packages/ui/src/index.ts`

### Step 4: Integrate EventReviews into Event Page ✅ DONE
- Replaced static review summary with full `EventReviews` component
- Shows reviews list with form on event page

## Files Edited:
1. ✅ `packages/ui/src/components/ReviewForm.tsx` - Fixed API payload
2. ✅ `packages/ui/src/components/EventReviews.tsx` - Already functional
3. ✅ `packages/ui/src/index.ts` - Added export
4. ✅ `apps/web/app/events/[id]/page.tsx` - Integrated EventReviews

## Status: COMPLETED ✅

