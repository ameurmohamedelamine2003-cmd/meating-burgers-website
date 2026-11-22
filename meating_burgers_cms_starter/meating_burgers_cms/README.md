# Meating Burgers — Editable Restaurant Website Starter

This is a first working starter for a restaurant website with an owner login and menu-management dashboard.

## Included
- Public restaurant website
- Owner login at `/login`
- Protected dashboard at `/admin`
- Add, edit, hide and delete menu items
- Supabase database integration
- Responsive layout for mobile and desktop

## Important before showing this to a real restaurant
This is a development starter, not a finished production handover. The restaurant name, address, phone, menu, prices, hours, images and brand copy are sample/demo content and must be verified and approved by the business owner. The current menu cards shown when the database is empty are illustrative demo items. The current dashboard accepts image URLs; direct image upload, gallery management, page editor, hours editor and promotions are planned enhancements.

The project uses Supabase Auth, but account creation should be performed by the developer/owner through the Supabase dashboard. Do not expose a Supabase service-role key in browser code. Use the public anon/publishable key only in `.env.local`.

## Requirements
- Node.js 20+
- A Supabase project

## Setup
1. Install Node.js from https://nodejs.org/
2. Extract this ZIP.
3. Open a terminal in the extracted folder and run:
   ```bash
   npm install
   ```
4. Create a Supabase project at https://supabase.com/
5. In Supabase, open SQL Editor, paste `supabase/schema.sql`, and run it.
6. In Supabase Authentication > Users, create the restaurant owner's user with email and password. Disable public sign-ups in Auth settings if only the restaurant owner should have access.
7. Copy `.env.example` to `.env.local`, then enter the Supabase Project URL and anon/publishable key from Project Settings > API.
8. Run:
   ```bash
   npm run dev
   ```
9. Open http://localhost:3000 and sign in at http://localhost:3000/login.

## Security note
The included SQL policies allow any authenticated user in this Supabase project to manage the menu. For a real multi-tenant product with multiple restaurant customers, add restaurant ownership IDs and role-based policies before onboarding multiple clients. For a single restaurant project, create only the owner's user and keep sign-ups disabled.

## Deploy
Deploy to Vercel or another provider that supports Next.js. Add the same two environment variables in the hosting provider's project settings. Connect the restaurant's domain after deployment. Hosting and database free tiers have limits and provider terms can change.

## Suggested next development milestone
Add secure restaurant ownership, photo uploads via Supabase Storage, restaurant settings editor, opening hours, specials/promotions, and an onboarding flow so each client receives their own independent account and website.
