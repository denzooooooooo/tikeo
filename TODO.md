# TODO - Fix event edit image, ticket PDF buyer details, event photo, QR reliability

- [x] 1. Fix QR reliability on tickets page
  - [x] Remove fallback to `ticket.id` for QR generation
  - [x] Show clear "QR indisponible" state when `ticket.qrCode` missing

- [x] 2. Enrich ticket PDF/email data model
  - [x] Extend `TicketData` in `services/api-gateway/src/email/email.service.ts` with buyer fields
  - [x] Extend `TicketData` with `eventCoverImage`

- [x] 3. Render buyer details + event image in PDF/email
  - [x] Add buyer section in generated PDF
  - [x] Add event image (if available) in PDF
  - [x] Add buyer info and event image in ticket email HTML

- [x] 4. Pass new fields from order flows
  - [x] Update `services/api-gateway/src/orders/orders.service.ts` (free orders flow)
  - [x] Update `services/api-gateway/src/payments/payments.service.ts` (paid orders flow)

- [x] 5. Improve event edit image UX
  - [x] Improve feedback/validation around `coverImage` in edit page

- [ ] 6. Validation
  - [ ] Run targeted checks/build for web and api-gateway
  - [ ] Fix any lint/type issues
