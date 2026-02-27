# AuthContext Implementation Plan

## Step 1: Create AuthContext
- [x] Create AuthContext.tsx with user state, login, register, logout, token refresh
- [x] Store in apps/web/app/context/AuthContext.tsx

## Step 2: Update Providers
- [x] Wrap app with AuthProvider in providers.tsx

## Step 3: Update Navbar
- [x] Use AuthContext instead of mock data in Navbar.tsx

## Step 4: Update Login page
- [x] Use AuthContext login method in login/page.tsx

## Step 5: Update Register page
- [x] Use AuthContext register method in register/page.tsx

## Step 6: Update Profile page
- [x] Fetch user profile from API in profile/page.tsx

