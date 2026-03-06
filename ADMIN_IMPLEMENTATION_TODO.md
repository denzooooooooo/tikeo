# Admin Dashboard Implementation Plan

## Phase 1: Database Schema Updates
- [ ] Add PayoutRecord table - track payouts to organizers
- [ ] Add AdminSettings table - system settings
- [ ] Add AuditLog table - admin actions logging

## Phase 2: Backend API
- [ ] Create admin module with guards
- [ ] Create admin users endpoint
- [ ] Create admin events endpoint
- [ ] Create admin tickets endpoint
- [ ] Create admin payouts endpoint (CRUCIAL - calculate commissions)
- [ ] Create admin organizers endpoint
- [ ] Create admin stats endpoint

## Phase 3: Frontend Admin Pages
- [ ] Create /admin route
- [ ] Create admin layout with sidebar
- [ ] Dashboard overview page
- [ ] Users management page
- [ ] Events management page
- [ ] Tickets management page
- [ ] Payouts/Commissions page (CRITICAL)
- [ ] Organizers management page
- [ ] Statistics page

## Key Points:
- Commission: 1% of each sale goes to admin
- Organizers get 99% after commission
- Track all payouts to organizers
- Show calculation: Gross Sales - 1% Commission = Net to Organizer

