# Fixes & Improvements TODO

## Steps

- [x] 1. Fix auth DTOs - add ForgotPasswordDto, ResetPasswordDto to dto/index.ts
- [x] 2. Fix auth.service.ts - add forgotPassword() and resetPassword() using Redis + Email
- [x] 3. Fix auth.controller.ts - add forgot-password and reset-password endpoints
- [x] 4. Fix auth.module.ts - inject RedisModule + EmailModule
- [x] 5. Fix events.service.ts - handle ticketTypes in update()
- [x] 6. Create reset-password page (apps/web/app/(auth)/reset-password/page.tsx)
- [x] 7. Fix favorites page - convert to client component, fetch from API
- [x] 8. Fix LikeButton - fetch real like status on mount
- [x] 9. Fix tickets page - correct token key (auth_tokens)
- [x] 10. Fix checkout page - connect payment button to API (order + payment intent flow)

## All steps completed ✅
