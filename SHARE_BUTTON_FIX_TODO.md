# Share Button Fix Plan

## Problem
The share button on the event detail page (`apps/web/app/events/[id]/page.tsx`) is not working because:
- The page uses a plain `<button>` element without any `onClick` handler
- There's a properly implemented `ShareButton` component at `apps/web/app/events/[id]/ShareButton.tsx` that is NOT being used

## Solution
1. Import `ShareButton` component in `page.tsx`
2. Replace the plain `<button>` with the `<ShareButton>` component, passing:
   - `title={event.title}`
   - `eventId={params.id}`

## Files to Edit
- `apps/web/app/events/[id]/page.tsx` - Add import and replace button with ShareButton component

## Follow-up Steps
- No installation required
- This is a frontend fix only

