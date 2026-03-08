# TODO - Homepage Organizers + Organizer Profile Improvements

- [ ] Update `apps/web/app/components/HomeBottomSections.tsx`
  - [ ] Improve organizer logo/avatar rendering with better fallback
  - [ ] Add share action per organizer card (no mock, real organizer profile URL)
  - [ ] Improve card CTAs (view profile + follow)
  - [ ] Keep backend-driven stats only

- [ ] Update `apps/web/app/organizers/[id]/page.tsx`
  - [ ] Add organizer share action in header
  - [ ] Improve branding/logo/avatar fallback
  - [ ] Improve social links / CTA consistency
  - [ ] Keep real backend data only

- [ ] Run targeted builds
  - [ ] `npm run build --workspace @tikeo/ui`
  - [ ] `npm run build --workspace apps/web`
