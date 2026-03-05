# Ticketing reliability & design persistence TODO

## 1) SMTP / email reliability
- [x] Remove insecure hardcoded SMTP fallbacks in `services/api-gateway/src/email/email.service.ts`
- [ ] Require explicit SMTP config and improve error logging
- [ ] Add contextual logs for ticket/order email sends

## 2) Ensure email tickets use real created tickets
- [ ] Update order/payment flows to fetch created tickets and pass full ticket payload to email service
- [ ] Include ticket ids and exact qrCode values in email payload

## 3) QR consistency across purchase/email/scanner
- [ ] Generate and embed QR image in ticket email from the same `qrCode` stored in DB
- [ ] Ensure scanner keeps validating the same exact value (no format drift)

## 4) Apply event ticket design customizations in email
- [ ] Use event ticket design fields when rendering ticket email HTML
- [ ] Respect show/hide flags (QR/seat/terms) in email rendering
- [ ] Keep robust fallback if no custom design is set

## 5) Persist advanced design fields for reuse tomorrow
- [ ] Verify schema supports advanced design fields
- [ ] Update backend update/read mapping for advanced fields if needed
- [ ] Update frontend save/load in `apps/web/app/dashboard/events/[id]/ticket-design/page.tsx`

## 6) Validation
- [ ] Run targeted checks for free and paid order flows
- [ ] Confirm ticket visible in `/tickets`
- [ ] Confirm received email contains expected customized content and matching QR
- [ ] Confirm previously saved design reloads correctly
